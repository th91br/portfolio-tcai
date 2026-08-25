import React from 'react';
import { motion } from 'framer-motion';

interface ContactButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  onClick,
  className = '',
  label = 'VAMOS CRIAR →',
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`rounded-full text-white font-bold uppercase tracking-widest cursor-pointer inline-flex items-center justify-center transition-all duration-300 relative px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 text-xs sm:text-sm md:text-base whitespace-nowrap shadow-xl group ${className}`}
      style={{
        background: 'linear-gradient(135deg, #00D2F6 0%, #0096F5 50%, #015EEF 100%)',
        boxShadow: '0px 4px 18px rgba(0, 210, 246, 0.4), inset 0px 1px 2px rgba(255, 255, 255, 0.6)',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      <span className="relative z-10 font-bold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{label}</span>
    </motion.button>
  );
};
