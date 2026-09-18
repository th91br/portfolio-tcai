import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const NetworkStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      const timer = setTimeout(() => {
        setJustReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !justReconnected) {
    return null;
  }

  if (!isOnline) {
    return (
      <aside
        aria-label="Aviso de conexão offline"
        role="status"
        aria-live="polite"
        className="w-full bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-2 flex items-center justify-between text-xs font-medium shrink-0 transition-all"
      >
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <WifiOff className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <span>
            <strong>Modo Offline:</strong> Sem conexão com o servidor. A operação continua ativa com cache local.
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Aviso de reconexão"
      role="status"
      aria-live="polite"
      className="w-full bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-900 px-4 py-2 flex items-center justify-between text-xs font-medium shrink-0 transition-all animate-fadeIn"
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
        <span>
          <strong>Conexão restabelecida:</strong> O painel está sincronizando dados com o servidor.
        </span>
      </div>
    </aside>
  );
};
