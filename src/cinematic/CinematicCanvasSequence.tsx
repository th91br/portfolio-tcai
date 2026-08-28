import React, { useEffect, useRef } from 'react';
import { useWebPSequence } from './useWebPSequence';

interface SectionMilestone {
  selector: string;
  startFrame: number;
  endFrame: number;
}

const SECTION_FRAME_MAP: SectionMilestone[] = [
  { selector: '#hero-atelier', startFrame: 0, endFrame: 32 },
  { selector: '#manifesto', startFrame: 32, endFrame: 48 },
  { selector: '#simulator', startFrame: 48, endFrame: 78 },
  { selector: '#projects', startFrame: 78, endFrame: 95 },
  { selector: '#what-i-create', startFrame: 95, endFrame: 108 },
  { selector: '#services', startFrame: 108, endFrame: 120 },
  { selector: '#about', startFrame: 120, endFrame: 144 },
  { selector: '#testimonials-ticker', startFrame: 144, endFrame: 156 },
  { selector: '#contact', startFrame: 156, endFrame: 159 },
];

export const CinematicCanvasSequence: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { imagesRef, totalFrames, isInitialReady, registerFrameLoadListener } = useWebPSequence();
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Calculate target frame index from active section bounds
  const computeTargetFrame = (): number => {
    if (typeof window === 'undefined') return 0;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || 800;
    const focusY = scrollY + vh * 0.4;

    for (let i = 0; i < SECTION_FRAME_MAP.length; i++) {
      const { selector, startFrame, endFrame } = SECTION_FRAME_MAP[i];
      const el = document.querySelector(selector) as HTMLElement | null;
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const top = rect.top + scrollY;
      const height = Math.max(100, el.offsetHeight);

      if (focusY >= top && focusY <= top + height) {
        const ratio = Math.min(1, Math.max(0, (focusY - top) / height));
        return startFrame + ratio * (endFrame - startFrame);
      }
    }

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    return Math.min(totalFrames - 1, Math.max(0, (scrollY / maxScroll) * (totalFrames - 1)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Draw frame onto canvas with cover aspect ratio
    const drawFrame = (frameIdx: number) => {
      const rounded = Math.round(frameIdx);
      const safeIdx = Math.min(totalFrames - 1, Math.max(0, rounded));
      let img = imagesRef.current[safeIdx];

      // Fallback search if exact index isn't ready yet
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < 20; offset++) {
          const prev = imagesRef.current[safeIdx - offset];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            img = prev;
            break;
          }
          const next = imagesRef.current[safeIdx + offset];
          if (next && next.complete && next.naturalWidth > 0) {
            img = next;
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Object-fit: cover with desktop focal shift
      const isDesktop = window.innerWidth >= 1024;
      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;

      const focalX = isDesktop ? 0.62 : 0.50;
      const focalY = 0.40;

      const dx = (cw - nw) * focalX;
      const dy = (ch - nh) * focalY;

      ctx.drawImage(img, dx, dy, nw, nh);
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      drawFrame(currentFrameRef.current);
    };

    const handleScroll = () => {
      targetFrameRef.current = computeTargetFrame();
    };

    // 60 FPS Render Tick
    const tick = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.12;
      } else {
        currentFrameRef.current = target;
      }

      drawFrame(currentFrameRef.current);
      rafIdRef.current = requestAnimationFrame(tick);
    };

    const unregister = registerFrameLoadListener(() => {
      drawFrame(currentFrameRef.current);
    });

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleResize();
    handleScroll();
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      unregister();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [imagesRef, registerFrameLoadListener, totalFrames]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none bg-[#030611]"
    >
      {/* 1. Master Hardware Accelerated Canvas Sequence */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transform-gpu will-change-transform transition-opacity duration-700 ${
          isInitialReady ? 'opacity-90' : 'opacity-0'
        }`}
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
};
