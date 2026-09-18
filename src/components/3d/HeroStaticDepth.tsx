import React from 'react';

/**
 * Fallback estático e ultraleve para mobile e preferências de movimento reduzido.
 * Consome 0 KB de Three.js e 0% de GPU WebGL, preservando a estética visual de profundidade.
 */
export const HeroStaticDepth: React.FC = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Luzes de profundidade ambiente em CSS puro */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0284C7]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#00D2F6]/5 rounded-full blur-[100px]" />
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-cyan-950/20 rounded-full blur-[80px]" />

      {/* Partículas estáticas discretas em gradiente */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(#0284C7 1px, transparent 1px), radial-gradient(#00D2F6 1px, transparent 1px)',
          backgroundSize: '80px 80px, 120px 120px',
          backgroundPosition: '0 0, 40px 40px',
        }}
      />
    </div>
  );
};

export default HeroStaticDepth;
