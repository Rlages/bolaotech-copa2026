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
  const w = size || 40;
  return `<img src="https://flagcdn.com/w${w}/${code}.png" alt="${nome}" class="escudo" loading="lazy">`;
}

// ── Storage helpers ──────────────────────────────────────────────
function getUser()  { return localStorage.getItem("bolao_user") || null; }
function setUser(n) { localStorage.setItem("bolao_user", n); }

function getPalpites() {
  return JSON.parse(localStorage.getItem("bolao_palpites") || "{}");
}
function savePalpite(jogoId, vencedor) {
  const p = getPalpites();
  p[jogoId] = { vencedor };
  localStorage.setItem("bolao_palpites", JSON.stringify(p));
  const user = getUser();
  if (user) {
    const all = getTodosPalpites();
    if (!all[user]) all[user] = {};
    all[user][jogoId] = { vencedor };
    localStorage.setItem("bolao_todos_palpites", JSON.stringify(all));
  }
}

function getTodosPalpites() {
  return JSON.parse(localStorage.getItem("bolao_todos_palpites") || "{}");
}
function sincronizarUsuarioAtual() {
  const user = getUser();
  if (!user) return;
  const palpites = getPalpites();
  if (Object.keys(palpites).length === 0) return;
  const all = getTodosPalpites();
  all[user] = { ...(all[user] || {}), ...palpites };
  localStorage.setItem("bolao_todos_palpites", JSON.stringify(all));
}

function getResultados() {
  return JSON.parse(localStorage.getItem("bolao_resultados") || "{}");
}
function saveResultado(jogoId, mandanteGols, visitanteGols) {
  const r = getResultados();
  r[jogoId] = { mandante: parseInt(mandanteGols), visitante: parseInt(visitanteGols) };
  localStorage.setItem("bolao_resultados", JSON.stringify(r));
}

// ── Códigos de acesso diário ──────────────────────────────────────
const BOLAO_CODE_SECRET = "bolaotech2026";

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function rotacaoDia(data) {
  return (COPA_DATA.codigoRotacoes && COPA_DATA.codigoRotacoes[data]) || 0;
}

async function gerarCodigoDia(data) {
  const hash = await sha256(data + BOLAO_CODE_SECRET + rotacaoDia(data));
  return hash.slice(0, 6).toUpperCase();
}

function getAcessosDia() {
  return JSON.parse(localStorage.getItem("bolao_acessos") || "{}");
}
function setAcessoDia(data) {
  const acc = getAcessosDia();
  acc[data] = rotacaoDia(data);
  localStorage.setItem("bolao_acessos", JSON.stringify(acc));
}
function temAcessoDia(data) {
  return getAcessosDia()[data] === rotacaoDia(data);
}

async function desbloquearDia(data) {
  const inputEl  = document.getElementById(`codigo-${data}`);
  const erroEl   = document.getElementById(`codigo-erro-${data}`);
  const input    = inputEl.value.trim().toUpperCase();
  const expected = await gerarCodigoDia(data);
  if (input === expected) {
    setAcessoDia(data);
    renderPalpites();
  } else {
    erroEl.style.display = "block";
    inputEl.value = "";
    inputEl.focus();
  }
}

// ── Seleção temporária antes de salvar ────────────────────────────
const _selecoes = {};

function escolherVencedor(jogoId, opcao) {
  _selecoes[jogoId] = opcao;
  document.querySelectorAll(`.btn-time[data-jogo="${jogoId}"]`).forEach(btn => {
    btn.classList.toggle("ativo", btn.dataset.opcao === opcao);
  });
}

// ── Scoring ───────────────────────────────────────────────────────
function vencedorDoResultado(r) {
  if (!r) return null;
  if (r.mandante > r.visitante) return "A";
  if (r.visitante > r.mandante) return "B";
  return "E"; // empate
}

function calcularPontos(palpite, resultado) {
  if (!palpite || !resultado) return 0;
  const real = vencedorDoResultado(resultado);
  if (!real) return 0;
  return palpite.vencedor === real ? COPA_DATA.regras.acertoVencedor : 0;
}

// ── Page: index – Copa dinâmica ──────────────────────────────────
function renderCopaDinamico() {
  const container = document.getElementById("copa-dinamico");
  if (!container) return;

  const hoje = new Date().toISOString().slice(0, 10);
  const resultados = getResultados();
  const jogosHoje = COPA_DATA.jogos.filter(j => j.data === hoje);
  const proximoJogo = COPA_DATA.jogos.find(j => j.data > hoje);
  const jogosFuturos = COPA_DATA.jogos.filter(j => j.data > hoje);

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
            const r = resultados[j.id];
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

  const totalJogos = COPA_DATA.jogos.length;
  const jogosComResultado = Object.keys(resultados).length;
  const progresso = Math.round((jogosComResultado / totalJogos) * 100);

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

// ── Page: index ───────────────────────────────────────────────────
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

function renderProximosJogos() {
  const container = document.getElementById("proximos-jogos");
  if (!container) return;
  const resultados = getResultados();
  const semResultado = COPA_DATA.jogos.filter(j => !resultados[j.id]).slice(0, 6);
  container.innerHTML = semResultado.map(j => `
    <div class="jogo-card">
      <span class="jogo-grupo">Grupo ${j.grupo}</span>
      <div class="jogo-times">
        <span class="time-mini">${escudo(j.mandante, 32)} ${j.mandante}</span>
        <span class="vs">×</span>
        <span class="time-mini">${escudo(j.visitante, 32)} ${j.visitante}</span>
      </div>
      <div class="jogo-data">${formatarData(j.data)}</div>
    </div>
  `).join("") || "<p class='sem-jogos'>Todos os jogos já têm resultado!</p>";
}

// ── Page: palpites ────────────────────────────────────────────────
function renderPalpites() {
  const container = document.getElementById("palpites-container");
  if (!container) return;

  const user = getUser();
  if (!user) {
    const nomeSection = document.getElementById("nome-section");
    if (nomeSection) nomeSection.style.display = "block";
    container.style.display = "none";
    return;
  }

  document.getElementById("user-nome").textContent = user;

  const palpites   = getPalpites();
  const resultados = getResultados();

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

  const datas = Object.keys(porData).sort();

  container.innerHTML = datas.map(data => {
    const jogos  = porData[data];
    const acesso = temAcessoDia(data);

    let secaoConteudo;
    if (acesso) {
      const cards = jogos.map(j => {
        const p = palpites[j.id] || {};
        const r = resultados[j.id];
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

function salvarPalpite(jogoId) {
  const v = _selecoes[jogoId];
  if (!v) return mostrarToast("Escolha um vencedor!");
  savePalpite(jogoId, v);
  mostrarToast("Palpite salvo!");
  renderPalpites();
}

function definirNome() {
  const input = document.getElementById("input-nome");
  const nome = input.value.trim();
  if (!nome) return mostrarToast("Digite seu nome!");
  setUser(nome);
  sincronizarUsuarioAtual();
  document.getElementById("nome-section").style.display = "none";
  document.getElementById("palpites-container").style.display = "flex";
  renderPalpites();
}

// ── Page: placar ──────────────────────────────────────────────────
function renderPlacar() {
  const container = document.getElementById("placar-container");
  if (!container) return;

  const user = getUser();
  if (!user) {
    container.innerHTML = `<p class="aviso">Cadastre seu nome em <a href="palpites.html">Palpites</a> para aparecer aqui.</p>`;
    return;
  }

  const palpites   = getPalpites();
  const resultados = getResultados();
  let total = 0;
  let detalhes = [];

  COPA_DATA.jogos.forEach(j => {
    const p = palpites[j.id];
    const r = resultados[j.id];
    const pts = calcularPontos(p, r);
    if (r) {
      total += pts;
      const vReal = vencedorDoResultado(r);
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

// ── Resultados (admin) ────────────────────────────────────────────
function renderAdmin() {
  const container = document.getElementById("admin-container");
  if (!container) return;
  const resultados = getResultados();

  const porData = {};
  COPA_DATA.jogos.forEach(j => {
    if (!porData[j.data]) porData[j.data] = [];
    porData[j.data].push(j);
  });

  const datas = Object.keys(porData).sort();

  container.innerHTML = datas.map(data => {
    const jogos = porData[data];
    const cards = jogos.map(j => {
      const r = resultados[j.id] || {};
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
        <div class="admin-dia-jogos">
          ${cards}
        </div>
      </div>
    `;
  }).join("");
}

function salvarResultado(jogoId) {
  const m = document.getElementById(`am-${jogoId}`).value;
  const v = document.getElementById(`av-${jogoId}`).value;
  if (m === "" || v === "") return mostrarToast("Preencha os dois placares!");
  saveResultado(jogoId, m, v);
  mostrarToast("Resultado salvo!");
}

// ── Page: ranking diário (index) ─────────────────────────────────
function renderRankingDiario() {
  const container = document.getElementById("ranking-diario");
  if (!container) return;

  const resultados   = getResultados();
  const todosPalpites = getTodosPalpites();
  const usuarios     = Object.keys(todosPalpites);

  if (usuarios.length === 0 || Object.keys(resultados).length === 0) {
    container.innerHTML = `<p class="aviso">O ranking aparecerá assim que houver resultados registrados.</p>`;
    return;
  }

  // Agrupar jogos com resultado por data
  const porData = {};
  COPA_DATA.jogos.forEach(j => {
    if (resultados[j.id]) {
      if (!porData[j.data]) porData[j.data] = [];
      porData[j.data].push(j);
    }
  });

  const datas = Object.keys(porData).sort().reverse();
  if (datas.length === 0) {
    container.innerHTML = `<p class="aviso">O ranking aparecerá quando o primeiro jogo tiver resultado.</p>`;
    return;
  }

  // Pontuação total acumulada
  const totalPorUsuario = {};
  usuarios.forEach(user => {
    totalPorUsuario[user] = 0;
    COPA_DATA.jogos.forEach(j => {
      totalPorUsuario[user] += calcularPontos(todosPalpites[user]?.[j.id], resultados[j.id]);
    });
  });

  const medalhas = ["🥇", "🥈", "🥉"];

  const totalOrdenado = Object.entries(totalPorUsuario)
    .sort((a, b) => b[1] - a[1]);

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
    const jogos = porData[data];
    const scoresDia = usuarios.map(user => {
      let pts = 0;
      jogos.forEach(j => { pts += calcularPontos(todosPalpites[user]?.[j.id], resultados[j.id]); });
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

// ── Admin – Códigos de acesso por dia ────────────────────────────
async function renderCodigosAdmin() {
  const container = document.getElementById("codigos-container");
  if (!container) return;

  const hoje = new Date().toISOString().slice(0, 10);
  const contagemPorData = {};
  COPA_DATA.jogos.forEach(j => {
    if (j.data >= hoje) contagemPorData[j.data] = (contagemPorData[j.data] || 0) + 1;
  });
  const datas = Object.keys(contagemPorData).sort();

  if (datas.length === 0) {
    container.innerHTML = `<p class="aviso">Nenhum jogo futuro com código disponível.</p>`;
    return;
  }

  container.innerHTML = datas.map(data => `
    <div class="codigo-dia-row">
      <span class="codigo-dia-data">${formatarData(data)}</span>
      <span class="codigo-dia-jogos">${contagemPorData[data]} jogo${contagemPorData[data] > 1 ? "s" : ""}</span>
      <span class="codigo-dia-rotacao">v${rotacaoDia(data)}</span>
      <span class="codigo-dia-badge" id="cod-${data}">···</span>
      <button class="btn-copiar" id="btn-copiar-${data}" onclick="copiarCodigo('${data}')">Copiar</button>
    </div>
  `).join("");

  for (const data of datas) {
    const code = await gerarCodigoDia(data);
    const el = document.getElementById(`cod-${data}`);
    if (el) el.textContent = code;
  }
}

async function copiarCodigo(data) {
  const code = await gerarCodigoDia(data);
  const texto = `Bolão Copa 2026 – Código do dia ${formatarData(data)}: *${code}*`;
  await navigator.clipboard.writeText(texto);
  const btn = document.getElementById(`btn-copiar-${data}`);
  if (btn) {
    btn.textContent = "Copiado!";
    btn.classList.add("copiado");
    setTimeout(() => { btn.textContent = "Copiar"; btn.classList.remove("copiado"); }, 2000);
  }
}

// ── Utilities ──────────────────────────────────────────────────────
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

// ── Init ───────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  sincronizarUsuarioAtual();
  renderCopaDinamico();
  renderGrupos();
  renderRankingDiario();
  renderPalpites();
  renderPlacar();
  renderAdmin();
});
