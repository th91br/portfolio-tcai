import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageCircle,
  Mail,
  Building,
  Calendar,
  Zap,
  Target,
  Clock,
  Award,
  Layers,
  FileText,
  History,
  Send,
  RefreshCw,
  Plus,
  CheckCircle2,
  DollarSign,
  Percent,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Save,
} from 'lucide-react';
import {
  Lead,
  LeadAnswer,
  LeadScoreDetail,
  LeadNote,
  LeadStatusHistory,
  LeadStatus,
  Deal,
  fetchLeadFullDetails,
  updateLeadStatus,
  addLeadNote,
  fetchDealByLeadId,
  updateDealDetails,
} from '../../../lib/supabase';
import { generateDashboardWhatsAppContactUrl } from '../../../services/diagnostic/scoreCalculator';

interface LeadDetailsDrawerProps {
  leadId: string | null;
  onClose: () => void;
  onLeadUpdated: () => void;
  adminEmail: string;
}

const ALL_STATUSES: LeadStatus[] = [
  'NOVO',
  'QUALIFICADO',
  'CONTATADO',
  'REUNIÃO',
  'PROPOSTA',
  'NEGOCIAÇÃO',
  'FECHADO',
  'PERDIDO',
];

export const LeadDetailsDrawer: React.FC<LeadDetailsDrawerProps> = ({
  leadId,
  onClose,
  onLeadUpdated,
  adminEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'comercial' | 'dossie' | 'notas'>('comercial');
  const [details, setDetails] = useState<{
    lead: Lead;
    answers: LeadAnswer[];
    score: LeadScoreDetail | null;
    notes: LeadNote[];
    history: LeadStatusHistory[];
  } | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);

  const [loading, setLoading] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Form Comercial State
  const [estimatedValue, setEstimatedValue] = useState('');
  const [proposedValue, setProposedValue] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [probability, setProbability] = useState<number>(10);
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [proposalDate, setProposalDate] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [nextActionAt, setNextActionAt] = useState('');
  const [savingCommercial, setSavingCommercial] = useState(false);
  const [commercialSavedSuccess, setCommercialSavedSuccess] = useState(false);

  // Carrega todos os detalhes do lead e do deal correspondente
  useEffect(() => {
    if (!leadId) {
      setDetails(null);
      setDeal(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    Promise.all([fetchLeadFullDetails(leadId), fetchDealByLeadId(leadId)])
      .then(([leadData, dealData]) => {
        if (!isMounted) return;
        setDetails(leadData);
        setDeal(dealData);

        if (dealData) {
          setEstimatedValue(dealData.estimated_value?.toString() || '');
          setProposedValue(dealData.proposed_value?.toString() || '');
          setFinalValue(dealData.final_value?.toString() || '');
          setProbability(dealData.probability ?? 10);
          setExpectedCloseDate(dealData.expected_close_date || '');
          setProposalDate(dealData.proposal_date || '');
          setNextAction(dealData.next_action || '');
          setNextActionAt(
            dealData.next_action_at ? dealData.next_action_at.split('T')[0] : ''
          );
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar dossiê:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [leadId]);

  if (!leadId) return null;

  // Atualizar status
  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!details) return;
    setUpdatingStatus(true);
    try {
      await updateLeadStatus(details.lead.id, newStatus, adminEmail);
      setDetails({
        ...details,
        lead: { ...details.lead, status: newStatus },
      });
      onLeadUpdated();
      const refreshed = await fetchLeadFullDetails(details.lead.id);
      setDetails(refreshed);
    } catch (err) {
      console.error('Falha ao atualizar status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Salvar Ficha Comercial
  const handleSaveCommercial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;
    setSavingCommercial(true);
    setCommercialSavedSuccess(false);

    const parseNum = (val: string) => {
      if (!val.trim()) return null;
      const num = parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'));
      return isNaN(num) ? null : num;
    };

    const updates: Partial<Deal> = {
      estimated_value: parseNum(estimatedValue),
      proposed_value: parseNum(proposedValue),
      final_value: parseNum(finalValue),
      probability: Math.max(0, Math.min(100, probability)),
      expected_close_date: expectedCloseDate || null,
      proposal_date: proposalDate || null,
      next_action: nextAction.trim() || null,
      next_action_at: nextActionAt ? new Date(`${nextActionAt}T12:00:00`).toISOString() : null,
    };

    try {
      const dealId = deal?.id || details.lead.id;
      await updateDealDetails(dealId, details.lead.id, updates);
      setCommercialSavedSuccess(true);
      setTimeout(() => setCommercialSavedSuccess(false), 3000);
      onLeadUpdated();
    } catch (err) {
      console.error('Falha ao salvar dados comerciais:', err);
    } finally {
      setSavingCommercial(false);
    }
  };

  // Adicionar nota interna
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !details) return;

    setAddingNote(true);
    try {
      const created = await addLeadNote(details.lead.id, newNoteContent.trim(), adminEmail);
      setDetails({
        ...details,
        notes: [created, ...details.notes],
      });
      setNewNoteContent('');
    } catch (err) {
      console.error('Falha ao adicionar nota:', err);
    } finally {
      setAddingNote(false);
    }
  };

  // WhatsApp
  const handleOpenWhatsApp = () => {
    if (!details) return;
    const goalAnswer = details.answers.find((a) => a.question_id === 'objetivo')?.answer_label;
    const problemAnswer = details.answers.find((a) => a.question_id.includes('problema'))
      ?.answer_label;

    const url = generateDashboardWhatsAppContactUrl({
      leadName: details.lead.name,
      leadWhatsapp: details.lead.whatsapp,
      recommendedSolution: details.lead.recommended_solution,
      primaryGoal: goalAnswer,
      problem: problemAnswer,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-kanit">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Drawer Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-2xl h-full bg-[#07111F] border-l border-white/10 shadow-2xl z-10 flex flex-col overflow-y-auto"
        >
          {loading || !details ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-[#94A3B8]">
              <RefreshCw className="w-6 h-6 animate-spin text-[#00D2F6] mb-2 mx-auto" />
              <p className="text-xs font-mono">Carregando dados completos...</p>
            </div>
          ) : (
            <>
              {/* Header do Drawer */}
              <div className="sticky top-0 bg-[#0A1624]/95 backdrop-blur-md border-b border-white/10 p-5 sm:p-6 flex items-center justify-between gap-4 z-20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        details.lead.score_category === 'ALTA PRIORIDADE'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : details.lead.score_category === 'POTENCIAL'
                          ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30'
                          : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                      }`}
                    >
                      {details.lead.score_category} • {details.lead.score} PTS
                    </span>

                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      {new Date(details.lead.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <h2 className="font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                    {details.lead.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Selector + WhatsApp Trigger */}
              <div className="px-5 sm:px-6 py-3.5 bg-[#091524] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">Estágio:</span>
                  <select
                    value={details.lead.status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00D2F6] cursor-pointer"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st} className="bg-[#091524]">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>ABRIR WHATSAPP</span>
                </button>
              </div>

              {/* Abas de Navegação do Drawer */}
              <div className="px-5 sm:px-6 pt-3 border-b border-white/10 flex items-center gap-4 bg-[#07111F]">
                <button
                  type="button"
                  onClick={() => setActiveTab('comercial')}
                  className={`pb-2.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                    activeTab === 'comercial'
                      ? 'border-[#00D2F6] text-[#00D2F6]'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Ficha Comercial</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('dossie')}
                  className={`pb-2.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                    activeTab === 'dossie'
                      ? 'border-[#00D2F6] text-[#00D2F6]'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Dossiê Técnico ({details.answers.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('notas')}
                  className={`pb-2.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                    activeTab === 'notas'
                      ? 'border-[#00D2F6] text-[#00D2F6]'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Notas & Histórico ({details.notes.length})</span>
                </button>
              </div>

              {/* Corpo do Drawer */}
              <div className="p-5 sm:p-6 space-y-6 flex-1">
                {/* ========================================================================= */}
                {/* ABA: FICHA COMERCIAL                                                      */}
                {/* ========================================================================= */}
                {activeTab === 'comercial' && (
                  <form onSubmit={handleSaveCommercial} className="space-y-6">
                    {/* Resumo Rápido */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">
                          Lead Score
                        </span>
                        <span className="text-lg font-bold text-white font-mono">
                          {details.lead.score} pts
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">
                          Classificação
                        </span>
                        <span className="text-xs font-bold text-[#00D2F6] font-mono truncate block">
                          {details.lead.score_category}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">
                          Pipeline Stage
                        </span>
                        <span className="text-xs font-bold text-white font-mono">
                          {details.lead.status}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">
                          Probabilidade
                        </span>
                        <span className="text-lg font-bold text-emerald-400 font-mono">
                          {probability}%
                        </span>
                      </div>
                    </div>

                    {/* Valores Comerciais (Editáveis) */}
                    <div className="p-4 rounded-2xl bg-[#091524] border border-white/10 space-y-4">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D2F6] flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Valores Comerciais (BRL)</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Valor Estimado (R$)
                          </label>
                          <input
                            type="text"
                            value={estimatedValue}
                            onChange={(e) => setEstimatedValue(e.target.value)}
                            placeholder="Ex: 8000"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00D2F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Valor Proposta (R$)
                          </label>
                          <input
                            type="text"
                            value={proposedValue}
                            onChange={(e) => setProposedValue(e.target.value)}
                            placeholder="Ex: 12500"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00D2F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Valor Fechado (R$)
                          </label>
                          <input
                            type="text"
                            value={finalValue}
                            onChange={(e) => setFinalValue(e.target.value)}
                            placeholder="Ex: 12000"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-400 font-bold"
                          />
                        </div>
                      </div>

                      {/* Probabilidade */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="text-slate-400">Probabilidade de Fechamento:</span>
                          <span className="text-[#00D2F6] font-bold">{probability}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={probability}
                          onChange={(e) => setProbability(parseInt(e.target.value, 10))}
                          className="w-full accent-[#00D2F6] cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Próxima Ação & Prazos */}
                    <div className="p-4 rounded-2xl bg-[#091524] border border-white/10 space-y-4">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Próxima Ação & Prazos</span>
                      </h4>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Próxima Ação
                        </label>
                        <input
                          type="text"
                          value={nextAction}
                          onChange={(e) => setNextAction(e.target.value)}
                          placeholder="Ex: Chamar no WhatsApp para confirmar reunião..."
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#00D2F6]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Data Follow-up
                          </label>
                          <input
                            type="date"
                            value={nextActionAt}
                            onChange={(e) => setNextActionAt(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#00D2F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Data da Proposta
                          </label>
                          <input
                            type="date"
                            value={proposalDate}
                            onChange={(e) => setProposalDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#00D2F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Previsão Fechamento
                          </label>
                          <input
                            type="date"
                            value={expectedCloseDate}
                            onChange={(e) => setExpectedCloseDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#00D2F6]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Origem e Dados de Rastreio (UTMs) */}
                    <div className="p-4 rounded-2xl bg-[#091524] border border-white/10 space-y-3">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>Origem & Atribuição de Tráfego</span>
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Origem:</span>
                          <span className="text-white font-semibold">
                            {details.lead.origin || 'Direto / Orgânico'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">UTM Source:</span>
                          <span className="text-slate-300">
                            {details.lead.utm_source || 'Direto'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">UTM Medium:</span>
                          <span className="text-slate-300">
                            {details.lead.utm_medium || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">UTM Campaign:</span>
                          <span className="text-slate-300">
                            {details.lead.utm_campaign || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Dispositivo:</span>
                          <span className="text-slate-300">
                            {details.lead.device || 'Não identificado'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botão de Salvar Ficha Comercial */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      {commercialSavedSuccess && (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Dados comerciais salvos com sucesso!</span>
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={savingCommercial}
                        className="px-5 py-2.5 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,210,246,0.3)] transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingCommercial ? 'Salvando...' : 'Salvar Ficha Comercial'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ========================================================================= */}
                {/* ABA: DOSSIÊ TÉCNICO (Perguntas & Respostas do Diagnóstico)                */}
                {/* ========================================================================= */}
                {activeTab === 'dossie' && (
                  <div className="space-y-6">
                    {/* Recomendação Direcionada */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00D2F6]/10 to-[#015EEF]/10 border border-[#00D2F6]/30">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2F6] font-bold">
                        DIRECIONAMENTO TÉCNICO RECOMENDADO
                      </span>
                      <h3 className="font-kanit font-black text-xl text-white uppercase mt-0.5">
                        {details.lead.recommended_solution}
                      </h3>
                      {details.lead.solution_reason && (
                        <p className="text-xs text-slate-300 font-light mt-2 leading-relaxed">
                          {details.lead.solution_reason}
                        </p>
                      )}
                    </div>

                    {/* Respostas Etapa a Etapa */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                        Respostas do Diagnóstico (Etapas 1 a 7)
                      </h4>
                      <div className="divide-y divide-white/10 rounded-2xl bg-[#091524] border border-white/10 overflow-hidden">
                        {details.answers.map((ans) => (
                          <div key={ans.id} className="p-3.5 hover:bg-white/[0.02] transition-colors">
                            <span className="text-[10px] font-mono text-[#00D2F6] font-bold">
                              ETAPA {ans.step_number} • {ans.question_title}
                            </span>
                            <p className="text-sm font-semibold text-white mt-0.5">
                              {ans.answer_label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* ABA: NOTAS & HISTÓRICO                                                    */}
                {/* ========================================================================= */}
                {activeTab === 'notas' && (
                  <div className="space-y-6">
                    {/* Adicionar Nota */}
                    <form onSubmit={handleAddNote} className="space-y-2">
                      <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                        Adicionar Anotação Interna
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Ex: Alinhamos que o cliente enviará os requisitos até sexta..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#00D2F6] resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={addingNote}
                          className="px-4 py-2 rounded-xl bg-[#00D2F6]/20 hover:bg-[#00D2F6]/30 text-[#00D2F6] border border-[#00D2F6]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{addingNote ? 'Salvando...' : 'Salvar Nota'}</span>
                        </button>
                      </div>
                    </form>

                    {/* Lista de Notas */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                        Notas Anteriores ({details.notes.length})
                      </h4>
                      {details.notes.length === 0 ? (
                        <p className="text-xs font-mono text-slate-500 py-4 text-center">
                          Nenhuma anotação registrada ainda.
                        </p>
                      ) : (
                        details.notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-3.5 rounded-xl bg-[#091524] border border-white/10"
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                              <span>{note.author_email}</span>
                              <span>{new Date(note.created_at).toLocaleString('pt-BR')}</span>
                            </div>
                            <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                              {note.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Linha do Tempo de Status */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                        Histórico de Mudança de Status
                      </h4>
                      <div className="space-y-2">
                        {details.history.map((hist) => (
                          <div
                            key={hist.id}
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono"
                          >
                            <div>
                              <span className="text-slate-400">
                                {hist.old_status ? `${hist.old_status} → ` : ''}
                              </span>
                              <span className="text-[#00D2F6] font-bold">{hist.new_status}</span>
                              <span className="text-slate-500 text-[10px] block">
                                Por: {hist.changed_by}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {new Date(hist.created_at).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
