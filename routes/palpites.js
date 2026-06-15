const express = require('express');
const { palpites, usuarios } = require('../db');
const { autenticar } = require('../middleware/auth');

const router = express.Router();

// GET /api/palpites – palpites do usuário logado
router.get('/', autenticar, (req, res) => {
  const rows   = palpites.findByUsuario(req.usuario.id);
  const result = {};
  rows.forEach(p => { result[p.jogo_id] = { vencedor: p.vencedor }; });
  res.json(result);
});

// GET /api/palpites/todos – todos os palpites agrupados por usuário (para ranking)
router.get('/todos', autenticar, (req, res) => {
  const todos_palpites = palpites.findAll();
  const todos_usuarios = {};

  // Monta mapa id→nome para evitar leitura repetida
  const usuariosMap = {};
  todos_palpites.forEach(p => {
    if (!usuariosMap[p.usuario_id]) {
      const u = usuarios.findById(p.usuario_id);
      if (u) usuariosMap[p.usuario_id] = u.nome;
    }
  });

  todos_palpites.forEach(p => {
    const nome = usuariosMap[p.usuario_id];
    if (!nome) return;
    if (!todos_usuarios[nome]) todos_usuarios[nome] = {};
    todos_usuarios[nome][p.jogo_id] = { vencedor: p.vencedor };
  });

  res.json(todos_usuarios);
});

// POST /api/palpites – salvar ou atualizar palpite
router.post('/', autenticar, (req, res) => {
  const { jogoId, vencedor } = req.body;

  if (!jogoId || !['A', 'B', 'E'].includes(vencedor)) {
    return res.status(400).json({ erro: 'Dados inválidos' });
  }

  palpites.upsert(req.usuario.id, jogoId, vencedor);
  res.json({ ok: true });
});

module.exports = router;
