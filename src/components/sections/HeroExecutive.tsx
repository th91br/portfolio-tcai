import React, { useRef, useState, useEffect } from 'react';
import { motion, Variants, useMotionValue, useSpring } from 'framer-motion';
import {
  Zap,
  Bot,
  Code2,
  MessageCircle,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { HERO_DATA } from '../../data/portfolioData';
import { MagneticButton } from '../common/MagneticButton';
import { HeroWaveCanvas } from '../hero/HeroWaveCanvas';
import { HeroGlassCard } from '../hero/HeroGlassCard';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

interface HeroExecutiveProps {
  onContactClick: () => void;
}

export const HeroExecutive: React.FC<HeroExecutiveProps> = ({ onContactClick }) => {
  const heroRef = useRef<HTMLElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(-1);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);

  // Subtle Mouse Parallax Physics for Left Column (2-4px max)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.1 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
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

  // IntersectionObserver to monitor Hero visibility and pause RAF when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 8-Second Master Timeline Cycle for sequential service cards highlight
  useEffect(() => {
    if (!isHeroVisible) return;

    const interval = setInterval(() => {
      // 0-3s: none active
      setActiveCardIndex(-1);

      // 3s: Card 0 (Sites)
      const t1 = setTimeout(() => setActiveCardIndex(0), 3000);
      // 4.2s: Card 1 (Automações)
      const t2 = setTimeout(() => setActiveCardIndex(1), 4200);
      // 5.4s: Card 2 (Softwares)
      const t3 = setTimeout(() => setActiveCardIndex(2), 5400);
      // 6.8s: Return to baseline
      const t4 = setTimeout(() => setActiveCardIndex(-1), 6800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }, 8000);

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
    hidden: { y: 65, opacity: 0 },
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
      className="relative min-h-[94vh] lg:min-h-screen w-full bg-transparent text-[#F3F5F7] pt-32 sm:pt-40 pb-20 px-4 sm:px-6 md:px-10 flex items-center justify-center overflow-hidden z-10 select-none"
    >
      {/* 1. Undulating 3D Wireframe Waves Background Canvas */}
      <HeroWaveCanvas />

      {/* 2. Ambient Lighting Glow Orbs */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] bg-[#00D2F6]/10 blur-[170px] pointer-events-none rounded-full" />
      <div className="absolute bottom-12 right-1/4 w-[550px] h-[450px] bg-[#015EEF]/12 blur-[180px] pointer-events-none rounded-full" />

      {/* 3. Main Master Grid Container */}
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Semantic Copywriting & High-Conversion CTAs (7 cols on lg) */}
        <motion.div
          style={{ x: parallaxX, y: parallaxY }}
          className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
        >
          {/* Status Pill: Availability with Double-Bezel Micro-Chassis */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 10px rgba(0,210,246,0.15)',
                '0 0 22px rgba(0,210,246,0.38)',
                '0 0 10px rgba(0,210,246,0.15)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 shadow-lg shadow-[#00D2F6]/10 backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D2F6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              {HERO_DATA.statusBadge}
            </span>
          </motion.div>

          {/* Masked Animated Main Headline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full relative"
          >
            {/* Line 1 Mask: Cold Titanium Metal Treatment */}
            <div className="overflow-hidden pb-1">
              <motion.div
                variants={lineMaskVariants}
                className="font-kanit font-black uppercase tracking-tight leading-[1.08] text-left text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px] bg-gradient-to-r from-white via-[#E8EDF5] to-[#B0BCD0] bg-clip-text text-transparent"
              >
                {HERO_DATA.headlineP1}
              </motion.div>
            </div>

            {/* Line 2 Mask: Pure Electric Cyan / Blue TCA */}
            <div className="overflow-hidden pb-2">
              <motion.div
                variants={lineMaskVariants}
                className="font-kanit font-black uppercase tracking-tight leading-[1.08] text-left text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px] bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] bg-clip-text text-transparent"
              >
                {HERO_DATA.headlineP2}
              </motion.div>
            </div>
          </motion.div>

          {/* Subtext with Relaxed Leading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#AEB7C4] text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-[56ch]"
          >
            {HERO_DATA.subtext}
          </motion.p>

          {/* 3 SLA Service Cards with Double-Bezel Hardware Architecture and Sequential Timeline Pulse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 py-2"
          >
            {HERO_DATA.slaBadges.map((badge, idx) => {
              const isHighlighted = activeCardIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-1.5 rounded-[22px] transition-all duration-500 shadow-xl cursor-pointer ${
                    isHighlighted
                      ? 'bg-gradient-to-b from-[#00D2F6]/50 via-[#0096F5]/25 to-transparent border border-[#00D2F6] shadow-[0_0_25px_rgba(0,210,246,0.3)] scale-[1.02]'
                      : 'bg-white/[0.02] border border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="h-full w-full rounded-[18px] bg-[#060B18]/90 p-3.5 border border-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-1.5">
                      {/* Squircle Icon Pod */}
                      <div className="w-7 h-7 rounded-lg bg-[#00D2F6]/10 border border-[#00D2F6]/20 flex items-center justify-center shrink-0">
                        {badge.icon === 'zap' && <Zap className="w-3.5 h-3.5 text-[#00D2F6]" />}
                        {badge.icon === 'bot' && <Bot className="w-3.5 h-3.5 text-[#0096F5]" />}
                        {badge.icon === 'code' && <Code2 className="w-3.5 h-3.5 text-[#015EEF]" />}
                      </div>
                      <span className={`text-[11px] font-mono font-bold uppercase transition-colors ${isHighlighted ? 'text-[#00D2F6]' : 'text-white'}`}>
                        {badge.time}
                      </span>
                    </div>
                    <div className={`text-xs font-medium transition-colors ${isHighlighted ? 'text-white font-semibold' : 'text-[#AEB7C4]'}`}>
                      {badge.type}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Action CTAs with Button-in-Button & Magnetic Attraction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto"
          >
            {/* Masterpiece Button-in-Button WhatsApp Call-to-Action */}
            <MagneticButton strength={0.35}>
              <motion.a
                href={createQuickWhatsAppUrl('Novo Projeto pelo Hero')}
                target="_blank"
                rel="noreferrer"
                animate={{
                  boxShadow: [
                    '0 4px 20px rgba(0, 210, 246, 0.35)',
                    '0 4px 34px rgba(0, 210, 246, 0.65)',
                    '0 4px 20px rgba(0, 210, 246, 0.35)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="group relative w-full sm:w-auto pl-7 pr-2.5 py-3 rounded-full text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/25 active:scale-[0.98]"
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  INICIAR PROJETO NO WHATSAPP
                </span>
                {/* Nested Button-in-Button Trailing Icon Pod */}
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:bg-white/30 shadow-inner">
                  <MessageCircle className="w-4 h-4 text-white" />
                </span>
              </motion.a>
            </MagneticButton>

            {/* Secondary Link to Cases with Glass Surface */}
            <a
              href="#projects"
              className="group w-full sm:w-auto px-7 py-4 rounded-full border border-white/10 hover:border-[#00D2F6]/50 bg-white/[0.02] hover:bg-white/[0.06] text-[#AEB7C4] hover:text-[#00D2F6] text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,210,246,0.2)]"
            >
              <span>VER CASES REAIS</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-1" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Founder Executive Glass Monolith (5 cols on lg) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          <HeroGlassCard onContactClick={onContactClick} />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroExecutive;
