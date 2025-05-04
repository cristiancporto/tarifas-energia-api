import bandeiras from '../data/bandeiras.js';
import { lerDistribuidorasCSVDireto, obterDistribuidorasCSV } from '../services/aneelService.js';

export const listarDistribuidoras = (req, res) => {
  res.json({ sucesso: true, dados: distribuidoras });
};

export const buscarDistribuidora = (req, res) => {
  const { slug } = req.params;
  const dist = distribuidoras.find(d => d.slug === slug);

  if (!dist) {
    return res.status(404).json({ sucesso: false, erro: 'Distribuidora não encontrada' });
  }

  res.json({ sucesso: true, dados: dist });
};

export const projetarConsumo = (req, res) => {
  const { consumo_kwh, distribuidora_slug } = req.body;

  if (consumo_kwh === undefined || consumo_kwh === null || distribuidora_slug === undefined || distribuidora_slug === null) {
    return res.status(400).json({ sucesso: false, erro: 'Os campos consumo_kwh e distribuidora_slug são obrigatórios.' });
  }

  if (typeof consumo_kwh !== 'number' || isNaN(consumo_kwh) || consumo_kwh <= 0) {
    return res.status(400).json({ sucesso: false, erro: 'O campo consumo_kwh deve ser um número positivo.' });
  }

  if (typeof distribuidora_slug !== 'string' || distribuidora_slug.trim() === '') {
    return res.status(400).json({ sucesso: false, erro: 'O campo distribuidora_slug deve ser uma string não vazia.' });
  }

  const dist = global.cachedDistribuidoras.find(
    d => d.slug === distribuidora_slug.toLowerCase()
  );

  if (!dist) {
    return res.status(404).json({ sucesso: false, erro: 'Distribuidora não encontrada com o slug informado.' });
  }

  const mesAtual = new Date().toISOString().slice(0, 7);
  const bandeira = bandeiras.find(b => b.mes === mesAtual) || { tipo: 'verde', valor_adicional_kwh: 0 };

  const tarifaBase = dist.tarifa_energia_kwh || 0;
  const adicional = bandeira.valor_adicional_kwh || 0;

  const valor_estimado = consumo_kwh < 30
    ? 23.52
    : consumo_kwh * (tarifaBase + adicional);

  res.json({
    sucesso: true,
    dados: {
      distribuidora: dist.distribuidora,
      consumo_kwh,
      tarifa_kwh: tarifaBase,
      bandeira: bandeira.tipo,
      adicional_bandeira: adicional,
      valor_estimado: parseFloat(valor_estimado.toFixed(2))
    }
  });
};

export const obterCSVdaANEEL = async (req, res) => {
  try {
    const url = await obterDistribuidorasCSV();
    res.json({ sucesso: true, dados: { url } });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: 'Erro ao obter CSV da ANEEL' });
  }
};

export const listarDistribuidorasDinamico = async (req, res) => {
  try {
    const csvUrl = await obterDistribuidorasCSV();
    const dados = await lerDistribuidorasCSVDireto(csvUrl);

    const resultado = dados.map((linha) => ({
      distribuidora: linha.SigAgente,
      cnpj: linha.NumCNPJDistribuidora,
      classe: linha.DscClasse,
      modalidade: linha.DscModalidadeTarifaria,
      subgrupo: linha.DscSubGrupo,
      tarifa_energia_kwh: linha.VlrTE ? parseFloat(linha.VlrTE.replace(',', '.')) / 1000 : null,
      tarifa_uso_kwh: linha.VlrTUSD ? parseFloat(linha.VlrTUSD.replace(',', '.')) / 1000 : null,
      inicio_vigencia: linha.DatInicioVigencia,
      fim_vigencia: linha.DatFimVigencia
    }));

    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar dados da ANEEL', detalhe: error.message });
  }
};

export const listarDistribuidorasCache = (req, res) => {
  const unicas = [...new Set(global.cachedDistribuidoras.map(d => d.distribuidora))];
  res.json({ sucesso: true, dados: unicas.sort() });
};

export const listarSlugsDistribuidoras = (req, res) => {
  const slugs = global.cachedDistribuidoras.map(d => d.slug);
  res.json({ sucesso: true, dados: slugs.sort() });
};

export const buscarDistribuidorasPorNome = (req, res) => {
  const termo = req.query.nome?.toLowerCase();

  if (!termo) {
    return res.status(400).json({ sucesso: false, erro: 'Informe o parâmetro ?nome=' });
  }

  const resultados = global.cachedDistribuidoras.filter(d =>
    d.distribuidora.toLowerCase().includes(termo)
  );

  if (!resultados.length) {
    return res.status(404).json({ sucesso: false, erro: 'Nenhuma distribuidora encontrada com esse nome.' });
  }

  res.json({ sucesso: true, dados: resultados });
};

export const obterBandeiraAtual = (req, res) => {
  const mesAtual = new Date().toISOString().slice(0, 7);
  const bandeira = bandeiras.find(b => b.mes === mesAtual) || { tipo: 'verde', valor_adicional_kwh: 0 };

  res.json({ sucesso: true, dados: bandeira });
};
