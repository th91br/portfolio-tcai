import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Globe,
  Zap,
  Cpu,
  Layers,
  Bot,
  CheckCircle2,
  Activity,
  Database,
  Terminal,
} from 'lucide-react';
import { FadeIn } from '../common/FadeIn';

interface WhatICreateSectionProps {
  onSelectService?: (serviceName: string) => void;
  onContactClick?: () => void;
}

export const WhatICreateSection: React.FC<WhatICreateSectionProps> = ({
  onSelectService,
  onContactClick,
}) => {
  const handleCardClick = (serviceName: string) => {
    if (onSelectService) {
      onSelectService(serviceName);
    } else if (onContactClick) {
      onContactClick();
    }
  };

  return (
    <section
      id="services"
      className="relative w-full bg-[#050914] text-[#F3F5F7] px-4 sm:px-8 md:px-10 pt-24 sm:pt-32 md:pt-36 pb-24 sm:pb-32 overflow-hidden z-10 border-t border-[#151F38]"
    >
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[400px] bg-[#00D2F6]/5 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 w-[550px] h-[350px] bg-[#015EEF]/5 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 md:mb-24 px-2">
          {/* Top Pill Badge */}
          <FadeIn delay={0} y={20} className="inline-block mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18] border border-[#151F38] shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#00D2F6] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#00D2F6]">
                SERVIÇOS & ESPECIALIDADES
              </span>
            </div>
          </FadeIn>

          {/* Big Main Title */}
          <FadeIn delay={0.1} y={25} className="w-full mb-3 sm:mb-4">
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight text-center select-none"
              style={{ fontSize: 'clamp(2.5rem, 8.5vw, 120px)' }}
            >
              O QUE EU CRIO
            </h2>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={0.2} y={20}>
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-3 sm:mb-4">
              DA IDEIA À SOLUÇÃO DIGITAL.
            </h3>
          </FadeIn>

          {/* Support Description */}
          <FadeIn delay={0.3} y={20}>
            <p className="text-xs sm:text-base md:text-lg text-[#AEB7C4] font-light leading-relaxed max-w-2xl mx-auto">
              Projetos digitais pensados para resolver problemas reais, otimizar processos e transformar oportunidades em soluções funcionais.
            </p>
          </FadeIn>
        </div>

        {/* Asymmetric Bento Grid Composition */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-7">
          
          {/* ========================================================= */}
          {/* CARD 03 (FEATURED): SOFTWARE & SISTEMAS (7/12 col on lg) */}
          {/* ========================================================= */}
          <FadeIn
            delay={0.1}
            y={30}
            className="w-full col-span-1 lg:col-span-7 flex flex-col"
          >
            <div
              onClick={() => handleCardClick('Software & Sistemas')}
              className="group relative w-full h-full rounded-[24px] sm:rounded-[36px] md:rounded-[40px] bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6]/60 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Inner ambient corner glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00D2F6]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-[#00D2F6]/20 transition-all duration-500" />

              {/* Card Header: Number & Category Badge */}
              <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="font-kanit font-black text-3xl sm:text-5xl text-[#151F38] group-hover:text-[#00D2F6] transition-colors duration-300 select-none">
                    03
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/20 text-[#00D2F6]">
                    SOFTWARE & SISTEMAS
                  </span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#050914] border border-[#151F38] group-hover:border-[#00D2F6]/60 flex items-center justify-center text-[#AEB7C4] group-hover:text-[#00D2F6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Abstract Interactive Software Interface Mockup */}
              <div className="relative z-10 my-3 sm:my-4 p-3 sm:p-4 rounded-2xl bg-[#050914] border border-[#151F38] shadow-inner">
                {/* Micro App Top Bar */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#151F38]/80 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]/80" />
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]/80" />
                    <div className="w-2 h-2 rounded-full bg-[#10B981]/80" />
                    <span className="ml-2 text-[#AEB7C4]/60 text-[10px] hidden sm:inline">
                      system://core-engine/v2.4
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-[#00D2F6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6] animate-pulse" />
                    <span>24ms • 99.9% Uptime</span>
                  </div>
                </div>

                {/* Micro Layout: Sidebar + Data Widgets */}
                <div className="grid grid-cols-12 gap-2 sm:gap-3">
                  {/* Left Mini Sidebar */}
                  <div className="col-span-3 space-y-1.5 hidden sm:block">
                    <div className="px-2 py-1 rounded bg-[#080D18] border border-[#151F38] text-[10px] font-mono text-[#00D2F6] font-semibold flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-[#00D2F6]" />
                      <span>Painel</span>
                    </div>
                    <div className="px-2 py-1 rounded text-[10px] font-mono text-[#7E8998] flex items-center gap-1.5">
                      <Database className="w-3 h-3" />
                      <span>Dados</span>
                    </div>
                    <div className="px-2 py-1 rounded text-[10px] font-mono text-[#7E8998] flex items-center gap-1.5">
                      <Terminal className="w-3 h-3" />
                      <span>Rotinas</span>
                    </div>
                  </div>

                  {/* Main Data & KPI Grid */}
                  <div className="col-span-12 sm:col-span-9 space-y-2">
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      <div className="p-2 rounded-xl bg-[#080D18] border border-[#151F38]">
                        <span className="text-[8px] sm:text-[9px] font-mono text-[#7E8998] block">OPERAÇÕES</span>
                        <span className="text-[11px] sm:text-xs font-bold text-white font-mono">1.840/dia</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#080D18] border border-[#151F38]">
                        <span className="text-[8px] sm:text-[9px] font-mono text-[#7E8998] block">LATÊNCIA</span>
                        <span className="text-[11px] sm:text-xs font-bold text-[#00D2F6] font-mono">&lt; 30ms</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#080D18] border border-[#151F38]">
                        <span className="text-[8px] sm:text-[9px] font-mono text-[#7E8998] block">PRECISÃO</span>
                        <span className="text-[11px] sm:text-xs font-bold text-emerald-400 font-mono">100%</span>
                      </div>
                    </div>

                    {/* Dynamic Pipeline Status Bars */}
                    <div className="p-2 rounded-xl bg-[#080D18] border border-[#151F38] flex items-center justify-between text-[9px] sm:text-[10px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[#AEB7C4]">Sincronização de Banco & API</span>
                      </div>
                      <span className="text-[#00D2F6] font-semibold">ATIVO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Title & Strategic Description */}
              <div className="mt-3 sm:mt-4 relative z-10">
                <h4 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white mb-1.5 group-hover:text-[#00D2F6] transition-colors">
                  Soluções sob medida
                </h4>
                <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed">
                  Software e sistemas desenvolvidos para organizar operações, simplificar processos e solucionar necessidades específicas do negócio.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* ========================================================= */}
          {/* CARD 01: SITES PROFISSIONAIS (5/12 col on lg) */}
          {/* ========================================================= */}
          <FadeIn
            delay={0.2}
            y={30}
            className="w-full col-span-1 lg:col-span-5 flex flex-col"
          >
            <div
              onClick={() => handleCardClick('Sites Profissionais')}
              className="group relative w-full h-full rounded-[24px] sm:rounded-[36px] md:rounded-[40px] bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6]/60 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Inner ambient corner glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#00D2F6]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-[#00D2F6]/20 transition-all duration-500" />

              {/* Card Header */}
              <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="font-kanit font-black text-3xl sm:text-5xl text-[#151F38] group-hover:text-[#00D2F6] transition-colors duration-300 select-none">
                    01
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/20 text-[#00D2F6]">
                    SITES
                  </span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#050914] border border-[#151F38] group-hover:border-[#00D2F6]/60 flex items-center justify-center text-[#AEB7C4] group-hover:text-[#00D2F6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Abstract Browser Composition Graphic */}
              <div className="relative z-10 my-3 sm:my-4 p-3.5 sm:p-4 rounded-2xl bg-[#050914] border border-[#151F38] shadow-inner space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#151F38] text-[10px] font-mono text-[#AEB7C4]/70">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00D2F6]/80" />
                    <span>suamarca.com.br</span>
                  </div>
                  <Globe className="w-3.5 h-3.5 text-[#00D2F6]" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gradient-to-r from-[#00D2F6]/30 to-transparent" />
                  <div className="h-2 w-full rounded bg-white/5" />
                  <div className="h-2 w-5/6 rounded bg-white/5" />
                  <div className="pt-2 flex items-center gap-1.5 sm:gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#080D18] border border-[#151F38] text-[8px] sm:text-[9px] font-mono text-[#00D2F6]">
                      DESKTOP
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#080D18] border border-[#151F38] text-[8px] sm:text-[9px] font-mono text-[#00D2F6]">
                      TABLET
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#080D18] border border-[#151F38] text-[8px] sm:text-[9px] font-mono text-[#00D2F6]">
                      MOBILE
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3 sm:mt-4 relative z-10">
                <h4 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white mb-1.5 group-hover:text-[#00D2F6] transition-colors">
                  Sites profissionais
                </h4>
                <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed">
                  Experiências digitais modernas, responsivas e estratégicas para apresentar sua marca, fortalecer autoridade e transformar visitas em oportunidades.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* ========================================================= */}
          {/* CARD 02: LANDING PAGES (4/12 col on lg) */}
          {/* ========================================================= */}
          <FadeIn
            delay={0.15}
            y={30}
            className="w-full col-span-1 lg:col-span-4 flex flex-col"
          >
            <div
              onClick={() => handleCardClick('Landing Pages')}
              className="group relative w-full h-full rounded-[24px] sm:rounded-[36px] md:rounded-[40px] bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6]/60 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Inner ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#00D2F6]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-[#00D2F6]/20 transition-all duration-500" />

              {/* Card Header */}
              <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="font-kanit font-black text-3xl sm:text-5xl text-[#151F38] group-hover:text-[#00D2F6] transition-colors duration-300 select-none">
                    02
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/20 text-[#00D2F6]">
                    LANDING PAGES
                  </span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#050914] border border-[#151F38] group-hover:border-[#00D2F6]/60 flex items-center justify-center text-[#AEB7C4] group-hover:text-[#00D2F6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Abstract Conversion Funnel Graphic */}
              <div className="relative z-10 my-3 sm:my-4 p-3.5 sm:p-4 rounded-2xl bg-[#050914] border border-[#151F38] shadow-inner space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#00D2F6]">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#00D2F6]" />
                    HIERARQUIA VISUAL
                  </span>
                  <span className="text-emerald-400 font-bold">+CONVERSÃO</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080D18] border border-[#151F38] space-y-1.5">
                  <div className="h-3 w-5/6 rounded bg-[#00D2F6]/30" />
                  <div className="h-1.5 w-full rounded bg-white/10" />
                  <div className="h-6 w-full rounded-lg bg-gradient-to-r from-[#00D2F6] to-[#015EEF] flex items-center justify-center text-[9px] font-bold text-white uppercase tracking-wider">
                    CTA / Ação Imediata
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3 sm:mt-4 relative z-10">
                <h4 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white mb-1.5 group-hover:text-[#00D2F6] transition-colors">
                  Landing Pages que convertem
                </h4>
                <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed">
                  Páginas desenvolvidas com estratégia, hierarquia visual e experiência do usuário para campanhas, serviços, produtos e geração de leads.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* ========================================================================= */}
          {/* CARD 05 (FEATURED SPECIAL): AGENTES DE IA (8/12 col on lg) */}
          {/* ========================================================================= */}
          <FadeIn
            delay={0.25}
            y={30}
            className="w-full col-span-1 lg:col-span-8 flex flex-col"
          >
            <div
              onClick={() => handleCardClick('Agentes de IA & Automação')}
              className="group relative w-full h-full rounded-[24px] sm:rounded-[36px] md:rounded-[40px] bg-[#080D18] border border-[#00D2F6]/40 hover:border-[#00D2F6] p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer shadow-[0_0_40px_rgba(0,210,246,0.08)]"
            >
              {/* Inner ambient corner glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#00D2F6]/15 via-[#015EEF]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-[#00D2F6]/30 transition-all duration-500" />

              {/* Card Header */}
              <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="font-kanit font-black text-3xl sm:text-5xl text-[#00D2F6] group-hover:text-white transition-colors duration-300 select-none">
                    05
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#00D2F6]/20 border border-[#00D2F6]/50 text-[#00D2F6] animate-pulse">
                    AGENTES DE IA & AUTOMAÇÃO
                  </span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#050914] border border-[#00D2F6]/50 group-hover:border-[#00D2F6] flex items-center justify-center text-[#00D2F6] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Animated Intelligent Flow: ENTRADA -> ANALISAR -> EXECUTAR */}
              <div className="relative z-10 my-3 sm:my-4 p-3.5 sm:p-5 rounded-2xl bg-[#050914] border border-[#151F38] group-hover:border-[#00D2F6]/30 transition-colors shadow-inner">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#151F38] text-[11px] font-mono">
                  <span className="text-[#AEB7C4] flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-[#00D2F6]" />
                    Fluxo Autônomo de Inteligência
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    24/7 OPERACIONAL
                  </span>
                </div>

                {/* 3 Interactive Connected Nodes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 relative items-center">
                  {/* Node 1: ENTRADA */}
                  <div className="p-3 rounded-xl bg-[#080D18] border border-[#151F38] group-hover:border-[#00D2F6]/30 transition-all flex flex-col justify-between h-[80px] sm:h-[86px]">
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#7E8998]">
                      <span>01. GATILHO</span>
                      <span className="w-2 h-2 rounded-full bg-[#00D2F6] animate-pulse" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block uppercase tracking-wider">ENTRADA</span>
                      <span className="text-[10px] text-[#AEB7C4] font-light">Lead / Evento / API</span>
                    </div>
                  </div>

                  {/* Node 2: ANALISAR (IA CORE) */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#080D18] to-[#00D2F6]/10 border border-[#00D2F6]/40 shadow-[0_0_20px_rgba(0,210,246,0.1)] flex flex-col justify-between h-[80px] sm:h-[86px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-[#00D2F6]/20 rounded-full blur-lg pointer-events-none" />
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#00D2F6]">
                      <span>02. RACIOCÍNIO</span>
                      <Cpu className="w-3.5 h-3.5 text-[#00D2F6] animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#00D2F6] block uppercase tracking-wider">ANALISAR</span>
                      <span className="text-[10px] text-[#F3F5F7] font-light">Agente IA & Regras</span>
                    </div>
                  </div>

                  {/* Node 3: EXECUTAR */}
                  <div className="p-3 rounded-xl bg-[#080D18] border border-[#151F38] group-hover:border-[#00D2F6]/30 transition-all flex flex-col justify-between h-[80px] sm:h-[86px]">
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#7E8998]">
                      <span>03. DESFECHO</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block uppercase tracking-wider">EXECUTAR</span>
                      <span className="text-[10px] text-[#AEB7C4] font-light">Ação / CRM / Entrega</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3 sm:mt-4 relative z-10">
                <h4 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white mb-1.5 group-hover:text-[#00D2F6] transition-colors">
                  Automação inteligente
                </h4>
                <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed">
                  Agentes e automações com Inteligência Artificial para executar tarefas, integrar processos, agilizar operações e aumentar produtividade.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* ========================================================================= */}
          {/* CARD 04: SAAS & MICRO-SAAS (Full width 12/12 col on lg) */}
          {/* ========================================================================= */}
          <FadeIn
            delay={0.3}
            y={30}
            className="w-full col-span-1 lg:col-span-12 flex flex-col"
          >
            <div
              onClick={() => handleCardClick('SaaS & Micro-SaaS')}
              className="group relative w-full rounded-[24px] sm:rounded-[36px] md:rounded-[40px] bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6]/60 p-5 sm:p-7 md:p-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 sm:gap-8 overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Inner ambient glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#015EEF]/10 via-[#00D2F6]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-[#00D2F6]/20 transition-all duration-500" />

              {/* Left Column: Text & Value Proposition */}
              <div className="lg:w-1/2 flex flex-col justify-between relative z-10 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-kanit font-black text-3xl sm:text-5xl text-[#151F38] group-hover:text-[#00D2F6] transition-colors duration-300 select-none">
                    04
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/20 text-[#00D2F6]">
                    SAAS & MICRO-SAAS
                  </span>
                </div>

                <div>
                  <h4 className="text-xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-2 sm:mb-3 group-hover:text-[#00D2F6] transition-colors">
                    Produtos digitais escaláveis
                  </h4>
                  <p className="text-xs sm:text-sm md:text-base text-[#AEB7C4] font-light leading-relaxed">
                    Plataformas desenvolvidas para transformar ideias em produtos digitais reais, estruturados para crescer, evoluir e atender usuários com segurança e alta performance.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                  {['Multi-Tenant', 'Assinaturas & Cobrança', 'Arquitetura em Nuvem', 'APIs & Webhooks'].map((item) => (
                    <span
                      key={item}
                      className="text-[9px] sm:text-[11px] font-mono px-2.5 sm:px-3 py-1 rounded-lg bg-[#050914] border border-[#151F38] text-[#AEB7C4]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Layered Multi-Tenant Platform Architecture Graphic */}
              <div className="lg:w-1/2 w-full relative z-10 p-3.5 sm:p-5 rounded-2xl bg-[#050914] border border-[#151F38] shadow-inner space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#151F38] text-[10px] sm:text-[11px] font-mono text-[#AEB7C4]">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#00D2F6]" />
                    Camadas da Plataforma
                  </span>
                  <span className="text-[#00D2F6] font-bold">ESCALABILIDADE PRONTA</span>
                </div>

                {/* 3 Layer Bars */}
                <div className="space-y-2 text-[10px] sm:text-[11px] font-mono">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#080D18] border border-[#151F38] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00D2F6]" />
                      <span className="text-white font-medium truncate">Interface do Usuário & Painel Web</span>
                    </div>
                    <span className="text-[#00D2F6] text-[9px] sm:text-[10px] flex-shrink-0 ml-2">CAMADA 03</span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#080D18] border border-[#151F38] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0096F5]" />
                      <span className="text-white font-medium truncate">Regras de Negócio, Autenticação & Cobrança</span>
                    </div>
                    <span className="text-[#0096F5] text-[9px] sm:text-[10px] flex-shrink-0 ml-2">CAMADA 02</span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#080D18] border border-[#151F38] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#015EEF]" />
                      <span className="text-white font-medium truncate">Infraestrutura em Nuvem, Banco & Segurança</span>
                    </div>
                    <span className="text-[#015EEF] text-[9px] sm:text-[10px] flex-shrink-0 ml-2">CAMADA 01</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
};
