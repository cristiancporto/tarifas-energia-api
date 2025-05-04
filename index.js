import express from 'express';
import distribuidorasRoutes from './routes/distribuidoras.routes.js';
import { carregarDistribuidorasResidenciais } from './services/cacheService.js';

const app = express();
const PORT = process.env.PORT || 3000;

let cacheCarregado = false;

app.use(async (req, res, next) => {
  if (!cacheCarregado) {
    try {
      await carregarDistribuidorasResidenciais();
      cacheCarregado = true;
      console.log('Cache da ANEEL carregado com sucesso');
    } catch (err) {
      console.error('Erro ao carregar cache:', err.message);
    }
  }
  next();
});

app.use(express.json());
app.use('/distribuidoras', distribuidorasRoutes);

app.get('/', (req, res) => {
  res.send('API de Tarifas Elétricas do Brasil');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});