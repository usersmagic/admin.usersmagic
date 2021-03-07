window.onload = () => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-question-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }

    if (event.target.classList.contains('each-question-approve-button')) {
      const price = event.target.parentNode.childNodes[2].value;

      if (!price || isNaN(parseInt(price)))
        return alert("Please write an integer price before approving this target");

      if (confirm('Are you sure you want to approve this target?')) {
        serverRequest(`/targets/approve?id=${event.target.id}`, 'POST', {
          price: parseInt(price)
        }, res => {
          if (!res.success) {
            return alert('An error occured. Error message: ' + res.error);
          } else {
            return event.target.parentNode.parentNode.remove();
          }
        });
      }
    }
  });
}
