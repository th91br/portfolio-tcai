import React from 'react';
import { MarqueeSection } from '../../components/sections/MarqueeSection';

interface TestimonialsCinematicSceneProps {
  progress: number;
}

export const TestimonialsCinematicScene: React.FC<TestimonialsCinematicSceneProps> = ({
  progress,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center overflow-hidden pointer-events-auto py-8">
      <MarqueeSection />
    </div>
  );
};
