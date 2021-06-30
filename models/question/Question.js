const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Country = require('../country/Country');
const User = require('../user/User');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  name: {
    // Name of the questions, visible to admin and companies
    type: String,
    required: true
  },
  description: {
    // Description of the question, visible to admin
    type: String,
    required: true
  },
  text: {
    // The question text
    type: String,
    required: true
  },
  type: {
    // Type of the question: [short_text, long_text, checked, radio, range]
    type: String,
    required: true
  },
  answer_length: {
    // The allowed answer length for the question, used in short_text and long_text
    type: Number,
    default: 1000
  },
  choices: {
    // An array of strings, showing the choices for checked and radio types
    type: Array,
    default: null
  },
  other_option: {
    // A boolean value showing if other option is open for this checked/radio question
    type: Boolean,
    default: false
  },
  min_value: {
    // Min value of range question
    type: Number,
    default: 0
  },
  max_value: {
    // Max value of range question
    type: Number,
    default: 10
  },
  min_explanation: {
    // Min value explanation for range question
    type: String,
    default: '',
    min: 0,
    max: 10
  },
  max_explanation: {
    // Max value explanation for range question
    type: String,
    default: '',
    min: 0,
    max: 10
  },
  countries: {
    // Countries that the question can be used to filter
    // Different than the countries of the Campaign, this is only important for company side
    type: Array,
    default: ['tr']
  }
});

QuestionSchema.statics.createQuestion = function (data, callback) {
  // Create a Question with the given data, returns its id or an error if it exists

  const allowed_types = ['short_text', 'long_text', 'checked', 'radio', 'range']; 

  if (!data || typeof data != 'object' || !data.name || !data.description || !data.text || !data.type || !allowed_types.includes(data.type) || !data.countries || !data.countries.length)
    return callback('bad_request');

  const Question = this;

  async.timesSeries(
    data.countries.length,
    (time, next) => Country.getCountryWithAlpha2Code(data.countries[time], (err, country) => next(err, country.alpha2_code)),
    (err, countries) => {
      if (err) return callback(err);

      if ((data.type == 'checked' || data.type == 'radio') && (!data.choices || !Array.isArray(data.choices) || !data.choices.length))
        return callback('bad_request');

      if ((data.type == 'range') && (isNaN(parseInt(data.min_value)) || isNaN(parseInt(data.max_value))))
        return callback('bad_request');

      const newQuestionData = {
        name: data.name,
        description: data.description,
        text: data.text,
        type: data.type,
        countries,
        choices: data.choices ? data.choices : null,
        other_option: data.other_option ? true : false,
        min_value: data.min_value ? parseInt(data.min_value) : null,
        max_value: data.max_value ? parseInt(data.max_value) : null,
        min_explanation: data.min_explanation ? data.min_explanation : null,
        max_explanation: data.max_explanation ? data.max_explanation : null,
        answer_length: data.answer_length && !isNaN(parseInt(data.answer_length)) ? parseInt(data.answer_length) : 1000
      };

      const newQuestion = new Question (newQuestionData);

      newQuestion.save((err, question) => {
        if (err) return callback('database_error');

        return callback(null, question._id.toString())
      });
    }
  );
};

QuestionSchema.statics.updateQuestion = function (id, data, callback) {
  // Find the question with the given id and update it, updates on the given fields and if they are in valid format
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !data || typeof data != 'object')
    return callback('bad_request');

  const Question = this;

  Question.findById(mongoose.Types.ObjectId(id.toString()), (err, question) => {
    if (err || !question) return callback('document_not_found');

    Question.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
      name: data.name && typeof data.name == 'string' ? data.name : question.name,
      description: data.description && typeof data.description == 'string' ? data.description : question.description,
      text: data.text && typeof data.text == 'string' ? data.text : question.text,
      answer_length: data.answer_length && !isNaN(parseInt(data.answer_length)) ? parseInt(data.answer_length) : question.answer_length,
      choices: data.choices && Array.isArray(data.choices) && data.choices.length ? data.choices : question.choices,
      other_option: data.hasOwnProperty('other_option') ? data.other_option : question.other_option,
      min_value: data.min_value && !isNaN(parseInt(data.min_value)) && parseInt(data.min_value) >= 0 && parseInt(data.min_value) <= 10 ? parseInt(data.min_value) : question.min_value,
      max_value: data.max_value && !isNaN(parseInt(data.max_value)) && parseInt(data.max_value) >= 0 && parseInt(data.max_value) <= 10 ? parseInt(data.max_value) : question.max_value,
      min_explanation: data.min_explanation && typeof data.min_explanation == 'string' ? data.min_explanation : question.min_explanation,
      max_explanation: data.max_explanation && typeof data.max_explanation == 'string' ? data.max_explanation : question.max_explanation
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

QuestionSchema.statics.findQuestion = function (_filters, _options, callback) {
  // Find Questions with given filters and options, return an object with questions, filters and options used in search or an error if it exists
  // Allowed filters: name (string), text (string), types: [short_text, long_text, checked, radio, range], countries: [], not_id: []
  // Allowed options: limit (int), skip (int)

  const allowed_types = ['short_text', 'long_text', 'checked', 'radio', 'range'];

  const filters = {
    $and: []
  }, filter_values = {}, options = {
    limit: _options.limit && !isNaN(parseInt(_options.limit)) ? parseInt(_options.limit) : 100,
    skip: _options.skip && !isNaN(parseInt(_options.skip)) ? parseInt(_options.skip) : 0,
  };

  if (_filters && _filters.name && typeof _filters.name == 'string') {
    filters.$and.push({
      name: {
        $regex: _filters.name.trim(),
        $options: 'is'
      }
    });
    filter_values.name = _filters.name.trim()
  };

  if (_filters && _filters.text && typeof _filters.text == 'string') {
    filters.$and.push({
      text: {
        $regex: _filters.text.trim(),
        $options: 'is'
      }
    });
    filter_values.text = _filters.text.trim()
  };

  if (_filters && _filters.types && typeof _filters.types == 'string') {
    _filters.types = _filters.types.split(',');
  };
  if (_filters && _filters.types && Array.isArray(_filters.types) && !_filters.types.find(filter => !allowed_types.includes(filter))) {
    filters.$and.push({
      type: { $in: _filters.types }
    });
    filter_values.types = _filters.types.join(',');
  };

  if (_filters && _filters.not_id && typeof _filters.not_id == 'string') {
    _filters.not_id = _filters.not_id.split(',');
  };
  if (_filters && _filters.not_id && Array.isArray(_filters.not_id) && !_filters.not_id.find(filter => !validator.isMongoId(filter.toString()))) {
    filters.$and.push({
      _id: { $nin: _filters.not_id }
    });
    filter_values.not_id = _filters.not_id.join(',');
  };

  Country.getCountries((err, countries) => {
    if (err) return callback(err);

    if (_filters && _filters.countries && typeof _filters.countries == 'string') {
      _filters.countries = _filters.countries.split(',');
    };
    if (_filters && _filters.countries && Array.isArray(_filters.countries) && _filters.countries.length && !_filters.countries.find(filter => !countries.includes(filter))) {
      const countries_filter = [];
      for (let i = 0; i < _filters.countries.length; i++)
        countries_filter.push({
          countries: _filters.countries[i]
        });
      filters.$and.push({
        $or: countries_filter
      });
      filter_values.countries = _filters.countries.join(',');
    };
  
    const Question = this;
  
    Question
      .find(filters.$and.length ? filters : {})
      .sort({ _id: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .then(questions => callback(null, {
        questions,
        filters: filter_values,
        options
      }))
      .catch(err => callback('database_error'));
  });
};

QuestionSchema.statics.getQuestionById = function (id, callback) {
  // Find and return the Question with the given id, or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Question = this;

  Question.findById(mongoose.Types.ObjectId(id.toString()), (err, question) => {
    if (err) return callback('database_error');
    if (!question) return callback('document_not_found');

    return callback(null, question);
  });
};

QuestionSchema.statics.getQuestionJSONByAges = function (id, is_percent, callback) {
  // Find the Question with the given id and return json data grouped by ages, or an error if it exists
  // Find X random documents. X = min(10000, 0.1 * total_document_count)

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Question = this;
  const allowed_types = ['checked', 'radio', 'range'];

  const ageGroups = [
    {name: "all", min: 1900, max: 2021},
    {name: "18-24", min: 1997, max: 2003},
    {name: "25-34", min: 1987, max: 1996},
    {name: "35-44", min: 1977, max: 1986},
    {name: "45-54", min: 1967, max: 1976},
    {name: "55-65", min: 1956, max: 1966}
  ];

  Question.findById(mongoose.Types.ObjectId(id.toString()), (err, question) => {
    if (err || !question) return callback('document_not_found');

    if (question.type == 'range') {
      question.choices = [];
      for (let i = question.min_value; i <= question.max_value; i++)
        question.choices.push(i.toString());
    };

    async.timesSeries(
      ageGroups.length,
      (time, next) => {
        const age = ageGroups[time];
  
        User
          .find({$and: [
            { ["information." + id.toString()]: { $ne: null } },
            { birth_year: { $gte: age.min } },
            { birth_year: { $lte: age.max } },
          ]})
          .countDocuments()
          .then(number => {
            const count = Math.min(10000, Math.max(Math.min(number, 5), Math.round(0.1 * number))); // 10% rule
            const random_skip = Math.round(Math.random() * (number-count)); // Skip random number of documents

            User
              .find({$and: [
                { ["information." + id.toString()]: { $ne: null } },
                { birth_year: { $gte: age.min } },
                { birth_year: { $lte: age.max } },
              ]})
              .skip(random_skip)
              .limit(count)
              .then(users => {
                const data = { age_group: age.name };

                question.choices.forEach(choice => {
                  data[choice] = 0;
                });

                async.timesSeries(
                  users.length,
                  (time, next) => {
                    const user = users[time];
        
                    const ans = user.information[id.toString()];
                    if (!isNaN(data[ans]))
                      data[ans]++;

                    next(null);
                  },
                  err => {
                    if (err) return next(err);
        
                    if (!is_percent)
                      return next(null, data);
                    
                    let total = 0;

                    Object.values(data).forEach((ans, i) => {
                      if (i > 0) total += ans;
                    });

                    if (total > 0)
                      Object.keys(data).forEach((key, i) => {
                        if (i > 0) data[key] = Math.round(data[key] / total * 1000) / 10;
                      });

                    return next(null, data);
                  }
                );
              })
              .catch(err => {console.log(err);callback('database_error')});
      })
      .catch(err => callback('database_error'));
      },
      (err, data) => {
        if (err) return callback(err);
  
        return callback(null, data);
      }
    );
  });

  Question.findById(mongoose.Types.ObjectId(id.toString()), (err, question) => {
    if (err || !question || !allowed_types.includes(question.type))
      return callback('bad_request');

    

    
    });
};


QuestionSchema.statics.createFilterGraph = function (yQuestionId, xQuestionId, callback) {
  const Question = this;
  Question.getQuestionById(yQuestionId, (err, questionY) => {
    if (err) return callback('bad_request', null);
    if (questionY) {
      Question.getQuestionById(xQuestionId, (err, questionX) => {
        if (err) return callback('bad_request', null);
        if (questionX) {
          var graphData = {};
          var yChoicesArray = [];
          const xChoices = questionX.choices;
          const yChoices = questionY.choices;
          async.timesSeries(
            xChoices.length,
            (time1, next) => {
              async.timesSeries(
                yChoices.length,
                (time2, next) => {
                  User.find({["information." + xQuestionId]: xChoices[time1]}).countDocuments( (err, countX) => {
                    User.find({["information." + xQuestionId]: xChoices[time1],["information." + yQuestionId]: yChoices[time2]}).countDocuments( (err, countY) => {

                      const choiceXName = xChoices[time1];
                      const choiceYName = yChoices[time2];
                      graphData[choiceXName] = {};
                      graphData[choiceXName].val = countX;
                      yChoicesArray.push({
                        [yChoices[time2]]: countY
                      })
                      graphData[choiceXName].yChoicesArray = yChoicesArray;

                      next(null)
                    })
                  });
                },
                (err) => {
                  if (err) return callback('bad_request', null);
                  yChoicesArray = [];
                  next(null)
                }
              )
            },
            (err) => {
              if (err) return callback('bad_request', null);
              return callback(null, graphData);            
            }
          )
        }
      })
    }
  })
}

module.exports = mongoose.model('Question', QuestionSchema);
