import React, { useState } from 'react';
import { SmoothScrollProvider } from './components/providers/SmoothScrollProvider';
import { HeroScene } from './components/3d/HeroScene';
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
    <SmoothScrollProvider>
      <div className="w-full min-h-screen bg-[#050914] text-[#F3F5F7] font-kanit antialiased selection:bg-[#00D2F6]/30 selection:text-white relative overflow-x-hidden">
        {/* 1. Global High-Performance 3D WebGL Scene (R3F Layer: fixed inset-0 -z-10) */}
        <HeroScene />

        {/* 2. Fixed Executive Navigation Header with Official Logo */}
        <Navbar onContactClick={() => openWhatsApp('general')} />

        {/* 3. Main Transparent Content Stream */}
        <main className="w-full relative z-10">
          {/* Hero Section: Supreme Authority + Masked Typography + Magnetic Button + 3/7/10 Days SLA */}
          <HeroExecutive onContactClick={() => openWhatsApp('general')} />

          {/* Hard Proof Metrics Bar */}
          <MetricsBar />

          {/* Psychological Contrast: Agências Tradicionais vs. Método TCAI */}
          <ComparisonSection />

          {/* The 3 Core Solution Pillars with Guaranteed SLA Timelines */}
          <CoreServicesSection />

          {/* Live Cases in Production (Esportiz, PrazoGuard, Compra de Ouro, Joias AG) */}
          <ProjectsSection
            onProjectSelect={handleSelectProject}
            onContactClick={() => openWhatsApp('project')}
          />

          {/* The 4-Step Agile Delivery Method */}
          <ProcessSection />

          {/* Founder Story & Technical Authority: Thiago Cassol Antunes */}
          <AboutExecutive />

          {/* Verified Client Testimonials & Star Reviews */}
          <MarqueeSection />

          {/* Interactive Architecture & Scope Simulator */}
          <ProjectSimulator />

          {/* Final High-Converting Contact & Lead Routing */}
          <ContactSection onDirectContactClick={() => openWhatsApp('general')} />
        </main>

        {/* 4. Interactive Project Details Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseProject}
        />
      </div>
    </SmoothScrollProvider>
  );
};

export default App;
