window.onload = () => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-payment-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }

    if (event.target.classList.contains('each-payment-approve-button')) {
      if (confirm('Are you sure you want to approve this payment?')) {
        serverRequest('/payments/approve?id=' + event.target.id, 'GET', {}, res => {
          if (!res.success)
            return alert('An error occured. Error Message: ' + res.error);

          return event.target.parentNode.parentNode.remove();
        });
      }
    }
  });
}
