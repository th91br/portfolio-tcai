import React, { useState, useEffect } from 'react';
import {
  Clock,
  MessageSquare,
  FileText,
  Calendar,
  CheckCircle2,
  DollarSign,
  Building2,
  Lock,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  TimelineEvent,
  TimelineEventType,
  getTimelineForContact,
  addInternalNote,
} from '../../../services/crm/timelineService';

interface LeadTimelineFeedProps {
  contactId: string;
  leadName?: string;
}

export const LeadTimelineFeed: React.FC<LeadTimelineFeedProps> = ({
  contactId,
  leadName = 'Lead',
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTimeline = () => {
    if (!contactId) return;
    const loaded = getTimelineForContact(contactId);
    setEvents(loaded);
  };

  useEffect(() => {
    loadTimeline();
  }, [contactId]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    setIsSubmitting(true);
    addInternalNote(contactId, noteInput.trim(), 'Thiago (TCAI)');
    setNoteInput('');
    setIsSubmitting(false);
    loadTimeline();
  };

  const getEventIcon = (type: TimelineEventType) => {
    switch (type) {
      case 'lead_created':
        return <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />;
      case 'whatsapp_message':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'diagnostic_created':
        return <FileText className="w-3.5 h-3.5 text-amber-400" />;
      case 'proposal_sent':
        return <DollarSign className="w-3.5 h-3.5 text-cyan-400" />;
      case 'meeting_scheduled':
        return <Calendar className="w-3.5 h-3.5 text-blue-400" />;
      case 'stage_changed':
        return <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />;
      case 'internal_note':
        return <Lock className="w-3.5 h-3.5 text-purple-400" />;
      case 'cnpj_enriched':
        return <Building2 className="w-3.5 h-3.5 text-teal-400" />;
      case 'payment_received':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatEventDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="bg-[#0A1624] border border-[#16273C] rounded-xl p-4 text-xs space-y-3 font-kanit">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-[#16273C] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#F3F5F7] text-sm">Linha do Tempo 360°</h4>
            <p className="text-[10px] text-[#94A3B8]">Audit trail de interações e notas privadas</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16273C] text-[#94A3B8]">
          {events.length} registro(s)
        </span>
      </div>

      {/* Formulário de Adicionar Nota Interna Privada */}
      <form onSubmit={handleAddNote} className="space-y-2">
        <div className="relative">
          <textarea
            rows={2}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Adicionar nota interna privada (ex: cliente prefere pagar 50% na entrega)..."
            className="w-full bg-[#07111F] border border-[#16273C] focus:border-purple-400 rounded-lg p-2 text-xs text-[#F3F5F7] placeholder:text-[#64748B] outline-none resize-none transition-colors"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!noteInput.trim() || isSubmitting}
            className="px-3 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-medium rounded-lg flex items-center gap-1.5 transition-all text-[11px] disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gravar Nota Interna</span>
          </button>
        </div>
      </form>

      {/* Lista Cronológica */}
      <div className="space-y-3 pt-2 max-h-72 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="text-center py-6 text-[#64748B] space-y-1">
            <Clock className="w-6 h-6 mx-auto opacity-40" />
            <p className="text-xs">Nenhum evento registrado ainda.</p>
            <p className="text-[10px]">Interações, propostas e notas aparecerão aqui automaticamente.</p>
          </div>
        ) : (
          <div className="relative pl-4 border-l border-[#16273C] space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="relative group">
                {/* Marcador do Ponto na Linha do Tempo */}
                <div className="absolute -left-[23px] top-0.5 w-5 h-5 rounded-full bg-[#07111F] border border-[#16273C] flex items-center justify-center">
                  {getEventIcon(ev.type)}
                </div>

                {/* Conteúdo do Card do Evento */}
                <div className="bg-[#07111F] p-2.5 rounded-lg border border-[#16273C]/80 hover:border-[#00D2F6]/30 transition-colors space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-white flex items-center gap-1">
                      {ev.title}
                      {ev.type === 'internal_note' && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono">
                          Privado
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[#94A3B8]">{formatEventDate(ev.timestamp)}</span>
                  </div>

                  <p className="text-[11px] text-[#CBD5E1] whitespace-pre-wrap">{ev.description}</p>

                  {ev.author && (
                    <p className="text-[9px] text-[#64748B] text-right font-mono">Por: {ev.author}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
