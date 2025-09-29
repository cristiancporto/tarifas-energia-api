import express from 'express';
import distribuidorasRoutes from './routes/distribuidoras.routes.js';
import bandeirasRoutes from './routes/bandeiras.routes.js';
import { carregarBandeirasTarifarias, carregarDistribuidorasResidenciais } from './services/cacheService.js';

const app = express();
const PORT = process.env.PORT || 3000;

global.cachedDistribuidoras = [];
global.cachedBandeiras = [];

try{

  app.use(express.json());
  app.use('/distribuidoras', distribuidorasRoutes);
  
  app.use('/bandeiras', bandeirasRoutes);
  
  app.get('/carregar-cache', async (req, res) => {
    try {
      await loadCache();
      res.json({ sucesso: true, mensagem: 'Cache carregado com sucesso' });
    } catch (err) {
      res.status(500).json({ sucesso: false, erro: err.message });
    }
  });
  
  app.get('/', (req, res) => {
    res.send('API de Tarifas Elétricas do Brasil');
  });
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
  
  await loadCache();
  
  async function loadCache(req, res){
    try {
      console.log('Iniciando carregamento do cache de distribuidoras da ANEEL...');
      await carregarDistribuidorasResidenciais();
      console.log('Cache de distribuidoras carregado com sucesso.');
      console.log('Iniciando carregamento do cache de bandeiras da ANEEL...');
      await carregarBandeirasTarifarias();
      console.log('Cache de bandeiras carregado com sucesso.');
  
    } catch(err){
      console.error('Erro ao carregar cache:', err.message);
      throw err;
    }
  }
} catch(error){
  console.error(error);
}