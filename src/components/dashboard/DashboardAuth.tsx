import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck, RefreshCw, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardAuthProps {
  onSuccess?: () => void;
}

export const AUTHORIZED_ADMIN_EMAIL = 'thiago91cassol@hotmail.com';

export const DashboardAuth: React.FC<DashboardAuthProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    // TRAVA DE SEGURANÇA: Bloqueio no front-end para qualquer e-mail que não seja o admin autorizado
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setErrorMsg('Acesso Restrito: Este painel é exclusivo para o administrador autorizado.');
      return;
    }

    setIsLoading(true);

    try {
      if (isResetMode) {
        // Modo recuperação de senha segura
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/admin`,
        });

        if (error) throw error;

        setSuccessMsg(
          'Link de recuperação enviado com sucesso para o e-mail do administrador! Verifique sua caixa de entrada e spam.'
        );
      } else {
        // Login exclusivo com senha
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) throw error;

        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      let message = err.message || 'Erro ao processar autenticação.';
      if (message.includes('Invalid login credentials')) {
        message = 'Senha incorreta. Verifique suas credenciais e tente novamente.';
      } else if (message.includes('Email not confirmed')) {
        message = 'E-mail não confirmado. Verifique a caixa de entrada ou spam.';
      }
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07111F] text-[#F3F5F7] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-kanit">
      {/* Glow de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00D2F6]/10 blur-[180px] pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-[#091524]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D2F6]/20 to-[#015EEF]/20 border border-[#00D2F6]/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#00D2F6]/10">
            <Lock className="w-5 h-5 text-[#00D2F6]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[10px] font-mono text-[#00D2F6] font-bold mb-2">
            <ShieldCheck className="w-3 h-3" />
            <span>ACESSO RESTRITO • ADMINISTRADOR ÚNICO</span>
          </div>

          <h1 className="font-kanit font-black text-2xl text-white uppercase tracking-tight mt-1">
            DASHBOARD DE LEADS
          </h1>
          <p className="text-[#94A3B8] text-xs font-light mt-1">
            {isResetMode
              ? 'Recuperação de senha administrativa'
              : 'Painel privado de inteligência e pipeline comercial'}
          </p>
        </div>

        {/* Mensagens de Feedback */}
        {errorMsg && (
          <div className="p-3.5 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            {successMsg}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              E-mail do Administrador
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="thiago91cassol@hotmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] focus:ring-1 focus:ring-[#00D2F6] transition-all text-sm font-sans"
              />
            </div>
          </div>

          {!isResetMode && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-[#CBD5E1] uppercase tracking-wider">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(true);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[11px] font-mono text-[#00D2F6] hover:underline cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required={!isResetMode}
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] focus:ring-1 focus:ring-[#00D2F6] transition-all text-sm font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-full font-kanit font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-xl shadow-[#00D2F6]/25 bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2F6]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AUTENTICANDO...</span>
              </>
            ) : (
              <>
                <span>{isResetMode ? 'ENVIAR LINK DE RECUPERAÇÃO' : 'ENTRAR NO DASHBOARD'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Voltar do modo recuperação */}
        {isResetMode && (
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs font-mono text-[#00D2F6] hover:underline transition-colors cursor-pointer"
            >
              ← Voltar para o Login
            </button>
          </div>
        )}

        {/* Voltar ao site público */}
        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-[11px] font-mono text-slate-500 hover:text-white transition-colors"
          >
            Voltar para o Portfólio Público
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardAuth;
