import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useWebPSequence } from '../../cinematic/useWebPSequence';

export interface SceneVisualMilestone {
  progress: number;   // 0.0 to 1.0
  frame: number;      // 0 to 159
  opacity: number;    // 0.0 to 1.0
  scale: number;      // 0.95 to 1.15
  translateX: number; // in percent, e.g. 6 = 6%
  translateY: number; // in percent
}

export const SCENE_MILESTONES: SceneVisualMilestone[] = [
  // Scene 01 (0.0s - 1.27s): Initial human presence -> Hero
  { progress: 0.000, frame: 0,   opacity: 0.92, scale: 1.00, translateX: 0,  translateY: 0 },
  // Scene 02 (1.27s - 5.27s): Human + interface / facial scan -> Manifesto
  { progress: 0.125, frame: 32,  opacity: 0.45, scale: 1.05, translateX: 6,  translateY: 0 },
  // Scene 03 (5.27s - 7.10s): Data transformation & systems -> Simulador
  { progress: 0.250, frame: 59,  opacity: 0.35, scale: 1.08, translateX: 0,  translateY: 0 },
  // Scene 04 (7.10s - 11.50s): Advanced helmet / AI technology -> Projetos
  { progress: 0.375, frame: 77,  opacity: 0.30, scale: 1.10, translateX: -4, translateY: 0 },
  // Scene 04 continued: AI products & digital solutions -> O Que Eu Crio
  { progress: 0.500, frame: 100, opacity: 0.35, scale: 1.08, translateX: 4,  translateY: 0 },
  // Scene 05 (11.50s - 12.37s): Mechanical opening / helmet transition -> Serviços
  { progress: 0.625, frame: 121, opacity: 0.35, scale: 1.06, translateX: 0,  translateY: 0 },
  // Scene 06 (12.37s - 14.77s): Human reveal / founder presence -> Sobre Mim
  { progress: 0.750, frame: 133, opacity: 0.75, scale: 1.02, translateX: 8,  translateY: 0 },
  // Scene 06 continued: Confident executive presence -> Depoimentos
  { progress: 0.875, frame: 146, opacity: 0.30, scale: 1.12, translateX: 0,  translateY: 0 },
  // Scene 06 conclusion: Final hero frame -> Contato & CTA
  { progress: 1.000, frame: 159, opacity: 0.55, scale: 1.00, translateX: 0,  translateY: 0 },
];

interface GlobalCinematicRendererProps {
  progress: number; // Continuous 0.000 to 1.000
}

export const GlobalCinematicRenderer: React.FC<GlobalCinematicRendererProps> = ({
  progress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { imagesRef, totalFrames, registerFrameLoadListener } = useWebPSequence();

  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const isAudioPlayingRef = useRef(false);
  const lastAudioSyncTimeRef = useRef(0);

  // Compute interpolated spatial values from progress
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

    // Smooth hermite / smoothstep interpolation
    const ease = localT * localT * (3 - 2 * localT);

    const opacity = m1.opacity + (m2.opacity - m1.opacity) * ease;
    const scale = m1.scale + (m2.scale - m1.scale) * ease;
    const translateX = m1.translateX + (m2.translateX - m1.translateX) * ease;
    const translateY = m1.translateY + (m2.translateY - m1.translateY) * ease;
    const exactFrame = m1.frame + (m2.frame - m1.frame) * ease;

    return { opacity, scale, translateX, translateY, exactFrame };
  };

  const spatial = computeSpatialValues(progress);

  // Instant 60-120 FPS Canvas Rendering directly tied to progress
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const exactFrame = spatial.exactFrame;
    const safeIdx = Math.min(totalFrames - 1, Math.max(0, Math.round(exactFrame)));
    let img = imagesRef.current[safeIdx];

    // Fallback if current frame is loading
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
    if (cw === 0 || ch === 0) return;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    ctx.clearRect(0, 0, cw, ch);

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.drawImage(img, nx, ny, nw, nh);
  }, [imagesRef, progress, spatial.exactFrame, totalFrames]);

  // Canvas Resize Handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const unregisterLoadListener = registerFrameLoadListener(() => {
      // Force repaint when new frames load
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const exactFrame = spatial.exactFrame;
        const safeIdx = Math.min(totalFrames - 1, Math.max(0, Math.round(exactFrame)));
        const img = imagesRef.current[safeIdx];
        if (img && img.complete && img.naturalWidth > 0) {
          const cw = canvas.width;
          const ch = canvas.height;
          const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
          const nw = img.naturalWidth * scale;
          const nh = img.naturalHeight * scale;
          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(img, (cw - nw) / 2, (ch - nh) / 2, nw, nh);
        }
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unregisterLoadListener();
    };
  }, [imagesRef, registerFrameLoadListener, spatial.exactFrame, totalFrames]);

  // Synchronized Soundtrack Engine
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioEnabled) return;

    const DURATION = 14.766667;
    const targetTime = progress * DURATION;
    const now = performance.now();

    // Sync audio position with scroll smoothly if drift is noticeable (>0.35s)
    if (Math.abs(audio.currentTime - targetTime) > 0.35 && now - lastAudioSyncTimeRef.current > 100) {
      audio.currentTime = targetTime;
      lastAudioSyncTimeRef.current = now;
    }

    if (audio.paused && isAudioEnabled) {
      audio.play().catch(() => {
        setAudioError(true);
      });
    }
  }, [isAudioEnabled, progress]);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);

    if (audio) {
      if (nextState) {
        audio.currentTime = progress * 14.766667;
        audio.muted = false;
        audio.volume = 0.85;
        audio
          .play()
          .then(() => {
            isAudioPlayingRef.current = true;
            setAudioError(false);
          })
          .catch(() => {
            setAudioError(true);
          });
      } else {
        audio.pause();
        isAudioPlayingRef.current = false;
      }
    }
  }, [isAudioEnabled, progress]);

  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] pointer-events-none z-0 overflow-hidden bg-[#000000] select-none">
      {/* 1. Global Ambient Halo Lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#00D2F6]/15 via-[#015EEF]/8 to-transparent blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[550px] h-[400px] bg-[#015EEF]/8 blur-[160px] pointer-events-none" />

      {/* 2. Monumental Background Watermark "TCAI" */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0 select-none overflow-hidden"
      >
        <span
          className="font-black uppercase tracking-tighter text-white/[0.025] leading-none block scale-110"
          style={{ fontSize: 'clamp(8rem, 26vw, 380px)' }}
        >
          TCAI
        </span>
      </div>

      {/* 3. Ultra-Fast High-DPI Canvas Sequence with Hardware-Accelerated Continuous Transforms */}
      <div
        className="absolute inset-0 flex items-end justify-center overflow-hidden transition-transform duration-75 ease-out"
        style={{
          opacity: spatial.opacity,
          transform: `translate(${spatial.translateX}%, ${spatial.translateY}%) scale(${spatial.scale})`,
        }}
      >
        {/* Subtle Ambient Rim Glow behind Visual */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-t from-[#00D2F6]/20 via-[#015EEF]/10 to-transparent blur-[120px] rounded-full -z-10 pointer-events-none" />

        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover object-center drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)] [mask-image:radial-gradient(ellipse_65%_75%_at_50%_48%,black_30%,transparent_85%)] select-none pointer-events-auto filter contrast-[1.06] brightness-[0.96]"
        />
      </div>

      {/* 4. Synchronized Audio Element with Video Soundtrack */}
      <audio
        ref={audioRef}
        src="/Video Project.mp4"
        preload="auto"
        loop
        playsInline
        className="hidden"
      />

      {/* 5. Master Ambient Audio & Soundtrack Controller (Bottom-Left) */}
      <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-8 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={toggleAudio}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full border transition-all text-xs font-mono cursor-pointer backdrop-blur-xl shadow-2xl ${
            isAudioEnabled
              ? 'bg-[#080D18]/90 border-[#00D2F6] text-[#00D2F6] shadow-[#00D2F6]/20'
              : 'bg-[#080D18]/80 border-[#151F38] hover:border-[#00D2F6]/60 text-[#AEB7C4] hover:text-white'
          }`}
          aria-label={isAudioEnabled ? 'Desativar áudio sincronizado' : 'Ativar áudio sincronizado do vídeo'}
        >
          {isAudioEnabled ? (
            <>
              {/* Animated Equalizer Wave Bars */}
              <div className="flex items-center gap-0.5 h-3.5">
                <span className="w-0.5 h-3 bg-[#00D2F6] rounded-full animate-[bounce_0.6s_infinite_100ms]" />
                <span className="w-0.5 h-3.5 bg-[#00D2F6] rounded-full animate-[bounce_0.6s_infinite_200ms]" />
                <span className="w-0.5 h-2 bg-[#00D2F6] rounded-full animate-[bounce_0.6s_infinite_300ms]" />
                <span className="w-0.5 h-3 bg-[#00D2F6] rounded-full animate-[bounce_0.6s_infinite_150ms]" />
              </div>
              <span className="font-bold tracking-wider uppercase text-[10px] sm:text-[11px]">
                SOM SINCRONIZADO ATIVO
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#7E8998] group-hover:text-white" />
              <span className="font-medium tracking-wider uppercase text-[10px] sm:text-[11px]">
                ATIVAR ÁUDIO DO VÍDEO
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
