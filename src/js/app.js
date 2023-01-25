

/* MAIN FUNCTION GAME */

    
    function quitGame(){
        clickSound();
        // setTimeout(()=> location.href = "localhost/project/GGQuiz-game-main/GGQuiz-game-main/index.html", 300);
        
    }


    function getNameFirst(){
        const inputName = document.getElementById('playerName');
        return inputName.value;
    }


    function inputName(){
        const enterGame = document.getElementById('enterGame');
        const value = getNameFirst();

        if (value.length >= 15) {
            enterGame.classList.add('disabled');
            validSetup('Name more than 15 characters!');
        } else{
            validSetup('');
            enterGame.classList.remove('disabled');
        }

    }


    function displayLoad() {
        const preload = document.querySelector('.overlay');
        preload.classList.toggle('gone'); 
    }


    function validSetup(string){
        const validation = document.querySelector('.validation-name');
        return validation.innerText = string;
    }


    function setPlayer( { name, coin, win, lose } ) {
        // console.log(name, coin)
        document.querySelectorAll('.player-name')[0].innerText = name;
        document.querySelectorAll('.player-name')[1].innerText = name;
        document.querySelectorAll('.player-coin')[0].innerText = coin;
        document.querySelectorAll('.player-coin')[1].innerText = coin;
        document.querySelector('#player-win').innerText = win;
        document.querySelector('#player-fail').innerText = lose;

    }


    function randomLimitNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function getCategoryValue( arrElems, arrValues ) {
        arrElems.forEach(ctg => arrValues.push(ctg.value));
        return SETTINGS_GAME.categories = arrValues;
    }


    function selectCategory() {
        let count = -1;
        return function( { categories }, reset = false ) {
            if (reset) {
                count = -1;
                return count;
            }
            if (count === categories.length - 1) {
                count = 0;
                return count;
            }
            count++;
            return count;
        }
    }


    function checkedCategory( arrElems, arrVal ) { 
        return arrElems.map(el => arrVal.map(val => el.value === val ? el.checked = true : '' ));
    }


    function saveSettings() {
        let categories = Array.from(document.querySelectorAll('input[type="checkbox"]'));
        let values = [];
        let check = saveChanges(categories, values);
        return check ? 'Successfully applied!' : 'Choose at least 3 categories above!';
    }


    function saveChanges(arrElems, arrValues){
        arrElems.forEach(ctg => {
            if (ctg.checked) {
                arrValues.push(ctg.value);
            }
        });
        if (arrValues.length < 3) {
            return false;
        }
        // Save to Session Storage
        syncSessionStorage('SETTING', arrValues);
        return true;
    }


    function getQuestion( amount, diff, categories ) {
        const currentCategory = counterCategory( PLAYER_GAME.settings );
        // https://opentdb.com/api.php?amount=10&category=9
        const URL = `https://opentdb.com/api.php?amount=${amount}&category=${categories[currentCategory]}&difficulty=${diff}&type=multiple`;

        return fetch(URL, { 
                method : 'GET' 
            })
            .then(response => {
                if (!response.ok) throw new Error(response.status);
                // console.log(response); 
                return response.json();
            })
            .then(result => {
                if (result.response_code === 0) return result.results;
                throw new Error(result.response_code);
            });
    }


    function translateQuiz( word, codeLang ) {
        const URL = `https://amm-api-translate.herokuapp.com/translate?engine=google&text=${word}&to=${codeLang}`;
        return fetch(URL, {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
        })
        .then(word => word.status ? word.data.result : word.message);

    }


    function clearBoard(){
        const questionText = document.querySelector('.question-text p');
        const choiceTexts = Array.from(document.querySelectorAll('.choice-text'));
        const choiceButtons = Array.from(document.querySelectorAll('.multiple-choice'));

        questionText.innerText = '';
        choiceTexts.forEach( choiceText => choiceText.innerText = '');
        choiceButtons.forEach( choiceButton => {
            choiceButton.classList.remove('correct');
            choiceButton.classList.remove('wrong');
        });
       
    }


    function clearCheckpoint() {
        const chkPoints = document.querySelectorAll('.checkpoint'); 
        chkPoints.forEach(cPoint => cPoint.classList.remove('checked'));
    }
    

    function checkpoint( pos ){
        const chkPoints = document.querySelectorAll('.checkpoint'); 
        chkPoints[chkPoints.length - pos].classList.toggle('checked');
        return chkPoints[chkPoints.length - pos].dataset.level;
    }


    function getCurrentCoin(currentPos) {
        const chkPoints = document.querySelectorAll('.checkpoint'); 
        const coin = chkPoints[chkPoints.length - currentPos].dataset.coin;
        return parseFloat(coin);
    }


    function randomChoice() {
        let _temp = [];

        for (let i = 0; i <= 3; i++) {
            const indexPos = randomLimitNumber( 0, 3 );
            // Check same random number
            _temp.includes(indexPos) ? i-- : _temp.push(indexPos);        
        }
        return _temp;
    }


    function switchLanguage() {
        let count = 0;
        count++;
        return function( { question, choices } ) {
            const questionText = document.querySelector('.question-text p');
            const optTexts = Array.from(document.querySelectorAll('.choice-text'));
            if (count == 1) {
                QUESTION_GAME.activeLanguage = 'en';
                questionText.innerText = question[0].question;
                optTexts.forEach((cb, index) => cb.innerText = choices[0][QUESTION_GAME.choices[2][index]]);
                return count++;
            }
            QUESTION_GAME.activeLanguage = SETTINGS_GAME.language;
            questionText.innerText = question[1].question;
            optTexts.forEach((cb, index) => cb.innerText = choices[1][QUESTION_GAME.choices[2][index]]);
            return count--;
        }
    }


    function setSearchLink( keyword ) {
        keyword = keyword.toLowerCase().split(' ').map(word => encodeURIComponent(word)).join('+');
        document.getElementById('googleSearch').setAttribute('href', `https://www.google.com/search?q=${keyword}`);
    }

    
    function setQuiz( { question, choices } ) {
        const questionText = document.querySelector('.question-text p');
        const optTexts = Array.from(document.querySelectorAll('.choice-text'));
        const randVal = randomChoice();
        QUESTION_GAME.choices[2] = randVal;     // Save random value to keep the choice option position when switching languages

        questionText.innerText = question[1].question;
        optTexts.forEach((cb, index) => cb.innerText = choices[1][randVal[index]]);
    }


    function setLevelGame( currentPos ) {
        const level = checkpoint( currentPos );
        
        switch (level) {
            case '1':
            case '2':
                SETTINGS_GAME.difficulties = 'easy';
                break;
            case '3':
                SETTINGS_GAME.difficulties = 'medium';
                break;
            case '4':
            case '5':
                SETTINGS_GAME.difficulties = 'hard';
                break;
        }
    }


    function setQuestions( enQuestion, olQuestion, language ) {
        QUESTION_GAME.question = [
            {   id : 'en',
                question : enQuestion[0]
            },
            {   id : 'en',
                question : olQuestion[0]
            }
        ];
        QUESTION_GAME.correctAnswer = [
            {   id : 'en',
                correct : enQuestion[1]
            },
            {   id : 'en',
                correct : olQuestion[1]
            }
        ];
        QUESTION_GAME.choices = [ enQuestion[2], olQuestion[2], corrPosition = 0 ];
        QUESTION_GAME.activeLanguage = 'en';
    }


    // ASYNC FUNCTION
    async function gameStart( { requestPerCall, difficulties, language }, { categories } ){
        try{
            // Request question to API
            // The results are in english
            const result = await getQuestion( requestPerCall, difficulties, categories );

            // Decode HTML characters code
            let enResultQt = result.map(data => convertHTMLEntity(data.question)).join('').trim();
            let enResultCorr = result.map(data => convertHTMLEntity(data.correct_answer)).join('').trim();
            let enResultIncorr = result.map(data => data.incorrect_answers).map(c => c.map(b => convertHTMLEntity(b)));
            
            let enCodeResultQt = encodeURIComponent(enResultQt);  // Encode string to URL Encoding (RFC 3986)
            let enChoices;
            let olResutQt;
            let olResutCorr;
            let olChoices;
            
            enChoices = [enResultCorr,...enResultIncorr[0].map(text => text.trim())];   // Push all choice option & Clear empty space
            
            olResutQt = await translateQuiz( enCodeResultQt, 'en' );

            /*    OPTION CHECKING CONDITION   */

            // If Option Answer is Number Format
            if (!isNaN(parseFloat(enResultCorr))) {       
                olResutCorr = enResultCorr;   
                olChoices = enChoices;
                
            } else {
            // Otherwise, Option Answer is String
                let enCodeResultCorr = encodeURIComponent(enResultCorr);            // Encode string to URL Encoding (RFC 3986)
                let enCodeResultIncorr = encodeURIComponent(enResultIncorr[0]);     // Encode string to URL Encoding (RFC 3986)

                let _temp = [enCodeResultCorr,enCodeResultIncorr];                  // Pass the encode strings to temporary variables
                olChoices = await translateQuiz( _temp, "en" );                 // Translate to Other Language (default is Indonesia)                

                [olResutCorr] = olChoices = olChoices.split(',').map(text => text.trim());   // Push all choice option in other language & Clear empty space
            }
            
            setQuestions([enResultQt, enResultCorr, enChoices], [olResutQt, olResutCorr, olChoices], 'en');   // Pass all the values above to main variable
            setQuiz(QUESTION_GAME);
            setHighlightText({ mainText:'', captionText:''});
            setSearchLink(QUESTION_GAME.question[1].question);
            setEmoji(false);
            removeAnswerAnimation();
            muteInteraction(choiceButtons, optionHelperButtons, [translateButton]);
            return;
        }
        catch(error)
        {
            console.error(error.message);                                           // Show error to console
            alert('Internal Error! Please try again later or refresh the page.');   // Show error to alert
            
            resetGame();                                // Reset all value and variable to default
            CHECKPOINT_GAME = CURRENT_COIN = 0;         // Reset Checkpoint & Coin
            
            document.body.classList.toggle('playing');  // Transition menu to lobby
            removeAnswerAnimation();
            transitionSound();
            setTimeout(transitionSound, 1500);
        }
    }


    function convertHTMLEntity(text){
        const span = document.createElement('span');
        return text
        .replace(/&[#A-Za-z0-9]+;/gi, (entity,position,text)=> {
            span.innerHTML = entity;
            return span.innerText;
        });
    }


    function removeAnswerAnimation(){
        const parent = document.querySelector('.instruc-game');
        const obj = document.querySelector('#answer-anim');
        if (!obj) return;
        parent.removeChild(obj);
    }


    function playAnswerAnimation ( url = '' ){
        const parent = document.querySelector('.instruc-game');
        const obj = `<lottie-player src="${url}" id="answer-anim" background="transparent" speed="1" style="width:150px;height:150px;" autoplay></lottie-player>`;
        
        parent.insertAdjacentHTML('afterbegin', obj);

    }


    function setHighlightText( { mainText, captionText }) {
        const mt = document.querySelector('.answer-text');
        const ct = document.querySelector('.caption-text');
        if (typeof(mainText) !== "string" && typeof(captionText) !== "string") {
            return;
        }
        mt.innerText = mainText;
        ct.innerText = captionText;
    }


    function randomHighlightText( arrTxt ) {
        const randVal = randomLimitNumber( 0, 4 );
        setHighlightText( arrTxt[randVal] );
    }


    function setEmoji(show = true) {
        if (show) {
            const randVal = randomLimitNumber( 1, 4 );
            document.querySelector('.emoticon').innerHTML = `<img src="./dist/icon/emoji-${randVal}.svg" width="90" height="80"></img>`;
            return document.querySelector('.emoticon').classList.add('show-up');
        }
        return document.querySelector('.emoticon').classList.remove('show-up');    // Emoji toggle show up
    }
    
    
    function checkActiveLanguage() {
        const check = QUESTION_GAME.activeLanguage !== SETTINGS_GAME.language;
        const correctAnswer = switchCorrectAnswer(check)
        return correctAnswer;
    }


    function switchCorrectAnswer( condition ) {
        let currentLang = QUESTION_GAME.correctAnswer[1].correct;       // Pass Value Correct answer on current language 
        
        if (condition) {
            currentLang = QUESTION_GAME.correctAnswer[0].correct;       // Pass Value Correct answer on english language 
        }
        return currentLang;
    }


    function getCorrectAnswer( action, arrElems1, arrElems2, arrElms3 ) {
        const nowAnswer = checkActiveLanguage();
        if (action === 'correct') {
            arrElems1.forEach(el => el.lastElementChild.innerText === nowAnswer ? el.classList.add(action) : el.classList.add('wrong'));
            muteInteraction( arrElems1, arrElems2, arrElms3 );
            return;
        } 
        else{
            return arrElems1.forEach(el => el.lastElementChild.innerText === nowAnswer ? el.classList.toggle(action) : '');
        }
    }


    function muteInteraction( ...arrElems ) {
        arrElems.forEach( arrElem => arrElem.forEach(el => el.classList.toggle('disabled')));
    }


    function getFFifty( arrElems ) {
        const nowAnswer = checkActiveLanguage();
        let corr;
        arrElems.forEach((el, index) => el.lastElementChild.innerText === nowAnswer ? corr = index : '');
        return corr;
    }


    function setFFifty( arrElems ) {
        const optTexts = Array.from(document.querySelectorAll('.choice-text'));
        const corrAnswerPos = getFFifty(arrElems);
        let incorrAnswerPos = corrAnswerPos;
        // console.log(corrAnswerPos);
        corrAnswerPos >= 0 && corrAnswerPos <= 1 ? incorrAnswerPos++ : incorrAnswerPos--;
        
        optTexts.forEach((c, index) => {
            if (index !== incorrAnswerPos && index !== corrAnswerPos) {
                c.innerText = '';
            }
        });
        return;
    }


    function transitionsBoard() {
        document.body.classList.toggle('playing');
    }

    
    function modalToggle( string = '', winner = false) {
        document.querySelector('.modal-body').innerHTML = `<p class="mb-0">${string}</p>`;
        document.getElementById('modalGame').classList.toggle('show');
        document.querySelector('.modal-backdrop').classList.toggle('show');
        
        if (winner) {
            document.querySelector('.modal-footer #finishGame').innerHTML = `<img src="./dist/icon/icTakeCoin_btn.svg" width="180">`
            document.querySelector('.modal-footer #finishGame').classList.add('m-auto');
            document.querySelector('.modal-footer #repeatGame').classList.add('d-none');
        }
    }


    function resetModal() {
        document.getElementById('finishGame').classList.remove('m-auto');
        document.getElementById('finishGame').classList.remove('d-none');
        document.getElementById('repeatGame').classList.remove('d-none');
        document.getElementById('closeModal').classList.add('d-none');
        document.getElementById('escapeGame').classList.add('d-none');
    }


    function resetOptionHelper() {
        const helpButtons = Array.from(document.querySelectorAll('.option-helper'));
        helpButtons.forEach( b => b.classList.remove('selected'));
    }


    function resetGame() {
        clearBoard();
        clearCheckpoint();
        setHighlightText({ mainText:'', captionText:''});
        setEmoji(false);
        resetOptionHelper();
        counterCategory( PLAYER_GAME.settings, true);    // Reset counter of array category
    }


    function leftGame() {
        resetGame();
        modalToggle();
        muteInteraction(choiceButtons, optionHelperButtons, [translateButton]);
        setTimeout(resetModal, 300);
        
    }


    function playSound(audio) {
        if (!audio) return;
        audio.currentTime = 0;
        audio.play();
    }


    function transitionSound() {
        const audio = document.querySelector('#audio-transition');
        playSound(audio);
    }


    function clickSound() {
        const audio = document.querySelector('#audio-click');
        playSound(audio);
    }

    
    function closeSound() {
        const audio = document.querySelector('#audio-close');
        playSound(audio);
    }


    function trueSound() {
        const audio = document.querySelector('#audio-answer');
        playSound(audio);
    }
    
    
    function gameOverSound() {
        const audio = document.querySelector('#audio-gameover');
        playSound(audio);
    }


    function winnerSound() {
        const audio = document.querySelector('#audio-winner');
        playSound(audio);
    }


    function applauseSound() {
        const audio = document.querySelector('#audio-applause');
        playSound(audio);
    }

    /*                SESSION STORAGE                     */
  

    function syncSessionStorage(action, ...dataPlayer){
        switch (action) {
            case 'SAVE':
                PLAYER_GAME.name = dataPlayer[0];
                PLAYER_GAME.coin = dataPlayer[1];
                PLAYER_GAME.win = dataPlayer[2];
                PLAYER_GAME.lose = dataPlayer[3];
                PLAYER_GAME.settings = {
                    categories: dataPlayer[4]
                }
            break;
            case 'UPDATE':
                PLAYER_GAME.coin += dataPlayer[0];
                PLAYER_GAME.win += dataPlayer[1];
                PLAYER_GAME.lose += dataPlayer[2];
            break;
            case 'SETTING':
                PLAYER_GAME.settings = {
                    categories : dataPlayer[0]
                }
            break;
        }
        sessionStorage.setItem(GGQUIZ_SESSION, JSON.stringify(PLAYER_GAME));
        return;
    }


    function getFromSessionStorage(){
        let getSession = sessionStorage.getItem(GGQUIZ_SESSION);
        return getSession ? PLAYER_GAME = JSON.parse(getSession) : false;
    }

        /*  CHECK THE BROWSER SUPPORT SESSION STORAGE  */

        if (!typeof(Storage)) {
            console.warn("Session storage doesn't support on your browser! Your data will gone when the page are reload");
        } 

/*END FUNCTION   */


    


/*                          MAIN CODE HERE                           */

let PLAYER_GAME = {};
let QUESTION_GAME = {};
let CHECKPOINT_GAME = 0;
let CURRENT_COIN = 0;
let SETTINGS_GAME = {
    requestPerCall : 1,     // Do not change!
    language : 'en',        // Default language (indonesia)
    difficulties : 'easy',  // Default first difficulity
    categories : []         // 
}

const GGQUIZ_SESSION = "TURBULENT QUIZ_SESSION";    // Session Storage Name


// When the Document loaded
window.addEventListener('load', ()=> {
    displayLoad();
    // GET Data First From Session Storage
    const getDataFromSessionStorage = getFromSessionStorage();
        // Data from Session is exists
        if (getDataFromSessionStorage) {    
            setPlayer(PLAYER_GAME);
            document.querySelector('#gameplay').style.display = 'flex';
            return;
        }
        // Data from Session doesn't exists
        document.querySelector('.player-input').classList.toggle('asked');
});



const randomText = [
    {
        mainText : 'good!',
        captionText : 'Stay focus.'
    },
    {
        mainText : 'Great!',
        captionText : 'Lets continue...'
    },
    {
        mainText : 'GG Euy!',
        captionText : 'You can definitely win...'
    },
    {
        mainText : '!',
        captionText : 'Come on you can do it'
    },
    {
        mainText : 'Continue!',
        captionText : 'Do not give up.'
    }
]


/*  ENTER TO THE GAME  */
const enterGame = document.querySelector('#enterGame');
    enterGame.addEventListener('click', ()=> {
        clickSound();
        let name = getNameFirst();                       // get name from input text
        let coin = 0;                                    // default first player coin
        let win = 0;                                     // the default player wins that has been played
        let lose = 0;                                    // the default player lose that has been played
        let categorySelect = SETTINGS_GAME.categories;   // the first default category setting
        if (name === '') return validSetup('Please enter your name!');  // check empty string 
        // Session Storage
        syncSessionStorage('SAVE', name, coin, win, lose, categorySelect);   // save data player to session storage
        setPlayer(PLAYER_GAME);                                         // set data player to lobby board

        setTimeout(() => document.querySelector('.player-input').classList.toggle('asked'), 500);
        document.querySelector('#gameplay').style.display = 'flex';
    });



/*  START PLAYING THE GAME  */
const playGame = document.querySelector('#playGame');    
    playGame.addEventListener('click', ()=> {
        clickSound();
        setTimeout(()=>{
            transitionsBoard();
            transitionSound();
            setTimeout(transitionSound, 1200);
            CHECKPOINT_GAME++
            setTimeout(() => {
                setHighlightText({
                    mainText : 'Ready!',
                    captionText : `First question`
                });
                setLevelGame(CHECKPOINT_GAME);
                gameStart(SETTINGS_GAME, PLAYER_GAME.settings);
            }, 1500);
        }, 300);
    });



/*  MULTIPLE CHOICE BUTTON CLICK EVENT */
const choiceButtons = Array.from(document.querySelectorAll('.multiple-choice'));
    choiceButtons.forEach( choiceButton => {
        choiceButton.addEventListener('click', function () {
            const correctAnswer = checkActiveLanguage();
            const playerAnswer = this.lastElementChild.innerText;
            let lastCoin = playerWin = playerLose = 0;
            getCorrectAnswer( 'correct', choiceButtons, optionHelperButtons, [translateButton] );
            // CHECK IF THE PLAYER ANSWERS CORRECTLY  
            // THE CODE BELOW WILL RUN
            if (playerAnswer === correctAnswer) {
                CHECKPOINT_GAME++;
                lastCoin = CURRENT_COIN = getCurrentCoin(CHECKPOINT_GAME);
                setLevelGame(CHECKPOINT_GAME);
                trueSound(); setEmoji();
                playAnswerAnimation('https://assets7.lottiefiles.com/packages/lf20_ruryzm9h.json');
                setHighlightText({
                    mainText : 'TRUE!',
                    captionText : ``
                });
                setTimeout(() => {
                    // IF THE GAME IS ALREADY IN THE LAST QUESTION
                    if (CHECKPOINT_GAME === 18) {
                        playerWin = 1;
                        modalToggle('<img src="./dist/img/winners.png" style="max-width: 480px;">', true);
                        winnerSound(); applauseSound();
                        checkpoint(CHECKPOINT_GAME);
                        // Session Storage
                        syncSessionStorage('UPDATE', lastCoin, playerWin, playerLose);      // Save data Game to session storage
                        setPlayer(PLAYER_GAME);                           // Set data player game to lobby board
                        resetGame();                                      // Reset all values and variables to default
                        CHECKPOINT_GAME = CURRENT_COIN = 0;               // Reset Checkpoint & Current Coin
                        return;
                    }
                    // IF THE GAME IS ON LEVEL POINTS
                    else if (CHECKPOINT_GAME === 4 || CHECKPOINT_GAME === 8 || CHECKPOINT_GAME === 12 || CHECKPOINT_GAME === 15) {
                        CHECKPOINT_GAME++
                        checkpoint(CHECKPOINT_GAME);
                    }
                    clearBoard();
                    randomHighlightText( randomText );
                    gameStart(SETTINGS_GAME, PLAYER_GAME.settings);
                }, 2500);
                return;
            }
            // IF THE PLAYER ANSWERS WRONGLY 
            // THE CODE BELOW WILL RUN
            gameOverSound();
            setHighlightText({ 
                mainText : 'WRONG!', 
                captionText : `The correct answer is ${correctAnswer}`
            });
            playAnswerAnimation('https://assets3.lottiefiles.com/temp/lf20_yYJhpG.json');
            setTimeout(() => {
                checkpoint(CHECKPOINT_GAME);
                playerLose = 1;
                lastCoin = CURRENT_COIN;
                modalToggle(`<lottie-player src="https://assets1.lottiefiles.com/packages/lf20_vpzvfap4.json" class="mx-auto" background="transparent" speed="1" style="width:150px;height:150px;" loop autoplay></lottie-player><br>
                           <span style="font-size:1.5em;font-weight:700;">Game Over!</span><br>
                           The coins you get are${CURRENT_COIN} <span><img src="./dist/icon/icCoin_Credit.svg"></span><br>Want to replay the game?`
                            );
                // Session Storage
                syncSessionStorage('UPDATE', lastCoin, playerWin, playerLose);    // Save data Game to session storage
                setPlayer(PLAYER_GAME);                               // Set data player game to lobby board
                resetGame();                                          // Reset all values and variables to default
                CHECKPOINT_GAME = CURRENT_COIN = 0;                   // Reset Checkpoint & Current Coin
            }, 2500);
            return;
        })
    });



/*  FINISH THE GAME ( redirect to Lobby ) */
const finishGameBtn = document.querySelector('#finishGame'); 
finishGameBtn.addEventListener('click', ()=> {
    modalToggle();   
    resetModal();
    removeAnswerAnimation();
    document.querySelector('.modal-footer #finishGame').innerHTML = `<img src="./dist/icon/icNo_btn.svg" width="180">`;
    document.body.classList.toggle('playing');
    transitionSound();
    setTimeout(transitionSound, 1500);
});


/*  REPEAT THE GAME (play again) */
const repeatGame = document.querySelector('#repeatGame');
repeatGame.addEventListener('click', ()=> {
    modalToggle();
    removeAnswerAnimation();
    setTimeout(() => {
        setHighlightText({
            mainText: 'Ready!', 
            captionText: 'First question'
        });
        setLevelGame(CHECKPOINT_GAME);
        gameStart(SETTINGS_GAME, PLAYER_GAME.settings);
    }, 1300);
    // +1 each time
    CHECKPOINT_GAME++;
});



/*  HELP OPTIONS EVENTS */
const optionHelperButtons = Array.from(document.querySelectorAll('.option-helper'));
optionHelperButtons.forEach( optionHelper => {
    optionHelper.addEventListener('click', function() {
        
        this.classList.add('selected');

        /*  FIFTY FIFTY HELP OPTION  */
        if (this.id === 'fiftyOption') setFFifty( choiceButtons );

        /*  HIGHLIGHT HELP OPTION  */
        if (this.id === 'highlightOption') {
            getCorrectAnswer( 'highlight', choiceButtons );
            setTimeout(() => {
                getCorrectAnswer( 'highlight', choiceButtons );
            }, 3000);
        }

    });
});



/*  SWTICH LANGUAGE BUTTON EVENT  */
const translateButton = document.getElementById('switch-lang');
const switchLang = switchLanguage();
translateButton.addEventListener('click', () => {
    setTimeout(()=> switchLang( QUESTION_GAME ), 300);
});



/*  SET CATEGORY EVENT ( it will first set the categories when the document is loaded ) */ 
const categories = Array.from(document.querySelectorAll('input[type="checkbox"]'));
const counterCategory = selectCategory();       // Counter of category array values
const arrCategory = [];
getCategoryValue(categories, arrCategory);     // retrieve the values from the checked checkbox


/*  APPLY SETTINGS BUTTON EVENT */
document.getElementById('saveSettings').addEventListener('click', ()=> {
    const message = saveSettings();
    alert(message);
});

    
/*  SETTINGS BUTTON EVENT */
// const settingsButton = document.getElementById('settingsGame');
document.getElementById('settingsGame').addEventListener('click', ()=> {
    let categorySelected = PLAYER_GAME?.settings?.categories;
    categorySelected ? categorySelected : categorySelected = SETTINGS_GAME.settings.categories;
    clickSound();
    checkedCategory(categories, categorySelected );
});


/*  CLOSE SETTINGS BUTTON EVENT */
// const closeSettingsButton = document.getElementById('closeSettings');
document.getElementById('closeSettings').addEventListener('click', ()=> {
    let validateCount = 0;
    let categorySelectCount = PLAYER_GAME.settings.categories.length;
    categories.forEach( ctg => {
        ctg.checked ? validateCount++ : '';
    });
    if (validateCount > categorySelectCount || validateCount < categorySelectCount) {
        if(confirm('There are unsaved changes. Click "OK" to save!')){
            const message = saveSettings();
            alert(message);
            return;
        }
    }
});


/*  LEFT THE GAME MODAL TRIGGER  ( AFK ) */ 
const leftGameButton = document.getElementById('leftGame');
leftGameButton.addEventListener('click', function() {
    finishGameBtn.classList.add('d-none');          //  Hide finish button in modal footer
    repeatGame.classList.add('d-none');             //  Hide repeat game button in modal footer

    document.getElementById('closeModal').classList.remove('d-none');
    document.getElementById('escapeGame').classList.remove('d-none');
    modalToggle(`<lottie-player src="https://assets1.lottiefiles.com/packages/lf20_fFVfCt.json" class="mx-auto" background="transparent" speed="1" style="width:260px;height:260px;margin-top:-25px" loop autoplay></lottie-player>
    <br>Wanna run away?Think about the following saying<br>"Better to lose a match than give up without thinking!"<br>Still want to run away?`);
});


/*  CANCEL LEFT GAME BUTTON */ 
document.getElementById('closeModal').addEventListener('click',()=> {
    modalToggle();
    setTimeout(resetModal, 200);
});


/*  CONFIRM LEFT GAME BUTTON */ 
document.getElementById('escapeGame').addEventListener('click', ()=> {
    const questionText = document.querySelector('.question-text p');
    let timing = 3500;
    CHECKPOINT_GAME = CURRENT_COIN = 0;   
    
    if (questionText.innerText !== "") {
        timing = 0;
    }
    clickSound();
    setTimeout(()=>{
        transitionsBoard();
        leftGame();
        setTimeout(transitionSound, 400);
        setTimeout(transitionSound, 1200);
        document.getElementById('escapeGame').innerHTML = '<img src="./dist/icon/icConfirmAfk_btn.svg" width="180">';
    }, timing);
    document.getElementById('escapeGame').innerHTML = '<img src="./dist/icon/icWait.svg" width="180">';
});


/*  CLOSE BUTTON SOUND CLICK  */ 
document.querySelectorAll('button[data-dismiss="modal"]').forEach(btn => {
    btn.addEventListener('click', closeSound);
});



/*  QUIT THE GAME ( redirect to index ) */
const quitGameBtn = document.getElementById('#exitGame');
quitGameBtn.addEventListener('click', quitGame);
