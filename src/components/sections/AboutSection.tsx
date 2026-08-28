import React from 'react';
import { ZoomReveal } from '../common/ZoomReveal';
import { ShieldCheck, ArrowUpRight, CheckCircle2, UserCheck } from 'lucide-react';
import { openWhatsApp } from '../../utils/contactUtils';

interface AboutSectionProps {
  onContactClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick }) => {
  const handleAction = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      openWhatsApp('general');
    }
  };

  return (
    <section
      id="about"
      className="relative w-full h-full min-h-[100dvh] bg-transparent text-[#F3F5F7] px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 overflow-y-auto overflow-x-hidden flex flex-col justify-center select-none"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 my-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <ZoomReveal delay={0.05} className="inline-block mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#060B18]/90 border border-[#00D2F6]/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
                O DESENVOLVEDOR &amp; FUNDADOR
              </span>
            </div>
          </ZoomReveal>

          <ZoomReveal delay={0.15}>
            <h2 className="font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-white leading-none">
              Sobre Thiago Cassol Antunes
            </h2>
          </ZoomReveal>
        </div>

        {/* 2-Column Balanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
          {/* Left Column: Authentic Bio & Philosophy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-3.5">
            <ZoomReveal delay={0.25} className="space-y-1.5">
              <span className="text-[#00D2F6] font-mono text-[11px] uppercase tracking-widest font-bold">
                // ENGENHARIA DE SOFTWARE &amp; PROPÓSITO
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                Transformando desafios operacionais em software robusto e lucrativo.
              </h3>
            </ZoomReveal>

            {/* Story Card */}
            <ZoomReveal delay={0.35} className="w-full bg-[#060B18]/90 p-5 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
              <p className="font-light text-[#CBD5E1] text-xs sm:text-sm leading-relaxed mb-3">
                Tenho 35 anos, sou natural do Rio Grande do Sul (Caxias do Sul) e atuo há mais de 5 anos desenvolvendo soluções de software, sistemas web escaláveis e automações inteligentes para empresas que buscam eficiência e liderança digital.
              </p>
              <p className="font-light text-[#CBD5E1] text-xs sm:text-sm leading-relaxed">
                Minha abordagem elimina burocracias: você lida diretamente comigo, do planejamento da arquitetura ao deploy final. Sem intermediários, com código limpo, foco em retorno financeiro e total compromisso com o prazo.
              </p>
            </ZoomReveal>

            {/* CTA Button */}
            <ZoomReveal delay={0.45} className="pt-1">
              <button
                onClick={handleAction}
                className="px-6 py-3 rounded-full bg-[#00D2F6] hover:bg-[#38bdf8] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(0,210,246,0.3)] cursor-pointer"
              >
                <span>Falar Diretamente Comigo</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </ZoomReveal>
          </div>

          {/* Right Column: Founder Identity Card */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <ZoomReveal delay={0.4} className="w-full max-w-[360px]">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#060B18]/90 border border-white/10 hover:border-[#00D2F6]/40 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="px-2.5 py-0.5 rounded bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[#00D2F6] font-mono text-[10px] font-bold uppercase tracking-wider">
                    PERFIL PROFISSIONAL
                  </span>
                  <span className="text-[11px] font-mono text-[#94A3B8]">Caxias do Sul / RS</span>
                </div>

                <div className="text-center py-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#020408] border border-[#00D2F6]/40 flex items-center justify-center p-2 shadow-[0_0_25px_rgba(0,210,246,0.3)] mx-auto mb-3">
                    <img
                      src="/logo tca.png"
                      alt="TCA Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    THIAGO CASSOL ANTUNES
                  </h4>
                  <p className="text-xs font-mono text-[#00D2F6] tracking-wider mt-0.5">
                    Arquiteto de Software &amp; Fundador TCAI
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono text-[#CBD5E1]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px]">Atendimento direto com o desenvolvedor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px]">Código 100% proprietário &amp; documentado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px]">Entregas pontuais &amp; suporte contínuo</span>
                  </div>
                </div>
              </div>
            </ZoomReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
