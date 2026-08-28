/**
 * Type definitions for the TCAI Cinematic Scene Engine.
 * Inspired by react-kino, active-theory, and Apple product storytelling.
 */

export interface SceneConfig {
  id: string;
  videoStart: number;
  videoEnd: number;
  /** Height of the scroll track (e.g. '300vh', '400vh') */
  trackHeight: string;
  /** Label for debugging / telemetry */
  title: string;
  /** Non-linear time warp curve mapping sceneProgress (0->1) to videoTime ratio (0->1) */
  timeCurve?: (progress: number) => number;
  /** Responsive object-position for the video during this scene */
  focalPoint?: {
    mobile: string;
    desktop: string;
  };
  /** Subtle camera scale (e.g. 1.0 -> 1.03) */
  cameraScale?: [number, number];
}

export interface CinematicContextState {
  globalProgress: number;
  currentSceneId: string;
  currentSceneProgress: number;
  renderTime: number;
  targetTime: number;
  isReady: boolean;
}
