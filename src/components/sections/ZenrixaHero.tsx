import React, { useState, useEffect } from 'react';
import { ZoomReveal } from '../common/ZoomReveal';
import { ArrowUpRight, Code2, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { openWhatsApp } from '../../utils/contactUtils';

interface ZenrixaHeroProps {
  isActive?: boolean;
  onContactClick: () => void;
  onNavigate: (sectionIndex: number) => void;
}

export const ZenrixaHero: React.FC<ZenrixaHeroProps> = ({
  isActive = true,
  onContactClick,
  onNavigate,
}) => {
  const [timeStr, setTimeStr] = useState('');

  // Local Time Clock for Header
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-full min-h-[100dvh] bg-transparent text-[#F3F5F7] flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16 pt-4 sm:pt-6 pb-4 sm:pb-6 select-none">
      
      {/* 1. TOP NAVIGATION BAR */}
      <ZoomReveal delay={0.05} className="w-full flex items-center justify-between z-30 relative">
        {/* Brand Logo & Professional Name */}
        <div className="flex items-center gap-3">
          <img
            src="/logo tca.png"
            alt="Thiago Cassol Antunes Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_12px_rgba(0,210,246,0.35)]"
          />
          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-white leading-none">
              THIAGO CASSOL ANTUNES
            </h2>
            <p className="text-[10px] font-mono text-[#00D2F6] tracking-widest mt-0.5 font-medium">
              ARQUITETURA DE SOFTWARE &amp; WEB
            </p>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider text-[#AEB7C4]">
          <button
            onClick={() => onNavigate(0)}
            className="text-white hover:text-[#00D2F6] transition-colors cursor-pointer"
          >
            Início
          </button>
          <button
            onClick={() => onNavigate(1)}
            className="hover:text-[#00D2F6] transition-colors cursor-pointer"
          >
            Manifesto
          </button>
          <button
            onClick={() => onNavigate(2)}
            className="hover:text-[#00D2F6] transition-colors cursor-pointer"
          >
            Simulador
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="hover:text-[#00D2F6] transition-colors cursor-pointer"
          >
            Projetos
          </button>
          <button
            onClick={() => onNavigate(4)}
            className="hover:text-[#00D2F6] transition-colors cursor-pointer"
          >
            Capacidades
          </button>
          <button
            onClick={() => onNavigate(5)}
            className="hover:text-[#00D2F6] transition-colors cursor-pointer"
          >
            Metodologia
          </button>
          <button
            onClick={() => onNavigate(6)}
            className="hover:text-[#00D2F6] transition-colors cursor-pointer"
          >
            Sobre
          </button>
        </nav>

        {/* Right Status Pill & CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#060B18]/85 border border-white/10 text-[11px] font-mono text-[#AEB7C4] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{timeStr || '15:30'} • Caxias do Sul / RS</span>
          </div>

          <button
            onClick={onContactClick}
            className="px-4 sm:px-5 py-2 rounded-full bg-[#00D2F6] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#38bdf8] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,210,246,0.35)] cursor-pointer"
          >
            <span>FALE COMIGO</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </ZoomReveal>

      {/* 2. MAIN HERO CONTENT COMPOSITION */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto z-20 relative pointer-events-none">
        
        {/* LEFT COLUMN: Headline, Positioning & Dual CTAs */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left pointer-events-auto">
          {/* Eyebrow Label */}
          <ZoomReveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#060B18]/90 border border-[#00D2F6]/30 mb-3.5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-widest text-[#00D2F6]">
                ENGENHARIA FULL-STACK &amp; AUTOMAÇÃO
              </span>
            </div>
          </ZoomReveal>

          {/* Monumental Clean Headline */}
          <ZoomReveal delay={0.2} className="mb-3.5">
            <h1 className="font-black tracking-tight text-white leading-[1.08] text-2xl sm:text-3xl md:text-4xl lg:text-[44px]">
              Engenharia de software sob medida para empresas que lideram.
            </h1>
          </ZoomReveal>

          {/* Subtitle & Value Proposition */}
          <ZoomReveal delay={0.3} className="mb-5">
            <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed max-w-lg">
              Construo sistemas web robustos, produtos digitais de alta performance e automações inteligentes desenhadas para a operação exata da sua empresa. Sem mensalidades por usuário, sem limitações.
            </p>
          </ZoomReveal>

          {/* Social Proof Rating */}
          <ZoomReveal delay={0.38} className="flex items-center gap-2.5 mb-6 text-xs font-mono text-[#AEB7C4]">
            <div className="flex text-[#FFB800] text-xs tracking-tight">
              ★★★★★
            </div>
            <span className="text-white font-bold">5.0</span>
            <span className="text-[#475569]">•</span>
            <span>Código 100% Proprietário &amp; Entrega Direta</span>
          </ZoomReveal>

          {/* Dual CTAs */}
          <ZoomReveal delay={0.48} className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openWhatsApp('general')}
              className="px-6 py-3 rounded-full bg-[#00D2F6] hover:bg-[#38bdf8] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(0,210,246,0.3)] cursor-pointer"
            >
              <span>Fale Comigo</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate(2)}
              className="px-5 py-3 rounded-full bg-[#060B18]/80 hover:bg-[#0f172a] border border-white/10 hover:border-[#00D2F6]/50 text-[#CBD5E1] hover:text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#00D2F6]" />
              <span>Simular Projeto</span>
            </button>
          </ZoomReveal>
        </div>

        {/* CENTER COLUMN: (Clean breathing room for the Video background) */}
        <div className="lg:col-span-3 hidden lg:block" />

        {/* RIGHT COLUMN: Senior Engineering Architecture Card (Desktop Only for clean mobile composition) */}
        <div className="lg:col-span-4 hidden lg:flex flex-col justify-center items-end text-right pointer-events-auto space-y-3">
          <ZoomReveal delay={0.3} className="w-full max-w-[340px]">
            <div className="p-5 rounded-2xl bg-[#060B18]/90 border border-white/10 hover:border-[#00D2F6]/40 backdrop-blur-xl shadow-2xl transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/25 flex items-center justify-center text-[#00D2F6]">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#00D2F6] uppercase font-bold tracking-wider block">
                    ARQUITETURA FULL-STACK
                  </span>
                  <span className="text-[11px] font-mono text-[#94A3B8]">Desenvolvimento Sênior</span>
                </div>
              </div>

              <div className="text-left space-y-1.5">
                <h3 className="text-sm font-bold uppercase tracking-tight text-white">
                  Engenharia Direta com o Arquiteto
                </h3>
                <p className="text-[11px] text-[#AEB7C4] font-light leading-relaxed">
                  Sem intermediários ou repasse para equipes juniores. Você lida diretamente com o desenvolvedor responsável por desenhar e implementar cada linha do sistema.
                </p>
              </div>

              {/* Stack Pills */}
              <div className="text-left pt-2 border-t border-white/10">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#64748B] block mb-2 font-semibold">
                  Stack de Produção
                </span>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-[#CBD5E1]">
                  <span className="px-2 py-0.5 rounded bg-[#020408] border border-white/10">
                    Next.js &amp; React
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#020408] border border-white/10">
                    Node &amp; TypeScript
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#020408] border border-white/10">
                    Python &amp; APIs
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#020408] border border-white/10">
                    PostgreSQL
                  </span>
                </div>
              </div>
            </div>
          </ZoomReveal>
        </div>
      </div>

      {/* 3. BOTTOM HORIZONTAL INFORMATIONAL BAR */}
      <ZoomReveal delay={0.55} className="w-full max-w-5xl mx-auto z-30 relative pointer-events-auto">
        <div className="px-5 py-2.5 rounded-full bg-[#060B18]/85 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#AEB7C4]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
            <span>+5 Anos de Experiência em Engenharia</span>
          </div>

          <div className="flex items-center gap-2 text-white font-medium">
            <span>• Caxias do Sul / RS • Atendimento em Todo o Brasil &amp; Global</span>
          </div>

          <button
            onClick={() => onNavigate(1)}
            className="hover:text-[#00D2F6] transition-colors flex items-center gap-1 cursor-pointer uppercase tracking-wider text-[10px] font-bold text-[#00D2F6]"
          >
            <span>Role para Explorar</span>
            <span>↓</span>
          </button>
        </div>
      </ZoomReveal>
    </section>
  );
};
