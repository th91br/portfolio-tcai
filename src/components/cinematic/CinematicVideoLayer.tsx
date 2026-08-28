import React, { forwardRef } from 'react';
import { CINEMATIC_VIDEO_CONFIG } from '../../config/cinematicTimeline';

interface CinematicVideoLayerProps {
  isReady?: boolean;
  onLoadedMetadata?: () => void;
}

export const CinematicVideoLayer = forwardRef<HTMLVideoElement, CinematicVideoLayerProps>(
  ({ isReady = true, onLoadedMetadata }, ref) => {
    return (
      <div
        className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none bg-[#030611]"
        aria-hidden="true"
      >
        <video
          ref={ref}
          src={CINEMATIC_VIDEO_CONFIG.src}
          playsInline
          muted
          preload="auto"
          onLoadedMetadata={onLoadedMetadata}
          className={`w-full h-full object-cover object-[50%_32%] md:object-[50%_40%] lg:object-[62%_center] xl:object-[65%_center] scale-[1.01] transform-gpu will-change-transform transition-opacity duration-700 ${
            isReady ? 'opacity-90' : 'opacity-0'
          }`}
          style={{
            filter: 'contrast(1.08) brightness(0.95)',
          }}
        />
      </div>
    );
  }
);

CinematicVideoLayer.displayName = 'CinematicVideoLayer';
