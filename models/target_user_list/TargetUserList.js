const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

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
        return { _id: { $nin: target_user_lists[time].user_list } };
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
          TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(target_user_list._id.toString()), {$push: {
            user_list: user_list[time]._id.toString()
          }}, err => next(err ? 'database_error' : null));
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

module.exports = mongoose.model('TargetUserList', TargetUserListSchema);
