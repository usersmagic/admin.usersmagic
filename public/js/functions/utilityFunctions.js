// Create a query string to add a link with given filters and options objects
function createQueryFromFiltersAndOptions(filters, options) {
  if (!filters || typeof filters != 'object')
    filters = {};
  if (!options || typeof options != 'object')
    options = {};

  let str = '';

  Object.keys(filters).forEach(filter_key => {
    str += `${!str.length ? '?' : '&'}${filter_key}=${Array.isArray(filters[filter_key]) ? filters[filter_key].join(',') : filters[filter_key]}`;
  });
  Object.keys(options).forEach(option_key => {
    str += `${!str.length ? '?' : '&'}${option_key}=${Array.isArray(options[option_key]) ? options[option_key].join(',') : options[option_key]}`;
  });

  return str;
}
