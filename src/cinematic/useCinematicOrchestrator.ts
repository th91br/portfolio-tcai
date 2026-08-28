import { useEffect, useRef, useCallback } from 'react';

export interface SectionTimelineMilestone {
  id: string;
  selector: string;
  startSec: number;
  endSec: number;
}

export const TIMELINE_MILESTONES: SectionTimelineMilestone[] = [
  { id: 'hero', selector: '#hero-atelier', startSec: 0.0, endSec: 3.0 },
  { id: 'manifesto', selector: '#manifesto', startSec: 3.0, endSec: 4.5 },
  { id: 'simulator', selector: '#simulator', startSec: 4.5, endSec: 7.2 },
  { id: 'projects', selector: '#projects', startSec: 7.2, endSec: 8.8 },
  { id: 'what-i-create', selector: '#what-i-create', startSec: 8.8, endSec: 10.0 },
  { id: 'services', selector: '#services', startSec: 10.0, endSec: 11.1 },
  { id: 'about', selector: '#about', startSec: 11.1, endSec: 13.3 },
  { id: 'testimonials', selector: '#testimonials-ticker', startSec: 13.3, endSec: 14.4 },
  { id: 'contact', selector: '#contact', startSec: 14.4, endSec: 14.766 },
];

interface CachedSectionBounds {
  id: string;
  top: number;
  height: number;
  startSec: number;
  endSec: number;
}

export const useCinematicOrchestrator = (
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const cachedBoundsRef = useRef<CachedSectionBounds[]>([]);
  const scrollYRef = useRef<number>(0);
  const targetTimeRef = useRef<number>(0);
  const renderTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  // 1. Cache Section Heights & Offsets on Resize / Mount (prevents layout thrashing on scroll)
  const updateCachedBounds = useCallback(() => {
    if (typeof window === 'undefined') return;

    const bounds: CachedSectionBounds[] = [];
    const scrollY = window.scrollY || window.pageYOffset || 0;

    for (const milestone of TIMELINE_MILESTONES) {
      const el = document.querySelector(milestone.selector) as HTMLElement | null;
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      bounds.push({
        id: milestone.id,
        top: rect.top + scrollY,
        height: Math.max(100, el.offsetHeight),
        startSec: milestone.startSec,
        endSec: milestone.endSec,
      });
    }

    cachedBoundsRef.current = bounds;
  }, []);

  // 2. High-Performance Target Time Calculation using Cached Bounds
  const calculateTargetTime = useCallback((): number => {
    if (typeof window === 'undefined') return 0;

    const scrollY = scrollYRef.current;
    const vh = window.innerHeight || 800;
    const focusY = scrollY + vh * 0.4;
    const bounds = cachedBoundsRef.current;

    if (bounds.length === 0) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      return Math.min(14.766, Math.max(0, (scrollY / maxScroll) * 14.766));
    }

    // Check bounds
    for (let i = 0; i < bounds.length; i++) {
      const b = bounds[i];
      if (focusY >= b.top && focusY <= b.top + b.height) {
        const localRatio = Math.min(1, Math.max(0, (focusY - b.top) / b.height));
        return b.startSec + localRatio * (b.endSec - b.startSec);
      }
    }

    // If above first section
    if (focusY < bounds[0].top) {
      return 0.0;
    }

    // If below last section
    const last = bounds[bounds.length - 1];
    if (focusY > last.top + last.height) {
      return 14.766;
    }

    return 0.0;
  }, []);

  // 3. 60 FPS RAF LERP Loop
  const tick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const target = targetTimeRef.current;
    const current = renderTimeRef.current;
    const diff = target - current;

    // LERP Smoothing (0.09 for reactive yet fluid response)
    if (Math.abs(diff) > 0.001) {
      renderTimeRef.current += diff * 0.09;
    } else {
      renderTimeRef.current = target;
    }

    renderTimeRef.current = Math.min(14.766, Math.max(0, renderTimeRef.current));

    // Decode Guard: seek only when browser decoder is ready and delta is significant
    if (
      video.readyState >= 2 &&
      !isSeekingRef.current &&
      Math.abs(video.currentTime - renderTimeRef.current) >= 0.033
    ) {
      isSeekingRef.current = true;
      video.currentTime = renderTimeRef.current;
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, [videoRef]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    const handleSeeking = () => {
      isSeekingRef.current = true;
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      targetTimeRef.current = calculateTargetTime();
    };

    const handleResize = () => {
      updateCachedBounds();
      handleScroll();
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('seeking', handleSeeking);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial cache & compute
    setTimeout(() => {
      updateCachedBounds();
      handleScroll();
      renderTimeRef.current = targetTimeRef.current;
      if (video.readyState >= 2) {
        video.currentTime = targetTimeRef.current;
      }
    }, 100);

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('seeking', handleSeeking);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateTargetTime, tick, updateCachedBounds, videoRef]);
};
