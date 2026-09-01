import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

// ─────────────────────────────────────────────────────────────
// 1. COMPONENTE: Partículas Ópticas Flutuantes no Espaço 3D
// ─────────────────────────────────────────────────────────────
const HeroFloatingParticles: React.FC<{ isVisible: boolean }> = React.memo(({ isVisible }) => {
  const particles = useMemo(() => [
    { id: 1, top: '16%', left: '8%', size: 3, color: '#00D2F6', opacity: 0.35, duration: 12, delay: 0 },
    { id: 2, top: '28%', left: '22%', size: 2, color: '#FFFFFF', opacity: 0.25, duration: 15, delay: 2 },
    { id: 3, top: '65%', left: '12%', size: 3.5, color: '#00D2F6', opacity: 0.30, duration: 14, delay: 1 },
    { id: 4, top: '82%', left: '28%', size: 2, color: '#38BDF8', opacity: 0.20, duration: 16, delay: 3 },
    { id: 5, top: '14%', left: '78%', size: 2.5, color: '#00D2F6', opacity: 0.35, duration: 13, delay: 0.5 },
    { id: 6, top: '24%', left: '92%', size: 4, color: '#0088CC', opacity: 0.25, duration: 18, delay: 2.5 },
    { id: 7, top: '48%', left: '84%', size: 2, color: '#FFFFFF', opacity: 0.30, duration: 11, delay: 1.5 },
    { id: 8, top: '72%', left: '74%', size: 3, color: '#00D2F6', opacity: 0.28, duration: 15, delay: 4 },
    { id: 9, top: '88%', left: '88%', size: 2.5, color: '#38BDF8', opacity: 0.22, duration: 17, delay: 3 },
    { id: 10, top: '38%', left: '48%', size: 2, color: '#00D2F6', opacity: 0.18, duration: 19, delay: 1 },
    { id: 11, top: '58%', left: '52%', size: 2.5, color: '#FFFFFF', opacity: 0.20, duration: 14, delay: 5 },
    { id: 12, top: '12%', left: '42%', size: 3, color: '#38BDF8', opacity: 0.22, duration: 16, delay: 2 },
  ], []);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: 0, opacity: p.opacity }}
          animate={{
            y: [-12, 14, -12],
            x: [-6, 8, -6],
            opacity: [p.opacity * 0.7, p.opacity * 1.3, p.opacity * 0.7],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
});
HeroFloatingParticles.displayName = 'HeroFloatingParticles';

// ─────────────────────────────────────────────────────────────
// 2. COMPONENTE: Tipografia Interativa de Alto Luxo (Hover Sem Mudar Cor)
// Iluminação especular de laser/cristal ao passar o mouse nas palavras
// ─────────────────────────────────────────────────────────────
interface InteractiveWordsLineProps {
  text: string;
  className?: string;
  highlightSecondary?: boolean;
}

const InteractiveWordsLine: React.FC<InteractiveWordsLineProps> = ({ text, className = '', highlightSecondary = false }) => {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <span className={`inline-flex flex-wrap gap-x-3 sm:gap-x-4 ${className}`}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          whileHover={{
            y: -3,
            textShadow: '0 0 24px rgba(255,255,255,0.95), 0 0 45px rgba(0,210,246,0.6)',
            letterSpacing: '0.015em',
            transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-block cursor-default transition-all duration-300 relative select-none will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// 3. COMPONENTE: Pedestal Holográfico de Base no Solo (Zero Cards)
// O Thiago como projeção tecnológica materializada do Hero
// ─────────────────────────────────────────────────────────────
const HolographicFloorEmitter: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
  return (
    <div className="absolute -bottom-8 inset-x-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none">
      
      {/* 3D Perspective Emitter Disc (No Solo, rotateX 75deg) */}
      <div className="relative w-[88%] max-w-[480px] h-[100px] flex items-center justify-center [perspective:1000px]">
        
        {/* Anel Externo de Telemetria com Rotação Lenta */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className={`absolute w-full h-full rounded-[100%] border border-dashed transition-all duration-700 [transform:rotateX(75deg)] ${
            isHovered
              ? 'border-[#00D2F6]/60 shadow-[0_0_30px_rgba(0,210,246,0.35)] scale-105'
              : 'border-[#00D2F6]/25 shadow-[0_0_15px_rgba(0,210,246,0.15)]'
          }`}
        />

        {/* Anel Interno Focado com Pulso Holográfico */}
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.04, 1] : [0.98, 1.02, 0.98],
            opacity: isHovered ? [0.6, 0.9, 0.6] : [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[68%] h-[68%] rounded-[100%] border border-[#00D2F6]/50 [transform:rotateX(75deg)]"
        />

        {/* Micro Marcadores de Telemetria nos 4 Quadrantes */}
        <div className="absolute inset-0 flex items-center justify-between px-2 [transform:rotateX(75deg)] opacity-40 text-[9px] font-mono text-[#00D2F6]">
          <span>+</span>
          <span>+</span>
        </div>

        {/* Foco Central de Emissão de Luz no Chão */}
        <div
          className={`absolute w-[76%] h-8 rounded-[100%] transition-all duration-700 blur-xl ${
            isHovered
              ? 'bg-gradient-to-r from-transparent via-[#00D2F6]/35 to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#00D2F6]/18 to-transparent'
          }`}
        />

        {/* Linha Óptica Horizontal de Acoplamento da Mesa ao Solo */}
        <motion.div
          animate={{
            opacity: isHovered ? [0.4, 0.8, 0.4] : [0.25, 0.5, 0.25],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -translate-y-1/2 w-[58%] h-[1.5px] bg-gradient-to-r from-transparent via-[#00D2F6]/60 to-transparent blur-[0.7px]"
        />
      </div>

      {/* Feixes Verticais Sutis de Projeção Ascendente */}
      <div className="absolute bottom-10 w-[70%] h-32 flex justify-between px-8 pointer-events-none opacity-20">
        <div className="w-[1px] h-full bg-gradient-to-t from-[#00D2F6]/60 to-transparent" />
        <div className="w-[1px] h-full bg-gradient-to-t from-[#00D2F6]/40 to-transparent" />
        <div className="w-[1px] h-full bg-gradient-to-t from-[#00D2F6]/60 to-transparent" />
      </div>

    </div>
  );
};

export const HeroExecutive: React.FC<HeroExecutiveProps> = ({ onContactClick }) => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(-1);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);
  const [isThiagoHovered, setIsThiagoHovered] = useState<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // Parallax Multi-Camadas e 3D Tilt com Física Apple (Framer Motion)
  // ─────────────────────────────────────────────────────────────
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 180, mass: 0.12 };
  
  // Parallax coluna texto
  const leftColX = useSpring(rawMouseX, springConfig);
  const leftColY = useSpring(rawMouseY, springConfig);

  // Parallax arte Thiago (contraponto 3D)
  const artRawX = useTransform(rawMouseX, (val) => -val * 1.6);
  const artRawY = useTransform(rawMouseY, (val) => -val * 1.3);
  const artParallaxX = useSpring(artRawX, springConfig);
  const artParallaxY = useSpring(artRawY, springConfig);

  // 3D Tilt da projeção holográfica ao mover o mouse
  const tiltRawX = useTransform(rawMouseY, (val) => -val * 0.45); // inclinação vertical suave
  const tiltRawY = useTransform(rawMouseX, (val) => val * 0.6);   // rotação lateral
  const tiltRotateX = useSpring(tiltRawX, springConfig);
  const tiltRotateY = useSpring(tiltRawY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current || window.innerWidth < 1024) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 8; // Max 4px
    const y = ((e.clientY - top) / height - 0.5) * 8;
    rawMouseX.set(x);
    rawMouseY.set(y);
  };

  const handleMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
    setIsThiagoHovered(false);
  };

  // IntersectionObserver
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

  // 9-Second Master Timeline Cycle
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

  // Framer Motion Variants
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
          1.1 PARTÍCULAS ÓPTICAS FLUTUANTES (Tech Dust / Atmosfera 3D, z-10)
         ───────────────────────────────────────────────────────────── */}
      <HeroFloatingParticles isVisible={isHeroVisible} />

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT STREAM (À Frente do Efeito, z-20)
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center my-auto">
        
        {/* Left Column: Copywriting, Authority & High-Conversion CTAs */}
        <motion.div
          style={{ x: leftColX, y: leftColY }}
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

          {/* 2. ARTE THIAGO NO MOBILE / TABLET (Solta, sem card, com emissor de base holográfica) */}
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
                className="w-full h-auto aspect-[1312/1199] max-h-[360px] sm:max-h-[400px] md:max-h-[440px] object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.75)] drop-shadow-[0_0_14px_rgba(0,210,246,0.18)] transform-gpu relative z-20"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />

              {/* Pedestal de emissão holográfica no solo do mobile */}
              <div className="absolute -bottom-3 inset-x-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <div className="w-[78%] h-6 rounded-[100%] border border-dashed border-[#00D2F6]/35 [transform:rotateX(75deg)]" />
                <div className="w-[66%] h-5 rounded-[100%] bg-gradient-to-r from-transparent via-[#00D2F6]/20 to-transparent blur-lg -mt-3" />
                <div className="w-[48%] h-[1px] bg-gradient-to-r from-transparent via-[#00D2F6]/45 to-transparent blur-[0.6px] -mt-2" />
              </div>
            </div>
          </motion.div>

          {/* 3. Masked Editorial Luxury Headline com Efeito Interativo de Passar o Mouse */}
          <motion.div
            ref={headlineRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full relative group/headline cursor-default"
          >
            {/* Line 1 Mask */}
            <div className="overflow-hidden pb-1">
              <motion.h1
                variants={lineMaskVariants}
                className="font-['Playfair_Display',serif] font-black uppercase tracking-tight text-white leading-[1.1] text-2xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[50px]"
              >
                <InteractiveWordsLine text={HERO_DATA.headlineP1} />
              </motion.h1>
            </div>

            {/* Line 2 Mask */}
            <div className="overflow-hidden pb-2">
              <motion.div
                variants={lineMaskVariants}
                className="font-['Playfair_Display',serif] font-black uppercase tracking-tight text-white leading-[1.1] text-2xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[50px] drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)]"
              >
                <InteractiveWordsLine text={HERO_DATA.headlineP2} highlightSecondary />
              </motion.div>
            </div>
          </motion.div>

          {/* 4. Subtext com Iluminação Suave de Leitura ao Passar o Mouse */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              color: '#E2E8F0',
              textShadow: '0 0 16px rgba(255,255,255,0.2)',
              transition: { duration: 0.3 }
            }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#94A3B8] text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl xl:max-w-2xl cursor-default transition-colors duration-300"
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
            Right Column: ARTE THIAGO NO DESKTOP 
            Projeção Tecnológica do Hero com Efeito Holográfico, Emitter no Solo e 3D Tilt
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          style={{
            x: artParallaxX,
            y: artParallaxY,
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            perspective: 1200,
          }}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          onMouseEnter={() => setIsThiagoHovered(true)}
          onMouseLeave={() => setIsThiagoHovered(false)}
          className="hidden lg:flex lg:col-span-5 xl:col-span-5 items-center justify-center relative select-none z-20"
        >
          {/* Container limpo, 100% livre de cards ou molduras */}
          <div className="relative w-full max-w-[490px] xl:max-w-[550px] 2xl:max-w-[600px] flex flex-col items-center justify-center">
            
            {/* Imagem do Thiago com Efeito de Rim Light Tecnológico e Sombra Nobre */}
            <motion.img
              src="/thiagotcai.png"
              alt="Thiago Cassol Antunes — Especialista em Tecnologia, Software e IA"
              animate={{
                filter: isThiagoHovered
                  ? 'drop-shadow(0 25px 40px rgba(0,0,0,0.85)) drop-shadow(0 0 24px rgba(0,210,246,0.28)) drop-shadow(0 2px 6px rgba(0,210,246,0.35))'
                  : 'drop-shadow(0 20px 35px rgba(0,0,0,0.75)) drop-shadow(0 0 15px rgba(0,210,246,0.16)) drop-shadow(0 2px 4px rgba(0,210,246,0.22))',
              }}
              transition={{ duration: 0.4 }}
              className="w-full h-auto aspect-[1312/1199] max-h-[80vh] xl:max-h-[84vh] object-contain transform-gpu transition-transform duration-700 hover:scale-[1.015] relative z-20"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />

            {/* Linha Holográfica de Varredura que Percorre a Imagem no Hover */}
            {isThiagoHovered && (
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '-80%', opacity: [0, 0.85, 0] }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="absolute inset-x-4 h-[2px] bg-gradient-to-r from-transparent via-[#00D2F6] to-transparent pointer-events-none z-30 blur-[0.5px]"
              />
            )}

            {/* Pedestal Holográfico de Base no Solo (A Projeção que Origina o Thiago) */}
            <HolographicFloorEmitter isHovered={isThiagoHovered} />

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroExecutive;
