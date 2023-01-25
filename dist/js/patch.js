
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxVq-0okZDfe-tHiJRa22rR__jJEVTmDMdVjCxPZwAuhxBOSu2FWWRkvbqiaPTgfqDG/exec';
  const form = document.forms['email-subs'];

  form.addEventListener('submit', e => {
    e.preventDefault()
    const spinner = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbsp;`;
    const alertText =  document.querySelector('#alert-text');

    document.querySelector('.btn-send-email').disabled  = true;
    document.querySelector('.btn-send-email').innerHTML = spinner+'Sending..'

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => {
            console.log('Success!', response);
            form.reset();
            document.querySelector('.btn-send-email').disabled  = false;
            document.querySelector('.btn-send-email').innerHTML = 'Send Email';
            document.querySelector('#alert-text strong').innerHTML = 'Your email has been sent!';
            alertText.classList.toggle('d-none');
            alertText.classList.toggle('alert-success');
            setTimeout(()=>{
                alertText.classList.toggle('d-none');
                alertText.classList.toggle('alert-success');
            }, 5000);

        })
      .catch(error => {
          console.error('Error!', error.message);
          form.reset();
          document.querySelector('#alert-text strong').innerHTML = 'Failed to sent email. Please try again later!';
            alertText.classList.toggle('d-none');
            alertText.classList.toggle('alert-danger');
            setTimeout(()=>{
                alertText.classList.toggle('d-none');
                alertText.classList.toggle('alert-danger');
            }, 5000);
        })
  });