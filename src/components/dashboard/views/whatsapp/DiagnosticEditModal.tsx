import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Plus, Check, Clock, DollarSign, Layers } from 'lucide-react';
import { DiagnosticItem } from '../../../../services/agent/agentChatService';

interface DiagnosticEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: DiagnosticItem) => void;
  initialData?: DiagnosticItem | null;
  clientSuggestions?: string[];
}

const STACK_PRESETS = [
  'WhatsApp Cloud API',
  'Gemini 2.0 Multimodal',
  'FastAPI Python',
  'Node.js / TypeScript',
  'React 18 / Vite',
  'N8N / Webhooks',
  'Supabase / PostgreSQL',
  'Tailwind CSS',
  'Docker',
];

const SLA_PRESETS = ['3 dias úteis', '5 dias úteis', '7 dias úteis', '10 dias úteis', '15 dias úteis'];

export const DiagnosticEditModal: React.FC<DiagnosticEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  clientSuggestions = [],
}) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState<'HOT' | 'QUALIFICADO' | 'TRIAGEM' | 'EM ANÁLISE'>('HOT');
  const [scoreNum, setScoreNum] = useState(90);
  const [sla, setSla] = useState('7 dias úteis');
  const [budget, setBudget] = useState('R$ 6.500 - R$ 9.800');
  const [stack, setStack] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setClient(initialData.client || '');
      setStatus((initialData.status as any) || 'HOT');
      const parsedScore = parseInt((initialData.score || '90').replace('%', ''), 10);
      setScoreNum(isNaN(parsedScore) ? 90 : parsedScore);
      setSla(initialData.sla || '7 dias úteis');
      setBudget(initialData.budget || 'R$ 6.500 - R$ 9.800');
      setStack(initialData.stack || []);
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setClient('');
      setStatus('HOT');
      setScoreNum(92);
      setSla('7 dias úteis');
      setBudget('R$ 6.500 - R$ 9.800');
      setStack(['WhatsApp Cloud API', 'Gemini 2.0 Multimodal', 'Node.js / TypeScript']);
      setNotes('');
    }
  }, [initialData, isOpen]);

  const handleAddTag = (tagToAdd?: string) => {
    const t = (tagToAdd || newTag).trim();
    if (!t) return;
    if (!stack.includes(t)) {
      setStack([...stack, t]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setStack(stack.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) return;

    const savedItem: DiagnosticItem = {
      id: initialData?.id || 'diag-' + Date.now(),
      title: title.trim(),
      client: client.trim(),
      date: initialData?.date || 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sla: sla.trim(),
      score: scoreNum + '%',
      status,
      budget: budget.trim(),
      stack,
      notes: notes.trim() || undefined,
    };

    onSave(savedItem);
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
              <div className="w-9 h-9 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {initialData ? 'Editar Diagnóstico Técnico' : 'Novo Diagnóstico HOT de IA'}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Mapeamento cognitivo de escopo, SLA e investimento
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
                Título do Projeto / Escopo <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Automação & Atendimento IA 24/7 com Gemini"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-slate-300 mb-1 font-bold">
                Cliente / Empresa <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Ex: Clínica Odonto Prime (Dr. Marcos)"
                list="diag-client-suggestions"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
              />
              {clientSuggestions.length > 0 && (
                <datalist id="diag-client-suggestions">
                  {clientSuggestions.map((c, idx) => (
                    <option key={idx} value={c} />
                  ))}
                </datalist>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">
                  Classificação de Lead
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                >
                  <option value="HOT">🔥 HOT (Altíssima Qualificação)</option>
                  <option value="QUALIFICADO">⚡ QUALIFICADO (Proposta Em Andamento)</option>
                  <option value="TRIAGEM">📋 TRIAGEM (Requisitos Iniciais)</option>
                  <option value="EM ANÁLISE">🔍 EM ANÁLISE (Aguardando Retorno)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-mono text-slate-300 font-bold">Score de Viabilidade</label>
                  <span className="font-mono font-black text-emerald-400 text-sm">{scoreNum}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={scoreNum}
                  onChange={(e) => setScoreNum(parseInt(e.target.value, 10))}
                  className="w-full accent-[#00D2F6] cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">
                  Faixa de Investimento Estimada
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Ex: R$ 6.800 - R$ 9.500"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">
                  SLA Contratual Garantido
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={sla}
                    onChange={(e) => setSla(e.target.value)}
                    placeholder="Ex: 7 dias úteis"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {SLA_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSla(preset)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                        sla === preset
                          ? 'bg-[#00D2F6]/20 border-[#00D2F6] text-[#00D2F6]'
                          : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-mono text-slate-300 mb-1 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00D2F6]" /> Stack Tecnológica & Entregáveis
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] p-2 rounded-xl bg-[#07111F] border border-[#16273C]">
                {stack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[#00D2F6] font-mono text-[11px]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-400 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {stack.length === 0 && (
                  <span className="text-slate-500 font-mono text-[11px] py-0.5">
                    Nenhuma tecnologia adicionada.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Digitar tecnologia personalizada..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6]"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-[#00D2F6]/20 border border-white/10 hover:border-[#00D2F6]/40 text-slate-200 hover:text-[#00D2F6] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {STACK_PRESETS.map((preset) => {
                  const isSelected = stack.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveTag(preset) : handleAddTag(preset))}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                        isSelected
                          ? 'bg-[#00D2F6]/20 border-[#00D2F6] text-[#00D2F6]'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-mono text-slate-300 mb-1 font-bold">
                Notas do Diagnóstico & Requisitos do Cliente
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Cliente necessita de integração direta com o CRM e triagem automática de novos pacientes pelo WhatsApp..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] transition-colors resize-none"
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-slate-950 font-bold font-mono flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,210,246,0.3)] hover:opacity-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{initialData ? 'Atualizar Diagnóstico' : 'Salvar Diagnóstico'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};