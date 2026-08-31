import React from 'react';
import { motion } from 'framer-motion';
import {
  REVIEWS_HEADER,
  REVIEWS_ROW1,
  REVIEWS_ROW2,
} from '../../data/portfolioData';
import { ReviewCardItem } from '../../types';
import { Sparkles, Star } from 'lucide-react';

interface ReviewCardProps {
  review: ReviewCardItem;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[165px] flex-shrink-0 p-5 rounded-3xl bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6]/50 transition-all duration-300 group shadow-xl flex flex-col justify-between select-none cursor-pointer overflow-hidden backdrop-blur-xl hover:-translate-y-1">
      {/* 1. Top Header Row */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo Avatar */}
          <div className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl overflow-hidden bg-white border border-white/20 shadow-sm flex-shrink-0 flex items-center justify-center p-0.5">
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
            <span className="text-[9px] font-mono font-semibold tracking-wider uppercase text-[#00D2F6] flex items-center gap-1 mt-0.5 truncate">
              <span className="w-1 h-1 rounded-full bg-[#00D2F6] flex-shrink-0" />
              {review.category}
            </span>
          </div>
        </div>

        {/* 5 Estrelas */}
        <div className="flex items-center gap-1 flex-shrink-0 bg-[#050914] px-2 py-0.5 rounded-full border border-[#151F38]">
          <div className="flex items-center text-[#FFB800] text-[10px]">
            {'★'.repeat(review.rating)}
          </div>
          <span className="text-[9px] font-mono font-bold text-[#00D2F6]">5.0</span>
        </div>
      </div>

      {/* 2. Middle: Depoimento */}
      <div className="my-auto py-1 relative z-10">
        <p className="text-xs text-[#AEB7C4] font-light leading-relaxed group-hover:text-white transition-colors line-clamp-2">
          "{review.review}"
        </p>
      </div>

      {/* 3. Bottom Row: Cliente & Métrica */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#151F38] relative z-10">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-white truncate">
            {review.clientName}
          </span>
          <span className="text-[10px] text-[#AEB7C4]/70 font-light truncate max-w-[140px]">
            {review.clientRole}
          </span>
        </div>

        {review.metricHighlight && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-[#050914] border border-emerald-500/30 text-emerald-400 group-hover:border-[#00D2F6]/40 transition-colors shadow-inner flex-shrink-0">
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
      className="relative w-full bg-[#050914] text-[#F3F5F7] py-24 sm:py-32 border-t border-[#151F38] overflow-hidden select-none z-10"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Strategic Header */}
        <div className="max-w-3xl mx-auto px-4 mb-14 sm:mb-18 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18] border border-[#151F38] shadow-inner mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00D2F6]">
              {REVIEWS_HEADER.pill}
            </span>
          </div>

          <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-4 leading-tight">
            QUEM CONFIA NA TCAI PARA ESCALAR
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#AEB7C4] font-light leading-relaxed">
            {REVIEWS_HEADER.tagline}
          </p>
        </div>

        {/* Continuous Marquee Rows */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full relative">
          {/* Edge Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#050914] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#050914] to-transparent z-20 pointer-events-none" />

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
