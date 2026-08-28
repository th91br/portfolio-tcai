import React from 'react';
import { useCinematic } from './CinematicContext';
import { SCENE_MANIFEST } from './sceneManifest';

export const CinematicCanvas: React.FC = () => {
  const { videoRef, isReady, currentSceneId, currentSceneProgress } = useCinematic();

  const activeScene =
    SCENE_MANIFEST.find((s) => s.id === currentSceneId) || SCENE_MANIFEST[0];

  // Subtle virtual camera zoom calculation
  const [minScale, maxScale] = activeScene.cameraScale || [1.0, 1.02];
  const currentScale = minScale + currentSceneProgress * (maxScale - minScale);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none bg-[#030611]"
    >
      {/* 1. Master Video Stream */}
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        src="/Video Project.mp4"
        playsInline
        muted
        preload="auto"
        className={`w-full h-full object-cover scale-[1.01] transform-gpu will-change-transform transition-opacity duration-700 ${
          isReady ? 'opacity-90' : 'opacity-0'
        }`}
        style={{
          transform: `scale(${currentScale})`,
          filter: 'contrast(1.08) brightness(0.95)',
        }}
      />

      {/* 2. Cinematic Vignette & Edge Shadowing */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-transparent to-[#030611]/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030611]/80 via-transparent to-[#030611]/60 pointer-events-none" />

      {/* 3. Subtle Film Grain Texture (CSS only, hidden on mobile) */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full select-none opacity-[0.02] mix-blend-overlay hidden md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};
