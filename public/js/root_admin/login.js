window.onload = () => {
  const loginForm = document.querySelector('.login-form');

  const badRequestError = document.getElementById('bad-request-error');
  const wrongPasswordError = document.getElementById('wrong-password-error');
  const networkError = document.getElementById('network-error');
  const unknownError = document.getElementById('unknown-error');

  loginForm.onsubmit = event => {
    event.preventDefault();

    badRequestError.style.display =
    wrongPasswordError.style.display = 
    networkError.style.display =
    unknownError.style.display = 'none';

    const password = document.getElementById('password-input').value.trim();

    if (!password || !password.length)
      return badRequestError.style.display = 'block';

    serverRequest('/root_admin/login', 'POST', {
      password
    }, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        else if (res.error == 'password_verification')
          return wrongPasswordError.style.display = 'block';
        else if (res.error == 'network_error')
          return networkError.style.display = 'block';
        else
          return unknownError.style.display = 'block';
      } else {
        return window.location = '/root_admin';
      }
    });
  }
}
