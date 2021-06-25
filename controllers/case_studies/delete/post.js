
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = (req, res) => {

  if (!req.body) req.body = {}; 

  CaseStudy.deleteCaseStudy(req.query.id, (err, case_study) => {
    if (err) {
      res.write(JSON.stringify({success:false, error:err}))
      return res.end();
    }
    res.write(JSON.stringify({success: true}));
    return res.end();
  });
}