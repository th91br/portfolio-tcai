import React, { useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Navbar } from './components/layout/Navbar';
import { HeroExecutive } from './components/sections/HeroExecutive';
import { MetricsBar } from './components/sections/MetricsBar';
import { ComparisonSection } from './components/sections/ComparisonSection';
import { CoreServicesSection } from './components/sections/CoreServicesSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { AboutExecutive } from './components/sections/AboutExecutive';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { ProjectSimulator } from './components/sections/ProjectSimulator';
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
    <ReactLenis root options={{ lerp: 0.09, duration: 1.2, smoothWheel: true }}>
      <div className="w-full min-h-screen bg-[#050914] text-[#F3F5F7] font-kanit antialiased selection:bg-[#00D2F6]/30 selection:text-white relative overflow-x-hidden">
        {/* 1. Fixed Executive Navigation Header */}
        <Navbar onContactClick={() => openWhatsApp('general')} />

        <main className="w-full">
          {/* 2. Hero Section: Supreme Authority + Real Executive Portrait + 3/7/10 Days SLA */}
          <HeroExecutive onContactClick={() => openWhatsApp('general')} />

          {/* 3. Hard Proof Metrics Bar */}
          <MetricsBar />

          {/* 4. Comparison Section: Agências Tradicionais vs. Método TCAI */}
          <ComparisonSection />

          {/* 5. The 3 Core Pillars with Guaranteed SLA Timelines */}
          <CoreServicesSection />

          {/* 6. Live Cases in Production (Esportiz, PrazoGuard, Compra de Ouro, Joias AG) */}
          <ProjectsSection
            onProjectSelect={handleSelectProject}
            onContactClick={() => openWhatsApp('project')}
          />

          {/* 7. The 4-Step Agile Delivery Method */}
          <ProcessSection />

          {/* 8. Founder Story & Technical Authority: Thiago Cassol Antunes */}
          <AboutExecutive />

          {/* 9. Verified Client Testimonials & Star Reviews */}
          <MarqueeSection />

          {/* 10. Interactive Architecture & Scope Simulator */}
          <ProjectSimulator />

          {/* 11. Final High-Converting Contact & Lead Routing */}
          <ContactSection onDirectContactClick={() => openWhatsApp('general')} />
        </main>

        {/* 12. Interactive Project Details Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseProject}
        />
      </div>
    </ReactLenis>
  );
};

export default App;
