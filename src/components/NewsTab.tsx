/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, ArrowUpRight, ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import { News } from "../types";
import { TranslationDictionary } from "../translations";

interface NewsTabProps {
  t: TranslationDictionary;
}

export default function NewsTab({ t }: NewsTabProps) {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        setNewsList(data || []);
      } catch (err) {
        console.error("Error loading news database:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (selectedNews) {
    return (
      <div className="space-y-4 max-w-3xl animate-in fade-in duration-300">
        
        {/* Back navigation */}
        <button
          onClick={() => setSelectedNews(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/50 px-3 py-1.5 rounded-xl border border-white/10 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft size={14} />
          <span>Voltar para as notícias</span>
        </button>

        {/* Detailed Article Cover */}
        <div className="bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-[250px] sm:h-[380px] w-full relative">
            <img
              src={selectedNews.imageUrl}
              alt={selectedNews.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            
            {/* Category badge */}
            <span className="absolute top-4 left-4 bg-emerald-600 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
              {selectedNews.category}
            </span>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
                {selectedNews.title}
              </h1>
              
              <div className="flex items-center gap-4 text-neutral-400 text-[10px] font-mono mt-3">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{selectedNews.date}</span>
                </div>
                <div className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/15 rounded">
                  {selectedNews.source}
                </div>
              </div>
            </div>
          </div>

          {/* Article Text Content */}
          <div className="p-5 sm:p-7 space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
            
            {/* AI Summary Badge */}
            <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-2xl flex gap-3 items-start">
              <Sparkles className="text-emerald-400 shrink-0 mt-0.5" size={18} />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono block">
                  Resumo Jornalístico por IA
                </span>
                <p className="mt-1 font-medium text-neutral-300">
                  {selectedNews.summary}
                </p>
              </div>
            </div>

            {/* Article body */}
            <p className="whitespace-pre-line text-neutral-300">
              {selectedNews.content}
            </p>

            {/* External Citation Link */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
              <span className="text-slate-500">
                {t.newsAttribution}: <strong className="text-slate-400">{selectedNews.source}</strong>
              </span>
              <a
                href={selectedNews.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/5 px-3.5 py-2 border border-emerald-500/10 rounded-xl transition-all"
              >
                <span>Ler Matéria Original</span>
                <ExternalLink size={12} />
              </a>
            </div>

          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Tab intro */}
      <div className="flex items-center gap-2 px-1 text-[10px] text-neutral-500 font-bold uppercase tracking-wider font-mono">
        <Sparkles size={12} className="text-emerald-400 animate-pulse" />
        <span>Radar de Notícias da Imprensa Internacional</span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-3 font-mono">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>{t.loading}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {newsList.map((news) => (
            <div
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="h-44 w-full relative overflow-hidden shrink-0">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-slate-950/80 text-emerald-400 text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded border border-white/10">
                  {news.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-slate-950 text-[8px] text-slate-400 font-bold font-mono px-2 py-0.5 rounded border border-white/10">
                  {news.date}
                </span>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-200 group-hover:text-emerald-400 transition-colors leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                  <span className="font-semibold text-slate-400">{news.source}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <span>Ler Mais</span>
                    <ChevronRight size={12} />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
