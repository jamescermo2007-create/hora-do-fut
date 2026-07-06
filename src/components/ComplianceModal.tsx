/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Mail, Shield, BookOpen, AlertTriangle, Info, MessageSquare } from "lucide-react";
import { TranslationDictionary } from "../translations";

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection: "about" | "contact" | "privacy" | "terms" | "cookies" | "disclaimer";
  t: TranslationDictionary;
}

export default function ComplianceModal({ isOpen, onClose, initialSection, t }: ComplianceModalProps) {
  const [activeTab, setActiveTab] = useState<typeof initialSection>(initialSection);

  if (!isOpen) return null;

  const tabs = [
    { id: "about", label: t.about, icon: Info },
    { id: "contact", label: t.contact, icon: Mail },
    { id: "privacy", label: t.privacy, icon: Shield },
    { id: "terms", label: t.terms, icon: BookOpen },
    { id: "cookies", label: t.cookies, icon: Info },
    { id: "disclaimer", label: t.disclaimer, icon: AlertTriangle },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-black tracking-wider text-xl">FUT<span className="text-white">IA</span></span>
            <span className="text-xs text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded font-mono">
              Compliance Core
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Side Menu */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/15"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Text Container */}
          <div className="flex-1 p-6 overflow-y-auto bg-neutral-950/40 text-neutral-300 space-y-6 text-sm leading-relaxed">
            
            {activeTab === "about" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Info className="text-emerald-400" /> Sobre a FutIA
                </h2>
                <p>
                  A <strong>FutIA</strong> é a plataforma de futebol definitiva de nova geração. Unimos a paixão nacional com o ápice da Inteligência Artificial para fornecer análises táticas precisas, busca inteligente com processamento de linguagem natural e simulações ao vivo em tempo real.
                </p>
                <p className="mt-3">
                  Nascida sob o conceito de que o esporte merece dados confiáveis de alta velocidade com insights profundos, nossa plataforma sintetiza em frações de segundos múltiplos lances e relatórios de jogo, transformando o torcedor comum em um verdadeiro estrategista.
                </p>
                <div className="mt-5 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-1.5 text-xs tracking-wider uppercase">Políticas Editoriais Inteligentes</h3>
                  <p className="text-xs text-neutral-400">
                    {t.legalAIPolicy}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Mail className="text-emerald-400" /> Contato Comercial & Suporte
                </h2>
                <p>
                  Deseja anunciar na FutIA ou sugerir novas parcerias comerciais? Nossa equipe está à disposição para criar conexões valiosas.
                </p>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center gap-3">
                    <Mail className="text-emerald-400" size={24} />
                    <div>
                      <div className="text-xs text-neutral-400">Anúncios & Parcerias</div>
                      <div className="text-sm font-semibold text-white">comercial@futia.com</div>
                    </div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center gap-3">
                    <MessageSquare className="text-emerald-400" size={24} />
                    <div>
                      <div className="text-xs text-neutral-400">Suporte Técnico</div>
                      <div className="text-sm font-semibold text-white">suporte@futia.com</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 border border-neutral-800 rounded-xl bg-neutral-950">
                  <div className="text-xs text-neutral-400 font-mono">Endereço Comercial</div>
                  <div className="text-sm font-medium text-white mt-1">Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP</div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="text-emerald-400" /> Política de Privacidade
                </h2>
                <p className="text-xs text-neutral-400 mb-4">Última atualização: 5 de Julho de 2026</p>
                <p>
                  Sua privacidade é extremamente importante para nós. Esta política descreve como tratamos informações de nossos torcedores e assinantes:
                </p>
                <h3 className="font-semibold text-white mt-4 mb-1.5">1. Coleta de Informações</h3>
                <p className="text-neutral-400 text-xs">
                  Coletamos informações básicas de uso, como cliques de favoritos, preferências de idioma e termos pesquisados no sistema de busca por IA para otimizar nossos modelos. Não comercializamos dados de usuários.
                </p>
                <h3 className="font-semibold text-white mt-4 mb-1.5">2. Segurança e IA</h3>
                <p className="text-neutral-400 text-xs">
                  Todas as interações efetuadas com nossa Inteligência Artificial são processadas em canais seguros e anônimos no servidor (Express API), sem exposição de dados pessoais ao provedor de IA.
                </p>
                <h3 className="font-semibold text-white mt-4 mb-1.5">3. Direitos</h3>
                <p className="text-neutral-400 text-xs">
                  Você pode solicitar a exclusão de seus favoritos e preferências a qualquer momento limpando o cache ou contatando nosso suporte.
                </p>
              </div>
            )}

            {activeTab === "terms" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="text-emerald-400" /> Termos de Uso
                </h2>
                <p className="text-xs text-neutral-400 mb-4">Última atualização: 5 de Julho de 2026</p>
                <p>
                  Ao acessar e utilizar o site FutIA, você concorda expressamente com as seguintes cláusulas contratuais:
                </p>
                <h3 className="font-semibold text-white mt-4 mb-1.5">1. Escopo de Conteúdo</h3>
                <p className="text-neutral-400 text-xs">
                  A FutIA fornece estatísticas, notícias esportivas e análises orientadas por dados. Não nos responsabilizamos por perdas ocorridas devido a atrasos de sinal ou conexões na transmissão ao vivo dos lances.
                </p>
                <h3 className="font-semibold text-white mt-4 mb-1.5">2. Propriedade Intelectual</h3>
                <p className="text-neutral-400 text-xs">
                  O design de FutIA, códigos internos, logomarcas e motores de simulação de futebol são propriedades exclusivas protegidas por leis de direitos autorais internacionais.
                </p>
              </div>
            )}

            {activeTab === "cookies" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Info className="text-emerald-400" /> Política de Cookies
                </h2>
                <p>
                  Utilizamos cookies locais essenciais e de terceiros (como Google AdSense) para guardar suas preferências estéticas:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-xs text-neutral-400">
                  <li><strong>Cookies de Preferência:</strong> Armazenam sua escolha de idioma (ex: Português, Inglês) e tema visual (Claro/Escuro).</li>
                  <li><strong>Cookies de Favoritos:</strong> Mantêm seus clubes e jogadores favoritos salvos localmente.</li>
                  <li><strong>Cookies de Publicidade:</strong> Fornecem anúncios relevantes integrados por canais de monetização.</li>
                </ul>
              </div>
            )}

            {activeTab === "disclaimer" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="text-emerald-400" /> Aviso Legal e Disclaimers
                </h2>
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-xs flex gap-3 items-start">
                  <AlertTriangle className="shrink-0 text-red-500 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-bold">AVISO IMPORTANTE DE CONTEÚDO DE IA</h4>
                    <p className="mt-1 leading-relaxed">
                      Todas as análises táticas, previsões, avaliações, resumos editoriais e respostas de bate-papo em nosso portal são geradas utilizando algoritmos matemáticos e modelos de Inteligência Artificial generativa. <strong>Eles não constituem aconselhamento profissional de investimentos ou palpites garantidos de apostas esportivas.</strong>
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-neutral-400">
                  {t.disclaimerText}
                </p>
                <p className="mt-3 text-xs text-neutral-400">
                  O futebol é inerentemente dinâmico e imprevisto. Os dados e probabilidades fornecidos por nossos robôs devem ser consumidos estritamente para entretenimento e estudos táticos.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900 text-center text-xs text-neutral-500">
          © 2026 FutIA. {t.allRightsReserved}
        </div>

      </div>
    </div>
  );
}
