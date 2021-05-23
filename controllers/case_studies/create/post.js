
const CaseStudy = require("../../../models/caseStudy/casestudy");

module.exports = async (req, res) => {
    try {
        const caseStudy = CaseStudy.createNewCaseStudy(req.body);
        res.status(201).send({caseStudy});
    } catch (e) {
        res.status(400);
    }
}