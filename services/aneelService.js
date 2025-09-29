import axios from 'axios';
import https from 'https';
import csv from 'csv-parser';
import iconv from 'iconv-lite';

export const obterDistribuidorasCSV = async () => {
  try {
    const pacote = await axios.get(
      'https://dadosabertos.aneel.gov.br/api/3/action/package_show',
      { params: { id: 'tarifas-distribuidoras-energia-eletrica' } }
    );

    const recursos = pacote.data.result.resources;
    const recursoCSV = recursos.find(r => r.format === 'CSV');

    if (!recursoCSV) {
      throw new Error('Arquivo CSV de tarifas não encontrado');
    }

    return recursoCSV.url; // <- link direto pro CSV atualizado
  } catch (err) {
    console.error('Erro ao obter URL do CSV:', err.message);
    throw err;
  }
};

export const lerDistribuidorasCSVDireto = (csvUrl) => {
  return new Promise((resolve, reject) => {
    const resultados = [];

    https.get(csvUrl, (res) => {
      res
      .pipe(iconv.decodeStream('latin1'))
      .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          resultados.push(data);
        })
        .on('end', () => {
          resolve(resultados);
        })
        .on('error', (err) => {
          reject(err);
        });
    }).on('error', (err) => {
      reject(err);
    });
  });
};