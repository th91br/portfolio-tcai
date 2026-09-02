import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { PROCESS_STEPS } from '../../data/portfolioData';

export const ProcessSection: React.FC = () => {
  return (
    <section
      id="process"
      className="relative w-full bg-[#07111F] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-white/[0.06] overflow-hidden z-10"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 246, 0.04) 0%, transparent 70%)',
          filter: 'blur(160px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#00D2F6]/25 shadow-sm mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
                05 / MÉTODO DE EXECUÇÃO
              </span>
            </div>

            <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F8FAFC] leading-[1.08]">
              DO DIAGNÓSTICO AO <br />
              <span className="bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] bg-clip-text text-transparent">
                CÓDIGO EM PRODUÇÃO
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed max-w-[42ch]">
            Um fluxo linear e transparente. Sem reuniões vazias, com acompanhamento direto e marcos claros até a publicação final.
          </p>
        </div>

        {/* Continuous Architectural Process Timeline */}
        <div className="relative">
          
          {/* Connecting Track Line (Desktop) */}
          <div
            className="hidden lg:block absolute top-12 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#00D2F6]/30 to-transparent pointer-events-none z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {PROCESS_STEPS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 sm:p-7 rounded-3xl bg-[#08131F]/70 border border-white/[0.08] hover:border-[#00D2F6]/50 transition-all duration-300 flex flex-col justify-between group backdrop-blur-xl"
              >
                <div>
                  {/* Step Sequence Header */}
                  <div className="flex items-center justify-between gap-2 mb-6 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-xs font-mono font-bold text-[#00D2F6] shadow-xs">
                        {step.step}
                      </div>
                      <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                        ETAPA
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-[#00D2F6] px-2 py-0.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/25">
                      {step.duration}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-white mb-2.5 font-kanit group-hover:text-[#00D2F6] transition-colors leading-snug">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-[#94A3B8] font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Milestone Indicator */}
                <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center gap-2 text-[11px] font-mono text-[#AEB7C4]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Entrega Validada</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProcessSection;
