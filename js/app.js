// ── Storage helpers ──────────────────────────────────────────────
function getUser() {
  return localStorage.getItem("bolao_user") || null;
}
function setUser(nome) {
  localStorage.setItem("bolao_user", nome);
}
function getPalpites() {
  return JSON.parse(localStorage.getItem("bolao_palpites") || "{}");
}
function savePalpite(jogoId, mandanteGols, visitanteGols) {
  const p = getPalpites();
  p[jogoId] = { mandante: parseInt(mandanteGols), visitante: parseInt(visitanteGols) };
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

// ── Scoring ───────────────────────────────────────────────────────
function calcularPontos(palpite, resultado) {
  if (!palpite || !resultado) return 0;
  if (palpite.mandante === resultado.mandante && palpite.visitante === resultado.visitante)
    return COPA_DATA.regras.acertoExato;
  const signoP = Math.sign(palpite.mandante - palpite.visitante);
  const signoR = Math.sign(resultado.mandante - resultado.visitante);
  if (signoP === signoR) return COPA_DATA.regras.acertoVencedor;
  return 0;
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
        <span>${j.mandante}</span>
        <span class="vs">×</span>
        <span>${j.visitante}</span>
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

  const palpites = getPalpites();
  const resultados = getResultados();

  container.innerHTML = COPA_DATA.jogos.map(j => {
    const p = palpites[j.id] || {};
    const r = resultados[j.id];
    const pts = calcularPontos(p, r);
    const temPalpite = p.mandante !== undefined;
    const temResultado = !!r;

    let badge = "";
    if (temResultado && temPalpite) {
      badge = pts === 3
        ? `<span class="badge acerto-exato">+3 pts</span>`
        : pts === 1
        ? `<span class="badge acerto-vencedor">+1 pt</span>`
        : `<span class="badge errou">0 pts</span>`;
    }

    return `
      <div class="palpite-card ${temResultado ? "encerrado" : ""}">
        <div class="palpite-header">
          <span class="grupo-tag">Grupo ${j.grupo}</span>
          <span class="data-tag">${formatarData(j.data)}</span>
          ${badge}
        </div>
        <div class="palpite-jogo">
          <span class="time">${j.mandante}</span>
          <div class="placar-inputs">
            <input type="number" min="0" max="20"
              id="m-${j.id}" value="${temPalpite ? p.mandante : ""}"
              ${temResultado ? "disabled" : ""}
              placeholder="0" class="gols-input">
            <span class="x">×</span>
            <input type="number" min="0" max="20"
              id="v-${j.id}" value="${temPalpite ? p.visitante : ""}"
              ${temResultado ? "disabled" : ""}
              placeholder="0" class="gols-input">
          </div>
          <span class="time">${j.visitante}</span>
        </div>
        ${temResultado
          ? `<div class="resultado-real">Resultado: ${r.mandante} × ${r.visitante}</div>`
          : `<button onclick="salvarPalpite(${j.id})" class="btn-salvar">Salvar</button>`}
      </div>
    `;
  }).join("");
}

function salvarPalpite(jogoId) {
  const m = document.getElementById(`m-${jogoId}`).value;
  const v = document.getElementById(`v-${jogoId}`).value;
  if (m === "" || v === "") return mostrarToast("Preencha os dois placares!");
  savePalpite(jogoId, m, v);
  mostrarToast("Palpite salvo!");
  renderPalpites();
}

function definirNome() {
  const input = document.getElementById("input-nome");
  const nome = input.value.trim();
  if (!nome) return mostrarToast("Digite seu nome!");
  setUser(nome);
  document.getElementById("nome-section").style.display = "none";
  document.getElementById("palpites-container").style.display = "grid";
  renderPalpites();
}

// ── Page: placar ──────────────────────────────────────────────────
function renderPlacar() {
  const container = document.getElementById("placar-container");
  if (!container) return;

  // Demo: pontuação do usuário atual
  const user = getUser();
  if (!user) {
    container.innerHTML = `<p class="aviso">Cadastre seu nome em <a href="palpites.html">Palpites</a> para aparecer aqui.</p>`;
    return;
  }

  const palpites = getPalpites();
  const resultados = getResultados();
  let total = 0;
  let detalhes = [];

  COPA_DATA.jogos.forEach(j => {
    const p = palpites[j.id];
    const r = resultados[j.id];
    const pts = calcularPontos(p, r);
    if (r) {
      total += pts;
      detalhes.push({ jogo: j, palpite: p, resultado: r, pts });
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
          <tr class="${d.pts === 3 ? "acerto-exato" : d.pts === 1 ? "acerto-vencedor" : "errou"}">
            <td>${d.jogo.mandante} × ${d.jogo.visitante}</td>
            <td>${d.palpite ? `${d.palpite.mandante} × ${d.palpite.visitante}` : "-"}</td>
            <td>${d.resultado.mandante} × ${d.resultado.visitante}</td>
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
  container.innerHTML = COPA_DATA.jogos.map(j => {
    const r = resultados[j.id] || {};
    return `
      <div class="admin-jogo">
        <span>${j.mandante} × ${j.visitante}</span>
        <input type="number" min="0" max="20" id="am-${j.id}" value="${r.mandante ?? ""}" placeholder="0" class="gols-input">
        <span>×</span>
        <input type="number" min="0" max="20" id="av-${j.id}" value="${r.visitante ?? ""}" placeholder="0" class="gols-input">
        <button onclick="salvarResultado(${j.id})" class="btn-salvar btn-admin">✓</button>
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
  renderGrupos();
  renderProximosJogos();
  renderPalpites();
  renderPlacar();
  renderAdmin();
});
