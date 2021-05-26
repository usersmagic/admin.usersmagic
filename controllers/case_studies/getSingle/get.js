
const CaseStudy = require("../../../models/caseStudy/casestudy");

module.exports = async (req, res) => {
    const id = req.body._id
    try {
        const caseStudy = await CaseStudy.findOne({ _id: id })
        res.send(caseStudy);
    } catch (e) {
        res.status(404).send(e)
    }
}