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
      className="relative w-full bg-[#08131F] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-white/[0.06] overflow-hidden z-10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[600px] h-[500px] bg-[#00D2F6]/5 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* 1. Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#00D2F6]/25 shadow-sm mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
                04 / CASES REAIS EM PRODUÇÃO
              </span>
            </div>

            <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F8FAFC] leading-tight">
              PROJETOS & RESULTADOS REAIS
            </h2>
          </div>

          {/* Previous / Next Controls */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xs font-mono text-[#94A3B8] tracking-wider">
              {String(activeProjectIndex + 1).padStart(2, '0')} / {String(PROJECTS_DATA.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-[#0A1624] border border-white/[0.08] hover:border-[#00D2F6] text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Projeto anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-[#0A1624] border border-white/[0.08] hover:border-[#00D2F6] text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
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
                      ? 'bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-white font-bold border-[#00D2F6] shadow-lg shadow-[#00D2F6]/20'
                      : 'bg-[#00D2F6] text-black font-bold border-[#00D2F6] shadow-md shadow-[#00D2F6]/20'
                    : isSpecial
                    ? 'bg-[#0A1624] text-[#00D2F6] border-[#00D2F6]/30 hover:bg-[#00D2F6]/10'
                    : 'bg-[#0A1624] text-[#94A3B8] border-white/[0.08] hover:text-white hover:border-[#00D2F6]/40'
                }`}
              >
                <span className="opacity-70">{proj.number}</span>
                {isSpecial && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />}
                <span className="font-sans font-semibold">{proj.name.split('—')[0]}</span>
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
            className={`w-full rounded-3xl bg-[#0A1624]/80 border p-5 sm:p-7 md:p-8 backdrop-blur-xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center transition-all ${
              currentProject.isCtaCard
                ? 'border-[#00D2F6]/50 shadow-[0_0_40px_rgba(0,210,246,0.12)] bg-gradient-to-br from-[#07111F] via-[#0A1624] to-[#07111F]'
                : 'border-white/[0.08] hover:border-[#00D2F6]/40'
            }`}
          >
            {/* Left: Enhanced Browser Mockup Viewport */}
            <div className="lg:col-span-7 flex flex-col space-y-2">
              <div className="rounded-2xl bg-[#050B14] border border-white/[0.08] overflow-hidden shadow-2xl">
                {/* Browser Top Chrome */}
                <div className="px-4 py-2.5 bg-[#07111F] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="truncate max-w-[220px] sm:max-w-xs text-[#00D2F6] font-mono text-[11px] px-3 py-0.5 rounded bg-[#050B14] border border-white/[0.06]">
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
                    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#07111F] via-[#0A1624] to-[#050B14]">
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
                          <div className="text-[9px] text-[#94A3B8]">React • Vite • TS</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-[#015EEF]/40 text-center space-y-1.5 backdrop-blur-sm">
                          <Zap className="w-5 h-5 text-[#015EEF] mx-auto" />
                          <div className="text-xs font-mono font-bold text-white uppercase">IA 7 Dias</div>
                          <div className="text-[9px] text-[#94A3B8]">WhatsApp • Agentes</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-center space-y-1.5 backdrop-blur-sm">
                          <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                          <div className="text-xs font-mono font-bold text-white uppercase">Software 10D</div>
                          <div className="text-[9px] text-[#94A3B8]">100% Proprietário</div>
                        </div>
                      </div>

                      <div className="relative z-10 bg-black/80 rounded-xl p-2.5 font-mono text-[10px] sm:text-xs text-[#CBD5E1] border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[#00D2F6]">const</span> projeto = <span className="text-amber-300">new</span> TCAI_Project(<span className="text-emerald-400">"Sua Empresa"</span>);
                        </div>
                        <span className="text-[10px] text-[#94A3B8] hidden sm:inline">Entrega garantida</span>
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
                    <span className="text-xs font-mono text-[#94A3B8]">
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
                  <span className="text-[10px] font-mono text-[#94A3B8] block uppercase tracking-wider mb-2 font-semibold">
                    {currentProject.isCtaCard ? 'O Que Podemos Construir' : 'Tecnologias & Entregáveis'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProject.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.03] border border-white/[0.06] text-[#CBD5E1]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAction(currentProject)}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    currentProject.isCtaCard
                      ? 'bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] text-white shadow-lg shadow-[#00D2F6]/20'
                      : 'bg-white text-black hover:bg-[#00D2F6] hover:text-black border border-white'
                  }`}
                >
                  <span>{currentProject.isCtaCard ? 'INICIAR PROJETO NO WHATSAPP' : 'VER DETALHES DO CASE'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                {currentProject.liveUrl && !currentProject.isCtaCard && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-[#00D2F6] text-[#94A3B8] hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span>Abrir Live</span>
                    <ExternalLink className="w-3 h-3" />
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
