const radioButtons = document.querySelectorAll('input[name="choice"]');
const submitButton = document.getElementById('bottone-upload');
const startBtn = document.getElementById('startBtn');
const form = document.getElementById('form');

const audioFiles = [
    /* ELEVEN LABS VS GRENOBLE (alternati) */
    { a: '/audio/1_EL.mp3', aLabel: 'ElevenLabs 1', b: '/audio/1_GR.wav', bLabel: 'Grenoble 1' },
    { a: '/audio/2_GR.wav', aLabel: 'Grenoble 2', b: '/audio/2_EL.mp3', bLabel: 'ElevenLabs 2' },
    { a: '/audio/3_EL.mp3', aLabel: 'ElevenLabs 3', b: '/audio/3_GR.wav', bLabel: 'Grenoble 3' },
    { a: '/audio/4_GR.wav', aLabel: 'Grenoble 4', b: '/audio/4_EL.mp3', bLabel: 'ElevenLabs 4' },
    { a: '/audio/5_EL.mp3', aLabel: 'ElevenLabs 5', b: '/audio/5_GR.wav', bLabel: 'Grenoble 5' },
    { a: '/audio/6_GR.wav', aLabel: 'Grenoble 6', b: '/audio/6_EL.mp3', bLabel: 'ElevenLabs 6' },
    { a: '/audio/7_EL.mp3', aLabel: 'ElevenLabs 7', b: '/audio/7_GR.wav', bLabel: 'Grenoble 7' },
    { a: '/audio/8_GR.wav', aLabel: 'Grenoble 8', b: '/audio/8_EL.mp3', bLabel: 'ElevenLabs 8' },
    { a: '/audio/9_EL.mp3', aLabel: 'ElevenLabs 9', b: '/audio/9_GR.wav', bLabel: 'Grenoble 9' },
    { a: '/audio/10_GR.wav', aLabel: 'Grenoble 10', b: '/audio/10_EL.mp3', bLabel: 'ElevenLabs 10' },

    /* GRENOBLE DANNEGGIATA VS REALE (alternati) */
    { a: '/audio/1_GR_DANN.wav', aLabel: 'Grenoble Danneggiata 1', b: '/audio/1_Reale.wav', bLabel: 'Reale 1' },
    { a: '/audio/2_Reale.wav', aLabel: 'Reale 2', b: '/audio/2_GR_DANN.wav', bLabel: 'Grenoble Danneggiata 2' },
    { a: '/audio/3_GR_DANN.wav', aLabel: 'Grenoble Danneggiata 3', b: '/audio/3_Reale.wav', bLabel: 'Reale 3' },
    { a: '/audio/4_Reale.wav', aLabel: 'Reale 4', b: '/audio/4_GR_DANN.wav', bLabel: 'Grenoble Danneggiata 4' },
    { a: '/audio/5_GR_DANN.wav', aLabel: 'Grenoble Danneggiata 5', b: '/audio/5_Reale.wav', bLabel: 'Reale 5' },

    /* REALE VS ELEVEN LABS (alternati) */
    { a: '/audio/1_Reale.wav', aLabel: 'Reale 1', b: '/audio/1_EL.mp3', bLabel: 'ElevenLabs 1' },
    { a: '/audio/2_EL.mp3', aLabel: 'ElevenLabs 2', b: '/audio/2_Reale.wav', bLabel: 'Reale 2' },
    { a: '/audio/3_Reale.wav', aLabel: 'Reale 3', b: '/audio/3_EL.mp3', bLabel: 'ElevenLabs 3' },
    { a: '/audio/4_EL.mp3', aLabel: 'ElevenLabs 4', b: '/audio/4_Reale.wav', bLabel: 'Reale 4' },
    { a: '/audio/5_Reale.wav', aLabel: 'Reale 5', b: '/audio/5_EL.mp3', bLabel: 'ElevenLabs 5' },

    /* GRENOBLE VS REALE (alternati) */
    { a: '/audio/1_GR.wav', aLabel: 'Grenoble 1', b: '/audio/1_Reale.wav', bLabel: 'Reale 1' },
    { a: '/audio/2_Reale.wav', aLabel: 'Reale 2', b: '/audio/2_GR.wav', bLabel: 'Grenoble 2' },
    { a: '/audio/3_GR.wav', aLabel: 'Grenoble 3', b: '/audio/3_Reale.wav', bLabel: 'Reale 3' },
    { a: '/audio/4_Reale.wav', aLabel: 'Reale 4', b: '/audio/4_GR.wav', bLabel: 'Grenoble 4' },
    { a: '/audio/5_GR.wav', aLabel: 'Grenoble 5', b: '/audio/5_Reale.wav', bLabel: 'Reale 5' }

];

function generaIdUtente() {
    const timestamp = Date.now().toString(36);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `utente_${timestamp}_${random}`;
}

let utenteId = localStorage.getItem('utenteId');

if(!utenteId){
    utenteId = generaIdUtente();
    localStorage.setItem('utenteId',utenteId);
}


let remainingPairs = [...audioFiles];
let currentPair = null;
let audioCaricato = false;

function showRandomAudio() {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = '';
    messageBox.style.display = 'none';

    if (remainingPairs.length === 0) {
        remainingPairs = [...audioFiles];
    }

    const randomIndex = Math.floor(Math.random() * remainingPairs.length);
    currentPair = remainingPairs.splice(randomIndex, 1)[0];
    audioCaricato = true;
    submitButton.disabled = false;

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

    radioButtons.forEach(radio => radio.checked = false);
    checkSelection();
}

startBtn.addEventListener('click', showRandomAudio);

function checkSelection() {
    const selectedRadio = document.querySelector('input[name="choice"]:checked');
    submitButton.disabled = !(selectedRadio && audioCaricato);
}

radioButtons.forEach(radio => {
    radio.addEventListener('change', checkSelection);
});

checkSelection();

function showMessage(message, type) {
    const box = document.getElementById('messageBox');
    box.textContent = message;
    box.className = 'message-box ' + type;
    box.style.display = 'block';
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const selectedRadio = document.querySelector('input[name="choice"]:checked');
    if (!selectedRadio) {
        showMessage('Seleziona un’opzione prima di valutare.', 'error');
        return;
    }

    if (!audioCaricato || !currentPair) {
        showMessage('Genera prima una coppia di audio da valutare.', 'error');
        return;
    }

    submitButton.disabled = true;
    startBtn.disabled = true;

    console.log('aLabel:', currentPair.aLabel);
    console.log('bLabel:', currentPair.bLabel);

    if (
        (currentPair.aLabel.startsWith('Grenoble') && currentPair.bLabel.startsWith('ElevenLabs')) ||
        (currentPair.aLabel.startsWith('ElevenLabs') && currentPair.bLabel.startsWith('Grenoble'))
    )selectedRadio.value = cambiaScelta(currentPair.aLabel,currentPair.bLabel,selectedRadio.value);

    const payload = {
        utente: utenteId,
        A: currentPair.aLabel,
        B: currentPair.bLabel,
        scelta: selectedRadio.value
    };

    try {
        const res = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showMessage('Valutazione inviata con successo.', 'success');
        } else {
            showMessage('Errore nell’invio della valutazione.', 'error');
            submitButton.disabled = false;
        }
    } catch (err) {
        showMessage('Errore di rete o server non raggiungibile.', 'error');
        submitButton.disabled = false;
    } finally {
        startBtn.disabled = false;
    }
});


function cambiaScelta(A, B, sceltaP) {
    let scelta = sceltaP;
    
    if (A.startsWith('Grenoble') && B.startsWith('ElevenLabs')) {
        switch(scelta) {
            case "B molto meglio":
                scelta = "Grenoble Molto Peggio";
                break;
            case "B meglio":
                scelta = "Grenoble Peggio";
                break;
            case "A meglio":
                scelta = "Grenoble Meglio";
                break;
            case "A molto meglio":
                scelta = "Grenoble Molto Meglio";
                break;
        }
    } else if (A.startsWith('ElevenLabs') && B.startsWith('Grenoble')) {
        switch(scelta) {
            case "A molto meglio":
                scelta = "Grenoble Molto Peggio";
                break;
            case "A meglio":
                scelta = "Grenoble Peggio";
                break;
            case "B meglio":
                scelta = "Grenoble Meglio";
                break;
            case "B molto meglio":
                scelta = "Grenoble Molto Meglio";
                break;
        }
    }
    return scelta;
}