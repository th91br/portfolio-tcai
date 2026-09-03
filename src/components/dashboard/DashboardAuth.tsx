import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck, RefreshCw, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardAuthProps {
  onSuccess?: () => void;
}

export const DashboardAuth: React.FC<DashboardAuthProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Modo primeiro cadastro de administrador
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data.session) {
          setSuccessMsg('Conta de administrador criada e autenticada com sucesso!');
          if (onSuccess) onSuccess();
        } else {
          setSuccessMsg('Conta criada! Verifique seu e-mail ou faça login com as credenciais.');
          setIsSignUp(false);
        }
      } else {
        // Login normal
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      let message = err.message || 'Erro ao autenticar no painel.';
      if (message.includes('Invalid login credentials')) {
        message = 'Credenciais inválidas. Verifique seu e-mail e senha.';
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
        className="w-full max-w-md bg-[#091524]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D2F6]/20 to-[#015EEF]/20 border border-[#00D2F6]/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#00D2F6]/10">
            <Lock className="w-5 h-5 text-[#00D2F6]" />
          </div>

          <span className="text-[10px] font-mono tracking-widest uppercase text-[#00D2F6] font-bold">
            TCAI • SISTEMA RESTRITO
          </span>
          <h1 className="font-kanit font-black text-2xl text-white uppercase tracking-tight mt-1">
            DASHBOARD DE LEADS
          </h1>
          <p className="text-[#94A3B8] text-xs font-light mt-1">
            {isSignUp ? 'Configuração da conta de administrador' : 'Acesso exclusivo para gestão e pipeline'}
          </p>
        </div>

        {/* Mensagens de Feedback */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-sans">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-sans">
            {successMsg}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              E-mail de Acesso
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

          <div>
            <label className="block text-xs font-mono text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] focus:ring-1 focus:ring-[#00D2F6] transition-all text-sm font-sans"
              />
            </div>
          </div>

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
                <span>{isSignUp ? 'CRIAR ACESSO ADMINISTRADOR' : 'ENTRAR NO DASHBOARD'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Alternar Primeiro Acesso */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs font-mono text-[#94A3B8] hover:text-[#00D2F6] transition-colors cursor-pointer"
          >
            {isSignUp ? '← Já tenho conta. Fazer Login' : 'Primeiro acesso? Cadastrar Administrador'}
          </button>
        </div>

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
