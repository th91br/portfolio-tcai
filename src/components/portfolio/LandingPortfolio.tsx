import React, { useState, Suspense, lazy } from 'react';
import { SmoothScrollProvider } from '../providers/SmoothScrollProvider';
import { ReadingProgressBar } from '../common/ReadingProgressBar';
import { Navbar } from '../layout/Navbar';
import { HeroExecutive } from '../sections/HeroExecutive';
import { PainPointsSection } from '../sections/PainPointsSection';
import { WorkflowSection } from '../sections/WorkflowSection';
import { SplitSolutionsSection } from '../sections/SplitSolutionsSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { MarqueeSection } from '../sections/MarqueeSection';
import { ProcessSection } from '../sections/ProcessSection';
import { TechStackSection } from '../sections/TechStackSection';
import { DiagnosticSection } from '../diagnostic/DiagnosticSection';
import { AboutExecutive } from '../sections/AboutExecutive';
import { ContactSection } from '../sections/ContactSection';
import { Footer } from '../layout/Footer';
import { ProjectModal } from '../common/ProjectModal';
import { ProjectItem } from '../../types';
import { openWhatsApp } from '../../utils/contactUtils';

const HeroScene = lazy(() => import('../3d/HeroScene'));

export const LandingPortfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  return (
    <SmoothScrollProvider>
      <div className="w-full min-h-screen bg-[#07111F] text-[#F3F5F7] font-kanit antialiased selection:bg-[#00D2F6]/30 selection:text-white relative overflow-x-hidden">
        {/* 0. Barra de Progresso de Leitura */}
        <ReadingProgressBar />

        {/* 1. Camada 3D de Profundidade Ambiente */}
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>

        {/* 2. Barra de Navegação Flutuante */}
        <Navbar onContactClick={() => openWhatsApp('general')} />

        {/* 3. Sequência de Apresentação Oficial */}
        <main className="w-full relative z-10">
          <HeroExecutive />
          <PainPointsSection />
          <WorkflowSection />
          <SplitSolutionsSection />
          <ProjectsSection
            onProjectSelect={handleSelectProject}
            onContactClick={() => openWhatsApp('project')}
          />
          <MarqueeSection />
          <ProcessSection />
          <TechStackSection />
          <DiagnosticSection />
          <AboutExecutive />
          <ContactSection onDirectContactClick={() => openWhatsApp('general')} />
        </main>

        {/* 4. Rodapé Corporativo */}
        <Footer />

        {/* 5. Modal de Dossiê Técnico do Projeto */}
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseProject}
        />
      </div>
    </SmoothScrollProvider>
  );
};

export default LandingPortfolio;
