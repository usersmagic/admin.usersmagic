
const CaseStudy = require("../../../models/caseStudy/casestudy");

module.exports = async (req, res) => {
    try {
        const caseStudy = await CaseStudy.findOneAndUpdate({company_name: req.body.company_name}, {
            company_logo: req.body.company_logo,
            main_title: req.body.main_title,
            main_description: req.body.main_description,
            main_company_image: req.body.main_company_image,
            company_name: req.body.company_name,
            company_location: req.body.company_location,
            company_industry: req.body.company_industry,
            company_ipo: req.body.company_ipo,
            company_website: req.body.company_website,
            company_employee_number: req.body.company_employee_number,
            company_established_year: req.body.company_established_year,
            company_speciality: req.body.company_speciality,
            company_stage: req.body.company_stage,
            company_type: req.body.company_type,
            company_personal_name: req.body.company_personal_name,
            company_personal_role: req.body.company_personal_role,
            company_personal_quote: req.body.company_personal_quote,
            company_personal_image: req.body.company_personal_image,
            context_text: req.body.context_text,
            problem_text: req.body.problem_text,
            solution_text: req.body.solution_text,
            results_text: req.body.results_text
        })
        await caseStudy.save();
        res.status(200).send(caseStudy);
    } catch (e) {
        res.status(404).send(e);
    }
}