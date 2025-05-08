import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VAL_PATH = path.join(__dirname, '../../valutazioni.csv');
const AFF_PATH = path.join(__dirname, '../../affidabilita.csv');

const valExists = fs.existsSync(VAL_PATH);
const affExists = fs.existsSync(AFF_PATH);

const valCsvWriter = createObjectCsvWriter({
  path: VAL_PATH,
  header: [
    { id: 'utente', title: 'Utente' },
    { id: 'A', title: 'A' },
    { id: 'B', title: 'B' },
    { id: 'scelta', title: 'Scelta' }
  ],
  append: valExists,
  writeHead: !valExists,
  quoteColumns: true,
  recordDelimiter: '\n'
});

export const writeValutazioniCSV = async (data) => {
  try {
    await valCsvWriter.writeRecords([data]);
    aggiungiNewLine(VAL_PATH);
    console.log("valutazione salvata con successo!");
  } catch (err) {
    console.error('Errore durante il salvataggio di valutazioni.csv:', err);
    throw new Error('Errore durante il salvataggio di valutazioni.csv');
  }
};

const affCsvWriter = createObjectCsvWriter({
  path: AFF_PATH,
  header: [
    { id: 'utente', title: 'utente' },
    { id: 'corrette_su_10', title: 'corrette_su_10' },
    { id: 'affidabilita', title: 'affidabilita(%)' },
    { id: 'media', title: 'media' }
  ],
  append: affExists,
  writeHead: !affExists,
  quoteColumns: true,
  recordDelimiter: '\n'
});

export const writeAffidabilitaCSV = async (data) => {
  try {
    await affCsvWriter.writeRecords(data);
    aggiungiNewLine(AFF_PATH);
    console.log("affidabilita salvata con successo!");
  } catch (err) {
    console.error('Errore durante il salvataggio di affidabilita.csv:', err);
    throw new Error('Errore durante il salvataggio di affidabilita.csv');
  }
};


function aggiungiNewLine(PATH){
  if(!fs.readFileSync(PATH,'utf-8').endsWith('\n')){
    fs.appendFileSync(PATH,'\n','utf-8');
  }
}