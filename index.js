import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { writeValutazioniCSV } from './backend/saveCSV/csv_writer.js';
import { Validazione } from './backend/middleware/validate.js';
import { valAffidabilita } from "./backend/affidabilita/valutaAffidabilita.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

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