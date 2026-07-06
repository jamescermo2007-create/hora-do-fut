/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search, Globe, Sun, Moon, Clock, Flame, Star, Sparkles, X } from "lucide-react";
import { LanguageCode, TRANSLATIONS } from "../translations";

interface HeaderProps {
  currentLang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSearchSelect: (type: string, id: string) => void;
  favorites: { type: "team" | "player"; id: string; name: string }[];
  onOpenCompliance: (section: "about" | "contact" | "privacy" | "terms" | "cookies" | "disclaimer") => void;
}

export default function Header({
  currentLang,
  onLangChange,
  isDarkMode,
  onToggleTheme,
  onSearchSelect,
  favorites,
  onOpenCompliance
}: HeaderProps) {
  const t = TRANSLATIONS[currentLang];
  
  // Real-time Clock
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString(currentLang === "ar" ? "ar-SA" : "pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  // Search Logic
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [aiSearchSummary, setAiSearchSummary] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (!query.trim()) {
      setSearchResults([]);
      setAiSearchSummary("");
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSearchResults(data.results || []);
        setAiSearchSummary(data.aiSummary || "");
      } catch (err) {
        console.error("Search query error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleResultClick = (type: string, id: string) => {
    onSearchSelect(type, id);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 border-b border-white/10 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand Logo & Slogan */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 font-display">
            <div className="bg-emerald-600 text-white font-black px-3 py-1.5 rounded-xl text-lg tracking-tight flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 hover:bg-emerald-500 transition-colors cursor-pointer">
              <Flame size={20} className="animate-pulse text-emerald-300" />
              <span>FUT<span className="text-emerald-300">IA</span></span>
            </div>
            <div className="hidden lg:block text-slate-400 text-xs font-medium border-l border-white/10 pl-3">
              {t.tagline}
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onToggleTheme}
              className="text-slate-400 hover:text-white bg-slate-900/50 border border-white/10 p-2 rounded-xl backdrop-blur-sm transition-colors"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="flex items-center gap-1.5 text-[11px] font-mono bg-slate-900/50 border border-white/10 px-2.5 py-1.5 rounded-xl text-emerald-400 backdrop-blur-sm">
              <Clock size={12} />
              <span>{timeStr}</span>
            </div>
          </div>
        </div>

        {/* Global Smart Search Bar */}
        <div className="flex-1 max-w-xl relative mx-0 md:mx-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => { if (searchQuery) setShowDropdown(true); }}
              className="w-full bg-slate-900/50 border border-white/10 focus:border-emerald-500/50 hover:border-white/20 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setSearchResults([]); setAiSearchSummary(""); setShowDropdown(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Dropdown Panel */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl p-4 max-h-[420px] overflow-y-auto z-50 text-xs backdrop-blur-md">
              {isSearching ? (
                <div className="py-6 text-center text-slate-400 flex items-center justify-center gap-2 font-mono">
                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.analyzing}</span>
                </div>
              ) : (
                <>
                  {/* AI Grounded Search Answer */}
                  {aiSearchSummary && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl mb-4 text-neutral-300">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1.5">
                        <Sparkles size={14} />
                        <span>{t.aiSearchLabel}</span>
                      </div>
                      <p className="leading-relaxed">{aiSearchSummary}</p>
                    </div>
                  )}

                  {/* Results List */}
                  {searchResults.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 mb-1 font-mono">
                        Resultados encontrados
                      </div>
                      {searchResults.map((result, i) => (
                        <button
                          key={i}
                          onClick={() => handleResultClick(result.type, result.id)}
                          className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={result.logo}
                              alt={result.name}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded bg-slate-800 object-cover"
                            />
                            <div>
                              <div className="font-semibold text-slate-200 group-hover:text-white">
                                {result.name}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                                {result.subtitle}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 bg-slate-900 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 px-2 py-0.5 rounded transition-all uppercase font-mono border border-transparent group-hover:border-emerald-500/20">
                            Ver
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    searchQuery && !isSearching && (
                      <div className="py-6 text-center text-neutral-500">
                        {t.noResults}
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Desktop Controls & Language */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Dynamic clock */}
          <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-900/50 border border-white/10 px-3 py-2 rounded-xl text-emerald-400 backdrop-blur-sm">
            <Clock size={13} />
            <span>{timeStr}</span>
          </div>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="text-slate-400 hover:text-white bg-slate-900/50 border border-white/10 hover:border-white/20 p-2.5 rounded-xl transition-all cursor-pointer backdrop-blur-sm"
            title="Mudar Tema"
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Language selector */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/50 border border-white/10 hover:border-white/20 px-3 py-2 rounded-xl transition-all cursor-pointer backdrop-blur-sm">
              <Globe size={14} className="text-slate-400" />
              <span className="uppercase">{currentLang}</span>
            </button>
            <div className="absolute right-0 mt-2 w-36 bg-slate-950/95 border border-white/10 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50 backdrop-blur-md">
              <div className="grid grid-cols-1 gap-1 text-xs">
                {(["pt", "en", "es", "fr", "de", "it", "ar", "ja", "ko", "zh"] as LanguageCode[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLangChange(lang)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                      currentLang === lang ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {lang === "pt" && "Português"}
                    {lang === "en" && "English"}
                    {lang === "es" && "Español"}
                    {lang === "fr" && "Français"}
                    {lang === "de" && "Deutsch"}
                    {lang === "it" && "Italiano"}
                    {lang === "ar" && "العربية (RTL)"}
                    {lang === "ja" && "日本語"}
                    {lang === "ko" && "한국어"}
                    {lang === "zh" && "简体中文"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Favorites quick links */}
          {favorites.length > 0 && (
            <div className="relative group">
              <button className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/5 border border-yellow-500/10 px-3 py-2 rounded-xl cursor-pointer">
                <Star size={13} fill="currentColor" />
                <span>{favorites.length}</span>
              </button>
              <div className="absolute right-0 mt-2 w-52 bg-slate-950/95 border border-white/10 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50 backdrop-blur-md">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 py-1 mb-1 font-mono">
                  Favoritos fixados
                </div>
                <div className="space-y-1">
                  {favorites.map((fav) => (
                    <button
                      key={fav.id}
                      onClick={() => onSearchSelect(fav.type, fav.id)}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-white/5 rounded-lg text-[11px] text-slate-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="truncate max-w-[140px]">{fav.name}</span>
                      <span className="text-[9px] text-slate-500 capitalize bg-slate-900 px-1.5 py-0.5 rounded font-mono border border-white/5">
                        {fav.type === "team" ? "Time" : "Atleta"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
