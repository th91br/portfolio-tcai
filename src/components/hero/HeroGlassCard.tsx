import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Clock, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { HeroEnergyRing } from './HeroEnergyRing';

interface HeroGlassCardProps {
  onContactClick?: () => void;
}

export const HeroGlassCard: React.FC<HeroGlassCardProps> = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth 3D Inertia Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 24, stiffness: 180, mass: 0.1 };
  const smoothParallaxX = useSpring(mouseX, springConfig);
  const smoothParallaxY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 10; // Max 5px parallax
    const y = ((e.clientY - top) / height - 0.5) * 10;
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
      className="relative w-full max-w-[440px] lg:max-w-[480px] mx-auto flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
    >
      {/* 1. Underlying TCA Energy Ring */}
      <HeroEnergyRing />

      {/* 2. Floating 3D Angled Glass Card Container with Double-Bezel Hardware Architecture */}
      <motion.div
        style={{
          x: smoothParallaxX,
          y: smoothParallaxY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: isHovered ? -10 : [0, -8, 0],
          rotateY: isHovered ? -3 : [-7, -5, -7],
          rotateX: isHovered ? 2 : [4, 2, 4],
          rotateZ: isHovered ? 0 : [-1.5, 0.5, -1.5],
          scale: isHovered ? 1.025 : [1, 1.014, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative w-full aspect-[4/5] rounded-[36px] p-2 sm:p-2.5 bg-white/[0.02] border border-white/12 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(0,210,246,0.2)] hover:border-[#00D2F6]/60 hover:shadow-[0_30px_80px_rgba(0,0,0,0.95),0_0_55px_rgba(0,210,246,0.35)] transition-all duration-500 z-10 overflow-hidden"
      >
        {/* Diagonal Sweeping Glass Specular Sheen */}
        <motion.div
          animate={{
            x: ['-140%', '240%'],
          }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.38],
          }}
          className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* Inner Media Canvas: Machined Inner Core */}
        <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#030611] border border-white/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          {/* Imagem do Hero: hero.2.tca */}
          <img
            src="/hero.2.tca.png"
            alt="Thiago Cassol Antunes - Full-Stack & Applied AI Engineer"
            className="relative z-10 w-full h-full object-cover object-[72%_center] sm:object-[75%_center] transition-transform duration-700 hover:scale-105"
            loading="eager"
          />

          {/* Luxury Bottom Glass HUD Overlay Plate */}
          <div className="absolute inset-x-0 bottom-0 pt-16 pb-4 px-4 sm:px-5 bg-gradient-to-t from-[#040816] via-[#040816]/95 to-transparent flex flex-col justify-end text-left z-20">
            {/* Name & Badge */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00D2F6] uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span>THIAGO CASSOL ANTUNES</span>
            </div>

            {/* Title */}
            <div className="text-sm sm:text-base font-extrabold text-white uppercase tracking-tight font-kanit">
              FULL-STACK & APPLIED AI ENGINEER
            </div>

            {/* Experience */}
            <div className="text-xs text-[#94A3B8] font-light mt-0.5 mb-2.5">
              5+ Anos Desenvolvendo Ativos Digitais
            </div>

            {/* 2 Micro Metadata Badges */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#152238]/80 text-[11px] font-mono">
              <div className="flex items-center gap-1 text-[#00D2F6] font-semibold">
                <Clock className="w-3 h-3 text-[#00D2F6]" />
                <span>3 A 10 DIAS ÚTEIS</span>
              </div>
              <div className="flex items-center gap-1 text-[#F3F5F7] font-medium">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>CÓDIGO 100% PROPRIETÁRIO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Floating Double-Bezel Pill Badge: SLA Guarantee */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 10px rgba(0,210,246,0.2)',
              '0 0 24px rgba(0,210,246,0.5)',
              '0 0 10px rgba(0,210,246,0.2)',
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#040816]/90 border border-[#00D2F6]/70 backdrop-blur-md shadow-xl flex items-center gap-2 text-[11px] font-mono font-bold text-[#00D2F6] z-30"
        >
          <Clock className="w-3.5 h-3.5 text-[#00D2F6]" />
          <span>3 A 10 DIAS ÚTEIS</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroGlassCard;
