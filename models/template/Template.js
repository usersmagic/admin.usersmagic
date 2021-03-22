const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

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
    // Description of the project,
    type: String,
    default: '',
    maxlength: 1000
  },
  questions: {
    // Questions array
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
    .find({})
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
    .find({})
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
}

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

module.exports = mongoose.model('Template', TemplateSchema);
