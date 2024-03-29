// Get /companies with given filters and options on query

const Company = require('../../../models/company/Company');

module.exports = (req, res) =>{
  Company.findCompaniesByFilter(req.query, req.query, (err, data) =>{
    if (err) return res.redirect('/');

    return res.render('companies/index', {
      page: 'companies/index',
      title: res.__('Companies'),
      includes:{
        external:{
          css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
          js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
        }
      },
      admin: req.session.admin,
      companies: data.companies,
      filters: data.filters,
      options: data.options
    });
  });
}
