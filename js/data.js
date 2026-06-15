const COPA_DATA = {
  grupos: [
    {
      id: "A", paises: [
        { nome: "México",    bandeira: "🇲🇽" },
        { nome: "EUA",       bandeira: "🇺🇸" },
        { nome: "Canadá",    bandeira: "🇨🇦" },
        { nome: "Argentina", bandeira: "🇦🇷" },
      ]
    },
    {
      id: "B", paises: [
        { nome: "Brasil",    bandeira: "🇧🇷" },
        { nome: "França",    bandeira: "🇫🇷" },
        { nome: "Alemanha",  bandeira: "🇩🇪" },
        { nome: "Marrocos",  bandeira: "🇲🇦" },
      ]
    },
    {
      id: "C", paises: [
        { nome: "Espanha",   bandeira: "🇪🇸" },
        { nome: "Portugal",  bandeira: "🇵🇹" },
        { nome: "Japão",     bandeira: "🇯🇵" },
        { nome: "Senegal",   bandeira: "🇸🇳" },
      ]
    },
    {
      id: "D", paises: [
        { nome: "Inglaterra",bandeira: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
        { nome: "Holanda",   bandeira: "🇳🇱" },
        { nome: "Croácia",   bandeira: "🇭🇷" },
        { nome: "Austrália", bandeira: "🇦🇺" },
      ]
    },
    {
      id: "E", paises: [
        { nome: "Itália",    bandeira: "🇮🇹" },
        { nome: "Bélgica",   bandeira: "🇧🇪" },
        { nome: "Colômbia",  bandeira: "🇨🇴" },
        { nome: "Equador",   bandeira: "🇪🇨" },
      ]
    },
    {
      id: "F", paises: [
        { nome: "Uruguai",   bandeira: "🇺🇾" },
        { nome: "Chile",     bandeira: "🇨🇱" },
        { nome: "Suíça",     bandeira: "🇨🇭" },
        { nome: "Nigéria",   bandeira: "🇳🇬" },
      ]
    },
    {
      id: "G", paises: [
        { nome: "Polônia",   bandeira: "🇵🇱" },
        { nome: "Dinamarca", bandeira: "🇩🇰" },
        { nome: "Tunísia",   bandeira: "🇹🇳" },
        { nome: "Venezuela", bandeira: "🇻🇪" },
      ]
    },
    {
      id: "H", paises: [
        { nome: "Coreia Sul",bandeira: "🇰🇷" },
        { nome: "Iran",      bandeira: "🇮🇷" },
        { nome: "Suécia",    bandeira: "🇸🇪" },
        { nome: "Gana",      bandeira: "🇬🇭" },
      ]
    },
    {
      id: "I", paises: [
        { nome: "Turquia",   bandeira: "🇹🇷" },
        { nome: "Escócia",   bandeira: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
        { nome: "Egito",     bandeira: "🇪🇬" },
        { nome: "Peru",      bandeira: "🇵🇪" },
      ]
    },
    {
      id: "J", paises: [
        { nome: "Sérvia",    bandeira: "🇷🇸" },
        { nome: "Rep. Checa",bandeira: "🇨🇿" },
        { nome: "Camarões",  bandeira: "🇨🇲" },
        { nome: "Bolívia",   bandeira: "🇧🇴" },
      ]
    },
    {
      id: "K", paises: [
        { nome: "Áustria",   bandeira: "🇦🇹" },
        { nome: "Escócia",   bandeira: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
        { nome: "China",     bandeira: "🇨🇳" },
        { nome: "Guatemala", bandeira: "🇬🇹" },
      ]
    },
    {
      id: "L", paises: [
        { nome: "Arábia Saudita", bandeira: "🇸🇦" },
        { nome: "Costa Rica",     bandeira: "🇨🇷" },
        { nome: "Grécia",         bandeira: "🇬🇷" },
        { nome: "Uganda",         bandeira: "🇺🇬" },
      ]
    },
  ],

  // Jogos da fase de grupos (amostra)
  jogos: [
    { id: 1,  grupo: "A", mandante: "México",    visitante: "EUA",          data: "2026-06-11" },
    { id: 2,  grupo: "A", mandante: "Canadá",    visitante: "Argentina",    data: "2026-06-11" },
    { id: 3,  grupo: "B", mandante: "Brasil",    visitante: "França",       data: "2026-06-12" },
    { id: 4,  grupo: "B", mandante: "Alemanha",  visitante: "Marrocos",     data: "2026-06-12" },
    { id: 5,  grupo: "C", mandante: "Espanha",   visitante: "Portugal",     data: "2026-06-13" },
    { id: 6,  grupo: "C", mandante: "Japão",     visitante: "Senegal",      data: "2026-06-13" },
    { id: 7,  grupo: "D", mandante: "Inglaterra",visitante: "Holanda",      data: "2026-06-14" },
    { id: 8,  grupo: "D", mandante: "Croácia",   visitante: "Austrália",    data: "2026-06-14" },
    { id: 9,  grupo: "E", mandante: "Itália",    visitante: "Bélgica",      data: "2026-06-15" },
    { id: 10, grupo: "E", mandante: "Colômbia",  visitante: "Equador",      data: "2026-06-15" },
    { id: 11, grupo: "F", mandante: "Uruguai",   visitante: "Chile",        data: "2026-06-16" },
    { id: 12, grupo: "F", mandante: "Suíça",     visitante: "Nigéria",      data: "2026-06-16" },
    { id: 13, grupo: "A", mandante: "México",    visitante: "Canadá",       data: "2026-06-17" },
    { id: 14, grupo: "A", mandante: "EUA",       visitante: "Argentina",    data: "2026-06-17" },
    { id: 15, grupo: "B", mandante: "Brasil",    visitante: "Alemanha",     data: "2026-06-18" },
    { id: 16, grupo: "B", mandante: "França",    visitante: "Marrocos",     data: "2026-06-18" },
  ],

  regras: {
    acertoExato: 3,
    acertoVencedor: 1,
  }
};
