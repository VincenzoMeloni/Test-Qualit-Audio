const audioFiles = [
    /* ELEVEN LABS VS GRENOBLE (alternati) */
    { a: '/audio/1_EL.mp3', aLabel: 'ElevenLabs 1', b: '/audio/1_GR.mp3', bLabel: 'Grenoble 1' },
    { a: '/audio/2_GR.mp3', aLabel: 'Grenoble 2', b: '/audio/2_EL.mp3', bLabel: 'ElevenLabs 2' },
    { a: '/audio/3_EL.mp3', aLabel: 'ElevenLabs 3', b: '/audio/3_GR.mp3', bLabel: 'Grenoble 3' },
    { a: '/audio/4_GR.mp3', aLabel: 'Grenoble 4', b: '/audio/4_EL.mp3', bLabel: 'ElevenLabs 4' },
    { a: '/audio/5_EL.mp3', aLabel: 'ElevenLabs 5', b: '/audio/5_GR.mp3', bLabel: 'Grenoble 5' },
    { a: '/audio/6_GR.mp3', aLabel: 'Grenoble 6', b: '/audio/6_EL.mp3', bLabel: 'ElevenLabs 6' },
    { a: '/audio/7_EL.mp3', aLabel: 'ElevenLabs 7', b: '/audio/7_GR.mp3', bLabel: 'Grenoble 7' },
    { a: '/audio/8_GR.mp3', aLabel: 'Grenoble 8', b: '/audio/8_EL.mp3', bLabel: 'ElevenLabs 8' },
    { a: '/audio/9_EL.mp3', aLabel: 'ElevenLabs 9', b: '/audio/9_GR.mp3', bLabel: 'Grenoble 9' },
    { a: '/audio/10_GR.mp3', aLabel: 'Grenoble 10', b: '/audio/10_EL.mp3', bLabel: 'ElevenLabs 10' },

    /* GRENOBLE DANNEGGIATA VS REALE (alternati) */
    { a: '/audio/1_GR_DANN.mp3', aLabel: 'Grenoble Danneggiata 1', b: '/audio/1_Reale.mp3', bLabel: 'Reale 1' },
    { a: '/audio/2_Reale.mp3', aLabel: 'Reale 2', b: '/audio/2_GR_DANN.mp3', bLabel: 'Grenoble Danneggiata 2' },
    { a: '/audio/3_GR_DANN.mp3', aLabel: 'Grenoble Danneggiata 3', b: '/audio/3_Reale.mp3', bLabel: 'Reale 3' },
    { a: '/audio/4_Reale.mp3', aLabel: 'Reale 4', b: '/audio/4_GR_DANN.mp3', bLabel: 'Grenoble Danneggiata 4' },
    { a: '/audio/5_GR_DANN.mp3', aLabel: 'Grenoble Danneggiata 5', b: '/audio/5_Reale.mp3', bLabel: 'Reale 5' },

    /* REALE VS ELEVEN LABS (alternati) */
    { a: '/audio/1_Reale.mp3', aLabel: 'Reale 1', b: '/audio/1_EL.mp3', bLabel: 'ElevenLabs 1' },
    { a: '/audio/2_EL.mp3', aLabel: 'ElevenLabs 2', b: '/audio/2_Reale.mp3', bLabel: 'Reale 2' },
    { a: '/audio/3_Reale.mp3', aLabel: 'Reale 3', b: '/audio/3_EL.mp3', bLabel: 'ElevenLabs 3' },
    { a: '/audio/4_EL.mp3', aLabel: 'ElevenLabs 4', b: '/audio/4_Reale.mp3', bLabel: 'Reale 4' },
    { a: '/audio/5_Reale.mp3', aLabel: 'Reale 5', b: '/audio/5_EL.mp3', bLabel: 'ElevenLabs 5' },

    /*
    /* GRENOBLE VS REALE (alternati) 
    { a: '/audio/1_GR.mp3', aLabel: 'Grenoble 1', b: '/audio/1_Reale.mp3', bLabel: 'Reale 1' },
    { a: '/audio/2_Reale.mp3', aLabel: 'Reale 2', b: '/audio/2_GR.mp3', bLabel: 'Grenoble 2' },
    { a: '/audio/3_GR.mp3', aLabel: 'Grenoble 3', b: '/audio/3_Reale.mp3', bLabel: 'Reale 3' },
    { a: '/audio/4_Reale.mp3', aLabel: 'Reale 4', b: '/audio/4_GR.mp3', bLabel: 'Grenoble 4' },
    { a: '/audio/5_GR.mp3', aLabel: 'Grenoble 5', b: '/audio/5_Reale.mp3', bLabel: 'Reale 5' }
*/
];

const radioButtons = document.querySelectorAll('input[name="choice"]');
const submitButton = document.getElementById('bottone-upload');
const form = document.getElementById('form');
let tempAudios = [...audioFiles];
let audioAFinished = false;
let audioBFinished = false;
let currentPair = {};

function getRandomPair() {
    if (tempAudios.length === 0) {
        tempAudios = [...audioFiles];
    }

    const randomIndex = Math.floor(Math.random() * tempAudios.length);
    return tempAudios.splice(randomIndex, 1)[0];
}

function checkSelection() {
    const selectedRadio = document.querySelector('input[name="choice"]:checked');
    submitButton.disabled = !(selectedRadio && audioAFinished && audioBFinished);
}

function showRandomAudio(){
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = '';
    messageBox.style.display = 'none';

    currentPair = getRandomPair();

    submitButton.disabled = true;

    const audioContainerA = document.getElementById('audioA');
    const audioContainerB = document.getElementById('audioB');

    audioContainerA.innerHTML = '';
    audioContainerB.innerHTML = '';

    const audioA = document.createElement('audio');
    audioA.controls = true;
    audioA.src = currentPair.a;

    const audioB = document.createElement('audio');
    audioB.controls = true;
    audioB.src = currentPair.b;

    audioContainerA.appendChild(audioA);
    audioContainerB.appendChild(audioB);

    checkAudios(audioA,audioB);

    radioButtons.forEach(radio => radio.checked = false);
    checkSelection();
}

radioButtons.forEach(radio => {
    radio.addEventListener('change', checkSelection);
});

function initPage() {
    showRandomAudio();
    checkSelection();
}

document.addEventListener('DOMContentLoaded' , initPage);

function handler(e){
    e.preventDefault();
}

window.addEventListener('beforeunload', handler);

function updateProgressBar() {
    const total = audioFiles.length;
    const remaining = tempAudios.length;
    const completed = total - remaining;
    let percent = Math.round((completed / total) * 100);

    const valutate = document.getElementById('valutate');
    valutate.innerHTML = `${completed}/${total}`;

    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = `${percent}%`;

    if(percent == 100){
        setTimeout(()=>{
            finalSection();
        },2000);
    }

    if (percent >= 75) {
        progressFill.style.backgroundColor = '#198754';
    } else if (percent >= 50) {
        progressFill.style.backgroundColor = '#ffc107';
    } else if (percent >= 25) {
        progressFill.style.backgroundColor = '#fd7e14';
    } else {
        progressFill.style.backgroundColor = '#0d6efd';
    }
}

function checkAudios(audioA, audioB) {
    audioAFinished = false;
    audioBFinished = false;

    audioA.addEventListener('ended', () => {
        audioAFinished = true;
        checkSelection();
    });

    audioB.addEventListener('ended', () => {
        audioBFinished = true;
        checkSelection();
    });
}

function finalSection(){
    const main = document.getElementById('main');
    main.innerHTML = `<div id="rettangolo">
            <h1><strong>Test Qualità Audio</strong></h1></div>
    <div><p class="final-message">Grazie per il prezioso Feedback!</p>
    <div style="display:block; text-align:center;">
                    <button id="toStart" class="btn btn-primary mb-4">Torna all'inizio</button>
                </div>
    </div>`;
    localStorage.clear();
    const start = document.getElementById('toStart');
    gotoBefore(start);
}

function gotoBefore(start){
    window.removeEventListener('beforeunload', handler);

    start.addEventListener('click', function(e){
        e.preventDefault();
        window.location.href='/';
    });
}

function showMessage(message, type) {
    const box = document.getElementById('messageBox');
    box.textContent = message;
    box.className = 'message-box ' + type;
    box.style.display = 'block';
}

function checkUser(id){
    if(typeof id === "undefined" || id === null){
        showMessage('Bisogna compilare il form prima di inviare una valutazione!', 'error');
        return false;
    }
    return true;
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let id = localStorage.getItem('utenteId');

    if(!checkUser(id)){
        window.removeEventListener('beforeunload', handler);

        setTimeout(() =>{
            window.location.href='/';
        },2000);

        return;
    }

    let selectedRadio = document.querySelector('input[name="choice"]:checked');
    if (!selectedRadio) {
        showMessage('Seleziona un’opzione prima di valutare.', 'error');
        return;
    }

    if (!audioAFinished || !audioBFinished || !currentPair) {
        showMessage('Genera prima una coppia di audio da valutare.', 'error');
        return;
    }

    submitButton.disabled = true;

    let sceltaUtente = selectedRadio.value;
    let sceltaN = normalizzaScelta(currentPair.aLabel,currentPair.bLabel,sceltaUtente);

    const payload = {
        utente: id,
        A: currentPair.aLabel,
        B: currentPair.bLabel,
        scelta: sceltaN
    };
    try {
        const res = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if(!res.ok){
            showMessage('Errore nell’invio della valutazione.', 'error');
            submitButton.disabled = false;
        }
    } catch (err) {
        showMessage('Errore di rete o server non raggiungibile.', 'error');
        submitButton.disabled = false;
    } finally {
        updateProgressBar();
        showRandomAudio();
    }
});


function normalizzaScelta(A, B, scelta) {
    let sceltaP = scelta
    if (A.startsWith('Grenoble') && B.startsWith('ElevenLabs')) {
        switch(scelta) {
            case "B molto meglio":
                 sceltaP = "Grenoble Molto Peggio";
                 break;
            case "B meglio": 
                 sceltaP = "Grenoble Peggio";
                 break;
            case "A meglio":
                 sceltaP = "Grenoble Meglio";
                 break;
            case "A molto meglio":
                 sceltaP = "Grenoble Molto Meglio";
                 break;
        }
    } else if (A.startsWith('ElevenLabs') && B.startsWith('Grenoble')) {
        switch(scelta) {
            case "A molto meglio":
                 sceltaP = "Grenoble Molto Peggio";
                 break;
            case "A meglio":
                 sceltaP = "Grenoble Peggio";
                 break;
            case "B meglio":
                 sceltaP = "Grenoble Meglio";
                 break;
            case "B molto meglio":
                 sceltaP = "Grenoble Molto Meglio";
                 break;
        }
    } else if (A.startsWith('Grenoble Danneggiata') && B.startsWith('Reale')) {
        switch(scelta){
            case "B molto meglio":
                sceltaP = "Reale Molto Meglio";
                break;
            default:
                sceltaP = scelta;
                break;
        }
    } else if (A.startsWith('Reale') && B.startsWith('Grenoble Danneggiata')) {
        switch(scelta){
            case "A molto meglio":
                sceltaP = "Reale Molto Meglio";
                break;
            default:
                sceltaP = scelta;
                break;
        }
    } else if (A.startsWith('Reale') && B.startsWith('ElevenLabs')){
        switch(scelta){
            case "A molto meglio":
                sceltaP = "Reale Molto Meglio";
                break;
            default:
                sceltaP = scelta;
                break;
        }
    } else if (A.startsWith('ElevenLabs') && B.startsWith('Reale')){
        switch(scelta){
            case "B molto meglio":
                sceltaP = "Reale Molto Meglio";
                break;
            default:
                sceltaP = scelta;
                break;
        }
    }

    return sceltaP;
}
