/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Table, Trophy, ShieldAlert, Sparkles, TrendingUp, Users } from "lucide-react";
import { LeagueStandings, Competition } from "../types";
import { TranslationDictionary } from "../translations";

interface LeagueStandingsTabProps {
  t: TranslationDictionary;
  competitions: Competition[];
  onSelectTeam: (teamId: string) => void;
}

export default function LeagueStandingsTab({
  t,
  competitions,
  onSelectTeam
}: LeagueStandingsTabProps) {
  const [selectedCompId, setSelectedCompId] = useState("pl");
  const [standings, setStandings] = useState<LeagueStandings | null>(null);
  const [liveScorers, setLiveScorers] = useState<{ name: string; team: string; goals: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStatSubTab, setActiveStatSubTab] = useState<"table" | "scorers" | "assists" | "cleansheets">("table");

  useEffect(() => {
    const fetchStandingsAndScorers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/competitions/${selectedCompId}/standings`);
        const data = await response.json();
        setStandings(data);

        // Fetch dynamic top scorers
        try {
          const scorersResponse = await fetch(`/api/competitions/${selectedCompId}/scorers`);
          const scorersData = await scorersResponse.json();
          if (scorersData && scorersData.scorers && scorersData.scorers.length > 0) {
            setLiveScorers(scorersData.scorers);
          } else {
            setLiveScorers([]);
          }
        } catch (scErr) {
          console.warn("Could not load live scorers, falling back to simulated:", scErr);
          setLiveScorers([]);
        }
      } catch (err) {
        console.error("Error loading standings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStandingsAndScorers();
  }, [selectedCompId]);

  // Pre-seeded statistics records
  const topStats: Record<string, {
    scorers: { name: string; team: string; goals: number }[];
    assists: { name: string; team: string; assists: number }[];
    cleansheets: { name: string; team: string; sheets: number }[];
  }> = {
    pl: {
      scorers: [
        { name: "Erling Haaland", team: "Manchester City", goals: 38 },
        { name: "Cole Palmer", team: "Chelsea FC", goals: 22 },
        { name: "Bukayo Saka", team: "Arsenal", goals: 18 },
      ],
      assists: [
        { name: "Kevin De Bruyne", team: "Manchester City", assists: 18 },
        { name: "Mohamed Salah", team: "Liverpool FC", assists: 14 },
        { name: "Martin Odegaard", team: "Arsenal", assists: 13 },
      ],
      cleansheets: [
        { name: "David Raya", team: "Arsenal", sheets: 16 },
        { name: "Ederson", team: "Manchester City", sheets: 13 },
        { name: "Alisson", team: "Liverpool FC", sheets: 12 },
      ]
    },
    laliga: {
      scorers: [
        { name: "Robert Lewandowski", team: "FC Barcelona", goals: 21 },
        { name: "Kylian Mbappé", team: "Real Madrid CF", goals: 19 },
        { name: "Jude Bellingham", team: "Real Madrid CF", goals: 19 },
      ],
      assists: [
        { name: "Lamine Yamal", team: "FC Barcelona", assists: 14 },
        { name: "Alex Baena", team: "Villarreal CF", assists: 13 },
        { name: "Nico Williams", team: "Athletic Club", assists: 12 },
      ],
      cleansheets: [
        { name: "Marc-André ter Stegen", team: "FC Barcelona", sheets: 15 },
        { name: "Thibaut Courtois", team: "Real Madrid CF", sheets: 14 },
        { name: "Jan Oblak", team: "Atlético de Madrid", sheets: 12 },
      ]
    },
    brasileirao: {
      scorers: [
        { name: "Pedro", team: "CR Flamengo", goals: 31 },
        { name: "Hulk", team: "Atlético Mineiro", goals: 19 },
        { name: "Raphael Veiga", team: "SE Palmeiras", goals: 16 },
      ],
      assists: [
        { name: "Giorgian de Arrascaeta", team: "CR Flamengo", assists: 16 },
        { name: "Alan Patrick", team: "Internacional", assists: 11 },
        { name: "Estêvão Willian", team: "SE Palmeiras", assists: 10 },
      ],
      cleansheets: [
        { name: "Weverton", team: "SE Palmeiras", sheets: 19 },
        { name: "Rossi", team: "CR Flamengo", sheets: 17 },
        { name: "John", team: "Botafogo FR", sheets: 14 },
      ]
    }
  };

  const activeStats = topStats[selectedCompId] || topStats["pl"];
  const activeScorers = liveScorers.length > 0 ? liveScorers : activeStats.scorers;

  return (
    <div className="space-y-4">
      
      {/* Competition Picker */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10">
        {competitions.map((comp) => {
          const isSelected = selectedCompId === comp.id;
          return (
            <button
              key={comp.id}
              onClick={() => setSelectedCompId(comp.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                  : "bg-slate-900/40 border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <img
                src={comp.logo}
                alt={comp.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded object-cover"
              />
              <span>{comp.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub tabs: Classification vs Player stats */}
      <div className="flex items-center gap-1 bg-slate-900/50 border border-white/10 p-1 rounded-xl w-fit text-xs backdrop-blur-sm">
        {[
          { id: "table", label: t.leagueTable, icon: Table },
          { id: "scorers", label: t.topScorers, icon: Trophy },
          { id: "assists", label: t.topAssists, icon: Users },
          { id: "cleansheets", label: t.cleanSheets, icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStatSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStatSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon size={12} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Primary Standings Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-3 font-mono">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>{t.loading}</span>
        </div>
      ) : activeStatSubTab === "table" ? (
        <div className="bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs text-left">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider border-b border-white/5">
                  <th className="py-3 px-4 w-12 text-center">{t.pos}</th>
                  <th className="py-3 px-4">{t.team}</th>
                  <th className="py-3 px-3 text-center w-12">{t.played}</th>
                  <th className="py-3 px-3 text-center w-10">{t.wins}</th>
                  <th className="py-3 px-3 text-center w-10">{t.draws}</th>
                  <th className="py-3 px-3 text-center w-10">{t.losses}</th>
                  <th className="py-3 px-4 text-center w-20">{t.goals}</th>
                  <th className="py-3 px-4 text-center w-16">{t.points}</th>
                  <th className="py-3 px-4 text-center w-24 hidden sm:table-cell">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {standings && standings.rows && standings.rows.length > 0 ? (
                  standings.rows.map((row) => (
                    <tr key={row.teamId} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3.5 px-4 font-bold font-mono text-center text-slate-400 group-hover:text-white">
                        {row.position}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={row.teamLogo}
                            alt={row.teamName}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-lg bg-slate-850 object-cover shrink-0"
                          />
                          <button
                            onClick={() => onSelectTeam(row.teamId)}
                            className="font-bold text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer text-left"
                          >
                            {row.teamName}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-medium text-center text-slate-300">
                        {row.played}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-center text-slate-400">
                        {row.won}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-center text-slate-400">
                        {row.drawn}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-center text-slate-400">
                        {row.lost}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center text-slate-500">
                        {row.goalsFor}:{row.goalsAgainst}
                      </td>
                      <td className="py-3.5 px-4 font-black font-mono text-center text-white text-sm bg-slate-900/10 group-hover:bg-slate-900/20">
                        {row.points}
                      </td>
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {row.form.map((f, idx) => {
                            const isWin = f === "W" || f === "V";
                            const isDraw = f === "D" || f === "E";
                            return (
                              <span
                                key={idx}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black font-mono shrink-0 shadow-sm ${
                                  isWin
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : isDraw
                                    ? "bg-slate-800 text-slate-400 border border-white/5"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                              >
                                {f}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-neutral-500 font-mono">
                      Aguardando início dos confrontos para esta temporada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* scorers / assists / cleansheets Lists */
        <div className="bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-3 shadow-xl max-w-xl">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono px-1 flex items-center gap-1.5">
            <Sparkles size={12} className="text-emerald-400" />
            <span>FutIA Premium Statistics Registry</span>
          </div>

          <div className="space-y-1.5">
            {activeStatSubTab === "scorers" &&
              activeScorers.map((sc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/30 hover:bg-white/5 rounded-xl border border-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-500 text-center w-5">#{i+1}</span>
                    <div>
                      <div className="font-bold text-slate-200">{sc.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{sc.team}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold font-mono px-3 py-1 rounded-lg">
                    <span>{sc.goals}</span>
                    <span className="text-[10px] uppercase font-normal text-slate-400">gols</span>
                  </div>
                </div>
              ))}

            {activeStatSubTab === "assists" &&
              activeStats.assists.map((sc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/30 hover:bg-white/5 rounded-xl border border-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-500 text-center w-5">#{i+1}</span>
                    <div>
                      <div className="font-bold text-slate-200">{sc.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{sc.team}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold font-mono px-3 py-1 rounded-lg">
                    <span>{sc.assists}</span>
                    <span className="text-[10px] uppercase font-normal text-slate-400">assists</span>
                  </div>
                </div>
              ))}

            {activeStatSubTab === "cleansheets" &&
              activeStats.cleansheets.map((sc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/30 hover:bg-white/5 rounded-xl border border-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-500 text-center w-5">#{i+1}</span>
                    <div>
                      <div className="font-bold text-slate-200">{sc.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{sc.team}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold font-mono px-3 py-1 rounded-lg">
                    <span>{sc.sheets}</span>
                    <span className="text-[10px] uppercase font-normal text-slate-400">jogos</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
}
