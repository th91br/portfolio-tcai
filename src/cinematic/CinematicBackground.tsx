import React, { forwardRef } from 'react';

export const CinematicBackground = forwardRef<HTMLVideoElement>((_, ref) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none bg-[#030611]"
    >
      {/* 1. Master High-Definition Video Feed */}
      <video
        ref={ref}
        src="/Video Project.mp4"
        playsInline
        muted
        preload="auto"
        className="w-full h-full object-cover object-[50%_32%] md:object-[50%_40%] lg:object-[62%_center] scale-[1.01] transform-gpu will-change-transform opacity-90 transition-opacity duration-700"
        style={{
          filter: 'contrast(1.08) brightness(0.95)',
        }}
      />

      {/* 2. Seamless Editorial Vignette & Dual Contrast Lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-transparent to-[#030611]/75 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030611]/85 via-transparent to-[#030611]/65 pointer-events-none" />

      {/* 3. High-End 35mm Analog Film Grain Texture (CSS only, disabled on mobile) */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full select-none opacity-[0.02] mix-blend-overlay hidden md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
});

CinematicBackground.displayName = 'CinematicBackground';
