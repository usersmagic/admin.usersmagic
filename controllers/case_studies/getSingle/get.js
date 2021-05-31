
const CaseStudy = require('../../../models/caseStudy/casestudy');

module.exports = (req, res) => {
    const id = req.body._id
    CaseStudy.findOne({_id: id}, (err, response) => {
        if (err) {
            return res.status(400).send(err);
        }
        res.send(response);
    })
}