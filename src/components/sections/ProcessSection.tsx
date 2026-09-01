import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PROCESS_STEPS } from '../../data/portfolioData';

export const ProcessSection: React.FC = () => {
  return (
    <section
      id="process"
      className="relative w-full bg-white text-[#0F172A] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-slate-200/80 overflow-hidden z-10"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#0284C7] uppercase">
              MÉTODO DE ENTREGA ÁGIL
            </span>
          </div>

          <h2 className="font-kanit font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#090D1A] mb-4">
            COMO CONSTRUÍMOS SEU PROJETO
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#475569] font-normal leading-relaxed">
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
              className="relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-[#0284C7]/60 transition-all duration-300 flex flex-col justify-between shadow-[0_8px_30px_rgba(15,23,42,0.04)] hover:shadow-xl hover:shadow-sky-500/10 group"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <span className="font-kanit font-black text-4xl text-slate-200 group-hover:text-[#0284C7] transition-colors">
                    {step.step}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#0284C7] px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 shadow-xs">
                    {step.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold uppercase tracking-tight text-[#090D1A] mb-2 font-kanit group-hover:text-[#0284C7] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#475569] font-normal leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Etapa Validada</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
