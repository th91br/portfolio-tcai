import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { COMPARISON_DATA } from '../../data/portfolioData';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

export const ComparisonSection: React.FC = () => {
  return (
    <section
      id="why-us"
      className="relative w-full bg-[#050914] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-[#151F38] overflow-hidden z-10"
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#00D2F6]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18] border border-[#151F38] shadow-inner mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              {COMPARISON_DATA.pill}
            </span>
          </div>

          <h2 className="font-kanit font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-4">
            {COMPARISON_DATA.headline}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#AEB7C4] font-light leading-relaxed">
            {COMPARISON_DATA.tagline}
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Column 1: Traditional Agencies (Red / Muted Pain Points) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-[#080D18]/70 border border-red-500/20 p-6 sm:p-8 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#151F38]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-red-400 font-kanit">
                    Agências Tradicionais
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-red-400/80 uppercase font-semibold">
                  Modelo Lento
                </span>
              </div>

              <div className="space-y-5">
                {COMPARISON_DATA.traditional.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <XCircle className="w-5 h-5 text-red-400/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm sm:text-base font-bold text-white mb-1">
                        {item.title}
                      </div>
                      <p className="text-xs sm:text-sm text-[#AEB7C4]/80 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#151F38] text-xs text-[#AEB7C4]/60 font-mono text-center">
              Resultado: Prazos estourados, custos altos e soluções pesadas.
            </div>
          </motion.div>

          {/* Column 2: TCAI Strategic Method (Cyan / High-Ticket Advantage) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-[#080D18] to-[#00D2F6]/5 border border-[#00D2F6]/50 p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-[#00D2F6]/10 relative overflow-hidden"
          >
            {/* Top background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D2F6]/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#00D2F6]/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00D2F6]/20 text-[#00D2F6] flex items-center justify-center shadow-lg shadow-[#00D2F6]/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#00D2F6] font-kanit">
                    Método TCAI
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#00D2F6] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30">
                  Alta Performance
                </span>
              </div>

              <div className="space-y-5">
                {COMPARISON_DATA.tcaiMethod.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm sm:text-base font-bold text-white mb-1">
                        {item.title}
                      </div>
                      <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#00D2F6]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-white font-medium">
                Pronto para construir sua solução com velocidade recorde?
              </span>
              <a
                href={createQuickWhatsAppUrl('Comparativo TCAI')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-[#00D2F6] hover:text-white transition-colors"
              >
                <span>FALAR AGORA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
