import React, { useState } from 'react';
import { useContinuousScroll } from './hooks/useContinuousScroll';
import { ContinuousSectionStack, SectionItem } from './components/layout/ContinuousSectionStack';
import { GlobalScrollVideo } from './components/common/GlobalScrollVideo';
import { ZenrixaHero } from './components/sections/ZenrixaHero';
import { ManifestoSection } from './components/sections/ManifestoSection';
import { ProjectSimulator } from './components/sections/ProjectSimulator';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { WhatICreateSection } from './components/sections/WhatICreateSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { AboutSection } from './components/sections/AboutSection';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { ContactSection } from './components/sections/ContactSection';
import { ProjectModal } from './components/common/ProjectModal';

import { ProjectItem } from './types';
import { openWhatsApp } from './utils/contactUtils';

export const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const {
    smoothProgress,
    activeSection,
    scrollToSection,
  } = useContinuousScroll({
    lerpFactor: 0.12,
    wheelSensitivity: 0.00030,
    touchSensitivity: 0.002,
  });

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const sections: SectionItem[] = [
    {
      id: 'hero',
      label: 'Início',
      component: (
        <ZenrixaHero
          isActive={activeSection === 0}
          onContactClick={() => openWhatsApp('general')}
          onNavigate={(index) => scrollToSection(index)}
        />
      ),
    },
    {
      id: 'manifesto',
      label: 'Manifesto',
      component: <ManifestoSection />,
    },
    {
      id: 'simulator',
      label: 'Simulador',
      component: <ProjectSimulator />,
    },
    {
      id: 'projects',
      label: 'Projetos',
      component: (
        <ProjectsSection
          onProjectSelect={handleSelectProject}
          onContactClick={() => openWhatsApp('project')}
        />
      ),
    },
    {
      id: 'what-i-create',
      label: 'Capacidades',
      component: (
        <WhatICreateSection
          onSelectService={() => openWhatsApp('services')}
          onContactClick={() => openWhatsApp('services')}
        />
      ),
    },
    {
      id: 'services',
      label: 'Metodologia',
      component: <ServicesSection />,
    },
    {
      id: 'about',
      label: 'Sobre Mim',
      component: <AboutSection onContactClick={() => openWhatsApp('general')} />,
    },
    {
      id: 'testimonials',
      label: 'Depoimentos',
      component: <MarqueeSection />,
    },
    {
      id: 'contact',
      label: 'Contato',
      component: <ContactSection onDirectContactClick={() => openWhatsApp('general')} />,
    },
  ];

  return (
    <div className="w-full h-full h-[100dvh] bg-[#000000] text-[#F3F5F7] font-kanit antialiased selection:bg-[#00D2F6]/30 selection:text-white relative overflow-hidden">
      {/* 1. Global Persistent 60-120 FPS Video Driven by Real-Time Progress with Synchronized Audio */}
      <GlobalScrollVideo
        progress={smoothProgress}
      />

      {/* 2. Continuous Synchronized Section Stack with Zero Delay */}
      <ContinuousSectionStack
        sections={sections}
        progress={smoothProgress}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* 3. Interactive Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={handleCloseProject}
      />
    </div>
  );
};

export default App;
