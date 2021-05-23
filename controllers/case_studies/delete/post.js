
const CaseStudy = require("../../../models/caseStudy/casestudy");

module.exports = (req, res) => {
    try {
        const caseStudy = CaseStudy.deleteCaseStudy(req.body.company_name);
        res.send(caseStudy);
    } catch (e) {
        res.status(400).send(e);
    }
}