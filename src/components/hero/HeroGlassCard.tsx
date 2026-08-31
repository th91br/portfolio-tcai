import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Clock, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { HeroEnergyRing } from './HeroEnergyRing';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

interface HeroGlassCardProps {
  onContactClick?: () => void;
}

export const HeroGlassCard: React.FC<HeroGlassCardProps> = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Subtle Mouse Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.1 };
  const smoothParallaxX = useSpring(mouseX, springConfig);
  const smoothParallaxY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 8; // Max 4px parallax
    const y = ((e.clientY - top) / height - 0.5) * 8;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[420px] mx-auto flex items-center justify-center select-none"
    >
      {/* 1. Underlying TCA Energy Ring */}
      <HeroEnergyRing />

      {/* 2. Floating Glass Card Container with Cinematic Inertia */}
      <motion.div
        style={{
          x: smoothParallaxX,
          y: smoothParallaxY,
        }}
        animate={{
          y: isHovered ? -8 : [0, -6, 0],
          rotateZ: isHovered ? 0 : [-1.2, 0.8, -1.2],
          scale: isHovered ? 1.02 : [1, 1.014, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative w-full aspect-[4/5] rounded-[32px] sm:rounded-[40px] p-2 bg-[#080D18]/90 border border-[#151F38] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,210,246,0.12)] hover:border-[#00D2F6]/60 transition-colors duration-500 z-10 overflow-hidden"
      >
        {/* Diagonal Sweeping Glass Specular Reflection (Sweeps between 1s and 3.5s of 8s cycle) */}
        <motion.div
          animate={{
            x: ['-140%', '240%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatDelay: 0,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.45],
          }}
          className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* Inner Media Canvas */}
        <div className="relative w-full h-full rounded-[26px] sm:rounded-[34px] overflow-hidden bg-[#050914]">
          {/* Real Founder Executive Portrait */}
          <img
            src="/assets/branding/thiago_executive.jpg"
            alt="Thiago Cassol Antunes - Full-Stack & Applied AI Engineer"
            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
            loading="eager"
          />

          {/* Luxury Bottom Glass HUD Overlay */}
          <div className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5 bg-gradient-to-t from-[#050914] via-[#050914]/88 to-transparent flex flex-col justify-end text-left z-20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00D2F6] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span>Thiago Cassol Antunes</span>
            </div>
            <div className="text-sm font-bold text-white uppercase tracking-tight font-kanit">
              Full-Stack & Applied AI Engineer
            </div>
            <div className="text-xs text-[#AEB7C4] font-light mt-0.5">
              5+ Anos Desenvolvendo Ativos Digitais
            </div>
          </div>
        </div>

        {/* Top Right Floating Badge: SLA Guarantee */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 10px rgba(0,210,246,0.1)',
              '0 0 20px rgba(0,210,246,0.35)',
              '0 0 10px rgba(0,210,246,0.1)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 px-3.5 py-1.5 rounded-xl bg-[#050914]/95 border border-[#00D2F6]/60 backdrop-blur-md shadow-2xl flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-[#00D2F6] z-30"
        >
          <Clock className="w-3.5 h-3.5 text-[#00D2F6]" />
          <span>3 A 10 DIAS ÚTEIS</span>
        </motion.div>

        {/* Bottom Left Floating Badge: Proprietary Code */}
        <div className="absolute -bottom-1 -left-1 px-3.5 py-1.5 rounded-xl bg-[#050914]/95 border border-emerald-500/60 backdrop-blur-md shadow-2xl flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-emerald-400 z-30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>CÓDIGO 100% PROPRIETÁRIO</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroGlassCard;
