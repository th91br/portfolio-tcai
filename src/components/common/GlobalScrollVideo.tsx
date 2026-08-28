import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useWebPSequence, TOTAL_FRAMES } from '../../cinematic/useWebPSequence';

export interface SceneVisualMilestone {
  progress: number;   // 0.0 to 1.0
  frame: number;      // 0 to 159
  opacity: number;    // 0.95 to 1.0
  scale: number;      // 1.00 to 1.05
  translateX: number; // in percent
  translateY: number; // in percent
}

export const SCENE_MILESTONES: SceneVisualMilestone[] = [
  // Scene 01 (0.00s - 1.27s): Initial human presence -> Hero (Thiago in executive studio)
  { progress: 0.000, frame: 0,   opacity: 1.00, scale: 1.00, translateX: 0,  translateY: 0 },
  // Scene 02 (1.27s - 5.27s): Human + interface / facial scan -> Manifesto
  { progress: 0.120, frame: 32,  opacity: 0.95, scale: 1.02, translateX: 0,  translateY: 0 },
  // Scene 03 (5.27s - 7.10s): Data transformation & systems -> Simulador
  { progress: 0.250, frame: 59,  opacity: 0.95, scale: 1.03, translateX: 0,  translateY: 0 },
  // Scene 04 (7.10s - 9.20s): Advanced helmet / technology -> Projetos
  { progress: 0.420, frame: 80,  opacity: 0.95, scale: 1.04, translateX: 0,  translateY: 0 },
  // Scene 04 continued: Active digital capabilities -> O Que Eu Construo
  { progress: 0.580, frame: 105, opacity: 0.95, scale: 1.03, translateX: 0,  translateY: 0 },
  // Scene 05 (11.50s - 12.37s): Mechanical visor opening -> Metodologia
  { progress: 0.700, frame: 121, opacity: 0.98, scale: 1.02, translateX: 0,  translateY: 0 },
  // Scene 06 (12.37s - 13.50s): Human face reveal / founder presence -> Sobre Mim
  { progress: 0.800, frame: 133, opacity: 1.00, scale: 1.00, translateX: 0,  translateY: 0 },
  // Scene 06 continued: Executive presence & confidence -> Depoimentos
  { progress: 0.900, frame: 146, opacity: 0.95, scale: 1.02, translateX: 0,  translateY: 0 },
  // Scene 06 conclusion: Final hero frame -> Contato & CTA
  { progress: 1.000, frame: 159, opacity: 1.00, scale: 1.00, translateX: 0,  translateY: 0 },
];

interface GlobalScrollVideoProps {
  progress: number; // Continuous 0.000 to 1.000
}

export const GlobalScrollVideo: React.FC<GlobalScrollVideoProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { imagesRef, totalFrames, registerFrameLoadListener, ensureFrameRange } = useWebPSequence();

  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const fadeIntervalRef = useRef<number | null>(null);
  const lastRenderedFrameRef = useRef<number>(-1);

  // Compute interpolated spatial values from global progress
  const computeSpatialValues = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    let i = 0;
    while (i < SCENE_MILESTONES.length - 1 && SCENE_MILESTONES[i + 1].progress < clamped) {
      i++;
    }
    const m1 = SCENE_MILESTONES[i];
    const m2 = SCENE_MILESTONES[Math.min(SCENE_MILESTONES.length - 1, i + 1)];
    const segmentSpan = Math.max(0.0001, m2.progress - m1.progress);
    const localT = Math.max(0, Math.min(1, (clamped - m1.progress) / segmentSpan));

    // Smoothstep Hermite curve
    const ease = localT * localT * (3 - 2 * localT);

    const opacity = m1.opacity + (m2.opacity - m1.opacity) * ease;
    const scale = m1.scale + (m2.scale - m1.scale) * ease;
    const translateX = m1.translateX + (m2.translateX - m1.translateX) * ease;
    const translateY = m1.translateY + (m2.translateY - m1.translateY) * ease;
    const exactFrame = m1.frame + (m2.frame - m1.frame) * ease;

    return { opacity, scale, translateX, translateY, exactFrame };
  };

  const spatial = computeSpatialValues(progress);

  // Preload frame buffer around current target frame
  useEffect(() => {
    const center = Math.round(spatial.exactFrame);
    ensureFrameRange(center, 30);
  }, [ensureFrameRange, spatial.exactFrame]);

  // Continuous Sub-Millisecond 60-120 FPS GPU Canvas Frame Drawing
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const exactFrame = spatial.exactFrame;
    const safeIdx = Math.min(totalFrames - 1, Math.max(0, Math.round(exactFrame)));
    let img = imagesRef.current[safeIdx];

    // Fallback to nearest loaded frame for 0ms zero-flicker
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 40; offset++) {
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    const cw = canvas.width;
    const ch = canvas.height;

    if (img && img.complete && img.naturalWidth > 0) {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const nx = (cw - nw) / 2;
      const ny = (ch - nh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, nx, ny, nw, nh);
      lastRenderedFrameRef.current = safeIdx;
    }
  }, [imagesRef, spatial.exactFrame, totalFrames]);

  useEffect(() => {
    drawFrame();
  }, [drawFrame, progress]);

  // Window Resize & Frame Load Listeners
  useEffect(() => {
    const handleResize = () => {
      drawFrame();
    };

    window.addEventListener('resize', handleResize);
    const unregister = registerFrameLoadListener(() => {
      drawFrame();
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unregister();
    };
  }, [drawFrame, registerFrameLoadListener]);

  // Audio Toggle with Smooth Fade-in / Fade-out
  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);

    if (audio) {
      if (nextState) {
        audio.volume = 0.0;
        audio.currentTime = progress * 14.766667;
        audio
          .play()
          .then(() => {
            let vol = 0.0;
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = window.setInterval(() => {
              vol = Math.min(0.8, vol + 0.08);
              audio.volume = vol;
              if (vol >= 0.8) {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
              }
            }, 30);
          })
          .catch(() => {
            setIsAudioEnabled(false);
          });
      } else {
        let vol = audio.volume;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = window.setInterval(() => {
          vol = Math.max(0, vol - 0.12);
          audio.volume = vol;
          if (vol <= 0.01) {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            audio.pause();
          }
        }, 25);
      }
    }
  }, [isAudioEnabled, progress]);

  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] pointer-events-none z-0 overflow-hidden bg-[#020408] select-none">
      {/* 1. Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#00D2F6]/15 via-[#015EEF]/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[600px] h-[400px] bg-[#015EEF]/12 blur-[130px] pointer-events-none" />

      {/* 2. Fullscreen Vibrant Edge-to-Edge Cinematic Video Canvas */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-75 ease-out"
        style={{
          opacity: spatial.opacity,
          transform: `translate3d(${spatial.translateX}%, ${spatial.translateY}px, 0) scale(${spatial.scale})`,
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover object-center filter contrast-[1.04] brightness-[1.02]"
        />

        {/* Delicate Cinematic Vignette - Video is 100% visible and vivid while text is crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408]/40 via-transparent to-[#020408]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,#020408_90%)] pointer-events-none opacity-60" />
      </div>

      {/* 4. Audio Element */}
      <audio
        ref={audioRef}
        src="/Video Project.mp4"
        preload="auto"
        loop
        playsInline
        className="hidden"
      />

      {/* 5. Master Ambient Audio Controller (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={toggleAudio}
          className={`group flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-all text-xs font-mono cursor-pointer backdrop-blur-xl shadow-2xl ${
            isAudioEnabled
              ? 'bg-[#060B18]/90 border-[#00D2F6] text-[#00D2F6] shadow-[#00D2F6]/25'
              : 'bg-[#060B18]/80 border-white/10 hover:border-[#00D2F6]/60 text-[#AEB7C4] hover:text-white'
          }`}
          aria-label={isAudioEnabled ? 'Desativar som da experiência' : 'Ativar som da experiência'}
        >
          {isAudioEnabled ? (
            <>
              <div className="flex items-center gap-0.5 h-3.5">
                <span className="w-0.5 h-3 bg-[#00D2F6] rounded-full animate-[bounce_0.6s_infinite_100ms]" />
                <span className="w-0.5 h-3.5 bg-[#00D2F6] rounded-full animate-[bounce_0.6s_infinite_200ms]" />
                <span className="w-0.5 h-2 bg-[#00D2F6] rounded-full animate-[bounce_0.6s_infinite_300ms]" />
                <span className="w-0.5 h-3 bg-[#00D2F6] rounded-full animate-[bounce_0.6s_infinite_150ms]" />
              </div>
              <span className="font-bold tracking-wider uppercase text-[10px] sm:text-[11px]">
                ÁUDIO ATIVO
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#7E8998] group-hover:text-white" />
              <span className="font-medium tracking-wider uppercase text-[10px] sm:text-[11px]">
                EXPERIÊNCIA COM SOM
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
