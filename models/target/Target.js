const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const filterArrayToObject = require('./functions/filterArrayToObject');
const filterObjectToArray = require('./functions/filterObjectToArray');
const filtersArrayToSearchQuery = require('./functions/filtersArrayToSearchQuery');
const getTarget = require('./functions/getTarget');

const Company = require('../company/Company');
const Country = require('../country/Country');
const Project = require('../project/Project');
const TargetUserList = require('../target_user_list/TargetUserList');
const User = require('../user/User');

const Schema = mongoose.Schema;

const TargetSchema = new Schema({
  project_id: {
    // The id of the Project the Target is created for
    type: String,
    required: true
  },
  status: {
    // The status of the Project: [saved, waiting, approved, rejected]
    type: String,
    default: 'saved'
  },
  error: {
    // Error about the target, if there is any
    type: String,
    default: null,
    maxlength: 1000
  },
  created_at: {
    // UNIX date for the creation time of the object
    type: Date,
    default: Date.now()
  },
  name: {
    // Name of the Target group
    type: String,
    required: true,
    maxlength: 1000
  },
  description: {
    // Description of the Target group
    type: String,
    required: true,
    maxlength: 1000
  },
  country: {
    // The country of the testers
    type: String,
    required: true,
    length: 2
  },
  filters: {
    // The filters that are used to find testers
    type: Array,
    required: true
  },
  submition_limit: {
    // The number of submitions that are allowed, if it is 0 no new user can join the project
    // Starts from 0, when the company tries to send the target to new users it increases
    type: Number,
    default: 0
  },
  approved_submition_count: {
    // The number of approved Submitions under this Target
    type: Number,
    default: 0
  },
  price: {
    // The price that will be paid to each user
    type: Number,
    default: null
  },
  last_update: {
    type: Number,
    default: 0
  }
});

TargetSchema.statics.updateTargetStatus = function (id, data, callback) {
  // Gets an id and updates status of the document with the given id. Returns the target or an error if it exists

  if (!id || !validator.isMongoId(id) || !data)
    return callback('bad_request');

  const Target = this;

  if (!data.approved && !data.reject_message)
    return callback('bad_request');
  
  Target.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: {
    status: data.approved ? 'approved' : 'rejected',
    error: data.approved ? null : data.reject_message
  }}, {new: true}, (err, target) => {
    if (err) return callback(err);

    getTarget(target, {}, (err, target) => {
      if (err) return callback(err);

      return callback(null, target);
    });
  });
};

TargetSchema.statics.approveTarget = function (id, data, callback) {
  // Gets an id and updates the Target with the given id as {status: 'approved'} and {price: data.price}. Returns an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !data || !Number.isInteger(data.price))
    return callback('bad_request');

  const Target = this;
  
  Target.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
    status: 'approved',
    price: data.price
  }}, err => {
    if (err) return callback(err);

    return callback(null);
  });
};

TargetSchema.statics.updateTargetsUsersList = function (callback) {
  // Finds all the targets that's status is approved, updates their user_list
  // Return an error if it exists

  const Target = this;
  const thirtyMinBefore = (new Date).getTime() - 30 * 60 * 1000;

  Target
    .find({$and: [
      {status: 'approved'},
      {submition_limit: {
        $gt: 0
      }},
      {last_update: {
        $lt: thirtyMinBefore // Update only in every 30 mins
      }}
    ]})
    .limit(10) // Update 10 at a time
    .then(targets => {
      async.timesSeries(
        targets.length,
        (time, next) => {
          const target = targets[time];

          filtersArrayToSearchQuery(target.filters, (err, filters) => {
            if (err) return next(err);
            
            filters.$and.push({
              country: target.country
            });
            filters.$and.push({
              completed: true
            });
            filters.$and.push({
              on_waitlist: false
            });

            TargetUserList.getTargetUserListFilter(target._id, (err, filter) => {
              if (err) return next(err);
              if (filter) filters.$and.push(filter);

              User.getUsersWithCustomFiltersAndOptions(filters, {
                limit: Math.min(target.submition_limit, 1000) // Do not update more than 1000 users at a time
              }, (err, users) => {
                if (err) return next(err);

                TargetUserList.updateTargetUserList(target._id, users, target.submition_limit, err => {
                  if (err) return next(err);

                  Target.findByIdAndUpdate(mongoose.Types.ObjectId(target._id.toString()), {$set: {
                    last_update: (new Date).getTime()
                  }}, err => {
                    if (err) return next('database_error');
        
                    next(null);
                  });
                });
              });
            });
          });
        },
        err => {
          if (err) return callback(err);

          Target.collection
            .createIndex({
              status: 1,
              submition_limit: 1,
              last_update: 1
            })
            .then(() => callback(null))
            .catch(err => {console.log(err);callback('indexing_error')});
        }
      );
    })
    .catch(err => {console.log(err);callback('database_error')});
};

TargetSchema.statics.getWaitingTargets = function (callback) {
  // Get a list of Targets that are on status waiting an have more than 0 submition_limit
  // Return an error if it exists

  const Target = this;

  Target
    .find({
      status: 'waiting',
      submition_limit: {
        $gt: 0
      }
    })
    .sort({
      _id: 1
    })
    .then(targets => {
      async.timesSeries(
        targets.length,
        (time, next) => {
          target = targets[time];

          filterArrayToObject(target.filters, (err, filters) =>{
            if (err) return next(err);

            getTarget(targets[time], {
              filters
            }, (err, target) => {
              if (err) return next(err);
              
              Project.findProjectById(target.project_id, (err, project) => {
                if (err) return next(err);
    
                target.project = project;

                Company.findCompanyById(project.creator, (err, company) => {
                  if (err) return next(err);
                  
                  target.company = company;

                  Country.getCountryWithAlpha2Code(target.country, (err, country) => {
                    if (err) return next(err);
                  
                    target.country = country;

                    return next(null, target);
                  });
                });
              });
            });
          });
        },
        (err, targets) => {
          if (err) return callback(err);

          return callback(null, targets);
        }
      );
    })
    .catch(err => callback('database_error'));
};

TargetSchema.statics.incApprovedSubmitionCount = function (id, callback) {
  // Find the Target with the given id and increase its approved_submition_count by 1
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), { $inc: {
    approved_submition_count: 1
  }}, err => callback(err ? 'database_error' : null));
};

TargetSchema.statics.incSubmitionLimitByOne = function (id, callback) {
  // Find the Target with the given id and decrease its submition limit by one
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback(id);

  const Target = this;

  Target.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$inc: {
    submition_limit: 1
  }}, {new: true}, (err, target) => {
    if (err) return callback('database_error');
    if (!target) return callback('document_not_found');

    TargetUserList.updateEachTargetUserListSubmitionLimit(id, target.submition_limit, err => {
      if (err) return callback(err);

      callback(null);
    });
  });
};

TargetSchema.statics.leaveTarget = function (id, user_id, callback) {
  // Find the Target with the given id. Push user to valid user_list of the latest TargetUserList. Remove user from any other TargetUserList
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.incSubmitionLimitByOne(id, err => {
    if (err) return callback(err);

    TargetUserList.removeUser(user_id, id, err => {
      if (err) return callback(err);

      TargetUserList.addUserToValid(user_id, id, err => callback(err));
    });
  });
};

module.exports = mongoose.model('Target', TargetSchema);
