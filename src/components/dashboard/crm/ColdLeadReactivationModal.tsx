import React, { useState } from 'react';
import {
  X,
  Flame,
  Users,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';
import { ChatContact, ChatMessage } from '../../../services/agent/agentChatService';

interface ColdLeadReactivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: ChatContact[];
  onDispatched: (updatedContacts: ChatContact[]) => void;
}

interface CampaignTemplate {
  id: string;
  title: string;
  badge: string;
  template: (name: string, company?: string) => string;
}

const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'consultative_followup',
    title: 'Follow-up Consultivo & Atualização',
    badge: 'Alta Conversão (+15d)',
    template: (name, company) =>
      `Olá ${name}, tudo bem? Aqui é o Thiago. Notei que conversamos recentemente sobre a automação ${company ? `da ${company}` : 'do seu atendimento'}. Liberamos uma nova atualização no motor de IA e lembrei do seu cenário. Como estão as operações por aí esta semana?`,
  },
  {
    id: 'special_closing',
    title: 'Condição Especial de Fechamento',
    badge: 'Fundo de Funil (+7d)',
    template: (name, company) =>
      `Fala ${name}, tudo bem? Thiago por aqui. Estou fechando a grade de implantações prioritárias deste ciclo e consegui segurar aquela condição exclusiva que conversamos para a ${company || 'sua empresa'}. Conseguimos alinhar o início ainda para esta semana?`,
  },
  {
    id: 'free_diagnostic',
    title: 'Auditoria Gratuita de Vazamento de Leads',
    badge: 'Reativação Fria (+30d)',
    template: (name, company) =>
      `Olá ${name}! Passando rapidamente para compartilhar que desenvolvemos uma auditoria técnica de tempo de resposta e vazamento de leads no WhatsApp. Consegui liberar um relatório cortesia para a ${company || 'sua operação'}. Posso te enviar os dados preliminares?`,
  },
];

export const ColdLeadReactivationModal: React.FC<ColdLeadReactivationModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onDispatched,
}) => {
  const [selectedDaysFilter, setSelectedDaysFilter] = useState<number>(7);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('consultative_followup');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchProgress, setDispatchProgress] = useState<{ current: number; total: number } | null>(
    null
  );
  const [completed, setCompleted] = useState<boolean>(false);

  // Filtra leads inativos com base no filtro de dias
  const candidateContacts = contacts.filter((c) => {
    // Para efeito de demonstração e leads reais, consideramos leads não fechados
    return c.status !== 'closed';
  });

  // Inicializa selecionados ao abrir
  React.useEffect(() => {
    if (isOpen) {
      const defaultIds = candidateContacts.slice(0, 5).map((c) => c.id);
      setSelectedContactIds(defaultIds);
      setCompleted(false);
      setIsDispatching(false);
      setDispatchProgress(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTemplate =
    CAMPAIGN_TEMPLATES.find((t) => t.id === selectedTemplateId) || CAMPAIGN_TEMPLATES[0];

  const handleToggleSelectAll = () => {
    if (selectedContactIds.length === candidateContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(candidateContacts.map((c) => c.id));
    }
  };

  const handleToggleContact = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStartDispatch = () => {
    if (selectedContactIds.length === 0) return;

    setIsDispatching(true);
    setCompleted(false);
    const total = selectedContactIds.length;
    let current = 0;
    setDispatchProgress({ current: 0, total });

    const updatedContactsList = [...contacts];

    const interval = setInterval(() => {
      if (current >= total) {
        clearInterval(interval);
        setIsDispatching(false);
        setCompleted(true);
        onDispatched(updatedContactsList);
        return;
      }

      const targetId = selectedContactIds[current];
      const targetIndex = updatedContactsList.findIndex((c) => c.id === targetId);
      if (targetIndex !== -1) {
        const contact = updatedContactsList[targetIndex];
        const msgText = customMessage.trim()
          ? customMessage
          : currentTemplate.template(contact.name, contact.company);

        const newMsg: ChatMessage = {
          sender: 'agent',
          text: msgText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const existingMessages = contact.messages || [];
        updatedContactsList[targetIndex] = {
          ...contact,
          messages: [...existingMessages, newMsg],
          lastMessage: msgText,
          lastMessageTime: 'Agora',
          status: contact.status === 'triage' ? 'proposal_sent' : contact.status,
        };
      }

      current++;
      setDispatchProgress({ current, total });
    }, 600); // 600ms por lead na simulação com ritmo visual
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/80 backdrop-blur-md font-kanit">
      <div className="relative w-full max-w-3xl bg-[#091524] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0A1624]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Reativação de Leads Inativos & Cadência Fria
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  ANTI-BAN PACING
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light">
                Disparo personalizado com intervalos humanizados para resgatar oportunidades paradas.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {completed ? (
            /* Tela de Sucesso Concluído */
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Reativação Despachada com Sucesso!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  <strong>{selectedContactIds.length} leads</strong> foram contatados com cadência segura no WhatsApp. O agente de IA monitorará as respostas automaticamente.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Concluir e Voltar ao CRM
                </button>
              </div>
            </div>
          ) : isDispatching ? (
            /* Tela de Progresso do Disparo */
            <div className="p-8 rounded-2xl bg-[#0A1624] border border-white/10 text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[#00D2F6] flex items-center justify-center mx-auto animate-pulse">
                <Send className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-wider">
                  Enviando Mensagens com Cadência Anti-Ban...
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Disparando {dispatchProgress?.current} de {dispatchProgress?.total} leads com intervalo humanizado de segurança.
                </p>
              </div>

              {/* Barra de Progresso */}
              <div className="w-full bg-[#07111F] rounded-full h-3 border border-white/10 overflow-hidden">
                <div
                  className="bg-[#00D2F6] h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${
                      dispatchProgress
                        ? Math.round((dispatchProgress.current / dispatchProgress.total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400">
                <span>Status: <strong className="text-emerald-400">Canal WhatsApp Ativo</strong></span>
                <span>Fila: <strong className="text-white">Em Execução</strong></span>
              </div>
            </div>
          ) : (
            /* Formulário de Configuração do Disparo */
            <>
              {/* Seleção do Template da Campanha */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                  1. Selecione a Estratégia de Reativação:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CAMPAIGN_TEMPLATES.map((camp) => (
                    <button
                      key={camp.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(camp.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                        selectedTemplateId === camp.id
                          ? 'bg-[#00D2F6]/10 border-[#00D2F6] shadow-lg shadow-[#00D2F6]/10'
                          : 'bg-[#0A1624] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-white/5 text-[#00D2F6] border border-white/10">
                          {camp.badge}
                        </span>
                        {selectedTemplateId === camp.id && (
                          <Check className="w-4 h-4 text-[#00D2F6]" />
                        )}
                      </div>
                      <h5 className="font-bold text-white text-xs leading-snug">{camp.title}</h5>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview da Mensagem */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    2. Mensagem Personalizada (Primeira Pessoa - Thiago):
                  </label>
                  <span className="text-[10px] font-mono text-[#00D2F6]">
                    Variáveis: [Nome], [Empresa]
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#0A1624] border border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
                  {currentTemplate.template('Carlos Silva', 'Tech Corp')}
                </div>
              </div>

              {/* Seleção de Leads Alvo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    3. Selecione os Leads Alvo ({selectedContactIds.length} selecionados):
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-xs font-mono text-[#00D2F6] hover:underline cursor-pointer"
                  >
                    {selectedContactIds.length === candidateContacts.length
                      ? 'Desmarcar Todos'
                      : 'Selecionar Todos'}
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {candidateContacts.map((contact) => {
                    const isSelected = selectedContactIds.includes(contact.id);
                    return (
                      <div
                        key={contact.id}
                        onClick={() => handleToggleContact(contact.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white/[0.06] border-[#00D2F6]/40'
                            : 'bg-[#0A1624] border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-white/20 bg-transparent text-[#00D2F6] focus:ring-0 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{contact.name}</span>
                              {contact.company && (
                                <span className="text-[10px] font-mono text-slate-400">
                                  • {contact.company}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {contact.lastMessage || 'Sem mensagem anterior'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 text-slate-300 border border-white/10">
                            {contact.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Blindagem de Segurança */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cadência Anti-Ban ativada: mensagens enviadas com intervalos aleatórios.</span>
                </div>
                <span className="font-mono text-emerald-400 text-[10px] uppercase font-bold">
                  Zero Spam
                </span>
              </div>
            </>
          )}
        </div>

        {/* Rodapé com Ações */}
        {!isDispatching && !completed && (
          <div className="p-4 border-t border-white/10 bg-[#0A1624] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={selectedContactIds.length === 0}
              onClick={handleStartDispatch}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#07111F] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>Iniciar Reativação ({selectedContactIds.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
