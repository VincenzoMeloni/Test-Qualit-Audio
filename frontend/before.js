document.addEventListener('DOMContentLoaded', () => {
  localStorage.clear();
  
  function generaIdUtente() {
    const timestamp = Date.now().toString(36);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `utente_${timestamp}_${random}`;
  }

  const form = document.getElementById('userForm');
  const nextBtn = document.getElementById('nextBtn');

  nextBtn.disabled = true;

  function checkFormValidity() {
    return form.checkValidity();
  }

  function updateButtonState() {
    nextBtn.disabled = !checkFormValidity();
  }

  const requiredFields = form.querySelectorAll('select[required], input[required]');
  requiredFields.forEach(field => {
    const eventType = field.tagName.toLowerCase() === 'select' ? 'change' : 'input';
    field.addEventListener(eventType, updateButtonState);
  });

  nextBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!checkFormValidity()) {
      form.reportValidity();
      return;
    }

    const utenteId = generaIdUtente();
    localStorage.setItem('utenteId',utenteId);

    const data = {
      utente: utenteId,
      regioneNascita: form.regioneN.value,
      regioneResidenza: form.regioneR.value,
      eta: Number(form.eta.value),
      genere: form.genere.value,
      titoloStudio: form.studio.value
    };

    try {
      nextBtn.disabled = true;
      const response = await fetch('/submitDati', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        window.location.href = '/index.html';
      } else {
        alert('Errore nel salvataggio dei dati! Riprova.');
      }
    } catch (error) {
      alert('Errore di rete o server: ' + error.message);
    } finally{
        nextBtn.disabled = false;
    }
  });
});
