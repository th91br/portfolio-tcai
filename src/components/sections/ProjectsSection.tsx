import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PROJECTS_DATA, PROJECTS_HEADER } from '../../data/portfolioData';
import { ProjectItem } from '../../types';
import { LiveProjectButton } from '../common/LiveProjectButton';
import { FadeIn } from '../common/FadeIn';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProjectsSectionProps {
  onProjectSelect: (project: ProjectItem) => void;
  onContactClick?: () => void;
}

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
  onProjectSelect: (project: ProjectItem) => void;
  onContactClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalCards,
  onProjectSelect,
  onContactClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  const handleCardAction = () => {
    if (project.isCtaCard && onContactClick) {
      onContactClick();
    } else {
      onProjectSelect(project);
    }
  };

  return (
    <div
      ref={containerRef}
      className="sticky top-20 sm:top-24 md:top-28 w-full max-w-6xl mx-auto flex items-center justify-center mb-16 sm:mb-20 md:mb-28"
      style={{
        top: `calc(5rem + ${index * 28}px)`,
      }}
    >
      <motion.div
        style={{
          scale: cardScale,
          transformOrigin: 'top center',
        }}
        className={`w-full bg-[#080D18] border rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden relative group/card transition-all duration-300 ${
          project.isCtaCard
            ? 'border-[#00D2F6]/60 shadow-[0_0_50px_rgba(0,210,246,0.15)] hover:border-[#00D2F6]'
            : 'border-[#151F38] hover:border-[#00D2F6]/30'
        }`}
      >
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-[#151F38]">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
            {/* Project Number */}
            <span
              className={`font-black leading-none select-none tracking-tight ${
                project.isCtaCard ? 'text-[#00D2F6]' : 'text-[#F3F5F7]'
              }`}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {project.number}
            </span>

            {/* Category & Name */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-[#00D2F6] uppercase tracking-widest flex items-center gap-2">
                [{project.category}]
                {project.isCtaCard && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00D2F6]/20 border border-[#00D2F6]/40 text-[#00D2F6] animate-pulse">
                    SEU PROJETO
                  </span>
                )}
              </span>
              <h3
                className="font-bold text-[#F3F5F7] uppercase tracking-tight"
                style={{ fontSize: 'clamp(1.2rem, 3vw, 2.4rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <LiveProjectButton
              label={project.ctaButtonLabel || 'VER PROJETO'}
              onClick={handleCardAction}
            />
          </div>
        </div>

        {/* Bottom Two-Column Grid */}
        {project.isCtaCard ? (
          /* Specialized Custom Layout for Card 05 (CTA Master) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
            {/* Left Column (5/12) */}
            <div className="md:col-span-5 flex flex-col gap-4 sm:gap-5 md:gap-6">
              {/* Left Top Preview: Logo TCA Official Brand Card */}
              <div
                onClick={handleCardAction}
                className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#050914] border border-[#151F38] cursor-pointer group flex flex-col shadow-lg hover:border-[#00D2F6]/60 transition-all duration-300"
              >
                {/* Mini Browser Bar */}
                <div className="w-full bg-[#080D18] px-3.5 py-2 border-b border-[#151F38] flex items-center justify-between select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]/70" />
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]/70" />
                    <div className="w-2 h-2 rounded-full bg-[#10B981]/70" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#00D2F6] truncate max-w-[180px]">
                    tca-digital.com.br/marca
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase text-[#AEB7C4] tracking-wider">
                    IDENTIDADE
                  </span>
                </div>

                {/* Logo Presentation Frame */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#080D18] p-5 flex flex-col items-center justify-center text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D2F6]/10 via-[#080D18] to-[#050914]" />
                  <img
                    src="/assets/branding/tca_logo.png"
                    alt="Logo TCA - Thiago C. Antunes"
                    className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-contain relative z-10 drop-shadow-[0_10px_25px_rgba(0,210,246,0.3)] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="relative z-10 mt-3 flex flex-wrap gap-1.5 justify-center">
                    {['Sites', 'Landing Pages', 'Software', 'SaaS', 'Automação'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#050914]/80 border border-white/10 text-[#AEB7C4]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Left Bottom Preview: Capabilities & Solution Matrix */}
              <div
                onClick={handleCardAction}
                className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#050914] border border-[#151F38] cursor-pointer group flex flex-col shadow-lg hover:border-[#00D2F6]/60 transition-all duration-300"
              >
                {/* Mini Browser Bar */}
                <div className="w-full bg-[#080D18] px-3.5 py-2 border-b border-[#151F38] flex items-center justify-between select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]/70" />
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]/70" />
                    <div className="w-2 h-2 rounded-full bg-[#10B981]/70" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#00D2F6] truncate max-w-[180px]">
                    tcai.com.br/capacidades
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase text-[#10B981] tracking-wider">
                    SOLUÇÕES
                  </span>
                </div>

                {/* Capabilities List */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#080D18] p-4 sm:p-5 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00D2F6] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-white leading-tight">
                          Sites & Landing Pages de Alta Conversão
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[#AEB7C4] font-light">
                          Autoridade visual e persuasão para campanhas e empresas.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00D2F6] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-white leading-tight">
                          Softwares Sob Medida & SaaS com IA
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[#AEB7C4] font-light">
                          Automação de processos, dashboards e arquiteturas escaláveis.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="pt-2 border-t border-[#151F38] flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#00D2F6] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                      Agenda aberta para novos projetos
                    </span>
                    <span className="text-[10px] font-mono text-[#AEB7C4]">2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7/12) - Thiago Studio Photo & High-Impact CTA Frame */}
            <div
              onClick={handleCardAction}
              className="md:col-span-7 relative w-full h-full min-h-[360px] md:min-h-0 rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#050914] border border-[#00D2F6]/50 cursor-pointer group flex flex-col shadow-2xl hover:border-[#00D2F6] transition-all duration-300"
            >
              {/* Top Browser Bar */}
              <div className="w-full bg-[#080D18] px-4 py-2.5 border-b border-[#151F38] flex items-center justify-between select-none flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                </div>
                <div className="px-3.5 py-0.5 rounded-md bg-[#050914] border border-[#00D2F6]/40 text-xs font-mono text-[#00D2F6] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6] animate-pulse" />
                  <span className="truncate max-w-[220px]">tcai.com.br/iniciar-projeto</span>
                </div>
                <span className="text-xs text-[#00D2F6] font-bold hidden sm:inline-block uppercase tracking-wider">
                  Consultoria & Desenvolvimento
                </span>
              </div>

              {/* Viewport with Thiago Photo and Interactive Overlay */}
              <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-[#050914]">
                <img
                  src="/assets/branding/thiago_studio.jpg"
                  alt="Thiago Cassol Antunes - Studio TCA"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                  loading="lazy"
                />

                {/* Scrim & CTA Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5 sm:px-7 bg-gradient-to-t from-[#050914]/98 via-[#050914]/85 to-transparent flex flex-col justify-end">
                  <div className="inline-flex items-center gap-2 mb-2 text-xs font-bold text-[#00D2F6] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
                    <span>Seu Próximo Passo Digital</span>
                  </div>

                  <h4 className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight mb-1.5">
                    Pronto para tirar sua ideia do papel com qualidade máxima?
                  </h4>

                  <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed mb-4 max-w-xl">
                    Vamos conversar sobre seu projeto, avaliar o cenário e construir uma solução digital sob medida com estratégia, design e tecnologia de ponta.
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardAction();
                      }}
                      className="btn-brand-primary px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(0,210,246,0.5)] transition-all"
                    >
                      <span>VAMOS CRIAR MEU PROJETO</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Layout for Projects 01-04 */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
            {/* Left Column (5/12 width on md+) - 2 stacked detail preview cards */}
            <div className="md:col-span-5 flex flex-col gap-4 sm:gap-5 md:gap-6">
              {/* Left Top Preview (e.g. Dashboard / Internal View) */}
              <div
                onClick={() => onProjectSelect(project)}
                className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#050914] border border-[#151F38] cursor-pointer group flex flex-col shadow-lg hover:border-[#00D2F6]/60 transition-all duration-300"
              >
                {/* Mini Browser Bar */}
                <div className="w-full bg-[#080D18] px-3.5 py-2 border-b border-[#151F38] flex items-center justify-between select-none flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]/70" />
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]/70" />
                    <div className="w-2 h-2 rounded-full bg-[#10B981]/70" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#AEB7C4]/70 truncate max-w-[180px]">
                    {(project.liveUrl || '').replace('https://', '').replace(/\/$/, '')}
                  </span>
                  <div className="w-6" />
                </div>

                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#050914] flex items-center justify-center p-0.5">
                  <img
                    src={project.col1TopImage}
                    alt={`${project.name} preview 1`}
                    className="w-full h-full object-contain object-center transition-all duration-300 group-hover:brightness-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#080D18]/90 backdrop-blur-md border border-[#00D2F6]/40 text-[#00D2F6] shadow-lg flex items-center gap-1">
                      Ampliar ↗
                    </span>
                  </div>
                </div>
              </div>

              {/* Left Bottom Preview (e.g. Features / Flow View) */}
              <div
                onClick={() => onProjectSelect(project)}
                className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#050914] border border-[#151F38] cursor-pointer group flex flex-col shadow-lg hover:border-[#00D2F6]/60 transition-all duration-300"
              >
                {/* Mini Browser Bar */}
                <div className="w-full bg-[#080D18] px-3.5 py-2 border-b border-[#151F38] flex items-center justify-between select-none flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]/70" />
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]/70" />
                    <div className="w-2 h-2 rounded-full bg-[#10B981]/70" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#00D2F6] truncate max-w-[180px]">
                    Recursos & Telas Internas
                  </span>
                  <div className="w-6" />
                </div>

                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#050914] flex items-center justify-center p-0.5">
                  <img
                    src={project.col1BottomImage}
                    alt={`${project.name} preview 2`}
                    className="w-full h-full object-contain object-center transition-all duration-300 group-hover:brightness-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#080D18]/90 backdrop-blur-md border border-[#00D2F6]/40 text-[#00D2F6] shadow-lg flex items-center gap-1">
                      Ampliar ↗
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7/12 width on md+) - Main Featured Hero Interface Viewport */}
            <div
              onClick={() => onProjectSelect(project)}
              className="md:col-span-7 relative w-full h-full min-h-[340px] md:min-h-0 rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#050914] border border-[#151F38] cursor-pointer group flex flex-col shadow-xl hover:border-[#00D2F6]/60 transition-all duration-300"
            >
              {/* Top Browser Bar */}
              <div className="w-full bg-[#080D18] px-4 py-2.5 border-b border-[#151F38] flex items-center justify-between select-none flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                </div>
                <div className="px-3.5 py-0.5 rounded-md bg-[#050914] border border-[#151F38] text-xs font-mono text-[#00D2F6] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6] animate-pulse" />
                  <span className="truncate max-w-[220px]">{(project.liveUrl || '').replace('https://', '')}</span>
                </div>
                <span className="text-xs text-[#AEB7C4] font-medium hidden sm:inline-block uppercase tracking-wider">
                  Página Principal
                </span>
              </div>

              {/* Main Full Screenshot Viewport (Displays the full UI design crisp & uncropped) */}
              <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-[#050914] flex items-center justify-center p-1">
                <img
                  src={project.col2Image}
                  alt={`${project.name} main feature`}
                  className="w-full h-full object-contain object-center transition-all duration-300 group-hover:brightness-105"
                  loading="lazy"
                />
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#080D18]/90 backdrop-blur-md border border-[#00D2F6]/50 text-white shadow-xl flex items-center gap-1.5">
                    <span>Ver Projeto Completo</span>
                    <span className="text-[#00D2F6]">↗</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

        )}
      </motion.div>
    </div>
  );

};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onProjectSelect,
  onContactClick,
}) => {
  return (
    <section
      id="projects"
      className="relative w-full bg-[#050914] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-24 z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Heading */}
        <FadeIn delay={0} y={30} className="w-full text-center mb-6 sm:mb-8">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center select-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            {PROJECTS_HEADER.title}
          </h2>
        </FadeIn>

        {/* Opening Intro Text */}
        <FadeIn delay={0.15} y={20} className="max-w-3xl mx-auto text-center mb-16 sm:mb-20 md:mb-28 px-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-4">
            {PROJECTS_HEADER.openingHeadline}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-[#AEB7C4] font-light leading-relaxed">
            {PROJECTS_HEADER.openingDescription}
          </p>
        </FadeIn>

        {/* Sticky Stacking Cards */}
        <div className="relative w-full pb-10">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              totalCards={PROJECTS_DATA.length}
              onProjectSelect={onProjectSelect}
              onContactClick={onContactClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

