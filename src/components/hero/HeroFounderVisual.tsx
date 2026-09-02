import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, MotionValue, useTransform } from 'framer-motion';

interface HeroFounderVisualProps {
  scrollYProgress?: MotionValue<number>;
}

export const HeroFounderVisual: React.FC<HeroFounderVisualProps> = ({ scrollYProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse inertia physics (max 3px parallax)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 180, mass: 0.1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 6;
    const y = ((e.clientY - top) / height - 0.5) * 6;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Cinematic scroll parallax
  const scrollY = scrollYProgress
    ? useTransform(scrollYProgress, [0, 1], [0, 75])
    : 0;
  const scrollScale = scrollYProgress
    ? useTransform(scrollYProgress, [0, 1], [1, 1.03])
    : 1;
  const watermarkY = scrollYProgress
    ? useTransform(scrollYProgress, [0, 1], [0, 110])
    : 0;
  const lightGlowScale = scrollYProgress
    ? useTransform(scrollYProgress, [0, 1], [1, 1.15])
    : 1;
  const lightGlowOpacity = scrollYProgress
    ? useTransform(scrollYProgress, [0, 0.85], [1, 0.35])
    : 1;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[540px] xl:max-w-[580px] mx-auto flex flex-col items-center justify-end select-none h-[400px] sm:h-[480px] lg:h-[540px] xl:h-[590px] overflow-visible"
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND DEPTH PLANE (Z-0)                                            */}
      {/* ========================================================================= */}

      {/* A. Architectural Watermark Monogram behind Thiago */}
      <motion.div
        style={{ y: watermarkY }}
        className="absolute top-[6%] left-1/2 -translate-x-1/2 pointer-events-none z-0 select-none flex items-center justify-center opacity-[0.04]"
        aria-hidden="true"
      >
        <span className="font-kanit font-black text-[130px] sm:text-[180px] lg:text-[230px] leading-none tracking-tighter text-white uppercase whitespace-nowrap">
          TCAI
        </span>
      </motion.div>

      {/* B. Precision Circular Optical Aperture behind head */}
      <div
        className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[380px] lg:w-[460px] h-[300px] sm:h-[380px] lg:h-[460px] rounded-full border border-white/[0.04] pointer-events-none z-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[84%] h-[84%] rounded-full border border-[#00D2F6]/[0.05] border-dashed" />
        <div className="w-[62%] h-[62%] rounded-full border border-white/[0.02]" />
      </div>

      {/* C. Volumetric Studio Backlight (Chiaroscuro difuso) */}
      <motion.div
        style={{
          scale: lightGlowScale,
          opacity: lightGlowOpacity,
        }}
        className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[420px] lg:w-[480px] h-[320px] sm:h-[420px] lg:h-[480px] rounded-full pointer-events-none z-0"
        aria-hidden="true"
      >
        {/* Core cyan illumination */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 210, 246, 0.24) 0%, rgba(0, 150, 245, 0.14) 35%, rgba(1, 94, 239, 0.06) 60%, transparent 75%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Deep sapphire ambiance */}
        <div
          className="absolute -inset-8 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(1, 94, 239, 0.12) 0%, transparent 70%)',
            filter: 'blur(75px)',
          }}
        />
      </motion.div>

      {/* D. Anamorphic Lens Horizon Line behind shoulders */}
      <div
        className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] max-w-[580px] h-[1.5px] pointer-events-none z-0 opacity-60"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 210, 246, 0.08) 25%, rgba(0, 210, 246, 0.6) 50%, rgba(1, 94, 239, 0.15) 75%, transparent 100%)',
          filter: 'blur(1px)',
        }}
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* 2. MIDGROUND PROTAGONIST: THIAGO CASSOL ANTUNES (Z-10)                      */}
      {/* ========================================================================= */}
      <motion.div
        style={{
          x: smoothMouseX,
          y: scrollY,
          scale: scrollScale,
        }}
        className="relative z-10 w-full flex items-end justify-center pointer-events-none h-full"
      >
        <div
          className="relative w-[88%] sm:w-[92%] lg:w-[96%] max-w-[460px] xl:max-w-[500px] flex items-end justify-center h-full"
          style={{
            // Smooth multi-stop gradient mask: dissolves lower torso directly into obsidian canvas
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0.15) 90%, rgba(0,0,0,0) 98%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0.15) 90%, rgba(0,0,0,0) 98%)',
          }}
        >
          {/* Subtle rim-light overlay hugging the silhouette */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-25 mix-blend-screen"
            style={{
              background: 'radial-gradient(ellipse at 50% 22%, rgba(0, 210, 246, 0.3) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />

          {/* Master Studio Portrait */}
          <img
            src="/thiago.limpo.png"
            alt="Thiago Cassol Antunes — Arquiteto de Software & Engenheiro de IA da TCAI"
            className="w-full h-full object-contain object-bottom filter contrast-[1.04] brightness-[1.01] saturate-[1.02] drop-shadow-[0_0_40px_rgba(0,210,246,0.18)] drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
            loading="eager"
          />
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. FOREGROUND DISSOLVE SCRIM (Z-20)                                       */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#030712] via-[#030712]/75 to-transparent pointer-events-none z-20"
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroFounderVisual;
