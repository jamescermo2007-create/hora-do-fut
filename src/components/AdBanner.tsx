/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles } from "lucide-react";
import { TranslationDictionary } from "../translations";

interface AdBannerProps {
  t: TranslationDictionary;
  type?: "horizontal" | "box" | "sidebar";
}

export default function AdBanner({ t, type = "horizontal" }: AdBannerProps) {
  if (type === "box") {
    return (
      <div className="w-full bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col justify-between h-[250px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 bg-slate-800 text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-bl-lg tracking-wider">
          {t.adBannerLabel.toUpperCase()}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1">
          <Sparkles size={12} className="text-emerald-500" />
          <span>FutIA Ads Core v2.6</span>
        </div>
        <div className="my-auto text-center px-2">
          <div className="text-slate-300 font-medium text-sm group-hover:text-emerald-400 transition-colors">
            Chute Premiado FutIA
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Acompanhe análises inteligentes em tempo real e concorra a mantos oficiais toda semana!
          </p>
        </div>
        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-lg transition-all duration-200 cursor-pointer">
          Inscrever-se Grátis
        </button>
      </div>
    );
  }

  if (type === "sidebar") {
    return (
      <div className="w-full bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-center py-8 relative">
        <div className="absolute top-0 right-0 bg-slate-800 text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-bl-lg tracking-wider">
          {t.adBannerLabel.toUpperCase()}
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
          <Sparkles className="text-emerald-400" size={24} />
        </div>
        <div className="text-sm font-semibold text-white">Anuncie na FutIA</div>
        <p className="text-xs text-slate-400 mt-2 max-w-[180px] leading-relaxed">
          Alcance mais de 5 milhões de torcedores aficionados por futebol e IA todo mês.
        </p>
        <button className="mt-4 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
          Contato Comercial
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-slate-800 text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-bl-lg tracking-wider">
        {t.adBannerLabel.toUpperCase()}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex w-10 h-10 rounded-lg bg-emerald-500/10 items-center justify-center text-emerald-400">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-200">
            Manto Sagrado Inteligente
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Vista a tecnologia. Camisetas exclusivas FutIA dry-fit com micro-sensores cardíacos integrados.
          </p>
        </div>
      </div>
      <button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer whitespace-nowrap">
        Garantir Manto
      </button>
    </div>
  );
}
