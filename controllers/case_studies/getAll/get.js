
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = (req, res) => {
  CaseStudy.getAllCaseStudies((err, case_study) => {
    if (err) {
      res.write(JSON.stringify({ success:false, error:err }))
      return res.end();
    }
    res.send(case_study);
  })
}