import React from 'react';
import { smoothStep, range } from '../math';
import { ShieldCheck, Sparkles, UserCheck, Terminal, Award } from 'lucide-react';
import { ABOUT_DATA } from '../../data/portfolioData';

interface AboutCinematicSceneProps {
  progress: number;
}

export const AboutCinematicScene: React.FC<AboutCinematicSceneProps> = ({
  progress,
}) => {
  // 1. Eyebrow badge (0.05 -> 0.20)
  const eyebrowOpacity = smoothStep(progress, [0.05, 0.2], [0, 1]);

  // 2. Line 1: "CONSTRUINDO SOFTWARE SOB MEDIDA" (0.15 -> 0.35)
  const line1Opacity = smoothStep(progress, [0.15, 0.35], [0, 1]);
  const line1Y = range(progress, [0.15, 0.35], [20, 0]);

  // 3. Line 2: "QUE RESOLVE PROBLEMAS" (0.35 -> 0.55)
  const line2Opacity = smoothStep(progress, [0.35, 0.55], [0, 1]);
  const line2Y = range(progress, [0.35, 0.55], [20, 0]);

  // 4. Line 3: "E GERA VALOR REAL." (0.55 -> 0.75)
  const line3Opacity = smoothStep(progress, [0.55, 0.75], [0, 1]);
  const line3Y = range(progress, [0.55, 0.75], [20, 0]);

  // 5. Personal Story Card (0.65 -> 0.85)
  const storyCardOpacity = smoothStep(progress, [0.65, 0.85], [0, 1]);
  const storyCardY = range(progress, [0.65, 0.85], [30, 0]);

  // 6. Right Identity Credential Card (0.75 -> 0.95)
  const idCardOpacity = smoothStep(progress, [0.75, 0.95], [0, 1]);

  return (
    <section className="relative w-full h-full text-[#F3F5F7] flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 pointer-events-auto">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Pill Badge */}
        <div
          style={{ opacity: eyebrowOpacity }}
          className="text-center mb-6 transition-all duration-150"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18]/85 border border-[#00D2F6]/50 shadow-inner backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00D2F6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
              A MENTE POR TRÁS DA ARQUITETURA
            </span>
          </div>

          <h2
            className="hero-heading font-black uppercase tracking-tight leading-none text-center select-none mt-2"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
          >
            SOBRE MIM
          </h2>
        </div>

        {/* 2-Column Climax Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Progressive Manifesto & Personal Bio */}
          <div className="lg:col-span-7 flex flex-col">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#00D2F6] mb-3 block">
              // MANIFESTO &amp; FILOSOFIA DE TRABALHO
            </span>

            {/* Step-by-Step 3-tier Headline */}
            <div className="mb-6">
              <h3
                style={{
                  opacity: line1Opacity,
                  transform: `translateY(${line1Y}px)`,
                  fontSize: 'clamp(1.5rem, 3.2vw, 36px)',
                }}
                className="font-black uppercase tracking-tight text-white leading-tight transition-all duration-150"
              >
                CONSTRUINDO SOFTWARE SOB MEDIDA
              </h3>
              <h3
                style={{
                  opacity: line2Opacity,
                  transform: `translateY(${line2Y}px)`,
                  fontSize: 'clamp(1.5rem, 3.2vw, 36px)',
                }}
                className="font-black uppercase tracking-tight text-[#00D2F6] leading-tight transition-all duration-150"
              >
                QUE RESOLVE PROBLEMAS
              </h3>
              <h3
                style={{
                  opacity: line3Opacity,
                  transform: `translateY(${line3Y}px)`,
                  fontSize: 'clamp(1.5rem, 3.2vw, 36px)',
                }}
                className="font-black uppercase tracking-tight text-white leading-tight transition-all duration-150"
              >
                E GERA VALOR REAL.
              </h3>
            </div>

            {/* Story Card */}
            <div
              style={{
                opacity: storyCardOpacity,
                transform: `translateY(${storyCardY}px)`,
              }}
              className="p-6 sm:p-7 rounded-3xl bg-[#080D18]/75 border border-[#151F38] backdrop-blur-md shadow-2xl transition-all duration-150"
            >
              <p className="text-sm sm:text-base text-[#AEB7C4] leading-relaxed font-light mb-4">
                Sou <strong className="text-white font-semibold">Thiago Cassol Antunes</strong>, tenho 35 anos e sou movido pela curiosidade por tecnologia, inovação e Inteligência Artificial. Há mais de 5 anos desenvolvo soluções digitais que combinam estratégia, segurança e alto impacto comercial.
              </p>
              <p className="text-sm sm:text-base text-[#AEB7C4] leading-relaxed font-light">
                Não acredito em tecnologia apenas por vaidade estética. Acredito em engenharia de precisão que resolve dores reais e gera receita escalável.
              </p>
            </div>
          </div>

          {/* Right Column: Identity Card & Credentials */}
          <div
            style={{ opacity: idCardOpacity }}
            className="lg:col-span-5 flex flex-col justify-center transition-all duration-150"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080D18]/80 border border-[#00D2F6]/40 backdrop-blur-md shadow-[0_0_50px_rgba(0,210,246,0.15)] flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#151F38] mb-6">
                <span className="px-3 py-1 rounded-full bg-[#00D2F6]/15 border border-[#00D2F6]/40 text-[#00D2F6] font-mono text-xs font-bold uppercase tracking-wider">
                  REVELAÇÃO HUMANA
                </span>
                <span className="text-xs font-mono text-[#AEB7C4]">IDENTIDADE</span>
              </div>

              {/* Central Name & Title */}
              <div className="text-center py-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D2F6] to-[#015EEF] flex items-center justify-center font-black text-black text-xl shadow-[0_0_30px_rgba(0,210,246,0.5)] mx-auto mb-4">
                  TCA
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  THIAGO CASSOL ANTUNES
                </h4>
                <p className="text-xs font-mono text-[#00D2F6] tracking-widest mt-1 uppercase">
                  Arquiteto de Software &amp; Fundador TCAI
                </p>
              </div>

              {/* Badges */}
              <div className="space-y-2.5 pt-4 border-t border-[#151F38] text-xs font-mono text-[#AEB7C4]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Código Auditável &amp; Propriedade 100% Sua</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00D2F6]" />
                  <span>Autonomia com Inteligência Artificial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
