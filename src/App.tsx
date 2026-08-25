import React, { useState } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { AboutSection } from './components/sections/AboutSection';
import { WhatICreateSection } from './components/sections/WhatICreateSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ContactSection } from './components/sections/ContactSection';
import { ProjectModal } from './components/common/ProjectModal';
import { ProjectItem } from './types';
import { openWhatsApp } from './utils/contactUtils';

export const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  return (
    <div
      className="w-full min-h-screen bg-[#050914] text-[#F3F5F7] font-kanit antialiased selection:bg-[#00D2F6]/30 selection:text-white"
      style={{ overflowX: 'clip' }}
    >
      {/* 1. Hero Section (CONTATO -> Mensagem 01 General) */}
      <HeroSection onContactClick={() => openWhatsApp('general')} />

      {/* 2. Marquee Section (Quem Confia na TCAI) */}
      <MarqueeSection />

      {/* 3. About Section (FALE COMIGO -> Mensagem 01 General) */}
      <AboutSection onContactClick={() => openWhatsApp('general')} />

      {/* 4. Projects Section (Card 05 VAMOS CRIAR -> Mensagem 02 Project) */}
      <ProjectsSection
        onProjectSelect={handleSelectProject}
        onContactClick={() => openWhatsApp('project')}
      />

      {/* 5. O QUE EU CRIO (Cards 01 a 05 -> Mensagem 03 Services) */}
      <WhatICreateSection
        onSelectService={() => openWhatsApp('services')}
        onContactClick={() => openWhatsApp('services')}
      />

      {/* 6. CTA Final & Contato Section */}
      <ContactSection onDirectContactClick={() => openWhatsApp('general')} />

      <ProjectModal
        project={selectedProject}
        onClose={handleCloseProject}
      />
    </div>
  );
};

export default App;

