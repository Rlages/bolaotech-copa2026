const fs = require("fs");
const path = require("path");
const vm = require("node:vm");
const { JSDOM } = require("jsdom");

const dataCode = fs.readFileSync(path.join(__dirname, "js", "data.js"), "utf8");
const appCode = fs.readFileSync(path.join(__dirname, "js", "app.js"), "utf8");

const pages = [
  { file: "index.html", name: "Início", outputs: ["proximos-jogos", "grupos-container"] },
  { file: "palpites.html", name: "Palpites", outputs: ["palpites-container", "user-info", "nome-section"] },
  { file: "placar.html", name: "Placar", outputs: ["placar-container"] },
  { file: "admin.html", name: "Admin", outputs: ["admin-container"] },
];

function createLocalStorage() {
  const storage = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
    },
    setItem(key, value) {
      storage[key] = String(value);
    },
    removeItem(key) {
      delete storage[key];
    },
    clear() {
      Object.keys(storage).forEach(key => delete storage[key]);
    },
    key(index) {
      return Object.keys(storage)[index] || null;
    },
    get length() {
      return Object.keys(storage).length;
    },
  };
}

function renderPage(page) {
  const html = fs.readFileSync(path.join(__dirname, page.file), "utf8");
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    resources: "usable",
    url: "http://localhost",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.console = console;
  window.localStorage = window.localStorage || createLocalStorage();
  window.sessionStorage = window.sessionStorage || createLocalStorage();

  window.eval(`${dataCode}\n${appCode}`);
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

  console.log(`\n=== Página: ${page.name} (${page.file}) ===`);
  page.outputs.forEach(id => {
    const node = window.document.getElementById(id);
    if (!node) {
      console.log(`# ${id}: não encontrado`);
      return;
    }
    console.log(`\n## ${id}`);
    if (id === "user-info" || id === "nome-section") {
      console.log(`display: ${node.style.display}`);
    }
    console.log(node.innerHTML.trim() || "(vazio)");
  });
}

pages.forEach(renderPage);
console.log("\nNode runner executado com sucesso.");
