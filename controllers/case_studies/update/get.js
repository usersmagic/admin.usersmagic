
const CaseStudy = require('../../../models/caseStudy/casestudy')

module.exports = async (req, res) => {
  CaseStudy.findById(req.query.id, (err, caseStudy) => {
    if (err) {
      return res.end();
    }
    res.render('case_studies/update', {
      page: 'case_studies/update',
      title: res.__(`Edit ${caseStudy.company_name}`),
      includes: {
        external: {
          css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm', 'update'],
          js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions', 'update']
        }
      },
      caseStudy
    })
  
  });
}