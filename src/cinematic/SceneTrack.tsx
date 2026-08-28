import React, { useRef, useEffect, useState } from 'react';
import { useCinematic } from './CinematicContext';
import { SceneConfig } from './types';

interface SceneTrackProps {
  scene: SceneConfig;
  children: (progress: number) => React.ReactNode;
  className?: string;
}

export const SceneTrack: React.FC<SceneTrackProps> = ({
  scene,
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const { registerSceneProgress } = useCinematic();

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScrollable = rect.height - vh;

      if (totalScrollable <= 0) {
        setProgress(0);
        return;
      }

      // Calculate progress 0.0 -> 1.0 while sticky
      const currentScroll = -rect.top;
      const rawProg = currentScroll / totalScrollable;
      const clamped = Math.min(1, Math.max(0, rawProg));

      setProgress(clamped);
      registerSceneProgress(scene.id, clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [registerSceneProgress, scene.id]);

  return (
    <div
      id={`scene-track-${scene.id}`}
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: scene.trackHeight }}
    >
      {/* Sticky Scene Canvas (stays locked in viewport during track height) */}
      <div className="sticky top-0 left-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between z-10">
        {children(progress)}
      </div>
    </div>
  );
};
