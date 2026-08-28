import React from 'react';

export const CinematicOverlay: React.FC = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full -z-20 pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* 1. Global Dark Ambient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,6,17,0.45)_0%,rgba(3,6,17,0.85)_80%,rgba(3,6,17,0.98)_100%)]" />

      {/* 2. Top and Bottom Fade Masks */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#030611] via-[#030611]/80 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#030611] via-[#030611]/80 to-transparent" />

      {/* 3. Left-Side Contrast Boost for Text Reading on Desktop */}
      <div className="hidden lg:block absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#030611]/80 via-[#030611]/40 to-transparent" />

      {/* 4. Subtle Controlled Blue/Cyan Glow Accent */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#00D2F6]/5 blur-[160px] rounded-full pointer-events-none" />
    </div>
  );
};
