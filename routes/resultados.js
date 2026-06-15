const express = require('express');
const { resultados } = require('../db');
const { autenticar, autenticarAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/resultados – qualquer usuário autenticado
router.get('/', autenticar, (req, res) => {
  const rows   = resultados.findAll();
  const result = {};
  rows.forEach(r => {
    result[r.jogo_id] = { mandante: r.gols_mandante, visitante: r.gols_visitante };
  });
  res.json(result);
});

// POST /api/resultados – somente admin
router.post('/', autenticarAdmin, (req, res) => {
  const { jogoId, golsMandante, golsVisitante } = req.body;

  if (jogoId == null || golsMandante == null || golsVisitante == null) {
    return res.status(400).json({ erro: 'Dados inválidos' });
  }

  resultados.upsert(jogoId, parseInt(golsMandante), parseInt(golsVisitante));
  res.json({ ok: true });
});

module.exports = router;
