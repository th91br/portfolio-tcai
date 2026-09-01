import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, Variants, useMotionValue, useSpring } from 'framer-motion';
import {
  Zap,
  Bot,
  Code2,
  MessageCircle,
} from 'lucide-react';
import { HERO_DATA } from '../../data/portfolioData';
import { MagneticButton } from '../common/MagneticButton';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

interface HeroExecutiveProps {
  onContactClick: () => void;
}

// 1. Memoized Desktop Background Video Layer (0% re-render lag)
const DesktopBackgroundVideo = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
    }
  }, []);

  return (
    <div className="hidden lg:flex absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 items-center justify-center">
      {/* Base black background */}
      <div className="absolute inset-0 bg-[#03060C]" />

      {/* Video Container positioned on the right */}
      <div className="relative w-full h-full max-w-[1740px] mx-auto flex items-center justify-end">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full max-h-[85vh] xl:max-h-[88vh] object-contain object-right transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: 'contrast(1.03) brightness(1.02)',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
          }}
          aria-hidden="true"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
          <source src="/hero.%20mp4.mp4" type="video/mp4" />
          <source src="/hero. mp4.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Layer 3: Contrast gradient for left copy */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#03060C] via-[#03060C]/85 via-45% to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#03060C] via-[#03060C]/70 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#03060C] via-[#03060C]/60 to-transparent pointer-events-none z-10" />
    </div>
  );
});

DesktopBackgroundVideo.displayName = 'DesktopBackgroundVideo';

// 2. Memoized Mobile Inline Video Card (Positioned between status pill and headline)
const MobileThiagoGlassCard = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
    }
  }, []);

  return (
    <div className="lg:hidden w-full max-w-[310px] sm:max-w-[360px] aspect-[4/4.8] rounded-[26px] overflow-hidden border-2 border-[#00D2F6]/60 shadow-[0_15px_45px_rgba(0,0,0,0.9),0_0_30px_rgba(0,210,246,0.3)] relative mt-3 mb-6 sm:mb-8 bg-[#060B18]">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        onLoadedData={() => setIsLoaded(true)}
        className={`w-full h-full object-cover object-[78%_center] transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        <source src="/hero_video.mp4" type="video/mp4" />
        <source src="/hero.%20mp4.mp4" type="video/mp4" />
        <source src="/hero. mp4.mp4" type="video/mp4" />
      </video>

      {/* Subtle glossy bevel highlight */}
      <div className="absolute inset-0 rounded-[26px] border border-white/20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#060B18]/80 to-transparent pointer-events-none" />
    </div>
  );
});

MobileThiagoGlassCard.displayName = 'MobileThiagoGlassCard';

export const HeroExecutive: React.FC<HeroExecutiveProps> = ({ onContactClick }) => {
  const heroRef = useRef<HTMLElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(-1);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);

  // Subtle Mouse Parallax Physics for Left Column (Desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.1 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current || window.innerWidth < 1024) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 6; // Max 3px
    const y = ((e.clientY - top) / height - 0.5) * 6;
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
          1. DESKTOP BACKGROUND VIDEO LAYER (Completely Isolated & Zero-Lag)
         ───────────────────────────────────────────────────────────── */}
      <DesktopBackgroundVideo />

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT STREAM
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        
        {/* Left Column: Copywriting & High-Conversion CTAs */}
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

          {/* 2. CARD DE VIDRO COM O THIAGO NO MOBILE (Posicionado entre Status e Headline) */}
          <MobileThiagoGlassCard />

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
                className="font-['Playfair_Display',serif] font-black uppercase tracking-tight text-white leading-[1.1] text-2xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[52px]"
              >
                {HERO_DATA.headlineP1}
              </motion.h1>
            </div>

            {/* Line 2 Mask */}
            <div className="overflow-hidden pb-2">
              <motion.div
                variants={lineMaskVariants}
                className="font-['Playfair_Display',serif] font-black uppercase tracking-tight text-white leading-[1.1] text-2xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[52px] drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)]"
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

        {/* Right Column: Espaço reservado para o Thiago e Card presentes no vídeo de fundo (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 pointer-events-none min-h-[420px]" aria-hidden="true" />
      </div>
    </section>
  );
};

export default HeroExecutive;
