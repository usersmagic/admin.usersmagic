const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const getCompany = require('./functions/getCompany');
const hashPassword = require('./functions/hashPassword');
const verifyNewCompanyData = require('./functions/verifyNewCompanyData');
const verifyPassword = require('./functions/verifyPassword');

const CompanySchema = new Schema({
  email: {
    // The email of the account
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  password: {
    // The password, saved hashed
    type: String,
    required: true,
    minlength: 6
  },
  country: {
    // Alpha 2 country code of the company
    type: String,
    default: null,
    length: 2
  },
  company_name: {
    // Name of the account company
    type: String,
    default: null,
    maxlenght: 1000
  },
  credit: {
    type: Number,
    default: 0
  },
  phone_number: {
    // Phone number of the company
    type: String,
    default: null
  },
  profile_photo: {
    // Profile photo of company
    type: String,
    default: '/res/images/default/company.png'
  },
  account_holder_name: {
    // Name of the account holder
    type: String,
    default: null,
    maxlenght: 1000
  },
  timezone: {
    // Timezone of the account
    type: String,
    default: null
  }
});

CompanySchema.pre('save', hashPassword);

CompanySchema.statics.findCompanyById = function (id, callback) {
  // Finds and returns the document with the given id, or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Company = this;

  Company.findById(mongoose.Types.ObjectId(id.toString()), (err, company) => {
    if (err || !company) return callback('document_not_found');

    getCompany(company, (err, company) => {
      if (err) return callback(err);

      return callback(null, company);
    });
  });
}

CompanySchema.statics.findCompaniesByFilter = function(_filters, _options, callback) {
  // findCompaniesByFilter returns a tuple of objects with Companies, Filters and Options or an error if it exists
  // _filters: company_name (string), email (string)
  // _options: limit(int), skip(int)

  const Company = this;

  const filters = {
    $and: []
  }, filter_values = [], options = {
    limit: _options.limit && !isNan(parseInt(_options.limit)) ? parseInt(_options.limit) : 100,
    skip:  _options.skip && !isNaN(parseInt(_options.skip)) ? parseInt(_options.skip) : 0
  };

  if(_filters && _filters.company_name && typeof _filters.company_name == 'string'){
    filters.$and.push({
      company_name: {
        $regex: _filters.company_name.trim(),
        $options: 'i'
      }
    })
    filter_values.company_name = _filters.company_name.trim();
  }

  if(_filters && _filters.email && typeof _filters.email == 'string'){
    filters.$and.push({
      email: {
        $regex: _filters.email.trim(),
        $options: 'i'
      }
    })
    filter_values.email = _filters.email.trim();
  }

  // callback(null, {
    // companies,
    // filters: filter_values,
    // options
  //)}
  Company
    .find(filters.$and.length ? filters: {})
    .sort({ company_name: 1})
    .skip(options.skip)
    .limit(options.limit)
    .then(companies => {
      let completed_companies = [];

      for (company of companies){
        if (company.company_name && company.company_name.length && company.country && company.country.length)
          completed_companies.push(company)
      }

      callback(null, {
        companies: completed_companies,
        filters: filter_values,
        options
      });
    })
    .catch(err => callback('database_error'))
}

CompanySchema.statics.updateCompany = function (id, data, callback) {
  const Company = this;


  if(!id || !validator.isMongoId(id.toString()) || (data.password && data.password != "" && data.password.length < 6))
    return callback('bad_request')

  Company.findById(mongoose.Types.ObjectId(id.toString()), (err, company) =>{
    if(err || !company) return callback('document_not_found');
    if(data.hasOwnProperty('credit_amount') && typeof data.credit_amount == "number"){

      Company.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()),{$set: {
        credit: data.credit_amount
      }}, err =>{
        if(err) return callback('document_not_found');
      })
    }

    if(data.password && data.password != ""){
    company.password = data.password;
    company.save(err => {
      if(err) return callback(err);

      return callback(null);
    })
  }
    return callback(null);
  })
}

module.exports = mongoose.model('Company', CompanySchema);
