import React, { useRef, useEffect } from 'react';

interface HeroWaveCanvasProps {
  timelineProgress?: number;
  isHovered?: boolean;
}

export const HeroWaveCanvas: React.FC<HeroWaveCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const isTabActiveRef = useRef<boolean>(true);
  const prefersReducedMotionRef = useRef<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    // Prefers-reduced-motion check
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

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mousePosRef.current.targetX = x * 35;
      mousePosRef.current.targetY = y * 20;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

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

    // Grid definition for 3D undulating dual-tone wireframe (Cyan + Magenta/Purple)
    const cols = Math.max(45, Math.min(75, Math.floor((width || window.innerWidth) / 24)));
    const rows = 32;

    // Glowing energy nodes traveling along peaks
    interface EnergyPulse {
      col: number;
      row: number;
      speed: number;
      radius: number;
      color: string;
      coreColor: string;
    }

    const pulses: EnergyPulse[] = [
      { col: 5, row: 8, speed: 0.18, radius: 18, color: 'rgba(0, 210, 246, 0.95)', coreColor: '#FFFFFF' },
      { col: 18, row: 14, speed: 0.14, radius: 16, color: 'rgba(168, 85, 247, 0.95)', coreColor: '#F3E8FF' },
      { col: 30, row: 6, speed: 0.20, radius: 20, color: 'rgba(0, 150, 245, 0.95)', coreColor: '#FFFFFF' },
      { col: 10, row: 22, speed: 0.16, radius: 17, color: 'rgba(192, 132, 252, 0.9)', coreColor: '#FFFFFF' },
      { col: 40, row: 18, speed: 0.15, radius: 19, color: 'rgba(0, 210, 246, 0.95)', coreColor: '#FFFFFF' },
      { col: 22, row: 10, speed: 0.17, radius: 16, color: 'rgba(236, 72, 153, 0.9)', coreColor: '#FFFFFF' },
    ];

    let time = 0;

    const render = () => {
      if (isVisibleRef.current && isTabActiveRef.current && !prefersReducedMotionRef.current) {
        time += 0.016;

        // Smooth mouse spring physics
        mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.05;
        mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.05;

        ctx.clearRect(0, 0, width, height);

        // Perspective origin centered across right 2/3 (behind card and spreading to left)
        const originX = width * 0.62 + mousePosRef.current.x;
        const originY = height * 0.45 + mousePosRef.current.y;
        const gridWidth = width * 1.15;
        const gridHeight = height * 0.92;

        // Calculate 3D points
        const points: { x: number; y: number; z: number; alpha: number; isPurple: boolean }[][] = [];

        for (let r = 0; r < rows; r++) {
          points[r] = [];
          const v = r / (rows - 1); // 0 to 1
          const yBase = (v - 0.5) * gridHeight;

          for (let c = 0; c < cols; c++) {
            const u = c / (cols - 1); // 0 to 1
            const xBase = (u - 0.5) * gridWidth;

            // Harmonically rich 3D wave topography matching reference image
            const wave1 = Math.sin(u * 6.2 + time * 1.05 + v * 3.5) * 44;
            const wave2 = Math.cos(v * 5.2 - time * 0.9 + u * 3.8) * 34;
            const wave3 = Math.sin((u + v) * 5.0 + time * 1.3) * 22;
            const wave4 = Math.sin(u * 9.5 - time * 0.6) * 12;
            const z = wave1 + wave2 + wave3 + wave4;

            // Depth factor
            const depthFactor = 0.58 + v * 0.56;
            const px = originX + xBase * depthFactor;
            const py = originY + yBase * 0.58 + z * depthFactor;

            // Edge fade
            const edgeFadeX = Math.sin(u * Math.PI);
            const edgeFadeY = Math.sin(v * Math.PI);
            const heightBoost = (z + 55) / 125;
            const alpha = Math.max(0, Math.min(1, edgeFadeX * edgeFadeY * (0.55 + heightBoost * 0.45)));

            // Color zoning: Cyan towards front/left, Purple/Magenta towards mid/right
            const isPurple = u > 0.45 && v < 0.65;

            points[r][c] = { x: px, y: py, z, alpha, isPurple };
          }
        }

        // Draw horizontal undulating ribbons
        for (let r = 0; r < rows; r++) {
          ctx.beginPath();
          for (let c = 0; c < cols; c++) {
            const p = points[r][c];
            if (c === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          const rowProgress = r / (rows - 1);
          const strokeAlpha = (0.18 + rowProgress * 0.38) * Math.sin(rowProgress * Math.PI);

          // Vivid Multi-Harmonic Gradient: Cyan (#00D2F6) -> Electric Blue (#0096F5) -> Purple (#9333EA) -> Magenta (#C084FC)
          const grad = ctx.createLinearGradient(0, 0, width, 0);
          grad.addColorStop(0, `rgba(0, 210, 246, 0)`);
          grad.addColorStop(0.2, `rgba(0, 210, 246, ${strokeAlpha * 0.95})`);
          grad.addColorStop(0.5, `rgba(0, 150, 245, ${strokeAlpha * 0.9})`);
          grad.addColorStop(0.75, `rgba(147, 51, 234, ${strokeAlpha * 0.95})`);
          grad.addColorStop(0.9, `rgba(192, 132, 252, ${strokeAlpha * 0.75})`);
          grad.addColorStop(1, `rgba(147, 51, 234, 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.15 + rowProgress * 0.65;
          ctx.stroke();
        }

        // Draw vertical connector ribs
        for (let c = 0; c < cols; c += 2) {
          ctx.beginPath();
          for (let r = 0; r < rows; r++) {
            const p = points[r][c];
            if (r === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          const colProgress = c / (cols - 1);
          const vertAlpha = 0.14 * Math.sin(colProgress * Math.PI);
          
          if (colProgress > 0.5) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${vertAlpha})`;
          } else {
            ctx.strokeStyle = `rgba(0, 210, 246, ${vertAlpha})`;
          }
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }

        // Update and draw traveling glowing energy pulses
        pulses.forEach((pulse) => {
          pulse.col += pulse.speed;
          if (pulse.col >= cols - 1) {
            pulse.col = 0;
            pulse.row = Math.floor(Math.random() * (rows - 6)) + 3;
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

            // Radiant Energy Bloom
            const glowGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, pulse.radius);
            glowGrad.addColorStop(0, pulse.coreColor);
            glowGrad.addColorStop(0.25, pulse.color);
            glowGrad.addColorStop(0.7, 'rgba(0, 150, 245, 0.25)');
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(curX, curY, pulse.radius, 0, Math.PI * 2);
            ctx.fill();

            // Core brilliant point
            ctx.fillStyle = pulse.coreColor;
            ctx.beginPath();
            ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener('change', handleMotionChange);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 select-none opacity-95"
      aria-hidden="true"
    />
  );
};

export default HeroWaveCanvas;
