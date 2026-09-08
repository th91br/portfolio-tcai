import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Video, Check, Copy, RefreshCw, Phone, User, FileText } from 'lucide-react';
import { MeetingItem } from '../../../../services/agent/agentChatService';

interface MeetingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MeetingItem) => void;
  initialData?: MeetingItem | null;
  clientSuggestions?: Array<{ name: string; company: string; phone: string }>;
}

const TIME_PRESETS = [
  'Amanhã, 10:00 - 10:30',
  'Amanhã, 14:00 - 14:30',
  'Amanhã, 16:30 - 17:00',
  'Quinta-feira, 10:30 - 11:00',
  'Sexta-feira, 15:00 - 15:45',
];

export const MeetingEditModal: React.FC<MeetingEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  clientSuggestions = [],
}) => {
  const [client, setClient] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('Amanhã, 14:00 - 14:30');
  const [topic, setTopic] = useState('Alinhamento de Escopo & Demonstração IA');
  const [link, setLink] = useState('meet.google.com/tcai-briefing');
  const [status, setStatus] = useState<'AGENDADO' | 'REALIZADO' | 'CANCELADO'>('AGENDADO');
  const [notes, setNotes] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (initialData) {
      setClient(initialData.client || '');
      setPhone(initialData.phone || '');
      setTime(initialData.time || 'Amanhã, 14:00 - 14:30');
      setTopic(initialData.topic || 'Alinhamento de Escopo');
      setLink(initialData.link || 'meet.google.com/tcai-briefing');
      setStatus(initialData.status || 'AGENDADO');
      setNotes(initialData.notes || '');
    } else {
      setClient('');
      setPhone('');
      setTime('Amanhã, 14:00 - 14:30');
      setTopic('Alinhamento de Escopo: Agente WhatsApp & SLA 7 Dias');
      setLink('meet.google.com/tcai-' + Math.random().toString(36).substring(2, 7));
      setStatus('AGENDADO');
      setNotes('');
    }
  }, [initialData, isOpen]);

  const handleGenerateSlug = () => {
    const randomSlug = Math.random().toString(36).substring(2, 8);
    setLink('meet.google.com/tcai-' + randomSlug);
  };

  const handleCopyLink = () => {
    const full = link.startsWith('http') ? link : 'https://' + link;
    navigator.clipboard.writeText(full);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSelectSuggestion = (s: { name: string; company: string; phone: string }) => {
    setClient(s.name + ' (' + s.company + ')');
    if (s.phone) setPhone(s.phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !time.trim()) return;

    const savedMeeting: MeetingItem = {
      id: initialData?.id || 'meet-' + Date.now(),
      client: client.trim(),
      phone: phone.trim() || undefined,
      time: time.trim(),
      type: 'Google Meet',
      link: link.trim().replace(/^https?:\/\//, ''),
      topic: topic.trim(),
      status,
      notes: notes.trim() || undefined,
    };

    onSave(savedMeeting);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#0A1624] border border-[#16273C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#16273C] flex items-center justify-between bg-[#0C1B2E]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {initialData ? 'Editar Reunião de Alinhamento' : 'Novo Agendamento (Google Meet)'}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Gerenciamento de agenda executiva e envio de lembretes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            <div>
              <label className="block font-mono text-slate-300 mb-1 font-bold">
                Cliente / Participante <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Ex: Dr. Marcos Silva (Clínica Odonto Prime)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              {clientSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] font-mono text-slate-500 self-center">Leads:</span>
                  {clientSuggestions.slice(0, 4).map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="px-2 py-0.5 rounded bg-white/[0.03] hover:bg-purple-500/20 border border-white/[0.08] hover:border-purple-500/30 text-slate-300 text-[10px] font-mono transition-colors"
                    >
                      + {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block font-mono text-slate-300 mb-1 font-bold">
                WhatsApp do Lead (para envio automático de lembrete)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: +55 54 99123-4567"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">
                  Data e Horário <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Ex: Amanhã, 14:00 - 14:30"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {TIME_PRESETS.slice(0, 3).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTime(p)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                        time === p
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">
                  Status da Reunião
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="AGENDADO">🟢 AGENDADO (Confirmado)</option>
                  <option value="REALIZADO">✅ REALIZADO (Concluído)</option>
                  <option value="CANCELADO">🔴 CANCELADO</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-slate-300 mb-1 font-bold">
                Pauta / Objetivo da Reunião
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Alinhamento de Escopo: Agente WhatsApp & SLA 7 Dias"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-slate-300 mb-1 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-400" /> Link da Sala (Google Meet)
                </span>
                <button
                  type="button"
                  onClick={handleGenerateSlug}
                  className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Gerar Novo Link
                </button>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="meet.google.com/tcai-briefing"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-purple-300 font-mono focus:outline-none focus:border-purple-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-mono text-slate-300 mb-1 font-bold">
                Notas Preparatórias da Call
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Apresentar case da Clínica Odonto e demonstrar o dashboard em tempo real..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors resize-none"
              />
            </div>

            <div className="pt-3 border-t border-[#16273C] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/[0.05] font-mono transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold font-mono flex items-center gap-1.5 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:opacity-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{initialData ? 'Atualizar Reunião' : 'Agendar Reunião'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};