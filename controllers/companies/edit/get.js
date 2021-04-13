const Company = require('../../../models/company/Company');

module.exports = (req,res) =>{
  const company_id = req.query["id"];
  Company.findCompanyById(company_id, (error, company) =>{
    if(error) return res.redirect('/');
    
  return res.render('companies/edit', {
    page: 'companies/edit',
    // title: company.company_name,
    includes: {
      external:{
        css: ['general', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
        js: ['page', 'serverRequest', 'inputListeners', 'confirm']
      }
    },
    admin: req.session.admin,
    company
  })
})
}
