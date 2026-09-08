import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building, Phone, Layers, Clock, Check } from 'lucide-react';
import { ChatContact } from '../../../../services/agent/agentChatService';
import { CnpjEnrichmentCard } from '../../crm/CnpjEnrichmentCard';
import { CnpjCompanyData } from '../../../../services/crm/cnpjEnrichmentService';

interface ContactEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Partial<ChatContact> & { id: string }) => void;
  initialData?: ChatContact | null;
}

const AVATAR_OPTIONS = ['💼', '👨‍⚕️', '👩‍💼', '🚚', '⚖️', '🚀', '🏢', '🏥', '🎯', '⚡'];
const SLA_OPTIONS = ['3 DIAS ÚTEIS', '5 DIAS ÚTEIS', '7 DIAS ÚTEIS', '10 DIAS ÚTEIS', '15 DIAS ÚTEIS'];

export const ContactEditModal: React.FC<ContactEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('');
  const [slaTimeline, setSlaTimeline] = useState('7 DIAS ÚTEIS');
  const [score, setScore] = useState(85);
  const [status, setStatus] = useState<ChatContact['status']>('triage');
  const [avatar, setAvatar] = useState('💼');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCompany(initialData.company || '');
      setCnpj(initialData.cnpj || '');
      setPhone(initialData.phone || '');
      setProjectType(initialData.projectType || 'Automação com IA & WhatsApp');
      setSlaTimeline(initialData.slaTimeline || '7 DIAS ÚTEIS');
      setScore(initialData.score ?? 85);
      setStatus(initialData.status || 'triage');
      setAvatar(initialData.avatar || '💼');
    } else {
      setName('');
      setCompany('');
      setCnpj('');
      setPhone('');
      setProjectType('Automação com IA & WhatsApp');
      setSlaTimeline('7 DIAS ÚTEIS');
      setScore(85);
      setStatus('triage');
      setAvatar('💼');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const statusLabels: Record<ChatContact['status'], string> = {
      triage: 'Triagem Inicial',
      ai_qualified: 'Qualificado por IA',
      proposal_sent: 'Proposta Enviada',
      meeting_booked: 'Reunião Agendada',
      closed: 'Fechado',
    };

    onSave({
      id: initialData?.id || 'lead-' + Date.now(),
      name: name.trim(),
      company: company.trim() || 'Empresa Privada',
      cnpj: cnpj.trim() || undefined,
      phone: phone.trim() || '+55 54 99123-4567',
      projectType: projectType.trim() || 'Automação com IA',
      slaTimeline: slaTimeline.trim(),
      score,
      status,
      statusLabel: statusLabels[status],
      avatar,
    });
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
          className="relative w-full max-w-xl bg-[#0A1624] border border-[#16273C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#16273C] flex items-center justify-between bg-[#0C1B2E]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6] text-lg">
                {avatar}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {initialData ? 'Editar Dossiê do Lead & Oportunidade' : 'Nova Oportunidade no Funil'}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Parâmetros de qualificação, SLA e estágio no pipeline
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
            <div className="space-y-2">
              <label className="block font-mono text-slate-300 font-bold">Avatar / Ícone</label>
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAvatar(opt)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                      avatar === opt
                        ? 'bg-[#00D2F6]/20 border-[#00D2F6] scale-110 shadow-[0_0_10px_rgba(0,210,246,0.3)]'
                        : 'bg-[#07111F] border-white/10 hover:border-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-mono text-slate-300 mb-1 font-bold">
                Nome do Lead / Decisor <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Dra. Letícia Rossi"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">Empresa</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ex: Clínica Rossi Medicina"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">WhatsApp / Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +55 54 99188-7766"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Raio-X B2B por CNPJ */}
            <CnpjEnrichmentCard
              initialCnpj={cnpj}
              compact
              onDataEnriched={(enriched) => {
                setCnpj(enriched.cnpjFormatado);
                if (!company || company === 'Empresa Privada') {
                  setCompany(enriched.nomeFantasia || enriched.razaoSocial);
                }
                if (!phone && enriched.telefone) {
                  setPhone(enriched.telefone);
                }
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">
                  Estágio no Pipeline (Kanban)
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                >
                  <option value="triage">📋 Triagem Inicial</option>
                  <option value="ai_qualified">⚡ Qualificado por IA</option>
                  <option value="proposal_sent">📄 Proposta Enviada</option>
                  <option value="meeting_booked">📅 Reunião Agendada</option>
                  <option value="closed">🏆 Fechado / Ganho</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-mono text-slate-300 font-bold">Score de Qualificação</label>
                  <span className="font-mono font-black text-emerald-400 text-sm">{score}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={score}
                  onChange={(e) => setScore(parseInt(e.target.value, 10))}
                  className="w-full accent-[#00D2F6] cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">
                  Escopo do Projeto
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    placeholder="Ex: Agente Jurídico para Atendimento"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-300 mb-1 font-bold">
                  SLA Garantido
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <select
                    value={slaTimeline}
                    onChange={(e) => setSlaTimeline(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#07111F] border border-[#16273C] text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                  >
                    {SLA_OPTIONS.map((sla) => (
                      <option key={sla} value={sla}>
                        {sla}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
                <span>{initialData ? 'Salvar Alterações' : 'Criar Oportunidade'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};