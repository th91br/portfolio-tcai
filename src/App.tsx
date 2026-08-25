import React, { useState } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { WhatICreateSection } from './components/sections/WhatICreateSection';
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
      {/* 1. Hero Section */}
      <HeroSection onContactClick={() => openWhatsApp('general')} />

      {/* 2. Marquee Section */}
      <MarqueeSection />

      {/* 3. About Section (Sobre Mim) */}
      <AboutSection onContactClick={() => openWhatsApp('general')} />

      {/* 4. Services Section (SERVIÇOS - Fundo Branco com Texto Preto/Azul TCA) */}
      <ServicesSection />

      {/* 5. Projects Section (Projetos) */}
      <ProjectsSection
        onProjectSelect={handleSelectProject}
        onContactClick={() => openWhatsApp('project')}
      />

      {/* 6. What I Create Section (O Que Eu Crio - Bento Grid com Agentes de IA) */}
      <WhatICreateSection
        onSelectService={() => openWhatsApp('services')}
        onContactClick={() => openWhatsApp('services')}
      />

      {/* 7. CTA Final & Contato Section */}
      <ContactSection onDirectContactClick={() => openWhatsApp('general')} />

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={handleCloseProject}
      />
    </div>
  );
};

export default App;
