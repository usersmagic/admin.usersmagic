// Gets an object of filters and converts them to an array to be used in Target model filters field

const async = require('async');
const validator = require('validator');

const getFilter = (key, value, callback) => {
  // Takes a key and value pair and returns it as a filter in the proper format

  if (!key || !key.length || !value)
    return callback('bad_request');

  if (key == 'age') {
    const min = (value.min && !isNaN(parseInt(value.min)) && parseInt(value.min) >= 18) ? parseInt(value.min) : 18;
    const max = (value.max && !isNaN(parseInt(value.max)) && parseInt(value.max) <= 80) ? parseInt(value.max) : 80;

    return callback(null, {
      'and': [
        {'birth_year': {gte: ((new Date).getFullYear())-max}},
        {'birth_year': {lte: ((new Date).getFullYear())-min}}
      ]
    })
  } else if (key == 'gender') {
    if (!value.length || !Array.isArray(value))
      return callback('bad_request');

    return callback(null, {
      [key]: {
        'in': value
      }
    });
  } else {
    if (!value.length || !Array.isArray(value) || !validator.isMongoId(key.toString()))
      return callback('bad_request');

    return callback(null, {
      [`information.${key}`]: {
        'in': value
      }
    });
  }
}

module.exports = (filters, callback) => {
  if (!filters)
    return callback('bad_request');

  const filterKeys = Object.keys(filters);

  async.timesSeries(
    filterKeys.length,
    (time, next) => getFilter(filterKeys[time], filters[filterKeys[time]], (err, filter) => next(err, filter)),
    (err, filters) => callback(err, filters)
  );
}
