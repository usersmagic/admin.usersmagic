window.onload = (event) => {
  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const unknownError = document.getElementById('unknown-error');

  form.onsubmit = event => {
    event.preventDefault();
    badRequestError.style.display = unknownError.style.display = 'none';

    const password = document.getElementById('new-password').value;
    const credit_amount = parseInt(document.getElementById('credit-amount').value);
    const company_id = document.getElementById('company_id').value

    const data = {
      company_id: company_id,
      password: "",
      credit_amount: credit_amount
    }

    let return_message = "Credit Amount";

    let wait_for_password = false;

    // check if the password is intentionally entered --> for example firefox sometimes generates automatically a password,
    // to prevent that behaviour, I wrote such a if condition
    // if no password given, password will not be changed
    if(password != ''){
      wait_for_password = true;

      if(password.length < 6){
        createConfirm({
          title: 'Please enter a password longer than 6 characters',
          text: '',
          accept: 'Continue'
        });
      }
      else {
        createConfirm({
          title: 'Are you sure you want to change the password?',
          text: "If you don't want to change password, please delete Company Password field",
          accept: 'Continue',
          reject: 'Cancel'
        }, res => {
        wait_for_password = false;
        if(res) {
          data.password = password;
          return_message = "Password and Credit Amount"
        }
      });
      }
    }

    if(isNaN(credit_amount)){
      createConfirm({
        title: 'Please give a number as Credit Amount',
        text: '',
        accept: 'Continue'
      });
    }
    else {
      setInterval(() => {
        if(!wait_for_password){
          wait_for_password = true; //this for preventing infinite loop

          sendUpdateData(data, return_message);
        }
      }, 1000);
    }
}

  document.addEventListener('click', event => {
    if (event.target.classList.contains('edit-go-back-button')) {
      window.history.back();
    }
  });
}

function sendUpdateData(data, updatedField){

  serverRequest(`/companies/update`, 'POST',data, res =>{
    if (!res.success) return alert('An error occured. Error message: '+res.error);
    createConfirm({
      title: 'This field updated successfully: '+updatedField,
      text: '',
      accept: 'Continue'
    },() => window.location.reload());
  })

}
