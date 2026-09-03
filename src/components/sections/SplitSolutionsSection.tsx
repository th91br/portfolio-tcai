import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  Terminal,
  Cpu,
  Bot,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  GitBranch,
  Database,
  Layers,
  MessageCircle,
  Activity,
  Code2,
} from 'lucide-react';
import { createWhatsAppLeadUrl } from '../../utils/contactUtils';

export const SplitSolutionsSection: React.FC = () => {
  const handleContact = (solutionName: string, sla: string) => {
    const url = createWhatsAppLeadUrl({
      name: '',
      contact: '',
      interest: `${solutionName} (${sla})`,
      message: `Olá Thiago! Gostaria de conversar sobre a solução de ${solutionName} com prazo de ${sla}.`,
      origin: 'Seção de Soluções Zig-Zag (TCAI)',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="services"
      className="relative w-full bg-[#07111F] text-[#F3F5F7] py-24 sm:py-32 lg:py-36 px-4 sm:px-6 md:px-10 border-t border-white/[0.06] overflow-hidden z-10"
    >
      {/* Ambient background volumetric glow orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 246, 0.04) 0%, rgba(1, 94, 239, 0.02) 45%, transparent 70%)',
          filter: 'blur(160px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-0 w-[550px] h-[550px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 150, 245, 0.04) 0%, transparent 70%)',
          filter: 'blur(150px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER EDITORIAL                                                 */}
        {/* ========================================================================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 sm:mb-28"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1624] border border-[#00D2F6]/30 shadow-lg shadow-[#00D2F6]/10 backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              CAPACIDADES TÉCNICAS & SOLUÇÕES
            </span>
          </div>

          <h2 className="font-kanit font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#F8FAFC] leading-[1.08]">
            ENGENHARIA MODERNA. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] bg-clip-text text-transparent">
              SOLUÇÕES CONSTRUÍDAS PARA ESCALAR.
            </span>
          </h2>

          <p className="text-[#94A3B8] text-sm sm:text-base font-light leading-relaxed mt-4 max-w-[54ch]">
            Sem intermediários, sem plataformas lentas. Desenvolvimento sob medida com código 100% proprietário e agentes de IA integrados à sua operação.
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* BLOCO 1: DESENVOLVIMENTO WEB & SOFTWARE SOB MEDIDA (Left: Mockup, Right: Text) */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-28 sm:mb-36 lg:mb-44">
          
          {/* 1.1 Left Side: Tech Architecture & IDE Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:col-span-6 relative"
          >
            {/* Outer Machine Frame (Double-Bezel) */}
            <div className="relative rounded-2xl bg-[#050B14] border border-white/12 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-2 sm:p-3 overflow-hidden group hover:border-[#00D2F6]/40 transition-colors duration-500">
              
              {/* Window Header: macOS Traffic Lights & Active Tabs */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.07] bg-[#07111F]/80 rounded-t-xl">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#94A3B8]">
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-[#00D2F6]" /> App.tsx
                  </span>
                  <span className="hidden sm:inline opacity-60">api/checkout.ts</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 100/100
                </div>
              </div>

              {/* Mockup Body: Real Platform System Visual */}
              <div className="relative aspect-[16/10] rounded-b-xl overflow-hidden bg-[#030611] border border-white/[0.04]">
                <img
                  src="/assets/projects/prazoguard/prazoguard_dashboard.png"
                  alt="Dashboard e Arquitetura de Software Sob Medida — TCAI"
                  className="w-full h-full object-cover object-top filter brightness-[0.96] contrast-[1.04] transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />

                {/* Subtle scrim for deep contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/90 via-transparent to-transparent pointer-events-none" />

                {/* Floating Telemetry Badges */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#07111F]/90 border border-[#00D2F6]/30 backdrop-blur-md text-[10px] font-mono font-bold text-[#00D2F6]">
                    <Activity className="w-3 h-3 text-[#00D2F6]" />
                    <span>LATENCY: 0.04s • TBT: 0ms</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#07111F]/90 border border-white/10 backdrop-blur-md text-[10px] font-mono text-[#F1F5F9]">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Código 100% Proprietário</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* 1.2 Right Side: Technical Narrative & Ghost CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:col-span-6 flex flex-col items-start text-left space-y-5"
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#00D2F6]/25 text-[10px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              <span>01 / ENGENHARIA DE SOFTWARE & WEB</span>
            </div>

            {/* Headline */}
            <h3 className="font-kanit font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-[#F8FAFC] leading-[1.1]">
              Sistemas Proprietários, <br />
              <span className="text-[#00D2F6]">Rápidos e Sem Intermediários.</span>
            </h3>

            {/* Narrative Body */}
            <p className="text-[#94A3B8] text-sm sm:text-base font-light leading-relaxed">
              Desenvolvo aplicações web, landing pages de altíssima conversão e plataformas SaaS construídas com código limpo, arquitetura moderna (Next.js, React, Tailwind, Node) e bancos de dados de alta performance. Nada de plugins pesados ou templates genéricos que degradam sua reputação.
            </p>

            {/* Feature Bullets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-1">
              <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-[#00D2F6] shrink-0 mt-0.5" />
                <span>SEO Estruturado & Core Web Vitals 100/100</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-[#00D2F6] shrink-0 mt-0.5" />
                <span>Dashboards em Tempo Real & Painéis Adm</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-[#00D2F6] shrink-0 mt-0.5" />
                <span>Autenticação Segura & Módulos Financeiros</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-[#00D2F6] shrink-0 mt-0.5" />
                <span>100% Responsivo e Otimizado para Mobile</span>
              </div>
            </div>

            {/* Guaranteed SLA Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-xs font-mono font-bold text-[#00D2F6]">
              <Clock className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span>PRAZO GARANTIDO EM CONTRATO: 3 A 10 DIAS ÚTEIS</span>
            </div>

            {/* Micro-interactive Ghost Button CTA */}
            <div className="pt-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleContact('Desenvolvimento Web & Software', '3 a 10 dias úteis')}
                className="group w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/15 hover:border-[#00D2F6]/60 bg-white/[0.02] hover:bg-[#00D2F6]/10 text-white hover:text-[#00D2F6] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(0,210,246,0.2)] active:scale-[0.98]"
              >
                <span>SOLICITAR PROPOSTA DE SOFTWARE</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#00D2F6]" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* BLOCO 2: AUTOMAÇÃO INTELIGENTE & AGENTES DE IA (Left: Text, Right: Mockup) */}
        {/* ========================================================================= */}
        {/* Responsiveness: flex-col-reverse on mobile so Image is ALWAYS on top!     */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* 2.1 Left Side (Desktop) / Bottom Side (Mobile): Technical Narrative & Ghost CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:col-span-6 flex flex-col items-start text-left space-y-5"
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#0096F5]/30 text-[10px] font-mono font-bold tracking-widest text-[#0096F5] uppercase">
              <span>02 / INTELIGÊNCIA ARTIFICIAL & AUTOMAÇÃO</span>
            </div>

            {/* Headline */}
            <h3 className="font-kanit font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-[#F8FAFC] leading-[1.1]">
              Agentes Autônomos que <br />
              <span className="text-[#0096F5]">Operam 24/7 pelo seu Negócio.</span>
            </h3>

            {/* Narrative Body */}
            <p className="text-[#94A3B8] text-sm sm:text-base font-light leading-relaxed">
              Elimine gargalos manuais e tempos de espera. Projeto e implemento agentes cognitivos orientados a resultados, capazes de atender leads no WhatsApp, realizar triagens complexas, acionar webhooks e sincronizar CRMs e planilhas no piloto automático.
            </p>

            {/* Feature Bullets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-1">
              <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-[#0096F5] shrink-0 mt-0.5" />
                <span>Atendimento & Qualificação Cognitiva 24/7</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-[#0096F5] shrink-0 mt-0.5" />
                <span>Integração WhatsApp, CRMs e Bancos de Dados</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-[#0096F5] shrink-0 mt-0.5" />
                <span>Redução Drástica de Custos Operacionais</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-[#0096F5] shrink-0 mt-0.5" />
                <span>Disparo de Propostas e Contratos Automatizados</span>
              </div>
            </div>

            {/* Guaranteed SLA Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0096F5]/10 border border-[#0096F5]/30 text-xs font-mono font-bold text-[#0096F5]">
              <Clock className="w-3.5 h-3.5 text-[#0096F5]" />
              <span>PRAZO GARANTIDO EM CONTRATO: 7 DIAS ÚTEIS</span>
            </div>

            {/* Micro-interactive Ghost Button CTA */}
            <div className="pt-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleContact('Automação com IA & Agentes', '7 dias úteis')}
                className="group w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/15 hover:border-[#0096F5]/60 bg-white/[0.02] hover:bg-[#0096F5]/10 text-white hover:text-[#0096F5] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(0,150,245,0.2)] active:scale-[0.98]"
              >
                <span>SOLICITAR PROPOSTA DE AUTOMAÇÃO</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#0096F5]" />
              </button>
            </div>
          </motion.div>

          {/* 2.2 Right Side (Desktop) / Top Side (Mobile): AI Pipeline & Node Flow Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:col-span-6 relative"
          >
            {/* Outer Machine Frame (Double-Bezel) */}
            <div className="relative rounded-2xl bg-[#050B14] border border-white/12 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-4 sm:p-5 overflow-hidden group hover:border-[#0096F5]/40 transition-colors duration-500">
              
              {/* Window Header: Pipeline Status */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00D2F6] animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                    AI_AGENT_PIPELINE.WORKFLOW
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#00D2F6] px-2 py-0.5 rounded bg-[#00D2F6]/10 border border-[#00D2F6]/25">
                  ACTIVE 24/7
                </div>
              </div>

              {/* Node Diagram Visual Container */}
              <div className="relative w-full aspect-[16/10] rounded-xl bg-[#030712] border border-white/[0.05] p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
                
                {/* Visual Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Node Row 1: Trigger -> Cognition */}
                <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4">
                  
                  {/* Node 1: Webhook Trigger */}
                  <div className="p-3 rounded-xl bg-[#07111F]/90 border border-white/10 flex flex-col gap-1.5 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#94A3B8]">
                        <MessageCircle className="w-3.5 h-3.5 text-[#00D2F6]" />
                        <span>WHATSAPP INBOUND</span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="text-xs font-bold text-white uppercase font-kanit">
                      Recebimento do Lead
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B]">Payload instantâneo</div>
                  </div>

                  {/* Node 2: Cognitive LLM Engine */}
                  <div className="p-3 rounded-xl bg-[#07111F]/90 border border-[#00D2F6]/40 flex flex-col gap-1.5 shadow-lg shadow-[#00D2F6]/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#00D2F6]">
                        <Bot className="w-3.5 h-3.5 text-[#00D2F6]" />
                        <span>LLM COGNITIVE AGENT</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400">99.4%</span>
                    </div>
                    <div className="text-xs font-bold text-white uppercase font-kanit">
                      Triagem & Qualificação
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B]">Raciocínio com regras</div>
                  </div>

                </div>

                {/* Animated Flow Connector Arrow Line */}
                <div className="relative z-10 my-1 flex items-center justify-center gap-2 text-[10px] font-mono text-[#00D2F6]/80">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#00D2F6]/40 to-transparent" />
                  <span className="px-2 py-0.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/25">
                    LATÊNCIA: 42ms
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#00D2F6]/40 to-transparent" />
                </div>

                {/* Node Row 2: Vector Search -> Autonomous Action */}
                <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4">
                  
                  {/* Node 3: Vector Memory */}
                  <div className="p-3 rounded-xl bg-[#07111F]/90 border border-white/10 flex flex-col gap-1.5 shadow-md">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#94A3B8]">
                      <Database className="w-3.5 h-3.5 text-[#0096F5]" />
                      <span>VECTOR MEMORY (RAG)</span>
                    </div>
                    <div className="text-xs font-bold text-white uppercase font-kanit">
                      Consulta a Regras
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B]">Base de conhecimento</div>
                  </div>

                  {/* Node 4: Autonomous Action */}
                  <div className="p-3 rounded-xl bg-[#07111F]/90 border border-emerald-500/40 flex flex-col gap-1.5 shadow-md">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>AUTONOMOUS ACTION</span>
                    </div>
                    <div className="text-xs font-bold text-white uppercase font-kanit">
                      Agendamento & CRM
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B]">Atualização imediata</div>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default SplitSolutionsSection;
