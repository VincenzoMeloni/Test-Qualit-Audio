import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { writeValutazioniCSV,writeUserDataCSV } from '../../backend/saveCSV/csv_writer.js';
import { Validazione,ValidaForm } from '../../backend/middleware/validate.js';
import { valAffidabilita } from "../../backend/affidabilita/valutaAffidabilita.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * /:
 *   get:
 *     description: Restituisce la pagina iniziale.
 *     responses:
 *       200:
 *         description: Pagina HTML restituita
 *       500:
 *         description: Errore interno del server
 * 
 */

router.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend', 'before.html'));
});


/**
 * @swagger
 * /submitDati:
 *   post:
 *     description: Invia i dati dell'utente raccolti dal form.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - utente
 *               - regioneNascita
 *               - regioneResidenza
 *               - genere
 *               - titoloStudio
 *             properties:
 *               utente:
 *                 type: string
 *               regioneNascita:
 *                 type: string
 *               regioneResidenza:
 *                 type: string
 *               eta:
 *                 type: number
 *               genere:
 *                 type: string
 *               titoloStudio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dati utente ricevuti e salvati con successo
 *       400:
 *         description: Dati incompleti
 *       500:
 *         description: Errore nel salvataggio dei dati
 */

router.post('/submitDati', ValidaForm , async (req,res) =>{
  const { utente ,regioneNascita, regioneResidenza, eta, genere, titoloStudio } = req.body;

  try{
    await writeUserDataCSV({utente, regioneNascita, eta, regioneResidenza,genere,titoloStudio});
    res.status(200).json({ message: 'Dati utente ricevuti e salvati con successo!' });
  } catch (err){
    res.status(500).json({ message: 'Errore nel salvataggio dei dati.' });
  }
});


/**
 * @swagger
 * /submit:
 *   post:
 *     description: Invia una valutazione da parte dell'utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - utente
 *               - A
 *               - B
 *               - scelta
 *             properties:
 *               utente:
 *                 type: string
 *               A:
 *                 type: string
 *               B:
 *                 type: string
 *               scelta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Valutazione ricevuta e salvata con successo
 *       400:
 *         description: Dati incompleti
 *       500:
 *         description: Errore interno del server
 */

router.post('/submit', Validazione, async (req, res) => {
    const { utente, A ,B ,scelta } = req.body;
  
    try {
      await writeValutazioniCSV({ utente,A, B, scelta });
      await valAffidabilita();
      res.status(200).json({ message: 'Valutazione ricevuta e salvata con successo!' });
    } catch (err) {
      res.status(500).json({ message: 'Errore interno del server.' });
    }
});

export default router;