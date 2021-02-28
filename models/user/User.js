const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const hashPassword = require('./functions/hashPassword');
const getUser = require('./functions/getUser');
const verifyPassword = require('./functions/verifyPassword');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    // Email address of the user
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  password: {
    // Password of the user, saved hashed
    type: String,
    required: true,
    minlength: 6
  },
  agreement_approved: {
    // If user approved user agreement
    type: Boolean,
    default: false
  },
  completed: {
    // If user completed its account, cannot use the app without completing
    type: Boolean,
    default: false
  },
  country: {
    // Country of the user, required while completing account
    type: String,
    default: null
  },
  name: {
    // Name of the user, required while completing account
    type: String,
    default: null,
    maxlength: 1000
  },
  phone: {
    // Phone of the user, required while completing acount
    type: String,
    default: null,
    maxlength: 1000
  },
  gender: {
    // Gender of the user, required while completing acount. Possible values: [male, female, other, not_specified]
    type: String,
    default: null,
    maxlength: 1000
  },
  birth_year: {
    // Birth year of the user, required while completing acount
    type: Number,
    default: null
  },
  city: {
    // City of the user, required before joining a campaign/project
    type: String,
    default: null
  },
  town: {
    // Town of the user, required before joining a campaign/project
    type: String,
    default: null
  },
  information: {
    // Information field of the user, keeping question data for the user
    // Used to filter users by question from Question model
    type: Object,
    default: {}
  },
  paid_campaigns: {
    // List of ids for the campaigns/projects the user is paid for
    // Extra measure to prevent over payment
    type: Array,
    default: []
  },
  campaigns: {
    // List of ids of the campaigns the user is currently joined
    type: Array,
    default: []
  },
  payment_number: {
    // PayPal or Papara number of the user, required before user asking for a payment
    type: String,
    default: null
  },
  credit: {
    // The current credit of user, gained from campaigns or projects
    type: Number,
    default: 0
  },
  waiting_credit: {
    // The waiting credit of the user, still a document on the Payment model
    type: Number,
    default: 0
  },
  overall_credit: {
    // The overall credit of the user, updated after a waiting credit is complete
    type: Number,
    default: 0
  },
  invitor: {
    // Invitor (id of another user) of the user
    // If there is an invitor, the invitor gains 2 credits when the user receives a waiting credit
    type: String,
    default: null
  },
  password_reset_code: {
    // The secure code for resetting a password
    // Created when the user asks for a password reset
    // The code is send the user via email
    type: String,
    default: null
  },
  password_reset_last_date: {
    // The unix time that the password_reset_code will be deactivated
    // The user cannot reset his/her password using the password_reset_code after the password_reset_last_data passes
    type: Number,
    default: null
  },
  on_waitlist: {
    // Shows if the user is currently on waitlist or not, default to false for old users, always set true on a new user
    type: Boolean,
    default: false
  }
});

// Before saving the user to database, hash its password
UserSchema.pre('save', hashPassword);

UserSchema.statics.getUsersByFilters = function (filters, callback) {
  // Find all the users with given filters and return their ids, or an error if it exists
  
  const User = this;

  if (!filters || typeof filters != 'object')
    return callback('bad_request');

  User
    .find(filters)
    .then(users => callback(null, users.map(user => user._id.toString())))
    .catch(err => callback('database_error'));
};

UserSchema.statics.getWaitlistUsers = function (filters, options, callback) {
  // Find all users matching filters and options that are on waitlist
  // Allowed filters: name, email, city, town, countries, genders, max_birth_year, min_birth_year
  // Allowed options: skip, limit. Default to 0 and 100, respectively. Limit can be max 100

  const _filters = { $and: [
    { on_waitlist: true },
    { completed: true }
  ]
  }, _options = {
    skip: 0, limit: 100
  };

  if (!filters)
    filters = {};

  if (!options)
    options = {};

  if (filters.name && typeof filters.name == 'string')
    _filters.$and.push({ name: { $regex: filters.name.trim().toString() } });

  if (filters.email && validator.isEmail(filters.email.trim()))
    _filters.$and.push({ email: filters.email.trim() });

  if (filters.city && typeof filters.city == 'string')
    _filters.$and.push({ city: { $regex: filters.city.trim().toString() } });

  if (filters.town && typeof filters.town == 'string')
    _filters.$and.push({ town: { $regex: filters.town.trim().toString() } });

  if (filters.countries && Array.isArray(filters.countries))
    _filters.$and.push({ country: { $in: filters.countries } });

  if (filters.genders && Array.isArray(filters.genders))
    _filters.$and.push({ gender: { $in: filters.genders } });

  if (filters.max_birth_year && Number.isInteger(filters.max_birth_year))
    _filters.$and.push({ birth_year: { $lte: filters.max_birth_year } });

  if (filters.min_birth_year && Number.isInteger(filters.min_birth_year))
    _filters.$and.push({ birth_year: { $gte: filters.min_birth_year } });

  if (options.skip && !isNaN(parseInt(options.skip)))
    _options.skip = parseInt(options.skip);

  if (options.limit && !isNaN(parseInt(options.limit)) && parseInt(options.limit) < 100)
    _options.limit = parseInt(options.limit);

  const User = this;

  User
    .find(_filters)
    .skip(_options.skip)
    .limit(_options.limit)
    .sort({ _id: 1 })
    .then(users => {
      async.timesSeries(
        users.length,
        (time, next) => getUser(users[time], (err, user) => next(err, user)),
        (err, users) => callback(err, users)
      );
    })
    .catch(err => {console.log(err);callback('database_error')});
};

UserSchema.statics.removeUserFromWaitlist = function (id, callback) {
  // Find and update on_waitlist status of the User with the given id, return an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const User = this;

  User.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
    on_waitlist: false
  }}, (err, user) => {
    if (err) return callback('database_error');
    if (!user) return callback('document_not_found');

    return callback(null);
  });
};

UserSchema.statics.getUserById = function (id, callback) {
  // Finds the user with the given id and returns it without deleting any field, or an error if there is one
  // Do NOT use this function while sending it to frontend, use the user object on the cookie instead

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const User = this;

  User.findById(mongoose.Types.ObjectId(id), (err, user) => {
    if (err) return callback(err);

    return callback(null, user);
  });
};

UserSchema.statics.updateUserById = function (id, update, callback) {
  // Find and update the User with the given id
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !update || typeof update != 'object')
    return callback('bad_request');

  try {
    const User = this;
    
    User.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), update, (err, user) => {
      if (err) return callback('database_error');
      if (!user) return callback('document_not_found');

      return callback(null);
    });
  } catch (err) {
    // This function does not check if the given update is a valid MongoDB update object, so use try/catch block to avoid any error
    return callback('database_error');
  }
}

module.exports = mongoose.model('User', UserSchema);
