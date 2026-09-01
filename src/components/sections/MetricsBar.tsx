import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, ShieldCheck, UserCheck } from 'lucide-react';

interface MetricItem {
  number: string;
  unit: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const METRICS: MetricItem[] = [
  {
    number: '+5',
    unit: 'Anos',
    label: 'Estudo & Aplicação Prática em IA e Software',
    icon: Sparkles,
  },
  {
    number: '3 a 10',
    unit: 'Dias Úteis',
    label: 'Prazos Recordes de Entrega Garantida',
    icon: Clock,
  },
  {
    number: '100%',
    unit: 'Proprietário',
    label: 'Código Limpo sem Templates Lentos',
    icon: ShieldCheck,
  },
  {
    number: '0',
    unit: 'Intermediários',
    label: 'Alinhamento Direto com o Especialista',
    icon: UserCheck,
  },
];

export const MetricsBar: React.FC = () => {
  return (
    <section className="relative w-full bg-[#040813] border-y border-[#152238]/90 backdrop-blur-xl py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-10 z-20 overflow-hidden select-none shadow-2xl">
      {/* Ambient Top Light Beam */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D2F6]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D2F6]/20 to-transparent pointer-events-none" />

      {/* Subtle Glow Orb in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[120px] bg-[#00D2F6]/5 blur-[70px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-[#152238]/70">
          {METRICS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group flex flex-col items-center lg:items-center text-center p-4 sm:p-5 lg:px-6 rounded-2xl hover:bg-[#00D2F6]/[0.04] transition-all duration-300"
              >
                {/* Header: Icon + Number & Unit */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center group-hover:scale-110 group-hover:border-[#00D2F6] group-hover:bg-[#00D2F6]/20 transition-all duration-300 shadow-sm">
                    <Icon className="w-4 h-4 text-[#00D2F6]" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-kanit font-black text-2xl sm:text-3xl text-white tracking-tight group-hover:text-[#00D2F6] transition-colors">
                      {item.number}
                    </span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#00D2F6] uppercase tracking-wider">
                      {item.unit}
                    </span>
                  </div>
                </div>

                {/* Subtitle / Description */}
                <p className="text-xs sm:text-[13px] text-[#94A3B8] font-light leading-relaxed max-w-[220px]">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MetricsBar;
