
const mongoose = require('mongoose');
const validator = require('validator');

const caseStudySchema = mongoose.Schema({
  company_logo: {
    type: Buffer,
    required: false
  },
  main_title: {
    type: String,
    required: true
  },
  main_description: {
    type: String,
    required: true
  },
  main_company_image: {
    type: Buffer,
    required: false
  },
  company_name: {
    type: String,
    required: true
  },
  company_location: {
    type: String,
    required: false,
  },
  company_industry: {
    type: String,
    required: false,
  },
  company_ipo: {
    type: String,
    required: false,
  },
  company_website: {
    type: String,
    required: false,
  },
  company_employee_number: {
    type: String,
    required: false,
  },
  company_established_year: {
    type: String,
    required: false,
  },
  company_speciality: {
    type: String,
    required: false,
  },
  company_stage: {
    type: String,
    required: false,
  },
  company_type: {
    type: String,
    required: false,
  },
  company_personal_name: {
    type: String,
    required: true,
  },
  company_personal_role: {
    type: String,
    required: true,
  },
  company_personal_image: {
    type: Buffer,
    required: false,
  },
  company_personal_quote: {
    type: String,
    required: false
  },
  context_text: {
    type: String,
    required: false
  },
  problem_text: {
    type: String,
    required: false
  },
  solution_text: {
    type: String,
    required: false
  },
  results_text: {
    type: String,
    required: false
  },
  language: {
    type: String,
    required: true
  }
});

caseStudySchema.statics.getAllCaseStudies = function (callback) {
  CaseStudy.find({}, (err, case_study) => {
    if (err) return callback('bad_request');
    
    return callback(null, case_study);
  })
}

caseStudySchema.statics.findCaseStudyById = function (id, callback) {
  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');
  CaseStudy.findById(id, (err, case_study) => {
    if (err) return callback('bad_request');
    
    return callback(null, case_study);
  })
}

caseStudySchema.statics.createNewCaseStudy = function(data, callback) {
  if (!data.company_personal_image ||!data.main_company_image ||!data.company_logo ||!data.main_title ||!data.main_description ||!data.company_name ||!data.company_personal_name ||!data.company_personal_role ||!data.company_personal_quote ||!data.language) return callback('bad_request');
  
  const case_study = new CaseStudy(data);
  case_study.save((err, response) => {
    if (err) return callback('bad_request');
    return callback(null, case_study);
  });
}

caseStudySchema.statics.editCaseStudy = function( id, data, callback ) {
  if (!id || !validator.isMongoId(id.toString()) || !data)
    return callback('bad_request');
  if (!data.main_title ||!data.main_description ||!data.company_name ||!data.company_personal_name ||!data.company_personal_role ||!data.company_personal_quote) return callback('bad_request');
  
  CaseStudy.findByIdAndUpdate(id, data, (err, caseStudy) => {
    if (err) return callback('bad_request');

    caseStudy.save((err, updatedCaseStudy) => {
      if (err) return callback('bad_request');
      return callback(null, updatedCaseStudy);
    });
  })
}

caseStudySchema.statics.deleteCaseStudy = function( id, callback ) {
  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');
  CaseStudy.findByIdAndDelete(id, (err, caseStudy) => {
    if (err) return callback('bad_request');
    return callback(null, caseStudy);
  });
}

const CaseStudy = mongoose.model('caseStudy', caseStudySchema);

module.exports = CaseStudy;