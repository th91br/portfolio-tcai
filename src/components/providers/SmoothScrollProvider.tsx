import React, { ReactNode } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  return (
    <ReactLenis
      root
      options={{
        duration: 0.9,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.05,
        touchMultiplier: 1.6,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScrollProvider;
