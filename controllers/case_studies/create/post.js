
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = (req, res) => {
  CaseStudy.createNewCaseStudy(req.body, (err, casestudy) => {
    if (err) {
      res.write(JSON.stringify({success:false, error:err}))
      return res.end()
    }
    res.write(JSON.stringify({success: true}));
    return res.end();
  });
}