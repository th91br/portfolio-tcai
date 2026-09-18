import React from 'react';
import {
  BarChart3,
  Download,
  ShieldCheck,
  TrendingUp,
  Eye,
  Play,
  CheckCircle2,
  Users,
  MessageCircle,
  Share2,
  PieChart,
  DollarSign,
  Briefcase,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { Lead, LeadEvent, Deal, CommercialMetrics } from '../../../lib/supabase';
import { ROISummary } from '../../../services/metrics/roiMetricsService';

interface AnalyticsViewProps {
  leads: Lead[];
  deals: Deal[];
  events: LeadEvent[];
  metrics: CommercialMetrics;
  roiSummary: ROISummary;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  leads,
  deals,
  events,
  metrics,
  roiSummary,
}) => {
  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Métrica,Valor,Proveniência\n"
      + `Total Leads,${metrics.funilEtapas.leads},Realizado\n`
      + `Qualificados,${metrics.funilEtapas.qualificados},Realizado\n`
      + `Contatados,${metrics.funilEtapas.contatados},Realizado\n`
      + `Reuniões,${metrics.funilEtapas.reunioes},Realizado\n`
      + `Propostas,${metrics.funilEtapas.propostas},Realizado\n`
      + `Fechados,${metrics.funilEtapas.fechados},Realizado\n`
      + `Receita Atribuída,${roiSummary.revenueAttributed},Realizado\n`
      + `Economia Validada,${roiSummary.savingsValidated},Estimado\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_comercial_tcai_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Contagens do Funil do Diagnóstico
  const views = events.filter((e) => e.event_name === 'diagnostic_view').length;
  const starts = events.filter((e) => e.event_name === 'diagnostic_start').length;
  const completes = events.filter((e) => e.event_name === 'diagnostic_complete').length;
  const leadsCreated = leads.length;

  // Funil Comercial Etapa a Etapa (Fase 3)
  const funil = metrics.funilEtapas;

  const taxaQualificados = funil.leads > 0 ? Math.round((funil.qualificados / funil.leads) * 100) : 0;
  const taxaContatados = funil.qualificados > 0 ? Math.round((funil.contatados / funil.qualificados) * 100) : 0;
  const taxaReunioes = funil.contatados > 0 ? Math.round((funil.reunioes / funil.contatados) * 100) : 0;
  const taxaPropostas = funil.reunioes > 0 ? Math.round((funil.propostas / funil.reunioes) * 100) : 0;
  const taxaFechados = funil.propostas > 0 ? Math.round((funil.fechados / funil.propostas) * 100) : 0;

  // Análise por Solução: Leads, Propostas, Fechados e Receita
  const solAnalysis = leads.reduce((acc, lead) => {
    const sol = lead.recommended_solution || 'Outros';
    if (!acc[sol]) {
      acc[sol] = { leads: 0, propostas: 0, fechados: 0, receita: 0 };
    }
    acc[sol].leads++;
    if (['PROPOSTA', 'NEGOCIAÇÃO', 'FECHADO'].includes(lead.status)) {
      acc[sol].propostas++;
    }
    if (lead.status === 'FECHADO') {
      acc[sol].fechados++;
      const deal = deals.find((d) => d.lead_id === lead.id);
      acc[sol].receita += Number(deal?.final_value || deal?.proposed_value || deal?.estimated_value || 0);
    }
    return acc;
  }, {} as Record<string, { leads: number; propostas: number; fechados: number; receita: number }>);

  // Análise por Origem / UTM
  const utmAnalysis = leads.reduce((acc, lead) => {
    const originKey = lead.utm_source || lead.origin || 'Direto / Não identificado';
    if (!acc[originKey]) {
      acc[originKey] = { leads: 0, qualificados: 0, fechados: 0, receita: 0 };
    }
    acc[originKey].leads++;
    if (lead.status !== 'NOVO') acc[originKey].qualificados++;
    if (lead.status === 'FECHADO') {
      acc[originKey].fechados++;
      const deal = deals.find((d) => d.lead_id === lead.id);
      acc[originKey].receita += Number(deal?.final_value || deal?.proposed_value || 0);
    }
    return acc;
  }, {} as Record<string, { leads: number; qualificados: number; fechados: number; receita: number }>);

  const hasRegisteredCost = Object.keys(roiSummary.costByCurrency).length > 0;
  const costDisplay = roiSummary.mixedCostCurrencies || !hasRegisteredCost
    ? 'Ainda não informado'
    : roiSummary.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: roiSummary.costCurrency });
  const costCurrencyLabel = roiSummary.mixedCostCurrencies
    ? 'Múltiplas moedas'
    : hasRegisteredCost ? roiSummary.costCurrency : 'Ainda não informado';
  const completionRate = roiSummary.totalExecutions > 0
    ? Math.round((roiSummary.successfulExecutions / roiSummary.totalExecutions) * 100)
    : null;

  return (
    <div className="space-y-8 font-kanit">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-black text-2xl text-white tracking-tight">
              Analytics e funil comercial
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Selo de Proveniência: Dados Oficiais
            </span>
          </div>
          <p className="text-xs text-[#B5B8AD] font-mono mt-0.5">
            Acompanhe conversão, receita e origem dos contatos em um só lugar com rastreabilidade operacional.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportReport}
          className="px-4 py-2.5 rounded-xl bg-[#8a5a00] hover:bg-[#a66d00] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#8a5a00]/20 self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {leads.length === 0 && (
        <div className="p-8 rounded-2xl bg-[#20271F] border border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-400">
            <BarChart3 className="w-6 h-6 text-[#C08E3A]" />
          </div>
          <h4 className="font-bold text-white text-base">Aguardando primeiros atendimentos e contatos</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-light">
            Assim que sua operação receber contatos pelo WhatsApp ou formulários, os gráficos de conversão, custos e receita de contratos serão calculados automaticamente.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 0. ROI E TELEMETRIA DE IA — NÚMEROS AUDITÁVEIS                           */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#20271F] border border-amber-400/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Retorno e impacto operacional</span>
            </h3>
            <p className="text-[10px] font-mono text-slate-400 mt-1">
              Indicadores registrados a partir do uso da operação.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 border border-emerald-500/30 rounded-full px-2.5 py-1 bg-emerald-500/10">
              Proveniência: Realizado
            </span>
            <span className="text-[10px] font-mono tracking-wider text-amber-300 border border-amber-400/20 rounded-full px-3 py-1">
              {roiSummary.totalExecutions} execuções registradas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 block">Receita atribuída</span>
            <div className="text-lg font-black text-emerald-400 font-mono mt-1">
              {roiSummary.revenueAttributed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <span className="text-[9px] text-slate-500">Somente lançamentos informados</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 block">Economia validada</span>
            <div className="text-lg font-black text-amber-300 font-mono mt-1">
              {roiSummary.savingsValidated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <span className="text-[9px] text-slate-500">Com evidência operacional</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 block">Custo registrado</span>
            <div className="text-lg font-black text-amber-300 font-mono mt-1">
              {costDisplay}
            </div>
            <span className="text-[9px] text-slate-500">Moeda: {costCurrencyLabel}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 block">ROI realizado</span>
            <div className="text-lg font-black text-[#0b7285] font-mono mt-1">
              {roiSummary.realizedROI === null ? 'Ainda não informado' : `${(roiSummary.realizedROI * 100).toFixed(1)}%`}
            </div>
            <span className="text-[9px] text-slate-500">Registre custos para calcular</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 block">Qualidade do dado</span>
            <div className="text-lg font-black text-white font-mono mt-1">
              {roiSummary.realizedCount} / {roiSummary.estimatedCount} / {roiSummary.unmeasuredCount}
            </div>
            <span className="text-[9px] text-slate-500">Realizado / estimado / não mensurado</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono text-slate-400 border-t border-white/[0.06] pt-3">
          <span>Horas estimadas a partir do uso: <strong className="text-emerald-400">~{Math.round((roiSummary.totalInputTokens + roiSummary.totalOutputTokens) / 3500)}h</strong></span>
          <span>Execuções concluídas: <strong className="text-white">{roiSummary.successfulExecutions}</strong></span>
          <span>Conclusões registradas: <strong className="text-emerald-400">{completionRate === null ? 'Ainda sem dados' : `${completionRate}%`}</strong></span>
          <span>Encaminhadas para a equipe: <strong className="text-amber-300">{roiSummary.blockedExecutions}</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FUNIL COMERCIAL COMPLETO (LEADS -> FECHADOS)                           */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#20271F] border border-white/10 space-y-6">
        <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#C08E3A]" />
          <span>Funil de vendas</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {/* 1. Leads */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                1. Leads
              </span>
              <div className="text-2xl font-black text-white font-mono">{funil.leads}</div>
            </div>
            <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-[#C08E3A]">
              Base 100%
            </div>
          </div>

          {/* 2. Qualificados */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                2. Qualificados
              </span>
              <div className="text-2xl font-black text-white font-mono">{funil.qualificados}</div>
            </div>
            <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-amber-400">
              ↓ {taxaQualificados}% dos leads
            </div>
          </div>

          {/* 3. Contatados */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                3. Contatados
              </span>
              <div className="text-2xl font-black text-white font-mono">{funil.contatados}</div>
            </div>
            <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-amber-400">
              ↓ {taxaContatados}% avançaram
            </div>
          </div>

          {/* 4. Reuniões */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                4. Reuniões
              </span>
              <div className="text-2xl font-black text-white font-mono">{funil.reunioes}</div>
            </div>
            <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-orange-400">
              ↓ {taxaReunioes}% agendadas
            </div>
          </div>

          {/* 5. Propostas */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                5. Propostas
              </span>
              <div className="text-2xl font-black text-[#C08E3A] font-mono">{funil.propostas}</div>
            </div>
            <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-[#C08E3A]">
              ↓ {taxaPropostas}% propostas
            </div>
          </div>

          {/* 6. Fechados */}
          <div className="p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/30 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.06)]">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 block mb-1 font-bold">
                6. Fechados
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono">{funil.fechados}</div>
            </div>
            <div className="pt-2 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold">
              ★ {taxaFechados}% fechamento
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TABELA DE RECEITA E CONVERSÃO POR SOLUÇÃO                             */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#20271F] border border-white/10 space-y-4">
        <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#C08E3A]" />
          <span>Desempenho por solução</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-2.5 px-3">Solução Recomendada</th>
                <th className="py-2.5 px-3 text-center">Leads</th>
                <th className="py-2.5 px-3 text-center">Propostas</th>
                <th className="py-2.5 px-3 text-center">Fechados</th>
                <th className="py-2.5 px-3 text-right">Receita Fechada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {Object.keys(solAnalysis).length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400 font-mono text-xs">
                    Nenhum lançamento de proposta ou negócio registrado no período selecionado.
                  </td>
                </tr>
              ) : (
                Object.entries(solAnalysis).map(([sol, data]) => (
                  <tr key={sol} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-bold text-white font-kanit text-sm">{sol}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{data.leads}</td>
                    <td className="py-3 px-3 text-center text-[#0b7285] font-bold">
                      {data.propostas}
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                      {data.fechados}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                      {data.receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ATRIBUIÇÃO POR ORIGEM / UTM                                            */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#20271F] border border-white/10 space-y-4">
        <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#C08E3A]" />
          <span>Origem e conversão</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-2.5 px-3">Origem / Canal</th>
                <th className="py-2.5 px-3 text-center">Total Leads</th>
                <th className="py-2.5 px-3 text-center">Qualificados</th>
                <th className="py-2.5 px-3 text-center">Fechados</th>
                <th className="py-2.5 px-3 text-right">Receita</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {Object.keys(utmAnalysis).length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400 font-mono text-xs">
                    Aguardando entrada dos primeiros leads com tags UTM ou canais de tráfego.
                  </td>
                </tr>
              ) : (
                Object.entries(utmAnalysis).map(([origin, data]) => (
                  <tr key={origin} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-200">{origin}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{data.leads}</td>
                    <td className="py-3 px-3 text-center text-amber-400 font-bold">
                      {data.qualificados}
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                      {data.fechados}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                      {data.receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
