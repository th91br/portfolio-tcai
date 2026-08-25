import React, { useState } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { AboutSection } from './components/sections/AboutSection';
import { WhatICreateSection } from './components/sections/WhatICreateSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ContactSection } from './components/sections/ContactSection';
import { ContactModal } from './components/common/ContactModal';
import { ProjectModal } from './components/common/ProjectModal';
import { ProjectItem } from './types';

export const App: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactInterest, setContactInterest] = useState('Sites Profissionais');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const handleOpenContact = (interest: string = 'Sites Profissionais') => {
    setContactInterest(interest);
    setIsContactModalOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactModalOpen(false);
  };

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
      <HeroSection onContactClick={() => handleOpenContact('Tecnologia & Inovação')} />

      {/* 2. Marquee Section (Quem Confia na TCAI) */}
      <MarqueeSection />

      {/* 3. About Section */}
      <AboutSection onContactClick={() => handleOpenContact('Projetos & Consultoria')} />

      {/* 4. Projects Section (Ideias que Saíram do Papel: 01 ao 05) */}
      <ProjectsSection
        onProjectSelect={handleSelectProject}
        onContactClick={() => handleOpenContact('Novo Projeto Digital')}
      />

      {/* 5. O QUE EU CRIO (Bento Grid - DA IDEIA À SOLUÇÃO DIGITAL) */}
      <WhatICreateSection
        onSelectService={(service) => handleOpenContact(service)}
        onContactClick={() => handleOpenContact('Novo Projeto Digital')}
      />

      {/* 6. CTA Final & Contato Section */}
      <ContactSection onDirectContactClick={() => handleOpenContact('Proposta Estratégica')} />

      {/* Interactive Modals */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContact}
        defaultInterest={contactInterest}
      />

      <ProjectModal
        project={selectedProject}
        onClose={handleCloseProject}
      />
    </div>
  );
};

export default App;

