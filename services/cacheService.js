import { obterDistribuidorasCSV, lerDistribuidorasCSVDireto, obterBandeirasCSV, lerBandeirasCSVDireto } from './aneelService.js';

function limparNaoSeAplica(campo) {
  if (campo === 'Não se aplica' || campo === 'N�o se aplica')
    return null;
  return campo;
}

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
        base_tarifaria: d.DscBaseTarifaria.normalize("NFD"),
        tarifa_energia_kwh: parseFloat(d.VlrTE.replace(',', '.')) / 1000,
        tarifa_energia_bruto: parseFloat(d.VlrTE.replace(',', '.')),
        tarifa_uso_kwh: d.VlrTUSD ? parseFloat(d.VlrTUSD.replace(',', '.')) / 1000 : null,
        tarifa_uso_bruto: parseFloat(d.VlrTUSD.replace(',', '.')),
        modalidade: limparNaoSeAplica(d.DscModalidadeTarifaria),
        subgrupo: limparNaoSeAplica(d.DscSubGrupo),
        inicio_vigencia: limparNaoSeAplica(d.DatInicioVigencia),
        fim_vigencia: limparNaoSeAplica(d.DatFimVigencia),
        unidade_terciaria: limparNaoSeAplica(d.DscUnidadeTerciaria),
        classe: limparNaoSeAplica(d.DscClasse),
        subclasse: limparNaoSeAplica(d.DscSubClasse),
        detalhe: limparNaoSeAplica(d.DscDetalhe),
        posto_tarifario: limparNaoSeAplica(d.NomPostoTarifario),
        distribuidora_acessante: limparNaoSeAplica(d.SigAgenteAcessante)
      }));

    global.cachedDistribuidoras = residenciais;
    console.log(`✅ ${residenciais.length} distribuidoras residenciais carregadas com sucesso.`);

  } catch (erro) {
    console.error('❌ Erro ao carregar distribuidoras da ANEEL:', erro.message);
    global.cachedDistribuidoras = []; // Garante que não quebra rotas
  }
};

export const carregarBandeirasTarifarias = async () => {
  try {
    console.log('🔄 Carregando dados da ANEEL...');

    const csvUrl = await obterBandeirasCSV();
    const todasBandeiras = await lerBandeirasCSVDireto(csvUrl);
    global.cachedBandeiras = todasBandeiras.map(d => ({
      competencia: d.DatCompetencia,
      bandeira: d.NomBandeiraAcionada,
      adicional_kWh: parseFloat(d.VlrAdicionalBandeira.replace(',', '.')) / 1000,
    }));
  } catch (erro) {
    console.error('❌ Erro ao carregar bandeiras da ANEEL:', erro.message);
    global.cachedBandeiras = []; // Garante que não quebra rotas
  }
};