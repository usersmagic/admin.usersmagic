const Company = require('../../../models/company/Company');

module.exports = (req, res) =>{

  //default return all companies
  Company.findCompaniesByFilter(req.query, req.query, (err, data) =>{
    if(err) {
      console.log(err)
      res.redirect('/companies');
    }

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
