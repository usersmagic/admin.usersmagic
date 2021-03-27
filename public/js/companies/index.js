window.onload = () => {
  listenCreateNewContentItemButton(document);

  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const unknownError = document.getElementById('unknown-error');

  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-company-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }

    if(event.target.classList.contains('filter-companies-button') || event.target.parentNode.classList.contains('filter-companies-button')){
      const company_name = document.getElementById('filter-companyname-input').value;
      const email = document.getElementById('filter-email-input').value;

      window.location = `/companies?company_name=${company_name}&email=${email}`;
    }

    if(event.target.classList.contains('password-reset') || event.target.parentNode.classList.contains('password-reset')){
      const company_name = event.target.attributes.value.nodeValue;
      const new_pass = document.getElementsByClassName("general-input-with-border "+company_name)[0];
      const data = {
        company_name: company_name,
        password: new_pass.value,
      }
      serverRequest(`/companies/reset`, 'POST',data, res =>{
        if (!res.success) return alert('An error occured. Error message: '+res.error);
        alert('Password changed successfully');
        new_pass.value = "";
      })

    }
  });
}
