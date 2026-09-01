import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MessageCircle,
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
  slaTag: string;
  businessImpact: string;
  whatsappMessage: string;
}

const ARCHETYPES: ProjectArchetype[] = [
  {
    id: 'authority-web',
    title: 'Sites & Landing Pages',
    category: 'PRESENÇA & CONVERSÃO',
    icon: Globe,
    headline: 'Presença digital de alto padrão que converte visitantes em clientes',
    description:
      'Websites institucionais e Landing Pages com design exclusivo, carregamento ultrarrápido, copywriting persuasivo e foco em captação contínua de leads qualificados.',
    stack: ['React / Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion & GSAP', 'SEO Técnico 100/100'],
    deliverables: [
      'Design exclusivo de alto impacto sem templates prontos',
      'Estrutura persuasiva focada em conversão comercial',
      'Velocidade extrema e otimização total para mobile',
      'Integração direta com WhatsApp, CRM e formulários',
    ],
    timeline: '3 DIAS ÚTEIS',
    slaTag: '⚡ Entrega Recorde',
    businessImpact: 'Percepção de marca de alto valor que justifica preços maiores e multiplica oportunidades comerciais.',
    whatsappMessage:
      'Olá Thiago! Gostaria de um orçamento para criar um Site/Landing Page de Alta Conversão com entrega em 3 dias úteis.',
  },
  {
    id: 'ai-automation',
    title: 'Automações & Agentes IA',
    category: 'EFICIÊNCIA & PROCESSOS',
    icon: Bot,
    headline: 'Atendimento, triagem e tarefas operacionais 24/7 sem inchar a equipe',
    description:
      'Agentes inteligentes e fluxos automatizados integrados diretamente ao seu WhatsApp, CRM e banco de dados para qualificação e atendimento ágil de clientes.',
    stack: ['WhatsApp Cloud API', 'Python / Node.js', 'Modelos de Linguagem & LLMs', 'Webhooks & CRMs'],
    deliverables: [
      'Agente inteligente treinado com as regras do seu negócio',
      'Triagem cognitiva e qualificação de leads em tempo real',
      'Disparos automáticos de orçamentos e agendamentos',
      'Tempo de resposta imediato (< 3 segundos)',
    ],
    timeline: '7 DIAS ÚTEIS',
    slaTag: '🤖 Operação 24/7',
    businessImpact: 'Eliminação de tarefas manuais repetitivas e escala de atendimento sem aumentar custos com folha salarial.',
    whatsappMessage:
      'Olá Thiago! Quero implementar Automações & Agentes de IA na minha empresa com prazo de 7 dias úteis.',
  },
  {
    id: 'custom-software',
    title: 'Sistemas & Painéis Web',
    category: 'OPERAÇÃO SOB MEDIDA',
    icon: Cpu,
    headline: 'Centralize sua operação e elimine gargalos manuais com software sob medida',
    description:
      'Aplicações web desenvolvidas sob medida para o fluxo exato da sua empresa: controle de pedidos, gestão de clientes, processos jurídicos, estoques e relatórios em tempo real.',
    stack: ['React / Next.js', 'Node.js & TypeScript', 'PostgreSQL', 'Autenticação Segura & RBAC'],
    deliverables: [
      'Painéis administrativos em tempo real com controle de acessos',
      'Modelagem de banco de dados robusta e relatórios automáticos',
      'Código-fonte 100% proprietário da sua empresa (sem royalties)',
      'Deploy otimizado em nuvem com backups automáticos',
    ],
    timeline: '10 DIAS ÚTEIS',
    slaTag: '💻 Sistemas Sob Medida',
    businessImpact: 'Eliminação total de erros operacionais e controle absoluto dos números da empresa.',
    whatsappMessage:
      'Olá Thiago! Gostaria de um orçamento para desenvolver um Sistema/Painel Web Sob Medida com prazo de 10 dias úteis.',
  },
  {
    id: 'saas-product',
    title: 'Plataformas SaaS',
    category: 'PRODUTOS DIGITAIS',
    icon: Layers,
    headline: 'Transforme uma ideia de mercado em um produto digital escalável e lucrativo',
    description:
      'Desenvolvimento completo de plataformas SaaS com cobrança recorrente integrada, área de membros, faturamento automatizado e infraestrutura pronta para escala.',
    stack: ['Next.js / Vite', 'Stripe / Asaas / Gateway', 'PostgreSQL / Supabase', 'Infraestrutura Cloud'],
    deliverables: [
      'Fluxo completo de checkout, assinaturas e webhooks',
      'Painel de controle multi-tenant para gestão de assinantes',
      'Onboarding intuitivo focado em retenção de usuários',
      'Arquitetura escalável para milhares de usuários',
    ],
    timeline: '10 A 14 DIAS ÚTEIS',
    slaTag: '🚀 Produto Escalável',
    businessImpact: 'Lançamento ágil de MVP robusto no ar gerando receita recorrente.',
    whatsappMessage:
      'Olá Thiago! Quero tirar uma ideia de Plataforma SaaS do papel com entrega ágil e alto padrão de engenharia.',
  },
];

export const ProjectSimulator: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('authority-web');

  const currentArchetype = ARCHETYPES.find((a) => a.id === selectedId) || ARCHETYPES[0];

  const handleStartProject = () => {
    const encoded = encodeURIComponent(currentArchetype.whatsappMessage);
    window.open(`https://wa.me/5554981167720?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="simulator"
      className="relative w-full bg-[#050914] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-[#151F38] overflow-hidden z-10"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18] border border-[#151F38] shadow-inner mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
              SIMULADOR DE ESCOPO & PRAZOS
            </span>
          </div>

          <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-4">
            ESCOLHA SEU DESAFIO. VEJA O RAIO-X DA SOLUÇÃO.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#AEB7C4] font-light leading-relaxed">
            Selecione o tipo de projeto para visualizar a arquitetura técnica recomendada, entregáveis e prazo de execução:
          </p>
        </div>

        {/* Archetype Selector Tabs */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {ARCHETYPES.map((archetype) => {
              const Icon = archetype.icon;
              const isSelected = archetype.id === selectedId;

              return (
                <button
                  type="button"
                  key={archetype.id}
                  onClick={() => setSelectedId(archetype.id)}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-[95px] sm:h-[105px] cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#080D18] border-[#00D2F6] shadow-xl shadow-[#00D2F6]/15 scale-[1.02]'
                      : 'bg-[#080D18]/70 border-[#151F38] hover:border-[#00D2F6]/40 hover:bg-[#080D18]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isSelected ? 'text-[#00D2F6]' : 'text-[#AEB7C4] group-hover:text-white'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 font-bold'
                          : 'bg-[#050914] text-[#AEB7C4]'
                      }`}
                    >
                      {archetype.timeline}
                    </span>
                  </div>

                  <span
                    className={`text-xs sm:text-sm font-bold tracking-tight block truncate font-kanit uppercase ${
                      isSelected ? 'text-white' : 'text-[#AEB7C4] group-hover:text-white'
                    }`}
                  >
                    {archetype.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Blueprint Card Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArchetype.id}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl mx-auto rounded-3xl bg-[#080D18] border border-[#151F38] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              
              {/* Left Column: Solution Scope & Strategy (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[#00D2F6] font-mono text-[10px] sm:text-[11px] uppercase font-bold tracking-widest">
                      // ESCOPO E ARQUITETURA RECOMENDADA
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#00D2F6]/10 text-[#00D2F6] border border-[#00D2F6]/20 font-bold">
                      {currentArchetype.slaTag}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2 font-kanit uppercase">
                    {currentArchetype.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed">
                    {currentArchetype.description}
                  </p>
                </div>

                {/* Stack Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono text-[#AEB7C4]/70 block uppercase tracking-wider font-semibold">
                    Stack Tecnológica Recomendada:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentArchetype.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#050914] border border-[#151F38] text-[#00D2F6]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono text-[#AEB7C4]/70 block uppercase tracking-wider font-semibold">
                    O Que Será Entregue:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentArchetype.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#F3F5F7]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-light text-[11px] sm:text-xs leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Metrics & Direct Action (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#050914] rounded-2xl border border-[#151F38] p-5 space-y-4 shadow-inner">
                
                {/* Timeline Box */}
                <div className="flex items-center justify-between pb-3 border-b border-[#151F38]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00D2F6]" />
                    <span className="text-xs font-mono text-[#AEB7C4] uppercase">Prazo de Entrega</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono bg-[#080D18] px-3 py-1 rounded-lg border border-[#00D2F6]/30 text-[#00D2F6]">
                    {currentArchetype.timeline}
                  </span>
                </div>

                {/* Business Impact Box */}
                <div className="p-3.5 rounded-xl bg-[#00D2F6]/5 border border-[#00D2F6]/20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Zap className="w-4 h-4 text-[#00D2F6]" />
                    <span className="text-[10px] font-mono uppercase font-bold text-[#00D2F6] tracking-wider">
                      IMPACTO NO NEGÓCIO
                    </span>
                  </div>
                  <p className="text-xs text-[#CBD5E1] font-light leading-relaxed">
                    {currentArchetype.businessImpact}
                  </p>
                </div>

                {/* Direct Action Button */}
                <button
                  type="button"
                  onClick={handleStartProject}
                  className="w-full py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg hover:scale-102 active:scale-98 bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF]"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>SOLICITAR ESTE PROJETO NO WHATSAPP</span>
                </button>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectSimulator;
