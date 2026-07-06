/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Star, MessageSquare, AlertCircle, HelpCircle, ExternalLink, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";
import { TranslationDictionary } from "../translations";

interface AIScoutChatTabProps {
  t: TranslationDictionary;
  currentLang: string;
}

export default function AIScoutChatTab({ t, currentLang }: AIScoutChatTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested Prompts
  const suggestions = [
    { pt: "Como Carlo Ancelotti monta taticamente o Real Madrid?", en: "How does Carlo Ancelotti tactically organize Real Madrid?" },
    { pt: "Quem é Erling Haaland e quais são suas estatísticas?", en: "Who is Erling Haaland and what are his statistics?" },
    { pt: "Quais são as principais contratações do mercado de transferências?", en: "What are the key transfers in the market right now?" },
    { pt: "Qual a diferença de estilo entre o Palmeiras e o Flamengo?", en: "What is the style difference between Palmeiras and Flamengo?" }
  ];

  // Initialize with greeting
  useEffect(() => {
    setMessages([
      {
        id: "greet-1",
        sender: "ai",
        text: t.chatGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, [t]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chatHistoryPayload = [...messages, userMsg].map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistoryPayload })
      });

      const data = await response.json();

      let replyText = data.text || "Peço desculpas, não consegui obter resposta tática agora. Tente em instantes!";
      
      // Append sources if present
      if (data.sources && data.sources.length > 0) {
        replyText += "\n\n**Fontes consultadas na Web:**\n" + data.sources.map((s: any) => `· [${s.title}](${s.uri})`).join("\n");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "Ocorreu um erro ao processar seu lance mental no servidor. Verifique sua conexão com o servidor FutIA.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `greet-${Date.now()}`,
        sender: "ai",
        text: t.chatGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  // Helper to parse markdown-like bold and links in AI responses
  const renderFormattedText = (rawText: string) => {
    // Basic regex replacement for **bold** and [title](url)
    const lines = rawText.split("\n");
    return lines.map((line, lIdx) => {
      let parts: React.ReactNode[] = [line];

      // Parse bold
      if (line.includes("**")) {
        const regexBold = /\*\*(.*?)\*\*/g;
        let match;
        const tempParts: React.ReactNode[] = [];
        let lastIndex = 0;
        while ((match = regexBold.exec(line)) !== null) {
          const textBefore = line.slice(lastIndex, match.index);
          const boldText = match[1];
          if (textBefore) tempParts.push(textBefore);
          tempParts.push(<strong key={match.index} className="text-white font-extrabold">{boldText}</strong>);
          lastIndex = regexBold.lastIndex;
        }
        if (lastIndex < line.length) {
          tempParts.push(line.slice(lastIndex));
        }
        parts = tempParts;
      }

      // Parse markdown links
      parts = parts.map((part, pIdx) => {
        if (typeof part !== "string") return part;
        if (part.includes("[") && part.includes("](")) {
          const regexLink = /\[(.*?)\]\((.*?)\)/g;
          let match;
          const tempParts: React.ReactNode[] = [];
          let lastIndex = 0;
          while ((match = regexLink.exec(part)) !== null) {
            const textBefore = part.slice(lastIndex, match.index);
            const linkText = match[1];
            const linkUrl = match[2];
            if (textBefore) tempParts.push(textBefore);
            tempParts.push(
              <a
                key={match.index}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-0.5 underline px-0.5"
              >
                <span>{linkText}</span>
                <ExternalLink size={10} className="inline" />
              </a>
            );
            lastIndex = regexLink.lastIndex;
          }
          if (lastIndex < part.length) {
            tempParts.push(part.slice(lastIndex));
          }
          return <span key={pIdx}>{tempParts}</span>;
        }
        return part;
      });

      return <p key={lIdx} className={line.startsWith("· ") ? "pl-3 text-neutral-300 font-mono text-[11px] mt-1.5" : "mt-1.5 first:mt-0 leading-relaxed"}>{parts}</p>;
    });
  };

  const isRtl = currentLang === "ar";

  return (
    <div className="w-full max-w-4xl bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-3xl h-[65vh] flex flex-col overflow-hidden shadow-2xl" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Top chat head */}
      <div className="p-4 bg-slate-900/50 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>{t.aiChat}</span>
              <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                Gemini Active
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Táticas, estatísticas e históricos em tempo real</div>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-905 border border-white/10 p-2 rounded-xl transition-all cursor-pointer"
          title="Reiniciar Chat"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs shrink-0 font-black">
                  IA
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                isUser
                  ? "bg-emerald-600 text-white font-semibold rounded-tr-none shadow-md"
                  : "bg-slate-900/50 text-slate-300 rounded-tl-none border border-white/5 shadow-inner"
              }`}>
                {isUser ? <p className="leading-relaxed whitespace-pre-line">{m.text}</p> : renderFormattedText(m.text)}
                <span className={`text-[9px] mt-1.5 block text-right font-mono ${isUser ? "text-slate-800" : "text-slate-500"}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs shrink-0 font-black">
              IA
            </div>
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
              <span className="ml-1.5">Sondando dados de futebol...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts helper (when messages is small or empty) */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t border-white/10 bg-slate-950/60 overflow-x-auto shrink-0 flex items-center gap-1.5 scrollbar-none">
          {suggestions.map((sug, i) => {
            const label = currentLang === "pt" ? sug.pt : sug.en;
            return (
              <button
                key={i}
                onClick={() => handleSendMessage(label)}
                className="text-[10px] bg-slate-900/40 hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white font-semibold py-1.5 px-3 rounded-lg whitespace-nowrap transition-all cursor-pointer"
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Input panel & legal disclosure */}
      <div className="p-3 border-t border-white/10 bg-slate-900/40 shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={t.chatPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-950 border border-white/10 focus:border-emerald-500/50 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={15} />
          </button>
        </form>

        <div className="mt-2.5 flex items-center gap-1 px-1 text-[9px] text-neutral-500 font-medium">
          <AlertCircle size={10} className="shrink-0 text-neutral-500" />
          <span>
            {t.aiOpinionDisclaimer}
          </span>
        </div>
      </div>

    </div>
  );
}
