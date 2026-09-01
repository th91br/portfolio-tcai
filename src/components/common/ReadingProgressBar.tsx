import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ReadingProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Physics-based spring for fluid 60/120 FPS motion matching smooth scroll
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[4px] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="w-full h-full bg-[#FF6B35] origin-left"
        style={{
          scaleX,
          boxShadow: '0 0 12px rgba(255, 107, 53, 0.8), 0 0 4px rgba(255, 107, 53, 1)',
        }}
      />
    </div>
  );
};

export default ReadingProgressBar;
