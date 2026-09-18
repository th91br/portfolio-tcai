import React, { useState, useEffect, Suspense, lazy } from 'react';
import { RefreshCw } from 'lucide-react';

// Lazy-load segregado por rota para máxima velocidade e isolamento de bundles
const DashboardRouter = lazy(() => import('./components/dashboard/DashboardRouter'));
const LandingPortfolio = lazy(() => import('./components/portfolio/LandingPortfolio'));

export function checkIsAdminRoute(customWindow?: { location: { pathname: string; hash: string; search: string } }): boolean {
  const win = customWindow || (typeof window !== 'undefined' ? window : null);
  if (!win) return false;
  const path = (win.location.pathname || '').toLowerCase();
  const hash = (win.location.hash || '').toLowerCase();
  const search = (win.location.search || '').toLowerCase();
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

  // Se a rota for administrativa (/admin), renderiza exclusivamente o Dashboard Privado
  if (isAdminView) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen w-full bg-[#111512] text-[#F1EEE5] flex items-center justify-center font-kanit">
            <div className="text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#C08E3A] animate-spin mx-auto" />
              <p className="text-xs font-mono uppercase tracking-widest text-[#B5B8AD]">
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

  // Visualização normal do portfólio público (Landing Page)
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#07111F] text-[#F3F5F7] flex items-center justify-center font-kanit">
          <div className="text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#00D2F6] animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#94A3B8]">
              Carregando Portfólio Executivo...
            </p>
          </div>
        </div>
      }
    >
      <LandingPortfolio />
    </Suspense>
  );
};

export default App;
