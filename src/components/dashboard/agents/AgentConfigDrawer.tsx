import React, { useState, useEffect } from 'react';
import {
  X,
  Bot,
  Mic,
  Sliders,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Building2,
  Lock,
  MessageSquare,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { DigitalAgent, CompanyTier } from '../../../services/agents/agentTeamService';
import { DEFAULT_VOICE_PROFILES } from '../../../services/voice/voiceStudioService';

interface AgentConfigDrawerProps {
  agent: DigitalAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAgent: DigitalAgent) => void;
  onToggleHire: (agentId: string, customMonthlyPrice?: number) => void;
  tenantName: string;
}

export const AgentConfigDrawer: React.FC<AgentConfigDrawerProps> = ({
  agent,
  isOpen,
  onClose,
  onSave,
  onToggleHire,
  tenantName
}) => {
  const [formData, setFormData] = useState<DigitalAgent | null>(null);
  const [selectedTier, setSelectedTier] = useState<CompanyTier>('small');
  const [customPriceInput, setCustomPriceInput] = useState<string>('');
  const [setupFeeInput, setSetupFeeInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (agent) {
      setFormData({ ...agent });
      setCustomPriceInput(agent.pricing.activePrice.toString());
      setSetupFeeInput(agent.pricing.setupFee.toString());
      // deduzir tier
      if (agent.pricing.activePrice >= agent.pricing.enterprise) {
        setSelectedTier('enterprise');
      } else if (agent.pricing.activePrice >= agent.pricing.medium) {
        setSelectedTier('medium');
      } else {
        setSelectedTier('small');
      }
    }
  }, [agent]);

  if (!isOpen || !agent || !formData) return null;

  const handleTierChange = (tier: CompanyTier) => {
    setSelectedTier(tier);
    const newPrice = formData.pricing[tier];
    setCustomPriceInput(newPrice.toString());
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        activePrice: newPrice
      }
    });
  };

  const handleCustomPriceBlur = () => {
    const num = parseFloat(customPriceInput) || formData.pricing.small;
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        activePrice: num
      }
    });
  };

  const handleSetupFeeBlur = () => {
    const num = parseFloat(setupFeeInput) || 0;
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        setupFee: num
      }
    });
  };

  const handlePermissionToggle = (key: keyof DigitalAgent['permissions']) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: !formData.permissions[key]
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    const finalAgent: DigitalAgent = {
      ...formData,
      pricing: {
        ...formData.pricing,
        activePrice: parseFloat(customPriceInput) || formData.pricing.activePrice,
        setupFee: parseFloat(setupFeeInput) || formData.pricing.setupFee
      }
    };
    onSave(finalAgent);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const isHired = formData.status === 'hired';

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop com blur escuro */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Painel do Drawer */}
      <div className="relative w-full max-w-xl bg-[#091524] border-l border-slate-800/90 shadow-2xl h-full flex flex-col z-10 overflow-hidden text-[#F3F5F7]">
        {/* Topo do Drawer */}
        <div className="px-6 py-5 border-b border-slate-800 bg-[#0B1A2C] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center relative shadow-inner">
              <Bot className="w-6 h-6 text-[#00D2F6]" />
              {isHired && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#091524] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {formData.name}
                </h2>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                    isHired
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {isHired ? 'Ativo no Time' : 'Disponível'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{formData.role}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário de Configuração */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Alerta de Contexto do Cliente Ativo */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00D2F6]" />
              <span>
                Configurando para: <strong className="text-white">{tenantName}</strong>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Ambiente Seguro</span>
          </div>

          {/* 1. Identidade & Tom */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Sliders className="w-4 h-4 text-[#00D2F6]" />
              <span>1. Identidade & Comunicação</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Nome do Especialista
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-[#00D2F6] focus:outline-none"
                  placeholder="Ex: Davi"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Cargo / Função
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-[#00D2F6] focus:outline-none"
                  placeholder="Ex: Vendedor Autônomo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Tom de Conversa
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tone: e.target.value as DigitalAgent['tone']
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-[#00D2F6] focus:outline-none cursor-pointer"
                >
                  <option value="consultative">Consultivo & Autoritário</option>
                  <option value="empathetic">Empático & Acolhedor</option>
                  <option value="analytical">Analítico & Técnico</option>
                  <option value="direct">Direto & Dinâmico (SDR)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-[#00D2F6]" />
                  <span>Voz Vinculada (WhatsApp)</span>
                </label>
                <select
                  value={formData.voiceId || ''}
                  onChange={(e) => {
                    const prof = DEFAULT_VOICE_PROFILES.find((p) => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      voiceId: e.target.value,
                      voiceName: prof ? prof.name : 'Voz Padrão'
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-[#00D2F6] focus:outline-none cursor-pointer"
                >
                  <option value="">Sem envio de áudio</option>
                  {DEFAULT_VOICE_PROFILES.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name} ({prof.role.split('&')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Precificação & Recorrência por Porte (Value-Based Pricing) */}
          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>2. Recorrência & Faturamento</span>
              </div>
              <span className="text-[11px] text-emerald-400/90 font-medium">
                Precificação por Porte
              </span>
            </div>

            {/* Seletor de Patamares Rápidos */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTierChange('small')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTier === 'small'
                    ? 'bg-slate-800 border-[#00D2F6] shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Pequeno Porte
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  R$ {formData.pricing.small.toLocaleString('pt-BR')}/mês
                </span>
                <span className="text-[10px] text-slate-500 block">Clínicas / Lojas</span>
              </button>

              <button
                type="button"
                onClick={() => handleTierChange('medium')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTier === 'medium'
                    ? 'bg-slate-800 border-[#00D2F6] shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Médio Porte
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  R$ {formData.pricing.medium.toLocaleString('pt-BR')}/mês
                </span>
                <span className="text-[10px] text-slate-500 block">Imobiliárias / B2B</span>
              </button>

              <button
                type="button"
                onClick={() => handleTierChange('enterprise')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTier === 'enterprise'
                    ? 'bg-slate-800 border-[#00D2F6] shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Enterprise
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  R$ {formData.pricing.enterprise.toLocaleString('pt-BR')}/mês
                </span>
                <span className="text-[10px] text-slate-500 block">Grandes Contas</span>
              </button>
            </div>

            {/* Inputs de Valor Customizado */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                  Mensalidade Cobrada deste Cliente (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono text-slate-500">
                    R$
                  </span>
                  <input
                    type="number"
                    value={customPriceInput}
                    onChange={(e) => setCustomPriceInput(e.target.value)}
                    onBlur={handleCustomPriceBlur}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                    placeholder="490"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Ajuste fino manual livre
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                  Taxa de Setup / Implantação (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono text-slate-500">
                    R$
                  </span>
                  <input
                    type="number"
                    value={setupFeeInput}
                    onChange={(e) => setSetupFeeInput(e.target.value)}
                    onBlur={handleSetupFeeBlur}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                    placeholder="1200"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Cobrança única de entrada
                </span>
              </div>
            </div>
          </div>

          {/* 3. Permissões Operacionais */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#00D2F6]" />
              <span>3. Permissões de Ação no Sistema</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:bg-slate-900/60 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-medium text-white block">
                      Envio de Mensagens de Voz PTT
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sintetizar áudios consultivos no WhatsApp com voz clonada
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.permissions.canSendAudio}
                  onChange={() => handlePermissionToggle('canSendAudio')}
                  className="w-4 h-4 rounded border-slate-700 text-[#00D2F6] focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:bg-slate-900/60 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-xs font-medium text-white block">
                      Movimentação Automática no Kanban
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Promover leads qualificados de etapa no funil comercial
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.permissions.canMoveKanban}
                  onChange={() => handlePermissionToggle('canMoveKanban')}
                  className="w-4 h-4 rounded border-slate-700 text-[#00D2F6] focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:bg-slate-900/60 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="text-xs font-medium text-white block">
                      Agendamento de Reuniões & Visitas
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Inserir compromissos confirmados na agenda da equipe
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.permissions.canScheduleMeetings}
                  onChange={() => handlePermissionToggle('canScheduleMeetings')}
                  className="w-4 h-4 rounded border-slate-700 text-[#00D2F6] focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:bg-slate-900/60 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-medium text-white block">
                      Geração de Propostas & Copy
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Emitir rascunhos de propostas comerciais e propostas em PDF
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.permissions.canGenerateProposals}
                  onChange={() => handlePermissionToggle('canGenerateProposals')}
                  className="w-4 h-4 rounded border-slate-700 text-[#00D2F6] focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Botões de Ação do Rodapé */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const currentPrice = parseFloat(customPriceInput) || formData.pricing.activePrice;
                onToggleHire(formData.id, currentPrice);
                onClose();
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isHired
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md'
              }`}
            >
              {isHired ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Desativar do Time</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Ativar no Time Agora</span>
                </>
              )}
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 px-5 rounded-xl bg-[#00D2F6] hover:bg-[#00b8d9] text-[#07111F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,210,246,0.25)] transition-all cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#07111F]" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Salvar Parâmetros</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
