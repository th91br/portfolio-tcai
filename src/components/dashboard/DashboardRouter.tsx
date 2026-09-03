import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { RefreshCw, ShieldAlert, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DashboardAuth, AUTHORIZED_ADMIN_EMAIL } from './DashboardAuth';
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
            Verificando credenciais e autorizações...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <DashboardAuth onSuccess={() => {}} />;
  }

  // TRAVA DE SEGURANÇA: Validação estrita do e-mail do administrador
  const isAuthorized = user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full bg-[#07111F] text-[#F3F5F7] flex items-center justify-center p-4 font-kanit">
        <div className="w-full max-w-md bg-[#091524] border border-rose-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-bold block">
            403 • ACESSO NÃO AUTORIZADO
          </span>
          <h2 className="text-xl font-bold text-white uppercase">Acesso Negado</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            O usuário <strong className="text-white">{user.email}</strong> não possui permissão
            para acessar este painel. O acesso é exclusivo para o administrador oficial.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão Não Autorizada</span>
          </button>
        </div>
      </div>
    );
  }

  return <DashboardLayout user={user} onLogout={handleLogout} />;
};

export default DashboardRouter;
