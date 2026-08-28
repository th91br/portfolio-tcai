import React from 'react';
import { ProjectsSection } from '../../components/sections/ProjectsSection';
import { ProjectItem } from '../../types';

interface ProjectsCinematicSceneProps {
  progress: number;
  onProjectSelect: (project: ProjectItem) => void;
  onContactClick: () => void;
}

export const ProjectsCinematicScene: React.FC<ProjectsCinematicSceneProps> = ({
  progress,
  onProjectSelect,
  onContactClick,
}) => {
  return (
    <div className="w-full h-full overflow-y-auto pointer-events-auto py-12">
      <ProjectsSection
        onProjectSelect={onProjectSelect}
        onContactClick={onContactClick}
      />
    </div>
  );
};
