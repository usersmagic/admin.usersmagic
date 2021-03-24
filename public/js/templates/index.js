window.onload = () => {
  listenCreateNewContentItemButton(document); // Listen for createNewContent button
  listenCheckedInputs(document); // Listen for checked inputs
  listenImageInputs(document); // Listen for image inputs

  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const unknownError = document.getElementById('unknown-error');

  form.onsubmit = event => {
    event.preventDefault();
    badRequestError.style.display = unknownError.style.display = 'none';

    const title = document.getElementById('title-input').value.trim();
    const name = document.getElementById('name-input').value.trim();
    const image = document.getElementById('image-input').value;
    const description = document.getElementById('description-input').value.trim();
    const countries = JSON.parse(document.getElementById('countries-input').value.trim());

    serverRequest('/templates/create', 'POST', {
      title,
      name,
      image,
      description,
      countries
    }, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        return unknownError.style.display = 'block';
      } else {
        window.location = '/templates';
      }
    });
  };

  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-template-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }

    if (event.target.classList.contains('each-template-order-button') && event.target.parentNode.parentNode.previousElementSibling) {
      serverRequest('/templates/order?id=' + event.target.id, 'GET', {}, res => {
        if (!res.success)
          return confirm("An error occured. Error message: " + res.error);
        
        event.target.parentNode.parentNode.parentNode.insertBefore(event.target.parentNode.parentNode, event.target.parentNode.parentNode.previousElementSibling);
      });
    }

    if (event.target.classList.contains('each-template-edit-button')) {
      window.location = '/templates/edit?id=' + event.target.id;
    }

    if (event.target.classList.contains('each-template-start-button')) {
      serverRequest('/templates/start?id=' + event.target.id, 'GET', {}, res => {
        if (!res.success)
          return alert('An unknown error occured. Error message: ' + res.error);

        event.target.classList.remove('fa-play');
        event.target.classList.remove('each-template-start-button');
        event.target.classList.add('fa-pause');
        event.target.classList.add('each-template-stop-button');
      });
    }

    if (event.target.classList.contains('each-template-stop-button')) {
      serverRequest('/templates/stop?id=' + event.target.id, 'GET', {}, res => {
        if (!res.success)
          return alert('An unknown error occured. Error message: ' + res.error);

        event.target.classList.remove('fa-pause');
        event.target.classList.remove('each-template-stop-button');
        event.target.classList.add('fa-play');
        event.target.classList.add('each-template-start-button');
      });
    }
  });
}
