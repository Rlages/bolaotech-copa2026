const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// ── Helpers de leitura/escrita atômica ───────────────────────────
function read(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

function write(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`);
  const tmp  = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

function nextId(name) {
  const items = read(name);
  if (items.length === 0) return 1;
  return Math.max(...items.map(i => i.id || 0)) + 1;
}

// ── Usuários ──────────────────────────────────────────────────────
const usuarios = {
  findByEmail(email) {
    return read('usuarios').find(u => u.email === email.toLowerCase()) || null;
  },
  findById(id) {
    return read('usuarios').find(u => u.id === id) || null;
  },
  hasAdmin() {
    return read('usuarios').some(u => u.is_admin === 1);
  },
  create({ nome, email, senha_hash, is_admin = 0 }) {
    const items = read('usuarios');
    const user  = {
      id: nextId('usuarios'),
      nome,
      email: email.toLowerCase(),
      senha_hash,
      is_admin,
      created_at: new Date().toISOString()
    };
    items.push(user);
    write('usuarios', items);
    return user;
  }
};

// ── Palpites ──────────────────────────────────────────────────────
const palpites = {
  findByUsuario(usuario_id) {
    return read('palpites').filter(p => p.usuario_id === usuario_id);
  },
  findAll() {
    return read('palpites');
  },
  upsert(usuario_id, jogo_id, vencedor) {
    const items = read('palpites');
    const idx   = items.findIndex(p => p.usuario_id === usuario_id && p.jogo_id === jogo_id);
    const now   = new Date().toISOString();
    if (idx >= 0) {
      items[idx].vencedor   = vencedor;
      items[idx].updated_at = now;
    } else {
      items.push({ id: nextId('palpites'), usuario_id, jogo_id, vencedor, updated_at: now });
    }
    write('palpites', items);
  }
};

// ── Resultados ────────────────────────────────────────────────────
const resultados = {
  findAll() {
    return read('resultados');
  },
  upsert(jogo_id, gols_mandante, gols_visitante) {
    const items = read('resultados');
    const idx   = items.findIndex(r => r.jogo_id === jogo_id);
    const now   = new Date().toISOString();
    if (idx >= 0) {
      items[idx].gols_mandante  = gols_mandante;
      items[idx].gols_visitante = gols_visitante;
      items[idx].updated_at     = now;
    } else {
      items.push({ id: nextId('resultados'), jogo_id, gols_mandante, gols_visitante, updated_at: now });
    }
    write('resultados', items);
  }
};

// ── Acessos ───────────────────────────────────────────────────────
const acessos = {
  findByUsuario(usuario_id) {
    return read('acessos').filter(a => a.usuario_id === usuario_id);
  },
  upsert(usuario_id, data, rotacao) {
    const items = read('acessos');
    const idx   = items.findIndex(a => a.usuario_id === usuario_id && a.data === data);
    if (idx >= 0) {
      items[idx].rotacao = rotacao;
    } else {
      items.push({ id: nextId('acessos'), usuario_id, data, rotacao });
    }
    write('acessos', items);
  }
};

// ── Admin padrão na primeira execução ────────────────────────────
if (!usuarios.hasAdmin()) {
  const hash = bcrypt.hashSync('admin2026', 10);
  usuarios.create({ nome: 'Admin', email: 'admin@bolaotech.com', senha_hash: hash, is_admin: 1 });
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Admin criado automaticamente:');
  console.log('  E-mail: admin@bolaotech.com');
  console.log('  Senha:  admin2026');
  console.log('  ⚠ Altere a senha depois do primeiro acesso!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

module.exports = { usuarios, palpites, resultados, acessos };
