import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/portfolioData';
import { ProjectItem } from '../../types';
import { ZoomReveal } from '../common/ZoomReveal';
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
      className="relative w-full h-full min-h-[100dvh] bg-transparent text-[#F3F5F7] px-4 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-5 overflow-y-auto overflow-x-hidden flex flex-col justify-center select-none"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 my-auto">
        {/* 1. Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 mb-2 sm:mb-2.5">
          <div>
            <ZoomReveal delay={0.05} className="inline-block mb-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#060B18]/90 border border-[#00D2F6]/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6] animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
                  CASES REAIS • CÓDIGO PROPRIETÁRIO
                </span>
              </div>
            </ZoomReveal>

            <ZoomReveal delay={0.1}>
              <h2 className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight text-white leading-none">
                Projetos &amp; Soluções em Produção
              </h2>
            </ZoomReveal>
          </div>

          {/* Previous / Next Controls */}
          <ZoomReveal delay={0.15} className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider">
              {String(activeProjectIndex + 1).padStart(2, '0')} / {String(PROJECTS_DATA.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="w-7 h-7 rounded-full bg-[#060B18] border border-white/10 hover:border-[#00D2F6] text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                aria-label="Projeto anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="w-7 h-7 rounded-full bg-[#060B18] border border-white/10 hover:border-[#00D2F6] text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                aria-label="Próximo projeto"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </ZoomReveal>
        </div>

        {/* 2. Project Tabs Navigation */}
        <ZoomReveal delay={0.15} className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 sm:mb-3 scrollbar-none">
          {PROJECTS_DATA.map((proj, idx) => {
            const isActive = idx === activeProjectIndex;
            const isSpecial = proj.isCtaCard;
            return (
              <button
                key={proj.id}
                onClick={() => setActiveProjectIndex(idx)}
                className={`px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                  isActive
                    ? isSpecial
                      ? 'bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-white font-bold border-[#00D2F6] shadow-[0_0_16px_rgba(0,210,246,0.4)]'
                      : 'bg-[#00D2F6] text-black font-bold border-[#00D2F6] shadow-[0_0_12px_rgba(0,210,246,0.3)]'
                    : isSpecial
                    ? 'bg-[#060B18]/90 text-[#00D2F6] border-[#00D2F6]/40 hover:bg-[#00D2F6]/10'
                    : 'bg-[#060B18]/80 text-[#94A3B8] border-white/10 hover:text-white hover:border-[#00D2F6]/40'
                }`}
              >
                <span>{proj.number}</span>
                {isSpecial && <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />}
                <span className="font-sans font-bold">{proj.name.split('—')[0]}</span>
              </button>
            );
          })}
        </ZoomReveal>

        {/* 3. Active Project Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full rounded-2xl bg-[#060B18]/90 border p-3.5 sm:p-5 md:p-5.5 backdrop-blur-xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center transition-all ${
              currentProject.isCtaCard
                ? 'border-[#00D2F6]/40 shadow-[0_0_30px_rgba(0,210,246,0.15)] bg-gradient-to-br from-[#060B18] via-[#081124] to-[#040814]'
                : 'border-white/10 hover:border-[#00D2F6]/30'
            }`}
          >
            {/* Left: Enhanced Browser Mockup Viewport (7.5 cols on desktop for large site view) */}
            <div className="lg:col-span-7 flex flex-col space-y-1.5">
              <div className="rounded-xl bg-[#020408] border border-white/10 overflow-hidden shadow-2xl">
                {/* Browser Top Chrome */}
                <div className="px-3 py-1.5 bg-[#060B18] border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="truncate max-w-[200px] sm:max-w-xs text-[#00D2F6] font-mono text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/5">
                    {currentProject.isCtaCard ? 'https://tcai.com.br/seu-projeto' : currentProject.liveUrl || 'https://tcai.com.br'}
                  </div>
                  {currentProject.liveUrl && !currentProject.isCtaCard ? (
                    <a
                      href={currentProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00D2F6] hover:text-white transition-colors flex items-center gap-1 text-[10px] font-mono"
                      title="Abrir em nova aba"
                    >
                      <span className="hidden sm:inline">Visitar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <div className="w-3 h-3" />
                  )}
                </div>

                {/* Project Screenshot Viewport (Enlarged Aspect Ratio & Clean Quality) */}
                <div className="relative aspect-[16/9.5] min-h-[190px] sm:min-h-[230px] md:min-h-[250px] lg:min-h-[270px] w-full overflow-hidden bg-black/50 group">
                  {currentProject.isCtaCard ? (
                    /* Bespoke Impeccable Blueprint Canvas for 'Seu Projeto Aqui' */
                    <div className="w-full h-full p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#030712] via-[#060D1E] to-[#02050E]">
                      {/* Grid background effect */}
                      <div className="absolute inset-0 bg-[radial-gradient(#00D2F6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
                      
                      {/* Blueprint Top Header */}
                      <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-[#00D2F6]" />
                          <span className="text-[10px] sm:text-[11px] font-mono text-white font-bold tracking-wider uppercase">
                            ARQUITETURA SOB MEDIDA • TCAI
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
                          ● Vagas Abertas
                        </span>
                      </div>

                      {/* Blueprint Visual Matrix */}
                      <div className="grid grid-cols-3 gap-2 relative z-10 py-2">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-[#00D2F6]/30 text-center space-y-1 backdrop-blur-sm">
                          <Cpu className="w-4 h-4 text-[#00D2F6] mx-auto" />
                          <div className="text-[10px] font-mono font-bold text-white uppercase">Full-Stack</div>
                          <div className="text-[8px] text-[#94A3B8]">Next.js • React • Node</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-[#015EEF]/40 text-center space-y-1 backdrop-blur-sm">
                          <Zap className="w-4 h-4 text-[#015EEF] mx-auto" />
                          <div className="text-[10px] font-mono font-bold text-white uppercase">Automações</div>
                          <div className="text-[8px] text-[#94A3B8]">WhatsApp • APIs • IA</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/30 text-center space-y-1 backdrop-blur-sm">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
                          <div className="text-[10px] font-mono font-bold text-white uppercase">100% Seu</div>
                          <div className="text-[8px] text-[#94A3B8]">Sem Mensalidade</div>
                        </div>
                      </div>

                      {/* Blueprint Bottom Code Snippet */}
                      <div className="relative z-10 bg-black/70 rounded-lg p-2 font-mono text-[9px] text-[#CBD5E1] border border-white/10 flex items-center justify-between">
                        <span className="text-[#00D2F6]">const</span> seuSoftware = <span className="text-amber-300">new</span> TCAI_Project(<span className="text-emerald-400">"Sua Empresa"</span>);
                        <span className="text-[8px] text-[#64748B] hidden sm:inline">// 2-4 semanas para deploy</span>
                      </div>
                    </div>
                  ) : currentProject.col2Image || currentProject.col1TopImage ? (
                    <img
                      src={currentProject.col2Image || currentProject.col1TopImage}
                      alt={currentProject.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
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

            {/* Right: Project Details & Action Column (5 cols on desktop) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className={`text-[8px] sm:text-[9px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                      currentProject.isCtaCard
                        ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                        : 'bg-[#00D2F6]/10 text-[#00D2F6] border-[#00D2F6]/20'
                    }`}
                  >
                    {currentProject.category}
                  </span>
                  {currentProject.year && (
                    <span className="text-[9px] font-mono text-[#94A3B8]">
                      Ano {currentProject.year}
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white mb-1.5 leading-tight">
                  {currentProject.name}
                </h3>

                <p className="text-[11px] sm:text-xs text-[#CBD5E1] font-light leading-relaxed line-clamp-3">
                  {currentProject.description}
                </p>
              </div>

              {/* Technologies Stack / Deliverables Pills */}
              {currentProject.technologies && currentProject.technologies.length > 0 && (
                <div>
                  <span className="text-[8px] font-mono text-[#64748B] block uppercase tracking-wider mb-1 font-semibold">
                    {currentProject.isCtaCard ? 'O Que Podemos Construir' : 'Tecnologias Utilizadas'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {currentProject.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                          currentProject.isCtaCard
                            ? 'bg-[#00D2F6]/10 border-[#00D2F6]/30 text-[#00D2F6] font-medium'
                            : 'bg-[#020408] border-white/10 text-slate-300'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dual Action CTAs */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleAction(currentProject)}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-98 ${
                    currentProject.isCtaCard
                      ? 'bg-gradient-to-r from-[#00D2F6] to-[#015EEF] hover:from-[#38bdf8] hover:to-[#2563eb] text-white shadow-[#00D2F6]/30'
                      : 'bg-[#00D2F6] hover:bg-[#38bdf8] text-black shadow-[#00D2F6]/20'
                  }`}
                >
                  <span>{currentProject.isCtaCard ? 'Iniciar Meu Projeto Agora' : 'Ver Detalhes do Projeto'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                {currentProject.liveUrl && !currentProject.isCtaCard && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#020408] hover:bg-[#060B18] border border-white/10 hover:border-[#00D2F6] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Site ao Vivo</span>
                    <ExternalLink className="w-3 h-3 text-[#00D2F6]" />
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
