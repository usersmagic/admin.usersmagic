
window.onload = () => {

    // DOM Elements
    const createCaseStudyButton = document.getElementById("create-case-study-button");
    const createCaseStudyForm = document.getElementById("create-case-study-form");
    const submitButton = document.getElementById("submit-button");
    const goBackButton = document.getElementById("go-back-button");
    const allContentInnerWrapper = document.getElementById("all-content-inner-wrapper");
    const companyLogo = document.getElementById("company-logo").value;
    const mainTitle = document.getElementById("main-title").value;
    const mainDescription = document.getElementById("main-description").value;
    const headlineImage = document.getElementById("headline-image").value;
    const companyName = document.getElementById("company-name").value;
    const companyLocation = document.getElementById("company-location").value;
    const companyIndustry = document.getElementById("company-industry").value;
    const companyipo = document.getElementById("company-ipo").value;
    const companyWebsite = document.getElementById("company-website").value;
    const companyEmployeeNumber = document.getElementById("company-employee-number").value;
    const companyEstablishedYear = document.getElementById("company-established-year").value;
    const companySpeciality = document.getElementById("company-speciality").value;
    const companyType = document.getElementById("company-type").value;
    const companyStage = document.getElementById("company-stage").value;
    const personalName = document.getElementById("personal-name").value;
    const personalRole = document.getElementById("personal-role").value;
    const personalQuote = document.getElementById("personal-quote").value;
    const personalPhoto = document.getElementById("personal-photo").value;
    const contextParagraph = document.getElementById("context-paragraph").value;
    const problemParagraph = document.getElementById("problem-paragraph").value;
    const solutionParagraph = document.getElementById("solution-paragraph").value;
    const resultsParagraph = document.getElementById("results-paragraph").value;

    listenImageInputs(document);

    const xhr = new XMLHttpRequest();

    xhr.open("GET", "case_studies/getAll");
    xhr.setRequestHeader("Content-type","application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const caseStudiesArray = JSON.parse(xhr.response);
                caseStudiesArray.forEach(caseStudy => {
                    const eachItemWrapper = document.createElement("div");
                    eachItemWrapper.classList.add("each-item-wrapper");

                    const eachItemHeader = document.createElement("div");
                    eachItemHeader.classList.add("each-item-header");

                    const eachItemTitle = document.createElement("div");
                    eachItemTitle.classList.add("each-item-title");
                    eachItemTitle.innerHTML = caseStudy.company_name;

                    const eachItemSubtitle = document.createElement("div");
                    eachItemSubtitle.classList.add("each-item-subtitle");
                    eachItemSubtitle.innerHTML = caseStudy.main_title;

                    const trashCanIcon = document.createElement("i");
                    trashCanIcon.classList.add("fa");
                    trashCanIcon.classList.add("fa-trash");

                    const editIcon = document.createElement("i");
                    editIcon.classList.add("fas");
                    editIcon.classList.add("fa-edit")

                    eachItemHeader.appendChild(eachItemTitle);
                    eachItemHeader.appendChild(eachItemSubtitle);
                    eachItemHeader.appendChild(editIcon);
                    eachItemHeader.appendChild(trashCanIcon);

                    eachItemWrapper.appendChild(eachItemHeader);

                    allContentInnerWrapper.appendChild(eachItemWrapper);

                    editIcon.addEventListener("click", () => {
                        createCaseStudyForm.style.display = "flex";
                        allContentInnerWrapper.style.display = "none";
                        submitButton.style.display = "none";

                        const company_name = editIcon.parentNode.childNodes[0].innerHTML;
                    
                        //const xhr = new XMLHttpRequest();
                        //xhr.open("POST", "/case_studies/edit");
                        //xhr.setRequestHeader("Content-Type", "application/json");

                        //xhr.onreadystatechange = () => {
                        //    if (xhr.readyState === XMLHttpRequest.DONE) {
                        //        if (xhr.status === 200) {
                        //            alert("success");
                        //        } else {
                        //            alert("An error occured please try again");
                        //        }
                        //    }
                        //}
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", "/case_studies/getSingle");
                        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                        xhr.send(JSON.stringify({
                            company_name: company_name
                        }))

                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                if (xhr.status === 200) {
                                    const caseStudy = JSON.parse(xhr.response)
                                    
                                    createCaseStudyForm.style.display = "flex";
                                    allContentInnerWrapper.style.display = "none";
                                    const submitButton = document.getElementById("submit-button");
                                    const mainTitle = document.getElementById("main-title");
                                    const mainDescription = document.getElementById("main-description");
                                    const companyName = document.getElementById("company-name");
                                    const companyLocation = document.getElementById("company-location");
                                    const companyIndustry = document.getElementById("company-industry");
                                    const companyipo = document.getElementById("company-ipo");
                                    const companyWebsite = document.getElementById("company-website");
                                    const companyEmployeeNumber = document.getElementById("company-employee-number");
                                    const companyEstablishedYear = document.getElementById("company-established-year");
                                    const companySpeciality = document.getElementById("company-speciality");
                                    const companyType = document.getElementById("company-type");
                                    const companyStage = document.getElementById("company-stage");
                                    const personalName = document.getElementById("personal-name");
                                    const personalRole = document.getElementById("personal-role");
                                    const personalQuote = document.getElementById("personal-quote");
                                    const contextParagraph = document.getElementById("context-paragraph");
                                    const problemParagraph = document.getElementById("problem-paragraph");
                                    const solutionParagraph = document.getElementById("solution-paragraph");
                                    const resultsParagraph = document.getElementById("results-paragraph");
                                    const companyLogo = document.getElementById("company-logo");
                                    const headlineImage = document.getElementById("headline-image");
                                    const personalPhoto = document.getElementById("personal-photo");

                                    mainTitle.value = caseStudy.main_title;
                                    mainDescription.value = caseStudy.main_description;
                                    companyName.value = caseStudy.company_name;
                                    companyLocation.value = caseStudy.company_location;
                                    companyIndustry.value = caseStudy.company_industry;
                                    companyipo.value = caseStudy.company_ipo;
                                    companyWebsite.value = caseStudy.company_website;
                                    companyEmployeeNumber.value = caseStudy.company_employee_number;
                                    companyEstablishedYear.value = caseStudy.company_established_year;
                                    companySpeciality.value = caseStudy.company_speciality;
                                    companyType.value = caseStudy.company_type;
                                    companyStage.value = caseStudy.company_stage;
                                    personalName.value = caseStudy.company_personal_name;
                                    personalRole.value = caseStudy.company_personal_role;
                                    personalQuote.value = caseStudy.company_personal_quote;
                                    contextParagraph.value = caseStudy.context_text;
                                    problemParagraph.value = caseStudy.problem_text;
                                    solutionParagraph.value = caseStudy.solution_text;
                                    resultsParagraph.value = caseStudy.results_text;

                                    companyLogo.value = caseStudy.company_logo;
                                    personalPhoto.value = caseStudy.company_personal_image;
                                    headlineImage.value = caseStudy.main_company_image;

                                    listenImageInputs(document);

                                    const saveChangesButton = document.createElement("div")
                                    saveChangesButton.classList.add("general-seablue-button");
                                    saveChangesButton.style.width = "250px"
                                    const saveChangesButtonSpan = document.createElement("span");
                                    saveChangesButtonSpan.innerHTML = "Submit"

                                    saveChangesButton.appendChild(saveChangesButtonSpan);

                                    createCaseStudyForm.appendChild(saveChangesButton);
                                    
                                    saveChangesButton.addEventListener("click", () => {
                                        
                                        const xhr = new XMLHttpRequest();
                                        xhr.open("POST", "/case_studies/edit");
                                        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                                        xhr.send(JSON.stringify({
                                            company_logo: companyLogo.value,
                                            main_title: mainTitle.value,
                                            main_description: mainDescription.value,
                                            main_company_image: headlineImage.value,
                                            company_name: companyName.value,
                                            company_location: companyLocation.value,
                                            company_industry: companyIndustry.value,
                                            company_ipo: companyipo.value,
                                            company_website: companyWebsite.value,
                                            company_employee_number: companyEmployeeNumber.value,
                                            company_established_year: companyEstablishedYear.value,
                                            company_speciality: companySpeciality.value,
                                            company_stage: companyStage.value,
                                            company_type: companyType.value,
                                            company_personal_name: personalName.value,
                                            company_personal_role: personalRole.value,
                                            company_personal_quote: personalQuote.value,
                                            company_personal_image: personalPhoto.value,
                                            context_text: contextParagraph.value,
                                            problem_text: problemParagraph.value,
                                            solution_text: solutionParagraph.value,
                                            results_text: resultsParagraph.value
                                        }));

                                        xhr.onreadystatechange = () => {
                                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                                if (xhr.status === 200) {
                                                    alert("Successfully updated the case study.")
                                                    submitButton.style.display = "flex";
                                                    createCaseStudyForm.style.display = "none";
                                                    allContentInnerWrapper.style.display = "flex";
                                                    createCaseStudyForm.removeChild(saveChangesButton);
                                                } else {
                                                    alert(xhr.status)
                                                }
                                            }
                                        }
                                    })

                                } else {
                                    alert("An error occured please try again");
                                }
                            }
                        }
                    })

                    trashCanIcon.addEventListener("click", () => {
                        if (confirm("Are you sure to delete this case study")) {
                            xhr.open("POST", "case_studies/delete");
                            xhr.setRequestHeader("Content-type","application/json");
                            xhr.send(JSON.stringify({
                                company_name: caseStudy.company_name
                            }))
                            xhr.onreadystatechange = () => {
                                if (xhr.readyState === XMLHttpRequest.DONE) {
                                    if (xhr.status === 200) {
                                        location.reload();
                                    }
                                    else {
                                        alert("An error occured please try again")
                                    }
                                }
                            }
                            
                        } else {
                            ;
                        }
                    })
                })
            }
        }
    }
    xhr.send();
    

    createCaseStudyButton.addEventListener("click", () => {
        createCaseStudyForm.style.display = "flex";
        allContentInnerWrapper.style.display = "none";
    })

    goBackButton.addEventListener("click", () => {
        createCaseStudyForm.style.display = "none";
        allContentInnerWrapper.style.display = "flex";
    })

    submitButton.addEventListener("click", () => {
        allContentInnerWrapper.style.display = "none";
        
        const errorLine = document.getElementById("general-input-error-line");

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "case_studies/create");
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 201) {
                    alert("Case Study created");
                } else {
                    errorLine.style.display = "flex";
                    errorLine.style.color = "#ff0000";
                    errorLine.innerHTML = "Please be sure that you fill out all required fields."
                }
            }
        }

        xhr.send(JSON.stringify({
            company_logo: companyLogo,
            main_title: mainTitle,
            main_description: mainDescription,
            main_company_image: headlineImage,
            company_name: companyName,
            company_location: companyLocation,
            company_industry: companyIndustry,
            company_ipo: companyipo,
            company_website: companyWebsite,
            company_employee_number: companyEmployeeNumber,
            company_established_year: companyEstablishedYear,
            company_speciality: companySpeciality,
            company_stage: companyStage,
            company_type: companyType,
            company_personal_name: personalName,
            company_personal_role: personalRole,
            company_personal_quote: personalQuote,
            company_personal_image: personalPhoto,
            context_text: contextParagraph,
            problem_text: problemParagraph,
            solution_text: solutionParagraph,
            results_text: resultsParagraph
        }));
    })
}