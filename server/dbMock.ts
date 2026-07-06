/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team, Player, Competition, Match, LeagueStandings, Transfer, News, MatchEvent } from "../src/types";

// Pre-seeded Competitions
export const COMPETITIONS: Competition[] = [
  { id: "pl", name: "Premier League", logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=150&auto=format&fit=crop", country: "England", type: "League" },
  { id: "laliga", name: "La Liga", logo: "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=150&auto=format&fit=crop", country: "Spain", type: "League" },
  { id: "brasileirao", name: "Brasileirão Série A", logo: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=150&auto=format&fit=crop", country: "Brazil", type: "League" },
  { id: "cl", name: "UEFA Champions League", logo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=150&auto=format&fit=crop", country: "Europe", type: "Cup" },
  { id: "saudi", name: "Saudi Pro League", logo: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=150&auto=format&fit=crop", country: "Saudi Arabia", type: "League" },
];

// Pre-seeded Teams
export const TEAMS: Team[] = [
  // England
  { id: "mancity", name: "Manchester City", shortName: "MNC", logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop", country: "England", founded: 1880, venue: "Etihad Stadium", coach: "Pep Guardiola", description: "Manchester City Football Club é um clube de futebol inglês que compete na Premier League, a principal divisão do futebol inglês." },
  { id: "liverpool", name: "Liverpool FC", shortName: "LIV", logo: "https://images.unsplash.com/photo-1624880351055-97c4d5162153?q=80&w=120&auto=format&fit=crop", country: "England", founded: 1892, venue: "Anfield", coach: "Arne Slot", description: "O Liverpool Football Club é um clube de futebol profissional com sede em Liverpool, Inglaterra. O clube compete na Premier League." },
  { id: "arsenal", name: "Arsenal", shortName: "ARS", logo: "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=120&auto=format&fit=crop", country: "England", founded: 1886, venue: "Emirates Stadium", coach: "Mikel Arteta" },
  { id: "chelsea", name: "Chelsea FC", shortName: "CHE", logo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=120&auto=format&fit=crop", country: "England", founded: 1905, venue: "Stamford Bridge", coach: "Enzo Maresca" },

  // Spain
  { id: "realmadrid", name: "Real Madrid CF", shortName: "RMA", logo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=120&auto=format&fit=crop", country: "Spain", founded: 1902, venue: "Santiago Bernabéu", coach: "Carlo Ancelotti", description: "Real Madrid Club de Fútbol é um clube de futebol espanhol, sediado em Madrid. Eleito pela FIFA o maior clube do século XX." },
  { id: "barcelona", name: "FC Barcelona", shortName: "BAR", logo: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=120&auto=format&fit=crop", country: "Spain", founded: 1899, venue: "Camp Nou", coach: "Hansi Flick", description: "Futbol Club Barcelona é um clube de futebol profissional com sede em Barcelona, Catalunha, Espanha." },
  { id: "atletico", name: "Atlético de Madrid", shortName: "ATM", logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop", country: "Spain", founded: 1903, venue: "Cívitas Metropolitano", coach: "Diego Simeone" },

  // Brazil
  { id: "flamengo", name: "CR Flamengo", shortName: "FLA", logo: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=120&auto=format&fit=crop", country: "Brazil", founded: 1895, venue: "Maracanã", coach: "Filipe Luís", description: "Clube de Regatas do Flamengo é uma agremiação poliesportiva brasileira com sede na cidade do Rio de Janeiro. Fundado no bairro de mesmo nome." },
  { id: "palmeiras", name: "SE Palmeiras", shortName: "PAL", logo: "https://images.unsplash.com/photo-1606925797300-0b35e90d7b59?q=80&w=120&auto=format&fit=crop", country: "Brazil", founded: 1914, venue: "Allianz Parque", coach: "Abel Ferreira", description: "A Sociedade Esportiva Palmeiras é um clube poliesportivo brasileiro sediado na cidade de São Paulo. Fundado sob o nome de Palestra Italia." },
  { id: "botafogo", name: "Botafogo FR", shortName: "BOT", logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop", country: "Brazil", founded: 1904, venue: "Nilton Santos", coach: "Artur Jorge" },
  { id: "saopaulo", name: "São Paulo FC", shortName: "SAO", logo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=120&auto=format&fit=crop", country: "Brazil", founded: 1930, venue: "MorumBIS", coach: "Luis Zubeldía" },

  // Saudi
  { id: "alnassr", name: "Al Nassr FC", shortName: "NAS", logo: "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=120&auto=format&fit=crop", country: "Saudi Arabia", founded: 1955, venue: "Al-Awwal Park", coach: "Stefano Pioli" },
  { id: "alhilal", name: "Al Hilal SFC", shortName: "HIL", logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop", country: "Saudi Arabia", founded: 1957, venue: "Kingdom Arena", coach: "Jorge Jesus" },
];

// Pre-seeded Players
export const PLAYERS: Player[] = [
  // Real Madrid
  {
    id: "viniciusjr",
    name: "Vinicius Jr.",
    fullName: "Vinícius José Paixão de Oliveira Júnior",
    photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop",
    position: "Atacante",
    age: 25,
    nationality: "Brazil",
    number: 7,
    currentTeamId: "realmadrid",
    currentTeamName: "Real Madrid CF",
    marketValue: "€200.0M",
    height: "1.76 m",
    weight: "73 kg",
    foot: "Destro",
    bio: "Vinicius Junior é uma das maiores estrelas do futebol mundial. Veloz, habilidoso e decisivo, ele conquistou títulos cruciais para o Real Madrid, incluindo a Champions League, onde marcou nas finais.",
    stats: { goals: 24, assists: 11, matches: 39, yellowCards: 6, redCards: 0, minutesPlayed: 3100 }
  },
  {
    id: "mbappe",
    name: "Kylian Mbappé",
    fullName: "Kylian Mbappé Lottin",
    photo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=120&auto=format&fit=crop",
    position: "Atacante",
    age: 27,
    nationality: "France",
    number: 9,
    currentTeamId: "realmadrid",
    currentTeamName: "Real Madrid CF",
    marketValue: "€180.0M",
    height: "1.78 m",
    weight: "75 kg",
    foot: "Destro",
    bio: "Kylian Mbappé é um atacante francês campeão mundial conhecido por sua aceleração incrível, finalização clínica e inteligência tática sob pressão.",
    stats: { goals: 28, assists: 9, matches: 35, yellowCards: 3, redCards: 0, minutesPlayed: 2950 }
  },
  {
    id: "bellingham",
    name: "Jude Bellingham",
    fullName: "Jude Victor William Bellingham",
    photo: "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=120&auto=format&fit=crop",
    position: "Meio-campista",
    age: 23,
    nationality: "England",
    number: 5,
    currentTeamId: "realmadrid",
    currentTeamName: "Real Madrid CF",
    marketValue: "€180.0M",
    height: "1.86 m",
    weight: "75 kg",
    foot: "Destro",
    bio: "Jude Bellingham impressionou o mundo após sua transferência milionária para Madrid. Um meia completo, que une poder de marcação, passe cirúrgico e extrema presença de área.",
    stats: { goals: 19, assists: 13, matches: 41, yellowCards: 7, redCards: 1, minutesPlayed: 3450 }
  },

  // Man City
  {
    id: "haaland",
    name: "Erling Haaland",
    fullName: "Erling Braut Haaland",
    photo: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=120&auto=format&fit=crop",
    position: "Atacante",
    age: 25,
    nationality: "Norway",
    number: 9,
    currentTeamId: "mancity",
    currentTeamName: "Manchester City",
    marketValue: "€200.0M",
    height: "1.95 m",
    weight: "88 kg",
    foot: "Canhoto",
    bio: "Erling Haaland é uma máquina de gols. Com força física devastadora, velocidade inacreditável e posicionamento impecável na área, ele quebra recordes a cada temporada na Inglaterra.",
    stats: { goals: 38, assists: 6, matches: 37, yellowCards: 4, redCards: 0, minutesPlayed: 3200 }
  },
  {
    id: "debruyne",
    name: "Kevin De Bruyne",
    fullName: "Kevin De Bruyne",
    photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop",
    position: "Meio-campista",
    age: 35,
    nationality: "Belgium",
    number: 17,
    currentTeamId: "mancity",
    currentTeamName: "Manchester City",
    marketValue: "€50.0M",
    height: "1.81 m",
    weight: "76 kg",
    foot: "Destro",
    bio: "Kevin De Bruyne é amplamente considerado um dos maiores armadores da história do futebol moderno, famoso por sua precisão de cruzamento e visão de jogo de outro mundo.",
    stats: { goals: 7, assists: 18, matches: 28, yellowCards: 2, redCards: 0, minutesPlayed: 1980 },
    injuries: { status: "Recuperado", type: "Fadiga muscular", expectedReturn: "Retorno imediato" }
  },

  // Barcelona
  {
    id: "lewandowski",
    name: "Robert Lewandowski",
    fullName: "Robert Lewandowski",
    photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop",
    position: "Atacante",
    age: 37,
    nationality: "Poland",
    number: 9,
    currentTeamId: "barcelona",
    currentTeamName: "FC Barcelona",
    marketValue: "€15.0M",
    height: "1.85 m",
    weight: "81 kg",
    foot: "Destro",
    stats: { goals: 21, assists: 7, matches: 34, yellowCards: 2, redCards: 0, minutesPlayed: 2750 }
  },
  {
    id: "yamal",
    name: "Lamine Yamal",
    fullName: "Lamine Yamal Nasraoui Ebana",
    photo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=120&auto=format&fit=crop",
    position: "Atacante",
    age: 18,
    nationality: "Spain",
    number: 19,
    currentTeamId: "barcelona",
    currentTeamName: "FC Barcelona",
    marketValue: "€150.0M",
    height: "1.80 m",
    weight: "68 kg",
    foot: "Canhoto",
    bio: "Lamine Yamal é a maior promessa de La Masia dos últimos anos. Com apenas 17 anos ele brilhou na conquista da Euro 2024 pela Espanha.",
    stats: { goals: 11, assists: 14, matches: 45, yellowCards: 1, redCards: 0, minutesPlayed: 3120 }
  },

  // Flamengo
  {
    id: "arrascaeta",
    name: "G. de Arrascaeta",
    fullName: "Giorgian Daniel de Arrascaeta Benedetti",
    photo: "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=120&auto=format&fit=crop",
    position: "Meio-campista",
    age: 32,
    nationality: "Uruguay",
    number: 14,
    currentTeamId: "flamengo",
    currentTeamName: "CR Flamengo",
    marketValue: "€12.0M",
    height: "1.73 m",
    weight: "72 kg",
    foot: "Destro",
    stats: { goals: 10, assists: 16, matches: 38, yellowCards: 3, redCards: 0, minutesPlayed: 2900 }
  },
  {
    id: "pedro",
    name: "Pedro",
    fullName: "Pedro Guilherme Abreu dos Santos",
    photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop",
    position: "Atacante",
    age: 29,
    nationality: "Brazil",
    number: 9,
    currentTeamId: "flamengo",
    currentTeamName: "CR Flamengo",
    marketValue: "€22.0M",
    height: "1.85 m",
    weight: "80 kg",
    foot: "Destro",
    stats: { goals: 31, assists: 5, matches: 42, yellowCards: 1, redCards: 0, minutesPlayed: 3300 },
    injuries: { status: "Lesionado", type: "Ruptura ligamento cruzado", expectedReturn: "4 semanas" }
  },

  // Palmeiras
  {
    id: "veiga",
    name: "Raphael Veiga",
    fullName: "Raphael Cavalcante Veiga",
    photo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=120&auto=format&fit=crop",
    position: "Meio-campista",
    age: 31,
    nationality: "Brazil",
    number: 23,
    currentTeamId: "palmeiras",
    currentTeamName: "SE Palmeiras",
    marketValue: "€14.0M",
    height: "1.78 m",
    weight: "74 kg",
    foot: "Canhoto",
    stats: { goals: 16, assists: 10, matches: 44, yellowCards: 4, redCards: 0, minutesPlayed: 3500 }
  },

  // Al Nassr
  {
    id: "ronaldo",
    name: "Cristiano Ronaldo",
    fullName: "Cristiano Ronaldo dos Santos Aveiro",
    photo: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=120&auto=format&fit=crop",
    position: "Atacante",
    age: 41,
    nationality: "Portugal",
    number: 7,
    currentTeamId: "alnassr",
    currentTeamName: "Al Nassr FC",
    marketValue: "€15.0M",
    height: "1.87 m",
    weight: "83 kg",
    foot: "Destro",
    bio: "Cristiano Ronaldo é o maior artilheiro da história das competições de futebol da FIFA. Vencedor de 5 prêmios Ballon d'Or, continua marcando época e gols emblemáticos no futebol saudita.",
    stats: { goals: 35, assists: 8, matches: 36, yellowCards: 5, redCards: 0, minutesPlayed: 3150 }
  },

  // Al Hilal
  {
    id: "neymar",
    name: "Neymar Jr.",
    fullName: "Neymar da Silva Santos Júnior",
    photo: "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=120&auto=format&fit=crop",
    position: "Atacante",
    age: 34,
    nationality: "Brazil",
    number: 10,
    currentTeamId: "alhilal",
    currentTeamName: "Al Hilal SFC",
    marketValue: "€30.0M",
    height: "1.75 m",
    weight: "68 kg",
    foot: "Destro",
    stats: { goals: 4, assists: 5, matches: 10, yellowCards: 1, redCards: 0, minutesPlayed: 720 },
    injuries: { status: "Lesionado", type: "Pelve / Coxa", expectedReturn: "2 semanas" }
  },
];

// Pre-seeded News (Editorial original content with citation)
export const NEWS: News[] = [
  {
    id: "news1",
    title: "Análise Tática: Como o Real Madrid de Carlo Ancelotti neutraliza transições rápidas",
    summary: "IA tática analisa a dinâmica entre Bellingham e Valverde para preencher espaços deixados pela ofensiva de Vinicius Jr e Mbappé.",
    content: "O Real Madrid sob comando de Carlo Ancelotti tem mostrado uma capacidade fantástica de transição defensiva. O posicionamento híbrido de Jude Bellingham, apoiado pelo vigor físico de Federico Valverde, cria um cinturão de segurança tática que permite a Vinicius Jr e Kylian Mbappé flutuarem livremente pelas pontas sem comprometer a estrutura defensiva. Quando o adversário recupera a posse, o Real recua rapidamente em duas linhas compactas de quatro jogadores. Esse bloqueio força o erro ofensivo inimigo e abre espaço para explosões rápidas em contra-ataques cirúrgicos.",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    source: "FutIA Editorial & ESPN Sports",
    sourceUrl: "https://espn.com",
    date: "2026-07-05",
    category: "Análise"
  },
  {
    id: "news2",
    title: "Mercado de Transferências: Manchester City monitora substituto de De Bruyne para a próxima temporada",
    summary: "Com o contrato do astro belga se aproximando do fim, Guardiola começa o mapeamento de jovens meio-campistas ofensivos na Europa.",
    content: "O Manchester City está se movimentando ativamente no mercado de transferências internacionais para garantir a sucessão de Kevin De Bruyne. O astro belga de 35 anos tem propostas milionárias da MLS e da Saudi Pro League. Fontes ligadas ao clube indicam que Pep Guardiola busca um meio-campista de alta intensidade e precisão de passe vertical, de preferência menor de 24 anos. Nomes proeminentes que despontam no cenário da Bundesliga e do futebol português estão sendo avaliados rigorosamente pela equipe de scouting dos Sky Blues.",
    imageUrl: "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=600&auto=format&fit=crop",
    source: "FutIA Market Reports & FotMob",
    sourceUrl: "https://fotmob.com",
    date: "2026-07-05",
    category: "Mercado"
  },
  {
    id: "news3",
    title: "Brasileirão Série A: SE Palmeiras e CR Flamengo travam batalha pelo topo da tabela nacional",
    summary: "As duas equipes se preparam para um confronto de peso em busca da hegemonia nacional; Abel Ferreira projeta defesa sólida.",
    content: "A disputa pelo troféu do Brasileirão Série A segue emocionante. O Palmeiras de Abel Ferreira, conhecido por sua robustez competitiva e jogadas de bola parada letais, mantém o Flamengo de Filipe Luís sob forte pressão. O Rubro-Negro, impulsionado pela genialidade técnica de Arrascaeta no setor ofensivo, tenta manter as rédeas do campeonato. O embate entre as duas melhores estruturas de investimento da América do Sul promete definir os rumos da temporada do futebol brasileiro.",
    imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600&auto=format&fit=crop",
    source: "FutIA Nacional & Globo Esporte",
    sourceUrl: "https://ge.globo.com",
    date: "2026-07-04",
    category: "Nacional"
  },
  {
    id: "news4",
    title: "Novos Formatos e Tecnologia de IA dominam a Champions League",
    summary: "Tecnologia de impedimento semi-automático e resumos por Inteligência Artificial aprimoram a transmissão dos jogos europeus.",
    content: "A UEFA Champions League consolidou sua posição como o torneio tecnológico de maior destaque no esporte mundial. Com a introdução da análise em tempo real por modelos de inteligência artificial generativa, torcedores agora têm acesso a mapas táticos e probabilidades de gol em segundos diretamente na tela. O sistema de sensores na bola oficial e rastreamento óptico nos estádios de ponta garante decisões precisas de impedimento semi-automático, reduzindo o tempo médio de paralisações pelo VAR em quase 40%.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop",
    source: "FutIA Editorial & OneFootball",
    sourceUrl: "https://onefootball.com",
    date: "2026-07-03",
    category: "Champions League"
  }
];

// Pre-seeded Standing Tables
export const STANDINGS: Record<string, LeagueStandings> = {
  pl: {
    competitionId: "pl",
    season: "2025/2026",
    rows: [
      { position: 1, teamId: "mancity", teamName: "Manchester City", teamLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=80&auto=format&fit=crop", played: 38, won: 28, drawn: 6, lost: 4, goalsFor: 96, goalsAgainst: 34, goalsDifference: 62, points: 90, form: ["W", "W", "D", "W", "W"] },
      { position: 2, teamId: "arsenal", teamName: "Arsenal", teamLogo: "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=80&auto=format&fit=crop", played: 38, won: 26, drawn: 7, lost: 5, goalsFor: 85, goalsAgainst: 29, goalsDifference: 56, points: 85, form: ["W", "L", "W", "W", "D"] },
      { position: 3, teamId: "liverpool", teamName: "Liverpool FC", teamLogo: "https://images.unsplash.com/photo-1624880351055-97c4d5162153?q=80&w=80&auto=format&fit=crop", played: 38, won: 25, drawn: 8, lost: 5, goalsFor: 84, goalsAgainst: 38, goalsDifference: 46, points: 83, form: ["D", "W", "W", "D", "W"] },
      { position: 4, teamId: "chelsea", teamName: "Chelsea FC", teamLogo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=80&auto=format&fit=crop", played: 38, won: 21, drawn: 9, lost: 8, goalsFor: 72, goalsAgainst: 48, goalsDifference: 24, points: 72, form: ["W", "W", "L", "D", "W"] },
    ]
  },
  laliga: {
    competitionId: "laliga",
    season: "2025/2026",
    rows: [
      { position: 1, teamId: "realmadrid", teamName: "Real Madrid CF", teamLogo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=80&auto=format&fit=crop", played: 38, won: 29, drawn: 6, lost: 3, goalsFor: 92, goalsAgainst: 26, goalsDifference: 66, points: 93, form: ["W", "W", "W", "W", "D"] },
      { position: 2, teamId: "barcelona", teamName: "FC Barcelona", teamLogo: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=80&auto=format&fit=crop", played: 38, won: 26, drawn: 6, lost: 6, goalsFor: 86, goalsAgainst: 38, goalsDifference: 48, points: 84, form: ["W", "D", "W", "L", "W"] },
      { position: 3, teamId: "atletico", teamName: "Atlético de Madrid", teamLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=80&auto=format&fit=crop", played: 38, won: 23, drawn: 8, lost: 7, goalsFor: 68, goalsAgainst: 32, goalsDifference: 36, points: 77, form: ["D", "W", "L", "W", "W"] },
    ]
  },
  brasileirao: {
    competitionId: "brasileirao",
    season: "2026",
    rows: [
      { position: 1, teamId: "flamengo", teamName: "CR Flamengo", teamLogo: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=80&auto=format&fit=crop", played: 15, won: 10, drawn: 3, lost: 2, goalsFor: 28, goalsAgainst: 12, goalsDifference: 16, points: 33, form: ["W", "D", "W", "W", "W"] },
      { position: 2, teamId: "palmeiras", teamName: "SE Palmeiras", teamLogo: "https://images.unsplash.com/photo-1606925797300-0b35e90d7b59?q=80&w=80&auto=format&fit=crop", played: 15, won: 9, drawn: 4, lost: 2, goalsFor: 25, goalsAgainst: 10, goalsDifference: 15, points: 31, form: ["W", "W", "W", "D", "L"] },
      { position: 3, teamId: "botafogo", teamName: "Botafogo FR", teamLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=80&auto=format&fit=crop", played: 15, won: 8, drawn: 4, lost: 3, goalsFor: 23, goalsAgainst: 14, goalsDifference: 9, points: 28, form: ["D", "W", "L", "W", "W"] },
      { position: 4, teamId: "saopaulo", teamName: "São Paulo FC", teamLogo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=80&auto=format&fit=crop", played: 15, won: 7, drawn: 4, lost: 4, goalsFor: 20, goalsAgainst: 16, goalsDifference: 4, points: 25, form: ["L", "W", "D", "W", "D"] },
    ]
  }
};

// Hot Market Transfers
export const TRANSFERS: Transfer[] = [
  { id: "tr1", playerName: "Kylian Mbappé", playerPhoto: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=80&auto=format&fit=crop", fromTeamName: "Paris SG", fromTeamLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=60&auto=format&fit=crop", toTeamName: "Real Madrid", toTeamLogo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=60&auto=format&fit=crop", fee: "Grátis (Fim de Contrato)", date: "2025-07-01", status: "Confirmed" },
  { id: "tr2", playerName: "Florian Wirtz", playerPhoto: "https://images.unsplash.com/photo-1540747737956-37872175267a?q=80&w=80&auto=format&fit=crop", fromTeamName: "Bayer Leverkusen", fromTeamLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=60&auto=format&fit=crop", toTeamName: "Real Madrid", toTeamLogo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=60&auto=format&fit=crop", fee: "€130.0M (Rumor Forte)", date: "2026-06-25", status: "Rumor" },
  { id: "tr3", playerName: "Estêvão Willian", playerPhoto: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=80&auto=format&fit=crop", fromTeamName: "Palmeiras", fromTeamLogo: "https://images.unsplash.com/photo-1606925797300-0b35e90d7b59?q=80&w=60&auto=format&fit=crop", toTeamName: "Chelsea FC", toTeamLogo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=60&auto=format&fit=crop", fee: "€61.5M", date: "2025-07-05", status: "Confirmed" },
];

// Active State: Matches
export let MATCHES: Match[] = [
  // Live simulation matches
  {
    id: "match1",
    competitionId: "cl",
    competitionName: "UEFA Champions League",
    homeTeam: TEAMS.find(t => t.id === "realmadrid")!,
    awayTeam: TEAMS.find(t => t.id === "mancity")!,
    homeScore: 2,
    awayScore: 2,
    status: "AO VIVO",
    time: "72'",
    date: "2026-07-05",
    events: [
      { id: "ev1", time: 14, teamId: "mancity", type: "goal", detail: "Golo (Erling Haaland)", assist: "Kevin De Bruyne" },
      { id: "ev2", time: 32, teamId: "realmadrid", type: "goal", detail: "Golo (Vinicius Jr.)", assist: "Jude Bellingham" },
      { id: "ev3", time: 44, teamId: "realmadrid", type: "card", detail: "Cartão Amarelo (Luka Modric)" },
      { id: "ev4", time: 58, teamId: "mancity", type: "goal", detail: "Golo (Kevin De Bruyne)" },
      { id: "ev5", time: 67, teamId: "realmadrid", type: "goal", detail: "Golo (Kylian Mbappé)", assist: "Vinicius Jr." },
    ],
    lineups: [
      {
        teamId: "realmadrid",
        formation: "4-3-3",
        starting: [
          { id: "courtois", name: "Thibaut Courtois", number: 1, position: "Goleiro" },
          { id: "carvajal", name: "Dani Carvajal", number: 2, position: "Defensor" },
          { id: "militao", name: "Éder Militão", number: 3, position: "Defensor" },
          { id: "rudiger", name: "Antonio Rüdiger", number: 22, position: "Defensor" },
          { id: "mendy", name: "Ferland Mendy", number: 23, position: "Defensor" },
          { id: "valverde", name: "Federico Valverde", number: 15, position: "Meio-campista" },
          { id: "tchouameni", name: "Aurélien Tchouaméni", number: 18, position: "Meio-campista" },
          { id: "bellingham", name: "Jude Bellingham", number: 5, position: "Meio-campista" },
          { id: "rodrygo", name: "Rodrygo", number: 11, position: "Atacante" },
          { id: "mbappe", name: "Kylian Mbappé", number: 9, position: "Atacante" },
          { id: "viniciusjr", name: "Vinicius Jr.", number: 7, position: "Atacante" },
        ],
        subs: [
          { id: "lunin", name: "Andriy Lunin", number: 13, position: "Goleiro" },
          { id: "modric", name: "Luka Modric", number: 10, position: "Meio-campista" },
          { id: "camavinga", name: "Eduardo Camavinga", number: 6, position: "Meio-campista" },
          { id: "endrick", name: "Endrick", number: 16, position: "Atacante" },
          { id: "guler", name: "Arda Güler", number: 15, position: "Atacante" },
        ]
      },
      {
        teamId: "mancity",
        formation: "4-1-4-1",
        starting: [
          { id: "ederson", name: "Ederson", number: 31, position: "Goleiro" },
          { id: "walker", name: "Kyle Walker", number: 2, position: "Defensor" },
          { id: "dias", name: "Rúben Dias", number: 3, position: "Defensor" },
          { id: "akanji", name: "Manuel Akanji", number: 25, position: "Defensor" },
          { id: "gvardiol", name: "Josko Gvardiol", number: 24, position: "Defensor" },
          { id: "rodri", name: "Rodri", number: 16, position: "Meio-campista" },
          { id: "silva", name: "Bernardo Silva", number: 20, position: "Meio-campista" },
          { id: "debruyne", name: "Kevin De Bruyne", number: 17, position: "Meio-campista" },
          { id: "foden", name: "Phil Foden", number: 47, position: "Meio-campista" },
          { id: "grealish", name: "Jack Grealish", number: 10, position: "Meio-campista" },
          { id: "haaland", name: "Erling Haaland", number: 9, position: "Atacante" },
        ],
        subs: [
          { id: "ortega", name: "Stefan Ortega", number: 18, position: "Goleiro" },
          { id: "kovacic", name: "Mateo Kovacic", number: 8, position: "Meio-campista" },
          { id: "lewis", name: "Rico Lewis", number: 82, position: "Defensor" },
          { id: "savinho", name: "Savinho", number: 26, position: "Atacante" },
          { id: "doku", name: "Jeremy Doku", number: 11, position: "Atacante" },
        ]
      }
    ],
    stats: {
      possession: [48, 52],
      shots: [14, 16],
      shotsOnTarget: [6, 8],
      corners: [5, 7],
      fouls: [9, 11],
      cards: { yellow: [2, 1], red: [0, 0] }
    },
    h2h: {
      homeWins: 5,
      awayWins: 4,
      draws: 3,
      previousMatches: [
        { date: "2025-04-17", score: "1 - 1 (Real venceu nos pênaltis)", winner: "Real Madrid CF" },
        { date: "2025-04-09", score: "3 - 3", winner: "Empate" },
        { date: "2024-05-17", score: "4 - 0", winner: "Manchester City" }
      ]
    },
    aiAnalysis: "Confronto de nível de final antecipada. O Real Madrid aposta em lances verticais de transição veloz com Vinicius Jr. e Mbappé, enquanto o Manchester City exerce seu tradicional sufoco posicional sustentado pelo cérebro técnico de Kevin De Bruyne e pelo instinto assassino de Erling Haaland. O equilíbrio é absoluto e os contra-ataques do Real de Ancelotti expõem a linha alta da defesa dos Citizens."
  },
  {
    id: "match2",
    competitionId: "brasileirao",
    competitionName: "Brasileirão Série A",
    homeTeam: TEAMS.find(t => t.id === "flamengo")!,
    awayTeam: TEAMS.find(t => t.id === "palmeiras")!,
    homeScore: 1,
    awayScore: 0,
    status: "AO VIVO",
    time: "35'",
    date: "2026-07-05",
    events: [
      { id: "evb1", time: 21, teamId: "flamengo", type: "goal", detail: "Golo (G. de Arrascaeta)", assist: "Pedro" },
      { id: "evb2", time: 29, teamId: "palmeiras", type: "card", detail: "Cartão Amarelo (Gustavo Gómez)" },
    ],
    lineups: {
      teamId: "flamengo",
      formation: "4-2-3-1",
      starting: [
        { id: "rossi", name: "Rossi", number: 1, position: "Goleiro" },
        { id: "varela", name: "Varela", number: 2, position: "Defensor" },
        { id: "ortiz", name: "Léo Ortiz", number: 3, position: "Defensor" },
        { id: "pereira", name: "Léo Pereira", number: 4, position: "Defensor" },
        { id: "ayrton", name: "Ayrton Lucas", number: 6, position: "Defensor" },
        { id: "pulgar", name: "Erick Pulgar", number: 5, position: "Meio-campista" },
        { id: "delacruz", name: "De la Cruz", number: 18, position: "Meio-campista" },
        { id: "gerson", name: "Gerson", number: 8, position: "Meio-campista" },
        { id: "arrascaeta", name: "Arrascaeta", number: 14, position: "Meio-campista" },
        { id: "luizhenrique", name: "Luiz Araújo", number: 7, position: "Atacante" },
        { id: "pedro", name: "Pedro", number: 9, position: "Atacante" },
      ],
      subs: []
    } as any,
    stats: {
      possession: [55, 45],
      shots: [6, 4],
      shotsOnTarget: [3, 1],
      corners: [2, 3],
      fouls: [6, 8],
      cards: { yellow: [0, 1], red: [0, 0] }
    },
    h2h: {
      homeWins: 12,
      awayWins: 10,
      draws: 15,
      previousMatches: [
        { date: "2025-11-08", score: "3 - 0", winner: "CR Flamengo" },
        { date: "2025-07-08", score: "1 - 1", winner: "Empate" }
      ]
    },
    aiAnalysis: "O grande clássico interestadual brasileiro do século XXI. O Flamengo de Filipe Luís dita o ritmo com maior posse de bola sob a batuta de De la Cruz e Arrascaeta. Abel Ferreira arma o Palmeiras para espetar transições rápidas nas costas de Ayrton Lucas com as arrancadas de jovens pontas. O golo precoce de Arrascaeta obriga o Palmeiras a se expor."
  },

  // Scheduled / Today matches
  {
    id: "match3",
    competitionId: "laliga",
    competitionName: "La Liga",
    homeTeam: TEAMS.find(t => t.id === "barcelona")!,
    awayTeam: TEAMS.find(t => t.id === "atletico")!,
    homeScore: 0,
    awayScore: 0,
    status: "AGENDADO",
    time: "21:00",
    date: "2026-07-05",
    events: [],
    lineups: undefined,
    stats: { possession: [0, 0], shots: [0, 0], shotsOnTarget: [0, 0], corners: [0, 0], fouls: [0, 0], cards: { yellow: [0, 0], red: [0, 0] } },
    h2h: {
      homeWins: 24,
      awayWins: 15,
      draws: 12,
      previousMatches: [
        { date: "2025-03-12", score: "1 - 0", winner: "FC Barcelona" },
        { date: "2024-12-04", score: "2 - 1", winner: "FC Barcelona" }
      ]
    },
    aiAnalysis: "Barcelona busca manter a invencibilidade jogando sob seus domínios com Hansi Flick. Lewandowski vive excelente fase acompanhado da audácia do jovem Lamine Yamal pelas pontas. O Atlético de Simeone montará seu icônico ferrolho baixo para acionar Griezmann e Sorloth em contra-golpes."
  },
  {
    id: "match4",
    competitionId: "saudi",
    competitionName: "Saudi Pro League",
    homeTeam: TEAMS.find(t => t.id === "alnassr")!,
    awayTeam: TEAMS.find(t => t.id === "alhilal")!,
    homeScore: 0,
    awayScore: 0,
    status: "AGENDADO",
    time: "20:30",
    date: "2026-07-06",
    events: [],
  },

  // Finished matches
  {
    id: "match5",
    competitionId: "pl",
    competitionName: "Premier League",
    homeTeam: TEAMS.find(t => t.id === "liverpool")!,
    awayTeam: TEAMS.find(t => t.id === "chelsea")!,
    homeScore: 3,
    awayScore: 1,
    status: "ENCERRADO",
    time: "90'",
    date: "2026-07-04",
    events: [
      { id: "f1", time: 8, teamId: "liverpool", type: "goal", detail: "Golo (Mohamed Salah)" },
      { id: "f2", time: 34, teamId: "chelsea", type: "goal", detail: "Golo (Cole Palmer)" },
      { id: "f3", time: 61, teamId: "liverpool", type: "goal", detail: "Golo (Luis Díaz)", assist: "Alexis Mac Allister" },
      { id: "f4", time: 78, teamId: "chelsea", type: "card", detail: "Cartão Amarelo (Moises Caicedo)" },
      { id: "f5", time: 88, teamId: "liverpool", type: "goal", detail: "Golo (Darwin Núñez)" },
    ],
    stats: {
      possession: [52, 48],
      shots: [18, 12],
      shotsOnTarget: [9, 4],
      corners: [6, 4],
      fouls: [10, 14],
      cards: { yellow: [1, 3], red: [0, 0] }
    },
    aiAnalysis: "O Liverpool dominou o Chelsea em Anfield. Com uma intensidade de pressão alta (gegenpressing) fantástica implantada por Arne Slot, o Liverpool forçou múltiplos erros na saída de bola dos Blues. Luis Díaz foi o destaque absoluto desestabilizando a ala direita defensiva do Chelsea."
  }
];

// REAL-TIME ACTIVE MOTOR LOOP FOR SIMULATION
// Runs every 15 seconds to simulate lives actions
export function startLiveSimulation() {
  setInterval(() => {
    // 1. Find live matches
    const liveMatches = MATCHES.filter(m => m.status === "AO VIVO" || m.status === "LIVE");
    
    liveMatches.forEach(match => {
      // Parse current minute e.g. "72'"
      let minute = parseInt(match.time.replace("'", ""));
      if (isNaN(minute)) {
        minute = Math.floor(Math.random() * 90);
      }

      // Advance time
      minute += 1;

      if (minute > 90) {
        // Match ends!
        match.status = "ENCERRADO";
        match.time = "Encerrado";
        return;
      }

      match.time = `${minute}'`;

      // Probability of event (e.g. 15% chance per minute)
      if (Math.random() < 0.20) {
        // Choose event type: goal, card, sub
        const rand = Math.random();
        const homeFavored = Math.random() < 0.52; // slight bias
        const actingTeam = homeFavored ? match.homeTeam : match.awayTeam;
        const otherTeam = homeFavored ? match.awayTeam : match.homeTeam;

        if (rand < 0.35) {
          // Goal!
          if (homeFavored) {
            match.homeScore += 1;
          } else {
            match.awayScore += 1;
          }

          // Pick a player
          const scorer = getRandomPlayerName(actingTeam.id);
          const assistant = getRandomPlayerName(actingTeam.id, scorer);
          
          const newEvent: MatchEvent = {
            id: `ev-sim-${Date.now()}`,
            time: minute,
            teamId: actingTeam.id,
            type: "goal",
            detail: `Golo (${scorer})`,
            assist: assistant
          };

          match.events.push(newEvent);

          // Update stats
          if (match.stats) {
            const index = homeFavored ? 0 : 1;
            match.stats.shots[index] += 1;
            match.stats.shotsOnTarget[index] += 1;
          }
        } else if (rand < 0.75) {
          // Card!
          const cardType = Math.random() < 0.9 ? "Amarelo" : "Vermelho";
          const violator = getRandomPlayerName(otherTeam.id);
          
          const newEvent: MatchEvent = {
            id: `ev-sim-${Date.now()}`,
            time: minute,
            teamId: otherTeam.id,
            type: "card",
            detail: `Cartão ${cardType} (${violator})`
          };

          match.events.push(newEvent);

          if (match.stats) {
            const index = homeFavored ? 1 : 0; // card goes to opponent
            if (cardType === "Amarelo") {
              match.stats.cards.yellow[index] += 1;
            } else {
              match.stats.cards.red[index] += 1;
            }
          }
        } else {
          // Sub!
          const playerOut = getRandomPlayerName(actingTeam.id);
          const playerIn = getRandomPlayerName(actingTeam.id, playerOut);

          const newEvent: MatchEvent = {
            id: `ev-sim-${Date.now()}`,
            time: minute,
            teamId: actingTeam.id,
            type: "sub",
            detail: `Substituição (${playerIn} entrou, ${playerOut} saiu)`
          };

          match.events.push(newEvent);
        }
      }

      // Slightly fluctuate general stats
      if (match.stats) {
        if (Math.random() < 0.4) {
          const isHome = Math.random() < 0.5;
          const idx = isHome ? 0 : 1;
          match.stats.shots[idx] += Math.random() < 0.5 ? 1 : 0;
          match.stats.corners[idx] += Math.random() < 0.3 ? 1 : 0;
          match.stats.fouls[idx] += Math.random() < 0.5 ? 1 : 0;
          
          // keep possession sum to 100
          if (Math.random() < 0.2) {
            const offset = Math.random() < 0.5 ? 1 : -1;
            if (match.stats.possession[0] + offset > 30 && match.stats.possession[0] + offset < 70) {
              match.stats.possession[0] += offset;
              match.stats.possession[1] -= offset;
            }
          }
        }
      }
    });
  }, 15000);
}

// Utility to get random players for match details
function getRandomPlayerName(teamId: string, excludeName?: string): string {
  const roster = PLAYERS.filter(p => p.currentTeamId === teamId);
  if (roster.length > 0) {
    const list = roster.filter(p => p.name !== excludeName);
    const chosen = list[Math.floor(Math.random() * list.length)];
    if (chosen) return chosen.name;
  }
  
  // Fallback lists
  const fallbacks: Record<string, string[]> = {
    realmadrid: ["Rodrygo", "Carvajal", "Modric", "Rudiger", "Valverde", "Guler", "Endrick"],
    mancity: ["Foden", "Bernardo", "Rodri", "Gvardiol", "Walker", "Savinho", "Doku"],
    barcelona: ["Gavi", "Pedri", "Raphinha", "Araujo", "Balde", "Fermin"],
    flamengo: ["Gerson", "De la Cruz", "Bruno Henrique", "Luiz Araujo", "Leo Ortiz"],
    palmeiras: ["Felipe Anderson", "Gustavo Gomez", "Lopes", "Dudu", "Estevao"],
    alnassr: ["Sadio Mane", "Talisca", "Brozovic", "Otavio", "Lajami"],
    alhilal: ["Mitrovic", "Milinkovic-Savic", "Malcom", "Ruben Neves", "Koulibaly"]
  };

  const teamFallbacks = fallbacks[teamId] || ["Jogador A", "Jogador B", "Jogador C"];
  const list = teamFallbacks.filter(name => name !== excludeName);
  return list[Math.floor(Math.random() * list.length)] || "Jogador X";
}
