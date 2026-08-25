import React, { useRef, useState, useEffect, useCallback } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.25s ease-out',
  inactiveTransition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const processPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = clientX - centerX;
      const distY = clientY - centerY;

      const inZone =
        clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding;

      if (inZone) {
        setIsInteracting(true);
        setPosition({
          x: distX / strength,
          y: distY / strength,
        });
      } else {
        setIsInteracting(false);
        setPosition({ x: 0, y: 0 });
      }
    },
    [padding, strength]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      processPoint(e.clientX, e.clientY);
    },
    [processPoint]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        processPoint(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [processPoint]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        processPoint(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [processPoint]
  );

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Gyroscope / DeviceOrientation Parallax on mobile & tablet
  const handleDeviceOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (isInteracting) return;
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left-to-right tilt [-90, 90]
        // beta: front-to-back tilt [-180, 180]
        const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
        const clampedBeta = Math.max(-30, Math.min(30, e.beta - 45)); // assume ~45deg holding angle

        setPosition({
          x: (clampedGamma / 30) * 18,
          y: (clampedBeta / 30) * 18,
        });
      }
    },
    [isInteracting]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleInteractionEnd, { passive: true });
    document.addEventListener('mouseleave', handleInteractionEnd);

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleInteractionEnd);
      document.removeEventListener('mouseleave', handleInteractionEnd);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, [
    handleMouseMove,
    handleTouchMove,
    handleTouchStart,
    handleInteractionEnd,
    handleDeviceOrientation,
  ]);

  return (
    <div
      ref={elementRef}
      className={`inline-block ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isInteracting ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

