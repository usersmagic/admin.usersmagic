// Gets an array of filters from Target model and converts them to an object for client side

const async = require('async');
const validator = require('validator');

const getFilter = (filter, callback) => {
  // Takes a filter object, returns a new key / value pair that can be used in client side

  if (!filter) return callback('bad_request');

  const key = Object.keys(filter)[0];
  const value = Object.values(filter)[0];

  if (key == 'and') {
    const max = value[0].birth_year.lte;
    const min = value[1].birth_year.gte;

    return callback(null, 'age', { min, max });
  } else if (key == 'gender') {
    return callback(null, key, value.in);
  } else {
    return callback(null, key.split('.')[1], value.in);
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
