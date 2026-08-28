import { useEffect, useRef, useState, useCallback } from 'react';

export const TOTAL_FRAMES = 160;

export const useWebPSequence = () => {
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadedCount, setLoadedCount] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);
  const onFrameLoadCallbacksRef = useRef<(() => void)[]>([]);
  const loadingSetRef = useRef<Set<number>>(new Set());

  const registerFrameLoadListener = useCallback((cb: () => void) => {
    onFrameLoadCallbacksRef.current.push(cb);
    return () => {
      onFrameLoadCallbacksRef.current = onFrameLoadCallbacksRef.current.filter((c) => c !== cb);
    };
  }, []);

  const loadSingleFrame = useCallback((index: number, priority: 'high' | 'auto' | 'low' = 'auto') => {
    if (index < 0 || index >= TOTAL_FRAMES) return;
    if (imagesRef.current[index] || loadingSetRef.current.has(index)) return;

    loadingSetRef.current.add(index);
    const img = new Image();
    // @ts-ignore
    if ('fetchPriority' in img) {
      // @ts-ignore
      img.fetchPriority = priority;
    }
    img.src = `/frames/frame_${String(index).padStart(3, '0')}.webp`;

    img.onload = () => {
      imagesRef.current[index] = img;
      setLoadedCount((prev) => prev + 1);
      if (index === 0) {
        setIsInitialReady(true);
      }
      onFrameLoadCallbacksRef.current.forEach((cb) => cb());
    };

    img.onerror = () => {
      loadingSetRef.current.delete(index);
    };
  }, []);

  // Priority Tier 1: Load Hero frames (0 to 20) with high priority
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load initial frames instantly
    for (let i = 0; i < 20; i++) {
      loadSingleFrame(i, i < 5 ? 'high' : 'auto');
    }

    // Priority Tier 2: Load key narrative landmarks next
    const landmarks = [32, 59, 77, 100, 121, 133, 146, 159];
    landmarks.forEach((idx) => loadSingleFrame(idx, 'auto'));

    // Priority Tier 3: Stream all remaining frames progressively
    let nextIdx = 20;
    const batchSize = 10;

    const streamInterval = setInterval(() => {
      for (let i = 0; i < batchSize && nextIdx < TOTAL_FRAMES; i++) {
        loadSingleFrame(nextIdx, 'low');
        nextIdx++;
      }
      if (nextIdx >= TOTAL_FRAMES) {
        clearInterval(streamInterval);
      }
    }, 40);

    return () => clearInterval(streamInterval);
  }, [loadSingleFrame]);

  // Priority Tier 4: Bidirectional buffer around current playback head
  const ensureFrameRange = useCallback(
    (centerFrame: number, radius: number = 20) => {
      const start = Math.max(0, centerFrame - radius);
      const end = Math.min(TOTAL_FRAMES - 1, centerFrame + radius);
      for (let i = start; i <= end; i++) {
        loadSingleFrame(i, 'high');
      }
    },
    [loadSingleFrame]
  );

  return {
    imagesRef,
    totalFrames: TOTAL_FRAMES,
    loadedCount,
    isInitialReady,
    registerFrameLoadListener,
    ensureFrameRange,
  };
};
