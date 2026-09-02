import React from 'react';
import { motion } from 'framer-motion';
import {
  REVIEWS_HEADER,
  REVIEWS_ROW1,
  REVIEWS_ROW2,
} from '../../data/portfolioData';
import { ReviewCardItem } from '../../types';

interface ReviewCardProps {
  review: ReviewCardItem;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[175px] flex-shrink-0 p-5 rounded-2xl bg-[#08131F]/75 border border-white/[0.06] hover:border-[#00D2F6]/40 transition-all duration-300 group shadow-lg flex flex-col justify-between select-none cursor-default overflow-hidden backdrop-blur-xl">
      {/* 1. Top Header Row */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo Avatar */}
          <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.08] flex-shrink-0 flex items-center justify-center p-0.5">
            {review.logoImage ? (
              <img
                src={review.logoImage}
                alt={`${review.projectName} logo`}
                className="w-full h-full object-contain object-center block"
                loading="lazy"
              />
            ) : (
              <span className="font-mono font-black text-xs text-[#00D2F6]">
                {review.logoText}
              </span>
            )}
          </div>

          {/* Nome do Projeto & Categoria */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-[#00D2F6] transition-colors truncate font-kanit">
              {review.projectName}
            </h4>
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-[#00D2F6] flex items-center gap-1 mt-0.5 truncate">
              <span className="w-1 h-1 rounded-full bg-[#00D2F6] flex-shrink-0" />
              {review.category}
            </span>
          </div>
        </div>

        {/* 5 Estrelas */}
        <div className="flex items-center gap-1 flex-shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          <div className="flex items-center text-amber-400 text-[10px]">
            {'★'.repeat(review.rating)}
          </div>
          <span className="text-[9px] font-mono font-bold text-amber-300">5.0</span>
        </div>
      </div>

      {/* 2. Middle: Depoimento */}
      <div className="my-auto py-1 relative z-10">
        <p className="text-xs text-[#94A3B8] font-light leading-relaxed group-hover:text-[#F1F5F9] transition-colors line-clamp-2">
          "{review.review}"
        </p>
      </div>

      {/* 3. Bottom Row: Cliente & Métrica */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06] relative z-10">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-white truncate">
            {review.clientName}
          </span>
          <span className="text-[10px] text-[#64748B] font-normal truncate max-w-[140px]">
            {review.clientRole}
          </span>
        </div>

        {review.metricHighlight && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex-shrink-0">
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            {review.metricHighlight}
          </span>
        )}
      </div>
    </div>
  );
};

export const MarqueeSection: React.FC = () => {
  const row1Quad = [
    ...REVIEWS_ROW1,
    ...REVIEWS_ROW1,
    ...REVIEWS_ROW1,
  ];
  const row2Quad = [
    ...REVIEWS_ROW2,
    ...REVIEWS_ROW2,
    ...REVIEWS_ROW2,
  ];

  return (
    <section
      id="testimonials"
      className="relative w-full bg-[#07111F] text-[#F3F5F7] py-24 sm:py-32 border-t border-white/[0.06] overflow-hidden select-none z-10"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto px-4 mb-14 sm:mb-18 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#00D2F6]/25 shadow-sm mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00D2F6]">
              07 / AVALIAÇÕES DE CLIENTES REAIS
            </span>
          </div>

          <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F8FAFC] mb-3 leading-tight">
            QUEM CONFIA NA TCAI PARA CONSTRUIR
          </h2>

          <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed max-w-[48ch]">
            {REVIEWS_HEADER.tagline}
          </p>
        </div>

        {/* Continuous Marquee Rows */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full relative">
          {/* Edge Fade Gradients in Dark Navy */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#07111F] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#07111F] to-transparent z-20 pointer-events-none" />

          {/* Row 1: Right to Left */}
          <div className="overflow-hidden w-full flex">
            <motion.div
              className="flex gap-4 sm:gap-6 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 35,
                  ease: 'linear',
                },
              }}
              whileHover={{ transition: { duration: 120 } }}
            >
              {row1Quad.map((review, index) => (
                <ReviewCard key={`r1-${review.id}-${index}`} review={review} />
              ))}
            </motion.div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="overflow-hidden w-full flex">
            <motion.div
              className="flex gap-4 sm:gap-6 w-max"
              animate={{ x: ['-50%', '0%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 40,
                  ease: 'linear',
                },
              }}
              whileHover={{ transition: { duration: 120 } }}
            >
              {row2Quad.map((review, index) => (
                <ReviewCard key={`r2-${review.id}-${index}`} review={review} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
