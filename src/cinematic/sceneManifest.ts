import { SceneConfig } from './types';

/**
 * Mathematical easing curves for time warping with holds.
 */
export const timeCurves = {
  /** Linear */
  linear: (p: number) => p,

  /** Hero Curve: slow approach -> hold in middle -> gentle exit */
  hero: (p: number) => {
    if (p < 0.1) return p * 0.5; // 0.0 -> 0.05
    if (p < 0.45) return 0.05 + ((p - 0.1) / 0.35) * 0.55; // 0.05 -> 0.60
    if (p < 0.65) return 0.60 + ((p - 0.45) / 0.20) * 0.08; // HOLD: 0.60 -> 0.68
    if (p < 0.90) return 0.68 + ((p - 0.65) / 0.25) * 0.22; // 0.68 -> 0.90
    return 0.90 + ((p - 0.90) / 0.10) * 0.10; // 0.90 -> 1.00
  },

  /** About Climax Curve: deliberate pacing across helmet opening -> eyes -> full face */
  aboutClimax: (p: number) => {
    if (p < 0.20) return p * 0.6; // 0.0 -> 0.12 (Helmet closed)
    if (p < 0.45) return 0.12 + ((p - 0.20) / 0.25) * 0.38; // 0.12 -> 0.50 (Mechanisms unlock)
    if (p < 0.70) return 0.50 + ((p - 0.45) / 0.25) * 0.28; // 0.50 -> 0.78 (Eyes & Visor open)
    return 0.78 + ((p - 0.70) / 0.30) * 0.22; // 0.78 -> 1.00 (Full face stabilized)
  },

  /** Subtle deceleration curve for services / testimonials */
  easeOutQuad: (p: number) => 1 - (1 - p) * (1 - p),
};

export const SCENE_MANIFEST: SceneConfig[] = [
  {
    id: 'hero',
    title: 'Abertura & Scan Facial',
    videoStart: 0.0,
    videoEnd: 3.0,
    trackHeight: '320vh',
    timeCurve: timeCurves.hero,
    focalPoint: {
      mobile: '50% 32%',
      desktop: '64% center',
    },
    cameraScale: [1.0, 1.02],
  },
  {
    id: 'manifesto',
    title: 'Engenharia Sob Medida vs Genérico',
    videoStart: 3.0,
    videoEnd: 4.8,
    trackHeight: '250vh',
    focalPoint: {
      mobile: '50% 35%',
      desktop: '60% 45%',
    },
    cameraScale: [1.01, 1.025],
  },
  {
    id: 'simulator',
    title: 'Simulador de Arquitetura & Escopo',
    videoStart: 4.8,
    videoEnd: 7.2,
    trackHeight: '260vh',
    focalPoint: {
      mobile: '50% 38%',
      desktop: '58% 50%',
    },
  },
  {
    id: 'projects',
    title: 'Cases & Transformações Reais',
    videoStart: 7.2,
    videoEnd: 8.8,
    trackHeight: '280vh',
    focalPoint: {
      mobile: '50% 40%',
      desktop: '62% 48%',
    },
  },
  {
    id: 'what-i-create',
    title: 'Bento Grid de Capacidades',
    videoStart: 8.8,
    videoEnd: 10.0,
    trackHeight: '260vh',
    focalPoint: {
      mobile: '50% 40%',
      desktop: '60% 45%',
    },
  },
  {
    id: 'services',
    title: 'Desaceleração & Escopo de Atuação',
    videoStart: 10.0,
    videoEnd: 11.1,
    trackHeight: '220vh',
    timeCurve: timeCurves.easeOutQuad,
    focalPoint: {
      mobile: '50% 35%',
      desktop: '55% 42%',
    },
  },
  {
    id: 'about',
    title: 'O Clímax: Abertura do Capacete & Revelação Humana',
    videoStart: 11.1,
    videoEnd: 13.3,
    trackHeight: '380vh',
    timeCurve: timeCurves.aboutClimax,
    focalPoint: {
      mobile: '50% 32%',
      desktop: '52% 42%',
    },
    cameraScale: [1.02, 1.04],
  },
  {
    id: 'testimonials',
    title: 'Presença Humana & Avaliações 5.0',
    videoStart: 13.3,
    videoEnd: 14.4,
    trackHeight: '220vh',
    focalPoint: {
      mobile: '50% 35%',
      desktop: '54% 45%',
    },
  },
  {
    id: 'contact',
    title: 'CTA Final & Congelamento Humano',
    videoStart: 14.4,
    videoEnd: 14.766,
    trackHeight: '240vh',
    focalPoint: {
      mobile: '50% 35%',
      desktop: '55% 45%',
    },
  },
];
