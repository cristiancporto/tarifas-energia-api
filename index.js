import express from 'express';
import distribuidorasRoutes from './routes/distribuidoras.routes.js';
import { carregarDistribuidorasResidenciais } from './services/cacheService.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/distribuidoras', distribuidorasRoutes);

app.get('/', (req, res) => {
  res.send('API de Tarifas Elétricas do Brasil');
});

(async () => {
  await carregarDistribuidorasResidenciais();
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
})();
