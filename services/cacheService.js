import { obterDistribuidorasCSV, lerDistribuidorasCSVDireto } from './aneelService.js';

export const carregarDistribuidorasResidenciais = async () => {
  try {
    console.log('🔄 Carregando dados da ANEEL...');

    const csvUrl = await obterDistribuidorasCSV();
    const todasDistribuidoras = await lerDistribuidorasCSVDireto(csvUrl);

    // Filtra apenas distribuidoras da classe residencial com valores válidos
    const residenciais = todasDistribuidoras
      .filter(d => d.DscClasse === 'Residencial' && d.VlrTE && d.SigAgente)
      .map(data => {
        let formattedData = {
          distribuidora: data.SigAgente,
          slug: data.SigAgente.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, ''),
          estado: data.SigUF,
          cnpj: data.NumCNPJDistribuidora,
          baseTarifaria: data.DscBaseTarifaria.normalize("NFD"),
          tarifaEnergiaKwh: parseFloat(data.VlrTE.replace(',', '.')) / 1000,
          tusdBruto: parseFloat(data.VlrTUSD.replace(',', '.')),
          teBruto: parseFloat(data.VlrTE.replace(',', '.')),
          tarifaUsoKwh: data.VlrTUSD ? parseFloat(data.VlrTUSD.replace(',', '.')) / 1000 : null,
          subGgrupo: data.DscSubGrupo,
          inicioVigencia: data.DatInicioVigencia,
          fimVigencia: data.DatFimVigencia,
          unidadeTerciaria: data.DscUnidadeTerciaria
        };

        if (data.DscModalidadeTarifaria && data.DscModalidadeTarifaria !== 'Não se aplica')
          formattedData.modalidade = data.DscModalidadeTarifaria.normalize("NFD");

        if (data.DscClasse && data.DscClasse !== 'Não se aplica')
          formattedData.classe = data.DscClasse.normalize("NFD");

        if (data.DscSubClasse && data.DscSubClasse !== 'Não se aplica')
          formattedData.subClasse = data.DscSubClasse.normalize("NFD");

        if (data.DscDetalhe && data.DscDetalhe !== 'Não se aplica')
          formattedData.detalhe = data.DscDetalhe.normalize("NFD");

        if (data.NomPostoTarifario && data.NomPostoTarifario !== 'Não se aplica')
          formattedData.postoTarifario = data.NomPostoTarifario.normalize("NFD");

        if (data.SigAgenteAcessante && data.SigAgenteAcessante !== 'Não se aplica')
          formattedData.agenteAcessante = data.SigAgenteAcessante.normalize("NFD");

        return formattedData;
      });

    global.cachedDistribuidoras = residenciais;
    console.log(`✅ ${residenciais.length} distribuidoras residenciais carregadas com sucesso.`);

  } catch (erro) {
    console.error('❌ Erro ao carregar distribuidoras da ANEEL:', erro.message);
    global.cachedDistribuidoras = []; // Garante que não quebra rotas
  }
};