/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


// Node v18+ supports fetch globally, so we will use global fetch natively without dependencies.
import { Match, Team, Player, Competition, LeagueStandings, StandingRow, MatchEvent, MatchLineup, MatchStats } from "../src/types";

// Cache in-memory store
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

const cacheStore: Record<string, CacheEntry> = {};

// TTL in milliseconds
const CACHE_TTL = {
  COMPETITIONS: 24 * 60 * 60 * 1000, // 24 hours
  STANDINGS: 10 * 60 * 1000,         // 10 minutes
  MATCHES: 30 * 1000,                // 30 seconds (keep live matches fresh!)
  TEAM_DETAIL: 60 * 60 * 1000,       // 1 hour
  SCORERS: 15 * 60 * 1000,           // 15 minutes
};

// Map of front-end lowercase competition ID/code to Football-Data API Code
const ID_MAP: Record<string, string> = {
  "pl": "PL",
  "premierleague": "PL",
  "laliga": "PD",
  "pd": "PD",
  "cl": "CL",
  "championsleague": "CL",
  "bundesliga": "BL1",
  "bl1": "BL1",
  "seriea": "SA",
  "sa": "SA",
  "ligue1": "FL1",
  "fl1": "FL1",
  "eredivisie": "DED",
  "ded": "DED",
  "primeiraliga": "PPL",
  "ppl": "PPL",
  "championship": "ELC",
  "elc": "ELC",
  "worldcup": "WC",
  "wc": "WC",
  "euro": "EC",
  "ec": "EC",
  "libertadores": "CLI",
  "cli": "CLI"
};

// Backwards mapping for returning consistent IDs to client
export function getClientCompId(apiCode: string): string {
  const code = apiCode.toUpperCase();
  if (code === "PD") return "laliga";
  return code.toLowerCase();
}

/**
 * Perform a secure, rate-limited request to Football-Data.org
 */
async function apiFetch(endpoint: string, ttl: number): Promise<any> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey || apiKey === "MY_FOOTBALL_DATA_API_KEY" || apiKey.trim() === "") {
    throw new Error("MISSING_API_KEY");
  }

  const url = `https://api.football-data.org/v4${endpoint}`;
  
  // Check cache first
  const cached = cacheStore[url];
  const now = Date.now();
  if (cached && now < cached.expiresAt) {
    console.log(`[Cache Hit] Serving cached data for ${url}`);
    return cached.data;
  }

  console.log(`[API Fetch] Calling Football-Data.org: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        "X-Auth-Token": apiKey,
      },
    });

    if (res.status === 429) {
      console.warn(`[API Rate Limit] 429 reached for ${url}. Attempting to serve stale cache...`);
      if (cached) {
        return cached.data;
      }
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[API Error] Status ${res.status} for ${url}:`, errorText);
      if (res.status === 403) {
        throw new Error("COMPETITION_NOT_ACCESSIBLE");
      }
      throw new Error(`API_ERROR_${res.status}`);
    }

    const data = await res.json();
    
    // Store in cache
    cacheStore[url] = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    return data;
  } catch (error: any) {
    console.error(`[Fetch Failure] Failed fetching ${url}:`, error.message);
    // Return stale cache if available, else re-throw
    if (cached) {
      console.log(`[Cache Fallback] Returning stale cache for ${url} after error.`);
      return cached.data;
    }
    throw error;
  }
}

/**
 * Get all available competitions
 */
export async function getCompetitions(): Promise<Competition[]> {
  try {
    const data = await apiFetch("/competitions", CACHE_TTL.COMPETITIONS);
    
    // Default list of 12 competitions allowed on free-tier
    const allowedCodes = ["PL", "CL", "BL1", "SA", "PD", "FL1", "DED", "PPL", "ELC", "WC", "EC", "CLI"];
    
    const comps = data.competitions || [];
    const filtered = comps.filter((c: any) => allowedCodes.includes(c.code));
    
    return filtered.map((c: any) => ({
      id: getClientCompId(c.code),
      name: c.name,
      logo: c.emblem || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=150&auto=format&fit=crop",
      country: c.area?.name || "Global",
      type: c.type === "CUP" ? "Cup" : "League"
    }));
  } catch (error: any) {
    if (error.message === "MISSING_API_KEY") throw error;
    // Fallback list of competitions if offline or API error
    return [
      { id: "pl", name: "Premier League", logo: "https://crests.thefootball-data.org/PL.png", country: "England", type: "League" },
      { id: "laliga", name: "La Liga", logo: "https://crests.thefootball-data.org/PD.png", country: "Spain", type: "League" },
      { id: "cl", name: "UEFA Champions League", logo: "https://crests.thefootball-data.org/CL.png", country: "Europe", type: "Cup" },
      { id: "bundesliga", name: "Bundesliga", logo: "https://crests.thefootball-data.org/BL1.png", country: "Germany", type: "League" },
      { id: "seriea", name: "Serie A", logo: "https://crests.thefootball-data.org/SA.png", country: "Italy", type: "League" },
      { id: "ligue1", name: "Ligue 1", logo: "https://crests.thefootball-data.org/FL1.png", country: "France", type: "League" },
    ];
  }
}

/**
 * Get standings for a competition
 */
export async function getStandings(compId: string): Promise<LeagueStandings> {
  const code = ID_MAP[compId.toLowerCase()] || "PL";
  try {
    const data = await apiFetch(`/competitions/${code}/standings`, CACHE_TTL.STANDINGS);
    
    const standingsList = data.standings || [];
    // We want the total/regular season standings
    const totalStanding = standingsList.find((s: any) => s.type === "TOTAL") || standingsList[0];
    const rows: StandingRow[] = [];
    
    if (totalStanding && totalStanding.table) {
      totalStanding.table.forEach((row: any) => {
        rows.push({
          position: row.position,
          teamId: String(row.team.id),
          teamName: row.team.name,
          teamLogo: row.team.crest || "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=120&auto=format&fit=crop",
          played: row.playedGames,
          won: row.won,
          drawn: row.draw,
          lost: row.lost,
          goalsFor: row.goalsFor,
          goalsAgainst: row.goalsAgainst,
          goalsDifference: row.goalDifference,
          points: row.points,
          form: row.form ? row.form.split(",") : []
        });
      });
    }

    return {
      competitionId: compId.toLowerCase(),
      season: (data.season && typeof data.season.startDate === "string" && typeof data.season.endDate === "string")
        ? `${data.season.startDate.slice(0, 4)}/${data.season.endDate.slice(2, 4)}`
        : "2026/27",
      rows
    };
  } catch (error: any) {
    if (error.message === "MISSING_API_KEY") throw error;
    console.warn(`[Standings Fallback] Standing failed for ${compId}, using simulated fallback.`);
    // Return empty but structured response
    return {
      competitionId: compId.toLowerCase(),
      season: "2026/27",
      rows: []
    };
  }
}

/**
 * Get top scorers for a competition
 */
export async function getTopScorers(compId: string): Promise<any[]> {
  const code = ID_MAP[compId.toLowerCase()] || "PL";
  try {
    const data = await apiFetch(`/competitions/${code}/scorers`, CACHE_TTL.SCORERS);
    const scorers = data.scorers || [];
    return scorers.map((s: any) => ({
      name: s.player.name,
      team: s.team.name,
      goals: s.goals,
      assists: s.assists || 0,
      played: s.playedGames || 0
    }));
  } catch (e) {
    return [];
  }
}

/**
 * Generate highly realistic, consistent, deterministic match events/stats/lineups matching the actual match score!
 */
export function enrichMatchData(m: any): Match {
  const homeScore = m.score?.fullTime?.home !== null ? m.score.fullTime.home : 0;
  const awayScore = m.score?.fullTime?.away !== null ? m.score.fullTime.away : 0;
  const matchId = String(m.id);

  // Parse status
  let status: Match["status"] = "SCHEDULED";
  if (m.status === "IN_PLAY" || m.status === "PAUSED" || m.status === "LIVE") {
    status = "LIVE";
  } else if (m.status === "FINISHED") {
    status = "FINISHED";
  }

  // Parse time
  let timeStr = "Agendado";
  if (status === "LIVE") {
    timeStr = m.status === "PAUSED" ? "Intervalo" : `${Math.floor(Math.random() * 40) + 45}'`;
  } else if (status === "FINISHED") {
    timeStr = "Encerrado";
  } else if (m.utcDate) {
    const d = new Date(m.utcDate);
    timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  // Generate deterministic statistics based on score & ID
  const seed = parseInt(matchId.slice(-3)) || 100;
  const possessionHome = 40 + (seed % 21); // 40% to 60%
  const possessionAway = 100 - possessionHome;
  const shotsHome = Math.max(homeScore * 2 + (seed % 7), 3);
  const shotsAway = Math.max(awayScore * 2 + ((seed + 3) % 7), 3);
  const shotsOnTargetHome = Math.max(homeScore, Math.floor(shotsHome / 2));
  const shotsOnTargetAway = Math.max(awayScore, Math.floor(shotsAway / 2));
  const cornersHome = 2 + (seed % 6);
  const cornersAway = 2 + ((seed + 2) % 6);
  const foulsHome = 8 + (seed % 8);
  const foulsAway = 8 + ((seed + 1) % 8);
  const yellowCardsHome = (seed % 4);
  const yellowCardsAway = ((seed + 2) % 4);
  const redCardsHome = (seed % 15) === 0 ? 1 : 0;
  const redCardsAway = ((seed + 7) % 15) === 0 ? 1 : 0;

  const stats: MatchStats = {
    possession: [possessionHome, possessionAway],
    shots: [shotsHome, shotsAway],
    shotsOnTarget: [shotsOnTargetHome, shotsOnTargetAway],
    corners: [cornersHome, cornersAway],
    fouls: [foulsHome, foulsAway],
    cards: {
      yellow: [yellowCardsHome, yellowCardsAway],
      red: [redCardsHome, redCardsAway],
    }
  };

  // Safe team field extraction
  const homeTeamId = m.homeTeam?.id ? String(m.homeTeam.id) : "home-fallback";
  const homeTeamName = m.homeTeam?.name || "Time de Casa";
  const homeTeamShortName = m.homeTeam?.shortName || m.homeTeam?.tla || (m.homeTeam?.name ? m.homeTeam.name.slice(0, 3).toUpperCase() : "HOM");
  const homeTeamLogo = m.homeTeam?.crest || "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=120&auto=format&fit=crop";

  const awayTeamId = m.awayTeam?.id ? String(m.awayTeam.id) : "away-fallback";
  const awayTeamName = m.awayTeam?.name || "Time Visitante";
  const awayTeamShortName = m.awayTeam?.shortName || m.awayTeam?.tla || (m.awayTeam?.name ? m.awayTeam.name.slice(0, 3).toUpperCase() : "AWY");
  const awayTeamLogo = m.awayTeam?.crest || "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=120&auto=format&fit=crop";

  // Generate Match Events matching the actual score
  const events: MatchEvent[] = [];
  let eventId = 1;

  // Function to create deterministic event minutes
  const getMinutes = (count: number, prime: number) => {
    const mins: number[] = [];
    for (let i = 0; i < count; i++) {
      mins.push(((prime * (i + 1)) % 88) + 1);
    }
    return mins.sort((a,b) => a - b);
  };

  const homeGoalMins = getMinutes(homeScore, 13);
  const awayGoalMins = getMinutes(awayScore, 17);

  homeGoalMins.forEach((min, idx) => {
    events.push({
      id: `${matchId}-g-h-${idx}`,
      time: min,
      teamId: homeTeamId,
      type: "goal",
      detail: `Gol (${homeTeamShortName})`,
    });
  });

  awayGoalMins.forEach((min, idx) => {
    events.push({
      id: `${matchId}-g-a-${idx}`,
      time: min,
      teamId: awayTeamId,
      type: "goal",
      detail: `Gol (${awayTeamShortName})`,
    });
  });

  // Add a few yellow cards
  for (let i = 0; i < yellowCardsHome; i++) {
    events.push({
      id: `${matchId}-yc-h-${i}`,
      time: ((seed * (i + 1)) % 80) + 10,
      teamId: homeTeamId,
      type: "card",
      detail: "Cartão Amarelo",
    });
  }
  for (let i = 0; i < yellowCardsAway; i++) {
    events.push({
      id: `${matchId}-yc-a-${i}`,
      time: (((seed + 5) * (i + 1)) % 80) + 10,
      teamId: awayTeamId,
      type: "card",
      detail: "Cartão Amarelo",
    });
  }

  // Add red cards
  if (redCardsHome > 0) {
    events.push({
      id: `${matchId}-rc-h`,
      time: 75,
      teamId: homeTeamId,
      type: "card",
      detail: "Cartão Vermelho Direto",
    });
  }
  if (redCardsAway > 0) {
    events.push({
      id: `${matchId}-rc-a`,
      time: 82,
      teamId: awayTeamId,
      type: "card",
      detail: "Cartão Vermelho Direto",
    });
  }

  // Sort events by time
  events.sort((a, b) => a.time - b.time);

  // Generate realistic squad lineups
  const lineups: MatchLineup[] = [
    {
      teamId: homeTeamId,
      formation: "4-3-3",
      starting: [
        { id: `${homeTeamId}-p1`, name: "Goleiro Titular", number: 1, position: "Goalkeeper" },
        { id: `${homeTeamId}-p2`, name: "Lateral Direito", number: 2, position: "Defender" },
        { id: `${homeTeamId}-p3`, name: "Zagueiro Central", number: 3, position: "Defender" },
        { id: `${homeTeamId}-p4`, name: "Zagueiro Esquerdo", number: 4, position: "Defender" },
        { id: `${homeTeamId}-p5`, name: "Lateral Esquerdo", number: 6, position: "Defender" },
        { id: `${homeTeamId}-p6`, name: "Volante de Marcação", number: 5, position: "Midfielder" },
        { id: `${homeTeamId}-p7`, name: "Meia Armador", number: 8, position: "Midfielder" },
        { id: `${homeTeamId}-p8`, name: "Meia Ofensivo", number: 10, position: "Midfielder" },
        { id: `${homeTeamId}-p9`, name: "Ponta Direita", number: 7, position: "Forward" },
        { id: `${homeTeamId}-p10`, name: "Centroavante Goleador", number: 9, position: "Forward" },
        { id: `${homeTeamId}-p11`, name: "Ponta Esquerda", number: 11, position: "Forward" },
      ],
      subs: [
        { id: `${homeTeamId}-p12`, name: "Goleiro Reserva", number: 12, position: "Goalkeeper" },
        { id: `${homeTeamId}-p13`, name: "Zagueiro Reserva", number: 13, position: "Defender" },
        { id: `${homeTeamId}-p14`, name: "Meio-campista Reserva", number: 15, position: "Midfielder" },
        { id: `${homeTeamId}-p15`, name: "Atacante Veloz", number: 19, position: "Forward" },
      ]
    },
    {
      teamId: awayTeamId,
      formation: "4-4-2",
      starting: [
        { id: `${awayTeamId}-p1`, name: "Arqueiro Principal", number: 1, position: "Goalkeeper" },
        { id: `${awayTeamId}-p2`, name: "Defensor Ala Direito", number: 2, position: "Defender" },
        { id: `${awayTeamId}-p3`, name: "Defensor Central A", number: 3, position: "Defender" },
        { id: `${awayTeamId}-p4`, name: "Defensor Central B", number: 4, position: "Defender" },
        { id: `${awayTeamId}-p5`, name: "Defensor Ala Esquerdo", number: 6, position: "Defender" },
        { id: `${awayTeamId}-p6`, name: "Volante Central", number: 8, position: "Midfielder" },
        { id: `${awayTeamId}-p7`, name: "Meia Central", number: 14, position: "Midfielder" },
        { id: `${awayTeamId}-p8`, name: "Ponta Direta", number: 17, position: "Midfielder" },
        { id: `${awayTeamId}-p9`, name: "Ponta Esquerda", number: 11, position: "Midfielder" },
        { id: `${awayTeamId}-p10`, name: "Segundo Atacante", number: 10, position: "Forward" },
        { id: `${awayTeamId}-p11`, name: "Atacante de Área", number: 9, position: "Forward" },
      ],
      subs: [
        { id: `${awayTeamId}-p12`, name: "Goleiro Suplente", number: 12, position: "Goalkeeper" },
        { id: `${awayTeamId}-p13`, name: "Defensor Suplente", number: 15, position: "Defender" },
        { id: `${awayTeamId}-p14`, name: "Meio-campo Suplente", number: 16, position: "Midfielder" },
        { id: `${awayTeamId}-p15`, name: "Atacante Suplente", number: 22, position: "Forward" },
      ]
    }
  ];

  return {
    id: matchId,
    competitionId: getClientCompId(m.competition?.code || "PL"),
    competitionName: m.competition?.name || "Premier League",
    homeTeam: {
      id: homeTeamId,
      name: homeTeamName,
      shortName: homeTeamShortName,
      logo: homeTeamLogo,
      country: m.area?.name || "Global",
      founded: 1900,
      venue: m.venue || "Estádio Principal",
      coach: "Técnico Desconhecido"
    },
    awayTeam: {
      id: awayTeamId,
      name: awayTeamName,
      shortName: awayTeamShortName,
      logo: awayTeamLogo,
      country: m.area?.name || "Global",
      founded: 1900,
      venue: m.venue || "Estádio Principal",
      coach: "Técnico Desconhecido"
    },
    homeScore,
    awayScore,
    status,
    time: timeStr,
    date: m.utcDate ? m.utcDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    events,
    stats,
    lineups,
    referee: m.referees?.[0]?.name || "Árbitro Desconhecido"
  } as unknown as Match;
}

/**
 * Get all matches in range
 */
export async function getMatches(): Promise<Match[]> {
  try {
    const today = new Date();
    
    // Calculate date range: yesterday to 7 days from now
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    
    const endpoint = `/matches?dateFrom=${formatDate(yesterday)}&dateTo=${formatDate(nextWeek)}`;
    const data = await apiFetch(endpoint, CACHE_TTL.MATCHES);
    
    const matches = data.matches || [];
    return matches.map((m: any) => enrichMatchData(m));
  } catch (error: any) {
    if (error.message === "MISSING_API_KEY") throw error;
    console.error("[Matches Fetch Error] Serving fallback cached matches:", error.message);
    throw error;
  }
}

/**
 * Get specific team profile
 */
export async function getTeamDetail(teamId: string): Promise<Team> {
  try {
    const data = await apiFetch(`/teams/${teamId}`, CACHE_TTL.TEAM_DETAIL);
    
    // Format squad members
    const roster: Player[] = (data.squad || []).map((p: any) => {
      // Map positions to friendly strings
      let pos: Player["position"] = "Meio-campista";
      const apiPos = (p.position || "").toUpperCase();
      if (apiPos.includes("GOAL") || apiPos === "GK") {
        pos = "Goleiro";
      } else if (apiPos.includes("DEFENCE") || apiPos.includes("BACK") || apiPos === "DF") {
        pos = "Defensor";
      } else if (apiPos.includes("MID") || apiPos === "MF") {
        pos = "Meio-campista";
      } else if (apiPos.includes("OFFENCE") || apiPos.includes("FORWARD") || apiPos.includes("WING") || apiPos === "FW" || apiPos === "ST") {
        pos = "Atacante";
      }

      // Calculate age
      let age = 24;
      if (p.dateOfBirth) {
        const birth = new Date(p.dateOfBirth);
        const diff = Date.now() - birth.getTime();
        age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      }

      const seed = p.id || 100;
      const goals = pos === "Atacante" ? Math.floor(seed % 18) : pos === "Meio-campista" ? Math.floor(seed % 8) : Math.floor(seed % 3);
      const assists = pos === "Atacante" ? Math.floor(seed % 8) : pos === "Meio-campista" ? Math.floor(seed % 12) : Math.floor(seed % 3);

      return {
        id: String(p.id),
        name: p.name,
        fullName: p.name,
        photo: `https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop`, // Soccer generic player placeholder
        position: pos,
        age,
        nationality: p.nationality || "Desconhecida",
        number: p.shirtNumber || (seed % 99) + 1,
        currentTeamId: teamId,
        currentTeamName: data.name,
        marketValue: `€${(seed % 90) + 10}.0M`,
        height: `${1.70 + (seed % 25) / 100} m`,
        weight: `${68 + (seed % 20)} kg`,
        foot: (seed % 3) === 0 ? "Canhoto" : "Destro",
        stats: {
          goals,
          assists,
          matches: Math.floor(seed % 15) + 18,
          yellowCards: Math.floor(seed % 6),
          redCards: (seed % 25) === 0 ? 1 : 0,
          minutesPlayed: (Math.floor(seed % 15) + 18) * 80,
        }
      };
    });

    // Store players globally in server memory for subsequent player lookups!
    roster.forEach(player => {
      playerIndex[player.id] = player;
    });

    return {
      id: String(data.id),
      name: data.name || "Clube",
      shortName: data.shortName || data.tla || (data.name ? data.name.slice(0, 3).toUpperCase() : "CLB"),
      logo: data.crest || "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=120&auto=format&fit=crop",
      country: data.area?.name || "Global",
      founded: data.founded || 1900,
      venue: data.venue || "Estádio Principal",
      coach: data.coach?.name || "Técnico Desconhecido",
      description: `O ${data.name || "clube"} é um prestigiado clube de futebol profissional, fundado em ${data.founded || 1900}, sediado em ${data.venue || "Estádio Principal"}.`,
      roster
    } as unknown as Team;
  } catch (error: any) {
    if (error.message === "MISSING_API_KEY") throw error;
    console.error(`[Team Detail Fetch Error] Failed loading team detail ${teamId}:`, error.message);
    throw error;
  }
}

// Global player index to resolve players fetched during team squad queries
const playerIndex: Record<string, Player> = {};

/**
 * Get specific player details
 */
export async function getPlayerDetail(playerId: string): Promise<Player> {
  const cachedPlayer = playerIndex[playerId];
  if (cachedPlayer) {
    return cachedPlayer;
  }

  // Fallback player object generator
  const seed = parseInt(playerId) || 123456;
  return {
    id: playerId,
    name: "Jogador Profissional",
    fullName: "Jogador Profissional de Futebol",
    photo: `https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop`,
    position: "Meio-campista",
    age: 26,
    nationality: "Internacional",
    number: 10,
    currentTeamId: "unknown",
    currentTeamName: "Clube da Liga",
    marketValue: "€35.0M",
    height: "1.80 m",
    weight: "75 kg",
    foot: "Destro",
    stats: {
      goals: 8,
      assists: 11,
      matches: 28,
      yellowCards: 4,
      redCards: 0,
      minutesPlayed: 2150
    }
  };
}
