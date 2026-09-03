import React, { useState } from 'react';
import {
  MessageCircle,
  Building,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  DollarSign,
  Percent,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Calendar,
} from 'lucide-react';
import {
  Deal,
  Lead,
  PipelineStage,
  updateDealStage,
} from '../../../lib/supabase';
import { generateDashboardWhatsAppContactUrl } from '../../../services/diagnostic/scoreCalculator';

interface PipelineKanbanViewProps {
  deals: Deal[];
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
  onRefresh: () => void;
  adminEmail: string;
}

const PIPELINE_COLUMNS: Array<{
  id: PipelineStage;
  title: string;
  badgeColor: string;
  defaultProb: number;
}> = [
  { id: 'NOVO', title: 'NOVO', badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10', defaultProb: 10 },
  { id: 'QUALIFICADO', title: 'QUALIFICADO', badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10', defaultProb: 20 },
  { id: 'CONTATADO', title: 'CONTATADO', badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10', defaultProb: 30 },
  { id: 'REUNIÃO', title: 'REUNIÃO', badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10', defaultProb: 50 },
  { id: 'PROPOSTA', title: 'PROPOSTA', badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10', defaultProb: 65 },
  { id: 'NEGOCIAÇÃO', title: 'NEGOCIAÇÃO', badgeColor: 'border-pink-500/40 text-pink-400 bg-pink-500/10', defaultProb: 80 },
  { id: 'FECHADO', title: 'FECHADO', badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10', defaultProb: 100 },
  { id: 'PERDIDO', title: 'PERDIDO', badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10', defaultProb: 0 },
];

const LOST_REASONS = [
  'Preço',
  'Sem orçamento',
  'Sem prioridade',
  'Decidiu não executar',
  'Escolheu outro fornecedor',
  'Não respondeu',
  'Projeto adiado',
  'Fora do escopo',
  'Outro',
];

export const PipelineKanbanView: React.FC<PipelineKanbanViewProps> = ({
  deals,
  leads,
  onSelectLead,
  onRefresh,
  adminEmail,
}) => {
  const [movingDealId, setMovingDealId] = useState<string | null>(null);
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<PipelineStage | null>(null);

  // Modais de Fechamento e Perda
  const [pendingDeal, setPendingDeal] = useState<{ deal: Deal; targetStage: PipelineStage } | null>(null);
  const [modalType, setModalType] = useState<'closed' | 'lost' | null>(null);
  const [finalValueInput, setFinalValueInput] = useState('');
  const [lostReasonInput, setLostReasonInput] = useState('Preço');
  const [lostObsInput, setLostObsInput] = useState('');

  // Mobile column active tab
  const [mobileActiveStage, setMobileActiveStage] = useState<PipelineStage>('NOVO');

  const handleStageChange = async (
    deal: Deal,
    targetStage: PipelineStage,
    extra?: { finalValue?: number; lostReason?: string; lostObservation?: string }
  ) => {
    // Se for mover para FECHADO e não tiver valor definido, abre modal
    if (targetStage === 'FECHADO' && !extra?.finalValue) {
      setPendingDeal({ deal, targetStage });
      setFinalValueInput(
        deal.final_value?.toString() ||
          deal.proposed_value?.toString() ||
          deal.estimated_value?.toString() ||
          ''
      );
      setModalType('closed');
      return;
    }

    // Se for mover para PERDIDO e não tiver motivo, abre modal
    if (targetStage === 'PERDIDO' && !extra?.lostReason) {
      setPendingDeal({ deal, targetStage });
      setLostReasonInput('Preço');
      setLostObsInput('');
      setModalType('lost');
      return;
    }

    setMovingDealId(deal.id);
    try {
      await updateDealStage({
        dealId: deal.id,
        leadId: deal.lead_id,
        newStage: targetStage,
        finalValue: extra?.finalValue,
        lostReason: extra?.lostReason,
        lostObservation: extra?.lostObservation,
        changedBy: adminEmail,
      });
      onRefresh();
    } catch (err) {
      console.error('Erro ao atualizar estágio do deal:', err);
    } finally {
      setMovingDealId(null);
      setPendingDeal(null);
      setModalType(null);
    }
  };

  const confirmClosedDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingDeal) return;
    const cleanNum = parseFloat(finalValueInput.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    await handleStageChange(pendingDeal.deal, 'FECHADO', { finalValue: cleanNum });
  };

  const confirmLostDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingDeal) return;
    await handleStageChange(pendingDeal.deal, 'PERDIDO', {
      lostReason: lostReasonInput,
      lostObservation: lostObsInput,
    });
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    setDragOverColumn(stage);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (!dealId) return;

    const deal = deals.find((d) => d.id === dealId);
    if (deal && deal.pipeline_stage !== targetStage) {
      await handleStageChange(deal, targetStage);
    }
    setDraggedDealId(null);
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

  // Totais de Pipeline Geral
  const totalPipelineBruto = deals
    .filter((d) => d.pipeline_stage !== 'FECHADO' && d.pipeline_stage !== 'PERDIDO')
    .reduce((acc, d) => acc + (d.proposed_value || d.estimated_value || 0), 0);

  const totalPipelinePonderado = deals
    .filter((d) => d.pipeline_stage !== 'FECHADO' && d.pipeline_stage !== 'PERDIDO')
    .reduce(
      (acc, d) => acc + ((d.proposed_value || d.estimated_value || 0) * (d.probability || 0)) / 100,
      0
    );

  return (
    <div className="space-y-4 font-kanit">
      {/* Header do Pipeline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-black text-2xl text-white uppercase tracking-tight">
            PIPELINE COMERCIAL (8 ETAPAS)
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono">
            Gerencie o ciclo de vendas completo: arraste os cards ou use os botões de ação
          </p>
        </div>

        {/* Resumo de Pipeline Aberto */}
        <div className="flex items-center gap-3 bg-[#0A1624] border border-white/10 rounded-2xl px-4 py-2">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Pipeline Bruto
            </span>
            <span className="text-sm font-mono font-bold text-white">
              {totalPipelineBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="h-7 w-px bg-white/10" />
          <div>
            <span className="text-[10px] font-mono text-[#00D2F6] uppercase tracking-wider block">
              Ponderado
            </span>
            <span className="text-sm font-mono font-bold text-[#00D2F6]">
              {totalPipelinePonderado.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Seletor Rápido de Coluna no Mobile */}
      <div className="sm:hidden flex items-center gap-2 overflow-x-auto pb-1">
        {PIPELINE_COLUMNS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setMobileActiveStage(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 transition-all ${
              mobileActiveStage === c.id
                ? 'bg-[#00D2F6] text-[#07111F] font-black shadow-md'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            {c.title} ({deals.filter((d) => d.pipeline_stage === c.id).length})
          </button>
        ))}
      </div>

      {/* Grid de Colunas Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-6 pt-1 min-h-[600px] snap-x">
        {PIPELINE_COLUMNS.map((column, colIdx) => {
          const columnDeals = deals.filter((d) => d.pipeline_stage === column.id);

          const colValue = columnDeals.reduce(
            (acc, d) => acc + (d.final_value || d.proposed_value || d.estimated_value || 0),
            0
          );
          const colWeighted = columnDeals.reduce(
            (acc, d) =>
              acc +
              ((d.final_value || d.proposed_value || d.estimated_value || 0) * (d.probability || 0)) /
                100,
            0
          );

          const isOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`w-[290px] sm:w-[310px] shrink-0 bg-[#091524] border rounded-2xl p-3.5 flex flex-col snap-start shadow-sm transition-all ${
                isOver
                  ? 'border-[#00D2F6] bg-[#00D2F6]/[0.04] ring-2 ring-[#00D2F6]/30'
                  : 'border-white/[0.08]'
              }`}
            >
              {/* Header da Coluna */}
              <div className="pb-3 border-b border-white/[0.06] mb-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${column.badgeColor}`}
                  >
                    {column.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {columnDeals.length}
                  </span>
                </div>

                {/* Subtotais da Coluna */}
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>
                    Total:{' '}
                    <strong className="text-white">
                      {colValue > 0
                        ? colValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : 'R$ 0,00'}
                    </strong>
                  </span>
                  {column.id !== 'FECHADO' && column.id !== 'PERDIDO' && colWeighted > 0 && (
                    <span className="text-[#00D2F6]">
                      Pond:{' '}
                      {colWeighted.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[620px] pr-1">
                {columnDeals.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono border-2 border-dashed border-white/[0.04] rounded-xl">
                    Nenhum negócio em {column.title}
                  </div>
                ) : (
                  columnDeals.map((deal) => {
                    const lead = deal.lead || leads.find((l) => l.id === deal.lead_id);
                    const isHighPriority = lead?.score_category === 'ALTA PRIORIDADE';
                    const activeVal =
                      deal.final_value || deal.proposed_value || deal.estimated_value;

                    return (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        onClick={() => onSelectLead(deal.lead_id)}
                        className={`group p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border transition-all cursor-pointer relative ${
                          isHighPriority
                            ? 'border-[#00D2F6]/30 shadow-[0_0_15px_rgba(0,210,246,0.06)]'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Indicador de carregamento */}
                        {movingDealId === deal.id && (
                          <div className="absolute inset-0 bg-[#07111F]/80 backdrop-blur-xs rounded-xl flex items-center justify-center z-10">
                            <RefreshCw className="w-4 h-4 text-[#00D2F6] animate-spin" />
                          </div>
                        )}

                        {/* Topo do Card: Lead / Empresa */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-white truncate group-hover:text-[#00D2F6] transition-colors">
                              {lead?.name || 'Lead Sem Nome'}
                            </h4>
                            {lead?.company && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono truncate">
                                <Building className="w-3 h-3 text-slate-500 shrink-0" />
                                <span>{lead.company}</span>
                              </div>
                            )}
                          </div>

                          {/* Badge de Score do Lead */}
                          {lead && (
                            <span
                              className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                isHighPriority
                                  ? 'bg-[#00D2F6]/10 border-[#00D2F6]/40 text-[#00D2F6]'
                                  : 'bg-white/[0.05] border-white/10 text-slate-300'
                              }`}
                            >
                              {lead.score} pts
                            </span>
                          )}
                        </div>

                        {/* Título do Projeto / Solução */}
                        <div className="mb-2.5">
                          <span className="text-[11px] font-mono text-[#00D2F6] bg-[#00D2F6]/10 px-2 py-0.5 rounded border border-[#00D2F6]/20 inline-block truncate max-w-full">
                            {lead?.recommended_solution || 'Projeto TCA'}
                          </span>
                        </div>

                        {/* Métricas do Deal: Valor & Probabilidade */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs font-mono">
                          <div className="flex items-center gap-1 text-slate-300 font-semibold">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span>
                              {activeVal
                                ? activeVal.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })
                                : 'Valor a definir'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-slate-400">
                            <Percent className="w-3 h-3 text-cyan-400" />
                            <span>{deal.probability}%</span>
                          </div>
                        </div>

                        {/* Próxima Ação de Follow-up se houver */}
                        {deal.next_action && (
                          <div className="mt-2 text-[10px] font-mono text-amber-300/90 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 flex items-center gap-1.5 truncate">
                            <Clock className="w-3 h-3 shrink-0 text-amber-400" />
                            <span className="truncate">{deal.next_action}</span>
                          </div>
                        )}

                        {/* Ações Rápidas do Card: WhatsApp & Botões de Estágio */}
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.06]">
                          {lead && (
                            <button
                              type="button"
                              onClick={(e) => handleDirectWhatsApp(e, lead)}
                              className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1 transition-colors"
                              title="Abrir WhatsApp com mensagem"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                          )}

                          {/* Botões Acessíveis de Navegação de Estágio */}
                          <div className="flex items-center gap-1 ml-auto">
                            {colIdx > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStageChange(deal, PIPELINE_COLUMNS[colIdx - 1].id);
                                }}
                                className="p-1 rounded bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                title={`Voltar para ${PIPELINE_COLUMNS[colIdx - 1].title}`}
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {colIdx < PIPELINE_COLUMNS.length - 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStageChange(deal, PIPELINE_COLUMNS[colIdx + 1].id);
                                }}
                                className="p-1 rounded bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                title={`Avançar para ${PIPELINE_COLUMNS[colIdx + 1].title}`}
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: FECHAR NEGÓCIO (REGISTRO DE VALOR FINAL)                            */}
      {/* ========================================================================= */}
      {modalType === 'closed' && pendingDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1522] border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative font-kanit">
            <button
              type="button"
              onClick={() => {
                setModalType(null);
                setPendingDeal(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-emerald-400 mb-4">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-lg font-black uppercase">Fechar Negócio</h3>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Parabéns! Informe o valor final acordado para registrar a receita no histórico e
              concluir esta oportunidade:
            </p>

            <form onSubmit={confirmClosedDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Valor Fechado (R$) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={finalValueInput}
                  onChange={(e) => setFinalValueInput(e.target.value)}
                  placeholder="Ex: 12000"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-400 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalType(null);
                    setPendingDeal(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  Confirmar Fechamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MOTIVO DA PERDA                                                     */}
      {/* ========================================================================= */}
      {modalType === 'lost' && pendingDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1522] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative font-kanit">
            <button
              type="button"
              onClick={() => {
                setModalType(null);
                setPendingDeal(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-rose-400 mb-4">
              <XCircle className="w-6 h-6" />
              <h3 className="text-lg font-black uppercase">Marcar como Perdido</h3>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              O lead não será apagado. Registre o motivo da perda para calibrar as métricas de
              conversão:
            </p>

            <form onSubmit={confirmLostDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Motivo da Perda <span className="text-rose-400">*</span>
                </label>
                <select
                  value={lostReasonInput}
                  onChange={(e) => setLostReasonInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091524] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-rose-400"
                >
                  {LOST_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Observações adicionais (opcional)
                </label>
                <textarea
                  rows={3}
                  value={lostObsInput}
                  onChange={(e) => setLostObsInput(e.target.value)}
                  placeholder="Ex: Cliente adiou para o próximo trimestre..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalType(null);
                    setPendingDeal(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                >
                  Confirmar Perda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
