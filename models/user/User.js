const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const hashPassword = require('./functions/hashPassword');
const getUser = require('./functions/getUser');
const verifyPassword = require('./functions/verifyPassword');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  priority_index: {
    // A number describing User's priority while joining new campaigns
    // Calculated as last_login_time + 24*60*60*1000 * campaign_value
    type: Number,
    default: 0
  },
  last_login_time: {
    // The UNIX time the User last logged in to the system
    // Update on every 5 mins, prevent overload on database
    type: Number,
    default: 0
  },
  campaign_value: {
    // The value describing how manys campaigns user joined. Unit is days
    // Increased/Decreased by 0.25
    type: Number,
    default: 0.25
  },
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
    minlength: 6,
    maxlength: 1000
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
  confirmed: {
    // If the user confirmed his/her mail address, cannot use the app without confirming
    type: Boolean,
    default: false
  },
  closed: {
    // The field showing if the account is closed
    // Set completed, confirmed false and on_waitlist true for closed accounts
    type: Boolean,
    default: false
  },
  confirm_code: {
    // A random generated code when the user is created. Secure and never sended to client side
    type: String,
    length: 20,
    required: true
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
    // Gender of the user, required while completing account. Possible values: [male, female, other, not_specified]
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
    // PayPal (email)(Everywhere), Papara (number 10-digits)(TR) or Venmo (username)(US) info of the user, required before user asking for a payment
    type: String,
    unique: true,
    default: null,
    sparse: true // Allow null documents
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

UserSchema.statics.getUsersByFiltersAndOptions = function (filters, options, callback) {
  // Find all users matching filters and options
  // Allowed filters: completed, confirmed, name, email, city, town, countries, genders, max_birth_year, min_birth_year
  // Allowed options: skip, limit. Default to 0 and 100, respectively. Limit can be max 100

  const _filters = { $and: [] };
  const _options = {
    skip: 0, limit: 100
  };

  if (!filters)
    filters = {};

  if (!options)
    options = {};

  if (filters.completed)
    _filters.$and.push({ completed: true });

  if (filters.confirmed)
    _filters.$and.push({ confirmed: true });

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
    .find(_filters.$and.length ? _filters : {})
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
    .catch(err => callback('database_error'));
};

UserSchema.statics.getUsersWithCustomFiltersAndOptions = function (filters, options, callback) {
  // Use direct mongodb filters, require to have a valid search string
  // Allowed options: limit (default: 100, max: 1000)
  // Return an array of users, or an error if it exists

  const User = this;

  try {
    const limit = ((options.limit && Number.isInteger(options.limit) && options.limit < 1000) ? options.limit : 100);

    User
      .find(filters)
      .sort({ priority_index: -1 })
      .limit(limit)
      .then(users => callback(null, users))
      .catch(err => callback('database_error'));
  } catch (err) {
    return callback('database_error');
  };
}

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
    .catch(err => callback('database_error'));
};

UserSchema.statics.removeUserFromWaitlist = function (id, callback) {
  // Find and update on_waitlist status of the User with the given id
  // Return the user or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const User = this;

  User.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
    on_waitlist: false
  }}, (err, user) => {
    if (err) return callback('database_error');
    if (!user) return callback('document_not_found');

    return callback(null, user);
  });
};

UserSchema.statics.removeMultipleUsersFromWaitlist = function (data, callback) {
  // Find and update on_waitlist status of the users with the given ids on the users field
  // Return an array of users or an error if it exists

  if (!data || !data.users || !Array.isArray(data.users) || data.users.find(id => !validator.isMongoId(id.toString())))
    return callback('bad_request');

  const User = this;

  async.timesSeries(
    data.users.length,
    (time, next) => {
      const id = data.users[time].toString();
      User.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: {
        on_waitlist: false
      }}, (err, user) => {
        if (err) return next('database_error');
        if (!user) return next('document_not_found');
    
        return next(null, user);
      });
    },
    (err, users) => {
      if (err) return callback(err);

      return callback(null, users);
    }
  );
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
};

UserSchema.statics.increaseCampaignValue = function (id, callback) {
  // Find the User with the given id and increase its campaign value by 0.25
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const User = this;

  User.findById(mongoose.Types.ObjectId(id.toString()), (err, user) => {
    if (err || !user) return callback('document_not_found');

    const campaign_value = user.campaign_value ? user.campaign_value : 0.25, one_day = parseFloat(24 * 60 * 60 * 1000);

    User.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
      priority_index: (user.last_login_time + one_day * (campaign_value + 0.25)),
      campaign_value: campaign_value + 0.25
    }}, err => {
      if (err) return callback('database_error');

      User.collection
        .createIndex({
          on_waitlist: 1,
          gender: 1,
          birth_year: 1,
          country: 1,
          city: 1,
          town: 1,
          information: 1,
          priority_index: 1
        })
        .then(() => callback(null))
        .catch(err => callback('indexing_error'));
      });
  });
};

module.exports = mongoose.model('User', UserSchema);
