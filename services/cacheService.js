import { obterDistribuidorasCSV, lerDistribuidorasCSVDireto } from './aneelService.js';

class CarregarDistribuidoraResponse {
  constructor(data) {
      this.distribuidora = data.SigAgente;
      this.slug = data.SigAgente.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, '');
      this.estado = data.SigUF;
      this.cnpj = data.NumCNPJDistribuidora;
      this.baseTarifaria = data.DscBaseTarifaria.normalize("NFD");
      this.tarifaEnergiaKwh = parseFloat(data.VlrTE.replace(',', '.')) / 1000;
      this.tusdBruto = parseFloat(data.VlrTUSD.replace(',', '.'));
      this.teBruto = parseFloat(data.VlrTE.replace(',', '.'));
      this.tarifaUsoKwh = data.VlrTUSD ? parseFloat(data.VlrTUSD.replace(',', '.')) / 1000 : null;
      this.subGgrupo = data.DscSubGrupo;
      this.inicioVigencia = data.DatInicioVigencia;
      this.fimVigencia = data.DatFimVigencia;
      this.unidadeTerciaria = data.DscUnidadeTerciaria;

    if (data.DscModalidadeTarifaria && data.DscModalidadeTarifaria !== 'Não se aplica')
      this.modalidade = data.DscModalidadeTarifaria.normalize("NFD");

    if (data.DscClasse && data.DscClasse !== 'Não se aplica')
      this.classe = data.DscClasse.normalize("NFD");

    if (data.DscSubClasse && data.DscSubClasse !== 'Não se aplica')
      this.subClasse = data.DscSubClasse.normalize("NFD");

    if (data.DscDetalhe && data.DscDetalhe !== 'Não se aplica')
      this.detalhe = data.DscDetalhe.normalize("NFD");

    if (data.NomPostoTarifario && data.NomPostoTarifario !== 'Não se aplica')
      this.postoTarifario = data.NomPostoTarifario.normalize("NFD");

    if (data.SigAgenteAcessante && data.SigAgenteAcessante !== 'Não se aplica')
      this.agenteAcessante = data.SigAgenteAcessante.normalize("NFD");
  }
}

export const carregarDistribuidorasResidenciais = async () => {
  try {
    console.log('🔄 Carregando dados da ANEEL...');

    const csvUrl = await obterDistribuidorasCSV();
    const todasDistribuidoras = await lerDistribuidorasCSVDireto(csvUrl);

    // Filtra apenas distribuidoras da classe residencial com valores válidos
    const residenciais = todasDistribuidoras
      .filter(d => d.DscClasse === 'Residencial' && d.VlrTE && d.SigAgente)
      .map(data => new CarregarDistribuidoraResponse(data));

    global.cachedDistribuidoras = residenciais;
    console.log(`✅ ${residenciais.length} distribuidoras residenciais carregadas com sucesso.`);

  } catch (erro) {
    console.error('❌ Erro ao carregar distribuidoras da ANEEL:', erro.message);
    global.cachedDistribuidoras = []; // Garante que não quebra rotas
  }
};