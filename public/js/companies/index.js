window.onload = () => {
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

    if (event.target.classList.contains('each-company-edit-button')) {
      window.location = `/companies/edit?id=${event.target.id}`;
    }
  });
}
