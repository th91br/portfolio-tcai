import React from 'react';
import { motion } from 'framer-motion';

interface TextShimmerProps {
  children: string;
  className?: string;
  /** Duration of one full shimmer sweep in seconds (default: 3s) */
  duration?: number;
}

/**
 * TextShimmer — A refined, slow-moving luminous sweep across text.
 * 
 * Uses a diagonal linear-gradient mask that translates across the text,
 * creating a subtle metallic shimmer effect. No glow, no bloom — just
 * a quiet flash of light traveling through the letters.
 */
export const TextShimmer: React.FC<TextShimmerProps> = ({
  children,
  className = '',
  duration = 3,
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Base text: the gradient fill that's always visible */}
      <span
        className="bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] bg-clip-text text-transparent"
        style={{ WebkitBackgroundClip: 'text' }}
      >
        {children}
      </span>

      {/* Shimmer overlay: a lighter sweep that travels across */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 bg-clip-text text-transparent pointer-events-none select-none"
        style={{
          WebkitBackgroundClip: 'text',
          backgroundImage:
            'linear-gradient(110deg, transparent 20%, rgba(243,245,247,0.45) 45%, rgba(243,245,247,0.65) 50%, rgba(243,245,247,0.45) 55%, transparent 80%)',
          backgroundSize: '250% 100%',
        }}
        animate={{
          backgroundPosition: ['125% center', '-25% center'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 1.2,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export default TextShimmer;
