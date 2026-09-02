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
    <section className="relative w-full bg-[#050B14] border-y border-white/[0.06] py-8 sm:py-10 px-4 sm:px-6 md:px-10 z-20 overflow-hidden select-none">
      {/* Hairline Horizon Accent */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D2F6]/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-white/[0.06]">
          {METRICS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex flex-col items-start lg:items-center text-left lg:text-center px-4 sm:px-6 lg:px-8 group"
              >
                {/* Number & Unit */}
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="font-kanit font-black text-3xl sm:text-4xl text-[#F8FAFC] tracking-tight group-hover:text-[#00D2F6] transition-colors">
                    {item.number}
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#00D2F6] uppercase tracking-wider">
                    {item.unit}
                  </span>
                </div>

                {/* Subtitle / Description */}
                <p className="text-xs sm:text-[13px] text-[#94A3B8] font-light leading-relaxed max-w-[240px]">
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
