const express = require('express');
const crypto  = require('crypto');
const { acessos } = require('../db');
const { autenticar } = require('../middleware/auth');

const router = express.Router();

const BOLAO_SECRET = 'bolaotech2026';

// Mantido em sync com js/data.js – COPA_DATA.codigoRotacoes
const ROTACOES = {
  "2026-06-15": 0, "2026-06-16": 0, "2026-06-17": 0,
  "2026-06-18": 0, "2026-06-19": 0, "2026-06-20": 0,
  "2026-06-21": 0, "2026-06-22": 0, "2026-06-23": 0,
  "2026-06-24": 0, "2026-06-25": 0, "2026-06-26": 0,
  "2026-06-27": 0,
};

function gerarCodigoDia(data) {
  const rot  = ROTACOES[data] ?? 0;
  const hash = crypto.createHash('sha256').update(data + BOLAO_SECRET + rot).digest('hex');
  return hash.slice(0, 6).toUpperCase();
}

// GET /api/acessos – datas desbloqueadas do usuário
router.get('/', autenticar, (req, res) => {
  const rows   = acessos.findByUsuario(req.usuario.id);
  const result = {};
  rows.forEach(a => { result[a.data] = a.rotacao; });
  res.json(result);
});

// POST /api/acessos – desbloquear data com código
router.post('/', autenticar, (req, res) => {
  const { data, codigo } = req.body;

  if (!data || !codigo) {
    return res.status(400).json({ erro: 'Dados inválidos' });
  }
  if (!(data in ROTACOES)) {
    return res.status(400).json({ erro: 'Data inválida' });
  }
  if (codigo.toUpperCase() !== gerarCodigoDia(data)) {
    return res.status(401).json({ erro: 'Código incorreto' });
  }

  acessos.upsert(req.usuario.id, data, ROTACOES[data] ?? 0);
  res.json({ ok: true });
});

// GET /api/acessos/codigos – admin: lista todos os códigos
router.get('/codigos', autenticar, (req, res) => {
  if (!req.usuario.is_admin) {
    return res.status(403).json({ erro: 'Acesso restrito' });
  }
  const codigos = {};
  Object.keys(ROTACOES).forEach(data => { codigos[data] = gerarCodigoDia(data); });
  res.json(codigos);
});

module.exports = router;
