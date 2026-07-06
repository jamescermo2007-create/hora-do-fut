/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import database mock and simulator
import {
  COMPETITIONS,
  TEAMS,
  PLAYERS,
  NEWS,
  STANDINGS,
  TRANSFERS,
  MATCHES,
  startLiveSimulation
} from "./server/dbMock";

// Import Football-Data.org live integration helpers
import {
  getCompetitions,
  getStandings,
  getTopScorers,
  enrichMatchData,
  getMatches,
  getTeamDetail,
  getPlayerDetail
} from "./server/footballData";

// Helper to check secure Football-Data.org API key presence
function hasFootballApiKey(): boolean {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  return !!(key && key !== "MY_FOOTBALL_DATA_API_KEY" && key.trim() !== "");
}

const app = express();
const PORT = 3000;

// Initialize live match generator
startLiveSimulation();

// Initialize server-side Gemini client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } else {
      console.warn("GEMINI_API_KEY is not defined or is a placeholder. Server-side AI features will run with high-quality simulated fallback answers.");
    }
  }
  return aiClient;
}

/// JSON Parser Middleware
app.use(express.json());

// API ROUTE: Get API configuration status
app.get("/api/config-status", (req, res) => {
  res.json({
    apiKeyConfigured: hasFootballApiKey(),
    geminiKeyConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
  });
});

// API ROUTE: Get all matches (live, scheduled, finished)
app.get("/api/matches", async (req, res) => {
  if (hasFootballApiKey()) {
    try {
      const liveMatches = await getMatches();
      res.json(liveMatches);
      return;
    } catch (err: any) {
      console.error("[API Matches Error] Falling back to mock matches:", err.message);
    }
  }
  res.json(MATCHES);
});

// API ROUTE: Get a specific match
app.get("/api/matches/:id", async (req, res) => {
  if (hasFootballApiKey()) {
    try {
      const allMatches = await getMatches();
      const match = allMatches.find(m => String(m.id) === req.params.id);
      if (match) {
        res.json(match);
        return;
      }
    } catch (err: any) {
      console.error("[API Match Detail Error] Falling back:", err.message);
    }
  }
  const match = MATCHES.find(m => m.id === req.params.id);
  if (!match) {
    res.status(404).json({ error: "Partida não encontrada." });
    return;
  }
  res.json(match);
});

// API ROUTE: Generate tactical AI analysis for a match
app.get("/api/matches/:id/ai-analysis", async (req, res) => {
  let match: any = null;

  if (hasFootballApiKey()) {
    try {
      const allMatches = await getMatches();
      match = allMatches.find(m => String(m.id) === req.params.id);
    } catch (e) {}
  }

  if (!match) {
    match = MATCHES.find(m => m.id === req.params.id);
  }

  if (!match) {
    res.status(404).json({ error: "Partida não encontrada." });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.json({
      analysis: match.aiAnalysis || "Análise indisponível no momento. Por favor configure a chave GEMINI_API_KEY para análises táticas dinâmicas em tempo real.",
      source: "FutIA Simulated Tactician Mode"
    });
    return;
  }

  try {
    const eventsStr = match.events ? match.events.map((e: any) => `Minuto ${e.time}': ${e.detail}`).join(", ") : "";
    const prompt = `Analise taticamente esta partida de futebol de forma curta e profissional (máximo 4 parágrafos) em português. 
    Times: ${match.homeTeam.name} vs ${match.awayTeam.name}. Placar: ${match.homeScore} x ${match.awayScore}. 
    Status: ${match.status}. Minuto de jogo atual: ${match.time}. 
    Eventos ocorridos: ${eventsStr || "Nenhum grande evento de gol ou cartão ainda."}.
    Fatos do time de casa: Técnico ${match.homeTeam.coach || "Desconhecido"}.
    Fatos do time visitante: Técnico ${match.awayTeam.coach || "Desconhecido"}.
    Sua análise deve conter:
    1. Uma leitura tática dos sistemas de jogo e dinâmica atual.
    2. Destaques individuais e impacto dos eventos de gols ou cartões.
    3. Projeção técnica para o restante do jogo ou repercussão do placar final.
    Identifique claramente que o texto é uma "Opinião tática gerada por IA (FutIA Assistant)". Não cite código ou JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um analista tático de futebol sênior que escreve análises inteligentes de alto nível para canais esportivos premium como a ESPN e o Athletic. Use português claro, rico em termos táticos corretos (como bloco médio, bloco baixo, transição defensiva, jogo posicional, amplitude, profundidade).",
        temperature: 0.7,
      }
    });

    res.json({
      analysis: response.text || "Análise gerada vazia.",
      source: "FutIA Live Analyst Core"
    });
  } catch (error: any) {
    console.error("Gemini match analysis error:", error);
    res.json({
      analysis: match.aiAnalysis || "Análise de futebol indisponível temporariamente devido a limite de requisições. Fallback para análise padrão de sistema.",
      source: "FutIA Local Fallback Mode"
    });
  }
});

// API ROUTE: Get all teams
app.get("/api/teams", (req, res) => {
  res.json(TEAMS);
});

// API ROUTE: Get specific team profile
app.get("/api/teams/:id", async (req, res) => {
  if (hasFootballApiKey()) {
    try {
      const teamData = await getTeamDetail(req.params.id);
      let fixtures: any[] = [];
      try {
        const allMatches = await getMatches();
        fixtures = allMatches.filter(m => String(m.homeTeam.id) === String(req.params.id) || String(m.awayTeam.id) === String(req.params.id));
      } catch (me) {}
      res.json({
        ...teamData,
        fixtures
      });
      return;
    } catch (err: any) {
      console.error("[API Team Detail Error] Falling back to mock team:", err.message);
    }
  }

  const team = TEAMS.find(t => t.id === req.params.id);
  if (!team) {
    res.status(404).json({ error: "Time não encontrado." });
    return;
  }
  const roster = PLAYERS.filter(p => p.currentTeamId === team.id);
  const fixtures = MATCHES.filter(m => m.homeTeam.id === team.id || m.awayTeam.id === team.id);
  res.json({
    ...team,
    roster,
    fixtures
  });
});

// API ROUTE: Generate tactical team report via AI
app.get("/api/teams/:id/ai-report", async (req, res) => {
  let teamName = "";
  let coach = "";
  let venue = "";
  let rosterStr = "";

  if (hasFootballApiKey()) {
    try {
      const team = await getTeamDetail(req.params.id);
      teamName = team.name;
      coach = team.coach;
      venue = team.venue || "";
      rosterStr = team.roster ? team.roster.slice(0, 8).map(p => p.name).join(", ") : "";
    } catch (e) {}
  }

  if (!teamName) {
    const mockTeam = TEAMS.find(t => t.id === req.params.id);
    if (mockTeam) {
      teamName = mockTeam.name;
      coach = mockTeam.coach || "";
      venue = mockTeam.venue || "";
    } else {
      teamName = "Clube de Futebol";
    }
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.json({
      report: `Análise tática premium do ${teamName}. Sob o comando de ${coach || "seu treinador"}, a equipe utiliza um esquema tático focado em posse de bola e transição veloz pelos lados do campo, mandando seus jogos no estádio ${venue || "seu estádio municipal"}.`,
      source: "FutIA Static Scout Engine"
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Escreva um breve relatório de olheiro tático de futebol (máximo 2 parágrafos pequenos) em português para o time: ${teamName}.
      Técnico: ${coach || "Desconhecido"}. Estádio: ${venue || "Desconhecido"}. Principais Jogadores: ${rosterStr || "Vários jogadores de alto nível"}.
      Use termos táticos avançados e seja focado no desempenho recente e estilo de jogo provável.`,
      config: {
        systemInstruction: "Você é um olheiro tático de futebol profissional do Real Madrid, mestre em analisar o estilo de jogo e as táticas de outras equipes no futebol mundial. Seja preciso, técnico e profissional."
      }
    });
    res.json({
      report: response.text || "Relatório não pôde ser gerado.",
      source: "FutIA Scout AI"
    });
  } catch (error: any) {
    res.json({
      report: `Relatório tático indisponível no momento para o ${teamName}. A equipe é conhecida por transições rápidas e forte solidez defensiva em seu estádio.`,
      source: "FutIA Scout Fallback Mode"
    });
  }
});

// API ROUTE: Get all players
app.get("/api/players", (req, res) => {
  res.json(PLAYERS);
});

// API ROUTE: Get player detail
app.get("/api/players/:id", async (req, res) => {
  if (hasFootballApiKey()) {
    try {
      const player = await getPlayerDetail(req.params.id);
      res.json(player);
      return;
    } catch (err: any) {
      console.error("[API Player Detail Error] Falling back to mock player:", err.message);
    }
  }

  const player = PLAYERS.find(p => p.id === req.params.id);
  if (!player) {
    res.status(404).json({ error: "Jogador não encontrado." });
    return;
  }
  res.json(player);
});

// API ROUTE: Generate tactical player report via AI
app.get("/api/players/:id/ai-report", async (req, res) => {
  let playerName = "";
  let position = "";
  let nationality = "";
  let teamName = "";

  if (hasFootballApiKey()) {
    try {
      const player = await getPlayerDetail(req.params.id);
      playerName = player.name;
      position = player.position;
      nationality = player.nationality;
      teamName = player.currentTeamName;
    } catch (e) {}
  }

  if (!playerName) {
    const mockPlayer = PLAYERS.find(p => p.id === req.params.id);
    if (mockPlayer) {
      playerName = mockPlayer.name;
      position = mockPlayer.position;
      nationality = mockPlayer.nationality;
      teamName = mockPlayer.currentTeamName;
    } else {
      playerName = "Jogador Profissional";
    }
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.json({
      report: `Análise de olheiro para ${playerName}. Atuando como ${position} para o ${teamName}, o atleta nascido em ${nationality} destaca-se pela inteligência de posicionamento e excelência em duelos de um contra um.`,
      source: "FutIA Static Scout Engine"
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Escreva um breve relatório de olheiro tático de futebol (máximo 2 parágrafos pequenos) em português sobre o jogador: ${playerName}.
      Posição: ${position}. Nacionalidade: ${nationality}. Time atual: ${teamName}.
      Analise seu estilo de jogo, pontos fortes (como visão de jogo, drible, desarmes) e potencial de impacto tático no elenco atual.`,
      config: {
        systemInstruction: "Você é um olheiro tático de futebol do Manchester City, especialista em prospectar jogadores de elite mundial e detalhar suas virtudes táticas."
      }
    });
    res.json({
      report: response.text || "Relatório de desempenho não pôde ser gerado.",
      source: "FutIA Scout AI"
    });
  } catch (error: any) {
    res.json({
      report: `Relatório de desempenho indisponível no momento para ${playerName}. Atleta de alto rendimento com excelente condicionamento físico e tático.`,
      source: "FutIA Scout Fallback Mode"
    });
  }
});

// API ROUTE: Competitions and Standings
app.get("/api/competitions", async (req, res) => {
  if (hasFootballApiKey()) {
    try {
      const comps = await getCompetitions();
      res.json(comps);
      return;
    } catch (err: any) {
      console.error("[API Competitions Error] Falling back to mock competitions:", err.message);
    }
  }
  res.json(COMPETITIONS);
});

app.get("/api/competitions/:id/standings", async (req, res) => {
  if (hasFootballApiKey()) {
    try {
      const table = await getStandings(req.params.id);
      res.json(table);
      return;
    } catch (err: any) {
      console.error("[API Standings Error] Falling back to mock standings:", err.message);
    }
  }

  const table = STANDINGS[req.params.id];
  if (!table) {
    res.json({ competitionId: req.params.id, rows: [] });
    return;
  }
  res.json(table);
});

// API ROUTE: Get competition top scorers
app.get("/api/competitions/:id/scorers", async (req, res) => {
  if (hasFootballApiKey()) {
    try {
      const scorers = await getTopScorers(req.params.id);
      res.json({ scorers });
      return;
    } catch (err: any) {
      console.error("[API Scorers Error] Falling back to empty scorers:", err.message);
    }
  }
  res.json({ scorers: [] });
});

// API ROUTE: Transfers Market
app.get("/api/market/transfers", (req, res) => {
  res.json(TRANSFERS);
});

// API ROUTE: Editorial News List and Custom AI Summarization
app.get("/api/news", (req, res) => {
  res.json(NEWS);
});

app.get("/api/news/:id", (req, res) => {
  const article = NEWS.find(n => n.id === req.params.id);
  if (!article) {
    res.status(404).json({ error: "Notícia não encontrada." });
    return;
  }
  res.json(article);
});

// API ROUTE: AI Football Chat
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body; // array of { sender: 'user' | 'ai', text: string }
  if (!messages || messages.length === 0) {
    res.status(400).json({ error: "A conversa não pode estar vazia." });
    return;
  }

  const latestMessage = messages[messages.length - 1].text;
  const history = messages.slice(0, -1).map((m: any) => ({
    role: m.sender === "user" ? "user" : "model",
    parts: [{ text: m.text }]
  }));

  const ai = getGeminiClient();
  if (!ai) {
    // Rich simulated AI responder
    let simulatedReply = "Olá! Sou o FutIA Assistant. No momento estou operando em Modo de Demonstração, mas posso te contar que o Real Madrid, Flamengo e Manchester City são as sensações de nossa plataforma esportiva! Pergunte-me qualquer detalhe técnico sobre nossos jogos ao vivo!";
    if (latestMessage.toLowerCase().includes("vini") || latestMessage.toLowerCase().includes("vinícius")) {
      simulatedReply = "Vinicius Jr. está brilhando no Real Madrid! Ele tem 24 golos e 11 assistências na temporada, sendo cotado fortemente para prêmios de melhor do mundo após suas atuações impecáveis na Champions League.";
    } else if (latestMessage.toLowerCase().includes("haaland")) {
      simulatedReply = "Erling Haaland é o camisa 9 letal do Manchester City. Com 1,95m de altura, ele já balançou as redes 38 vezes nesta temporada! Um fenômeno do futebol moderno.";
    } else if (latestMessage.toLowerCase().includes("ronaldo") || latestMessage.toLowerCase().includes("cr7")) {
      simulatedReply = "Cristiano Ronaldo, o lendário CR7, joga no Al Nassr aos 41 anos e continua destruindo barreiras físicas! Ele tem 35 golos nesta temporada na Saudi Pro League.";
    } else if (latestMessage.toLowerCase().includes("tática") || latestMessage.toLowerCase().includes("tatic")) {
      simulatedReply = "Taticamente, o futebol de alto nível moderno exige blocos compactos, pressão imediata após a perda da bola (gegenpressing) e pontas velozes em amplitude máxima. Equipes como o City de Guardiola usam jogo posicional, enquanto Ancelotti prefere flexibilidade tática em transições letais.";
    }
    res.json({ text: simulatedReply, simulated: true });
    return;
  }

  try {
    // Call Gemini with Google Search Grounding to get fresh, real world information!
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...history,
        { role: "user", parts: [{ text: latestMessage }] }
      ],
      config: {
        systemInstruction: `Você é a inteligência artificial do FutIA, o melhor portal de futebol do mundo.
        Você é amigável, ultra inteligente, fala com propriedade tática e profunda sabedoria sobre a história do futebol, campeonatos de clubes e seleções, estatísticas de jogadores ativos, notícias de mercado, contratações, lesões e regras.
        
        Importante:
        - Sempre forneça explicações ricas, interessantes e embasadas.
        - Quando perguntarem sobre palpites ou previsões, faça uma análise embasada, mas adicione OBRIGATORIAMENTE o aviso legal ao final: "*Aviso: Esta análise reflete opiniões geradas por inteligência artificial e serve apenas para entretenimento tático. Não constitui conselho ou recomendação de apostas.*"
        - Cite fontes de dados quando aplicável.
        - Responda no idioma de preferência do usuário (padrão: português, mas seja flexível).
        - Nunca responda com textos vazios.`,
        tools: [{ googleSearch: {} }], // Enable search grounding for real world live news & results!
      }
    });

    const text = response.text || "Peço desculpas, não consegui formular uma resposta para esta consulta. Tente novamente!";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })) || [];

    res.json({ text, sources });
  } catch (error: any) {
    console.error("Gemini Chat API error:", error);
    res.json({
      text: "Opa, houve um breve delay ao consultar minha base cerebral em tempo real! Mas posso te dizer que o Real Madrid e o City estão empatados em 2 a 2 no nosso jogo simulado ao vivo! Pergunte-me mais e tente novamente.",
      error: error.message
    });
  }
});

// API ROUTE: Global Smart Search
app.get("/api/search", async (req, res) => {
  const query = (req.query.q || "").toString().trim().toLowerCase();
  if (!query) {
    res.json({ results: [], aiSummary: "" });
    return;
  }

  // 1. Search in local database
  const matchedTeams = TEAMS.filter(t => t.name.toLowerCase().includes(query) || t.shortName.toLowerCase().includes(query));
  const matchedPlayers = PLAYERS.filter(p => p.name.toLowerCase().includes(query) || p.fullName.toLowerCase().includes(query) || p.nationality.toLowerCase().includes(query) || p.position.toLowerCase().includes(query));
  const matchedMatches = MATCHES.filter(m => m.homeTeam.name.toLowerCase().includes(query) || m.awayTeam.name.toLowerCase().includes(query) || m.competitionName.toLowerCase().includes(query));
  const matchedNews = NEWS.filter(n => n.title.toLowerCase().includes(query) || n.summary.toLowerCase().includes(query));

  const results = [
    ...matchedTeams.map(t => ({ type: "team", id: t.id, name: t.name, logo: t.logo, subtitle: `Clube - ${t.country}` })),
    ...matchedPlayers.map(p => ({ type: "player", id: p.id, name: p.name, logo: p.photo, subtitle: `${p.position} - ${p.currentTeamName}` })),
    ...matchedMatches.map(m => ({ type: "match", id: m.id, name: `${m.homeTeam.name} x ${m.awayTeam.name}`, logo: m.homeTeam.logo, subtitle: `Jogo - ${m.competitionName} (${m.status})` })),
    ...matchedNews.map(n => ({ type: "news", id: n.id, name: n.title, logo: n.imageUrl, subtitle: `Notícia - ${n.source}` })),
  ];

  // 2. Add Smart IA search summary if user queries with natural question or broad topic
  let aiSummary = "";
  const ai = getGeminiClient();
  if (ai && query.length > 5) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Resuma brevemente (em 2 parágrafos no máximo) informações do futebol real em português sobre a consulta de busca: "${query}". Forneça dados interessantes sobre conquistas ou situação atual relacionados a esta busca de maneira informativa para colocar no topo dos resultados do site FutIA.`,
        config: {
          systemInstruction: "Você é um assistente de busca inteligente de futebol, super objetivo e preciso.",
          temperature: 0.3
        }
      });
      aiSummary = response.text || "";
    } catch (e) {
      console.error("AI Search summary failure:", e);
    }
  }

  res.json({
    results,
    aiSummary
  });
});

// START EXPRESS + VITE INTEGRATION
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FutIA Server] Estável e rodando na porta ${PORT}`);
  });
}

startServer();
