
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = (req, res) => {
  CaseStudy.getAll((err, caseStudy) => {
    if (err) {
      return res.end();
    }
    res.send(caseStudy);
  })
}