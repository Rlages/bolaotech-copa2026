const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Inicializa o banco (cria tabelas + admin padrão se necessário)
require('./db');

const authRoutes      = require('./routes/auth');
const palpitesRoutes  = require('./routes/palpites');
const resultadosRoutes = require('./routes/resultados');
const acessosRoutes   = require('./routes/acessos');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth',       authRoutes);
app.use('/api/palpites',   palpitesRoutes);
app.use('/api/resultados', resultadosRoutes);
app.use('/api/acessos',    acessosRoutes);

// Arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Fallback: qualquer rota desconhecida serve o index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n⚽ BolãoTech Copa 2026 rodando em http://localhost:${PORT}\n`);
});
