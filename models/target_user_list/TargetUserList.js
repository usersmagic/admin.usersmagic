const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const sendMail = require('../../utils/sendMail');

const Schema = mongoose.Schema;

const TargetUserListSchema = new Schema({
  target_id: {
    // Id of the Target of the parent element
    type: mongoose.Types.ObjectId,
    required: true
  },
  type: {
    // Type of the user list. Allowed values: answered, valid
    type: String,
    required: true
  },
  user_list: {
    // List of ids of users belonging to this target under the type
    type: Array,
    default: [],
    maxlength: 1000 // Each document has maximum of 1000 elements
  },
  submition_limit: {
    // Submition limit of the Target. When target changes, update all of its chilren
    type: Number,
    default: 0
  }
});

TargetUserListSchema.statics.createTargetUserList = function (data, callback) {
  // Create a new TargetUserList with the given data, initalize an empty user_list
  // Return its id or an error, if it exists

  if (!data || !data.target_id || !validator.isMongoId(data.target_id.toString()) || !data.type || !['answered', 'valid'].includes(data.type))
    return callback('bad_request');

  const TargetUserList = this;

  const newTargetUserListData = {
    target_id: mongoose.Types.ObjectId(data.target_id.toString()),
    submition_limit: data.submition_limit || 0,
    type: data.type,
    user_list: []
  };

  const newTargetUserList = new TargetUserList(newTargetUserListData);

  newTargetUserList.save((err, target_user_list) => {
    if (err) return callback('database_error');

    TargetUserList.collection
      .createIndex({
        target_id: 1,
        type: 1
      })
      .then(() => {
        TargetUserList.collection
          .createIndex({
            user_list: 1
          })
          .then(() => callback(null, target_user_list._id.toString()))
          .catch(err => callback('indexing_error'));
      })
      .catch(err => callback('indexing_error'));
  });
};

TargetUserListSchema.statics.findLatestTargetUserList = function (target_id, type, callback) {
  // Find the latest TargetUserList document with the given target_id and type
  // Return the found TargetUserList or an error if it exists

  if (!target_id || !validator.isMongoId(target_id.toString()) || !type || !['answered', 'valid'].includes(type))
    return callback('bad_request');

  const TargetUserList = this;

  TargetUserList
    .find({
      target_id: mongoose.Types.ObjectId(target_id.toString()),
      type: type.toString()
    })
    .sort({ // Find the latest based on id 
      _id: -1
    })
    .limit(1) // Find only one document
    .then(target_user_list => callback(null, target_user_list && target_user_list.length ? target_user_list[0] : null))
    .catch(err => callback('database_error'));
};

TargetUserListSchema.statics.getTargetUserListFilter = function (target_id, callback) {
  // Create and return a filter to select users not in any TargetUserList, or return an error if it exists

  if (!target_id || !validator.isMongoId(target_id.toString()))
    return callback('bad_request');

  const TargetUserList = this;

  TargetUserList.find({
    target_id: mongoose.Types.ObjectId(target_id)
  }, (err, target_user_lists) => {
    if (err) return callback('database_error');
    
    target_user_lists = target_user_lists.filter(list => list.user_list.length > 0)

    if (!target_user_lists.length)
      return callback(null);

    async.timesSeries(
      target_user_lists.length,
      (time, next) => {
        if (!target_user_lists[time].user_list || !Array.isArray(target_user_lists[time].user_list))
          return next('unknown_error');
        return next(null, { _id: { $nin: target_user_lists[time].user_list } });
      },
      (err, list) => {
        if (err) return callback(err);

        return callback(null, { $and: list });
      }
    );
  });
};

TargetUserListSchema.statics.updateTargetUserList = function (target_id, user_list, submition_limit, callback) {
  // Find the latest TargetUserList, update its user_list and create a new one if necessary
  // Return an error if it exists

  if (!target_id || !validator.isMongoId(target_id.toString()) || !user_list || !Array.isArray(user_list))
    return callback('bad_request');

  const TargetUserList = this;
  const maxUserListLength = 999;

  TargetUserList.findLatestTargetUserList(target_id, 'valid', (err, target_user_list) => {
    if (err) return callback(err);

    if (target_user_list) {
      async.timesSeries(
        Math.min(user_list.length, maxUserListLength - target_user_list.user_list.length),
        (time, next) => {
          const user = user_list[time];

          TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(target_user_list._id.toString()), {$push: {
            user_list: user._id.toString()
          }}, err => {
            if (err) return next('database_error');

            sendMail({
              template: user.country == 'tr' ? 'new_paid_survey_tr' : 'new_paid_survey_en',
              name: user.name || user.email,
              to: user.email,
            }, err => {
              if (err) console.log(err);

              return next(null);
            });
          });
        },
        err => {
          if (err) return callback(err);
  
          if (user_list.length <= maxUserListLength - target_user_list.user_list.length)
            return callback(null);

          TargetUserList.createTargetUserList({
            target_id,
            submition_limit,
            type: 'valid',
          }, (err, new_target_user_list) => {
            if (err) return callback(err);

            async.timesSeries(
              user_list.length - (maxUserListLength - target_user_list.user_list.length),
              (time, next) => {
                time += target_user_list.user_list.length;
                const user = user_list[time];

                TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(new_target_user_list._id.toString()), {$push: {
                  user_list: user._id.toString()
                }}, err => {
                  if (err) return next('database_error');

                  sendMail({
                    template: user.country == 'tr' ? 'new_paid_survey_tr' : 'new_paid_survey_en',
                    name: user.name || user.email,
                    to: user.email,
                  }, err => {
                    if (err) console.log(err);

                    return next(null);
                  });
                });
              },
              err => {
                if (err) return callback(err);

                return callback(null);
              }
            );
          });
        }
      );
    } else {
      TargetUserList.createTargetUserList({
        target_id,
        submition_limit,
        type: 'valid',
      }, (err, new_target_user_list) => {
        if (err) return callback(err);

        async.timesSeries(
          user_list.length,
          (time, next) => {
            TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(new_target_user_list._id.toString()), {$push: {
              user_list: user_list[time]._id.toString()
            }}, err => next(err ? 'database_error' : null));
          },
          err => {
            if (err) return callback(err);

            return callback(null);
          }
        );
      });
    };
  });
};

TargetUserListSchema.statics.updateEachTargetUserListSubmitionLimit = function (target_id, submition_limit, callback) {
  // Find all TargetUserList with the given id, update their submition_limit
  // Return an error if it exists

  if (!target_id || !validator.isMongoId(target_id.toString()) || !Number.isInteger(submition_limit))
    return callback('bad_request');

  const TargetUserList = this;

  TargetUserList
    .find({
      target_id: mongoose.Types.ObjectId(target_id.toString()),
      type: 'valid'
    })
    .then(target_user_lists => {
      async.timesSeries(
        target_user_lists.length,
        (time, next) => {
          TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(target_user_lists[time]._id.toString()), {$set: {
            submition_limit
          }}, err => next((err ? 'database_error' : null)));
        },
        err => callback(err)
      );
    })
    .catch(err => callback('database_error'));
};

TargetUserListSchema.statics.addUserToAnswered = function (user_id, target_id, callback) {
  // Add user to the latest 'answered' type TargetUserList of the Target
  // Return an error if it exits

  if (!user_id || !validator.isMongoId(user_id.toString()) || !target_id || !validator.isMongoId(target_id.toString()))
    return callback('bad_request');

  const TargetUserList = this;

  TargetUserList.findLatestTargetUserList(target_id, 'answered', (err, target_user_list) => {
    if (err) return callback(err);

    if (target_user_list && target_user_list.user_list.length < 1000) {
      TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(target_user_list._id.toString()), {$push: {
        user_list: user_id.toString()
      }}, err => callback(err));
    } else {
      TargetUserList.createTargetUserList({
        target_id,
        type: 'answered'
      }, (err, new_id) => {
        if (err) return callback(err);

        TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(new_id.toString()), {$push: {
          user_list: user_id.toString()
        }}, err => callback(err));
      });
    };
  });
};

TargetUserListSchema.statics.addUserToValid = function (user_id, target_id, callback) {
  // Add user to the latest 'valid' type TargetUserList of the Target
  // Return an error if it exits

  if (!user_id || !validator.isMongoId(user_id.toString()) || !target_id || !validator.isMongoId(target_id.toString()))
    return callback('bad_request');

  const TargetUserList = this;

  TargetUserList.findLatestTargetUserList(target_id, 'valid', (err, target_user_list) => {
    if (err) return callback(err);

    if (target_user_list && target_user_list.user_list.length < 1000) {
      TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(target_user_list._id.toString()), {$push: {
        user_list: user_id.toString()
      }}, err => callback(err));
    } else {
      TargetUserList.createTargetUserList({
        target_id,
        type: 'valid',
        submition_limit: target_user_list.submition_limit
      }, (err, new_id) => {
        if (err) return callback(err);

        TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(new_id.toString()), {$push: {
          user_list: user_id.toString()
        }}, err => callback(err));
      });
    };
  });
};

TargetUserListSchema.statics.removeUser = function (user_id, target_id, callback) {
  // Remove user from any TargetUserList find under the Target
  // Return an error if it exits
  //  Write loop code to prevent any duplication errors

  if (!user_id || !validator.isMongoId(user_id.toString()) || !target_id || !validator.isMongoId(target_id.toString()))
    return callback('bad_request');

  const TargetUserList = this;

  TargetUserList.find({
    target_id: mongoose.Types.ObjectId(target_id.toString()),
    user_list: user_id.toString()
  }, (err, target_user_lists) => {
    if (err) return callback('database_error');

    async.timesSeries(
      target_user_lists.length,
      (time, next) => {
        TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(target_user_lists[time]._id.toString()), {$pull: {
          user_list: user_id.toString()
        }}, err => next((err ? 'database_error' : null)));
      },
      err => callback(err)
    );
  });
};

TargetUserListSchema.statics.checkIfUserCanJoin = function (user_id, target_id, callback) {
  // Check if the given User can join the given Target.
  // Return true or false, can or cannot join, respectively

  if (!user_id || !validator.isMongoId(user_id.toString()) || !target_id || !validator.isMongoId(target_id.toString()))
    return callback('bad_request');

  const TargetUserList = this;

  TargetUserList.findOne({
    target_id: mongoose.Types.ObjectId(target_id.toString()),
    type: 'valid',
    user_list: user_id.toString(),
    submition_limit: { $gt: 0 }
  }, (err, target_user_list) => {
    if (err || !target_user_list)
      return callback(false);
    
    TargetUserList.findOne({ // Do not allow to rejoin
      target_id: mongoose.Types.ObjectId(target_id.toString()),
      type: 'answered',
      user_list: user_id.toString()
    }, (err, target_user_list) => {
      if (err || target_user_list) // If this TargetUserList exists
        return callback(false);
      
      return callback(true);
    });
  });
};

module.exports = mongoose.model('TargetUserList', TargetUserListSchema);
