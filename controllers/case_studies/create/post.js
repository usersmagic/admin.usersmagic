
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = (req, res) => {
    const caseStudy = CaseStudy.createNewCaseStudy(req.body, (err, casestudy) => {
        if (err) {
            return res.status(400).send(err);
        }
    });
    return res.status(201).send({caseStudy});
}