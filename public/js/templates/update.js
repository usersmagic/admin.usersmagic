window.onload = () => {
  listenCheckedInputs(document); // Listen for checked inputs

  const id = document.getElementById('template-id').value;
  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const unknownError = document.getElementById('unknown-error');

  form.onsubmit = event => {
    event.preventDefault();
    badRequestError.style.display = unknownError.style.display = 'none';

    const title = document.getElementById('title-input').value.trim();
    const name = document.getElementById('name-input').value.trim();
    const description = document.getElementById('description-input').value.trim();
    const countries = JSON.parse(document.getElementById('countries-input').value.trim());

    serverRequest('/templates/update?id=' + id, 'POST', {
      title,
      name,
      description,
      countries
    }, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        return unknownError.style.display = 'block';
      } else {
        window.location.reload();
      }
    });
  };
}
