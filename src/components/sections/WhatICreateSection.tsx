import React from 'react';
import {
  ArrowUpRight,
  Globe,
  Zap,
  Cpu,
  Layers,
  Bot,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { FadeIn } from '../common/FadeIn';
import { openWhatsApp } from '../../utils/contactUtils';

interface WhatICreateSectionProps {
  onSelectService?: (serviceName: string) => void;
  onContactClick?: () => void;
}

interface CapabilityCard {
  id: string;
  number: string;
  tag: string;
  title: string;
  description: string;
  deliverables: string;
  icon: React.ElementType;
}

const CAPABILITIES: CapabilityCard[] = [
  {
    id: 'saas',
    number: '01',
    tag: 'PRODUTOS DIGITAIS',
    title: 'Plataformas SaaS & Web Apps',
    description: 'Aplicações completas com cobrança recorrente (Stripe/Asaas), painéis multi-tenant e infraestrutura em nuvem.',
    deliverables: 'Next.js • Assinaturas • Supabase • Escala Cloud',
    icon: Layers,
  },
  {
    id: 'systems',
    number: '02',
    tag: 'OPERAÇÃO SOB MEDIDA',
    title: 'Sistemas & Painéis de Gestão',
    description: 'Sistemas web construídos sob medida para centralizar pedidos, estoques, clientes e operações da sua empresa.',
    deliverables: 'Código Proprietário • RBAC • Relatórios em Tempo Real',
    icon: Cpu,
  },
  {
    id: 'web',
    number: '03',
    tag: 'ALTA CONVERSÃO',
    title: 'Websites de Autoridade & Landing Pages',
    description: 'Páginas institucionais e de vendas com direção de arte de elite, carregamento instantâneo e copywriting focado em conversão.',
    deliverables: 'Design Internacional • SEO Técnico 100 • Mobile First',
    icon: Globe,
  },
  {
    id: 'automation',
    number: '04',
    tag: 'EFICIÊNCIA & PROCESSOS',
    title: 'Automações & IA Aplicada',
    description: 'Fluxos automatizados e agentes inteligentes integrados diretamente ao seu WhatsApp, APIs e banco de dados.',
    deliverables: 'WhatsApp Cloud API • Webhooks • Resposta em Segundos',
    icon: Bot,
  },
];

export const WhatICreateSection: React.FC<WhatICreateSectionProps> = ({
  onSelectService,
  onContactClick,
}) => {
  const handleCardClick = (serviceName: string) => {
    if (onSelectService) {
      onSelectService(serviceName);
    } else if (onContactClick) {
      onContactClick();
    } else {
      openWhatsApp('services');
    }
  };

  return (
    <section
      id="what-i-create"
      className="relative w-full h-full min-h-[100dvh] bg-transparent text-[#F3F5F7] px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 overflow-y-auto overflow-x-hidden flex flex-col justify-center select-none"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 my-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5 px-2">
          {/* Top Pill Badge */}
          <FadeIn delay={0} y={15} className="inline-block mb-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#060B18]/90 border border-[#00D2F6]/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
                CAPACIDADES DE ENGENHARIA
              </span>
            </div>
          </FadeIn>

          {/* Big Main Title */}
          <FadeIn delay={0.1} y={15} className="w-full mb-1">
            <h2 className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-white leading-none">
              O Que Eu Construo
            </h2>
          </FadeIn>

          {/* Support Description */}
          <FadeIn delay={0.15} y={15}>
            <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed max-w-2xl mx-auto">
              Da concepção da arquitetura ao código de produção. Soluções digitais desenhadas para resolver problemas reais e gerar retorno financeiro direto.
            </p>
          </FadeIn>
        </div>

        {/* 4 Cards Grid (2x2 Matrix, 100% Viewport Visible) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {CAPABILITIES.map((card, idx) => {
            const Icon = card.icon;
            return (
              <FadeIn key={card.id} delay={0.1 + idx * 0.05} y={20} className="w-full">
                <div
                  onClick={() => handleCardClick(card.title)}
                  className="group relative rounded-2xl bg-[#060B18]/90 border border-white/10 hover:border-[#00D2F6]/50 p-4 sm:p-5 flex flex-col justify-between h-[160px] sm:h-[170px] shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer active:scale-[0.99] overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-lg text-[#00D2F6]">
                        {card.number}
                      </span>
                      <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#00D2F6]/10 text-[#00D2F6] border border-[#00D2F6]/20">
                        {card.tag}
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#020408] border border-white/10 group-hover:border-[#00D2F6] group-hover:bg-[#00D2F6] text-[#94A3B8] group-hover:text-black flex items-center justify-center transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-white group-hover:text-[#00D2F6] transition-colors mb-1">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] font-light leading-snug line-clamp-2">
                      {card.description}
                    </p>
                  </div>

                  <div className="text-[10px] font-mono text-slate-300 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3 h-3 text-[#00D2F6] flex-shrink-0" />
                    <span className="truncate text-emerald-400 font-medium">{card.deliverables}</span>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
