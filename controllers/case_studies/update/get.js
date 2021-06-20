
const CaseStudy = require('../../../models/caseStudy/casestudy')

module.exports = async (req, res) => {
  CaseStudy.findCaseStudyById(req.query.id, (err, case_study) => {
    if (err) return res.redirect("/");
    
    res.render('case_studies/update', {
      page: 'case_studies/update',
      title: res.__(`Edit ${case_study.company_name}`),
      includes: {
        external: {
          css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm', 'update'],
          js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions', 'update']
        }
      },
      case_study
    })
  });
}