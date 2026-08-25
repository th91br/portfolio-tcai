export interface ServiceItem {
  id: string;
  number: string;
  name: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  name: string;
  category: string;
  col1TopImage: string;
  col1BottomImage: string;
  col2Image: string;
  liveUrl?: string;
  description?: string;
  year?: string;
  technologies?: string[];
  isCtaCard?: boolean;
  ctaButtonLabel?: string;
}


export interface DecorativeAsset {
  id: string;
  title: string;
  src: string;
  alt: string;
  widthClasses: string;
  positionClasses: string;
  delay: number;
  x: number;
  y: number;
  duration: number;
}
export interface ShowcaseCardItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  image: string;
  badge?: string;
  tagColor?: string;
}

export interface ReviewCardItem {
  id: string;
  projectName: string;
  clientName: string;
  clientRole: string;
  category: string;
  rating: number;
  review: string;
  metricHighlight?: string;
  tagColor?: string;
  logoText: string;
  logoBg?: string;
  logoImage?: string;
}


