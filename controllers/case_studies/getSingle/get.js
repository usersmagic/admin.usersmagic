
const CaseStudy = require("../../../models/caseStudy/casestudy");

module.exports = async (req, res) => {
    const companyName = req.body.company_name
    try {
        const caseStudy = await CaseStudy.findOne({ company_name: companyName })
        res.send(caseStudy);
    } catch (e) {
        res.status(404).send(e)
    }
}