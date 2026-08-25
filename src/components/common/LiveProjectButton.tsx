import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface LiveProjectButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  onClick,
  className = '',
  label = 'VER PROJETO',
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`rounded-full border-2 border-[#AEB7C4]/50 hover:border-[#00D2F6] text-[#F3F5F7] hover:text-[#00D2F6] font-medium uppercase tracking-widest hover:bg-[#00D2F6]/5 transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm md:text-base group whitespace-nowrap ${className}`}
    >
      <span>{label}</span>
      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#00D2F6]" />
    </motion.button>
  );
};
