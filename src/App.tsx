/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Star,
  Activity,
  AlertTriangle,
  Info,
  Calendar,
  X,
  Plus,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Search
} from "lucide-react";
import Header from "./components/Header";
import MatchCard from "./components/MatchCard";
import LeagueStandingsTab from "./components/LeagueStandingsTab";
import MarketTab from "./components/MarketTab";
import NewsTab from "./components/NewsTab";
import AIScoutChatTab from "./components/AIScoutChatTab";
import ComplianceModal from "./components/ComplianceModal";
import AdBanner from "./components/AdBanner";

import { TRANSLATIONS, LanguageCode } from "./translations";
import { Match, Team, Player, Competition } from "./types";

export default function App() {
  // Global States
  const [currentLang, setCurrentLang] = useState<LanguageCode>("pt");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"live" | "tables" | "market" | "news" | "chat">("live");
  
  // Data State
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<"all" | "live" | "scheduled">("all");
  
  // Selection drawers
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedTeamData, setSelectedTeamData] = useState<Team | null>(null);
  const [selectedTeamLoading, setSelectedTeamLoading] = useState(false);
  const [teamScoutReport, setTeamScoutReport] = useState("");

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedPlayerData, setSelectedPlayerData] = useState<Player | null>(null);
  const [selectedPlayerLoading, setSelectedPlayerLoading] = useState(false);
  const [playerScoutReport, setPlayerScoutReport] = useState("");

  // Favorites
  const [favorites, setFavorites] = useState<{ type: "team" | "player"; id: string; name: string }[]>([]);

  // Legal drawers
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceSection, setComplianceSection] = useState<"about" | "contact" | "privacy" | "terms" | "cookies" | "disclaimer">("about");

  // API Config Status State
  const [configStatus, setConfigStatus] = useState<{ apiKeyConfigured: boolean; geminiKeyConfigured: boolean } | null>(null);

  const t = TRANSLATIONS[currentLang];

  // Auto-detect Language & Theme on Mount
  useEffect(() => {
    // Language detection
    const navLang = navigator.language.slice(0, 2);
    if (["en", "pt", "es", "fr", "de", "it", "ar", "ja", "ko", "zh"].includes(navLang)) {
      setCurrentLang(navLang as LanguageCode);
    }

    // Load Favorites from localStorage if available
    try {
      const stored = localStorage.getItem("futia_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read favorites from localStorage:", e);
    }

    // Check API Config Status
    const checkConfig = async () => {
      try {
        const res = await fetch("/api/config-status");
        const data = await res.json();
        setConfigStatus(data);
      } catch (err) {
        console.warn("Could not check config status:", err);
      }
    };
    checkConfig();
  }, []);

  // Fetch Matches and Competitions
  const fetchMatchesAndComps = async () => {
    try {
      const matchRes = await fetch("/api/matches");
      const matchData = await matchRes.json();
      setMatches(matchData || []);

      const compRes = await fetch("/api/competitions");
      const compData = await compRes.json();
      setCompetitions(compData || []);
    } catch (err) {
      console.error("Failed to sync matches database:", err);
    }
  };

  useEffect(() => {
    fetchMatchesAndComps();
    // Real-time scores polling: updates live matches every 10 seconds!
    const interval = setInterval(fetchMatchesAndComps, 10000);
    return () => clearInterval(interval);
  }, []);

  // Favorites handling
  const handleToggleFavorite = (type: "team" | "player", id: string, name: string) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.type === type && fav.id === id);
      let updated;
      if (exists) {
        updated = prev.filter((fav) => !(fav.type === type && fav.id === id));
      } else {
        updated = [...prev, { type, id, name }];
      }
      try {
        localStorage.setItem("futia_favorites", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not write favorites to localStorage:", e);
      }
      return updated;
    });
  };

  // Inspect specific team
  const handleSelectTeam = async (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedTeamLoading(true);
    setTeamScoutReport("");
    setSelectedPlayerData(null); // Close player if open
    
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      const data = await res.json();
      setSelectedTeamData(data);

      // Fetch Scout AI Insight for this team
      const scoutRes = await fetch(`/api/teams/${teamId}/ai-report`);
      const scoutData = await scoutRes.json();
      setTeamScoutReport(scoutData.report || "");
    } catch (err) {
      console.error("Error loading team detail:", err);
    } finally {
      setSelectedTeamLoading(false);
    }
  };

  // Inspect specific player
  const handleSelectPlayer = async (playerId: string) => {
    setSelectedPlayerId(playerId);
    setSelectedPlayerLoading(true);
    setPlayerScoutReport("");
    setSelectedTeamData(null); // Close team if open
    
    try {
      const res = await fetch(`/api/players/${playerId}`);
      const data = await res.json();
      setSelectedPlayerData(data);

      // Fetch Scout AI Insight for this player
      const scoutRes = await fetch(`/api/players/${playerId}/ai-report`);
      const scoutData = await scoutRes.json();
      setPlayerScoutReport(scoutData.report || "");
    } catch (err) {
      console.error("Error loading player detail:", err);
    } finally {
      setSelectedPlayerLoading(false);
    }
  };

  // Global search select routing
  const handleSearchSelect = (type: string, id: string) => {
    if (type === "team") {
      handleSelectTeam(id);
    } else if (type === "player") {
      handleSelectPlayer(id);
    }
  };

  // Filter matches list
  const filteredMatches = matches.filter((m) => {
    if (selectedMatchFilter === "live") return m.status === "AO VIVO" || m.status === "LIVE";
    if (selectedMatchFilter === "scheduled") return m.status === "AGENDADO" || m.status === "SCHEDULED";
    return true;
  });

  const openComplianceDrawer = (sec: typeof complianceSection) => {
    setComplianceSection(sec);
    setComplianceOpen(true);
  };

  const isRtl = currentLang === "ar";

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        isDarkMode 
          ? "bg-slate-950 text-slate-100 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" 
          : "bg-slate-50 text-slate-900"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      
      {/* Sticky Header */}
      <Header
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onSearchSelect={handleSearchSelect}
        favorites={favorites}
        onOpenCompliance={openComplianceDrawer}
      />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side menu - Navigation tabs & Sports feed */}
        <section className="lg:col-span-8 space-y-6">

          {/* API Configuration Alert banner */}
          {configStatus && !configStatus.apiKeyConfigured && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-xs space-y-1.5 text-amber-200">
              <div className="flex items-center gap-2 font-black tracking-wider uppercase text-amber-400">
                <AlertTriangle size={14} />
                <span>Football-Data.org API Desconectada</span>
              </div>
              <p className="leading-relaxed font-medium">
                A chave <strong className="text-white font-mono">FOOTBALL_DATA_API_KEY</strong> não está configurada nos segredos do seu servidor. 
                O FutIA está exibindo dados realistas simulados em cache para demonstrar a plataforma. 
                Para ativar lances, rodadas e tabelas 100% reais e ao vivo das ligas europeias, configure a sua chave de API nas configurações do AI Studio.
              </p>
            </div>
          )}
          
          {/* Main Interactive Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-white/10">
            {[
              { id: "live", label: t.matchesTitle, count: matches.filter((m) => m.status === "AO VIVO" || m.status === "LIVE").length },
              { id: "tables", label: t.leagueTable },
              { id: "market", label: t.transfersTitle },
              { id: "news", label: t.newsTitle },
              { id: "chat", label: t.aiChat },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-black text-emerald-400" : "bg-red-500 text-white animate-pulse"
                    }`}>
                      {tab.count} {t.liveBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* AdSense Top Header placeholder banner */}
          <AdBanner t={t} type="horizontal" />

          {/* Tab Render Content */}
          <div className="space-y-4">
            
            {/* Tab: Matches */}
            {activeTab === "live" && (
              <div className="space-y-4">
                
                {/* Match type selector sub-pills */}
                <div className="flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-xl w-fit border border-white/10 text-xs font-mono backdrop-blur-sm">
                  {[
                    { id: "all", label: "Todos os Jogos" },
                    { id: "live", label: "Ao Vivo (Simulando)" },
                    { id: "scheduled", label: "Agendados" },
                  ].map((sub) => {
                    const isSubActive = selectedMatchFilter === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedMatchFilter(sub.id as any)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isSubActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>

                {/* Match Cards list */}
                {filteredMatches.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        t={t}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                        onSelectTeam={handleSelectTeam}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 border border-white/10 bg-slate-950/50 rounded-3xl backdrop-blur-sm">
                    <Activity className="mx-auto mb-2 text-slate-600 animate-spin" size={28} />
                    <p className="text-sm font-semibold">Nenhum confronto correspondente encontrado.</p>
                    <p className="text-xs text-slate-600 mt-1">Os lances virtuais reiniciam automaticamente em breve.</p>
                  </div>
                )}

              </div>
            )}

            {/* Tab: Classification */}
            {activeTab === "tables" && (
              <LeagueStandingsTab
                t={t}
                competitions={competitions}
                onSelectTeam={handleSelectTeam}
              />
            )}

            {/* Tab: Transfers & Injuries */}
            {activeTab === "market" && (
              <MarketTab
                t={t}
                onSelectPlayer={handleSelectPlayer}
              />
            )}

            {/* Tab: News Summaries */}
            {activeTab === "news" && (
              <NewsTab t={t} />
            )}

            {/* Tab: Intelligent chat scout assistant */}
            {activeTab === "chat" && (
              <AIScoutChatTab t={t} currentLang={currentLang} />
            )}

          </div>

        </section>

        {/* Right Sidebar - Active Inspect Drawer and Quick Widgets */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Dynamic Inspector Panel (Teams / Players details) */}
          {selectedTeamLoading || selectedPlayerLoading ? (
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono text-xs">{t.analyzing}</span>
            </div>
          ) : selectedTeamData ? (
            /* Selected Club Inspector Drawer */
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-5 space-y-5 shadow-2xl relative animate-in fade-in duration-300 backdrop-blur-sm">
              <button
                onClick={() => setSelectedTeamData(null)}
                className="absolute top-4 right-4 bg-slate-900 border border-white/10 p-1.5 rounded-xl hover:text-white text-slate-400 cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* Club Banner Head */}
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedTeamData.logo}
                  alt={selectedTeamData.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl bg-neutral-800 object-cover"
                />
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">
                    Clube de Futebol
                  </div>
                  <h3 className="text-lg font-black text-white leading-tight mt-0.5">
                    {selectedTeamData.name}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-0.5">{selectedTeamData.stadium}</div>
                </div>
              </div>

              {/* Main Technical Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs leading-relaxed">
                <div className="bg-slate-900/40 border border-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 font-medium">Técnico Principal</span>
                  <span className="text-slate-200 font-bold block mt-1">{selectedTeamData.coach}</span>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 font-medium">Capacidade do Estádio</span>
                  <span className="text-slate-200 font-bold block mt-1">{selectedTeamData.stadiumCapacity.toLocaleString()}</span>
                </div>
              </div>

              {/* Gemini AI Tactical Scout Report */}
              {teamScoutReport && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Sparkles size={14} />
                    <span>Relatório Tático de IA (Gemini)</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
                    {teamScoutReport}
                  </p>
                </div>
              )}

              {/* Squad list scrollable */}
              <div className="space-y-2.5">
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider px-1">
                  Principais Jogadores
                </div>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {selectedTeamData.roster?.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => handleSelectPlayer(pl.id)}
                      className="w-full text-left p-2.5 bg-slate-900/30 hover:bg-white/5 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] text-slate-500 font-bold">#{pl.number}</span>
                        <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors text-xs">{pl.name}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900">
                        {pl.position}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedPlayerData ? (
            /* Selected Player Inspector Drawer */
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-5 space-y-5 shadow-2xl relative animate-in fade-in duration-300 backdrop-blur-sm">
              <button
                onClick={() => setSelectedPlayerData(null)}
                className="absolute top-4 right-4 bg-slate-900 border border-white/10 p-1.5 rounded-xl hover:text-white text-slate-400 cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* Player Banner Head */}
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedPlayerData.photo}
                  alt={selectedPlayerData.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl bg-neutral-800 object-cover border border-neutral-800"
                />
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">
                    Atleta Profissional
                  </div>
                  <h3 className="text-lg font-black text-white leading-tight mt-0.5">
                    {selectedPlayerData.name}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {selectedPlayerData.position} · {selectedPlayerData.currentTeamName}
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-2 text-xs leading-relaxed">
                <div className="bg-slate-900/40 border border-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 font-medium">Nacionalidade</span>
                  <span className="text-slate-200 font-bold block mt-1">{selectedPlayerData.nationality}</span>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 font-medium">Valor de Mercado</span>
                  <span className="text-emerald-400 font-bold block mt-1 font-mono text-sm">{selectedPlayerData.marketValue}</span>
                </div>
              </div>

              {/* Gemini AI Tactical Scout Report */}
              {playerScoutReport && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Sparkles size={14} />
                    <span>Relatório Scout Inteligente (Gemini)</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
                    {playerScoutReport}
                  </p>
                </div>
              )}

              {/* General Season Stats list */}
              <div className="space-y-2.5">
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider px-1">
                  Estatísticas da Temporada 25/26
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-500 block font-medium">Gols</span>
                    <span className="text-white font-black font-mono text-sm block mt-1">{selectedPlayerData.goals}</span>
                  </div>
                  <div className="bg-slate-900/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-500 block font-medium">Assistências</span>
                    <span className="text-white font-black font-mono text-sm block mt-1">{selectedPlayerData.assists}</span>
                  </div>
                  <div className="bg-slate-900/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-500 block font-medium">Partidas</span>
                    <span className="text-white font-black font-mono text-sm block mt-1">{selectedPlayerData.matchesPlayed}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Default Welcome widget */
            <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-5 text-center py-7 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-slate-900/50 border border-white/5 flex items-center justify-center text-slate-500 mx-auto mb-3">
                <Compass size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Inspetor de Inteligência</h4>
              <p className="text-xs text-slate-500 mt-2 max-w-[220px] mx-auto leading-relaxed">
                Clique nos escudos de clubes, nomes de jogadores ou pesquise na barra superior para carregar dossiês de IA completos.
              </p>
            </div>
          )}

          {/* AdSense Sidebar placeholder box */}
          <AdBanner t={t} type="sidebar" />

          {/* Quick legal compliance links at the bottom */}
          <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-4 space-y-3 backdrop-blur-sm">
            <h4 className="text-xs font-bold text-slate-300">Central de Transparência FutIA</h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-neutral-400">
              <button
                onClick={() => openComplianceDrawer("about")}
                className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Sobre nós
              </button>
              <button
                onClick={() => openComplianceDrawer("contact")}
                className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Contato / Suporte
              </button>
              <button
                onClick={() => openComplianceDrawer("privacy")}
                className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Privacidade
              </button>
              <button
                onClick={() => openComplianceDrawer("terms")}
                className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Termos de Uso
              </button>
              <button
                onClick={() => openComplianceDrawer("cookies")}
                className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Cookies
              </button>
              <button
                onClick={() => openComplianceDrawer("disclaimer")}
                className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Aviso Legal / IA
              </button>
            </div>
          </div>

        </aside>

      </main>

      {/* Compliance Overlays / Modal */}
      <ComplianceModal
        isOpen={complianceOpen}
        onClose={() => setComplianceOpen(false)}
        initialSection={complianceSection}
        t={t}
      />

      {/* Bottom Legal footer bar */}
      <footer className="mt-12 border-t border-white/10 bg-slate-950/80 p-6 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-4 text-neutral-400 font-semibold mb-2">
          <button onClick={() => openComplianceDrawer("about")} className="hover:text-emerald-400 cursor-pointer">Quem Somos</button>
          <span>·</span>
          <button onClick={() => openComplianceDrawer("contact")} className="hover:text-emerald-400 cursor-pointer">Contato</button>
          <span>·</span>
          <button onClick={() => openComplianceDrawer("privacy")} className="hover:text-emerald-400 cursor-pointer">Privacidade</button>
          <span>·</span>
          <button onClick={() => openComplianceDrawer("terms")} className="hover:text-emerald-400 cursor-pointer">Termos</button>
        </div>
        <p>© 2026 FutIA. Todos os direitos reservados.</p>
        <p className="max-w-2xl mx-auto text-[11px] leading-relaxed">
          {t.legalAIPolicy}
        </p>
      </footer>

    </div>
  );
}
