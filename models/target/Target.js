const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const filterArrayToObject = require('./functions/filterArrayToObject');
const filterObjectToArray = require('./functions/filterObjectToArray');
const filtersArrayToSearchQuery = require('./functions/filtersArrayToSearchQuery');
const getTarget = require('./functions/getTarget');

const Company = require('../company/Company');
const Project = require('../project/Project');
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
  users_list: {
    // List of ids from User model. The users in this list can join this target group
    type: Array,
    default: []
  },
  joined_users_list: {
    // List of ids from User model. The users in this list have already joined the project, they cannot join one more time
    type: Array,
    default: []
  },
  price: {
    // The price that will be paid to each user
    type: Number,
    default: null
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

  if (!id || !validator.isMongoId(id.toString()) || !data || !data.price || !Number.isInteger(data.price))
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
  // Finds all the targets that's status is approved, updates their users_list

  const Target = this;

  Target.find({
    status: 'approved',
    submition_limit: {
      $gt: 0
    }
  }, (err, targets) => {
    if (err) return callback('database_error');

    async.timesSeries(
      targets.length,
      (time, next) => {
        const target = targets[time];

        filtersArrayToSearchQuery(target.filters, (err, filters) => {
          if (err) return next(err);
          
          // Push target country to filters, also make sure the $and array is not empty
          filters.$and.push({
            country: target.country
          });

          // Do not repeat users in users_list array
          filters.$and.push({
            _id: {
              $nin: target.users_list
            }
          });

          User.getUsersByFilters(filters, (err, user_ids) => {
            if (err) return next(err);

            async.timesSeries(
              user_ids.length,
              (time, next) => {
                Target.findByIdAndUpdate(mongoose.Types.ObjectId(target._id), {$push: {
                  users_list: user_ids[time]
                }}, {}, err => next(err));
              },
              err => {
                if (err) return next('database_error');

                Target.collection
                  .createIndex({ // To make search faster
                    users_list: 1
                  })
                  .then(() => next(null))
                  .catch(err => next('indexing_error'));
              }
            );
          });
        });
      },
      err => {
        if (err) return callback(err);

        return callback(null);
      }
    );
  });
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

                  return next(null, target);
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

module.exports = mongoose.model('Target', TargetSchema);
