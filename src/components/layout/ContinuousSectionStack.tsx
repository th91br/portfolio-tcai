import React from 'react';

export interface SectionItem {
  id: string;
  label: string;
  component: React.ReactNode;
}

export interface SectionWindow {
  id: string;
  center: number;
  inStart: number;
  inPeak: number;
  outPeak: number;
  outEnd: number;
}

export const SECTION_WINDOWS: SectionWindow[] = [
  // 1. Hero: starts at 0.00, solid until 0.05, exits by 0.10
  { id: 'hero', center: 0.00, inStart: 0.00, inPeak: 0.00, outPeak: 0.05, outEnd: 0.10 },
  // 2. Manifesto: enters at 0.06, peak at 0.12, exits by 0.20
  { id: 'manifesto', center: 0.12, inStart: 0.06, inPeak: 0.11, outPeak: 0.15, outEnd: 0.20 },
  // 3. Simulador: enters at 0.16, peak at 0.25, exits by 0.34
  { id: 'simulator', center: 0.25, inStart: 0.16, inPeak: 0.23, outPeak: 0.28, outEnd: 0.34 },
  // 4. Projetos: enters at 0.30, peak at 0.40 - 0.46 (extended reading), exits by 0.52
  { id: 'projects', center: 0.42, inStart: 0.30, inPeak: 0.38, outPeak: 0.46, outEnd: 0.52 },
  // 5. O Que Eu Construo: enters at 0.48, peak at 0.56, exits by 0.65
  { id: 'what-i-create', center: 0.58, inStart: 0.48, inPeak: 0.55, outPeak: 0.60, outEnd: 0.65 },
  // 6. Metodologia (Helmet opens): enters at 0.61, peak at 0.69, exits by 0.76
  { id: 'services', center: 0.70, inStart: 0.61, inPeak: 0.68, outPeak: 0.72, outEnd: 0.76 },
  // 7. Sobre Mim (Face reveal): enters at 0.73, peak at 0.80, exits by 0.86
  { id: 'about', center: 0.80, inStart: 0.73, inPeak: 0.78, outPeak: 0.82, outEnd: 0.86 },
  // 8. Depoimentos: enters at 0.83, peak at 0.90, exits by 0.95
  { id: 'testimonials', center: 0.90, inStart: 0.83, inPeak: 0.88, outPeak: 0.92, outEnd: 0.95 },
  // 9. Contato: enters at 0.92, peak at 0.97 - 1.00
  { id: 'contact', center: 1.00, inStart: 0.92, inPeak: 0.97, outPeak: 1.00, outEnd: 1.00 },
];

interface ContinuousSectionStackProps {
  sections: SectionItem[];
  progress: number; // Continuous 0.0 to 1.0
  activeSection: number;
  onNavigate: (index: number) => void;
}

export const ContinuousSectionStack: React.FC<ContinuousSectionStackProps> = ({
  sections,
  progress,
  activeSection,
  onNavigate,
}) => {
  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] overflow-hidden bg-transparent text-[#F3F5F7] select-none z-10 pointer-events-none">
      {/* 1. Continuous Section Overlays with Hermite Peak Crossfade Windows */}
      {sections.map((section, idx) => {
        const win = SECTION_WINDOWS[idx] || {
          center: idx / (sections.length - 1),
          inStart: 0,
          inPeak: 0,
          outPeak: 1,
          outEnd: 1,
        };

        const p = Math.max(0, Math.min(1, progress));

        // Visibility cull
        if (p < win.inStart || p > win.outEnd) return null;

        let opacity = 0;
        if (p >= win.inPeak && p <= win.outPeak) {
          opacity = 1.0;
        } else if (p < win.inPeak) {
          const span = Math.max(0.001, win.inPeak - win.inStart);
          const t = Math.max(0, Math.min(1, (p - win.inStart) / span));
          opacity = t * t * (3 - 2 * t);
        } else {
          const span = Math.max(0.001, win.outEnd - win.outPeak);
          const t = Math.max(0, Math.min(1, (win.outEnd - p) / span));
          opacity = t * t * (3 - 2 * t);
        }

        const scale = 0.96 + opacity * 0.04;
        const translateY = (p - win.center) * 25; // Subtle spatial parallax

        // Only focused section receives pointer events
        const isInteractive = opacity > 0.65;

        return (
          <div
            key={section.id}
            style={{
              opacity,
              transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
              pointerEvents: isInteractive ? 'auto' : 'none',
              zIndex: isInteractive ? 20 : 10,
              willChange: 'transform, opacity',
            }}
            className="absolute inset-0 w-full h-full h-[100dvh] flex flex-col justify-start overflow-y-auto overflow-x-hidden"
          >
            {section.component}
          </div>
        );
      })}

      {/* 2. Floating Right-Side Section Indicator Navigation */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-center gap-2.5 pointer-events-auto">
        {sections.map((section, idx) => {
          const isActive = idx === activeSection;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(idx)}
              className="group relative flex items-center justify-end cursor-pointer p-1"
              aria-label={`Ir para seção ${section.label}`}
            >
              {/* Tooltip on hover */}
              <span className="absolute right-7 px-2.5 py-1 rounded-md bg-[#060B18]/90 border border-white/10 text-[11px] font-mono text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                {section.label}
              </span>

              {/* Dot indicator */}
              <div
                className={`w-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'h-6 bg-[#00D2F6] shadow-[0_0_12px_rgba(0,210,246,0.8)]'
                    : 'h-2 bg-[#060B18] border border-white/10 group-hover:bg-[#CBD5E1]'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
