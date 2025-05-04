import { obterDistribuidorasCSV, lerDistribuidorasCSVDireto } from './aneelService.js';

const limparTexto = (texto) => {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/\s+/g, '-')            // espaços -> hífen
        .replace(/[^a-z0-9\-]/gi, '')    // remove símbolos
        .toLowerCase();
};

export const carregarDistribuidorasResidenciais = async () => {
    try {
        const csvUrl = await obterDistribuidorasCSV();
        const dados = await lerDistribuidorasCSVDireto(csvUrl);

        const resultado = dados.map((linha) => {
            const nomeDistribuidora = linha.SigAgente;

            const slug = limparTexto(nomeDistribuidora);
            
        return {
            slug,
            distribuidora: nomeDistribuidora,
            cnpj: linha.NumCNPJDistribuidora,
            classe: linha.DscClasse,
            modalidade: linha.DscModalidadeTarifaria,
            subgrupo: linha.DscSubGrupo,
            tarifa_energia_kwh: linha.VlrTE ? parseFloat(linha.VlrTE.replace(',', '.')) / 1000 : null,
            tarifa_uso_kwh: linha.VlrTUSD ? parseFloat(linha.VlrTUSD.replace(',', '.')) / 1000 : null,
            inicio_vigencia: linha.DatInicioVigencia,
            fim_vigencia: linha.DatFimVigencia
        };
    });

    // Filtro básico: classe Residencial + modalidade Convencional
    const filtrado = resultado.filter(d =>
        d.classe?.toLowerCase() === 'residencial' &&
        d.modalidade?.toLowerCase() === 'convencional'
    );

    global.cachedDistribuidoras = filtrado;
    console.log(`✔️ Cache carregado com ${filtrado.length} distribuidoras residenciais`);
} catch (error) {
    console.error('Erro ao carregar cache da ANEEL:', error.message);
}
};
