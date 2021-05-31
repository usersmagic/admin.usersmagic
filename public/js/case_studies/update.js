window.onload = () => {

    const editCaseStudyForm = document.getElementById('edit-case-study-form');
    editCaseStudyForm.style.display = 'flex';

    const id = location.href.split('?')[1].split('=')[1];

    const submitButton = document.getElementById('submit-button');
    const mainTitleEdit = document.getElementById('main-title');
    const mainDescriptionEdit = document.getElementById('main-description');
    const companyNameEdit = document.getElementById('company-name');
    const companyLocationEdit = document.getElementById('company-location');
    const companyIndustryEdit = document.getElementById('company-industry');
    const companyipoEdit = document.getElementById('company-ipo');
    const companyWebsiteEdit = document.getElementById('company-website');
    const companyEmployeeNumberEdit = document.getElementById('company-employee-number');
    const companyEstablishedYearEdit = document.getElementById('company-established-year');
    const companySpecialityEdit = document.getElementById('company-speciality');
    const companyTypeEdit = document.getElementById('company-type');
    const companyStageEdit = document.getElementById('company-stage');
    const personalNameEdit = document.getElementById('personal-name');
    const personalRoleEdit = document.getElementById('personal-role');
    const personalQuoteEdit = document.getElementById('personal-quote');
    const contextParagraphEdit = document.getElementById('context-paragraph');
    const problemParagraphEdit = document.getElementById('problem-paragraph');
    const solutionParagraphEdit = document.getElementById('solution-paragraph');
    const resultsParagraphEdit = document.getElementById('results-paragraph');
    const goBackButton = document.getElementById('go-back-button');

    goBackButton.addEventListener('click', () => {
        location.href = '/case_studies';
    })

    
    //const xhr = new XMLHttpRequest();
    //xhr.open('POST', '/case_studies/edit');
    //xhr.setRequestHeader('Content-Type', 'application/json');

    //xhr.onreadystatechange = () => {
    //    if (xhr.readyState === XMLHttpRequest.DONE) {
    //        if (xhr.status === 200) {
    //            alert('success');
    //        } else {
    //            alert('An error occured please try again');
    //        }
    //    }
    //}
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/case_studies/getSingle');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.send(JSON.stringify({
        _id: id
    }))

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
               const caseStudy = JSON.parse(xhr.response)

                mainTitleEdit.value = caseStudy.main_title;
                mainDescriptionEdit.value = caseStudy.main_description;
                companyNameEdit.value = caseStudy.company_name;
                companyLocationEdit.value = caseStudy.company_location;
                companyIndustryEdit.value = caseStudy.company_industry;
                companyipoEdit.value = caseStudy.company_ipo;
                companyWebsiteEdit.value = caseStudy.company_website;
                companyEmployeeNumberEdit.value = caseStudy.company_employee_number;
                companyEstablishedYearEdit.value = caseStudy.company_established_year;
                companySpecialityEdit.value = caseStudy.company_speciality;
                companyTypeEdit.value = caseStudy.company_type;
                companyStageEdit.value = caseStudy.company_stage;
                personalNameEdit.value = caseStudy.company_personal_name;
                personalRoleEdit.value = caseStudy.company_personal_role;
                personalQuoteEdit.value = caseStudy.company_personal_quote;
                contextParagraphEdit.value = caseStudy.context_text;
                problemParagraphEdit.value = caseStudy.problem_text;
                solutionParagraphEdit.value = caseStudy.solution_text;
                resultsParagraphEdit.value = caseStudy.results_text;
                
                submitButton.addEventListener('click', () => {
                    
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '/case_studies/edit');
                    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {

                                mainTitleEdit.value = '';
                                mainDescriptionEdit.value = '';
                                companyNameEdit.value = '';
                                companyLocationEdit.value = '';
                                companyIndustryEdit.value = '';
                                companyipoEdit.value = '';
                                companyWebsiteEdit.value = '';
                                companyEmployeeNumberEdit.value = '';
                                companyEstablishedYearEdit.value = '';
                                companySpecialityEdit.value = '';
                                companyTypeEdit.value = '';
                                companyStageEdit.value = '';
                                personalNameEdit.value = '';
                                personalRoleEdit.value = '';
                                personalQuoteEdit.value = '';
                                contextParagraphEdit.value = '';
                                problemParagraphEdit.value = '';
                                solutionParagraphEdit.value = '';
                                resultsParagraphEdit.value = '';

                                alert('Successfully updated the case study.')
                                location.href = '/case_studies';

                            } else if (xhr.status === 404 || xhr.status === 400){
                                return alert('Please fill each required field.');
                            }
                        }
                    }
                    xhr.send(JSON.stringify({
                        id: id,
                        main_title: mainTitleEdit.value,
                        main_description: mainDescriptionEdit.value,
                        company_name: companyNameEdit.value,
                        company_location: companyLocationEdit.value,
                        company_industry: companyIndustryEdit.value,
                        company_ipo: companyipoEdit.value,
                        company_website: companyWebsiteEdit.value,
                        company_employee_number: companyEmployeeNumberEdit.value,
                        company_established_year: companyEstablishedYearEdit.value,
                        company_speciality: companySpecialityEdit.value,
                        company_stage: companyStageEdit.value,
                        company_type: companyTypeEdit.value,
                        company_personal_name: personalNameEdit.value,
                        company_personal_role: personalRoleEdit.value,
                        company_personal_quote: personalQuoteEdit.value,
                        context_text: contextParagraphEdit.value,
                        problem_text: problemParagraphEdit.value,
                        solution_text: solutionParagraphEdit.value,
                        results_text: resultsParagraphEdit.value,
                    }));
                })

            } else {
                alert('An error occured please try again');
            }
        }
    }
}