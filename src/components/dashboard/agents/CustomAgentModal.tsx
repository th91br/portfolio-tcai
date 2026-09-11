import React, { useState } from 'react';
import { X, Sparkles, Building2, Send, CheckCircle2, Sliders, Layers } from 'lucide-react';
import { agentTeamService, CompanyTier } from '../../../services/agents/agentTeamService';

interface CustomAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
}

export const CustomAgentModal: React.FC<CustomAgentModalProps> = ({
  isOpen,
  onClose,
  tenantId,
  tenantName
}) => {
  const [objective, setObjective] = useState('');
  const [niche, setNiche] = useState('');
  const [integrations, setIntegrations] = useState<string[]>(['whatsapp', 'crm']);
  const [budgetTier, setBudgetTier] = useState<CompanyTier>('medium');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleIntegration = (name: string) => {
    setIntegrations((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    agentTeamService.requestCustomAgent({
      tenantId,
      companyName: tenantName,
      agentObjective: objective,
      niche,
      requiredIntegrations: integrations,
      contactEmail,
      contactPhone,
      budgetTier,
      createdAt: new Date().toISOString()
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn text-[#F3F5F7]">
      <div className="bg-[#091524] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow sutil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D2F6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[#00D2F6]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D2F6] block">
                SOB MEDIDA
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Criar Agente Especialista Personalizado
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">Solicitação Registrada!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Nossa equipe de engenharia comercial recebeu seu briefing e entrará em contato para alinhar o escopo e o provisionamento do especialista.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                O que você precisa que esse especialista faça?
              </label>
              <textarea
                required
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Ex: Quero um agente focado em clínicas de cirurgia plástica que avalie pré-requisitos de exames e agende consultas presenciais."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-[#00D2F6] focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  Nicho de Atuação
                </label>
                <input
                  type="text"
                  required
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Ex: Odontologia / Imobiliário"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-[#00D2F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  Porte & Orçamento Estimado
                </label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value as CompanyTier)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-[#00D2F6] focus:outline-none cursor-pointer"
                >
                  <option value="small">Pequeno Porte (R$ 400 - 700/mês)</option>
                  <option value="medium">Médio Porte (R$ 900 - 1.800/mês)</option>
                  <option value="enterprise">Enterprise (R$ 2.500+/mês)</option>
                </select>
              </div>
            </div>

            {/* Integrações Necessárias */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Ferramentas a Conectar
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'whatsapp', label: 'WhatsApp Oficial' },
                  { id: 'crm', label: 'CRM & Pipeline' },
                  { id: 'meta_ads', label: 'Meta Ads' },
                  { id: 'agenda', label: 'Google Agenda' },
                  { id: 'voz_clonada', label: 'Voz Clonada PTT' },
                  { id: 'erp', label: 'ERP / Cobrança' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleIntegration(item.id)}
                    className={`py-1.5 px-2.5 rounded-lg text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                      integrations.includes(item.id)
                        ? 'bg-slate-800 border-[#00D2F6] text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  E-mail para Retorno
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="diretor@empresa.com.br"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-[#00D2F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  WhatsApp do Decisor
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+55 11 99999-9999"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-[#00D2F6] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 px-5 rounded-xl bg-[#00D2F6] hover:bg-[#00b8d9] text-[#07111F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,210,246,0.3)] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Solicitar Especialista</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
