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
    <div className="relative w-[310px] sm:w-[380px] md:w-[440px] min-h-[250px] sm:h-[260px] flex-shrink-0 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6]/60 transition-all duration-300 group shadow-2xl flex flex-col justify-between select-none cursor-pointer overflow-hidden">
      {/* Ambient Inner Glow on Hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D2F6]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00D2F6]/15 transition-all duration-300" />

      {/* 1. Top Header Row: Logo Avatar Square + Info + Rating */}
      <div className="flex items-center justify-between gap-2.5 sm:gap-3 relative z-10">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {/* O Quadrado do Logo - 48px mobile / 56px desktop com imagem ocupando 100% */}
          <div className="w-12 h-12 min-w-[48px] min-h-[48px] sm:w-14 sm:h-14 sm:min-w-[56px] sm:min-h-[56px] max-w-[56px] max-h-[56px] rounded-xl overflow-hidden bg-white border border-white/20 shadow-md flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            {review.logoImage ? (
              <img
                src={review.logoImage}
                alt={`${review.projectName} logo`}
                className="w-full h-full object-cover object-center block"
                loading="lazy"
              />
            ) : (
              <span className="font-mono font-black text-xs sm:text-sm text-[#00D2F6]">
                {review.logoText}
              </span>
            )}
          </div>

          {/* Nome do Projeto & Categoria */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight group-hover:text-[#00D2F6] transition-colors truncate">
              {review.projectName}
            </h4>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-wider uppercase text-[#00D2F6] flex items-center gap-1 sm:gap-1.5 mt-0.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6] flex-shrink-0" />
              {review.category}
            </span>
          </div>
        </div>

        {/* 5 Estrelas & Badge 5.0 */}
        <div className="flex flex-col items-end flex-shrink-0">
          <div className="flex items-center text-[#FFB800] text-[11px] sm:text-xs md:text-sm tracking-tighter">
            {'★'.repeat(review.rating)}
          </div>
          <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase mt-0.5 bg-[#00D2F6]/10 px-1.5 py-0.5 rounded border border-[#00D2F6]/20">
            5.0 ★
          </span>
        </div>
      </div>

      {/* 2. Middle: Depoimento / Avaliação do Cliente */}
      <div className="my-auto py-1.5 sm:py-2 relative z-10">
        <p className="text-[11px] sm:text-xs md:text-[13px] text-[#AEB7C4] font-light leading-relaxed group-hover:text-[#F3F5F7] transition-colors line-clamp-3">
          "{review.review}"
        </p>
      </div>

      {/* 3. Bottom Row: Identificação do Cliente & Destaque de Métrica */}
      <div className="flex items-center justify-between gap-2 pt-2.5 sm:pt-3 border-t border-[#151F38] relative z-10">
        {/* Nome & Cargo */}
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-white truncate">
            {review.clientName}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] text-[#7E8998] font-light truncate max-w-[140px] sm:max-w-[180px] md:max-w-[220px]">
            {review.clientRole}
          </span>
        </div>

        {/* Métrica Real */}
        {review.metricHighlight && (
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-wider bg-[#050914] border border-[#151F38] text-[#00D2F6] group-hover:border-[#00D2F6]/40 transition-colors shadow-inner flex-shrink-0">
            <span className="w-1 h-1 rounded-full bg-[#00D2F6] animate-ping" />
            {review.metricHighlight}
          </span>
        )}
      </div>
    </div>
  );
};


export const MarqueeSection: React.FC = () => {
  // Quadrupled lists for continuous seamless infinite loop
  const row1Quad = [
    ...REVIEWS_ROW1,
    ...REVIEWS_ROW1,
    ...REVIEWS_ROW1,
    ...REVIEWS_ROW1,
  ];
  const row2Quad = [
    ...REVIEWS_ROW2,
    ...REVIEWS_ROW2,
    ...REVIEWS_ROW2,
    ...REVIEWS_ROW2,
  ];

  return (
    <section
      id="testimonials-ticker"
      className="relative w-full bg-[#050914] pt-20 sm:pt-28 md:pt-36 pb-14 sm:pb-20 overflow-hidden select-none"
    >
      {/* Ambient background glow accents */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-[#00D2F6]/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[450px] h-[300px] bg-[#1D47EF]/5 blur-[160px] pointer-events-none rounded-full" />

      {/* Strategic Header & Pill Tag */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 mb-10 sm:mb-14 flex flex-col items-center text-center relative z-10">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18] border border-[#151F38] shadow-inner mb-3">
          <span className="w-2 h-2 rounded-full bg-[#00D2F6] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#00D2F6]">
            {REVIEWS_HEADER.pill}
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-2 max-w-3xl">
          {REVIEWS_HEADER.headline}
        </h3>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed max-w-2xl">
          {REVIEWS_HEADER.tagline}
        </p>
      </div>

      {/* Reviews Marquee Continuous Endless Loops */}
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full relative">
        {/* Subtle Edge Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#050914] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#050914] to-transparent z-20 pointer-events-none" />

        {/* Row 1: Continuous Gliding from Right to Left */}
        <div className="overflow-hidden w-full flex">
          <motion.div
            className="flex gap-4 sm:gap-5 md:gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 38,
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

        {/* Row 2: Continuous Gliding from Left to Right */}
        <div className="overflow-hidden w-full flex">
          <motion.div
            className="flex gap-4 sm:gap-5 md:gap-6 w-max"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 42,
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
    </section>
  );
};



