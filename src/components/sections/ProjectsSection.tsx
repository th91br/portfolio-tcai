import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/portfolioData';
import { ProjectItem } from '../../types';
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Sparkles, Code2, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { openWhatsApp } from '../../utils/contactUtils';

interface ProjectsSectionProps {
  onProjectSelect: (project: ProjectItem) => void;
  onContactClick?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onProjectSelect,
  onContactClick,
}) => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const currentProject = PROJECTS_DATA[activeProjectIndex];

  const handleNext = () => {
    setActiveProjectIndex((prev) => (prev + 1) % PROJECTS_DATA.length);
  };

  const handlePrev = () => {
    setActiveProjectIndex((prev) => (prev - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length);
  };

  const handleAction = (project: ProjectItem) => {
    if (project.isCtaCard) {
      openWhatsApp('project');
    } else {
      onProjectSelect(project);
    }
  };

  return (
    <section
      id="projects"
      className="relative w-full bg-[#050914] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-[#151F38] overflow-hidden z-10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[600px] h-[500px] bg-[#00D2F6]/5 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* 1. Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18] border border-[#151F38] shadow-inner mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
                CASES REAIS • CÓDIGO PROPRIETÁRIO
              </span>
            </div>

            <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              PROJETOS & RESULTADOS EM PRODUÇÃO
            </h2>
          </div>

          {/* Previous / Next Controls */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xs font-mono text-[#AEB7C4] tracking-wider">
              {String(activeProjectIndex + 1).padStart(2, '0')} / {String(PROJECTS_DATA.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6] text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                aria-label="Projeto anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6] text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                aria-label="Próximo projeto"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Project Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {PROJECTS_DATA.map((proj, idx) => {
            const isActive = idx === activeProjectIndex;
            const isSpecial = proj.isCtaCard;
            return (
              <button
                type="button"
                key={proj.id}
                onClick={() => setActiveProjectIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? isSpecial
                      ? 'bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-white font-bold border-[#00D2F6] shadow-[0_0_20px_rgba(0,210,246,0.4)]'
                      : 'bg-[#00D2F6] text-black font-bold border-[#00D2F6] shadow-[0_0_15px_rgba(0,210,246,0.3)]'
                    : isSpecial
                    ? 'bg-[#080D18] text-[#00D2F6] border-[#00D2F6]/40 hover:bg-[#00D2F6]/10'
                    : 'bg-[#080D18] text-[#AEB7C4] border-[#151F38] hover:text-white hover:border-[#00D2F6]/40'
                }`}
              >
                <span>{proj.number}</span>
                {isSpecial && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />}
                <span className="font-sans font-bold">{proj.name.split('—')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Active Project Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full rounded-3xl bg-[#080D18] border p-5 sm:p-7 md:p-8 backdrop-blur-xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center transition-all ${
              currentProject.isCtaCard
                ? 'border-[#00D2F6]/50 shadow-[0_0_40px_rgba(0,210,246,0.15)] bg-gradient-to-br from-[#080D18] via-[#0A1329] to-[#050914]'
                : 'border-[#151F38] hover:border-[#00D2F6]/40'
            }`}
          >
            {/* Left: Enhanced Browser Mockup Viewport */}
            <div className="lg:col-span-7 flex flex-col space-y-2">
              <div className="rounded-2xl bg-[#050914] border border-[#151F38] overflow-hidden shadow-2xl">
                {/* Browser Top Chrome */}
                <div className="px-4 py-2.5 bg-[#080D18] border-b border-[#151F38] flex items-center justify-between text-xs font-mono text-[#AEB7C4]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="truncate max-w-[220px] sm:max-w-xs text-[#00D2F6] font-mono text-[11px] px-3 py-0.5 rounded bg-[#050914] border border-[#151F38]">
                    {currentProject.isCtaCard ? 'https://tcai.com.br/iniciar-projeto' : currentProject.liveUrl || 'https://tcai.com.br'}
                  </div>
                  {currentProject.liveUrl && !currentProject.isCtaCard ? (
                    <a
                      href={currentProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00D2F6] hover:text-white transition-colors flex items-center gap-1 text-xs font-mono"
                      title="Abrir em nova aba"
                    >
                      <span className="hidden sm:inline">Visitar</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Project Screenshot Viewport */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 group">
                  {currentProject.isCtaCard ? (
                    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#030712] via-[#060D1E] to-[#02050E]">
                      <div className="absolute inset-0 bg-[radial-gradient(#00D2F6_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                      
                      <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-[#00D2F6]" />
                          <span className="text-xs sm:text-sm font-mono text-white font-bold tracking-wider uppercase">
                            ARQUITETURA SOB MEDIDA • TCAI
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
                          ● Vagas Abertas
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 relative z-10 py-4">
                        <div className="p-3 rounded-xl bg-black/50 border border-[#00D2F6]/30 text-center space-y-1.5 backdrop-blur-sm">
                          <Cpu className="w-5 h-5 text-[#00D2F6] mx-auto" />
                          <div className="text-xs font-mono font-bold text-white uppercase">Sites 3 Dias</div>
                          <div className="text-[9px] text-[#AEB7C4]">Next.js • React • Vite</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-[#015EEF]/40 text-center space-y-1.5 backdrop-blur-sm">
                          <Zap className="w-5 h-5 text-[#015EEF] mx-auto" />
                          <div className="text-xs font-mono font-bold text-white uppercase">IA 7 Dias</div>
                          <div className="text-[9px] text-[#AEB7C4]">WhatsApp • Agentes 24/7</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-center space-y-1.5 backdrop-blur-sm">
                          <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                          <div className="text-xs font-mono font-bold text-white uppercase">Software 10D</div>
                          <div className="text-[9px] text-[#AEB7C4]">100% Proprietário</div>
                        </div>
                      </div>

                      <div className="relative z-10 bg-black/80 rounded-xl p-2.5 font-mono text-[10px] sm:text-xs text-[#CBD5E1] border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[#00D2F6]">const</span> projeto = <span className="text-amber-300">new</span> TCAI_Project(<span className="text-emerald-400">"Sua Empresa"</span>);
                        </div>
                        <span className="text-[10px] text-[#AEB7C4] hidden sm:inline">Entrega garantida</span>
                      </div>
                    </div>
                  ) : currentProject.col2Image || currentProject.col1TopImage ? (
                    <img
                      src={currentProject.col2Image || currentProject.col1TopImage}
                      alt={currentProject.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                      [Interface em Produção]
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Project Details & Action Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${
                      currentProject.isCtaCard
                        ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                        : 'bg-[#00D2F6]/10 text-[#00D2F6] border-[#00D2F6]/20'
                    }`}
                  >
                    {currentProject.category}
                  </span>
                  {currentProject.year && (
                    <span className="text-xs font-mono text-[#AEB7C4]">
                      Ano {currentProject.year}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-tight font-kanit">
                  {currentProject.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed">
                  {currentProject.description}
                </p>
              </div>

              {/* Technologies Stack */}
              {currentProject.technologies && currentProject.technologies.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-[#AEB7C4]/70 block uppercase tracking-wider mb-2 font-semibold">
                    {currentProject.isCtaCard ? 'O Que Podemos Construir' : 'Tecnologias & Entregáveis'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                          currentProject.isCtaCard
                            ? 'bg-[#00D2F6]/10 border-[#00D2F6]/30 text-[#00D2F6] font-medium'
                            : 'bg-[#050914] border-[#151F38] text-[#AEB7C4]'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleAction(currentProject)}
                  className={`py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
                    currentProject.isCtaCard
                      ? 'bg-gradient-to-r from-[#00D2F6] to-[#015EEF] hover:from-[#38bdf8] hover:to-[#2563eb] text-white shadow-[#00D2F6]/30'
                      : 'bg-[#00D2F6] hover:bg-[#38bdf8] text-black shadow-[#00D2F6]/20'
                  }`}
                >
                  <span>{currentProject.isCtaCard ? 'INICIAR MEU PROJETO AGORA' : 'VER DETALHES DO CASE'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {currentProject.liveUrl && !currentProject.isCtaCard && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#050914] hover:bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <span>Site ao Vivo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#00D2F6]" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection;
