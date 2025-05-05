import { obterDistribuidorasCSV, lerDistribuidorasCSVDireto } from './aneelService.js';

export const carregarDistribuidorasResidenciais = async () => {
  try {
    console.log('🔄 Carregando dados da ANEEL...');

    const csvUrl = await obterDistribuidorasCSV();
    const todasDistribuidoras = await lerDistribuidorasCSVDireto(csvUrl);

    // Filtra apenas distribuidoras da classe residencial com valores válidos
    const residenciais = todasDistribuidoras
      .filter(d => d.DscClasse === 'Residencial' && d.VlrTE && d.SigAgente)
      .map(d => ({
        distribuidora: d.SigAgente,
        slug: d.SigAgente.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, ''),
        estado: d.SigUF,
        cnpj: d.NumCNPJDistribuidora,
        tarifa_energia_kwh: parseFloat(d.VlrTE.replace(',', '.')) / 1000,
        tarifa_uso_kwh: d.VlrTUSD ? parseFloat(d.VlrTUSD.replace(',', '.')) / 1000 : null,
        modalidade: d.DscModalidadeTarifaria,
        subgrupo: d.DscSubGrupo,
        inicio_vigencia: d.DatInicioVigencia,
        fim_vigencia: d.DatFimVigencia,
      }));

    global.cachedDistribuidoras = residenciais;
    console.log(`✅ ${residenciais.length} distribuidoras residenciais carregadas com sucesso.`);

  } catch (erro) {
    console.error('❌ Erro ao carregar distribuidoras da ANEEL:', erro.message);
    global.cachedDistribuidoras = []; // Garante que não quebra rotas
  }
};