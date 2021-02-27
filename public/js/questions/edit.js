window.onload = () => {
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
    const type = document.getElementById('question-type').value;

    const data = {
      name,
      description,
      text
    };

    if (type == 'short_text' || type == 'long_text') {
      const answerLength = document.getElementById('answer-length-input').value.trim();
      data.answer_length = answerLength;
    }

    if (type == 'checked' || type == 'radio') {
      const choices = document.getElementById('choices-input').value.split(',').map(each => each.trim()).filter(each => each.length);
      const otherOption = JSON.parse(document.getElementById('other-option-input').value).length ? true : false;
      data.choices = choices;
      data.other_option = otherOption;
    }

    if (type == 'range') {
      const rangeMinimum = document.getElementById('range-minimum-input').value.trim();
      const rangeMaximum = document.getElementById('range-maximum-input').value.trim();
      const minimumExplanation = document.getElementById('minimum-explanation-input').value.trim();
      const maximumExplanation = document.getElementById('maximum-explanation-input').value.trim();
      data.min_value = rangeMinimum;
      data.max_value = rangeMaximum;
      data.min_explanation = minimumExplanation;
      data.max_explanation = maximumExplanation;
    }

    serverRequest('/questions/edit?id=' + document.getElementById('question-id').value, 'POST', data, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        return unknownError.style.display = 'block';
      } else {
        location.reload();
      }
    });
  };


  document.addEventListener('click', event => {
    if (event.target.classList.contains('edit-go-back-button')) {
      window.history.back();
    }
  });
}
