import React, { useRef, useState, useEffect } from 'react';
import { motion, Variants, useMotionValue, useSpring } from 'framer-motion';
import {
  Zap,
  Bot,
  Code2,
  MessageCircle,
} from 'lucide-react';
import { HERO_DATA } from '../../data/portfolioData';
import { MagneticButton } from '../common/MagneticButton';
import { Iridescence } from '../common/Iridescence';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

interface HeroExecutiveProps {
  onContactClick: () => void;
}

export const HeroExecutive: React.FC<HeroExecutiveProps> = ({ onContactClick }) => {
  const heroRef = useRef<HTMLElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(-1);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);

  // Subtle Mouse Parallax Physics for Left Column Elements (Desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.1 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current || window.innerWidth < 1024) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 8; // Max 4px
    const y = ((e.clientY - top) / height - 0.5) * 8;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // IntersectionObserver to monitor Hero visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 9-Second Master Timeline Cycle for sequential service cards highlight when not hovered
  useEffect(() => {
    if (!isHeroVisible) return;

    const interval = setInterval(() => {
      setActiveCardIndex((prev) => {
        if (prev === 0) return 1;
        if (prev === 1) return 2;
        if (prev === 2) return -1;
        return 0;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isHeroVisible]);

  // Framer Motion Variants for Masked Headline Entrance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const lineMaskVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100dvh] h-auto lg:h-[100dvh] bg-[#03060C] text-[#F3F5F7] pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 flex items-center justify-center overflow-hidden z-10 select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. EFEITO IRIDESCENCE EM TODO O FUNDO DO HERO (O Efeito É o Hero, z-0)
         ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto z-0 opacity-45 lg:opacity-60">
        <Iridescence
          color={[0.0, 0.82, 0.96]} // Ciano Elétrico TCAI (#00D2F6)
          speed={0.7}
          amplitude={0.12}
          mouseReact={true}
        />

        {/* Scrims sutis de contraste para fusão suave com o fundo preto ônix (#03060C) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03060C]/95 via-[#03060C]/75 to-[#03060C]/40 pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#03060C] via-[#03060C]/70 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#03060C] via-[#03060C]/70 to-transparent pointer-events-none z-10" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT STREAM (À Frente do Efeito, z-20)
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center my-auto">
        
        {/* Left Column: Copywriting, Authority & High-Conversion CTAs */}
        <motion.div
          style={{ x: parallaxX, y: parallaxY }}
          className="lg:col-span-7 xl:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6 max-w-2xl lg:max-w-none mx-auto lg:mx-0"
        >
          {/* 1. Status Pill: Availability */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 10px rgba(0,210,246,0.2)',
                '0 0 24px rgba(0,210,246,0.5)',
                '0 0 10px rgba(0,210,246,0.2)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#060B18]/90 border border-[#00D2F6]/60 shadow-lg shadow-[#00D2F6]/15 backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D2F6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              {HERO_DATA.statusBadge}
            </span>
          </motion.div>

          {/* 2. ARTE THIAGO NO MOBILE / TABLET (Solta, sem card, com reflexo de base e rim light) */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:hidden w-full max-w-[320px] sm:max-w-[360px] md:max-w-[440px] my-2 sm:my-3 flex flex-col items-center justify-center relative select-none"
          >
            <div className="relative w-full flex flex-col items-center justify-center">
              <img
                src="/thiagotcai.png"
                alt="Thiago Cassol Antunes — Especialista em Tecnologia, Software e IA"
                className="w-full h-auto aspect-[1312/1199] max-h-[360px] sm:max-h-[400px] md:max-h-[440px] object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.72)] drop-shadow-[0_0_12px_rgba(0,210,246,0.14)] drop-shadow-[0_1px_3px_rgba(0,210,246,0.18)] transform-gpu"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />

              {/* Reflexo sutil de base integrado ao fundo no mobile */}
              <div className="absolute -bottom-1 inset-x-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-[66%] h-5 rounded-[100%] bg-gradient-to-r from-transparent via-[#00D2F6]/14 to-transparent blur-lg" />
                <div className="w-[48%] h-[1px] bg-gradient-to-r from-transparent via-[#00D2F6]/25 to-transparent blur-[0.6px] -mt-1.5" />
              </div>
            </div>
          </motion.div>

          {/* 3. Masked Editorial Luxury Headline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full relative"
          >
            {/* Line 1 Mask */}
            <div className="overflow-hidden pb-1">
              <motion.h1
                variants={lineMaskVariants}
                className="font-['Playfair_Display',serif] font-black uppercase tracking-tight text-white leading-[1.1] text-2xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[50px]"
              >
                {HERO_DATA.headlineP1}
              </motion.h1>
            </div>

            {/* Line 2 Mask */}
            <div className="overflow-hidden pb-2">
              <motion.div
                variants={lineMaskVariants}
                className="font-['Playfair_Display',serif] font-black uppercase tracking-tight text-white leading-[1.1] text-2xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[50px] drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)]"
              >
                {HERO_DATA.headlineP2}
              </motion.div>
            </div>
          </motion.div>

          {/* 4. Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#94A3B8] text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl xl:max-w-2xl"
          >
            {HERO_DATA.subtext}
          </motion.p>

          {/* 5. 3 SLA Service Cards with Direct Hover + Auto-Cycle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 py-1 sm:py-2 text-left"
          >
            {HERO_DATA.slaBadges.map((badge, idx) => {
              const isHighlighted = activeCardIndex === idx;
              const isFastTrack = idx === 0; // 3 Dias Úteis
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveCardIndex(idx)}
                  className={`p-3.5 rounded-2xl transition-all duration-300 shadow-lg cursor-pointer select-none backdrop-blur-md ${
                    isHighlighted
                      ? isFastTrack
                        ? 'bg-[#180F08]/95 border-2 border-[#FF6B35] shadow-[0_0_25px_rgba(255,107,53,0.4)] scale-[1.03]'
                        : 'bg-[#061226]/95 border-2 border-[#00D2F6] shadow-[0_0_25px_rgba(0,210,246,0.4)] scale-[1.03]'
                      : isFastTrack
                      ? 'bg-[#060B18]/85 border border-[#FF6B35]/40 hover:border-[#FF6B35] hover:bg-[#180F08]'
                      : 'bg-[#060B18]/85 border border-[#152238] hover:border-[#00D2F6]/70 hover:bg-[#081226]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {badge.icon === 'zap' && <Zap className={`w-4 h-4 transition-transform ${isHighlighted ? 'text-[#FF6B35] scale-110' : 'text-[#FF6B35]'}`} />}
                    {badge.icon === 'bot' && <Bot className={`w-4 h-4 transition-transform ${isHighlighted ? 'text-[#00D2F6] scale-110' : 'text-[#00D2F6]'}`} />}
                    {badge.icon === 'code' && <Code2 className={`w-4 h-4 transition-transform ${isHighlighted ? 'text-[#00D2F6] scale-110' : 'text-[#00D2F6]'}`} />}
                    <span className={`text-[11px] font-mono font-bold uppercase ${isFastTrack ? 'text-[#FF6B35]' : isHighlighted ? 'text-[#00D2F6]' : 'text-white'}`}>
                      {badge.time}
                    </span>
                  </div>
                  <div className={`text-xs font-medium transition-colors ${isHighlighted ? 'text-white' : 'text-[#94A3B8]'}`}>
                    {badge.type}
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* 6. Action CTAs with Magnetic Attraction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 sm:pt-2 w-full sm:w-auto"
          >
            {/* Magnetic WhatsApp Call-to-Action */}
            <MagneticButton strength={0.35}>
              <motion.a
                href={createQuickWhatsAppUrl('Novo Projeto pelo Hero')}
                target="_blank"
                rel="noreferrer"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 210, 246, 0.45)',
                    '0 0 35px rgba(0, 210, 246, 0.8)',
                    '0 0 20px rgba(0, 210, 246, 0.45)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-[#040C1A] border-2 border-[#00D2F6]"
              >
                <MessageCircle className="w-4 h-4 text-[#00D2F6]" />
                <span className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-kanit">
                  INICIAR PROJETO NO WHATSAPP →
                </span>
              </motion.a>
            </MagneticButton>

            {/* Secondary Link to Projects */}
            <a
              href="#projects"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#152238] hover:border-[#00D2F6] bg-[#060B18]/90 text-[#AEB7C4] hover:text-white text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_18px_rgba(0,210,246,0.25)]"
            >
              <span>VER CASES REAIS</span>
            </a>
          </motion.div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            Right Column: ARTE THIAGO NO DESKTOP (Solta, sem card, com reflexo de base e rim light)
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="hidden lg:flex lg:col-span-5 xl:col-span-5 items-center justify-center relative select-none z-20"
        >
          {/* Container limpo relativo, sem fundo e sem bordas */}
          <div className="relative w-full max-w-[490px] xl:max-w-[550px] 2xl:max-w-[600px] flex flex-col items-center justify-center">
            
            {/* Imagem com Rim Light e Sombra de Silhueta Orgânica */}
            <img
              src="/thiagotcai.png"
              alt="Thiago Cassol Antunes — Especialista em Tecnologia, Software e IA"
              className="w-full h-auto aspect-[1312/1199] max-h-[80vh] xl:max-h-[84vh] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.75)] drop-shadow-[0_0_15px_rgba(0,210,246,0.16)] drop-shadow-[0_2px_4px_rgba(0,210,246,0.22)] transform-gpu transition-transform duration-700 hover:scale-[1.01]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />

            {/* Glow Ambiente e Reflexo Discreto Estritamente na Base Inferior */}
            <div className="absolute -bottom-2 inset-x-0 flex flex-col items-center justify-center pointer-events-none">
              {/* Reflexo difuso elíptico na base do Hero */}
              <div className="w-[72%] h-7 rounded-[100%] bg-gradient-to-r from-transparent via-[#00D2F6]/14 to-transparent blur-xl" />
              {/* Linha de reflexo horizontal discreta integrada ao horizonte da base */}
              <div className="w-[55%] h-[1px] bg-gradient-to-r from-transparent via-[#00D2F6]/30 to-transparent blur-[0.8px] -mt-2" />
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroExecutive;
