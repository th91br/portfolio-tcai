import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DashboardAuth } from './DashboardAuth';
import { DashboardLayout } from './DashboardLayout';

export const DashboardRouter: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obter sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#07111F] text-[#F3F5F7] flex items-center justify-center font-kanit">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#00D2F6] animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-[#94A3B8]">
            Verificando credenciais...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <DashboardAuth onSuccess={() => {}} />;
  }

  return <DashboardLayout user={user} onLogout={handleLogout} />;
};

export default DashboardRouter;
