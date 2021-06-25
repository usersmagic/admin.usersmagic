// Get /companies/edit with the id on the query

const Company = require('../../../models/company/Company');

module.exports = (req,res) =>{
  Company.findCompanyById(req.query.id, (err, company) =>{
    if (err) return res.redirect('/');
    
    return res.render('companies/edit', {
      page: 'companies/edit',
      title: company.company_name,
      includes: {
        external:{
          css: ['general', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
          js: ['page', 'serverRequest', 'inputListeners', 'confirm']
        }
      },
      admin: req.session.admin,
      company
    });
  });
}
