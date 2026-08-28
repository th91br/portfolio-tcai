/**
 * Timeline configuration for the TCAI Cinematic Video Scroll Scrubbing System.
 * Source Video: "Video Project.mp4" (14.766667s, 30fps, 1080p, H.264)
 */

export interface TimelineSegment {
  id: string;
  selector: string;
  startSeconds: number;
  endSeconds: number;
  label: string;
  narrative: string;
  /** Viewport anchor offset ratio (0 = top, 0.5 = center) */
  anchorRatio?: number;
}

export const CINEMATIC_VIDEO_CONFIG = {
  src: '/Video Project.mp4',
  duration: 14.766667,
  fps: 30,
  baseSmoothing: 0.09, // Empirical smoothing factor for buttery 60 FPS response
  minSeekDelta: 0.033, // 1 frame at 30fps threshold to eliminate redundant seeks
  initialTime: 0.0,
};

export const CINEMATIC_TIMELINE: TimelineSegment[] = [
  {
    id: 'hero',
    selector: '#hero-atelier',
    startSeconds: 0.0,
    endSeconds: 3.0,
    label: 'Aproximação & Scan Facial',
    narrative: 'Presença tecnológica inicial, a câmera se aproxima e a tecnologia ganha definição.',
    anchorRatio: 0.2,
  },
  {
    id: 'manifesto',
    selector: '#manifesto',
    startSeconds: 3.0,
    endSeconds: 4.5,
    label: 'Linhas de Dados & Engenharia',
    narrative: 'Contraste entre software genérico e arquitetura sob medida.',
    anchorRatio: 0.35,
  },
  {
    id: 'simulator',
    selector: '#simulator',
    startSeconds: 4.5,
    endSeconds: 7.2,
    label: 'Transformação de Dados & Capacete',
    narrative: 'Ondas de dados conectando inteligência artificial, SaaS e sistemas.',
    anchorRatio: 0.4,
  },
  {
    id: 'projects',
    selector: '#projects',
    startSeconds: 7.2,
    endSeconds: 8.7,
    label: 'Tecnologia Avançada & Capacete AI',
    narrative: 'Capacete de alta tecnologia representando automação, robustez e solidez.',
    anchorRatio: 0.3,
  },
  {
    id: 'what-i-create',
    selector: '#what-i-create',
    startSeconds: 8.7,
    endSeconds: 10.0,
    label: 'Aceleração & Engenharia de Produtos',
    narrative: 'Bento grid de capacidades sincronizado com o fluxo tecnológico.',
    anchorRatio: 0.35,
  },
  {
    id: 'services',
    selector: '#services',
    startSeconds: 10.0,
    endSeconds: 11.1,
    label: 'Desaceleração & Rumo ao Humano',
    narrative: 'A tecnologia desacelera e se prepara para revelar a mente por trás da engenharia.',
    anchorRatio: 0.4,
  },
  {
    id: 'about',
    selector: '#about',
    startSeconds: 11.1,
    endSeconds: 13.3,
    label: 'Abertura do Capacete & Revelação Humana (Clímax)',
    narrative: 'O capacete se abre e revela o rosto do Thiago: a tecnologia amplifica, mas o humano é o centro.',
    anchorRatio: 0.4,
  },
  {
    id: 'testimonials',
    selector: '#testimonials-ticker',
    startSeconds: 13.3,
    endSeconds: 14.4,
    label: 'Identidade Humana Revelada',
    narrative: 'Presença humana confiante e estabilizada para leitura dos depoimentos.',
    anchorRatio: 0.5,
  },
  {
    id: 'contact',
    selector: '#contact',
    startSeconds: 14.4,
    endSeconds: 14.766,
    label: 'Frame Final Humano (Congelado)',
    narrative: 'A jornada encerra no humano: Thiago Cassol Antunes pronto para iniciar seu projeto.',
    anchorRatio: 0.5,
  },
];
