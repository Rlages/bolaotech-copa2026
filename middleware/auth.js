const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bolaotech_secret_copa2026';

function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  try {
    req.usuario = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

function autenticarAdmin(req, res, next) {
  autenticar(req, res, () => {
    if (!req.usuario.is_admin) {
      return res.status(403).json({ erro: 'Acesso restrito ao administrador' });
    }
    next();
  });
}

module.exports = { autenticar, autenticarAdmin, JWT_SECRET };
