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
    <div className="relative w-[280px] sm:w-[320px] md:w-[350px] h-[140px] sm:h-[150px] flex-shrink-0 p-3.5 rounded-2xl bg-[#060B18]/90 border border-white/10 hover:border-[#00D2F6]/50 transition-all duration-300 group shadow-xl flex flex-col justify-between select-none cursor-pointer overflow-hidden backdrop-blur-xl hover:-translate-y-0.5">
      {/* 1. Top Header Row */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo Avatar */}
          <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg overflow-hidden bg-white border border-white/20 shadow-sm flex-shrink-0 flex items-center justify-center">
            {review.logoImage ? (
              <img
                src={review.logoImage}
                alt={`${review.projectName} logo`}
                className="w-full h-full object-cover object-center block"
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
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-[#00D2F6] transition-colors truncate">
              {review.projectName}
            </h4>
            <span className="text-[8px] sm:text-[9px] font-mono font-semibold tracking-wider uppercase text-[#00D2F6] flex items-center gap-1 mt-0.5 truncate">
              <span className="w-1 h-1 rounded-full bg-[#00D2F6] flex-shrink-0" />
              {review.category}
            </span>
          </div>
        </div>

        {/* 5 Estrelas & Badge 5.0 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="flex items-center text-[#FFB800] text-[10px] tracking-tight">
            {'★'.repeat(review.rating)}
          </div>
          <span className="text-[8px] font-mono font-bold tracking-wider text-[#00D2F6] uppercase bg-[#00D2F6]/10 px-1 py-0.5 rounded border border-[#00D2F6]/20">
            5.0
          </span>
        </div>
      </div>

      {/* 2. Middle: Depoimento */}
      <div className="my-auto py-1 relative z-10">
        <p className="text-[10px] sm:text-[11px] text-[#CBD5E1] font-light leading-snug group-hover:text-white transition-colors line-clamp-2">
          "{review.review}"
        </p>
      </div>

      {/* 3. Bottom Row: Cliente & Métrica */}
      <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-white/10 relative z-10">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] sm:text-[11px] font-semibold text-white truncate">
            {review.clientName}
          </span>
          <span className="text-[8px] sm:text-[9px] text-[#94A3B8] font-light truncate max-w-[130px]">
            {review.clientRole}
          </span>
        </div>

        {review.metricHighlight && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-semibold uppercase tracking-wider bg-[#020408] border border-white/10 text-emerald-400 group-hover:border-[#00D2F6]/40 transition-colors shadow-inner flex-shrink-0">
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
      className="relative w-full h-full min-h-[100dvh] bg-transparent text-[#F3F5F7] px-4 sm:px-8 md:px-10 py-4 sm:py-6 overflow-y-auto overflow-x-hidden flex flex-col justify-center select-none"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 my-auto">
        {/* Strategic Header & Pill Tag */}
        <div className="max-w-4xl mx-auto px-4 mb-3 sm:mb-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#060B18]/90 border border-[#00D2F6]/30 backdrop-blur-md mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
            <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-widest text-[#00D2F6]">
              AVALIAÇÕES &amp; REPUTAÇÃO
            </span>
          </div>

          <h3 className="text-base sm:text-lg md:text-2xl font-bold tracking-tight text-white mb-1 max-w-3xl leading-tight">
            Resultados Reais Entregues a Clientes
          </h3>

          <p className="text-[11px] sm:text-xs text-[#CBD5E1] font-light leading-relaxed max-w-2xl">
            Feedback de clientes e parceiros que transformaram suas operações com sistemas sob medida.
          </p>
        </div>

        {/* Reviews Continuous Endless Loops */}
        <div className="flex flex-col gap-2.5 sm:gap-3 w-full relative">
          {/* Edge Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#020408] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#020408] to-transparent z-20 pointer-events-none" />

          {/* Row 1: Right to Left */}
          <div className="overflow-hidden w-full flex">
            <motion.div
              className="flex gap-2.5 sm:gap-3 w-max"
              animate={{ x: ['0%', '-50%'] }}
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
              {row1Quad.map((review, index) => (
                <ReviewCard key={`r1-${review.id}-${index}`} review={review} />
              ))}
            </motion.div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="overflow-hidden w-full flex">
            <motion.div
              className="flex gap-2.5 sm:gap-3 w-max"
              animate={{ x: ['-50%', '0%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 45,
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
