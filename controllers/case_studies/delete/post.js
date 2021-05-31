
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = (req, res) => {

    CaseStudy.deleteCaseStudy(req.body.company_name, (err, caseStudy) => {
        if (err) {
            return res.status(400).send(err)
        }
        return res.send(caseStudy);
    });
}