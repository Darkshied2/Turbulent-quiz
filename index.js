

/*  MAIN FUNCTION HOME PAGE GAME   */

    
    function startGame(){
        location.href = location.origin+'/play.html'
    }

    function hideLoad() {
        const preload = document.querySelector('.overlay');
        preload.classList.toggle('gone'); 
    }

    function expandSize() {
        const parent = document.querySelector('.info-wrapper')
        parent.classList.toggle('expand');
    }

    function playSound(audio) {
        if (!audio) return;
        audio.currentTime = 0;
        audio.play();
    }


    function startSound() {
        const audio = document.querySelector('#audio-start');
        playSound(audio);
    }

    function clickSound() {
        const audio = document.querySelector('#audio-click');
        playSound(audio);
    }

    function hoverSound() {
        const audio = document.querySelector('#audio-hover');
        playSound(audio);
    }


    /* EMAIL SUBMIT FORM FUNCTION */

    function emailSubs( str = '', showAlert = false ) {
        document.querySelector('.send-email').innerHTML  = '<img src="dist/icon/icSending.svg">';
        document.querySelector('.send-email').disabled  = true;
        if (showAlert) {
            document.querySelector('.send-email').innerHTML  = '<img src="dist/icon/icSend_Email.svg">';
            document.querySelector('.send-email').disabled  = false;
            alert(str);
        }
    }

/*   MAIN CODE HERE */


/*      HIDDEN LOADER WHEN DOCUMENT IS LOADED   */
window.addEventListener('load', ()=> {
    hideLoad();
});


 /*     MOVING HOME PAGE SLIDER     */
const moveTriggers =  Array.from(document.querySelectorAll('.tr-move'));
moveTriggers.forEach( trigger => {
    trigger.addEventListener('click', function(){
        const slider = document.querySelector('.move-page');
        const childSlide = slider.firstElementChild;
        const moveStep = childSlide.offsetHeight;
        parseFloat(moveStep);
        clickSound();

        if (this.id === 'infoApp') return slider.style.transform = `translateY(${moveStep - moveStep}px)`;
        if (this.id === 'contactApp') return slider.style.transform = `translateY(${-moveStep - moveStep}px)`; 
        
        return slider.style.transform = `translateY(${-moveStep}px)`;
    });
});


 /*     HOME BUTTONS CLICK EVENTS     */
const homeButtons =  Array.from(document.querySelectorAll('button[type="button"] img'));
homeButtons.forEach(button => button.addEventListener('mouseenter', hoverSound));


 /*     START GAME BUTTON ( redirect to looby page )     */
const start = document.querySelector('#startApp img');
start.addEventListener('click', ()=> {
    startSound();
    setTimeout(()=> startGame(), 1000)
    
});


 /*    EMAIL SUBS FORM     */
const scriptURL = 'https://script.google.com/macros/s/AKfycbxVq-0okZDfe-tHiJRa22rR__jJEVTmDMdVjCxPZwAuhxBOSu2FWWRkvbqiaPTgfqDG/exec';
const form = document.forms['email-subs'];

form.addEventListener('submit', e => {
    e.preventDefault();
    clickSound();
    emailSubs();

    fetch(scriptURL, {
        method: 'POST', 
        body: new FormData(form)
    })
      .then( response => {
            console.log('Success!', response);
            form.reset();
            emailSubs('Your message and email was sent successfully!', true);
        })
      .catch(error => {
          console.error('Error!', error.message);
          form.reset();
          emailSubs('Failed to send email! Try again later.', true);
        });
})