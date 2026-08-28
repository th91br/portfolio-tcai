import React from 'react';
import { smoothStep, range } from '../math';
import { Sparkles, XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ManifestoCinematicSceneProps {
  progress: number;
}

const GENERIC_ITEMS = [
  'Templates prontos que forçam sua operação a se adaptar a eles.',
  'Mensalidades crescentes de plataformas sem direito ao código.',
  'Lentidão, bugs recorrentes e zero suporte de engenharia.',
  'Limitações para integrar Inteligência Artificial sob medida.',
];

const TCA_ITEMS = [
  'Arquitetura sob medida desenvolvida para a escala do seu negócio.',
  'Código 100% proprietário sem royalties ou taxas ocultas.',
  'Alta velocidade, interfaces cinematográficas e segurança máxima.',
  'Agentes e automações com IA que eliminam trabalho manual.',
];

export const ManifestoCinematicScene: React.FC<ManifestoCinematicSceneProps> = ({
  progress,
}) => {
  // 1. Header (0.05 -> 0.22)
  const headerOpacity =
    progress < 0.9
      ? smoothStep(progress, [0.05, 0.2], [0, 1])
      : smoothStep(progress, [0.9, 1.0], [1, 0]);
  const headerY =
    progress < 0.9
      ? range(progress, [0.05, 0.2], [20, 0])
      : range(progress, [0.9, 1.0], [0, -20]);

  // 2. Left Column "O Custo do Comum" (0.15 -> 0.45)
  const leftColOpacity =
    progress < 0.92
      ? smoothStep(progress, [0.15, 0.4], [0, 1])
      : smoothStep(progress, [0.92, 1.0], [1, 0]);
  const leftColX =
    progress < 0.92
      ? range(progress, [0.15, 0.4], [-30, 0])
      : range(progress, [0.92, 1.0], [0, -30]);

  // 3. Right Column "Padrão TCAI" (0.40 -> 0.70)
  const rightColOpacity =
    progress < 0.94
      ? smoothStep(progress, [0.4, 0.65], [0, 1])
      : smoothStep(progress, [0.94, 1.0], [1, 0]);
  const rightColX =
    progress < 0.94
      ? range(progress, [0.4, 0.65], [30, 0])
      : range(progress, [0.94, 1.0], [0, 30]);

  return (
    <section className="relative w-full h-full text-[#F3F5F7] flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 pointer-events-auto">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
          }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 transition-all duration-150"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18]/85 border border-[#00D2F6]/40 shadow-inner mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00D2F6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
              POR QUE ENGENHARIA SOB MEDIDA?
            </span>
          </div>

          <h2
            className="hero-heading font-black uppercase tracking-tight leading-none text-center select-none mb-3"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 76px)' }}
          >
            SOFTWARE GENÉRICO CUSTA CARO.
          </h2>
          <p className="text-sm sm:text-base text-[#AEB7C4] font-light max-w-2xl mx-auto leading-relaxed">
            Empresas que dependem de templates genéricos pagam mensalidades infinitas e acumulam gargalos. Engenharia sob medida constrói um ativo definitivo.
          </p>
        </div>

        {/* 2-Column Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: O Custo do Comum */}
          <div
            style={{
              opacity: leftColOpacity,
              transform: `translateX(${leftColX}px)`,
            }}
            className="p-6 sm:p-8 rounded-3xl bg-[#080D18]/70 border border-[#EF4444]/25 backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-150"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                    O CUSTO DO COMUM
                  </h3>
                  <span className="text-xs text-[#EF4444] font-mono">
                    Modelos genéricos &amp; ferramentas prontas
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {GENERIC_ITEMS.map((prob, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[#AEB7C4]">
                    <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    <span>{prob}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Padrão TCAI */}
          <div
            style={{
              opacity: rightColOpacity,
              transform: `translateX(${rightColX}px)`,
            }}
            className="p-6 sm:p-8 rounded-3xl bg-[#080D18]/80 border border-[#00D2F6]/50 backdrop-blur-md shadow-[0_0_40px_rgba(0,210,246,0.15)] flex flex-col justify-between transition-all duration-150"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                    PADRÃO TCAI
                  </h3>
                  <span className="text-xs text-[#00D2F6] font-mono">
                    Arquitetura sob medida &amp; IA estratégica
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {TCA_ITEMS.map((adv, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[#F3F5F7]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
