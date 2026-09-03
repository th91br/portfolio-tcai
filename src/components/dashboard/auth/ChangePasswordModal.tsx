import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Check,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validações de segurança em tempo real
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumberOrSpecial;
  const canSubmit = isPasswordValid && passwordsMatch && currentPassword.length > 0 && !isLoading;

  // Cálculo da força da senha
  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (hasLowercase ? 1 : 0) +
    (hasNumberOrSpecial ? 1 : 0);

  const handleResetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isPasswordValid) {
      setErrorMessage('A nova senha não atende a todos os requisitos de segurança.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('A confirmação de senha não coincide com a nova senha.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Reautenticação de segurança para confirmar que quem está trocando sabe a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('A senha atual informada está incorreta.');
      }

      // 2. Atualização segura da senha do usuário autenticado
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccessMessage('Senha administrativa alterada com sucesso! A nova senha já está em vigor.');
      handleResetForm();
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err);
      setErrorMessage(err.message || 'Falha ao atualizar senha. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-kanit">
        {/* Backdrop escuro com blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#050D17]/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-lg bg-[#091524] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6] shadow-[0_0_15px_rgba(0,210,246,0.15)]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#00D2F6] tracking-widest uppercase font-bold">
                  SEGURANÇA DA CONTA
                </span>
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  Trocar Senha do Admin
                </h3>
                <p className="text-xs text-slate-400 font-mono">{userEmail}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Guarde sua nova senha em um local seguro. Ela será necessária para o seu próximo login.
              </p>
            </div>
          )}

          {/* Formulário */}
          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Senha Atual */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Senha Atual
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#00D2F6] text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nova Senha */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Nova Senha
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 dígitos, maiúscula e número"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#00D2F6] text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Medidor de Força */}
                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-1.5 h-1.5 w-full">
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          strengthScore >= 1
                            ? strengthScore <= 2
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                            : 'bg-white/10'
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          strengthScore >= 2
                            ? strengthScore === 2
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                            : 'bg-white/10'
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          strengthScore >= 3 ? 'bg-emerald-400' : 'bg-white/10'
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          strengthScore === 4 ? 'bg-emerald-400' : 'bg-white/10'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar Nova Senha */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <CheckCircle2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.03] border text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none transition-colors ${
                      confirmPassword.length > 0
                        ? passwordsMatch
                          ? 'border-emerald-500/50'
                          : 'border-rose-500/50'
                        : 'border-white/10 focus:border-[#00D2F6]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checklist de Segurança */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-[11px] font-mono">
                <span className="text-slate-400 uppercase font-bold block mb-1">
                  Critérios de Segurança:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-400">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-bold' : ''}`}>
                    <Check className={`w-3 h-3 ${hasMinLength ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400 font-bold' : ''}`}>
                    <Check className={`w-3 h-3 ${hasUppercase ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Ao menos 1 maiúscula</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-400 font-bold' : ''}`}>
                    <Check className={`w-3 h-3 ${hasLowercase ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Ao menos 1 minúscula</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasNumberOrSpecial ? 'text-emerald-400 font-bold' : ''}`}
                  >
                    <Check className={`w-3 h-3 ${hasNumberOrSpecial ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Número ou símbolo</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`px-5 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    canSubmit
                      ? 'bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-[#07111F] hover:shadow-[0_0_20px_rgba(0,210,246,0.4)]'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Atualizando Senha...' : 'Salvar Nova Senha'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Botão de Conclusão após sucesso */}
          {successMessage && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 rounded-xl bg-[#00D2F6] text-[#07111F] font-bold text-xs font-mono uppercase tracking-wider hover:bg-[#00B4D8] transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
