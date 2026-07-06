/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Sparkles, Star, Users, BarChart3, RotateCcw, AlertTriangle } from "lucide-react";
import { Match, Team, Player } from "../types";
import { TranslationDictionary } from "../translations";

interface MatchCardProps {
  key?: any;
  match: Match;
  t: TranslationDictionary;
  favorites: { type: "team" | "player"; id: string; name: string }[];
  onToggleFavorite: (type: "team" | "player", id: string, name: string) => void;
  onSelectTeam: (teamId: string) => any;
}

export default function MatchCard({
  match,
  t,
  favorites,
  onToggleFavorite,
  onSelectTeam
}: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "lineups" | "stats" | "h2h" | "ai">("events");
  const [aiReport, setAiReport] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const isHomeFavorite = favorites.some((f) => f.id === match.homeTeam.id);
  const isAwayFavorite = favorites.some((f) => f.id === match.awayTeam.id);

  // Is Live check
  const isLive = match.status === "AO VIVO" || match.status === "LIVE";

  const fetchAiTacticalReport = async () => {
    if (aiReport) return; // already loaded
    setLoadingAi(true);
    try {
      const response = await fetch(`/api/matches/${match.id}/ai-analysis`);
      const data = await response.json();
      setAiReport(data.analysis || "");
    } catch (err) {
      console.error("AI Report fetch error:", err);
      setAiReport("Falha ao gerar o relatório com Gemini. Por favor, tente novamente.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className={`w-full bg-slate-950/40 backdrop-blur-sm border rounded-2xl transition-all duration-300 overflow-hidden ${
      isLive ? "border-emerald-500/25 shadow-lg shadow-emerald-500/5 bg-slate-900/40" : "border-white/10"
    }`}>
      
      {/* Card Header Info */}
      <div className="px-4 py-2 bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-400 border-b border-white/5 font-mono">
        <span className="font-semibold tracking-wider uppercase text-emerald-400">
          {match.competitionName}
        </span>
        <div className="flex items-center gap-1.5">
          <Clock size={11} />
          <span>{match.date}</span>
        </div>
      </div>

      {/* Primary Scores Row */}
      <div className="p-4 md:p-5 flex items-center justify-between">
        
        {/* Home Team */}
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="relative">
            <img
              src={match.homeTeam.logo}
              alt={match.homeTeam.name}
              referrerPolicy="no-referrer"
              onClick={() => onSelectTeam(match.homeTeam.id)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 object-cover cursor-pointer hover:scale-105 transition-transform"
            />
            <button
              onClick={() => onToggleFavorite("team", match.homeTeam.id, match.homeTeam.name)}
              className="absolute -top-1 -right-1 bg-slate-900 border border-white/10 p-1 rounded-full hover:scale-110 transition-transform cursor-pointer"
            >
              <Star size={10} fill={isHomeFavorite ? "#eab308" : "none"} className={isHomeFavorite ? "text-yellow-500" : "text-slate-500"} />
            </button>
          </div>
          <div>
            <div
              onClick={() => onSelectTeam(match.homeTeam.id)}
              className="font-bold text-sm sm:text-base text-slate-200 hover:text-white cursor-pointer transition-colors"
            >
              {match.homeTeam.name}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{match.homeTeam.shortName}</div>
          </div>
        </div>

        {/* Center score & status */}
        <div className="px-6 flex flex-col items-center justify-center shrink-0">
          
          {/* Active status badge */}
          {isLive ? (
            <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse mb-1.5 tracking-widest">
              ● {t.liveBadge}
            </div>
          ) : match.status === "ENCERRADO" || match.status === "FINISHED" ? (
            <div className="bg-slate-800 text-slate-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full mb-1.5 tracking-wider">
              {t.finished.toUpperCase()}
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full mb-1.5 tracking-wider">
              {match.time}
            </div>
          )}

          {/* Scores */}
          <div className="flex items-center gap-4 text-2xl sm:text-3xl font-black font-mono tracking-tighter text-white">
            {match.status === "AGENDADO" ? (
              <span className="text-sm font-semibold tracking-wider text-neutral-500">{match.time}</span>
            ) : (
              <>
                <span className={match.homeScore > match.awayScore ? "text-emerald-400" : ""}>{match.homeScore}</span>
                <span className="text-neutral-600 text-xl">-</span>
                <span className={match.awayScore > match.homeScore ? "text-emerald-400" : ""}>{match.awayScore}</span>
              </>
            )}
          </div>

          {/* Running Time (for Live games) */}
          {isLive && (
            <div className="text-[11px] text-emerald-400 font-mono font-bold mt-1.5 animate-pulse bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">
              {match.time}
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col sm:flex-row-reverse items-center gap-3 text-center sm:text-right">
          <div className="relative">
            <img
              src={match.awayTeam.logo}
              alt={match.awayTeam.name}
              referrerPolicy="no-referrer"
              onClick={() => onSelectTeam(match.awayTeam.id)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 object-cover cursor-pointer hover:scale-105 transition-transform"
            />
            <button
              onClick={() => onToggleFavorite("team", match.awayTeam.id, match.awayTeam.name)}
              className="absolute -top-1 -right-1 bg-slate-900 border border-white/10 p-1 rounded-full hover:scale-110 transition-transform cursor-pointer"
            >
              <Star size={10} fill={isAwayFavorite ? "#eab308" : "none"} className={isAwayFavorite ? "text-yellow-500" : "text-slate-500"} />
            </button>
          </div>
          <div>
            <div
              onClick={() => onSelectTeam(match.awayTeam.id)}
              className="font-bold text-sm sm:text-base text-slate-200 hover:text-white cursor-pointer transition-colors"
            >
              {match.awayTeam.name}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{match.awayTeam.shortName}</div>
          </div>
        </div>

      </div>

      {/* Bottom Accordion Action */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2.5 bg-slate-900/20 hover:bg-slate-900/40 border-t border-white/10 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-all cursor-pointer font-semibold"
      >
        <span>{t.details}</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Expandable Panel */}
      {isExpanded && (
        <div className="border-t border-white/10 bg-slate-950/60 backdrop-blur-sm p-4 animate-in slide-in-from-top-4 duration-300">
          
          {/* Sub Tabs */}
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-2.5 mb-4 overflow-x-auto">
            {[
              { id: "events", label: t.events, icon: Clock },
              { id: "stats", label: t.stats, icon: BarChart3 },
              { id: "lineups", label: t.lineups, icon: Users },
              { id: "h2h", label: t.h2h, icon: RotateCcw },
              { id: "ai", label: t.aiAnalysis, icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === "ai") fetchAiTacticalReport();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub Tab: Events / Lances */}
          {activeTab === "events" && (
            <div className="space-y-3 font-sans max-w-xl mx-auto py-2">
              {match.events && match.events.length > 0 ? (
                match.events
                  .slice()
                  .sort((a, b) => b.time - a.time) // newest on top
                  .map((event) => (
                    <div key={event.id} className="flex items-center gap-3 text-xs leading-relaxed">
                      <span className="w-10 text-right text-[11px] font-bold font-mono text-emerald-400 shrink-0">
                        {event.time}'
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 shrink-0"></div>
                      <div className="flex-1 flex items-center justify-between gap-2">
                        <span className="text-neutral-300 font-medium">{event.detail}</span>
                        {event.assist && (
                          <span className="text-[10px] text-neutral-500 font-medium italic">
                            assist: {event.assist}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-6 text-xs text-neutral-500 font-mono">
                  {t.noEvents}
                </div>
              )}
            </div>
          )}

          {/* Sub Tab: Stats Sliders */}
          {activeTab === "stats" && match.stats && (
            <div className="space-y-4 max-w-xl mx-auto py-2 text-xs">
              
              {/* Possession Slider */}
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-neutral-400">
                  <span>{match.stats.possession[0]}%</span>
                  <span className="uppercase tracking-wider text-[10px]">{t.possession}</span>
                  <span>{match.stats.possession[1]}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${match.stats.possession[0]}%` }}></div>
                  <div className="bg-neutral-700 h-full transition-all" style={{ width: `${match.stats.possession[1]}%` }}></div>
                </div>
              </div>

              {/* Shots Sliders */}
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-neutral-400">
                  <span>{match.stats.shots[0]}</span>
                  <span className="uppercase tracking-wider text-[10px]">{t.shots}</span>
                  <span>{match.stats.shots[1]}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(match.stats.shots[0] / (match.stats.shots[0] + match.stats.shots[1] || 1)) * 100}%` }}></div>
                  <div className="bg-neutral-700 h-full transition-all" style={{ width: `${(match.stats.shots[1] / (match.stats.shots[0] + match.stats.shots[1] || 1)) * 100}%` }}></div>
                </div>
              </div>

              {/* Shots On Target */}
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-neutral-400">
                  <span>{match.stats.shotsOnTarget[0]}</span>
                  <span className="uppercase tracking-wider text-[10px]">{t.shotsOnTarget}</span>
                  <span>{match.stats.shotsOnTarget[1]}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(match.stats.shotsOnTarget[0] / (match.stats.shotsOnTarget[0] + match.stats.shotsOnTarget[1] || 1)) * 100}%` }}></div>
                  <div className="bg-neutral-700 h-full transition-all" style={{ width: `${(match.stats.shotsOnTarget[1] / (match.stats.shotsOnTarget[0] + match.stats.shotsOnTarget[1] || 1)) * 100}%` }}></div>
                </div>
              </div>

              {/* Corners */}
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-neutral-400">
                  <span>{match.stats.corners[0]}</span>
                  <span className="uppercase tracking-wider text-[10px]">{t.corners}</span>
                  <span>{match.stats.corners[1]}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(match.stats.corners[0] / (match.stats.corners[0] + match.stats.corners[1] || 1)) * 100}%` }}></div>
                  <div className="bg-neutral-700 h-full transition-all" style={{ width: `${(match.stats.corners[1] / (match.stats.corners[0] + match.stats.corners[1] || 1)) * 100}%` }}></div>
                </div>
              </div>

              {/* Fouls */}
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-neutral-400">
                  <span>{match.stats.fouls[0]}</span>
                  <span className="uppercase tracking-wider text-[10px]">{t.fouls}</span>
                  <span>{match.stats.fouls[1]}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(match.stats.fouls[0] / (match.stats.fouls[0] + match.stats.fouls[1] || 1)) * 100}%` }}></div>
                  <div className="bg-neutral-700 h-full transition-all" style={{ width: `${(match.stats.fouls[1] / (match.stats.fouls[0] + match.stats.fouls[1] || 1)) * 100}%` }}></div>
                </div>
              </div>

            </div>
          )}

          {/* Sub Tab: Lineups */}
          {activeTab === "lineups" && (
            <div className="max-w-xl mx-auto py-2">
              {match.lineups ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  {match.lineups.map((lineup) => {
                    const isHome = lineup.teamId === match.homeTeam.id;
                    const teamName = isHome ? match.homeTeam.name : match.awayTeam.name;
                    return (
                      <div key={lineup.teamId} className="space-y-3">
                        <div className="flex items-center justify-between bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                          <span className="font-bold text-white">{teamName}</span>
                          <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase">{lineup.formation}</span>
                        </div>
                        <div className="space-y-1.5">
                          {lineup.starting.map((player) => (
                            <div key={player.id} className="flex items-center justify-between px-2 py-1 hover:bg-neutral-900 rounded transition-colors text-neutral-300">
                              <div className="flex items-center gap-2">
                                <span className="w-5 font-mono text-[10px] font-bold text-neutral-500 text-center">{player.number}</span>
                                <span>{player.name}</span>
                              </div>
                              <span className="text-[9px] text-neutral-500 uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-900">{player.position}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-neutral-500 font-mono">
                  Resta aguardar a liberação das escalações oficiais (geralmente 1h antes do pontapé inicial).
                </div>
              )}
            </div>
          )}

          {/* Sub Tab: H2H Records */}
          {activeTab === "h2h" && match.h2h && (
            <div className="max-w-xl mx-auto py-2 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                  <div className="text-2xl font-black text-emerald-400 font-mono">{match.h2h.homeWins}</div>
                  <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1">Vitórias {match.homeTeam.shortName}</div>
                </div>
                <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                  <div className="text-2xl font-black text-neutral-300 font-mono">{match.h2h.draws}</div>
                  <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1">Empates</div>
                </div>
                <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                  <div className="text-2xl font-black text-emerald-400 font-mono">{match.h2h.awayWins}</div>
                  <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1">Vitórias {match.awayTeam.shortName}</div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider px-2">Histórico de Confrontos</div>
                {match.h2h.previousMatches.map((prev, i) => (
                  <div key={i} className="flex items-center justify-between bg-neutral-900/20 px-3 py-2 rounded-xl border border-neutral-900">
                    <span className="font-mono text-[10px] text-neutral-500">{prev.date}</span>
                    <span className="font-semibold text-neutral-200">{prev.score}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{prev.winner}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub Tab: AI Tactical Report with Gemini */}
          {activeTab === "ai" && (
            <div className="max-w-xl mx-auto py-2">
              {loadingAi ? (
                <div className="py-8 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-3 font-mono">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.analyzing}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl text-xs text-neutral-300 leading-relaxed space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                      <Sparkles size={16} />
                      <span>{t.aiAnalysis}</span>
                    </div>
                    <p className="whitespace-pre-line">{aiReport}</p>
                  </div>

                  <div className="bg-neutral-900/50 border border-neutral-800 p-3.5 rounded-xl text-[10px] text-neutral-400 flex items-start gap-2">
                    <AlertTriangle className="text-neutral-500 shrink-0 mt-0.5" size={14} />
                    <p>
                      {t.aiOpinionDisclaimer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
