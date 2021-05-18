window.onload = () => {
  listenCreateNewContentItemButton(document);

  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const unknownError = document.getElementById('unknown-error');
  const companies = JSON.parse(document.getElementById('companies').value);
  const options = JSON.parse(document.getElementById('options').value);

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

    if ((event.target.classList.contains('next-page-button') ||event.target.parentNode.classList.contains('next-page-button')) && companies.length == options.limit ) {
      options.skip += options.limit;
      console.log("burada");
      window.location = '/companies' + createQueryFromFiltersAndOptions(filters, options);
    }

    if ((event.target.classList.contains('previous-page-button') || event.target.parentNode.classList.contains('previous-page-button')) && options.skip) {
      options.skip = Math.max(options.skip - options.limit, 0);
      window.location = '/companies' + createQueryFromFiltersAndOptions(filters,options);
    }
  });
}
