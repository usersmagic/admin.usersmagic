
window.onload = () => {
  listenCreateNewContentItemButton(document); // Listen for createNewContent button
  listenCheckedInputs(document); // Listen for checked inputs
  listenDropDownListInputs(document); // Listen for drop down items

  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const unknownError = document.getElementById('unknown-error');

  form.onsubmit = event => {
    event.preventDefault();
    badRequestError.style.display = unknownError.style.display = 'none';

    const name = document.getElementById('name-input').value.trim();
    const description = document.getElementById('description-input').value.trim();
    const text = document.getElementById('question-text-input').value.trim();
    const type = document.getElementById('question-type-input').value.trim();
    const answerLength = document.getElementById('answer-length-input').value.trim();
    const choices = document.getElementById('choices-input').value.split(',').map(each => each.trim()).filter(each => each.length);
    const otherOption = JSON.parse(document.getElementById('other-option-input').value).length ? true : false;
    const rangeMinimum = document.getElementById('range-minimum-input').value.trim();
    const rangeMaximum = document.getElementById('range-maximum-input').value.trim();
    const minimumExplanation = document.getElementById('minimum-explanation-input').value.trim();
    const maximumExplanation = document.getElementById('maximum-explanation-input').value.trim();
    const countries = JSON.parse(document.getElementById('countries-input').value.trim());

    const data = {
      name,
      description,
      text,
      type,
      countries
    };

    if ((type == 'short_text' || type == 'long_text') && answerLength.length)
      data.answer_length = answerLength;

    if (type == 'checked' || type == 'radio') {
      data.choices = choices;
      data.other_option = otherOption;
    }

    if (type == 'range') {
      data.min_value = rangeMinimum;
      data.max_value = rangeMaximum;
      data.min_explanation = minimumExplanation;
      data.max_explanation = maximumExplanation;
    }

    serverRequest('/questions/create', 'POST', data, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        return unknownError.style.display = 'block';
      } else {
        window.location = '/questions';
      }
    });
  };

  const filters = JSON.parse(document.getElementById('filters').value);
  const options = JSON.parse(document.getElementById('options').value);
  const questions = JSON.parse(document.getElementById('questions').value);

  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-question-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }

    if (event.target.classList.contains('each-question-edit-button')) {
      window.location = `/questions/edit?id=${event.target.id}`;
    }

    if ((event.target.classList.contains('previous-page-button') || event.target.parentNode.classList.contains('previous-page-button')) && options.skip) {
      options.skip = Math.max(options.skip - options.limit, 0);
      window.location = '/questions' + createQueryFromFiltersAndOptions(filters, options);
    }
    if ((event.target.classList.contains('next-page-button') || event.target.parentNode.classList.contains('next-page-button')) && questions.length == options.limit) {
      options.skip += options.limit;
      window.location = '/questions' + createQueryFromFiltersAndOptions(filters, options);
    }

    if (event.target.classList.contains('filter-questions-button') || event.target.parentNode.classList.contains('filter-questions-button')) {
      const name = document.getElementById('filter-name-input').value;
      const text = document.getElementById('filter-text-input').value;
      if (name && name.length)
        filters.name = name;
      else if (filters.name)
        delete filters.name;

      if (text && text.length)
        filters.text = text;
      else if (filters.text)
        delete filters.text;

      window.location = '/questions' + createQueryFromFiltersAndOptions(filters, options);
    }
  });
}
