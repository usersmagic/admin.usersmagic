// Gets an array of filters from Target model and converts them to an object for client side

const mongoose = require('mongoose');
const validator = require('validator');

const Question = require('../../question/Question');

const getFilter = (filter, callback) => {
  // Takes a filter object, returns a new key / value pair that can be used in client side

  if (!filter) return callback('bad_request');

  const key = Object.keys(filter)[0];
  const value = Object.values(filter)[0];

  if (key == 'and') {
    const max = (new Date()).getFullYear() - value[0].birth_year.gte;
    const min = (new Date()).getFullYear() - value[1].birth_year.lte;

    return callback(null, 'age', { min, max });
  } else if (key == 'gender') {
    return callback(null, key, value.in);
  } else {
    if (!validator.isMongoId(key.split('.')[1]))
      return callback(null, key.split('.')[1], value.in);
    
    Question.findById(mongoose.Types.ObjectId(key.split('.')[1].toString()), (err, question) => {
      if (err || !question)
        return callback('document_not_found');

      return callback(null, question.name, value.in);
    });
  }
}

module.exports = (filters, callback) => {
  if (!filters || !Array.isArray(filters))
    return callback('bad_request');

  const newFilters = {};

  filters.forEach(filter => {
    getFilter(filter, (err, key, value) => {
      if (err) return callback(err);

      newFilters[key] = value;
    });
  });

  return callback(null, newFilters);
}
