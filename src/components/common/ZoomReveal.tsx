import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ZoomRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  scaleFrom?: number;
  yFrom?: number;
}

export const ZoomReveal: React.FC<ZoomRevealProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  className = '',
  scaleFrom = 0.94,
  yFrom = 24,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: scaleFrom, y: yFrom }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: scaleFrom, y: -yFrom }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
