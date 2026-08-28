import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '../common/FadeIn';
import {
  Cpu,
  Globe,
  Layers,
  Bot,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ProjectArchetype {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  headline: string;
  description: string;
  stack: string[];
  deliverables: string[];
  timeline: string;
  businessImpact: string;
  whatsappMessage: string;
}

const ARCHETYPES: ProjectArchetype[] = [
  {
    id: 'custom-software',
    title: 'Sistemas & Painéis Web',
    category: 'OPERAÇÃO SOB MEDIDA',
    icon: Cpu,
    headline: 'Centralize sua operação e elimine planilhas manuais com sistema próprio',
    description:
      'Aplicações web desenvolvidas sob medida para o fluxo exato da sua empresa: controle de pedidos, gestão de clientes, estoques, prazos e relatórios em tempo real.',
    stack: ['React / Next.js', 'Node.js & TypeScript', 'PostgreSQL', 'Autenticação Segura & RBAC'],
    deliverables: [
      'Painéis administrativos em tempo real com controle de acessos',
      'Modelagem de banco de dados robusta e relatórios automáticos',
      'Código-fonte 100% proprietário da sua empresa (sem royalties)',
      'Deploy otimizado em nuvem com backups automáticos',
    ],
    timeline: '3 a 5 semanas',
    businessImpact: 'Eliminação total de erros manuais e controle absoluto da telemetria da empresa.',
    whatsappMessage:
      'Olá Thiago! Gostaria de um orçamento para desenvolver um Sistema/Painel Web Sob Medida para a minha empresa.',
  },
  {
    id: 'saas-product',
    title: 'Plataformas SaaS',
    category: 'PRODUTOS DIGITAIS',
    icon: Layers,
    headline: 'Transforme uma oportunidade de mercado em um produto escalável e lucrativo',
    description:
      'Desenvolvimento completo de plataformas SaaS com cobrança recorrente integrada, área de membros, faturamento automatizado e infraestrutura pronta para escala.',
    stack: ['Next.js App Router', 'Stripe / Asaas / Gateway', 'PostgreSQL / Supabase', 'Infraestrutura Cloud'],
    deliverables: [
      'Fluxo completo de checkout, assinaturas e webhooks de pagamento',
      'Painel de controle multi-tenant para gestão de assinantes',
      'Onboarding intuitivo focado em retenção de usuários',
      'Arquitetura escalável pronta para centenas de clientes simultâneos',
    ],
    timeline: '4 a 6 semanas',
    businessImpact: 'Lançamento rápido de MVP robusto e pronto para gerar receita recorrente.',
    whatsappMessage:
      'Olá Thiago! Quero tirar uma ideia de Plataforma SaaS/Produto Digital do papel com alto padrão de engenharia.',
  },
  {
    id: 'authority-web',
    title: 'Websites de Autoridade',
    category: 'PRESENÇA & CONVERSÃO',
    icon: Globe,
    headline: 'Presença digital de alto nível que transmite credibilidade instantânea',
    description:
      'Websites institucionais e Landing Pages com direção de arte refinada, carregamento ultrarrápido, copywriting estratégico e foco em conversão de leads qualificados.',
    stack: ['React / Tailwind CSS', 'Framer Motion & GSAP', 'SEO Técnico 100/100', 'Performance Mobile'],
    deliverables: [
      'Design exclusivo de alto impacto com padrões internacionais',
      'Estrutura de conversão focada em geração de contatos comerciais',
      'Otimização completa para mobile e mecanismos de busca (Google)',
      'Conexão direta com WhatsApp e ferramentas de captação',
    ],
    timeline: '7 a 14 dias úteis',
    businessImpact: 'Percepção de marca de alto valor que justifica preços maiores e multiplica contatos.',
    whatsappMessage:
      'Olá Thiago! Quero criar um Website/Landing Page de alto impacto para elevar a autoridade do meu negócio.',
  },
  {
    id: 'ai-automation',
    title: 'Automações & IA Prática',
    category: 'EFICIÊNCIA & PROCESSOS',
    icon: Bot,
    headline: 'Atendimento e triagem 24/7 sem necessidade de aumentar a equipe',
    description:
      'Sistemas automatizados e fluxos inteligentes integrados diretamente ao seu WhatsApp, CRM e banco de dados para qualificação e processamento ágil de dados.',
    stack: ['APIs & Webhooks', 'WhatsApp Cloud API', 'Python / Node.js', 'Modelos de Linguagem & IA'],
    deliverables: [
      'Agente ou fluxo automatizado com regras personalizadas do seu negócio',
      'Integração direta com WhatsApp e sistema de atendimento',
      'Histórico de interações e painel de acompanhamento',
      'Redução drástica no tempo de resposta para clientes (< 3s)',
    ],
    timeline: '10 a 18 dias úteis',
    businessImpact: 'Atendimento instantâneo 24/7 e eliminação de tarefas manuais repetitivas.',
    whatsappMessage:
      'Olá Thiago! Gostaria de entender mais sobre Automações & IA Prática para os processos da minha empresa.',
  },
];

export const ProjectSimulator: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('custom-software');

  const currentArchetype = ARCHETYPES.find((a) => a.id === selectedId) || ARCHETYPES[0];

  const handleStartProject = () => {
    const encoded = encodeURIComponent(currentArchetype.whatsappMessage);
    window.open(`https://wa.me/5554981167720?text=${encoded}`, '_blank');
  };

  return (
    <section
      id="simulator"
      className="relative w-full h-full min-h-[100dvh] bg-transparent text-[#F3F5F7] px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 overflow-y-auto overflow-x-hidden flex flex-col justify-center select-none"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 my-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-4">
          <FadeIn delay={0} y={15} className="inline-block mb-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#060B18]/90 border border-[#00D2F6]/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
                SIMULADOR DE ESCOPO &amp; ARQUITETURA
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} y={15} className="w-full">
            <h2 className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-white mb-1.5">
              Escolha seu desafio. Veja o raio-X da solução.
            </h2>
          </FadeIn>

          <FadeIn delay={0.15} y={15}>
            <p className="text-[#CBD5E1] text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto">
              Selecione o tipo de projeto para visualizar a arquitetura técnica recomendada, entregáveis e estimativa de prazo.
            </p>
          </FadeIn>
        </div>

        {/* Archetype Selector Tabs */}
        <FadeIn delay={0.15} y={15} className="w-full mb-3 sm:mb-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 max-w-5xl mx-auto">
            {ARCHETYPES.map((archetype) => {
              const Icon = archetype.icon;
              const isSelected = archetype.id === selectedId;

              return (
                <button
                  key={archetype.id}
                  onClick={() => setSelectedId(archetype.id)}
                  className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-[85px] sm:h-[92px] cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#060B18] border-[#00D2F6] shadow-xl shadow-[#00D2F6]/10 scale-[1.02]'
                      : 'bg-[#060B18]/70 border-white/10 hover:border-white/25 hover:bg-[#060B18]/90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isSelected ? 'text-[#00D2F6]' : 'text-[#94A3B8] group-hover:text-white'
                      }`}
                    />
                    <span
                      className={`text-[8px] sm:text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30'
                          : 'bg-[#020408] text-[#94A3B8]'
                      }`}
                    >
                      {archetype.category}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] sm:text-xs font-bold tracking-tight block truncate ${
                      isSelected ? 'text-white' : 'text-[#CBD5E1] group-hover:text-white'
                    }`}
                  >
                    {archetype.title}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Dynamic Blueprint Card Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArchetype.id}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl mx-auto rounded-2xl bg-[#060B18]/90 border border-white/10 p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start relative z-10">
              
              {/* Left Column: Solution Scope & Strategy (7 cols) */}
              <div className="lg:col-span-7 space-y-3.5">
                <div>
                  <span className="text-[#00D2F6] font-mono text-[10px] uppercase font-bold tracking-widest block mb-1">
                    // ESCOPO E ARQUITETURA RECOMENDADA
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white mb-1">
                    {currentArchetype.headline}
                  </h3>
                  <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                    {currentArchetype.description}
                  </p>
                </div>

                {/* Stack Pills */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B] block uppercase tracking-wider font-semibold">
                    Stack Tecnológica:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentArchetype.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#020408] border border-white/10 text-[#00D2F6]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B] block uppercase tracking-wider font-semibold">
                    O que será entregue:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {currentArchetype.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-[#F1F5F9]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2F6] flex-shrink-0 mt-0.5" />
                        <span className="font-light text-[11px] leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Metrics & Direct Action (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#020408]/90 rounded-xl border border-white/5 p-4 space-y-3.5">
                
                {/* Timeline Box */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00D2F6]" />
                    <span className="text-xs font-mono text-[#94A3B8] uppercase">Prazo Estimado</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono">
                    {currentArchetype.timeline}
                  </span>
                </div>

                {/* Business Impact Box */}
                <div className="p-3 rounded-lg bg-[#00D2F6]/5 border border-[#00D2F6]/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5 text-[#00D2F6]" />
                    <span className="text-[10px] font-mono uppercase font-bold text-[#00D2F6] tracking-wider">
                      IMPACTO NO NEGÓCIO
                    </span>
                  </div>
                  <p className="text-xs text-[#E2E8F0] font-light leading-relaxed">
                    {currentArchetype.businessImpact}
                  </p>
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={handleStartProject}
                  className="w-full py-2.5 rounded-xl bg-[#00D2F6] hover:bg-[#38bdf8] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-[#00D2F6]/20 active:scale-98"
                >
                  <span>Falar com o Thiago Sobre Este Projeto</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
