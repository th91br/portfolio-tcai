import { useEffect, useRef, useState, useCallback } from 'react';
import { CINEMATIC_VIDEO_CONFIG, CINEMATIC_TIMELINE } from '../config/cinematicTimeline';

export type CinematicState =
  | 'loading'
  | 'ready'
  | 'scrubbing'
  | 'reduced-motion'
  | 'fallback'
  | 'final-freeze';

interface UseScrollVideoOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const useScrollVideo = ({ videoRef }: UseScrollVideoOptions) => {
  const [cinematicState, setCinematicState] = useState<CinematicState>('loading');
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);

  // 1. Calculate target time using LOCAL SECTION PROGRESS
  const calculateLocalTargetTime = useCallback((): number => {
    if (typeof window === 'undefined') return 0;

    const vh = window.innerHeight || document.documentElement.clientHeight;
    const segments = CINEMATIC_TIMELINE;

    let activeSegment = segments[0];
    let localProgress = 0;
    let foundActive = false;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const el = document.querySelector(seg.selector);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const anchorY = vh * (seg.anchorRatio ?? 0.4);

      // Check if the anchor point is within this section
      if (rect.top <= anchorY && rect.bottom >= anchorY) {
        activeSegment = seg;
        const totalTravel = Math.max(1, rect.height);
        const currentTravel = anchorY - rect.top;
        localProgress = Math.min(1, Math.max(0, currentTravel / totalTravel));
        foundActive = true;
        break;
      }
    }

    if (foundActive) {
      return activeSegment.startSeconds + localProgress * (activeSegment.endSeconds - activeSegment.startSeconds);
    }

    // Fallback: If above the first section or below the last
    const firstEl = document.querySelector(segments[0].selector);
    if (firstEl && firstEl.getBoundingClientRect().top > 0) {
      return 0.0;
    }

    const lastEl = document.querySelector(segments[segments.length - 1].selector);
    if (lastEl && lastEl.getBoundingClientRect().bottom <= vh) {
      return CINEMATIC_VIDEO_CONFIG.duration;
    }

    // Proportional scroll fallback if elements are not mounted yet
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    return Math.min(1, Math.max(0, scrollY / maxScroll)) * CINEMATIC_VIDEO_CONFIG.duration;
  }, []);

  // 2. RequestAnimationFrame Loop with LERP and Seeking Guard
  const tick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCinematicState('reduced-motion');
      if (video.readyState >= 2 && Math.abs(video.currentTime - 12.5) > 0.1) {
        video.currentTime = 12.5;
      }
      return;
    }

    const target = targetTimeRef.current;
    const current = currentTimeRef.current;
    const diff = target - current;

    // Apply smoothing
    if (Math.abs(diff) > 0.001) {
      currentTimeRef.current += diff * CINEMATIC_VIDEO_CONFIG.baseSmoothing;
    } else {
      currentTimeRef.current = target;
    }

    // Clamp within video duration
    currentTimeRef.current = Math.min(
      CINEMATIC_VIDEO_CONFIG.duration,
      Math.max(0, currentTimeRef.current)
    );

    // Final freeze check
    if (currentTimeRef.current >= CINEMATIC_VIDEO_CONFIG.duration - 0.05) {
      setCinematicState('final-freeze');
    }

    // Seek guard: don't flood seek if browser decoder is still seeking
    if (
      video.readyState >= 2 &&
      !isSeekingRef.current &&
      Math.abs(video.currentTime - currentTimeRef.current) >= CINEMATIC_VIDEO_CONFIG.minSeekDelta
    ) {
      isSeekingRef.current = true;
      video.currentTime = currentTimeRef.current;
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, [videoRef]);

  // 3. Initialize & handle scroll/resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        setCinematicState('ready');
      }
    };

    const handleSeeking = () => {
      isSeekingRef.current = true;
    };

    const handleScroll = () => {
      targetTimeRef.current = calculateLocalTargetTime();
      if (isInitializedRef.current) {
        setCinematicState('scrubbing');
      }
    };

    const handleResize = () => {
      handleScroll();
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('seeking', handleSeeking);

    // Initial position calculation for page refresh / anchor nav
    const initialTarget = calculateLocalTargetTime();
    targetTimeRef.current = initialTarget;
    currentTimeRef.current = initialTarget;

    if (video.readyState >= 2) {
      video.currentTime = initialTarget;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Start tick loop
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('seeking', handleSeeking);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateLocalTargetTime, tick, videoRef]);

  return {
    cinematicState,
    targetTimeRef,
    currentTimeRef,
  };
};
