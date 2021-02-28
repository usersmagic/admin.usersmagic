const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Country = require('../country/Country');
const Question = require('../question/Question');

const getCampaign = require('./functions/getCampaign');

const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  name: {
    // Name of the campaign
    type: String,
    required: true
  },
  image: {
    // Image of the campaign, an url to AWS database
    type: String,
    required: true
  },
  photo: {
    // Image of the campaign, an url to AWS database. (For old campaigns)
    type: String,
    default: null,
    required: false
  },
  description: {
    // Description of the campaign
    type: String,
    required: true
  },
  information: {
    // The information about the campaign
    type: String,
    required: true
  },
  price: {
    // The credit given per user who finished the campaign
    type: Number,
    required: true
  },
  is_free: {
    // If the campaign is free, different than 0 price
    type: Boolean,
    default: false
  },
  questions: {
    // Array of ids from Question model
    type: Array,
    required: true
  },
  countries: {
    // Filter for user's country, required at least one country
    type: Array,
    required: true
  },
  gender: {
    // Filter for user's gender: [male, female, other, not_specified]
    type: String,
    default: null
  },
  min_birth_year: {
    // Filter for user's birth_year, the birth_year should be bigger than this field (younger)
    type: Number,
    required: true
  },
  max_birth_year: {
    // Filter for user's birth_year, the birth_year should be smaller than this field (older)
    type: Number,
    required: true
  },
  paused: {
    // Information that if a campaign is paused. If a campaign is paused the users cannot see it in /campaigns or /history pages
    // Do NOT delete a campaign, pause it instead
    type: Boolean,
    default: false
  }
});

CampaignSchema.statics.getCampaignById = function (id, callback) {
  // Find the campaign with the given id and return it, or an error it it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Campaign = this;

  Campaign.findById(mongoose.Types.ObjectId(id.toString()), (err, campaign) => {
    if (err || !campaign)
      return callback('document_not_found');

    getCampaign(campaign, (err, campaign) => {
      if (err) return callback(err);

      return callback(null, campaign);
    });
  });
};

CampaignSchema.statics.getCampaigns = function (callback) {
  // Return all campaigns after formatting, or an error if it exists

  const Campaign = this;

  Campaign
    .find({})
    .sort({ _id: -1 })
    .then(campaigns => {
      async.timesSeries(
        campaigns.length,
        (time, next) => getCampaign(campaigns[time], (err, campaign) => next(err, campaign)),
        (err, campaigns) => {
          if (err) return callback(err);

          return callback(null, campaigns);
        }
      );
    })
    .catch(err => callback('database_error'));
};

CampaignSchema.statics.createCampaign = function (data, callback) {
  // Create a new campaign with the given data
  // Return new campaign or and error if it exists

  const allowed_gender_values = ['male', 'female', 'other', 'not_specified'];

  if (!data || typeof data != 'object' || !data.name || !data.image || !data.description || !data.information || (!data.price && !data.is_free) || !data.questions || !data.questions.length || !data.countries || !data.countries.length) 
    return callback('bad_request');

  async.timesSeries(
    data.countries.length,
    (time, next) => Country.getCountryWithAlpha2Code(data.countries[time], (err, country) => next(err, country ? country.alpha2_code : null)),
    (err, countries) => {
      if (err) return callback('bad_request');

      async.timesSeries(
        data.questions.length,
        (time, next) => Question.getQuestionById(data.questions[time], (err, question) => next(err, question)),
        (err, questions) => {
          if (err) return callback('bad_request');

          const Campaign = this;

          if (data.min_birth_year && !isNaN(parseInt(data.min_birth_year)) && parseInt(data.min_birth_year) >= 1920 && parseInt(data.min_birth_year) <= 2020)
            data.min_birth_year = parseInt(data.min_birth_year);
          else
            data.min_birth_year = 1920;

          if (data.max_birth_year && !isNaN(parseInt(data.max_birth_year)) && parseInt(data.max_birth_year) >= 1920 && parseInt(data.max_birth_year) <= 2020)
            data.max_birth_year = parseInt(data.max_birth_year);
          else
            data.max_birth_year = 1920;

          const newCampaignData = {
            name: data.name,
            image: data.image,
            description: data.description,
            information: data.information,
            price: data.price ? data.price : 0,
            is_free: data.is_free ? true : false,
            questions,
            countries,
            gender: data.gender && allowed_gender_values.includes(data.gender) ? data.gender : null,
            min_birth_year: data.min_birth_year,
            max_birth_year: data.max_birth_year
          };

          const newCampaign = new Campaign(newCampaignData);

          newCampaign.save((err, campaign) => {
            if (err) return callback('database_error');

            return callback(null, campaign._id.toString());
          });
        }
      );
    }
  );
};

module.exports = mongoose.model('Campaign', CampaignSchema);
