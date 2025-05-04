import express from 'express';
import {
    listarDistribuidoras,
    buscarDistribuidora,
    projetarConsumo,
    listarSlugsDistribuidoras,
    listarDistribuidorasCache,
    listarDistribuidorasDinamico,
    obterBandeiraAtual,
    obterCSVdaANEEL,
    buscarDistribuidorasPorNome
} from '../controllers/distribuidoras.controller.js';

const router = express.Router();

// ROTAS FIXAS PRIMEIRO
router.get('/status', (req, res) => {
    res.json({ sucesso: true, dados: { status: 'ok', versao: '1.0.0' } });
});

router.get('/buscar', buscarDistribuidorasPorNome);
router.get('/cache', listarDistribuidorasCache);
router.get('/dinamico', listarDistribuidorasDinamico);
router.get('/atualizar/csv-url', obterCSVdaANEEL);
router.get('/bandeira/atual', obterBandeiraAtual);
router.get('/slugs', listarSlugsDistribuidoras);
router.get('/selecionaveis', (req, res) => {
    const lista = global.cachedDistribuidoras.map(d => ({
        nome: d.distribuidora,
        slug: d.slug
    }));
    res.json({ sucesso: true, dados: lista.sort((a, b) => a.nome.localeCompare(b.nome)) });
});
router.get('/estado/:uf', (req, res) => {
    const uf = req.params.uf.toUpperCase();

    const resultado = global.cachedDistribuidoras.filter(d => d.estado?.toUpperCase() === uf);
    if (!resultado.length) {
        return res.status(404).json({ sucesso: false, erro: 'Nenhuma distribuidora encontrada para esse estado.' });
    }

    res.json({ sucesso: true, dados: resultado });
});

router.post('/projecao', projetarConsumo);

// POR ÚLTIMO: rota dinâmica que captura qualquer slug
router.get('/:slug', buscarDistribuidora);

// Apenas usada se quiser manter o JSON fixo
router.get('/', listarDistribuidoras);

export default router;