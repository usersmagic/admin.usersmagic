
const mongoose = require("mongoose");

const caseStudySchema = mongoose.Schema({
    company_logo: {
        type: Buffer,
        required: false
    },
    main_title: {
        type: String,
        required: true
    },
    main_description: {
        type: String,
        required: true
    },
    main_company_image: {
        type: Buffer,
        required: false
    },
    company_name: {
        type: String,
        required: true
    },
    company_location: {
        type: String,
        required: false,
    },
    company_industry: {
        type: String,
        required: false,
    },
    company_ipo: {
        type: String,
        required: false,
    },
    company_website: {
        type: String,
        required: false,
    },
    company_employee_number: {
        type: String,
        required: false,
    },
    company_established_year: {
        type: String,
        required: false,
    },
    company_speciality: {
        type: String,
        required: false,
    },
    company_stage: {
        type: String,
        required: false,
    },
    company_type: {
        type: String,
        required: false,
    },
    company_personal_name: {
        type: String,
        required: true,
    },
    company_personal_role: {
        type: String,
        required: true,
    },
    company_personal_image: {
        type: Buffer,
        required: false,
    },
    company_personal_quote: {
        type: String,
        required: false
    },
    context_text: {
        type: String,
        required: false
    },
    problem_text: {
        type: String,
        required: false
    },
    solution_text: {
        type: String,
        required: false
    },
    results_text: {
        type: String,
        required: false
    }
});

caseStudySchema.statics.createNewCaseStudy = async function(body) {
    const caseStudy = new CaseStudy(body);
    await caseStudy.save();
    return caseStudy;
}

caseStudySchema.statics.editCaseStudy = async function( companyName, body ) {
    console.log("calisiyoooo")
    const caseStudy = await CaseStudy.findOneAndUpdate({company_name: companyName}, body)
    await caseStudy.save();
    return caseStudy;
}

caseStudySchema.statics.deleteCaseStudy = async function( companyName ) {
    const caseStudy = await CaseStudy.remove({ company_name: companyName });
    return caseStudy;
}

const CaseStudy = mongoose.model("caseStudy", caseStudySchema);

module.exports = CaseStudy;