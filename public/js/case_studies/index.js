
window.onload = () => {
  // DOM elements
  const createCaseStudyButton = document.getElementById('create-case-study-button');
  const createCaseStudyForm = document.getElementById('create-case-study-form');
  const submitButton = document.getElementById('submit-button');
  const goBackButton = document.getElementById('go-back-button');
  const allContentInnerWrapper = document.getElementById('all-content-inner-wrapper');
  var companyLogo = document.getElementById('company-logo');
  var mainTitle = document.getElementById('main-title');
  var mainDescription = document.getElementById('main-description');
  var headlineImage = document.getElementById('headline-image');
  var companyName = document.getElementById('company-name');
  var companyLocation = document.getElementById('company-location');
  var companyIndustry = document.getElementById('company-industry');
  var companyipo = document.getElementById('company-ipo');
  var companyWebsite = document.getElementById('company-website');
  var companyEmployeeNumber = document.getElementById('company-employee-number');
  var companyEstablishedYear = document.getElementById('company-established-year');
  var companySpeciality = document.getElementById('company-speciality');
  var companyType = document.getElementById('company-type');
  var companyStage = document.getElementById('company-stage');
  var personalName = document.getElementById('personal-name');
  var personalRole = document.getElementById('personal-role');
  var personalQuote = document.getElementById('personal-quote');
  var personalPhoto = document.getElementById('personal-photo');
  var contextParagraph = document.getElementById('context-paragraph');
  var problemParagraph = document.getElementById('problem-paragraph');
  var solutionParagraph = document.getElementById('solution-paragraph');
  var resultsParagraph = document.getElementById('results-paragraph');
  var language = document.getElementById('language-input');
  var imageInputs = document.querySelectorAll('.each-image-input');
  var saveChangesButton = document.createElement('div');
  var saveChangesButtonSpan = document.createElement('span');
  var errorLine = document.getElementById('general-input-error-line');

  listenImageInputs(document);
  listenCheckedInputs(document);

  const data = {}

  serverRequest('/case_studies/getAll', 'GET', data, (caseStudiesArray) => {

    caseStudiesArray.forEach(caseStudy => {
      const eachItemWrapper = document.createElement('div');
      eachItemWrapper.classList.add('each-item-wrapper');
      const eachItemHeader = document.createElement('div');
      eachItemHeader.classList.add('each-item-header');
      const eachItemTitle = document.createElement('div');
      eachItemTitle.classList.add('each-item-title');
      eachItemTitle.innerHTML = caseStudy.company_name;
      const eachItemSubtitle = document.createElement('div');
      eachItemSubtitle.classList.add('each-item-subtitle');
      eachItemSubtitle.innerHTML = caseStudy.main_title;
      const trashCanIcon = document.createElement('i');
      trashCanIcon.classList.add('fa');
      trashCanIcon.classList.add('fa-trash');
      const editIcon = document.createElement('i');
      editIcon.classList.add('fas');
      editIcon.classList.add('fa-edit')
      eachItemHeader.appendChild(eachItemTitle);
      eachItemHeader.appendChild(eachItemSubtitle);
      eachItemHeader.appendChild(editIcon);
      eachItemHeader.appendChild(trashCanIcon);
      eachItemWrapper.appendChild(eachItemHeader);
      allContentInnerWrapper.appendChild(eachItemWrapper);
      editIcon.addEventListener('click', () => {
        location.href = `/case_studies/update?id=${caseStudy._id}`;
      })
      trashCanIcon.addEventListener('click', () => {
        if (confirm('Are you sure to delete this case study')) {
          const data_delete = {
            company_name: caseStudy.company_name
          }
  
          serverRequest('case_studies/delete', 'POST', data_delete, (response) => {
            if (!response.error) {
              location.reload();
            } else if (!response.success && response.error === 'bad_request') {
              alert("An error occured please try again.");
            }
          })

        } else {
          ;
        }
      })
    })
  })
  
  createCaseStudyButton.addEventListener('click', () => {
    createCaseStudyForm.style.display = 'flex';
    allContentInnerWrapper.style.display = 'none';
  })
  goBackButton.addEventListener('click', () => {
    createCaseStudyForm.style.display = 'none';
    allContentInnerWrapper.style.display = 'flex';
    imageInputs[0].style.display = 'flex';
    imageInputs[1].style.display = 'flex';
    imageInputs[2].style.display = 'flex';
    errorLine.style.display = 'none';
    saveChangesButton.remove();
    if (submitButton.style.display === 'none') {
      submitButton.style.display = 'flex';
    }
    
    mainTitle.value = mainDescription.value = companyName.value = companyLocation.value =companyIndustry.value = companyipo.value =companyWebsite.value =companyEmployeeNumber.value =companyEstablishedYear.value =companySpeciality.value =companyType.value =companyStage.value =personalName.value =personalRole.value =personalQuote.value =contextParagraph.value =problemParagraph.value =solutionParagraph.value =resultsParagraph.value =companyLogo.value =personalPhoto.value =headlineImage.value = '';
  })
  submitButton.addEventListener('click', () => {
    allContentInnerWrapper.style.display = 'none';
    // DOM Elements
    companyLogo = document.getElementById('company-logo').value;
    mainTitle = document.getElementById('main-title').value;
    mainDescription = document.getElementById('main-description').value;
    headlineImage = document.getElementById('headline-image').value;
    companyName = document.getElementById('company-name').value;
    companyLocation = document.getElementById('company-location').value;
    companyIndustry = document.getElementById('company-industry').value;
    companyipo = document.getElementById('company-ipo').value;
    companyWebsite = document.getElementById('company-website').value;
    companyEmployeeNumber = document.getElementById('company-employee-number').value;
    companyEstablishedYear = document.getElementById('company-established-year').value;
    companySpeciality = document.getElementById('company-speciality').value;
    companyType = document.getElementById('company-type').value;
    companyStage = document.getElementById('company-stage').value;
    personalName = document.getElementById('personal-name').value;
    personalRole = document.getElementById('personal-role').value;
    personalQuote = document.getElementById('personal-quote').value;
    personalPhoto = document.getElementById('personal-photo').value;
    contextParagraph = document.getElementById('context-paragraph').value;
    problemParagraph = document.getElementById('problem-paragraph').value;
    solutionParagraph = document.getElementById('solution-paragraph').value;
    resultsParagraph = document.getElementById('results-paragraph').value;
    language = document.getElementById('language-input').value;
    
    const data_create = {
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
      results_text: resultsParagraph,
      language: language
    }

    serverRequest('/case_studies/create', 'POST', data_create, (response) => {
      console.log(response);
      if (!response.error) {
        alert('Case Study created');
        location.reload();
      } else if(!response.success && response.error === 'bad_request') {
        errorLine.style.display = 'flex';
        errorLine.style.color = '#ff0000';
        errorLine.innerHTML = 'Please be sure that you fill out all required fields.'
        errorLine.style.font = '600 16px helvetica';
      }
    })
  })
}