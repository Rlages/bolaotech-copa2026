const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { usuarios } = require('../db');
const { autenticar, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'Senha deve ter ao menos 6 caracteres' });
  }

  if (usuarios.findByEmail(email)) {
    return res.status(409).json({ erro: 'E-mail já cadastrado' });
  }

  const hash   = bcrypt.hashSync(senha, 10);
  const user   = usuarios.create({ nome: nome.trim(), email, senha_hash: hash });
  const payload = { id: user.id, nome: user.nome, email: user.email, is_admin: user.is_admin };
  const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

  res.json({ token, usuario: payload });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }

  const user = usuarios.findByEmail(email);
  if (!user || !bcrypt.compareSync(senha, user.senha_hash)) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
  }

  const payload = { id: user.id, nome: user.nome, email: user.email, is_admin: user.is_admin };
  const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

  res.json({ token, usuario: payload });
});

// GET /api/auth/me
router.get('/me', autenticar, (req, res) => {
  res.json({ usuario: req.usuario });
});

module.exports = router;
