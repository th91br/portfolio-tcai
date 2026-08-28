import React from 'react';
import { smoothStep, range } from '../math';
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

interface HeroCinematicSceneProps {
  progress: number;
  onContactClick: () => void;
  onExploreProjects: () => void;
}

export const HeroCinematicScene: React.FC<HeroCinematicSceneProps> = ({
  progress,
  onContactClick,
  onExploreProjects,
}) => {
  // 1. Eyebrow badge (0.05 -> 0.20 reveal, exits at 0.92 -> 1.00)
  const eyebrowOpacity =
    progress < 0.9
      ? smoothStep(progress, [0.05, 0.2], [0, 1])
      : smoothStep(progress, [0.9, 1.0], [1, 0]);
  const eyebrowY =
    progress < 0.9
      ? range(progress, [0.05, 0.2], [15, 0])
      : range(progress, [0.9, 1.0], [0, -15]);

  // 2. H1 Part 1 (0.18 -> 0.35 reveal)
  const h1Part1Opacity =
    progress < 0.92
      ? smoothStep(progress, [0.18, 0.32], [0, 1])
      : smoothStep(progress, [0.92, 1.0], [1, 0]);
  const h1Part1Y =
    progress < 0.92
      ? range(progress, [0.18, 0.32], [25, 0])
      : range(progress, [0.92, 1.0], [0, -25]);

  // 3. H1 Part 2 (0.30 -> 0.45 reveal)
  const h1Part2Opacity =
    progress < 0.92
      ? smoothStep(progress, [0.3, 0.45], [0, 1])
      : smoothStep(progress, [0.92, 1.0], [1, 0]);
  const h1Part2Y =
    progress < 0.92
      ? range(progress, [0.3, 0.45], [25, 0])
      : range(progress, [0.92, 1.0], [0, -25]);

  // 4. Paragraph (0.55 -> 0.72 reveal)
  const paragraphOpacity =
    progress < 0.94
      ? smoothStep(progress, [0.55, 0.7], [0, 1])
      : smoothStep(progress, [0.94, 1.0], [1, 0]);
  const paragraphY =
    progress < 0.94
      ? range(progress, [0.55, 0.7], [20, 0])
      : range(progress, [0.94, 1.0], [0, -20]);

  // 5. Tech badges (0.70 -> 0.85 staggered)
  const badge1Opacity = smoothStep(progress, [0.7, 0.78], [0, 1]);
  const badge2Opacity = smoothStep(progress, [0.74, 0.82], [0, 1]);
  const badge3Opacity = smoothStep(progress, [0.78, 0.86], [0, 1]);

  // 6. Action CTAs (0.84 -> 0.94)
  const ctaOpacity = smoothStep(progress, [0.84, 0.94], [0, 1]);
  const ctaY = range(progress, [0.84, 0.94], [20, 0]);

  // 7. Right HUD Frame (0.15 -> 0.40)
  const hudOpacity =
    progress < 0.92
      ? smoothStep(progress, [0.15, 0.4], [0, 1])
      : smoothStep(progress, [0.92, 1.0], [1, 0]);

  const handleSimulateClick = () => {
    const el = document.getElementById('scene-track-simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-full text-[#F3F5F7] flex flex-col justify-between pt-6 sm:pt-8 pb-8 sm:pb-12 px-4 sm:px-8 md:px-12 lg:px-16 pointer-events-none">
      {/* Top Header Row (fixed/absolute) */}
      <div className="w-full flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D2F6] to-[#015EEF] flex items-center justify-center font-black text-black text-sm shadow-[0_0_20px_rgba(0,210,246,0.5)]">
            TCA
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black tracking-wider uppercase leading-none">
              THIAGO CASSOL ANTUNES
            </h2>
            <p className="text-[10px] font-mono text-[#00D2F6] tracking-widest mt-0.5">
              SOFTWARE ARCHITECTURE • AI
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#080D18]/80 border border-[#151F38] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#AEB7C4]">DISPONÍVEL P/ PROJETOS</span>
            <span className="text-[#4B5563]">•</span>
            <span className="text-[#00D2F6]">CAXIAS DO SUL / REMOTO</span>
          </div>

          <button
            onClick={onContactClick}
            className="px-5 py-2 rounded-full bg-[#00D2F6] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#00b0d0] transition-colors flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,210,246,0.4)] cursor-pointer"
          >
            <span>FALE COMIGO</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Composition */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto z-10">
        {/* Left Headline & Value Proposition Column */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          {/* 1. Eyebrow */}
          <div
            style={{
              opacity: eyebrowOpacity,
              transform: `translateY(${eyebrowY}px)`,
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18]/85 border border-[#00D2F6]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,210,246,0.15)] mb-4 sm:mb-6 w-fit transition-all duration-150"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase text-[#00D2F6]">
              ENGENHARIA DE SOFTWARE SOB MEDIDA
            </span>
          </div>

          {/* 2. Monumental H1 (Staggered 2 Tiers) */}
          <div className="mb-4 sm:mb-6">
            <h1
              style={{
                opacity: h1Part1Opacity,
                transform: `translateY(${h1Part1Y}px)`,
                fontSize: 'clamp(2.1rem, 5vw, 64px)',
              }}
              className="font-black uppercase tracking-tighter leading-[0.95] text-white select-none transition-all duration-150"
            >
              SOFTWARE DE ALTA PRECISÃO &amp;
            </h1>
            <h1
              style={{
                opacity: h1Part2Opacity,
                transform: `translateY(${h1Part2Y}px)`,
                fontSize: 'clamp(2.1rem, 5vw, 64px)',
              }}
              className="font-black uppercase tracking-tighter leading-[0.95] text-white select-none transition-all duration-150 mt-1"
            >
              AGENTES DE IA QUE TRANSFORMAM NEGÓCIOS.
            </h1>
          </div>

          {/* 3. Description Paragraph */}
          <p
            style={{
              opacity: paragraphOpacity,
              transform: `translateY(${paragraphY}px)`,
            }}
            className="text-sm sm:text-base md:text-lg text-[#AEB7C4] font-light leading-relaxed max-w-2xl mb-6 transition-all duration-150"
          >
            Desenvolvo plataformas web robustas, sistemas personalizados, SaaS e
            rotinas autônomas de Inteligência Artificial para eliminar gargalos
            manuais, blindar operações e multiplicar seus resultados.
          </p>

          {/* 4. Strategic Badges */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8">
            <div
              style={{ opacity: badge1Opacity }}
              className="px-3.5 py-2 rounded-xl bg-[#080D18]/80 border border-[#151F38] backdrop-blur-md flex items-center gap-2 text-xs font-medium text-[#F3F5F7] transition-all duration-150"
            >
              <Code2 className="w-4 h-4 text-[#00D2F6]" />
              <span>Full-Stack Moderno</span>
            </div>
            <div
              style={{ opacity: badge2Opacity }}
              className="px-3.5 py-2 rounded-xl bg-[#080D18]/80 border border-[#151F38] backdrop-blur-md flex items-center gap-2 text-xs font-medium text-[#F3F5F7] transition-all duration-150"
            >
              <Cpu className="w-4 h-4 text-[#00D2F6]" />
              <span>Agentes &amp; APIs</span>
            </div>
            <div
              style={{ opacity: badge3Opacity }}
              className="px-3.5 py-2 rounded-xl bg-[#080D18]/80 border border-[#151F38] backdrop-blur-md flex items-center gap-2 text-xs font-medium text-[#F3F5F7] transition-all duration-150"
            >
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Segurança &amp; Escala</span>
            </div>
          </div>

          {/* 5. Action CTAs */}
          <div
            style={{
              opacity: ctaOpacity,
              transform: `translateY(${ctaY}px)`,
            }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 pointer-events-auto transition-all duration-150"
          >
            <button
              onClick={() => openWhatsApp('general')}
              className="px-8 py-4 rounded-full bg-[#00D2F6] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#00b0d0] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(0,210,246,0.4)] cursor-pointer"
            >
              <span>INICIAR MEU PROJETO</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSimulateClick}
              className="px-7 py-4 rounded-full bg-[#080D18]/90 hover:bg-[#151F38] border border-[#151F38] hover:border-[#00D2F6]/50 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-md cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#00D2F6]" />
              <span>SIMULAR CUSTO &amp; TEMPO</span>
            </button>
          </div>
        </div>

        {/* Right Aperture HUD Telemetry Glass Panel */}
        <div
          style={{ opacity: hudOpacity }}
          className="lg:col-span-5 hidden lg:flex flex-col justify-center items-end"
        >
          <div className="w-full max-w-[420px] rounded-[32px] bg-[#030611]/30 border border-[#00D2F6]/30 backdrop-blur-[2px] p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] h-[460px]">
            {/* Top HUD bar */}
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#151F38]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-white font-bold">THIAGO.ENGINE</span>
              </div>
              <span className="text-[#00D2F6]">&gt;_ v4.8 • ACTIVE</span>
            </div>

            {/* Center Aperture Focus Indicator */}
            <div className="my-auto flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-full border border-[#00D2F6]/40 flex items-center justify-center bg-[#00D2F6]/5 backdrop-blur-sm mb-3">
                <Sparkles className="w-6 h-6 text-[#00D2F6]" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00D2F6]">
                ENGENHARIA CINEMATOGRÁFICA
              </span>
              <p className="text-[11px] text-[#AEB7C4] font-mono mt-1">
                Role para avançar a transformação
              </p>
            </div>

            {/* Bottom HUD stats */}
            <div className="pt-3 border-t border-[#151F38]/60 flex items-center justify-between text-[11px] font-mono text-[#AEB7C4]">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#10B981]" />
                <span>99.9% Uptime • Zero Falhas</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                VERIFICADO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#AEB7C4] z-10 pointer-events-auto">
        <div className="flex items-center gap-4">
          <span className="text-[#00D2F6]">• ARQUITETURA DE SOFTWARE</span>
          <span className="text-[#00D2F6]">• AUTOMAÇÃO COM IA</span>
          <span className="text-[#00D2F6]">• SAAS &amp; WEBSITES</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>RESULTADOS REAIS COMPROVADOS</span>
          <span className="text-[#F59E0B]">★★★★★</span>
        </div>
      </div>
    </section>
  );
};
