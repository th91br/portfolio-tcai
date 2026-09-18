import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HeroStaticDepth } from './HeroStaticDepth';

const HeroCanvasWebGL = lazy(() => import('./HeroCanvasWebGL'));

export const HeroScene: React.FC = () => {
  const [shouldRender3D, setShouldRender3D] = useState(false);

  useEffect(() => {
    // 1. Verifica preferência de acessibilidade (movimento reduzido)
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Verifica se é dispositivo móvel (tela < 768px)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // 3. Só inicializa WebGL em desktops que não solicitaram redução de movimento
    if (!prefersReducedMotion && !isMobile) {
      setShouldRender3D(true);
    }
  }, []);

  if (!shouldRender3D) {
    return <HeroStaticDepth />;
  }

  return (
    <Suspense fallback={<HeroStaticDepth />}>
      <HeroCanvasWebGL />
    </Suspense>
  );
};

export default HeroScene;
