import express from 'express';
import distribuidorasRoutes from './routes/distribuidoras.routes.js';
import { carregarDistribuidorasResidenciais } from './services/cacheService.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/distribuidoras', distribuidorasRoutes);

app.get('/carregar-cache', async (req, res) => {
  try {
    console.log('Iniciando carregamento do cache da ANEEL...');
    await carregarDistribuidorasResidenciais();
    console.log('Cache carregado com sucesso.');
    res.json({ sucesso: true, mensagem: 'Cache carregado com sucesso' });
  } catch (err) {
    console.error('Erro ao carregar cache:', err.message);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('API de Tarifas Elétricas do Brasil');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
