window.onload = (event) => {
  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const badRequestError = document.getElementById('bad-request-error');
  const unknownError = document.getElementById('unknown-error');

  form.onsubmit = event => {
    event.preventDefault();
    badRequestError.style.display = unknownError.style.display = 'none';

    const password = document.getElementById("new-password").value;
    const credit_amount = parseInt(document.getElementById("credit-amount").value);
    const company_id = document.getElementById("company_id").value

    const data = {
      company_id: company_id,
      password: password,
      credit_amount: credit_amount
    }

    let status; // 0 not decided -> do nothing, 1 password changed -> send new password, 2 password not changed -> do nothing

    if (password == "") status = 1; // if password == "" -> true, the database doesnt update empty password

    // check if the password is intentionally entered --> for example firefox sometimes generates automatically a password,
    // to prevent that behaviour, I wrote such a if condition
    // if no password given, password will not be changed
    if(password != ""){
      status = 0;

      if(password.length < 6){
        createConfirm({
          title: "Please enter a password longer than 6 characters",
          text: "",
          accept: 'Continue'
        });
      }
      else {
        createConfirm({
          title: 'Are you sure you want to change the password?',
          text: "If you don't want to change password, please delete Company Password field",
          accept: 'Continue',
          reject: 'Cancel'
        }, res =>{
          if(res) status = 1;
          else status = 2;
        })
      }
    }

    if(isNaN(credit_amount)){
      status = 2;
      createConfirm({
        title: "Please give a number as Credit Amount",
        text: "",
        accept: 'Continue'
      });
    }
      const interval = setInterval(() => {

        if(status == 1){
          serverRequest(`/companies/update`, 'POST',data, res =>{
            status = 2;
            if (!res.success) return alert('An error occured. Error message: '+res.error);
            createConfirm({
              title: 'Changes made successfully',
              text: '',
              accept: 'Continue'
            }, () =>{
              window.location.reload();
            });
          })
        }
        if(status == 2) window.location.reload();
      }, 1000)

}

  document.addEventListener('click', event => {
    if (event.target.classList.contains('edit-go-back-button')) {
      window.history.back();
    }
  });
}
