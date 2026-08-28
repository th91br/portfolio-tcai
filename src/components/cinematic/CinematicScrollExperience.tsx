import React, { useRef, useState } from 'react';
import { CinematicVideoLayer } from './CinematicVideoLayer';
import { CinematicOverlay } from './CinematicOverlay';
import { useScrollVideo } from '../../hooks/useScrollVideo';

export const CinematicScrollExperience: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasMetadata, setHasMetadata] = useState(false);

  const { cinematicState } = useScrollVideo({
    videoRef,
  });

  const handleLoadedMetadata = () => {
    setHasMetadata(true);
  };

  const isReady = hasMetadata && cinematicState !== 'loading';

  return (
    <>
      <CinematicVideoLayer
        ref={videoRef}
        isReady={isReady}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <CinematicOverlay />
    </>
  );
};
