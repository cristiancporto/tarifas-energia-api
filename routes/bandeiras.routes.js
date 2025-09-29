import express from 'express';
import { listarBandeirasPorFiltro } from '../controllers/bandeiras.controller.js';

const router = express.Router();

router.get('/', listarBandeirasPorFiltro);

export default router;