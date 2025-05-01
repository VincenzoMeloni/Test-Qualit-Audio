import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

const CSV_PATH = 'valutazioni.csv';

const fileExists = fs.existsSync(CSV_PATH);

const csvWriter = createObjectCsvWriter({
  path: 'valutazioni.csv',
  header: [
    { id: 'A', title: 'A' },
    { id: 'B', title: 'B' },
    { id: 'scelta', title: 'scelta' }
  ],
  append: fileExists,
  writeHead: !fileExists
});

export const writeCSV = async (data) => {
  try {
    await csvWriter.writeRecords([data]);
  } catch (err) {
    console.error('Errore durante il salvataggio del CSV:', err);
    throw new Error('Errore nel salvataggio del CSV');
  }
};