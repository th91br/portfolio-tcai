import { useState, useEffect, useRef, useCallback } from 'react';

export const SECTION_CENTERS = [0.00, 0.12, 0.25, 0.42, 0.58, 0.70, 0.80, 0.90, 1.00];

interface ContinuousScrollOptions {
  totalSections?: number;
  lerpFactor?: number;
  wheelSensitivity?: number;
  touchSensitivity?: number;
  onSectionChange?: (index: number) => void;
}

export const useContinuousScroll = ({
  totalSections = 9,
  lerpFactor = 0.12,
  wheelSensitivity = 0.00030,
  touchSensitivity = 0.002,
  onSectionChange,
}: ContinuousScrollOptions = {}) => {
  const maxProgress = 1.0;
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const activeSectionRef = useRef<number>(0);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [smoothProgress, setSmoothProgress] = useState<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const lastSectionNotifiedRef = useRef<number>(0);

  // Direct Jump to a Section (e.g. from nav dots or header links)
  const scrollToSection = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(SECTION_CENTERS.length - 1, index));
      const target = SECTION_CENTERS[clamped];
      targetProgressRef.current = target;
    },
    []
  );

  // Wheel Listener with Continuous Velocity
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Check if user is scrolling inside a scrollable child element
      const target = e.target as HTMLElement | null;
      if (target && typeof target.closest === 'function') {
        const scrollableParent = target.closest('.overflow-y-auto, .overflow-y-scroll') as HTMLElement | null;
        if (scrollableParent && scrollableParent.scrollHeight > scrollableParent.clientHeight + 10) {
          const isAtTop = scrollableParent.scrollTop <= 5;
          const isAtBottom =
            scrollableParent.scrollTop + scrollableParent.clientHeight >= scrollableParent.scrollHeight - 5;
          if (e.deltaY > 0 && !isAtBottom) {
            scrollableParent.scrollTop += e.deltaY;
            return;
          }
          if (e.deltaY < 0 && !isAtTop) {
            scrollableParent.scrollTop += e.deltaY;
            return;
          }
        }
      }

      const delta = e.deltaY * wheelSensitivity;
      const nextTarget = Math.max(0, Math.min(maxProgress, targetProgressRef.current + delta));
      targetProgressRef.current = nextTarget;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [maxProgress, wheelSensitivity]);

  // Touch Swipe for Mobile & Tablet
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null || e.touches.length === 0) return;

      const currentY = e.touches[0].clientY;
      const diffY = touchStartYRef.current - currentY;
      touchStartYRef.current = currentY;

      const delta = diffY * touchSensitivity;
      const nextTarget = Math.max(0, Math.min(maxProgress, targetProgressRef.current + delta));
      targetProgressRef.current = nextTarget;
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [maxProgress, touchSensitivity]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 0.05;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        targetProgressRef.current = Math.max(0, Math.min(maxProgress, targetProgressRef.current + step));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        targetProgressRef.current = Math.max(0, Math.min(maxProgress, targetProgressRef.current - step));
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetProgressRef.current = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetProgressRef.current = maxProgress;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maxProgress]);

  // 60-120 FPS Sub-Pixel Lerp Animation Loop
  useEffect(() => {
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * lerpFactor;
      } else {
        currentProgressRef.current = target;
      }

      const p = currentProgressRef.current;
      setSmoothProgress(p);

      // Find nearest active section from milestone centers
      let nearestIdx = 0;
      let minDistance = 999;
      SECTION_CENTERS.forEach((c, idx) => {
        const d = Math.abs(p - c);
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = idx;
        }
      });

      if (nearestIdx !== activeSectionRef.current) {
        activeSectionRef.current = nearestIdx;
        setActiveSection(nearestIdx);
        if (onSectionChange && nearestIdx !== lastSectionNotifiedRef.current) {
          lastSectionNotifiedRef.current = nearestIdx;
          onSectionChange(nearestIdx);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [lerpFactor, onSectionChange]);

  return {
    smoothProgress,
    currentProgressRef,
    activeSection,
    scrollToSection,
  };
};
