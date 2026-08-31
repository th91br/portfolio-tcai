import React, { useRef, useEffect } from 'react';

interface HeroWaveCanvasProps {
  timelineProgress?: number; // 0 to 1 over 8s master cycle
  isHovered?: boolean;
}

export const HeroWaveCanvas: React.FC<HeroWaveCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const isTabActiveRef = useRef<boolean>(true);
  const prefersReducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // Tab visibility check
    const handleVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    // Grid definition for 3D undulating wireframe
    const cols = Math.max(32, Math.min(50, Math.floor(width / 35)));
    const rows = 20;

    // Energy light pulses
    interface EnergyPulse {
      col: number;
      row: number;
      speed: number;
      intensity: number;
      life: number;
    }

    const pulses: EnergyPulse[] = [
      { col: 0, row: 8, speed: 0.12, intensity: 1.0, life: 1.0 },
      { col: 10, row: 12, speed: 0.15, intensity: 0.85, life: 0.7 },
      { col: 20, row: 6, speed: 0.11, intensity: 0.9, life: 0.9 },
      { col: 5, row: 15, speed: 0.14, intensity: 0.8, life: 0.6 },
    ];

    let time = 0;

    const render = () => {
      if (isVisibleRef.current && isTabActiveRef.current && !prefersReducedMotionRef.current) {
        time += 0.016; // ~60fps step
        ctx.clearRect(0, 0, width, height);

        // Center perspective origin around the right card area
        const originX = width * 0.62;
        const originY = height * 0.48;
        const gridWidth = width * 0.9;
        const gridHeight = height * 0.75;

        // Calculate 3D points
        const points: { x: number; y: number; z: number; alpha: number }[][] = [];

        for (let r = 0; r < rows; r++) {
          points[r] = [];
          const v = r / (rows - 1); // 0 to 1
          const yBase = (v - 0.5) * gridHeight;

          for (let c = 0; c < cols; c++) {
            const u = c / (cols - 1); // 0 to 1
            const xBase = (u - 0.5) * gridWidth;

            // Fluid dual-sine wave elevation math
            const wave1 = Math.sin(u * 5.2 + time * 0.9 + v * 2.8) * 32;
            const wave2 = Math.cos(v * 4.5 - time * 0.7 + u * 3.1) * 24;
            const wave3 = Math.sin((u + v) * 4.0 + time * 1.2) * 16;
            const z = wave1 + wave2 + wave3;

            // Perspective projection with slight isometric tilt
            const depthFactor = 0.65 + v * 0.45;
            const px = originX + xBase * depthFactor;
            const py = originY + yBase * 0.55 + z * depthFactor;

            // Opacity fades toward edges for cinematic luxury vignette
            const edgeFadeX = Math.sin(u * Math.PI);
            const edgeFadeY = Math.sin(v * Math.PI);
            const alpha = Math.max(0, Math.min(1, edgeFadeX * edgeFadeY * (0.45 + (z + 40) / 100)));

            points[r][c] = { x: px, y: py, z, alpha };
          }
        }

        // Draw horizontal grid lines with gradient
        for (let r = 0; r < rows; r++) {
          ctx.beginPath();
          for (let c = 0; c < cols; c++) {
            const p = points[r][c];
            if (c === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          const rowProgress = r / (rows - 1);
          const strokeAlpha = (0.12 + rowProgress * 0.25) * Math.sin(rowProgress * Math.PI);
          
          // TCA Identity: Cyan to Blue
          const grad = ctx.createLinearGradient(0, 0, width, 0);
          grad.addColorStop(0, `rgba(0, 210, 246, 0)`);
          grad.addColorStop(0.35, `rgba(0, 210, 246, ${strokeAlpha * 0.7})`);
          grad.addColorStop(0.65, `rgba(0, 150, 245, ${strokeAlpha})`);
          grad.addColorStop(0.9, `rgba(1, 94, 239, ${strokeAlpha * 0.8})`);
          grad.addColorStop(1, `rgba(29, 71, 239, 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.0 + rowProgress * 0.4;
          ctx.stroke();
        }

        // Draw vertical grid lines connecting depth
        for (let c = 0; c < cols; c += 2) {
          ctx.beginPath();
          for (let r = 0; r < rows; r++) {
            const p = points[r][c];
            if (r === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          const colProgress = c / (cols - 1);
          const vertAlpha = 0.08 * Math.sin(colProgress * Math.PI);
          ctx.strokeStyle = `rgba(0, 210, 246, ${vertAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Update and draw traveling energy pulses
        pulses.forEach((pulse) => {
          pulse.col += pulse.speed;
          if (pulse.col >= cols - 1) {
            pulse.col = 0;
            pulse.row = Math.floor(Math.random() * (rows - 4)) + 2;
          }

          const cIdx = Math.floor(pulse.col);
          const nextCIdx = Math.min(cols - 1, cIdx + 1);
          const fract = pulse.col - cIdx;
          const rIdx = pulse.row;

          if (points[rIdx] && points[rIdx][cIdx] && points[rIdx][nextCIdx]) {
            const p1 = points[rIdx][cIdx];
            const p2 = points[rIdx][nextCIdx];
            const curX = p1.x + (p2.x - p1.x) * fract;
            const curY = p1.y + (p2.y - p1.y) * fract;

            // Glowing energy node
            const glowGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, 16);
            glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            glowGrad.addColorStop(0.25, 'rgba(0, 210, 246, 0.75)');
            glowGrad.addColorStop(0.6, 'rgba(0, 150, 245, 0.3)');
            glowGrad.addColorStop(1, 'rgba(1, 94, 239, 0)');

            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(curX, curY, 16, 0, Math.PI * 2);
            ctx.fill();

            // Core bright point
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(curX, curY, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener('change', handleMotionChange);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 select-none opacity-85"
      aria-hidden="true"
    />
  );
};

export default HeroWaveCanvas;
