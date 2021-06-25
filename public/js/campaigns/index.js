let usedQuestionIds = [];

function addQuestion (type, question, wrapper) {
  const eachSearchQuestion = document.createElement('div');
  eachSearchQuestion.classList.add('each-search-question');
  eachSearchQuestion.id = question._id.toString();

  const span = document.createElement('span');
  span.innerHTML = question.name;
  eachSearchQuestion.appendChild(span);

  if (type == 'search') {
    const iAdd = document.createElement('i');
    iAdd.classList.add('fas');
    iAdd.classList.add('fa-plus');
    iAdd.classList.add('add-question-button');
    eachSearchQuestion.appendChild(iAdd);
  } else {
    const iRemove = document.createElement('i');
    iRemove.classList.add('fas');
    iRemove.classList.add('fa-minus');
    iRemove.classList.add('remove-question-button');
    eachSearchQuestion.appendChild(iRemove);

    const iDown = document.createElement('i');
    iDown.classList.add('fas');
    iDown.classList.add('fa-chevron-down');
    iDown.classList.add('move-down-question-button');
    eachSearchQuestion.appendChild(iDown);

    const iUp = document.createElement('i');
    iUp.classList.add('fas');
    iUp.classList.add('fa-chevron-up');
    iUp.classList.add('move-up-question-button');
    eachSearchQuestion.appendChild(iUp);
  }

  wrapper.appendChild(eachSearchQuestion);
}

window.onload = () => {
  listenCreateNewContentItemButton(document); // Listen for createNewContent button
  listenCheckedInputs(document); // Listen for checked inputs
  listenDropDownListInputs(document); // Listen for drop down items
  listenImageInputs(document); // Listen for image inputs

  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const unknownError = document.getElementById('unknown-error');

  form.onsubmit = event => {
    event.preventDefault();
    badRequestError.style.display = unknownError.style.display = 'none';

    const name = document.getElementById('name-input').value.trim();
    const image = document.getElementById('image-input').value;
    const description = document.getElementById('description-input').value.trim();
    const information = document.getElementById('information-input').value.trim();
    const price = document.getElementById('price-input').value.trim();
    const isFree = JSON.parse(document.getElementById('is-free-input').value).length ? true : false;
    const countries = JSON.parse(document.getElementById('countries-input').value.trim());
    const gender = document.getElementById('gender-input').value.trim();
    const minAge = document.getElementById('min-age-input').value.trim();
    const maxAge = document.getElementById('max-age-input').value.trim();
    const questions = [];

    const questionNodes = document.querySelector('.questions-wrapper').childNodes;
    for (let i = 0; i < questionNodes.length; i++)
      questions.push(questionNodes[i].id);
    
    const data = {
      name,
      description,
      information,
      price,
      is_free: isFree,
      countries,
      gender,
      min_birth_year: (new Date).getFullYear() - maxAge,
      max_birth_year: (new Date).getFullYear() - minAge,
      questions
    };

    serverRequest('/campaigns/create', 'POST', data, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        return unknownError.style.display = 'block';
      } else {
        window.location = '/campaigns';
      }
    });
  };

  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-campaign-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }

    if (event.target.classList.contains('each-campaign-submitions-button')) {
      window.location = `/campaigns/submitions?id=${event.target.id}`;
    }

    // if (event.target.classList.contains('each-campaign-edit-button')) {
    //   window.location = `/questions/edit?id=${event.target.id}`;
    // }

    if (event.target.classList.contains('each-campaign-start-button')) {
      if (confirm("Are you sure you want to start this campaign?")) {
        serverRequest('/campaigns/start?id=' + event.target.id, 'GET', {}, res => {
          if (!res.success)
            return alert("An error occured. Error message: " + res.error);
          return location.reload();
        });
      }
    }
    if (event.target.classList.contains('each-campaign-stop-button')) {
      if (confirm("Are you sure you want to stop this campaign?")) {
        serverRequest('/campaigns/stop?id=' + event.target.id, 'GET', {}, res => {
          if (!res.success)
            return alert("An error occured. Error message: " + res.error);
          return location.reload();
        });
      }
    }

    if (event.target.classList.contains('add-question-button')) {
      const question = {
        _id: event.target.parentNode.id,
        name: event.target.parentNode.childNodes[0].innerHTML
      };
      usedQuestionIds.push(question._id);
      event.target.parentNode.remove();
      addQuestion('add', question, document.querySelector('.questions-wrapper'));
    }

    if (event.target.classList.contains('remove-question-button')) {
      const question = {
        _id: event.target.parentNode.id,
        name: event.target.parentNode.childNodes[0].innerHTML
      };
      usedQuestionIds = usedQuestionIds.filter(id => id != question._id);
      event.target.parentNode.remove();
    }

    if (event.target.classList.contains('move-up-question-button') && event.target.parentNode.previousElementSibling) {
      event.target.parentNode.parentNode.insertBefore(event.target.parentNode, event.target.parentNode.previousElementSibling);
    }
    if (event.target.classList.contains('move-down-question-button') && event.target.parentNode.nextElementSibling) {
      event.target.parentNode.parentNode.insertBefore(event.target.parentNode.nextElementSibling, event.target.parentNode);
    }
  });

  const searchQuestionInput = document.getElementById('search-question-input');

  searchQuestionInput.oninput = event => {
    const filters = {}, options = {skip: 0, limit: 20};

    if (event.target.value.trim().length)
      filters.name = event.target.value.trim();
    if (usedQuestionIds.length)
      filters.not_id = usedQuestionIds;

    serverRequest('/campaigns/questions' + createQueryFromFiltersAndOptions(filters, options), 'GET', {}, res => {
      if (!res.success) {
        if (res.error)
          return alert('An unknown error occured. Error message: ' + res.error);
        return alert('An unknown error occured.');
      } else {
        if (res.questions.length) {
          document.querySelector('.search-questions-wrapper').innerHTML = '';
          res.questions.forEach(question => addQuestion('search', question, document.querySelector('.search-questions-wrapper')));
        } else {
          document.querySelector('.search-questions-wrapper').innerHTML = 'No questions found';
        }
      }
    });
  }
}
