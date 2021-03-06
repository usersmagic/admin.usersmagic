window.onload = () => {
  listenCreateNewContentItemButton(document); // Listen for createNewContent button

  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const unknownError = document.getElementById('unknown-error');

  form.onsubmit = event => {
    event.preventDefault();
    badRequestError.style.display = unknownError.style.display = 'none';

    const name = document.getElementById('name-input').value.trim();
    const alpha2_code = document.getElementById('alpha2-code-input').value.trim();
    const phone_code = document.getElementById('phone-code-input').value.trim();
    const currency = document.getElementById('currency-input').value.trim();
    const min_payment_amount = document.getElementById('minimum-payment-amount-input').value.trim();
    const credit_per_user = document.getElementById('credit-per-user-input').value.trim();
    
    const data = {
      name,
      alpha2_code,
      phone_code,
      currency,
      min_payment_amount,
      credit_per_user
    };

    serverRequest('/countries/create', 'POST', data, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        return unknownError.style.display = 'block';
      } else {
        return window.location.reload();
      }
    });
  };

  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-country-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }
  });
}
