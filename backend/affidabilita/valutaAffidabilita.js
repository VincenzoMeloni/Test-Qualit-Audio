import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { writeAffidabilitaCSV } from '../saveCSV/csv_writer.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_CSV = path.join(__dirname, '../../risultati/valutazioni.csv');
const AFF_PATH = path.join(__dirname, '../../risultati/affidabilita.csv');

const risposteCorrette = {
  "Reale 1": "Reale Molto Meglio",
  "Reale 2": "Reale Molto Meglio",
  "Reale 3": "Reale Molto Meglio",
  "Reale 4": "Reale Molto Meglio",
  "Reale 5": "Reale Molto Meglio"
};

const valutazioni = {
  "Grenoble Molto Peggio": 1,
  "Grenoble Peggio": 2,
  "Uguale": 3,
  "Grenoble Meglio": 4,
  "Grenoble Molto Meglio": 5
};

async function leggiCSV(PATH) {
  if (!fs.existsSync(PATH)) return [];
  const records = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(PATH)
      .pipe(csv())
      .on('data', row => records.push(row))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
}

function processaDati(records, risposteCorrette, valutazioni) {
  const utenti = {};

  for (const row of records) {
    const { Utente, A, B } = row;

    if (!Utente) continue;

    if (!utenti[Utente]) {
      utenti[Utente] = {
        controllo: [],
        valutazioni: []
      };
    }

    if (A.startsWith('Reale') || B.startsWith('Reale')) {
      utenti[Utente].controllo.push(row);
    }
    else if (
      (A.startsWith('Grenoble') && B.startsWith('ElevenLabs')) ||
      (B.startsWith('Grenoble') && A.startsWith('ElevenLabs'))
    ) {
      const grenobleSample = A.startsWith('Grenoble') ? A : B;
      if (!grenobleSample.includes('Danneggiata')) {
        utenti[Utente].valutazioni.push(row);
      }
    }
  }

  const risultati = [];
  const utentiElaborati = new Set();

  for (const [utente, dati] of Object.entries(utenti)) {
    if (utentiElaborati.has(utente)) continue;
    const { controllo, valutazioni: valutazioniUtente } = dati;
    if (controllo.length < 10 || valutazioniUtente.length < 10) continue;

    let corrette = 0;
    for (const row of controllo) {
      const { A, B, Scelta } = row;
      const sample = A.startsWith('Reale') ? A : B;
      const sceltaUtente = Scelta.trim();
      const corretta = risposteCorrette[sample]?.trim();
      if (sceltaUtente === corretta) corrette++;
    }

    if (corrette < 7) continue;
    
    const percentuale = ((corrette / controllo.length) * 100).toFixed(2);

    let totale = 0;
    let conteggio = 0;

    for (const row of valutazioniUtente.slice(0, 10)) {
      const voto = valutazioni[row.Scelta.trim()];
      if (voto !== undefined) {
        totale += voto;
        conteggio++;
      }
    }

    if (conteggio < 10) continue;

    const media = (totale / conteggio).toFixed(2);

    risultati.push({
      utente,
      corrette_su_10: corrette,
      affidabilita: percentuale,
      media
    });

    utentiElaborati.add(utente);
  }

  return risultati;
}

export async function valAffidabilita() {
  try {
    const esistenti = await leggiCSV(AFF_PATH);
    const utentiEsistenti = new Set(esistenti.map(r => r.Utente));

    const records = await leggiCSV(INPUT_CSV);
    const nuoviRisultati = processaDati(records, risposteCorrette, valutazioni)
      .filter(risultato => !utentiEsistenti.has(risultato.utente));

    if (nuoviRisultati.length > 0) {
      await writeAffidabilitaCSV(nuoviRisultati);
    }
  } catch (err) {
    console.error("Errore durante il calcolo dell'affidabilità:", err);
  }
}