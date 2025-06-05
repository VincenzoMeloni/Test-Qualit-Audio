import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { writeValutazioniCSV,writeUserDataCSV } from './backend/saveCSV/csv_writer.js';
import { Validazione,ValidaForm } from './backend/middleware/validate.js';
import { valAffidabilita } from "./backend/affidabilita/valutaAffidabilita.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'before.html'));
});

app.use(express.static(path.join(__dirname, "frontend")));

app.post('/submitDati', ValidaForm , async (req,res) =>{
  const { utente ,regioneNascita, regioneResidenza, genere, titoloStudio } = req.body;

  try{
    await writeUserDataCSV({utente, regioneNascita,regioneResidenza,genere,titoloStudio});
    res.status(200).json({ message: 'Dati utente ricevuti e salvati con successo!' });
  } catch (err){
    res.status(500).json({ message: 'Errore nel salvataggio dei dati.' });
  }
});


app.post('/submit', Validazione, async (req, res) => {
    const { utente,A, B, scelta } = req.body;
  
    try {
      await writeValutazioniCSV({ utente,A, B, scelta });
      await valAffidabilita();
      res.status(200).json({ message: 'Valutazione ricevuta e salvata con successo!' });
    } catch (err) {
      res.status(500).json({ message: 'Errore interno del server.' });
    }
});


app.listen(PORT ,() => {
    console.log(`Server attivo su http://localhost:${PORT}`);
});