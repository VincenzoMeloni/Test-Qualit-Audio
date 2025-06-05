document.addEventListener('DOMContentLoaded', () => {
  
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

  const form = document.getElementById('userForm');
  const nextBtn = document.getElementById('nextBtn');

  nextBtn.disabled = true;

  function checkFormValidity() {
    return form.checkValidity();
  }

  function updateButtonState() {
    nextBtn.disabled = !checkFormValidity();
  }

  const requiredFields = form.querySelectorAll('select[required]');
  requiredFields.forEach(field => {
    field.addEventListener('change', updateButtonState);
  });

  nextBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!checkFormValidity()) {
      form.reportValidity();
      return;
    }

    const data = {
      utente: utenteId,
      regioneNascita: form.regioneN.value,
      regioneResidenza: form.regioneR.value,
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
        alert('Errore nel salvataggio dei dati, riprova.');
      }
    } catch (error) {
      alert('Errore di rete o server: ' + error.message);
    } finally{
        nextBtn.disabled = false;
    }
  });
});
