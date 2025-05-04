import fs from 'fs';
import csv from 'csv-parser';

const resultados = [];

fs.createReadStream('./data/tarifas-aneel.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (data) => {
    resultados.push({
      slug: data.Distribuidora.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      nome: data.Distribuidora,
      estado: data.UF,
      cnpj: data.CNPJ,
      tarifas: {
        modalidade: "convencional",
        tarifa_kwh: parseFloat(data.TarifaConvencional.replace(',', '.')),
        tarifa_minima_kwh: 30,
        custo_tarifa_minima: 23.52
      },
      vigencia: {
        inicio: data.InicioVigencia,
        fim: data.FimVigencia
      }
    });
  })
  .on('end', () => {
    fs.writeFileSync('./data/distribuidorasGeradas.json', JSON.stringify(resultados, null, 2));
    console.log('Importação concluída com sucesso!');
  });
