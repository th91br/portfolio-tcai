import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PROCESS_STEPS } from '../../data/portfolioData';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

export const ProcessSection: React.FC = () => {
  return (
    <section
      id="process"
      className="relative w-full bg-[#050914] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-[#151F38] overflow-hidden z-10"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18] border border-[#151F38] shadow-inner mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              MÉTODO DE ENTREGA ÁGIL
            </span>
          </div>

          <h2 className="font-kanit font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            COMO CONSTRUÍMOS SEU PROJETO
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#AEB7C4] font-light leading-relaxed">
            Um processo sem fricção, sem reuniões inúteis e desenhado para entregar código pronto para faturar no menor tempo possível:
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative p-6 sm:p-7 rounded-3xl bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6]/50 transition-all duration-300 flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#151F38]">
                  <span className="font-kanit font-black text-4xl text-[#151F38] group-hover:text-[#00D2F6] transition-colors">
                    {step.step}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#00D2F6] px-2.5 py-1 rounded-full bg-[#050914] border border-[#151F38]">
                    {step.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2 font-kanit group-hover:text-[#00D2F6] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#151F38]/60 flex items-center gap-1.5 text-[11px] font-mono text-[#AEB7C4]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Etapa Validada</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
