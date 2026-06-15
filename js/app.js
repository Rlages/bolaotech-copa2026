// ── Flag images ───────────────────────────────────────────────────
const FLAG_CODES = {
  "México":            "mx",
  "África do Sul":     "za",
  "Coreia do Sul":     "kr",
  "República Tcheca":  "cz",
  "Canadá":            "ca",
  "Bósnia e Herz.":    "ba",
  "Catar":             "qa",
  "Suíça":             "ch",
  "Brasil":            "br",
  "Marrocos":          "ma",
  "Haiti":             "ht",
  "Escócia":           "gb-sct",
  "EUA":               "us",
  "Paraguai":          "py",
  "Austrália":         "au",
  "Turquia":           "tr",
  "Alemanha":          "de",
  "Curaçao":           "cw",
  "Costa do Marfim":   "ci",
  "Equador":           "ec",
  "Holanda":           "nl",
  "Japão":             "jp",
  "Suécia":            "se",
  "Tunísia":           "tn",
  "Bélgica":           "be",
  "Egito":             "eg",
  "Irã":               "ir",
  "Nova Zelândia":     "nz",
  "Espanha":           "es",
  "Cabo Verde":        "cv",
  "Arábia Saudita":    "sa",
  "Uruguai":           "uy",
  "França":            "fr",
  "Senegal":           "sn",
  "Iraque":            "iq",
  "Noruega":           "no",
  "Argentina":         "ar",
  "Argélia":           "dz",
  "Áustria":           "at",
  "Jordânia":          "jo",
  "Portugal":          "pt",
  "RD Congo":          "cd",
  "Uzbequistão":       "uz",
  "Colômbia":          "co",
  "Inglaterra":        "gb-eng",
  "Croácia":           "hr",
  "Gana":              "gh",
  "Panamá":            "pa",
};

function escudo(nome, size) {
  const code = FLAG_CODES[nome];
  if (!code) return "";
  return `<img src="https://flagcdn.com/w${size || 40}/${code}.png" alt="${nome}" class="escudo" loading="lazy">`;
}

// ── Estado global (carregado da API) ─────────────────────────────
let _palpites      = {};
let _todosPalpites = {};
let _resultados    = {};
let _acessos       = {};

function getUser()         { return getUsuario()?.nome || null; }
function getPalpites()     { return _palpites; }
function getResultados()   { return _resultados; }
function getTodosPalpites(){ return _todosPalpites; }

function rotacaoDia(data) {
  return (COPA_DATA.codigoRotacoes && COPA_DATA.codigoRotacoes[data]) || 0;
}
function temAcessoDia(data) {
  return _acessos[data] === rotacaoDia(data);
}

// ── Seleção temporária antes de salvar ───────────────────────────
const _selecoes = {};

function escolherVencedor(jogoId, opcao) {
  _selecoes[jogoId] = opcao;
  document.querySelectorAll(`.btn-time[data-jogo="${jogoId}"]`).forEach(btn => {
    btn.classList.toggle("ativo", btn.dataset.opcao === opcao);
  });
}

// ── Scoring ──────────────────────────────────────────────────────
function vencedorDoResultado(r) {
  if (!r) return null;
  if (r.mandante > r.visitante) return "A";
  if (r.visitante > r.mandante) return "B";
  return "E";
}

function calcularPontos(palpite, resultado) {
  if (!palpite || !resultado) return 0;
  const real = vencedorDoResultado(resultado);
  if (!real) return 0;
  return palpite.vencedor === real ? COPA_DATA.regras.acertoVencedor : 0;
}

// ── Carrega todos os dados da API ─────────────────────────────────
async function carregarDados() {
  const [p, todos, r, acc] = await Promise.all([
    apiGet('/palpites'),
    apiGet('/palpites/todos'),
    apiGet('/resultados'),
    apiGet('/acessos'),
  ]);
  _palpites      = p    || {};
  _todosPalpites = todos || {};
  _resultados    = r    || {};
  _acessos       = acc  || {};
}

// ── Page: index – Copa dinâmica ──────────────────────────────────
function renderCopaDinamico() {
  const container = document.getElementById("copa-dinamico");
  if (!container) return;

  const hoje = new Date().toISOString().slice(0, 10);
  const jogosHoje   = COPA_DATA.jogos.filter(j => j.data === hoje);
  const proximoJogo = COPA_DATA.jogos.find(j => j.data > hoje);

  let html = "";

  if (jogosHoje.length > 0) {
    html += `
      <div class="hoje-box">
        <div class="hoje-header">
          <span class="ao-vivo-badge">🔴 AO VIVO</span>
          Jogos de Hoje — ${formatarData(hoje)}
        </div>
        <div class="hoje-lista">
          ${jogosHoje.map(j => {
            const r = _resultados[j.id];
            return `
              <div class="hoje-jogo">
                <span class="hoje-time">${escudo(j.mandante, 28)} <span>${j.mandante}</span></span>
                <span class="hoje-placar-box">
                  ${r
                    ? `<strong>${r.mandante}</strong> <span class="hoje-x">×</span> <strong>${r.visitante}</strong>`
                    : `<span class="hoje-x">×</span>`}
                </span>
                <span class="hoje-time hoje-time-b"><span>${j.visitante}</span> ${escudo(j.visitante, 28)}</span>
                <span class="hoje-grupo-tag">Gr. ${j.grupo}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  if (proximoJogo && jogosHoje.length === 0) {
    const diasRestantes = Math.ceil((new Date(proximoJogo.data) - new Date(hoje)) / 86400000);
    html += `
      <div class="proximo-box">
        <div class="proximo-label">⏭ Próximo Jogo${diasRestantes === 1 ? " — Amanhã" : diasRestantes > 1 ? ` — em ${diasRestantes} dias` : ""}</div>
        <div class="proximo-info">
          ${escudo(proximoJogo.mandante, 36)}
          <span class="proximo-time-nome">${proximoJogo.mandante}</span>
          <span class="proximo-vs">×</span>
          <span class="proximo-time-nome">${proximoJogo.visitante}</span>
          ${escudo(proximoJogo.visitante, 36)}
        </div>
        <div class="proximo-data-info">📅 ${formatarData(proximoJogo.data)} · Grupo ${proximoJogo.grupo}</div>
      </div>
    `;
  }

  if (!proximoJogo && jogosHoje.length === 0) {
    html = `<div class="copa-encerrada">🏆 A fase de grupos encerrou! Acompanhe o placar final.</div>`;
  }

  const totalJogos        = COPA_DATA.jogos.length;
  const jogosComResultado = Object.keys(_resultados).length;
  const progresso         = Math.round((jogosComResultado / totalJogos) * 100);

  html += `
    <div class="progresso-box">
      <div class="progresso-info">
        <span>Fase de Grupos</span>
        <span><strong>${jogosComResultado}</strong> de ${totalJogos} jogos encerrados</span>
      </div>
      <div class="progresso-barra">
        <div class="progresso-fill" style="width:${progresso}%"></div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// ── Page: index ──────────────────────────────────────────────────
function renderGrupos() {
  const container = document.getElementById("grupos-container");
  if (!container) return;
  container.innerHTML = COPA_DATA.grupos.map(g => `
    <div class="grupo-card">
      <div class="grupo-header">Grupo ${g.id}</div>
      <ul class="grupo-times">
        ${g.paises.map(p => `<li>${p.bandeira} ${p.nome}</li>`).join("")}
      </ul>
    </div>
  `).join("");
}

// ── Page: palpites ────────────────────────────────────────────────
function renderPalpites() {
  const container = document.getElementById("palpites-container");
  if (!container) return;

  const user = getUser();
  if (user) {
    const el = document.getElementById("user-nome");
    if (el) el.textContent = user;
    const info = document.getElementById("user-info");
    if (info) info.style.display = "flex";
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const jogosPendentes = COPA_DATA.jogos.filter(j => j.data >= hoje);

  if (jogosPendentes.length === 0) {
    container.innerHTML = `<p class="aviso">Todos os jogos da fase de grupos já aconteceram!</p>`;
    return;
  }

  const porData = {};
  jogosPendentes.forEach(j => {
    if (!porData[j.data]) porData[j.data] = [];
    porData[j.data].push(j);
  });

  container.innerHTML = Object.keys(porData).sort().map(data => {
    const jogos  = porData[data];
    const acesso = temAcessoDia(data);

    let secaoConteudo;
    if (acesso) {
      const cards = jogos.map(j => {
        const p = _palpites[j.id] || {};
        const r = _resultados[j.id];
        const pts = calcularPontos(p, r);
        const temPalpite   = !!p.vencedor;
        const temResultado = !!r;

        let badge = "";
        if (temResultado && temPalpite) {
          badge = pts >= 1
            ? `<span class="badge acerto-vencedor">+${pts} pt</span>`
            : `<span class="badge errou">0 pts</span>`;
        }

        const vReal = temResultado ? vencedorDoResultado(r) : null;

        return `
          <div class="palpite-card ${temResultado ? "encerrado" : ""}">
            <div class="palpite-header">
              <span class="grupo-tag">Grupo ${j.grupo}</span>
              ${badge}
            </div>
            <div class="palpite-jogo">
              <button
                class="btn-time ${p.vencedor === 'A' ? 'ativo' : ''}"
                data-jogo="${j.id}" data-opcao="A"
                onclick="escolherVencedor(${j.id}, 'A')"
                ${temResultado ? "disabled" : ""}>
                ${escudo(j.mandante)}
                <span class="btn-time-nome">${j.mandante}</span>
              </button>
              <button
                class="btn-empate ${p.vencedor === 'E' ? 'ativo' : ''}"
                data-jogo="${j.id}" data-opcao="E"
                onclick="escolherVencedor(${j.id}, 'E')"
                ${temResultado ? "disabled" : ""}>
                <span class="btn-empate-icon">=</span>
                <span>Empate</span>
              </button>
              <button
                class="btn-time ${p.vencedor === 'B' ? 'ativo' : ''}"
                data-jogo="${j.id}" data-opcao="B"
                onclick="escolherVencedor(${j.id}, 'B')"
                ${temResultado ? "disabled" : ""}>
                ${escudo(j.visitante)}
                <span class="btn-time-nome">${j.visitante}</span>
              </button>
            </div>
            ${temResultado
              ? `<div class="resultado-real">
                   Resultado: ${r.mandante} × ${r.visitante}
                   · <strong>${vReal === "E" ? "Empate" : vReal === "A" ? j.mandante + " venceu" : j.visitante + " venceu"}</strong>
                 </div>`
              : `<button onclick="salvarPalpite(${j.id})" class="btn-salvar">Salvar palpite</button>`}
          </div>
        `;
      }).join("");
      secaoConteudo = `<div class="dia-jogos">${cards}</div>`;
    } else {
      secaoConteudo = `
        <div class="dia-bloqueado">
          <div class="bloqueio-icone">🔒</div>
          <p class="bloqueio-texto">Pague a entrada e insira o código do dia para palpitar</p>
          <div class="bloqueio-form">
            <input type="text" id="codigo-${data}" class="input-text bloqueio-input"
                   placeholder="Código..." maxlength="6"
                   onkeydown="if(event.key==='Enter') desbloquearDia('${data}')">
            <button class="btn" onclick="desbloquearDia('${data}')">Entrar</button>
          </div>
          <p id="codigo-erro-${data}" class="bloqueio-erro">Código incorreto. Tente novamente.</p>
        </div>
      `;
    }

    return `
      <div class="dia-secao">
        <div class="dia-header">
          <span class="dia-data">${formatarData(data)}</span>
          <span class="dia-count">${jogos.length} jogo${jogos.length > 1 ? "s" : ""}${acesso ? "" : " 🔒"}</span>
        </div>
        ${secaoConteudo}
      </div>
    `;
  }).join("");
}

async function salvarPalpite(jogoId) {
  const v = _selecoes[jogoId];
  if (!v) return mostrarToast("Escolha um vencedor!");

  const result = await apiPost('/palpites', { jogoId, vencedor: v });
  if (!result) return;

  if (result.erro) return mostrarToast(result.erro);

  _palpites[jogoId] = { vencedor: v };
  const nome = getUser();
  if (nome) {
    if (!_todosPalpites[nome]) _todosPalpites[nome] = {};
    _todosPalpites[nome][jogoId] = { vencedor: v };
  }

  mostrarToast("Palpite salvo!");
  renderPalpites();
}

async function desbloquearDia(data) {
  const inputEl = document.getElementById(`codigo-${data}`);
  const erroEl  = document.getElementById(`codigo-erro-${data}`);
  const codigo  = inputEl.value.trim().toUpperCase();

  const result = await apiPost('/acessos', { data, codigo });

  if (!result || result.erro) {
    erroEl.style.display = "block";
    inputEl.value = "";
    inputEl.focus();
    return;
  }

  _acessos[data] = rotacaoDia(data);
  renderPalpites();
}

// ── Page: placar ──────────────────────────────────────────────────
function renderPlacar() {
  const container = document.getElementById("placar-container");
  if (!container) return;

  const user = getUser();
  if (!user) {
    container.innerHTML = `<p class="aviso">Faça login para ver seu placar.</p>`;
    return;
  }

  let total = 0;
  const detalhes = [];

  COPA_DATA.jogos.forEach(j => {
    const p   = _palpites[j.id];
    const r   = _resultados[j.id];
    const pts = calcularPontos(p, r);
    if (r) {
      total += pts;
      const vReal      = vencedorDoResultado(r);
      const nomeVReal  = vReal === "A" ? j.mandante : vReal === "B" ? j.visitante : "Empate";
      const nomePalpite = p?.vencedor === "A" ? j.mandante : p?.vencedor === "B" ? j.visitante : p?.vencedor === "E" ? "Empate" : "-";
      detalhes.push({ jogo: j, nomePalpite, nomeVReal, resultado: r, pts });
    }
  });

  container.innerHTML = `
    <div class="placar-user">
      <span class="placar-nome">${user}</span>
      <span class="placar-total">${total} pontos</span>
    </div>
    <table class="placar-tabela">
      <thead><tr><th>Jogo</th><th>Seu Palpite</th><th>Resultado</th><th>Pts</th></tr></thead>
      <tbody>
        ${detalhes.map(d => `
          <tr class="${d.pts >= 1 ? "acerto-vencedor" : "errou"}">
            <td>${d.jogo.mandante} × ${d.jogo.visitante}</td>
            <td>${d.nomePalpite}</td>
            <td>${d.nomeVReal} (${d.resultado.mandante}–${d.resultado.visitante})</td>
            <td>${d.pts}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// ── Page: ranking ─────────────────────────────────────────────────
function renderRankingDiario() {
  const container = document.getElementById("ranking-diario");
  if (!container) return;

  const usuarios = Object.keys(_todosPalpites);

  if (usuarios.length === 0 || Object.keys(_resultados).length === 0) {
    container.innerHTML = `<p class="aviso">O ranking aparecerá assim que houver resultados registrados.</p>`;
    return;
  }

  const porData = {};
  COPA_DATA.jogos.forEach(j => {
    if (_resultados[j.id]) {
      if (!porData[j.data]) porData[j.data] = [];
      porData[j.data].push(j);
    }
  });

  const datas = Object.keys(porData).sort().reverse();
  if (datas.length === 0) {
    container.innerHTML = `<p class="aviso">O ranking aparecerá quando o primeiro jogo tiver resultado.</p>`;
    return;
  }

  const totalPorUsuario = {};
  usuarios.forEach(user => {
    totalPorUsuario[user] = 0;
    COPA_DATA.jogos.forEach(j => {
      totalPorUsuario[user] += calcularPontos(_todosPalpites[user]?.[j.id], _resultados[j.id]);
    });
  });

  const medalhas     = ["🥇", "🥈", "🥉"];
  const totalOrdenado = Object.entries(totalPorUsuario).sort((a, b) => b[1] - a[1]);

  const totalHTML = `
    <div class="ranking-total">
      <div class="ranking-total-titulo">Classificação Geral</div>
      ${totalOrdenado.map(([user, pts], i) => `
        <div class="ranking-item ${i < 3 ? ["primeiro","segundo","terceiro"][i] : ""}">
          <span class="ranking-pos">${medalhas[i] || `${i + 1}º`}</span>
          <span class="ranking-nome">${user}</span>
          <span class="ranking-pts">${pts} pt${pts !== 1 ? "s" : ""}</span>
        </div>
      `).join("")}
    </div>
  `;

  const diasHTML = datas.map(data => {
    const jogos     = porData[data];
    const scoresDia = usuarios.map(user => {
      let pts = 0;
      jogos.forEach(j => { pts += calcularPontos(_todosPalpites[user]?.[j.id], _resultados[j.id]); });
      return { user, pts };
    }).sort((a, b) => b.pts - a.pts);

    return `
      <div class="ranking-dia">
        <div class="ranking-dia-header">${formatarData(data)}</div>
        <div class="ranking-lista">
          ${scoresDia.map((s, i) => `
            <div class="ranking-item ${i < 3 ? ["primeiro","segundo","terceiro"][i] : ""}">
              <span class="ranking-pos">${medalhas[i] || `${i + 1}º`}</span>
              <span class="ranking-nome">${s.user}</span>
              <span class="ranking-pts">${s.pts} pt${s.pts !== 1 ? "s" : ""}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = totalHTML + `<div class="ranking-dias-grid">${diasHTML}</div>`;
}

// ── Admin: resultados ─────────────────────────────────────────────
function renderAdmin() {
  const container = document.getElementById("admin-container");
  if (!container) return;

  const porData = {};
  COPA_DATA.jogos.forEach(j => {
    if (!porData[j.data]) porData[j.data] = [];
    porData[j.data].push(j);
  });

  container.innerHTML = Object.keys(porData).sort().map(data => {
    const jogos = porData[data];
    const cards = jogos.map(j => {
      const r = _resultados[j.id] || {};
      return `
        <div class="admin-jogo">
          <span>${escudo(j.mandante, 24)} ${j.mandante} × ${j.visitante} ${escudo(j.visitante, 24)}</span>
          <input type="number" min="0" max="20" id="am-${j.id}" value="${r.mandante ?? ""}" placeholder="0" class="gols-input">
          <span>×</span>
          <input type="number" min="0" max="20" id="av-${j.id}" value="${r.visitante ?? ""}" placeholder="0" class="gols-input">
          <button onclick="salvarResultado(${j.id})" class="btn-salvar btn-admin">✓</button>
        </div>
      `;
    }).join("");

    return `
      <div class="dia-secao">
        <div class="dia-header">
          <span class="dia-data">${formatarData(data)}</span>
          <span class="dia-count">${jogos.length} jogo${jogos.length > 1 ? "s" : ""}</span>
        </div>
        <div class="admin-dia-jogos">${cards}</div>
      </div>
    `;
  }).join("");
}

async function salvarResultado(jogoId) {
  const m = document.getElementById(`am-${jogoId}`).value;
  const v = document.getElementById(`av-${jogoId}`).value;
  if (m === "" || v === "") return mostrarToast("Preencha os dois placares!");

  const result = await apiPost('/resultados', {
    jogoId,
    golsMandante: parseInt(m),
    golsVisitante: parseInt(v)
  });

  if (!result) return;
  if (result.erro) return mostrarToast(result.erro);

  _resultados[jogoId] = { mandante: parseInt(m), visitante: parseInt(v) };
  mostrarToast("Resultado salvo!");
}

// ── Admin: códigos de acesso ──────────────────────────────────────
async function renderCodigosAdmin() {
  const container = document.getElementById("codigos-container");
  if (!container) return;

  const codigos = await apiGet('/acessos/codigos');
  if (!codigos) {
    container.innerHTML = `<p class="aviso">Erro ao carregar códigos.</p>`;
    return;
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const contagemPorData = {};
  COPA_DATA.jogos.forEach(j => {
    if (j.data >= hoje) contagemPorData[j.data] = (contagemPorData[j.data] || 0) + 1;
  });

  const datas = Object.keys(contagemPorData).sort();
  if (datas.length === 0) {
    container.innerHTML = `<p class="aviso">Nenhum jogo futuro.</p>`;
    return;
  }

  container.innerHTML = datas.map(data => `
    <div class="codigo-dia-row">
      <span class="codigo-dia-data">${formatarData(data)}</span>
      <span class="codigo-dia-jogos">${contagemPorData[data]} jogo${contagemPorData[data] > 1 ? "s" : ""}</span>
      <span class="codigo-dia-badge">${codigos[data] || "---"}</span>
      <button class="btn-copiar" id="btn-copiar-${data}" onclick="copiarCodigo('${data}', '${codigos[data]}')">Copiar</button>
    </div>
  `).join("");
}

async function copiarCodigo(data, code) {
  const texto = `Bolão Copa 2026 – Código do dia ${formatarData(data)}: *${code}*`;
  await navigator.clipboard.writeText(texto);
  const btn = document.getElementById(`btn-copiar-${data}`);
  if (btn) {
    btn.textContent = "Copiado!";
    btn.classList.add("copiado");
    setTimeout(() => { btn.textContent = "Copiar"; btn.classList.remove("copiado"); }, 2000);
  }
}

// ── Utilities ─────────────────────────────────────────────────────
function formatarData(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function mostrarToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2500);
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  if (!verificarAuth()) return;

  await carregarDados();

  // Páginas não-admin: renderiza normalmente
  renderCopaDinamico();
  renderGrupos();
  renderRankingDiario();
  renderPalpites();
  renderPlacar();

  // Página admin: controla visibilidade e renderiza
  const adminMain = document.getElementById("admin-main");
  const adminGate = document.getElementById("admin-gate");
  if (adminMain) {
    const usuario = getUsuario();
    if (usuario?.is_admin) {
      adminMain.style.display = "block";
      renderNavUsuario(); // nav fica dentro de admin-main
      await renderCodigosAdmin();
      renderAdmin();
    } else {
      if (adminGate) adminGate.style.display = "flex";
    }
    return; // admin-main tem seu próprio nav
  }

  renderNavUsuario();
});
