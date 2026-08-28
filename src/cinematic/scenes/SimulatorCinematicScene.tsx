import React from 'react';
import { ProjectSimulator } from '../../components/sections/ProjectSimulator';

interface SimulatorCinematicSceneProps {
  progress: number;
}

export const SimulatorCinematicScene: React.FC<SimulatorCinematicSceneProps> = ({
  progress,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center overflow-y-auto pointer-events-auto py-8">
      <ProjectSimulator />
    </div>
  );
};
