import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Plus,
  MessageCircle,
  Building,
  User,
  ExternalLink,
  Check,
  X,
  Filter,
} from 'lucide-react';
import {
  FollowUp,
  Lead,
  Deal,
  createFollowUp,
  completeFollowUp,
} from '../../../lib/supabase';
import { generateDashboardWhatsAppContactUrl } from '../../../services/diagnostic/scoreCalculator';

interface FollowUpsViewProps {
  followUps: FollowUp[];
  leads: Lead[];
  deals: Deal[];
  onSelectLead: (leadId: string) => void;
  onRefresh: () => void;
  adminEmail: string;
}

const COMMON_ACTIONS = [
  'Chamar no WhatsApp',
  'Enviar proposta',
  'Confirmar reunião',
  'Retomar negociação',
  'Solicitar retorno',
  'Apresentar protótipo',
];

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  followUps,
  leads,
  deals,
  onSelectLead,
  onRefresh,
  adminEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'hoje' | 'atrasados' | 'proximos' | 'sem_followup'>('hoje');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Form de novo follow-up
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [actionInput, setActionInput] = useState(COMMON_ACTIONS[0]);
  const [dateInput, setDateInput] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeInput, setTimeInput] = useState('14:00');
  const [notesInput, setNotesInput] = useState('');

  const now = new Date().getTime();

  // Filtragem e categorização das ações
  const pendingFollowUps = followUps.filter((f) => f.status === 'PENDENTE');

  const atrasados = pendingFollowUps.filter((f) => {
    const time = new Date(f.scheduled_at).getTime();
    return time < now;
  });

  const hoje = pendingFollowUps.filter((f) => {
    const schedDate = new Date(f.scheduled_at);
    const today = new Date();
    return (
      schedDate.getDate() === today.getDate() &&
      schedDate.getMonth() === today.getMonth() &&
      schedDate.getFullYear() === today.getFullYear() &&
      schedDate.getTime() >= now
    );
  });

  const proximos = pendingFollowUps.filter((f) => {
    const schedDate = new Date(f.scheduled_at);
    const today = new Date();
    const isToday =
      schedDate.getDate() === today.getDate() &&
      schedDate.getMonth() === today.getMonth() &&
      schedDate.getFullYear() === today.getFullYear();
    return schedDate.getTime() > now && !isToday;
  });

  // Leads ativos sem follow-up pendente
  const leadsComFollowUpPendente = new Set(pendingFollowUps.map((f) => f.lead_id));
  const semFollowUp = leads.filter(
    (l) =>
      l.status !== 'FECHADO' &&
      l.status !== 'PERDIDO' &&
      !leadsComFollowUpPendente.has(l.id)
  );

  const handleComplete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletingId(id);
    try {
      await completeFollowUp(id, adminEmail);
      onRefresh();
    } catch (err) {
      console.error('Falha ao concluir follow-up:', err);
    } finally {
      setCompletingId(null);
    }
  };

  const handleDirectWhatsApp = (e: React.MouseEvent, lead?: Lead) => {
    e.stopPropagation();
    if (!lead) return;
    const url = generateDashboardWhatsAppContactUrl({
      leadName: lead.name,
      leadWhatsapp: lead.whatsapp,
      recommendedSolution: lead.recommended_solution,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;

    const scheduledAt = new Date(`${dateInput}T${timeInput || '12:00'}:00`).toISOString();
    const deal = deals.find((d) => d.lead_id === selectedLeadId);

    try {
      await createFollowUp({
        leadId: selectedLeadId,
        dealId: deal?.id,
        action: actionInput,
        scheduledAt,
        notes: notesInput.trim() || undefined,
      });
      setIsModalOpen(false);
      setNotesInput('');
      onRefresh();
    } catch (err) {
      console.error('Erro ao agendar follow-up:', err);
    }
  };

  return (
    <div className="space-y-6 font-kanit">
      {/* Topo: Título & Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-black text-2xl text-white uppercase tracking-tight">
            GERENCIAMENTO DE FOLLOW-UPS
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono">
            Organize suas próximas ações de contato para manter a disciplina comercial
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,210,246,0.3)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Follow-up</span>
        </button>
      </div>

      {/* Abas de Categorização */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('hoje')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'hoje'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>HOJE ({hoje.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('atrasados')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'atrasados'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>ATRASADOS ({atrasados.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('proximos')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'proximos'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>PRÓXIMOS ({proximos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sem_followup')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'sem_followup'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>SEM FOLLOW-UP ({semFollowUp.length})</span>
        </button>
      </div>

      {/* Lista de Follow-ups do Tab Ativo */}
      <div className="space-y-3">
        {activeTab === 'sem_followup' ? (
          semFollowUp.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs font-mono border-2 border-dashed border-white/[0.05] rounded-2xl">
              Ótimo! Todos os leads ativos possuem uma próxima ação agendada.
            </div>
          ) : (
            semFollowUp.map((lead) => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className="p-4 rounded-2xl bg-[#091524] border border-white/10 hover:border-[#00D2F6]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-base text-white hover:text-[#00D2F6] transition-colors">
                      {lead.name}
                    </h4>
                    {lead.company && (
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {lead.company}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[#00D2F6]">
                      {lead.status}
                    </span>
                    <span>{lead.recommended_solution}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLeadId(lead.id);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agendar Follow-up</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDirectWhatsApp(e, lead)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          (() => {
            const currentList =
              activeTab === 'hoje'
                ? hoje
                : activeTab === 'atrasados'
                ? atrasados
                : proximos;

            if (currentList.length === 0) {
              return (
                <div className="py-16 text-center text-slate-500 text-xs font-mono border-2 border-dashed border-white/[0.05] rounded-2xl">
                  {activeTab === 'hoje' && 'Nenhum follow-up agendado para hoje.'}
                  {activeTab === 'atrasados' && 'Nenhum follow-up atrasado no momento. Excelente!'}
                  {activeTab === 'proximos' && 'Nenhum follow-up agendado para os próximos dias.'}
                </div>
              );
            }

            return currentList.map((item) => {
              const lead = item.lead || leads.find((l) => l.id === item.lead_id);
              const sched = new Date(item.scheduled_at);
              const isOverdue = sched.getTime() < now;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectLead(item.lead_id)}
                  className={`p-4 rounded-2xl bg-[#091524] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                    isOverdue
                      ? 'border-rose-500/30 bg-rose-500/[0.02]'
                      : 'border-white/10 hover:border-[#00D2F6]/30'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-base text-white hover:text-[#00D2F6] transition-colors">
                        {lead?.name || 'Lead'}
                      </span>
                      {lead?.company && (
                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {lead.company}
                        </span>
                      )}
                      {isOverdue && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-400 text-[10px] font-mono font-bold">
                          ATRASADO
                        </span>
                      )}
                    </div>

                    {/* Ação e horário */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
                      <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-white font-bold">
                        {item.action}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#00D2F6]" />
                        {sched.toLocaleDateString('pt-BR')} às{' '}
                        {sched.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-400 font-light mt-2 italic bg-black/20 p-2 rounded-lg border border-white/[0.04]">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={completingId === item.id}
                      onClick={(e) => handleComplete(item.id, e)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Marcar ação como concluída"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Concluir</span>
                    </button>

                    {lead && (
                      <button
                        type="button"
                        onClick={(e) => handleDirectWhatsApp(e, lead)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Abrir WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: NOVO FOLLOW-UP                                                      */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-kanit">
          <div className="bg-[#0B1522] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white uppercase mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00D2F6]" />
              <span>Agendar Próxima Ação</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Seleção de Lead */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Lead / Negócio <span className="text-[#00D2F6]">*</span>
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#091524] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D2F6]"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} {l.company ? `(${l.company})` : ''} — {l.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ação */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Próxima Ação <span className="text-[#00D2F6]">*</span>
                </label>
                <select
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#091524] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D2F6] mb-2"
                >
                  {COMMON_ACTIONS.map((act) => (
                    <option key={act} value={act}>
                      {act}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Data <span className="text-[#00D2F6]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#091524] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#091524] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Observações / Contexto
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Ex: Alinhar escopo do MVP e envio de minuta comercial..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#00D2F6] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(0,210,246,0.3)]"
                >
                  Salvar Ação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
