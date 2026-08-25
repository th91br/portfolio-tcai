import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0 select-none">{char}</span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 select-text"
      >
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const totalChars = text.length;
  let runningCharIndex = 0;

  return (
    <p
      ref={containerRef}
      className={`text-[#F3F5F7] font-normal md:font-medium text-center leading-relaxed max-w-[720px] ${className}`}
      style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}
    >
      {words.map((word, wordIdx) => {
        const wordChars = word.split('');
        const startIndex = runningCharIndex;
        runningCharIndex += word.length + (wordIdx < words.length - 1 ? 1 : 0);

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const charPosition = startIndex + charIdx;
              const start = charPosition / totalChars;
              const end = Math.min(1, start + 1 / totalChars + 0.02);

              return (
                <Character
                  key={charIdx}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
            {wordIdx < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        );
      })}
    </p>
  );
};
