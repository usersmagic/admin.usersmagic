const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const validateQuestions = require('./functions/validateQuestions');

const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  order: {
    // The order of the Template, the Templates are ordered by this number while they are send to users
    type: Number,
    required: true
  },
  type: {
    // Type of the template: [survey, web_test, app_test]
    type: String,
    required: true
  },
  paused: {
    // Field showing if the template is paused or not
    type: Boolean,
    default: true
  },
  title: {
    // The title that the template belongs to
    type: String,
    required: true,
    maxlength: 1000
  },
  name: {
    // Name of the template
    type: String,
    required: true,
    maxlength: 1000
  },
  image: {
    // Image of the template
    type: String,
    required: true,
    maxlength: 1000
  },
  description: {
    // Description of the template,
    type: String,
    default: '',
    maxlength: 1000
  },
  questions: {
    // Questions array
    type: Array,
    default: []
  },
  questions_update: {
    // Questions array, save updated field
    type: Array,
    default: []
  },
  welcome_screen: {
    // Content of the welcome_screen
    type: Object,
    default: {
      opening: '',
      details: '',
      image: ''
    }
  },
  welcome_screen_update: {
    // Content of the welcome_screen
    type: Object,
    default: {
      opening: '',
      details: '',
      image: ''
    }
  },
  countries: {
    // An array of the Countries' alpha2_codes that the Template will be used for
    type: Array,
    required: true,
    minlength: 1
  }
});

TemplateSchema.statics.createTemplate = function (data, callback) {
  // Create a new Template with the given data, return its id or an error if it exists

  if (!data || typeof data != 'object' || !data.title || !data.title.length || !data.name || !data.name.length || !data.image || !data.image.length || !data.description || !data.description.length || !data.countries || !data.countries.length)
    return callback('bad_request');

  const Template = this;

  Template
    .find({})
    .countDocuments()
    .then(number => {
      const newTemplateData = {
        order: number,
        type: 'survey',
        title: data.title,
        name: data.name,
        image: data.image,
        description: data.description,
        countries: data.countries
      };

      const newTemplate = new Template(newTemplateData);

      newTemplate.save((err, template) => {
        if (err) return callback('database_error');
    
        return callback(null, template._id.toString());
      });
    })
    .catch(err => callback('database_error'));
};

TemplateSchema.statics.decreaseOrderByOne = function (id, callback) {
  // Find the Template with the given id and decrease its order by one
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Template = this;

  Template.findById(mongoose.Types.ObjectId(id.toString()), (err, template) => {
    if (err || !template)
      return callback('document_not_found');

    const template_order = template.order;
    const previous_order = template.order - 1;

    if (previous_order < 0)
      return callback(); // Finish the process, but do not return an error

    Template.findOneAndUpdate({
      order: previous_order
    }, {$set: {
      order: template_order
    }}, err => {
      if (err) return callback('database_error');

      Template.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
        order: previous_order
      }}, err => {
        if (err) return callback('database_error');
        
        return callback();
      });
    });
  });
};

TemplateSchema.statics.getTemplates = function (filter, callback) {
  // Find and return all templates matching the given filters, or an error it exists
  // Allowed filters: country

  const Template = this;

  const filters = {};

  if (filter && filter.country && filter.country.length == 2)
    filters.country = filter.country;

  Template
    .find(filters)
    .sort({ order: 1 })
    .then(templates => callback(null, templates))
    .catch(err => callback('database_error'));
};

TemplateSchema.statics.getTemplatesGroupedByTitle = function (filter, callback) {
  // Get all the templates with the given filter grouped by their title
  // Return an object where each key is a title and value is an array of templates, or an error if it exists

  const Template = this;

  const filters = {};

  if (filter && filter.country && filter.country.length == 2)
    filters.country = filter.country;

  Template
    .find(filters)
    .sort({ order: 1 })
    .then(templates => {
      const grouped_templates = {};

      async.timesSeries(
        templates.length,
        (time, next) => {
          const template = templates[time];

          if (!grouped_templates[template.title])
            grouped_templates[template.title] = [];

          grouped_templates[template.title].push(template);

          next(null);
        },
        err => {
          if (err) return callback('unknown_error');

          return callback(null, grouped_templates);
        }
      )
    })
    .catch(err => callback('database_error'));
};

TemplateSchema.statics.getTemplateById = function (id, callback) {
  // Find and return the Template with the given id, or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Template = this;

  Template.findById(mongoose.Types.ObjectId(id.toString()), (err, template) => {
    if (err) return callback('database_error');
    if (!template) return callback('document_not_found');

    return callback(null, template);
  });
};

TemplateSchema.statics.updateTemplate = function (id, data, callback) {
  // Update template fields, returns error if it exists or null

  const Template = this;

  if (!id || !validator.isMongoId(id.toString()) || !data)
    return callback('bad_request');

  if ((data.title && !data.title.length) || (data.name && !data.name.length) || (data.description && !data.description.length) || (data.countries && !data.countries.length))
    return callback('bad_request');

  Template.findById(mongoose.Types.ObjectId(id), (err, template) => {
    if (err || !template) return callback('document_not_found');

    const newData = {
      title: data.title || template.title,
      name: data.name || template.name,
      description: data.description || template.description,
      countries: data.countries || template.countries,
      welcome_screen_update: data.welcome_screen ? {
        opening: data.welcome_screen.opening ? data.welcome_screen.opening : template.welcome_screen.opening,
        details: data.welcome_screen.details ? data.welcome_screen.details : template.welcome_screen.details,
        image: data.welcome_screen.image ? data.welcome_screen.image : template.welcome_screen.image,
      } : template.welcome_screen_update
    };

    Template.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: newData}, err => {
      if (err) return callback('database_error');
      
      return callback(null);
    });
  });
};

TemplateSchema.statics.saveQuestions = function (id, data, callback) {
  // Save data.questions on the document with the given id, returns error if it exists
  
  const Template = this;

  if (!id || !validator.isMongoId(id.toString()) || !data)
    return callback('bad_request');

  validateQuestions(data.questions, {}, (err, questions) => {
    if (err) return callback(err);

    Template.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: {
      questions_update: questions
    }}, (err, template) => {
      if (err || !template) return callback(err);

      return callback(null);
    });
  });
};

TemplateSchema.statics.finishTemplate = function (id, callback) {
  // Set the questions and welcome screen fields of the template to the update of the respective field
  // Return an error if it exists

  const Template = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Template.findById(mongoose.Types.ObjectId(id), (err, template) => {
    if (err || !template)
      return callback('document_not_found');

    validateQuestions(template.questions_update, {final: true}, (err, questions) => {
      if (err) return callback('document_validation');

      Template.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: {
        questions,
        welcome_screen: template.welcome_screen_update
      }}, err => {
        if (err) return callback('unknown_error');

        return callback(null);
      });
    });
  });
};

TemplateSchema.statics.startTemplate = function (id, callback) {
  // Set the field paused: false of the template with the given id
  // Return an error if exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Template = this;

  Template.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
    paused: false
  }}, err => {
    if (err) return callback('database_error');

    return callback();
  });
};

TemplateSchema.statics.stopTemplate = function (id, callback) {
  // Set the field paused: false of the template with the given id
  // Return an error if exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Template = this;

  Template.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
    paused: true
  }}, err => {
    if (err) return callback('database_error');

    return callback();
  });
};

module.exports = mongoose.model('Template', TemplateSchema);
