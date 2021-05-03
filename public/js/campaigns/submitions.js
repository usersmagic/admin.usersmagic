window.onload = () => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-submition-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }

    if (event.target.classList.contains('each-submition-approve-button')) {
      if (confirm('Are you sure you want to approve this submition?')) {
        serverRequest(`/campaigns/submitions/approve?id=${event.target.id}`, 'GET', {}, res => {
          if (!res.success) {
            return alert('An error occured. Error message: ' + res.error);
          } else {
            return event.target.parentNode.parentNode.remove();
          }
        });
      }
    }

    if (event.target.classList.contains('each-submition-reject-button')) {
      const reason = event.target.parentNode.childNodes[2].value.trim();

      if (!reason || !reason.length)
        return alert("Please write a reason to reject");

      if (confirm('Are you sure you want to reject this submition?')) {
        serverRequest(`/campaigns/submitions/reject?id=${event.target.id}`, 'POST', { reason }, res => {
          if (!res.success) {
            return alert('An error occured. Error message: ' + res.error);
          } else {
            return event.target.parentNode.parentNode.remove();
          }
        });
      }
    }

    if (event.target.classList.contains('approve-all-button') || event.target.parentNode.classList.contains('approve-all-button')) {
      createConfirm({
        title: 'Are you sure you want to approve all the submitions in this page?',
        text: 'You cannot take this action back. Please wait a few seconds for the process to complete.',
        accept: 'Continue',
        reject: 'Cancel'
      }, res => {
        if (res) {
          const approveButtons = document.querySelectorAll('.each-submition-approve-button');
          const approveIds = [];
          for (let i = 0; i < approveButtons.length; i++)
            approveIds.push(approveButtons[i].id);
          
          serverRequest('/campaigns/submitions/approve', 'POST', {
            ids: approveIds
          }, res => {
            if (!res.success && res.error)
              return alert(res.error);
            return window.location.reload();
          });
        }
      });
    }
  });
}
