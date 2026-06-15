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
}

function getResultados() {
  return JSON.parse(localStorage.getItem("bolao_resultados") || "{}");
}
function saveResultado(jogoId, mandanteGols, visitanteGols) {
  const r = getResultados();
  r[jogoId] = { mandante: parseInt(mandanteGols), visitante: parseInt(visitanteGols) };
  localStorage.setItem("bolao_resultados", JSON.stringify(r));
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
    const jogos = porData[data];
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

    return `
      <div class="dia-secao">
        <div class="dia-header">
          <span class="dia-data">${formatarData(data)}</span>
          <span class="dia-count">${jogos.length} jogo${jogos.length > 1 ? "s" : ""}</span>
        </div>
        <div class="dia-jogos">
          ${cards}
        </div>
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
  renderCopaDinamico();
  renderGrupos();
  renderPalpites();
  renderPlacar();
  renderAdmin();
});
