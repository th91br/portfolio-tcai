import React from 'react';
import { motion } from 'framer-motion';

export const HeroEnergyRing: React.FC = () => {
  return (
    <div
      className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-[380px] sm:w-[480px] h-[160px] sm:h-[180px] pointer-events-none z-0 flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* 1. Deep Core Ambient Radial Cyan/Blue Glow */}
      <motion.div
        animate={{
          scale: [0.92, 1.12, 0.92],
          opacity: [0.4, 0.75, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-t from-[#00D2F6]/30 via-[#015EEF]/20 to-transparent blur-[65px] rounded-full"
      />

      {/* 2. Projected Elliptical Quantum Energy Rings in 3D Perspective */}
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          transform: 'perspective(600px) rotateX(75deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Outer Clockwise Rotating Ring */}
        <motion.svg
          viewBox="0 0 400 400"
          className="absolute w-[360px] sm:w-[460px] h-[360px] sm:h-[460px]"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          }}
        >
          <defs>
            <linearGradient id="tcaRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D2F6" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#0096F5" stopOpacity="0.6" />
              <stop offset="85%" stopColor="#015EEF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#7928CA" stopOpacity="0.5" />
            </linearGradient>
            <radialGradient id="tcaCoreGlow1">
              <stop offset="0%" stopColor="#00D2F6" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#015EEF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#050914" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Dashed Orbit */}
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="url(#tcaRingGrad1)"
            strokeWidth="2.2"
            strokeDasharray="14 18"
            opacity="0.8"
          />

          {/* Mid Solid Accent Segment Ring */}
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="#00D2F6"
            strokeWidth="1.6"
            strokeDasharray="40 12 10 12"
            opacity="0.6"
          />

          {/* Core Radial Fill */}
          <circle cx="200" cy="200" r="110" fill="url(#tcaCoreGlow1)" />
        </motion.svg>

        {/* Inner Counter-Clockwise Orbit */}
        <motion.svg
          viewBox="0 0 400 400"
          className="absolute w-[300px] sm:w-[380px] h-[300px] sm:h-[380px]"
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            rotate: { duration: 14, repeat: Infinity, ease: 'linear' },
          }}
        >
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="#00D2F6"
            strokeWidth="1.2"
            strokeDasharray="6 14"
            opacity="0.5"
          />
        </motion.svg>
      </div>
    </div>
  );
};

export default HeroEnergyRing;
