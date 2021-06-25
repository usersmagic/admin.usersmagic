
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = (req, res) => {
  if (!req.body) req.body = {};
  
  CaseStudy.findCaseStudyById(req.body._id, (err, case_study) => {
    if (err) {
      res.write(JSON.stringify({success:false, error:err}))
      return res.end()
    }
    res.send(case_study);
    return res.end();
  })
}