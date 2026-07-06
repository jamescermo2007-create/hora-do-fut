/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  country: string;
  founded: number;
  venue: string;
  coach: string;
  description?: string;
  roster?: Player[];
  fixtures?: Match[];
  stats?: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
}

export interface Player {
  id: string;
  name: string;
  fullName: string;
  photo: string;
  position: "Goleiro" | "Defensor" | "Meio-campista" | "Atacante" | "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  age: number;
  nationality: string;
  number: number;
  currentTeamId: string;
  currentTeamName: string;
  marketValue: string;
  height: string;
  weight: string;
  foot: "Destro" | "Canhoto" | "Ambos" | "Right" | "Left" | "Both";
  bio?: string;
  stats: {
    goals: number;
    assists: number;
    matches: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
    cleanSheets?: number;
  };
  injuries?: {
    status: string;
    type: string;
    expectedReturn: string;
  };
}

export interface Competition {
  id: string;
  name: string;
  logo: string;
  country: string;
  type: "League" | "Cup";
}

export interface MatchEvent {
  id: string;
  time: number;
  teamId: string;
  type: "goal" | "card" | "sub";
  detail: string; // e.g., "Golo (Vinicius Jr)", "Cartão Amarelo (Modric)"
  assist?: string;
}

export interface MatchLineup {
  teamId: string;
  formation: string;
  starting: { id: string; name: string; number: number; position: string }[];
  subs: { id: string; name: string; number: number; position: string }[];
}

export interface MatchStats {
  possession: [number, number]; // [Home, Away]
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  cards: { yellow: [number, number]; red: [number, number] };
}

export interface Match {
  id: string;
  competitionId: string;
  competitionName: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: "AO VIVO" | "AGENDADO" | "ENCERRADO" | "LIVE" | "SCHEDULED" | "FINISHED";
  time: string; // e.g. "72'", "20:00", "Encerrado"
  date: string; // YYYY-MM-DD
  events: MatchEvent[];
  lineups?: MatchLineup[];
  stats?: MatchStats;
  h2h?: {
    homeWins: number;
    awayWins: number;
    draws: number;
    previousMatches: { date: string; score: string; winner: string }[];
  };
  aiAnalysis?: string;
}

export interface StandingRow {
  position: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  points: number;
  form: ("W" | "D" | "L" | "V" | "E" | "D")[];
}

export interface LeagueStandings {
  competitionId: string;
  season: string;
  rows: StandingRow[];
}

export interface Transfer {
  id: string;
  playerName: string;
  playerPhoto: string;
  fromTeamName: string;
  fromTeamLogo: string;
  toTeamName: string;
  toTeamLogo: string;
  fee: string;
  date: string;
  status: "Confirmed" | "Rumor";
}

export interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  source: string;
  sourceUrl: string;
  date: string;
  category: "Mercado" | "Champions League" | "Nacional" | "Internacional" | "Análise";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
