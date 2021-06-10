
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = (req, res) => { 

  if (!req.body) {
    req.body = {};
  }

  CaseStudy.editCaseStudy(req.body.id, req.body, (err, caseStudy) => {
    if (
      !req.body.main_title ||
      !req.body.main_description ||
      !req.body.company_name ||
      !req.body.company_personal_name ||
      !req.body.company_personal_role ||
      !req.body.company_personal_quote 
      ) {
        res.write(JSON.stringify({success:false, error:err}))
        return res.end();
      } else if (caseStudy) {
        res.write(JSON.stringify({success: true}));
      }
      return res.end();
  })
}