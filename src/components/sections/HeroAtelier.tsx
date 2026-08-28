import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  Activity,
  Code2,
  Terminal,
  Zap,
} from 'lucide-react';
import { openWhatsApp } from '../../utils/contactUtils';

interface HeroAtelierProps {
  onContactClick: () => void;
  onExploreProjects: () => void;
}

export const HeroAtelier: React.FC<HeroAtelierProps> = ({
  onContactClick,
  onExploreProjects,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Mouse Physics on the Atelier Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 120,
    damping: 18,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-atelier"
      className="relative min-h-[100dvh] w-full bg-transparent text-[#F3F5F7] flex flex-col justify-between overflow-hidden pt-6 sm:pt-8 pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 lg:px-16 border-b border-[#151F38]/50"
    >
      {/* Background Volumetric Lighting Atmosphere */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#00D2F6]/10 via-[#015EEF]/5 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tl from-[#015EEF]/10 via-[#00D2F6]/5 to-transparent blur-[160px] pointer-events-none rounded-full" />

      {/* 1. Top Executive Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-7xl mx-auto flex items-center justify-between z-30 relative py-3 px-4 sm:px-6 rounded-full bg-[#060B18]/75 border border-white/10 backdrop-blur-md shadow-2xl"
      >
        {/* Brand Tag / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D2F6] to-[#015EEF] flex items-center justify-center font-black text-xs text-[#030611] tracking-tighter shadow-lg shadow-[#00D2F6]/20 select-none">
            TCA
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white leading-none">
              THIAGO CASSOL ANTUNES
            </span>
            <span className="text-[10px] font-mono text-[#AEB7C4] tracking-wider">
              SOFTWARE ARCHITECTURE • AI
            </span>
          </div>
        </div>

        {/* Live Availability Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#030611] border border-[#151F38] text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">DISPONÍVEL P/ PROJETOS</span>
          <span className="text-[#AEB7C4]/60">•</span>
          <span className="text-[#AEB7C4]">CAXIAS DO SUL / REMOTO</span>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => handleNavClick('#projects')}
            className="text-xs sm:text-sm font-medium text-[#AEB7C4] hover:text-white transition-colors duration-200 hidden sm:inline-block cursor-pointer"
          >
            PROJETOS
          </button>
          <button
            onClick={() => handleNavClick('#simulator')}
            className="text-xs sm:text-sm font-medium text-[#00D2F6] hover:text-white transition-colors duration-200 hidden sm:inline-block cursor-pointer font-mono"
          >
            SIMULAR PROJETO
          </button>
          <button
            onClick={onContactClick}
            className="px-4 sm:px-5 py-2 rounded-full bg-[#00D2F6] text-[#030611] font-bold text-xs sm:text-sm tracking-tight flex items-center gap-1.5 shadow-lg shadow-[#00D2F6]/20 hover:bg-white transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span>FALE COMIGO</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.nav>

      {/* 2. Hero Content: Split Screen Composition */}
      <div className="w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-20 py-8 sm:py-12">
        
        {/* Left Column: Provocative Strategic Copy (7 cols on lg) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-7 flex flex-col items-start text-left space-y-6 sm:space-y-8"
        >
          {/* Status Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#060B18]/90 border border-[#151F38] shadow-inner backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="text-[11px] sm:text-xs font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
              ENGENHARIA DE SOFTWARE SOB MEDIDA
            </span>
          </div>

          {/* Monumental Headline with Wide Rhythm */}
          <h1 className="hero-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] leading-[0.98] tracking-tight uppercase text-white select-none">
            Software de alta precisão & Agentes de IA que transformam negócios.
          </h1>

          {/* Clear, Human Value Proposition */}
          <p className="text-[#AEB7C4] text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl">
            Desenvolvo plataformas web robustas, sistemas personalizados, SaaS e rotinas autônomas de Inteligência Artificial para eliminar gargalos manuais, blindar operações e multiplicar seus resultados.
          </p>

          {/* Technical Proof Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl font-mono text-[11px] text-[#AEB7C4]">
            <div className="p-3 rounded-xl bg-[#060B18]/80 border border-[#151F38] backdrop-blur-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#00D2F6] flex-shrink-0" />
              <span>Full-Stack Moderno</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18]/80 border border-[#151F38] backdrop-blur-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00D2F6] flex-shrink-0" />
              <span>Agentes & APIs</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18]/80 border border-[#151F38] backdrop-blur-sm flex items-center gap-2 col-span-2 sm:col-span-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Segurança & Escala</span>
            </div>
          </div>

          {/* Dual High-Impact Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto pt-2">
            <button
              onClick={() => openWhatsApp('project')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] text-[#030611] font-black text-sm sm:text-base uppercase tracking-tight flex items-center justify-center gap-2.5 shadow-xl shadow-[#00D2F6]/25 hover:shadow-[#00D2F6]/40 hover:scale-[1.02] transition-all duration-300 active:scale-[0.97] cursor-pointer"
            >
              <span>INICIAR MEU PROJETO</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleNavClick('#simulator')}
              className="px-6 py-4 rounded-full bg-[#060B18]/80 border border-white/15 hover:border-[#00D2F6]/60 text-white font-mono text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/5 backdrop-blur-sm transition-all duration-300 active:scale-[0.97] cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#00D2F6]" />
              <span>SIMULAR CUSTO & TEMPO</span>
            </button>
          </div>
        </motion.div>

        {/* Right Column: 3D Executive Glass Telemetry Frame (5 cols on lg) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-5 w-full flex justify-center perspective-[1200px]"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative w-full max-w-[440px] rounded-[36px] bg-gradient-to-b from-[#091124]/40 via-[#060B18]/30 to-[#030611]/50 border border-white/15 p-3 shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-sm group"
          >
            {/* Ambient Spotlight Glow behind the card */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#00D2F6]/20 via-[#015EEF]/15 to-transparent blur-2xl rounded-[40px] -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Inner Glass Frame - Translucent Aperture framing the video */}
            <div className="relative w-full rounded-[30px] overflow-hidden bg-[#030611]/20 border border-white/10 flex flex-col">
              
              {/* Card Top Telemetry Strip */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 text-[10px] font-mono bg-[#060B18]/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-white font-semibold tracking-wider">THIAGO.ENGINE</span>
                </div>
                <div className="text-[#AEB7C4] flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-[#00D2F6]" />
                  <span>v4.8 • ACTIVE</span>
                </div>
              </div>

              {/* Viewport Aperture revealing the background video character */}
              <div className="relative aspect-[3/4] w-full overflow-hidden flex flex-col justify-between p-6">
                {/* Crosshairs & HUD elements */}
                <div className="flex justify-between items-start font-mono text-[9px] text-[#00D2F6]/70">
                  <span className="px-2 py-0.5 rounded bg-[#030611]/70 border border-[#00D2F6]/30">
                    SCAN // 1080p 60FPS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#030611]/70 border border-white/10 text-[#AEB7C4]">
                    AI AGENT READY
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto text-center space-y-2 select-none pointer-events-none">
                  <div className="w-16 h-16 rounded-full border border-[#00D2F6]/30 flex items-center justify-center bg-[#00D2F6]/5 backdrop-blur-[2px] animate-pulse">
                    <Sparkles className="w-6 h-6 text-[#00D2F6]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
                    ENGENHARIA CINEMATOGRÁFICA
                  </span>
                  <span className="text-[9px] font-mono text-[#AEB7C4]">
                    Role para avançar a transformação
                  </span>
                </div>

                <div className="flex justify-between items-end font-mono text-[9px] text-[#AEB7C4]">
                  <span>LATENCY &lt; 1ms</span>
                  <span className="text-emerald-400 font-bold">● 100% OPERATIONAL</span>
                </div>
              </div>

              {/* Card Footer: Live System Activity */}
              <div className="p-4 bg-[#060B18]/85 border-t border-white/10 backdrop-blur-md space-y-2.5 z-20">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#AEB7C4]">Arquiteto Responsável</span>
                  <span className="text-[#00D2F6] font-bold">5+ ANOS EXP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#030611]/80 border border-[#151F38] flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white truncate">99.9% Uptime • Zero Falhas</span>
                  </div>
                  <span className="text-emerald-400 font-bold flex-shrink-0 text-[10px] bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    VERIFICADO
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* 3. Bottom Trust & Statistics Strip */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-[#151F38]/60 text-xs font-mono text-[#AEB7C4] z-20"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
            <span>ARQUITETURA DE SOFTWARE</span>
          </div>
          <div className="flex items-center gap-2 hidden sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096F5]" />
            <span>AUTOMAÇÃO COM IA</span>
          </div>
          <div className="flex items-center gap-2 hidden md:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#015EEF]" />
            <span>SAAS & WEBSITES</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#F3F5F7]">
          <span>RESULTADOS REAIS COMPROVADOS</span>
          <span className="text-amber-400">★★★★★</span>
        </div>
      </motion.div>
    </section>
  );
};
