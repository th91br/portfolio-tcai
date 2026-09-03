import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Lead,
  LeadAnswer,
  LeadScoreDetail,
  LeadNote,
  Deal,
  LeadStatusHistory,
  fetchLeadInsights,
  saveLeadInsight,
  updateInsightFeedback,
  updateDealDetails,
} from '../../../lib/supabase';
import {
  CopilotAnalysisOutput,
  LeadInsightRecord,
} from '../../../services/copilot/copilotTypes';
import {
  generateSnapshotHash,
  synthesizeSalesCopilotInsight,
} from '../../../services/copilot/salesCopilotEngine';

interface SalesCopilotSectionProps {
  lead: Lead;
  answers: LeadAnswer[];
  deal: Deal | null;
  score: LeadScoreDetail | null;
  notes: LeadNote[];
  history: LeadStatusHistory[];
  onLeadUpdated: () => void;
  adminEmail: string;
}

export const SalesCopilotSection: React.FC<SalesCopilotSectionProps> = ({
  lead,
  answers,
  deal,
  score,
  notes,
  history,
  onLeadUpdated,
  adminEmail,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CopilotAnalysisOutput | null>(null);
  const [activeInsightId, setActiveInsightId] = useState<string | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [usedAsNextAction, setUsedAsNextAction] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState<'useful' | 'not_useful' | null>(null);
  const [meetingMode, setMeetingMode] = useState(false);
  const [isSnapshotStale, setIsSnapshotStale] = useState(false);

  // Calcula o hash atual do lead para validar se o cache está atualizado
  const currentHash = generateSnapshotHash({ lead, answers, deal, notes });

  // Carrega insights salvos ao abrir o lead
  useEffect(() => {
    let isMounted = true;
    fetchLeadInsights(lead.id).then((savedInsights) => {
      if (!isMounted) return;
      if (savedInsights && savedInsights.length > 0) {
        const latest = savedInsights[0] as LeadInsightRecord;
        setAnalysis(latest.structured_output);
        setActiveInsightId(latest.id);
        if (latest.helpful_feedback !== null) {
          setFeedbackSaved(latest.helpful_feedback ? 'useful' : 'not_useful');
        }
        setIsSnapshotStale(latest.source_snapshot_hash !== currentHash);
      } else {
        setAnalysis(null);
        setActiveInsightId(null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [lead.id, currentHash]);

  // Executa ou Regenera a Análise
  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      // Simulação / Chamada do Motor de Síntese
      const output = synthesizeSalesCopilotInsight({
        lead,
        answers,
        deal,
        score,
        notes,
        history,
      });

      setAnalysis(output);
      setIsSnapshotStale(false);
      setFeedbackSaved(null);
      setUsedAsNextAction(false);

      // Persiste no banco Supabase
      const saved = await saveLeadInsight({
        leadId: lead.id,
        dealId: deal?.id,
        structuredOutput: output,
        model: output.model,
        promptVersion: output.promptVersion,
        sourceSnapshotHash: output.sourceSnapshotHash,
      });

      if (saved?.id) {
        setActiveInsightId(saved.id);
      }
    } catch (err) {
      console.error('Falha ao gerar análise do Sales Copilot:', err);
    } finally {
      setLoading(false);
    }
  };

  // Copiar Mensagem de WhatsApp
  const handleCopyWhatsApp = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.whatsappMessage);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  // Abrir WhatsApp com a mensagem do Copiloto
  const handleOpenWhatsAppCopilot = () => {
    if (!analysis) return;
    const cleanPhone = lead.whatsapp.replace(/\D/g, '');
    const phoneFormatted = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const url = `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(analysis.whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Usar como Próxima Ação no CRM (com confirmação explícita do usuário)
  const handleUseAsNextAction = async () => {
    if (!analysis) return;
    setUsedAsNextAction(true);
    try {
      const dealId = deal?.id || lead.id;
      await updateDealDetails(dealId, lead.id, {
        next_action: analysis.recommendedNextAction,
        next_action_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      });
      onLeadUpdated();
      setTimeout(() => setUsedAsNextAction(false), 3000);
    } catch (err) {
      console.error('Erro ao atualizar próxima ação:', err);
    }
  };

  // Registrar Feedback
  const handleFeedback = async (helpful: boolean) => {
    setFeedbackSaved(helpful ? 'useful' : 'not_useful');
    if (activeInsightId) {
      await updateInsightFeedback(activeInsightId, helpful);
    }
  };

  return (
    <div className="space-y-6 font-kanit">
      {/* Topo do Copiloto */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00D2F6]/10 via-[#015EEF]/10 to-transparent border border-[#00D2F6]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-[#00D2F6]/20 text-[#00D2F6]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-black text-lg text-white uppercase tracking-wide">
              TCA SALES COPILOT
            </h3>
            {analysis && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSnapshotStale
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30'
                }`}
              >
                {isSnapshotStale ? 'DADOS ATUALIZADOS' : 'INTELIGÊNCIA PRONTA'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 font-light max-w-xl">
            Síntese comercial contextualizada a partir das respostas reais do Diagnóstico,
            Lead Score e estágio no pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {analysis && (
            <button
              type="button"
              onClick={() => setMeetingMode(!meetingMode)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                meetingMode
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-white/[0.05] hover:bg-white/10 text-amber-400 border border-amber-500/30'
              }`}
              title="Alternar modo briefing rápido para reunião"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{meetingMode ? 'Ver Tudo' : 'Briefing Reunião'}</span>
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleRunAnalysis}
            className="px-4 py-2 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,210,246,0.3)] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analisando...' : analysis ? 'Regerar Análise' : 'Gerar Inteligência'}</span>
          </button>
        </div>
      </div>

      {/* Disclaimer de Limitação e Separação Fatos vs Inferências */}
      <div className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <ShieldAlert className="w-3.5 h-3.5 text-[#00D2F6] shrink-0" />
        <span>
          <strong className="text-slate-300">Human-in-the-Loop:</strong> As análises e objeções são
          hipóteses comerciais para apoiar Thiago. A decisão final é 100% sua.
        </span>
      </div>

      {/* Estado: Sem Análise */}
      {!analysis && !loading && (
        <div className="py-16 px-4 text-center rounded-2xl bg-[#091524] border-2 border-dashed border-white/10 space-y-3">
          <Sparkles className="w-8 h-8 text-[#00D2F6] mx-auto opacity-60" />
          <h4 className="text-sm font-bold text-white uppercase">Nenhuma análise gerada ainda</h4>
          <p className="text-xs text-slate-400 font-light max-w-md mx-auto">
            Clique em "Gerar Inteligência" para sintetizar o resumo executivo, oportunidades,
            perguntas estratégicas e abordagem personalizada para {lead.name}.
          </p>
          <button
            type="button"
            onClick={handleRunAnalysis}
            className="px-5 py-2.5 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] font-black text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerar Inteligência Comercial</span>
          </button>
        </div>
      )}

      {/* Estado: Carregando */}
      {loading && (
        <div className="py-16 text-center rounded-2xl bg-[#091524] border border-white/10 space-y-3">
          <RefreshCw className="w-8 h-8 text-[#00D2F6] animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-white uppercase">Analisando dados do lead...</h4>
          <p className="text-xs text-slate-400 font-mono">
            Processando 7 respostas do diagnóstico, Lead Score determinístico e estágio comercial...
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONTEÚDO DA ANÁLISE GERADA                                                */}
      {/* ========================================================================= */}
      {analysis && !loading && (
        <div className="space-y-6">
          {/* MODO BRIEFING RÁPIDO DE REUNIÃO (Se Ativado) */}
          {meetingMode ? (
            <div className="p-5 rounded-2xl bg-[#091524] border border-amber-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-amber-400">
                  <Calendar className="w-5 h-5" />
                  <h4 className="font-bold text-base uppercase">
                    Briefing de Reunião (Leitura em 60s)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {lead.name} • {analysis.meetingPrep.goal}
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Contexto:</span>
                  <p className="text-white font-medium">{analysis.meetingPrep.context}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold mb-1">
                      Pontos para Validar:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {analysis.meetingPrep.pointsToValidate.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-rose-400 uppercase block font-bold mb-1">
                      Objeções para Ficar Atento:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {analysis.meetingPrep.possibleObjections.map((o, idx) => (
                        <li key={idx}>{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#00D2F6]/[0.04] border border-[#00D2F6]/20">
                  <span className="text-[10px] font-mono text-[#00D2F6] uppercase block font-bold mb-1">
                    Meta Principal da Reunião:
                  </span>
                  <p className="text-[#00D2F6] font-bold">{analysis.meetingPrep.desiredOutcome}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* BLOCO 1: RESUMO EXECUTIVO DO LEAD */}
              <div className="p-5 rounded-2xl bg-[#091524] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h4 className="font-bold text-sm uppercase text-white tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00D2F6]" />
                    <span>Resumo Executivo do Lead</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Fatos do CRM + Síntese
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                      Quem é
                    </span>
                    <p className="text-white font-medium">{analysis.summary.whoIs}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                      Problema Principal
                    </span>
                    <p className="text-white font-medium">{analysis.summary.mainProblem}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                      Objetivo Declarado
                    </span>
                    <p className="text-white font-medium">{analysis.summary.primaryGoal}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                      Urgência / Prazo
                    </span>
                    <p className="text-[#00D2F6] font-medium">{analysis.summary.urgencyLevel}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                      Poder de Decisão
                    </span>
                    <p className="text-white font-medium">{analysis.summary.decisionCapacity}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                      Solução Recomendada
                    </span>
                    <p className="text-emerald-400 font-bold">{analysis.summary.recommendedSolution}</p>
                  </div>
                </div>
              </div>

              {/* BLOCO 2: OPORTUNIDADE IDENTIFICADA */}
              <div className="p-5 rounded-2xl bg-[#091524] border border-white/10 space-y-3">
                <h4 className="font-bold text-sm uppercase text-white tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Oportunidade & Encaixe TCA</span>
                </h4>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs leading-relaxed">
                  <p className="text-slate-200">
                    <strong className="text-white">Dor mais relevante:</strong>{' '}
                    {analysis.opportunity.relevantProblem}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-white">Oportunidade Comercial:</strong>{' '}
                    {analysis.opportunity.opportunityArea}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-[#00D2F6]">Como a TCA resolve:</strong>{' '}
                    {analysis.opportunity.howTcaHelps}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-emerald-400">Benefício de Negócio Esperado:</strong>{' '}
                    {analysis.opportunity.expectedBusinessBenefit}
                  </p>
                </div>
              </div>

              {/* BLOCO 3: COMO ABORDAR ESTE LEAD */}
              <div className="p-5 rounded-2xl bg-[#091524] border border-white/10 space-y-4">
                <h4 className="font-bold text-sm uppercase text-white tracking-wider flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00D2F6]" />
                  <span>Estratégia de Abordagem Personalizada</span>
                </h4>

                <div className="p-3.5 rounded-xl bg-[#00D2F6]/[0.03] border border-[#00D2F6]/20 text-xs">
                  <span className="text-[10px] font-mono text-[#00D2F6] uppercase font-bold block mb-1">
                    Melhor Ângulo de Conversa:
                  </span>
                  <p className="text-white font-medium leading-relaxed">{analysis.approach.bestAngle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                      Como Demonstrar Valor:
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-300">
                      {analysis.approach.howToDemonstrateValue.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">
                      O Que Evitar:
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-300">
                      {analysis.approach.whatToAvoid.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* BLOCO 4: PERGUNTAS RECOMENDADAS PARA REUNIÃO */}
              <div className="p-5 rounded-2xl bg-[#091524] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="font-bold text-sm uppercase text-white tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    <span>Perguntas Estratégicas para a Reunião</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {analysis.questions.length} perguntas formuladas
                  </span>
                </div>

                <div className="space-y-2.5">
                  {analysis.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">
                          #{idx + 1} • Foco: {q.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 italic">
                          Objetivo: {q.purpose}
                        </span>
                      </div>
                      <p className="text-white font-medium leading-relaxed">"{q.question}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* BLOCO 5: POSSÍVEIS OBJEÇÕES (HIPÓTESES) */}
              <div className="p-5 rounded-2xl bg-[#091524] border border-white/10 space-y-4">
                <h4 className="font-bold text-sm uppercase text-white tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Possíveis Objeções (Hipóteses a Validar)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {analysis.possibleObjections.map((obj, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-rose-500/20 space-y-2"
                    >
                      <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">
                        {obj.hypothesis}
                      </span>
                      <p className="text-slate-400 text-[11px] leading-relaxed italic">
                        Evidência: {obj.evidence}
                      </p>
                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase block font-bold mb-0.5">
                          Como Validar / Contornar:
                        </span>
                        <p className="text-slate-200 text-[11px]">{obj.howToValidateAndOvercome}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BLOCO 6: MENSAGEM SUGERIDA PARA WHATSAPP */}
              <div className="p-5 rounded-2xl bg-[#091524] border border-emerald-500/30 space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.04)]">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm uppercase text-white tracking-wider flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Mensagem Sugerida para WhatsApp</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyWhatsApp}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWhatsApp ? 'Copiado!' : 'Copiar Texto'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenWhatsAppCopilot}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Abrir WhatsApp</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {analysis.whatsappMessage}
                </div>
              </div>

              {/* BLOCO 7: PRÓXIMO PASSO RECOMENDADO */}
              <div className="p-5 rounded-2xl bg-[#091524] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#00D2F6] uppercase tracking-wider font-bold block">
                    Ação Recomendada pelo Copiloto:
                  </span>
                  <p className="text-sm font-bold text-white">{analysis.recommendedNextAction}</p>
                </div>

                <button
                  type="button"
                  disabled={usedAsNextAction}
                  onClick={handleUseAsNextAction}
                  className="px-4 py-2 rounded-xl bg-[#00D2F6]/20 hover:bg-[#00D2F6]/30 text-[#00D2F6] border border-[#00D2F6]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{usedAsNextAction ? 'Próxima Ação Salva!' : 'Usar como Próxima Ação'}</span>
                </button>
              </div>

              {/* BLOCO CONDICIONAL: ESTRATÉGIA DE PROPOSTA */}
              {analysis.proposalStrategy && (
                <div className="p-5 rounded-2xl bg-[#091524] border border-purple-500/30 space-y-3">
                  <h4 className="font-bold text-sm uppercase text-purple-400 tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Estratégia de Proposta Comercial</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                        Escopo Prioritário Sugerido:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {analysis.proposalStrategy.priorityScope.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                        Argumentos de Alto Valor:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {analysis.proposalStrategy.valueArguments.map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCO CONDICIONAL: ANÁLISE DE PERDA */}
              {analysis.lossAnalysis && (
                <div className="p-5 rounded-2xl bg-[#091524] border border-rose-500/30 space-y-3">
                  <h4 className="font-bold text-sm uppercase text-rose-400 tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Análise de Oportunidade Perdida</span>
                  </h4>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-2 text-slate-300">
                    <p>
                      <strong className="text-white">Causa Provável:</strong>{' '}
                      {analysis.lossAnalysis.probableMainCause}
                    </p>
                    <p>
                      <strong className="text-white">Padrão Comercial:</strong>{' '}
                      {analysis.lossAnalysis.identifiedPattern}
                    </p>
                    <p>
                      <strong className="text-emerald-400">Recomendação Futura:</strong>{' '}
                      {analysis.lossAnalysis.futureImprovementRecommendation}
                    </p>
                  </div>
                </div>
              )}

              {/* RODAPÉ DO COPILOT: FEEDBACK E METADADOS */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span>Esta análise foi útil para você?</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleFeedback(true)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        feedbackSaved === 'useful'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-white/[0.04] border-white/10 hover:border-white/20 text-slate-400'
                      }`}
                      title="Útil"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeedback(false)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        feedbackSaved === 'not_useful'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-white/[0.04] border-white/10 hover:border-white/20 text-slate-400'
                      }`}
                      title="Não útil"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500">
                  Gerado em {new Date(analysis.generatedAt).toLocaleString('pt-BR')} • Versão: {analysis.promptVersion}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
