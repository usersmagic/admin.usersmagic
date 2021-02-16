window.onload = () => {
  listenCreateNewContentItemButton(document); // Listen for createNewContent button
  listenCheckedInputs(document); // Listen for checked inputs

  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const passwordLengthError = document.getElementById('password-length-error');
  const passwordConfirmError = document.getElementById('password-confirm-error');
  const alreadyUsedUsernameError = document.getElementById('already-used-username-error');
  const unknownError = document.getElementById('unknown-error');

  form.onsubmit = event => {
    event.preventDefault();
    badRequestError.style.display = passwordLengthError.style.display = passwordConfirmError.style.display = alreadyUsedUsernameError.style.display = unknownError.style.display = 'none';

    const username = document.getElementById('username-input').value.trim();
    const name = document.getElementById('name-input').value.trim();
    const password = document.getElementById('password-input').value.trim();
    const confirmPassword = document.getElementById('confirm-password-input').value.trim();
    const roles = JSON.parse(document.getElementById('roles-input').value.trim());
    const is_global = JSON.parse(document.getElementById('is-global-input').value.trim()).length ? true : false;
    const countries = JSON.parse(document.getElementById('countries-input').value.trim());

    if (!username.length || !name.length || !password.length || !roles.length || (!is_global && !countries.length))
      return badRequestError.style.display = 'flex';

    if (password.length < 10)
      return passwordLengthError.style.display = 'flex';

    if (password != confirmPassword)
      return passwordConfirmError.style.display = 'flex';

    const data = {
      username,
      name,
      password,
      roles,
      is_global,
      countries
    };

    serverRequest('/root_admin/admins/create', 'POST', data, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        else if (res.error == 'password_length')
          return passwordLengthError.style.display = 'block';
        else
          return unknownError.style.display = 'block';
      } else {
        return location.reload();
      }
    })
  };

  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-admin-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }

    if (event.target.classList.contains('each-admin-delete-button')) {
      createConfirm({
        title: 'Are you sure?',
        text: 'Please confirm you want to delete this admin. This process cannot be undone.',
        accept: 'Continue',
        reject: 'Cancel'
      }, res => {
        if (res) {
          serverRequest('/root_admin/admins/delete?id=' + event.target.id, 'GET', {}, res => {
            if (!res.success && res.error)
              return alert(res.error);
            return location.reload();
          });
        }
      })
    }
  })
}
