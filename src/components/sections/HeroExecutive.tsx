import React, { useRef } from 'react';
import { motion, Variants, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import {
  MessageCircle,
  ArrowDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { HERO_DATA } from '../../data/portfolioData';
import { MagneticButton } from '../common/MagneticButton';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

interface HeroExecutiveProps {
  onContactClick: () => void;
}

export const HeroExecutive: React.FC<HeroExecutiveProps> = ({ onContactClick }) => {
  const heroRef = useRef<HTMLElement>(null);

  // Cinematic Scroll-Driven Parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const founderY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const founderScale = useTransform(scrollYProgress, [0, 1], [1, 1.025]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  // Subtle Mouse Physics for Interactive Parallax on Desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 32, stiffness: 180, mass: 0.08 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 6;
    const y = ((e.clientY - top) / height - 0.5) * 6;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.03,
      },
    },
  };

  const lineMaskVariants: Variants = {
    hidden: { y: 28, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const telemetryItems = [
    {
      num: '01',
      title: 'SITES & LANDING PAGES',
      sla: '3 DIAS ÚTEIS',
      desc: 'Alta Conversão & SEO 100/100',
    },
    {
      num: '02',
      title: 'AUTOMAÇÕES & AGENTES IA',
      sla: '7 DIAS ÚTEIS',
      desc: 'Operação e Triagem 24/7',
    },
    {
      num: '03',
      title: 'SOFTWARES & SAAS',
      sla: '10 DIAS ÚTEIS',
      desc: 'Código 100% Proprietário',
    },
  ];

  return (
    <section
      ref={heroRef}
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[94vh] lg:min-h-screen w-full bg-[#07111F] text-[#F3F5F7] pt-20 sm:pt-24 lg:pt-28 pb-10 lg:pb-8 px-4 sm:px-6 md:px-10 flex flex-col justify-end overflow-hidden z-10 select-none"
    >
      {/* ========================================================================= */}
      {/* 1. LAYER 0: MONUMENTAL ARCHITECTURAL WATERMARK & VOLUMETRIC STUDIO LIGHT   */}
      {/* ========================================================================= */}

      {/* A. Massive Background Typography Spanning Hero */}
      <motion.div
        style={{ y: watermarkY }}
        className="absolute top-[14%] sm:top-[12%] lg:top-[10%] inset-x-0 w-full flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-kanit font-black text-[17vw] lg:text-[14vw] leading-none tracking-tighter bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent bg-clip-text text-transparent uppercase whitespace-nowrap text-center">
          TECNOLOGIA & IA
        </span>
      </motion.div>

      {/* B. Studio Chiaroscuro Volumetric Lighting */}
      <div
        className="absolute top-[35%] lg:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[650px] lg:w-[850px] h-[380px] sm:h-[480px] pointer-events-none rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 246, 0.12) 0%, rgba(1, 94, 239, 0.05) 45%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        aria-hidden="true"
      />

      {/* Ambient Radial Backlight behind the protagonist's holographic orbit */}
      <div
        className="hidden lg:block absolute bottom-10 right-[8%] w-[680px] h-[580px] pointer-events-none rounded-full z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 210, 246, 0.09) 0%, rgba(1, 94, 239, 0.04) 50%, transparent 75%)',
          filter: 'blur(90px)',
        }}
        aria-hidden="true"
      />

      {/* C. Precision Optical Reticle (Desktop) */}
      <div
        className="hidden lg:flex absolute top-[44%] left-[54%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03] pointer-events-none z-0 items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[82%] h-[82%] rounded-full border border-[#00D2F6]/[0.05] border-dashed" />
        <div className="w-[60%] h-[60%] rounded-full border border-white/[0.02]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. LAYER 1: THE PROTAGONIST & CYBER HORIZON — THIAGO CASSOL ANTUNES (DESKTOP Z-10) */}
      {/* ========================================================================= */}
      {/* Positioned expansively in high fidelity: transparent PNG with pure hardware rendering */}
      <motion.div
        style={{
          x: smoothMouseX,
          y: founderY,
          scale: founderScale,
        }}
        className="hidden lg:flex absolute bottom-0 right-[-4%] xl:right-[-1%] 2xl:right-[2%] z-10 pointer-events-none items-end justify-end h-[700px] xl:h-[780px] 2xl:h-[840px] w-auto max-w-[80vw] select-none"
      >
        <div
          className="relative h-full flex items-end justify-end"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.5) 92%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.5) 92%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src="/hero.2.tca.png"
            alt="Thiago Cassol Antunes — Arquiteto de Software & Engenheiro de IA"
            className="h-full w-auto object-contain object-bottom select-none"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
            loading="eager"
            {...({ fetchpriority: 'high' } as any)}
            decoding="async"
          />
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. LAYER 2: ASYMMETRIC EDITORIAL STAGE (Z-20)                              */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col justify-end">
        
        {/* DESKTOP VIEWPORT LAYOUT (lg+) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-end w-full pb-6">
          
          {/* Left Flank: High-Impact Semantic Editorial Copy & CTAs (6 cols) */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="col-span-6 flex flex-col items-start text-left space-y-4"
          >
            {/* Status Pill: Live Availability */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1624]/90 border border-[#00D2F6]/30 shadow-lg shadow-[#00D2F6]/10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#00D2F6] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
                {HERO_DATA.statusBadge}
              </span>
            </motion.div>

            {/* Headline with Monumental Editorial Typography */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full relative"
            >
              <div className="overflow-hidden pb-1">
                <motion.h1
                  variants={lineMaskVariants}
                  className="font-kanit font-black uppercase tracking-tight leading-[1.04] text-left text-4xl xl:text-[48px] 2xl:text-[54px] bg-gradient-to-r from-white via-[#F8FAFC] to-[#94A3B8] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
                >
                  {HERO_DATA.headlineP1}
                </motion.h1>
              </div>

              <div className="overflow-hidden pb-1">
                <motion.div
                  variants={lineMaskVariants}
                  className="font-kanit font-black uppercase tracking-tight leading-[1.04] text-left text-4xl xl:text-[48px] 2xl:text-[54px] bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(0,210,246,0.3)]"
                >
                  {HERO_DATA.headlineP2}
                </motion.div>
              </div>
            </motion.div>

            {/* Strategic Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="text-[#94A3B8] text-sm sm:text-base font-light leading-relaxed max-w-[44ch] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
            >
              {HERO_DATA.subtext}
            </motion.p>

            {/* CTAs: WhatsApp Primary & Cases Secondary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="flex items-center gap-3 pt-2"
            >
              <MagneticButton strength={0.2}>
                <a
                  href={createQuickWhatsAppUrl('Novo Projeto pelo Hero')}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative pl-5 pr-2 py-3 rounded-full text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl shadow-[#00D2F6]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2F6]"
                >
                  <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] font-kanit">
                    INICIAR PROJETO NO WHATSAPP
                  </span>
                  <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 shadow-inner">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                  </span>
                </a>
              </MagneticButton>

              <a
                href="#projects"
                className="group px-5 py-3 rounded-full border border-white/12 hover:border-[#00D2F6]/50 bg-[#07111F]/60 hover:bg-white/[0.06] text-[#CBD5E1] hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2F6]"
              >
                <span>VER CASES REAIS</span>
                <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5 text-[#00D2F6]" />
              </a>
            </motion.div>
          </motion.div>

          {/* Spacer for center presence of Thiago (3 cols) */}
          <div className="col-span-3 pointer-events-none" />

          {/* Right Flank: Architectural Telemetry (3 cols) with artwork in background */}
          <motion.div
            style={{ opacity: contentOpacity }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="col-span-3 flex flex-col items-end text-right space-y-4 z-20"
          >
            {/* Header Tag with glowing cyan accent */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624]/80 border border-[#00D2F6]/30 shadow-lg shadow-[#00D2F6]/10 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span className="text-[10px] font-mono text-[#00D2F6] uppercase tracking-widest font-bold">
                SLA DE ENTREGA RECORD
              </span>
            </div>

            {/* SLA Telemetry Items floating cleanly over the holographic artwork */}
            <div className="w-full space-y-3 max-w-[280px]">
              {telemetryItems.map((item) => (
                <div
                  key={item.num}
                  className="pb-2.5 border-b border-white/[0.12] flex flex-col items-end group backdrop-blur-[2px]"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-[#00D2F6] font-bold">
                      {item.num}
                    </span>
                    <span className="text-xs font-bold text-white uppercase font-kanit tracking-tight group-hover:text-[#00D2F6] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#CBD5E1] font-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                      {item.desc}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#00D2F6] px-2 py-0.5 rounded-full bg-[#00D2F6]/15 border border-[#00D2F6]/40 backdrop-blur-md shadow-[0_0_12px_rgba(0,210,246,0.2)]">
                      {item.sla}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Proprietary Code Guarantee */}
            <div className="pt-1 flex flex-col items-end text-right">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#F1F5F9] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold">Código 100% Proprietário</span>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8] mt-0.5">
                Caxias do Sul / RS • Atendimento Global
              </span>
            </div>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET VIEWPORT LAYOUT (< lg)                                    */}
        {/* ========================================================================= */}
        <div className="flex lg:hidden flex-col items-center text-center space-y-5 w-full pt-4">
          
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1624]/90 border border-[#00D2F6]/30 shadow-sm shadow-[#00D2F6]/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00D2F6] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              {HERO_DATA.statusBadge}
            </span>
          </div>

          {/* Headline */}
          <div className="w-full">
            <h1 className="font-kanit font-black uppercase tracking-tight leading-[1.08] text-3xl sm:text-4xl bg-gradient-to-r from-white via-[#F8FAFC] to-[#94A3B8] bg-clip-text text-transparent">
              {HERO_DATA.headlineP1}
            </h1>
            <div className="font-kanit font-black uppercase tracking-tight leading-[1.08] text-3xl sm:text-4xl bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] bg-clip-text text-transparent mt-0.5">
              {HERO_DATA.headlineP2}
            </div>
          </div>

          {/* Thiago Mobile/Tablet Centerstage Frame (Grand Transparent Presence) */}
          <div className="relative w-full max-w-[480px] sm:max-w-[620px] h-[340px] sm:h-[440px] flex items-end justify-center my-1">
            <div
              className="relative h-full w-full flex items-end justify-center"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.4) 92%, rgba(0,0,0,0) 100%)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.4) 92%, rgba(0,0,0,0) 100%)',
              }}
            >
              <img
                src="/hero.2.tca.png"
                alt="Thiago Cassol Antunes — Arquiteto de Software & Engenheiro de IA"
                className="h-full w-auto object-contain object-bottom select-none"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                }}
                loading="eager"
                {...({ fetchpriority: 'high' } as any)}
                decoding="async"
              />
            </div>
          </div>

          {/* Subtext */}
          <p className="text-[#94A3B8] text-xs sm:text-sm font-light leading-relaxed max-w-[38ch]">
            {HERO_DATA.subtext}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-md pt-1">
            <a
              href={createQuickWhatsAppUrl('Novo Projeto pelo Hero')}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-5 rounded-full text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-[#00D2F6]/25 bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/25 cursor-pointer"
            >
              <span className="font-kanit">INICIAR PROJETO NO WHATSAPP</span>
              <MessageCircle className="w-3.5 h-3.5 text-white" />
            </a>

            <a
              href="#projects"
              className="w-full py-2.5 px-5 rounded-full border border-white/10 bg-white/[0.03] text-[#94A3B8] hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>VER CASES REAIS</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#00D2F6]" />
            </a>
          </div>

          {/* Mobile Telemetry Strip */}
          <div className="w-full max-w-sm pt-4 border-t border-white/[0.08] flex items-center justify-around text-center">
            {telemetryItems.map((item) => (
              <div key={item.num} className="flex flex-col items-center">
                <span className="text-[9px] font-mono font-bold text-[#00D2F6]">
                  {item.sla}
                </span>
                <span className="text-[10px] font-bold text-[#CBD5E1] uppercase font-kanit mt-0.5">
                  {item.num} {item.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroExecutive;
