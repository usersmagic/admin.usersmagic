
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = async (req, res) => {
    CaseStudy.find({}, (err, response) => {
        if (err) {
            return res.status(400).send(err);
        }
        res.send(response);
    })
}