import React from 'react';
import { ZoomReveal } from '../common/ZoomReveal';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { openWhatsApp } from '../../utils/contactUtils';

interface ProcessStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Diagnóstico & Arquitetura',
    subtitle: 'Planejamento Estratégico',
    description:
      'Mapeamento detalhado das regras de negócio, fluxos operacionais e modelagem do banco de dados antes de iniciar o código.',
    tags: ['Requisitos', 'Modelagem de Dados', 'Definição de Stack'],
  },
  {
    step: '02',
    title: 'Design de Interface & UX',
    subtitle: 'Direção de Arte & Conversão',
    description:
      'Prototipagem interativa de alta fidelidade com foco em usabilidade moderna, estética cinematográfica e alta taxa de conversão.',
    tags: ['UX/UI Design', 'Design System', 'Mobile First'],
  },
  {
    step: '03',
    title: 'Engenharia Full-Stack',
    subtitle: 'Código Limpo & Robusto',
    description:
      'Desenvolvimento em TypeScript, React, Node.js e Python com foco em velocidade máxima, segurança e testes rigorosos.',
    tags: ['TypeScript', 'APIs Seguras', 'Performance 100'],
  },
  {
    step: '04',
    title: 'Deploy & Suporte Direto',
    subtitle: 'Entrega em Produção',
    description:
      'Publicação em infraestrutura cloud de alta disponibilidade, testes finais, documentação clara e suporte direto com o desenvolvedor.',
    tags: ['Cloud Deploy', 'Backups', 'Suporte Sem Intermediários'],
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="relative w-full h-full min-h-[100dvh] bg-transparent text-[#F3F5F7] px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 overflow-y-auto overflow-x-hidden flex flex-col justify-center select-none"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 my-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5">
          <ZoomReveal delay={0.05} className="inline-block mb-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#060B18]/90 border border-[#00D2F6]/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
                METODOLOGIA DE TRABALHO
              </span>
            </div>
          </ZoomReveal>

          <ZoomReveal delay={0.1}>
            <h2 className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-white leading-none mb-1">
              Como Eu Trabalho: Engenharia Transparente
            </h2>
          </ZoomReveal>

          <ZoomReveal delay={0.15}>
            <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed max-w-2xl mx-auto">
              Processo estruturado em 4 etapas claras. Você acompanha a evolução do projeto passo a passo com prazos cumpridos e alinhamento constante.
            </p>
          </ZoomReveal>
        </div>

        {/* 4 Process Steps (Horizontal Flow in 4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 max-w-5xl mx-auto">
          {PROCESS_STEPS.map((item, index) => (
            <ZoomReveal
              key={item.step}
              delay={0.1 + index * 0.05}
              className="w-full"
            >
              <div className="p-4 sm:p-4.5 rounded-2xl bg-[#060B18]/90 border border-white/10 hover:border-[#00D2F6]/40 transition-all duration-300 group backdrop-blur-xl shadow-xl flex flex-col justify-between h-[180px] sm:h-[195px] hover:-translate-y-1">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-mono font-black text-xl text-[#00D2F6]">
                    {item.step}
                  </span>
                  <span className="text-[9px] font-mono uppercase font-semibold text-[#94A3B8] tracking-wider">
                    {item.subtitle}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-[#00D2F6] transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#94A3B8] font-light leading-snug line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#020408] border border-white/10 text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </ZoomReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
