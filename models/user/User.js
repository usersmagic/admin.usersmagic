const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../campaign/Campaign');
const Country = require('../country/Country');
const Project = require('../project/Project');
const Question = require('../question/Question');
const Submition = require('../submition/Submition');

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
}

module.exports = mongoose.model('User', UserSchema);
