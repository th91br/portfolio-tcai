import React from 'react';
import { motion } from 'framer-motion';

export const HeroEnergyRing: React.FC = () => {
  return (
    <div
      className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[440px] h-[130px] sm:h-[150px] pointer-events-none z-0 flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* 1. Deep Core Ambient Radial Cyan/Blue Glow */}
      <motion.div
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-t from-[#00D2F6]/25 via-[#015EEF]/15 to-transparent blur-[55px] rounded-full"
      />

      {/* 2. Projected Elliptical Quantum Energy Rings in 3D Perspective */}
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          transform: 'perspective(500px) rotateX(76deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* SVG Vector Concentric Rings */}
        <motion.svg
          viewBox="0 0 400 400"
          className="w-[380px] sm:w-[440px] h-[380px] sm:h-[440px]"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            rotate: { duration: 24, repeat: Infinity, ease: 'linear' },
          }}
        >
          <defs>
            <linearGradient id="tcaRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D2F6" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0096F5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#015EEF" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="tcaCoreGlow">
              <stop offset="0%" stopColor="#00D2F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#015EEF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Dashed Orbit */}
          <circle
            cx="200"
            cy="200"
            r="185"
            fill="none"
            stroke="url(#tcaRingGrad)"
            strokeWidth="2"
            strokeDasharray="12 16"
            opacity="0.65"
          />

          {/* Mid Solid Ring */}
          <circle
            cx="200"
            cy="200"
            r="140"
            fill="none"
            stroke="#00D2F6"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.5"
          />

          {/* Core Radial Fill */}
          <circle cx="200" cy="200" r="100" fill="url(#tcaCoreGlow)" />
        </motion.svg>
      </div>
    </div>
  );
};

export default HeroEnergyRing;
