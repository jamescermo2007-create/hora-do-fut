/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ArrowRight, HelpCircle, ShieldAlert, Sparkles, UserMinus } from "lucide-react";
import { Transfer, Player } from "../types";
import { TranslationDictionary } from "../translations";

interface MarketTabProps {
  t: TranslationDictionary;
  onSelectPlayer: (playerId: string) => void;
}

export default function MarketTab({ t, onSelectPlayer }: MarketTabProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [marketSubTab, setMarketSubTab] = useState<"transfers" | "valuations" | "injuries">("transfers");

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        const transRes = await fetch("/api/market/transfers");
        const transData = await transRes.json();
        setTransfers(transData || []);

        const playersRes = await fetch("/api/players");
        const playersData = await playersRes.json();
        setPlayers(playersData || []);
      } catch (err) {
        console.error("Error fetching market statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  const playersWithInjuries = players.filter((p) => p.injuries);

  return (
    <div className="space-y-4">
      
      {/* Sub tabs selectors */}
      <div className="flex items-center gap-1 bg-slate-900/50 border border-white/10 p-1 rounded-xl w-fit text-xs backdrop-blur-sm">
        {[
          { id: "transfers", label: t.transfersTitle },
          { id: "valuations", label: t.marketValue },
          { id: "injuries", label: t.injuriesTitle },
        ].map((tab) => {
          const isActive = marketSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMarketSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-bold tracking-wider uppercase transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-3 font-mono">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>{t.loading}</span>
        </div>
      ) : (
        <div className="max-w-3xl">
          
          {/* Sub Tab: Live Transfers */}
          {marketSubTab === "transfers" && (
            <div className="space-y-3">
              {transfers.map((tr) => (
                <div
                  key={tr.id}
                  className="bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md hover:border-white/20 transition-colors"
                >
                  {/* Player & Club Origin */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={tr.playerPhoto}
                      alt={tr.playerName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl bg-slate-800 object-cover border border-white/5"
                    />
                    <div>
                      <div className="font-bold text-slate-200">{tr.playerName}</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">{tr.date}</div>
                    </div>
                  </div>

                  {/* Club Transfer Flow */}
                  <div className="flex items-center gap-2.5 bg-slate-900/30 px-3 py-2 rounded-xl border border-white/5 max-w-fit">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={tr.fromTeamLogo}
                        alt={tr.fromTeamName}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full bg-slate-800 object-cover"
                      />
                      <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[90px]">{tr.fromTeamName}</span>
                    </div>
                    <ArrowRight size={13} className="text-slate-600" />
                    <div className="flex items-center gap-1.5">
                      <img
                        src={tr.toTeamLogo}
                        alt={tr.toTeamName}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full bg-slate-800 object-cover"
                      />
                      <span className="text-[11px] font-bold text-slate-200 truncate max-w-[90px]">{tr.toTeamName}</span>
                    </div>
                  </div>

                  {/* Transfer Status & Fee */}
                  <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-white/5 pt-3.5 sm:pt-0">
                    <span className="text-sm font-black font-mono text-emerald-400">{tr.fee}</span>
                    <span
                      className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                        tr.status === "Confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {tr.status === "Confirmed" ? "Confirmado" : "Rumor"}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Sub Tab: Player Valuations */}
          {marketSubTab === "valuations" && (
            <div className="bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-3 bg-slate-900/40 border-b border-white/5 flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                <Sparkles size={12} className="text-emerald-400" />
                <span>Líderes mundiais em valorização de ativos</span>
              </div>
              <div className="divide-y divide-white/5">
                {players
                  .slice()
                  .sort((a, b) => {
                    const valA = parseFloat(a.marketValue.replace(/[^0-9.]/g, ""));
                    const valB = parseFloat(b.marketValue.replace(/[^0-9.]/g, ""));
                    return valB - valA;
                  })
                  .map((pl, idx) => (
                    <div
                      key={pl.id}
                      onClick={() => onSelectPlayer(pl.id)}
                      className="p-4 hover:bg-white/5 flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-500 w-5">#{idx + 1}</span>
                        <img
                          src={pl.photo}
                          alt={pl.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-xl bg-slate-850 object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                            {pl.name}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 font-medium">
                            {pl.position} · {pl.currentTeamName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black font-mono text-white">{pl.marketValue}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{pl.nationality}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Sub Tab: Injuries Medical Report */}
          {marketSubTab === "injuries" && (
            <div className="space-y-3">
              {playersWithInjuries.length > 0 ? (
                playersWithInjuries.map((pl) => (
                  <div
                    key={pl.id}
                    className="bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-start gap-3 shadow-md"
                  >
                    <div className="bg-red-500/10 p-2.5 border border-red-500/20 text-red-400 rounded-xl">
                      <ShieldAlert size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-200">{pl.name}</span>
                        <span className="text-[10px] text-red-400 bg-red-500/15 border border-red-500/20 px-2 py-0.5 rounded-full font-bold font-mono">
                          {pl.injuries?.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-1">
                        {pl.currentTeamName}
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] leading-relaxed">
                        <div className="bg-slate-900/40 p-2 rounded-lg border border-white/5">
                          <span className="text-slate-500 font-medium block">Diagnóstico:</span>
                          <span className="text-slate-300 font-semibold mt-0.5 block">{pl.injuries?.type}</span>
                        </div>
                        <div className="bg-slate-900/40 p-2 rounded-lg border border-white/5">
                          <span className="text-slate-500 font-medium block">Previsão de Retorno:</span>
                          <span className="text-emerald-400 font-bold mt-0.5 block">{pl.injuries?.expectedReturn}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-slate-500 bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-2xl font-mono">
                  Nenhuma lesão ativa registrada nos elencos das principais ligas.
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
