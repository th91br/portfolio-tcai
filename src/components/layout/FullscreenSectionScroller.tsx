import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SectionItem {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface FullscreenSectionScrollerProps {
  sections: SectionItem[];
  activeIndex: number;
  onSectionChange: (index: number) => void;
}

export const FullscreenSectionScroller: React.FC<FullscreenSectionScrollerProps> = ({
  sections,
  activeIndex,
  onSectionChange,
}) => {
  const isLockedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelAccumulatorRef = useRef<number>(0);

  useEffect(() => {
    isLockedRef.current = true;
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    // Responsive debounce of 320ms for instant buttery feel
    lockTimeoutRef.current = setTimeout(() => {
      isLockedRef.current = false;
      wheelAccumulatorRef.current = 0;
    }, 320);
  }, [activeIndex]);

  const goToSection = useCallback(
    (index: number, isDirectClick = false) => {
      if (index < 0 || index >= sections.length) return;
      if (isLockedRef.current && !isDirectClick) return;
      onSectionChange(index);
    },
    [onSectionChange, sections.length]
  );

  const nextSection = useCallback(() => {
    goToSection(activeIndex + 1);
  }, [activeIndex, goToSection]);

  const prevSection = useCallback(() => {
    goToSection(activeIndex - 1);
  }, [activeIndex, goToSection]);

  // Wheel listener with responsive accumulator & boundary-aware internal scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isLockedRef.current) {
        e.preventDefault();
        return;
      }

      const container = containerRef.current;
      if (container) {
        const hasScrollableContent = container.scrollHeight > container.clientHeight + 15;
        const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 15;
        const isAtTop = container.scrollTop <= 15;

        if (e.deltaY > 0) {
          // Scrolling down
          if (hasScrollableContent && !isAtBottom) {
            // Allow natural smooth internal scroll through content
            return;
          }
          e.preventDefault();
          wheelAccumulatorRef.current += e.deltaY;
          if (wheelAccumulatorRef.current > 25) {
            wheelAccumulatorRef.current = 0;
            nextSection();
          }
        } else if (e.deltaY < 0) {
          // Scrolling up
          if (hasScrollableContent && !isAtTop) {
            // Allow natural smooth internal scroll through content
            return;
          }
          e.preventDefault();
          wheelAccumulatorRef.current += e.deltaY;
          if (wheelAccumulatorRef.current < -25) {
            wheelAccumulatorRef.current = 0;
            prevSection();
          }
        }
      } else {
        e.preventDefault();
        if (e.deltaY > 20) nextSection();
        else if (e.deltaY < -20) prevSection();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [nextSection, prevSection]);

  // Touch swipe gestures for mobile with boundary check
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      if (isLockedRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY;

      const container = containerRef.current;
      if (container) {
        const hasScrollableContent = container.scrollHeight > container.clientHeight + 15;
        const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 25;
        const isAtTop = container.scrollTop <= 25;

        // Fast responsive swipe threshold: 30px
        if (Math.abs(diffY) > 30) {
          if (diffY > 0) {
            // Swiping up (moving down)
            if (hasScrollableContent && !isAtBottom) return;
            nextSection();
          } else {
            // Swiping down (moving up)
            if (hasScrollableContent && !isAtTop) return;
            prevSection();
          }
        }
      }

      touchStartYRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSection, prevSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const container = containerRef.current;
        if (container) {
          const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 15;
          if (container.scrollHeight > container.clientHeight + 15 && !isAtBottom) return;
        }
        e.preventDefault();
        nextSection();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const container = containerRef.current;
        if (container) {
          const isAtTop = container.scrollTop <= 15;
          if (container.scrollHeight > container.clientHeight + 15 && !isAtTop) return;
        }
        e.preventDefault();
        prevSection();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSection(0, true);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSection(sections.length - 1, true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToSection, nextSection, prevSection, sections.length]);

  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] overflow-hidden bg-transparent text-[#F3F5F7] select-none z-10">
      {/* 1. Active Section with High-Performance Micro-Zoom & Fade Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.01, y: -8 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full h-full h-[100dvh] overflow-y-auto overflow-x-hidden flex flex-col justify-start scroll-smooth"
        >
          {sections[activeIndex].component}
        </motion.div>
      </AnimatePresence>

      {/* 2. Floating Right-Side Section Indicator Dots */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-center gap-3">
        {sections.map((section, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={section.id}
              onClick={() => goToSection(idx, true)}
              className="group relative flex items-center justify-end cursor-pointer p-1"
              aria-label={`Ir para seção ${section.label}`}
            >
              {/* Tooltip on hover */}
              <span className="absolute right-7 px-2.5 py-1 rounded-md bg-[#080D18]/90 border border-[#151F38] text-[11px] font-mono text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                {section.label}
              </span>

              {/* Dot indicator */}
              <div
                className={`w-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'h-7 bg-[#00D2F6] shadow-[0_0_12px_rgba(0,210,246,0.8)]'
                    : 'h-2 bg-[#151F38] group-hover:bg-[#AEB7C4]'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
