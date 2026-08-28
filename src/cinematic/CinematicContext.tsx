import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { SCENE_MANIFEST } from './sceneManifest';
import { SceneConfig, CinematicContextState } from './types';

interface SceneProgressMap {
  [sceneId: string]: number;
}

interface CinematicContextType extends CinematicContextState {
  sceneProgresses: SceneProgressMap;
  registerSceneProgress: (sceneId: string, progress: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const CinematicContext = createContext<CinematicContextType | null>(null);

export const CinematicProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState<string>('hero');
  const [currentSceneProgress, setCurrentSceneProgress] = useState<number>(0);
  const [globalProgress, setGlobalProgress] = useState<number>(0);
  const [renderTime, setRenderTime] = useState<number>(0);

  const sceneProgressesRef = useRef<SceneProgressMap>({});
  const targetTimeRef = useRef<number>(0);
  const renderTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);

  // Register scene progress with sub-pixel precision
  const registerSceneProgress = useCallback((sceneId: string, progress: number) => {
    sceneProgressesRef.current[sceneId] = progress;
  }, []);

  // Compute video target time across active scenes
  const computeTargetTime = useCallback((): { time: number; activeId: string; activeProg: number } => {
    if (typeof window === 'undefined') {
      return { time: 0, activeId: 'hero', activeProg: 0 };
    }

    const vh = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const globalRatio = Math.min(1, Math.max(0, scrollY / maxScroll));

    let activeScene: SceneConfig = SCENE_MANIFEST[0];
    let activeProg = 0;
    let found = false;

    // Check each scene element's DOM bounding rect
    for (const scene of SCENE_MANIFEST) {
      const el = document.getElementById(`scene-track-${scene.id}`);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      // If the scene container is currently intersecting the active viewport
      if (rect.top <= 0 && rect.bottom >= 0) {
        activeScene = scene;
        const total = rect.height - vh;
        activeProg = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        found = true;
        break;
      }
    }

    if (!found) {
      // Fallback to top or bottom
      if (scrollY <= 0) {
        return { time: 0, activeId: 'hero', activeProg: 0 };
      }
      activeScene = SCENE_MANIFEST[SCENE_MANIFEST.length - 1];
      activeProg = 1;
    }

    // Apply scene time warp curve
    const warpedProgress = activeScene.timeCurve
      ? activeScene.timeCurve(activeProg)
      : activeProg;

    const time =
      activeScene.videoStart +
      warpedProgress * (activeScene.videoEnd - activeScene.videoStart);

    return {
      time: Math.min(14.766, Math.max(0, time)),
      activeId: activeScene.id,
      activeProg,
    };
  }, []);

  // Continuous LERP render loop
  const tick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const target = targetTimeRef.current;
    const current = renderTimeRef.current;
    const diff = target - current;

    // Responsive smoothing factor (0.08 for smooth cinema feel)
    if (Math.abs(diff) > 0.001) {
      renderTimeRef.current += diff * 0.08;
    } else {
      renderTimeRef.current = target;
    }

    // Seek guard: don't flood seek if browser decoder is still seeking
    if (
      video.readyState >= 2 &&
      !isSeekingRef.current &&
      Math.abs(video.currentTime - renderTimeRef.current) >= 0.033
    ) {
      isSeekingRef.current = true;
      video.currentTime = renderTimeRef.current;
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  // Handle scroll & init
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (!isReady) setIsReady(true);
    };

    const handleSeeking = () => {
      isSeekingRef.current = true;
    };

    const handleScroll = () => {
      const { time, activeId, activeProg } = computeTargetTime();
      targetTimeRef.current = time;
      setCurrentSceneId(activeId);
      setCurrentSceneProgress(activeProg);

      const vh = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      setGlobalProgress(Math.min(1, Math.max(0, scrollY / maxScroll)));
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('seeking', handleSeeking);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial position seek
    handleScroll();
    renderTimeRef.current = targetTimeRef.current;
    if (video.readyState >= 2) {
      video.currentTime = targetTimeRef.current;
    }

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('seeking', handleSeeking);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [computeTargetTime, isReady, tick]);

  return (
    <CinematicContext.Provider
      value={{
        globalProgress,
        currentSceneId,
        currentSceneProgress,
        renderTime,
        targetTime: targetTimeRef.current,
        isReady,
        sceneProgresses: sceneProgressesRef.current,
        registerSceneProgress,
        videoRef,
      }}
    >
      {children}
    </CinematicContext.Provider>
  );
};

export const useCinematic = () => {
  const context = useContext(CinematicContext);
  if (!context) {
    throw new Error('useCinematic must be used within a CinematicProvider');
  }
  return context;
};
