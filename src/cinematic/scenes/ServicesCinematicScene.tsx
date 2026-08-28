import React from 'react';
import { ServicesSection } from '../../components/sections/ServicesSection';

interface ServicesCinematicSceneProps {
  progress: number;
}

export const ServicesCinematicScene: React.FC<ServicesCinematicSceneProps> = ({
  progress,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center overflow-y-auto pointer-events-auto py-12">
      <ServicesSection />
    </div>
  );
};
