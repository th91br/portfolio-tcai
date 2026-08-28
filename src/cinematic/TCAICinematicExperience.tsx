import React from 'react';
import { CinematicProvider } from './CinematicContext';
import { CinematicCanvas } from './CinematicCanvas';
import { SceneTrack } from './SceneTrack';
import { SCENE_MANIFEST } from './sceneManifest';

import { HeroCinematicScene } from './scenes/HeroCinematicScene';
import { ManifestoCinematicScene } from './scenes/ManifestoCinematicScene';
import { SimulatorCinematicScene } from './scenes/SimulatorCinematicScene';
import { ProjectsCinematicScene } from './scenes/ProjectsCinematicScene';
import { WhatICreateCinematicScene } from './scenes/WhatICreateCinematicScene';
import { ServicesCinematicScene } from './scenes/ServicesCinematicScene';
import { AboutCinematicScene } from './scenes/AboutCinematicScene';
import { TestimonialsCinematicScene } from './scenes/TestimonialsCinematicScene';
import { ContactCinematicScene } from './scenes/ContactCinematicScene';

import { ProjectItem } from '../types';

interface TCAICinematicExperienceProps {
  onContactClick: () => void;
  onExploreProjects: () => void;
  onProjectSelect: (project: ProjectItem) => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}

export const TCAICinematicExperience: React.FC<TCAICinematicExperienceProps> = ({
  onContactClick,
  onExploreProjects,
  onProjectSelect,
  onTermsClick,
  onPrivacyClick,
}) => {
  return (
    <CinematicProvider>
      {/* 1. Master Fixed Cinema Video Canvas */}
      <CinematicCanvas />

      {/* 2. Pinned Scene Sequence */}
      <main className="relative w-full z-10">
        {/* Scene 1: Hero (320vh) */}
        <SceneTrack scene={SCENE_MANIFEST[0]}>
          {(progress) => (
            <HeroCinematicScene
              progress={progress}
              onContactClick={onContactClick}
              onExploreProjects={onExploreProjects}
            />
          )}
        </SceneTrack>

        {/* Scene 2: Manifesto (250vh) */}
        <SceneTrack scene={SCENE_MANIFEST[1]}>
          {(progress) => <ManifestoCinematicScene progress={progress} />}
        </SceneTrack>

        {/* Scene 3: Simulator (260vh) */}
        <SceneTrack scene={SCENE_MANIFEST[2]}>
          {(progress) => <SimulatorCinematicScene progress={progress} />}
        </SceneTrack>

        {/* Scene 4: Projects (280vh) */}
        <SceneTrack scene={SCENE_MANIFEST[3]}>
          {(progress) => (
            <ProjectsCinematicScene
              progress={progress}
              onProjectSelect={onProjectSelect}
              onContactClick={onContactClick}
            />
          )}
        </SceneTrack>

        {/* Scene 5: What I Create (260vh) */}
        <SceneTrack scene={SCENE_MANIFEST[4]}>
          {(progress) => <WhatICreateCinematicScene progress={progress} />}
        </SceneTrack>

        {/* Scene 6: Services (220vh) */}
        <SceneTrack scene={SCENE_MANIFEST[5]}>
          {(progress) => <ServicesCinematicScene progress={progress} />}
        </SceneTrack>

        {/* Scene 7: Sobre Mim - The Climax (380vh) */}
        <SceneTrack scene={SCENE_MANIFEST[6]}>
          {(progress) => <AboutCinematicScene progress={progress} />}
        </SceneTrack>

        {/* Scene 8: Testimonials (220vh) */}
        <SceneTrack scene={SCENE_MANIFEST[7]}>
          {(progress) => <TestimonialsCinematicScene progress={progress} />}
        </SceneTrack>

        {/* Scene 9: Contact & Finale (240vh) */}
        <SceneTrack scene={SCENE_MANIFEST[8]}>
          {(progress) => (
            <ContactCinematicScene
              progress={progress}
              onDirectContactClick={onContactClick}
              onTermsClick={onTermsClick}
              onPrivacyClick={onPrivacyClick}
            />
          )}
        </SceneTrack>
      </main>
    </CinematicProvider>
  );
};
