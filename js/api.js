// ── Autenticação local ────────────────────────────────────────────
function getToken()    { return localStorage.getItem('bolao_token'); }
function setToken(t)   { localStorage.setItem('bolao_token', t); }
function getUsuario()  {
  try { return JSON.parse(localStorage.getItem('bolao_usuario')); } catch { return null; }
}
function setUsuario(u) { localStorage.setItem('bolao_usuario', JSON.stringify(u)); }

function logout() {
  localStorage.removeItem('bolao_token');
  localStorage.removeItem('bolao_usuario');
  window.location.href = '/login.html';
}

// ── Helpers de fetch ──────────────────────────────────────────────
function _headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + (getToken() || '')
  };
}

async function apiGet(path) {
  try {
    const r = await fetch('/api' + path, { headers: _headers() });
    if (r.status === 401) { logout(); return null; }
    return r.json();
  } catch { return null; }
}

async function apiPost(path, data) {
  try {
    const r = await fetch('/api' + path, {
      method: 'POST',
      headers: _headers(),
      body: JSON.stringify(data)
    });
    if (r.status === 401) { logout(); return null; }
    return r.json();
  } catch { return null; }
}

// Redireciona para login.html se não autenticado
function verificarAuth() {
  if (!getToken()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Injeta nome do usuário + botão Sair na navbar
function renderNavUsuario() {
  const usuario = getUsuario();
  if (!usuario) return;
  const nav = document.querySelector('nav');
  if (!nav) return;

  // Evita duplicar
  if (document.getElementById('nav-usuario')) return;

  const div = document.createElement('div');
  div.id = 'nav-usuario';
  div.className = 'nav-usuario';
  div.innerHTML = `
    <span class="nav-usuario-nome">👤 ${usuario.nome}</span>
    <button class="btn-logout" onclick="logout()">Sair</button>
  `;
  nav.appendChild(div);
}
