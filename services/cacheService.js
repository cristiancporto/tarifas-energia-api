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
    global.cachedDistribuidoras = [
      {
        distribuidora: "NEOENERGIA BRASILIA",
        slug: "neoenergia-braslia",
        estado: "DF",
        tarifa_energia_kwh: 0.784,
      },
      {
        distribuidora: "ENERGISA MATO GROSSO",
        slug: "energisa-mt",
        estado: "MT",
        tarifa_energia_kwh: 0.749,
      }
    ];
  };
  
