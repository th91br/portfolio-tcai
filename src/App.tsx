import React, { useState, useEffect, Suspense, lazy } from 'react';
import { SmoothScrollProvider } from './components/providers/SmoothScrollProvider';
import { HeroScene } from './components/3d/HeroScene';
import { Navbar } from './components/layout/Navbar';
import { HeroExecutive } from './components/sections/HeroExecutive';
import { MetricsBar } from './components/sections/MetricsBar';
import { SplitSolutionsSection } from './components/sections/SplitSolutionsSection';
import { ComparisonSection } from './components/sections/ComparisonSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { DiagnosticSection } from './components/diagnostic/DiagnosticSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { AboutExecutive } from './components/sections/AboutExecutive';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { ProjectSimulator } from './components/sections/ProjectSimulator';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { ProjectModal } from './components/common/ProjectModal';
import { ProjectItem } from './types';
import { openWhatsApp } from './utils/contactUtils';
import { RefreshCw } from 'lucide-react';

// Lazy-load do Dashboard Privado para máxima performance do portfólio público
const DashboardRouter = lazy(() => import('./components/dashboard/DashboardRouter'));

function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path.startsWith('/admin') ||
    path.startsWith('/dashboard') ||
    hash.startsWith('#admin') ||
    hash.startsWith('#dashboard') ||
    search.includes('view=admin') ||
    search.includes('admin=true')
  );
}

export const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(checkIsAdminRoute);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminView(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  // Se a rota for administrativa (/admin), renderiza o Dashboard Privado
  if (isAdminView) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen w-full bg-[#07111F] text-[#F3F5F7] flex items-center justify-center font-kanit">
            <div className="text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#00D2F6] animate-spin mx-auto" />
              <p className="text-xs font-mono uppercase tracking-widest text-[#94A3B8]">
                Carregando Dashboard Privado...
              </p>
            </div>
          </div>
        }
      >
        <DashboardRouter />
      </Suspense>
    );
  }

  // Visualização normal do portfólio público
  return (
    <SmoothScrollProvider>
      <div className="w-full min-h-screen bg-[#07111F] text-[#F3F5F7] font-kanit antialiased selection:bg-[#00D2F6]/30 selection:text-white relative overflow-x-hidden">
        {/* 1. Global Subtle Ambient 3D Depth Layer */}
        <HeroScene />

        {/* 2. Fixed Executive Floating Island Navigation Header */}
        <Navbar onContactClick={() => openWhatsApp('general')} />

        {/* 3. Main Content Stream */}
        <main className="w-full relative z-10">
          {/* Hero Section: Supreme Authority + Masked Typography + Button-in-Button CTA + 3/7/10 Days SLA */}
          <HeroExecutive onContactClick={() => openWhatsApp('general')} />

          {/* Hard Proof Metrics Bar */}
          <MetricsBar />

          {/* New High-End Split-Feature Zig-Zag Solutions Section */}
          <SplitSolutionsSection />

          {/* Psychological Contrast: Agências Tradicionais vs. Método TCAI */}
          <ComparisonSection />

          {/* Live Cases in Production (Esportiz, PrazoGuard, Compra de Ouro, Joias AG) */}
          <ProjectsSection
            onProjectSelect={handleSelectProject}
            onContactClick={() => openWhatsApp('project')}
          />

          {/* Diagnóstico TCA: Qualificação Interativa de Projeto & Solução sob Medida */}
          <DiagnosticSection />

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

        {/* 4. Institutional Editorial Footer */}
        <Footer />

        {/* 5. Interactive Project Details Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseProject}
        />
      </div>
    </SmoothScrollProvider>
  );
};

export default App;
