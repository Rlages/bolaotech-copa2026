const COPA_DATA = {
  grupos: [
    {
      id: "A", paises: [
        { nome: "México",              bandeira: "🇲🇽" },
        { nome: "África do Sul",       bandeira: "🇿🇦" },
        { nome: "Coreia do Sul",       bandeira: "🇰🇷" },
        { nome: "República Tcheca",    bandeira: "🇨🇿" },
      ]
    },
    {
      id: "B", paises: [
        { nome: "Canadá",              bandeira: "🇨🇦" },
        { nome: "Bósnia e Herz.",      bandeira: "🇧🇦" },
        { nome: "Catar",               bandeira: "🇶🇦" },
        { nome: "Suíça",               bandeira: "🇨🇭" },
      ]
    },
    {
      id: "C", paises: [
        { nome: "Brasil",              bandeira: "🇧🇷" },
        { nome: "Marrocos",            bandeira: "🇲🇦" },
        { nome: "Haiti",               bandeira: "🇭🇹" },
        { nome: "Escócia",             bandeira: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
      ]
    },
    {
      id: "D", paises: [
        { nome: "EUA",                 bandeira: "🇺🇸" },
        { nome: "Paraguai",            bandeira: "🇵🇾" },
        { nome: "Austrália",           bandeira: "🇦🇺" },
        { nome: "Turquia",             bandeira: "🇹🇷" },
      ]
    },
    {
      id: "E", paises: [
        { nome: "Alemanha",            bandeira: "🇩🇪" },
        { nome: "Curaçao",             bandeira: "🇨🇼" },
        { nome: "Costa do Marfim",     bandeira: "🇨🇮" },
        { nome: "Equador",             bandeira: "🇪🇨" },
      ]
    },
    {
      id: "F", paises: [
        { nome: "Holanda",             bandeira: "🇳🇱" },
        { nome: "Japão",               bandeira: "🇯🇵" },
        { nome: "Suécia",              bandeira: "🇸🇪" },
        { nome: "Tunísia",             bandeira: "🇹🇳" },
      ]
    },
    {
      id: "G", paises: [
        { nome: "Bélgica",             bandeira: "🇧🇪" },
        { nome: "Egito",               bandeira: "🇪🇬" },
        { nome: "Irã",                 bandeira: "🇮🇷" },
        { nome: "Nova Zelândia",       bandeira: "🇳🇿" },
      ]
    },
    {
      id: "H", paises: [
        { nome: "Espanha",             bandeira: "🇪🇸" },
        { nome: "Cabo Verde",          bandeira: "🇨🇻" },
        { nome: "Arábia Saudita",      bandeira: "🇸🇦" },
        { nome: "Uruguai",             bandeira: "🇺🇾" },
      ]
    },
    {
      id: "I", paises: [
        { nome: "França",              bandeira: "🇫🇷" },
        { nome: "Senegal",             bandeira: "🇸🇳" },
        { nome: "Iraque",              bandeira: "🇮🇶" },
        { nome: "Noruega",             bandeira: "🇳🇴" },
      ]
    },
    {
      id: "J", paises: [
        { nome: "Argentina",           bandeira: "🇦🇷" },
        { nome: "Argélia",             bandeira: "🇩🇿" },
        { nome: "Áustria",             bandeira: "🇦🇹" },
        { nome: "Jordânia",            bandeira: "🇯🇴" },
      ]
    },
    {
      id: "K", paises: [
        { nome: "Portugal",            bandeira: "🇵🇹" },
        { nome: "RD Congo",            bandeira: "🇨🇩" },
        { nome: "Uzbequistão",         bandeira: "🇺🇿" },
        { nome: "Colômbia",            bandeira: "🇨🇴" },
      ]
    },
    {
      id: "L", paises: [
        { nome: "Inglaterra",          bandeira: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
        { nome: "Croácia",             bandeira: "🇭🇷" },
        { nome: "Gana",                bandeira: "🇬🇭" },
        { nome: "Panamá",              bandeira: "🇵🇦" },
      ]
    },
  ],

  // Fase de grupos – jogos a partir de 15/06/2026
  jogos: [
    // ── RODADA 1 ─────────────────────────────────────────────────────

    // Grupo E – 15/06
    { id:  9, grupo: "E", mandante: "Alemanha",         visitante: "Curaçao",          data: "2026-06-15" },
    { id: 10, grupo: "E", mandante: "Costa do Marfim", visitante: "Equador",           data: "2026-06-15" },

    // Grupo F – 16/06
    { id: 11, grupo: "F", mandante: "Holanda",          visitante: "Japão",            data: "2026-06-16" },
    { id: 12, grupo: "F", mandante: "Suécia",           visitante: "Tunísia",          data: "2026-06-16" },

    // Grupo G – 17/06
    { id: 13, grupo: "G", mandante: "Bélgica",          visitante: "Egito",            data: "2026-06-17" },
    { id: 14, grupo: "G", mandante: "Irã",              visitante: "Nova Zelândia",    data: "2026-06-17" },

    // Grupo H – 18/06
    { id: 15, grupo: "H", mandante: "Espanha",          visitante: "Cabo Verde",       data: "2026-06-18" },
    { id: 16, grupo: "H", mandante: "Arábia Saudita",   visitante: "Uruguai",          data: "2026-06-18" },

    // Grupo I – 19/06
    { id: 17, grupo: "I", mandante: "França",           visitante: "Senegal",          data: "2026-06-19" },
    { id: 18, grupo: "I", mandante: "Iraque",           visitante: "Noruega",          data: "2026-06-19" },

    // Grupo J – 20/06
    { id: 19, grupo: "J", mandante: "Argentina",        visitante: "Argélia",          data: "2026-06-20" },
    { id: 20, grupo: "J", mandante: "Áustria",          visitante: "Jordânia",         data: "2026-06-20" },

    // Grupo K – 21/06
    { id: 21, grupo: "K", mandante: "Portugal",         visitante: "RD Congo",         data: "2026-06-21" },
    { id: 22, grupo: "K", mandante: "Uzbequistão",      visitante: "Colômbia",         data: "2026-06-21" },

    // Grupo L – 22/06
    { id: 23, grupo: "L", mandante: "Inglaterra",       visitante: "Croácia",          data: "2026-06-22" },
    { id: 24, grupo: "L", mandante: "Gana",             visitante: "Panamá",           data: "2026-06-22" },

    // ── RODADA 2 ─────────────────────────────────────────────────────

    // Grupo A – 17/06
    { id: 25, grupo: "A", mandante: "República Tcheca", visitante: "África do Sul",   data: "2026-06-17" },
    { id: 26, grupo: "A", mandante: "México",           visitante: "Coreia do Sul",   data: "2026-06-17" },

    // Grupo B – 17/06
    { id: 27, grupo: "B", mandante: "Suíça",            visitante: "Bósnia e Herz.",  data: "2026-06-17" },
    { id: 28, grupo: "B", mandante: "Canadá",           visitante: "Catar",            data: "2026-06-17" },

    // Grupo C – 18/06
    { id: 29, grupo: "C", mandante: "Escócia",          visitante: "Marrocos",         data: "2026-06-18" },
    { id: 30, grupo: "C", mandante: "Brasil",           visitante: "Haiti",            data: "2026-06-18" },

    // Grupo D – 18/06
    { id: 31, grupo: "D", mandante: "Turquia",          visitante: "Paraguai",         data: "2026-06-18" },
    { id: 32, grupo: "D", mandante: "EUA",              visitante: "Austrália",        data: "2026-06-18" },

    // Grupo E – 19/06
    { id: 33, grupo: "E", mandante: "Equador",          visitante: "Curaçao",          data: "2026-06-19" },
    { id: 34, grupo: "E", mandante: "Alemanha",         visitante: "Costa do Marfim", data: "2026-06-19" },

    // Grupo F – 19/06
    { id: 35, grupo: "F", mandante: "Tunísia",          visitante: "Japão",            data: "2026-06-19" },
    { id: 36, grupo: "F", mandante: "Holanda",          visitante: "Suécia",           data: "2026-06-19" },

    // Grupo G – 20/06
    { id: 37, grupo: "G", mandante: "Nova Zelândia",    visitante: "Egito",            data: "2026-06-20" },
    { id: 38, grupo: "G", mandante: "Bélgica",          visitante: "Irã",              data: "2026-06-20" },

    // Grupo H – 20/06
    { id: 39, grupo: "H", mandante: "Uruguai",          visitante: "Cabo Verde",       data: "2026-06-20" },
    { id: 40, grupo: "H", mandante: "Espanha",          visitante: "Arábia Saudita",   data: "2026-06-20" },

    // Grupo I – 21/06
    { id: 41, grupo: "I", mandante: "Noruega",          visitante: "Senegal",          data: "2026-06-21" },
    { id: 42, grupo: "I", mandante: "França",           visitante: "Iraque",           data: "2026-06-21" },

    // Grupo J – 21/06
    { id: 43, grupo: "J", mandante: "Jordânia",         visitante: "Argélia",          data: "2026-06-21" },
    { id: 44, grupo: "J", mandante: "Argentina",        visitante: "Áustria",          data: "2026-06-21" },

    // Grupo K – 22/06
    { id: 45, grupo: "K", mandante: "Colômbia",         visitante: "RD Congo",         data: "2026-06-22" },
    { id: 46, grupo: "K", mandante: "Portugal",         visitante: "Uzbequistão",      data: "2026-06-22" },

    // Grupo L – 22/06
    { id: 47, grupo: "L", mandante: "Panamá",           visitante: "Croácia",          data: "2026-06-22" },
    { id: 48, grupo: "L", mandante: "Inglaterra",       visitante: "Gana",             data: "2026-06-22" },

    // ── RODADA 3 (simultâneos por grupo) ─────────────────────────────

    // Grupo A – 23/06
    { id: 49, grupo: "A", mandante: "República Tcheca", visitante: "México",          data: "2026-06-23" },
    { id: 50, grupo: "A", mandante: "África do Sul",    visitante: "Coreia do Sul",   data: "2026-06-23" },

    // Grupo B – 23/06
    { id: 51, grupo: "B", mandante: "Suíça",            visitante: "Canadá",           data: "2026-06-23" },
    { id: 52, grupo: "B", mandante: "Bósnia e Herz.",   visitante: "Catar",            data: "2026-06-23" },

    // Grupo C – 24/06
    { id: 53, grupo: "C", mandante: "Escócia",          visitante: "Brasil",           data: "2026-06-24" },
    { id: 54, grupo: "C", mandante: "Marrocos",         visitante: "Haiti",            data: "2026-06-24" },

    // Grupo D – 24/06
    { id: 55, grupo: "D", mandante: "Turquia",          visitante: "EUA",              data: "2026-06-24" },
    { id: 56, grupo: "D", mandante: "Paraguai",         visitante: "Austrália",        data: "2026-06-24" },

    // Grupo E – 25/06
    { id: 57, grupo: "E", mandante: "Equador",          visitante: "Alemanha",         data: "2026-06-25" },
    { id: 58, grupo: "E", mandante: "Curaçao",          visitante: "Costa do Marfim", data: "2026-06-25" },

    // Grupo F – 25/06
    { id: 59, grupo: "F", mandante: "Tunísia",          visitante: "Holanda",          data: "2026-06-25" },
    { id: 60, grupo: "F", mandante: "Japão",            visitante: "Suécia",           data: "2026-06-25" },

    // Grupo G – 26/06
    { id: 61, grupo: "G", mandante: "Nova Zelândia",    visitante: "Bélgica",          data: "2026-06-26" },
    { id: 62, grupo: "G", mandante: "Egito",            visitante: "Irã",              data: "2026-06-26" },

    // Grupo H – 26/06
    { id: 63, grupo: "H", mandante: "Uruguai",          visitante: "Espanha",          data: "2026-06-26" },
    { id: 64, grupo: "H", mandante: "Cabo Verde",       visitante: "Arábia Saudita",   data: "2026-06-26" },

    // Grupo I – 27/06
    { id: 65, grupo: "I", mandante: "Noruega",          visitante: "França",           data: "2026-06-27" },
    { id: 66, grupo: "I", mandante: "Senegal",          visitante: "Iraque",           data: "2026-06-27" },

    // Grupo J – 27/06
    { id: 67, grupo: "J", mandante: "Jordânia",         visitante: "Argentina",        data: "2026-06-27" },
    { id: 68, grupo: "J", mandante: "Argélia",          visitante: "Áustria",          data: "2026-06-27" },

    // Grupo K – 27/06
    { id: 69, grupo: "K", mandante: "Colômbia",         visitante: "Portugal",         data: "2026-06-27" },
    { id: 70, grupo: "K", mandante: "RD Congo",         visitante: "Uzbequistão",      data: "2026-06-27" },

    // Grupo L – 27/06
    { id: 71, grupo: "L", mandante: "Panamá",           visitante: "Inglaterra",       data: "2026-06-27" },
    { id: 72, grupo: "L", mandante: "Croácia",          visitante: "Gana",             data: "2026-06-27" },
  ],

  regras: {
    acertoExato: 3,
    acertoVencedor: 1,
  },

  // Incremente o número de um dia para invalidar o código antigo daquele dia
  codigoRotacoes: {
    "2026-06-15": 0,
    "2026-06-16": 0,
    "2026-06-17": 0,
    "2026-06-18": 0,
    "2026-06-19": 0,
    "2026-06-20": 0,
    "2026-06-21": 0,
    "2026-06-22": 0,
    "2026-06-23": 0,
    "2026-06-24": 0,
    "2026-06-25": 0,
    "2026-06-26": 0,
    "2026-06-27": 0,
  }
};
