import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { writeAffidabilitaCSV } from '../saveCSV/csv_writer.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_CSV = path.join(__dirname, '../../valutazioni.csv');
const AFF_PATH = path.join(__dirname, '../../affidabilita.csv');

const risposteCorrette = {
  "Grenoble 1": "Grenoble Peggio",
  "Grenoble 2": "Grenoble Peggio",
  "Grenoble 3": "Grenoble Molto Peggio",
  "Grenoble 4": "Grenoble Peggio",
  "Grenoble 5": "Grenoble Peggio",
  "Grenoble 6": "Grenoble Peggio",
  "Grenoble 7": "Grenoble Peggio",
  "Grenoble 8": "Grenoble Peggio",
  "Grenoble 9": "Grenoble Peggio",
  "Grenoble 10": "Grenoble Peggio"
};

const valutazioni = {
  "Grenoble Molto Peggio": 1,
  "Grenoble Peggio": 2,
  "Uguale": 3,
  "Grenoble Meglio": 4,
  "Grenoble Molto Meglio": 5,
};

async function leggiCSV(PATH){
  if (!fs.existsSync(PATH)) return [];
  let records = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(PATH)
      .pipe(csv())
      .on('data', row => records.push(row))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
};

function filtraConfrontiGrenobleUnici(records) {
  const confrontiPerUtente = {};

  for (const row of records) {
    const { Utente, A, B } = row;

    let grenobleSample;

    if (A.startsWith('Grenoble') && B.startsWith('ElevenLabs')) {
      grenobleSample = A;
    } else if (B.startsWith('Grenoble') && A.startsWith('ElevenLabs')) {
      grenobleSample = B;
    }

    if (grenobleSample) {
      if (!confrontiPerUtente[Utente]) {
        confrontiPerUtente[Utente] = new Map();
      }

      if (!confrontiPerUtente[Utente].has(grenobleSample)) {
        confrontiPerUtente[Utente].set(grenobleSample, row);
      }
    }
  }

  const validi = {};
  for (const [utente, mappaConfronti] of Object.entries(confrontiPerUtente)) {
    if (mappaConfronti.size >= 10) {
      validi[utente] = Array.from(mappaConfronti.values()).slice(0, 10);
    }
  }

  return validi;
}

function calcolaAffidabilita(confrontiUtente, risposteCorrette, valutazioni) {
  const affidabilita = [];

  for (const [utente, confronti] of Object.entries(confrontiUtente)) {
    let corrette = 0;
    let punteggioTotale = 0;
    
    for (const row of confronti) {
      const { A, B, Scelta } = row;
      const grenobleSample = A.startsWith('Grenoble') ? A : B;
      const sceltaUtente = Scelta.trim();
      const sceltaCorretta = risposteCorrette[grenobleSample]?.trim();

      if (!sceltaCorretta) {
        continue;
      }

      if (sceltaUtente === sceltaCorretta) {
        corrette++;
      }

      const valutazioneCorretta = valutazioni[sceltaCorretta];
      if (valutazioneCorretta !== undefined && sceltaUtente === sceltaCorretta) {
        punteggioTotale += valutazioneCorretta;
      }
    }

    const affidabilitaPercentuale = ((corrette / 10) * 100).toFixed(2);
    const mediaPunteggio = corrette > 0 ? (punteggioTotale / corrette).toFixed(2) : '0.00';

    affidabilita.push({
      utente,
      corrette_su_10: corrette,
      affidabilita: affidabilitaPercentuale,
      media: mediaPunteggio,
    });
  }
  return affidabilita;
}

export async function valAffidabilita() {
  try {
    const records = await leggiCSV(INPUT_CSV);
    const confrontiValidi = filtraConfrontiGrenobleUnici(records);
    const haUtenteValido = Object.values(confrontiValidi).some(confronti => confronti.length >= 10);

    if (!haUtenteValido) {
      return;
    }

    const risultati = calcolaAffidabilita(confrontiValidi, risposteCorrette, valutazioni);
    const risultatiFiltrati = risultati.filter(risultato => parseFloat(risultato.affidabilita) >= 75);

    if (risultatiFiltrati.length === 0) {
      return;
    }

    const esistenti = await leggiCSV(AFF_PATH);
    const utentiEsistenti = new Set(esistenti.map(r => r.utente));
    const nuoviSenzaDuplicati = risultatiFiltrati.filter(r => !utentiEsistenti.has(r.utente));

    if (nuoviSenzaDuplicati.length > 0) {
      const risultatiFinali = [...esistenti, ...nuoviSenzaDuplicati];
      await writeAffidabilitaCSV(nuoviSenzaDuplicati);
    }

  } catch (err) {
    console.error('Errore durante il calcolo dell\'affidabilità:', err);
  }
}




