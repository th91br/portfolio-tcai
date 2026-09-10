import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Users,
  MessageCircle,
  Phone,
  Mail,
  Zap,
  DollarSign,
  TrendingUp,
  Award,
  Play,
  CheckCircle2,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  SalesRep,
  SalesTeamSettings,
  getSalesTeam,
  saveSalesTeam,
  getSalesTeamSettings,
  saveSalesTeamSettings,
  assignNextLead,
  generateWhatsAppHandoffUrl,
} from '../../../services/crm/salesTeamService';

interface SalesTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamUpdated?: () => void;
}

export const SalesTeamModal: React.FC<SalesTeamModalProps> = ({
  isOpen,
  onClose,
  onTeamUpdated,
}) => {
  const [team, setTeam] = useState<SalesRep[]>(getSalesTeam());
  const [settings, setSettings] = useState<SalesTeamSettings>(getSalesTeamSettings());
  const [editingRep, setEditingRep] = useState<SalesRep | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const notify = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleToggleStatus = (repId: string) => {
    const updated = team.map((r) => {
      if (r.id === repId) {
        const nextStatus: SalesRep['status'] = r.status === 'active' ? 'inactive' : 'active';
        return { ...r, status: nextStatus };
      }
      return r;
    });
    saveSalesTeam(updated);
    setTeam(updated);
    if (onTeamUpdated) onTeamUpdated();
  };

  const handleSaveRep = () => {
    if (!editingRep) return;

    if (!editingRep.name.trim() || !editingRep.whatsapp.trim()) {
      alert('Preencha o nome e o número de WhatsApp do atendente.');
      return;
    }

    const updated = isCreatingNew
      ? [...team, editingRep]
      : team.map((r) => (r.id === editingRep.id ? editingRep : r));

    saveSalesTeam(updated);
    setTeam(updated);
    setEditingRep(null);
    setIsCreatingNew(false);
    if (onTeamUpdated) onTeamUpdated();
    notify(`Vendedor ${editingRep.name} salvo com sucesso!`);
  };

  const handleDeleteRep = (id: string) => {
    const target = team.find((r) => r.id === id);
    if (!target) return;

    if (target.isHead) {
      alert('O responsável principal (Head) não pode ser excluído.');
      return;
    }

    if (confirm(`Excluir ${target.name} da equipe de vendas?`)) {
      const updated = team.filter((r) => r.id !== id);
      saveSalesTeam(updated);
      setTeam(updated);
      if (onTeamUpdated) onTeamUpdated();
      notify(`${target.name} removido da equipe.`);
    }
  };

  const handleSaveSettings = (newSettings: SalesTeamSettings) => {
    setSettings(newSettings);
    saveSalesTeamSettings(newSettings);
    notify('Regras de Round Robin atualizadas!');
  };

  const handleTestRoundRobin = () => {
    const result = assignNextLead(`test_${Date.now()}`);
    if (result) {
      setTestResult(`Lead roteado com sucesso para: ${result.repName} (${result.repPhone})`);
      setTeam(getSalesTeam());
      if (onTeamUpdated) onTeamUpdated();
    } else {
      setTestResult('Nenhum vendedor elegível ou ativo no momento.');
    }
    setTimeout(() => setTestResult(null), 5000);
  };

  const handleTestWhatsAppHandoff = (rep: SalesRep) => {
    const url = generateWhatsAppHandoffUrl(
      rep,
      'Dr. Roberto Siqueira',
      'Hospital Vitae',
      94
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#07111F]/80 backdrop-blur-md font-kanit">
      <div className="relative w-full max-w-4xl bg-[#091524] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0A1624]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  Time Comercial & Roteamento Round Robin
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[10px] font-mono text-[#00D2F6] font-bold">
                  MULTI-ATENDENTES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Distribuição automática e rotativa de leads qualificados pela IA entre seus vendedores
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificações / Toasts */}
        {successMessage && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-5 py-2.5 flex items-center gap-2 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {testResult && (
          <div className="bg-[#00D2F6]/15 border-b border-[#00D2F6]/30 px-5 py-2.5 flex items-center gap-2 text-[#00D2F6] text-xs font-mono animate-fadeIn">
            <Zap className="w-4 h-4 shrink-0" />
            <span>{testResult}</span>
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {editingRep ? (
            /* ========================================================================= */
            /* MODO EDITOR DE VENDEDOR                                                   */
            /* ========================================================================= */
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                  {isCreatingNew ? 'Cadastrar Novo Vendedor' : `Editar Vendedor: ${editingRep.name}`}
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRep(null);
                      setIsCreatingNew(false);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRep}
                    className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,210,246,0.25)]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Vendedor</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/10">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Avatar Emoji
                  </label>
                  <input
                    type="text"
                    value={editingRep.avatar}
                    onChange={(e) => setEditingRep({ ...editingRep, avatar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-center text-lg focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={editingRep.name}
                    onChange={(e) => setEditingRep({ ...editingRep, name: e.target.value })}
                    placeholder="Ex: Carlos Eduardo"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Função Comercial
                  </label>
                  <select
                    value={editingRep.role}
                    onChange={(e) =>
                      setEditingRep({ ...editingRep, role: e.target.value as SalesRep['role'] })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00D2F6] cursor-pointer"
                  >
                    <option value="closer" className="bg-[#091524]">Closer (Fechador)</option>
                    <option value="sdr" className="bg-[#091524]">SDR (Pré-vendas)</option>
                    <option value="account_executive" className="bg-[#091524]">Account Executive</option>
                    <option value="manager" className="bg-[#091524]">Gerente Comercial</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Título / Especialidade Exibida
                  </label>
                  <input
                    type="text"
                    value={editingRep.roleTitle}
                    onChange={(e) => setEditingRep({ ...editingRep, roleTitle: e.target.value })}
                    placeholder="Ex: Closer B2B • Planos de Saúde"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    WhatsApp (com DDI e DDD)
                  </label>
                  <input
                    type="text"
                    value={editingRep.whatsapp}
                    onChange={(e) => setEditingRep({ ...editingRep, whatsapp: e.target.value })}
                    placeholder="5511999998888"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    value={editingRep.email}
                    onChange={(e) => setEditingRep({ ...editingRep, email: e.target.value })}
                    placeholder="carlos@empresa.com.br"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* MODO VISUALIZAÇÃO E CONFIGURAÇÃO                                          */
            /* ========================================================================= */
            <div className="space-y-6">
              {/* Painel de Regras do Round Robin */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-blue-950/20 to-transparent border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#00D2F6]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      Motor de Distribuição Inteligente (Round Robin)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestRoundRobin}
                    className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Simular Roteamento Agora</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  {/* Modo de Roteamento */}
                  <div className="p-3 rounded-xl bg-[#07111F]/80 border border-white/10 space-y-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Algoritmo de Fila
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleSaveSettings({ ...settings, roundRobinMode: 'circular' })
                        }
                        className={`flex-1 py-1 rounded text-center text-[10px] font-bold transition-all ${
                          settings.roundRobinMode === 'circular'
                            ? 'bg-[#00D2F6] text-black'
                            : 'bg-white/[0.05] text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        Circular (A➔B➔C)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSaveSettings({ ...settings, roundRobinMode: 'capacity' })
                        }
                        className={`flex-1 py-1 rounded text-center text-[10px] font-bold transition-all ${
                          settings.roundRobinMode === 'capacity'
                            ? 'bg-[#00D2F6] text-black'
                            : 'bg-white/[0.05] text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        Menor Carga
                      </button>
                    </div>
                  </div>

                  {/* Somente Vendedores Ativos */}
                  <div className="p-3 rounded-xl bg-[#07111F]/80 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-white block font-semibold">Somente Ativos</span>
                      <span className="text-slate-400 text-[10px]">
                        Ignora vendedores em pausa ou férias
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveSettings({
                          ...settings,
                          onlyActiveReps: !settings.onlyActiveReps,
                        })
                      }
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        settings.onlyActiveReps ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          settings.onlyActiveReps ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Notificar Vendedor via WhatsApp */}
                  <div className="p-3 rounded-xl bg-[#07111F]/80 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-white block font-semibold">Aviso WhatsApp</span>
                      <span className="text-slate-400 text-[10px]">
                        Gera link imediato de repasse
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveSettings({
                          ...settings,
                          notifyRepOnWhatsApp: !settings.notifyRepOnWhatsApp,
                        })
                      }
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        settings.notifyRepOnWhatsApp ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          settings.notifyRepOnWhatsApp ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista do Time Comercial */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Vendedores & Atendentes Cadastrados ({team.length})
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const newMember: SalesRep = {
                        id: `rep_${Date.now()}`,
                        name: '',
                        email: '',
                        phone: '',
                        whatsapp: '',
                        avatar: '💼',
                        role: 'closer',
                        roleTitle: 'Closer Comercial',
                        status: 'active',
                        weight: 1,
                        leadsAssignedCount: 0,
                        dealsWonCount: 0,
                        totalRevenueWon: 0,
                      };
                      setEditingRep(newMember);
                      setIsCreatingNew(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#00D2F6]" />
                    <span>Cadastrar Novo Atendente</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {team.map((rep) => {
                    const isActive = rep.status === 'active';

                    return (
                      <div
                        key={rep.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isActive
                            ? 'bg-white/[0.02] border-white/10 hover:border-white/20'
                            : 'bg-white/[0.01] border-white/5 opacity-60'
                        }`}
                      >
                        {/* Info do Vendedor */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xl shrink-0">
                            {rep.avatar}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white truncate">
                                {rep.name}
                              </h4>
                              {rep.isHead && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] font-mono text-amber-400 font-bold">
                                  HEAD
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                                  isActive
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                                }`}
                              >
                                {isActive ? 'ATIVO NO ROUND ROBIN' : 'PAUSADO'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 font-mono truncate">
                              {rep.roleTitle}
                            </p>

                            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3 text-emerald-400" />
                                {rep.whatsapp}
                              </span>
                              <span className="flex items-center gap-1 text-slate-500">
                                <Mail className="w-3 h-3" />
                                {rep.email}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Métricas de Produtividade */}
                        <div className="flex items-center gap-4 text-xs font-mono shrink-0 bg-white/[0.02] px-3 py-2 rounded-xl border border-white/5">
                          <div className="text-center">
                            <span className="text-[10px] text-slate-500 block">Leads</span>
                            <span className="font-bold text-white text-sm">
                              {rep.leadsAssignedCount}
                            </span>
                          </div>
                          <div className="h-6 w-px bg-white/10" />
                          <div className="text-center">
                            <span className="text-[10px] text-slate-500 block">Fechados</span>
                            <span className="font-bold text-emerald-400 text-sm">
                              {rep.dealsWonCount}
                            </span>
                          </div>
                          <div className="h-6 w-px bg-white/10" />
                          <div className="text-center">
                            <span className="text-[10px] text-slate-500 block">Receita</span>
                            <span className="font-bold text-[#00D2F6] text-xs">
                              {rep.totalRevenueWon.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {/* Botão de Handoff WhatsApp Teste */}
                          <button
                            type="button"
                            onClick={() => handleTestWhatsAppHandoff(rep)}
                            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                            title="Testar repasse de lead no WhatsApp deste vendedor"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Alternador Ativo/Pausado */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(rep.id)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            {isActive ? 'Pausar' : 'Ativar'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingRep(JSON.parse(JSON.stringify(rep)));
                              setIsCreatingNew(false);
                            }}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                            title="Editar dados do vendedor"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {!rep.isHead && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRep(rep.id)}
                              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                              title="Remover da equipe"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0A1624] flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>
              {team.filter((r) => r.status === 'active').length} de {team.length} vendedores
              disponíveis para receber leads
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
