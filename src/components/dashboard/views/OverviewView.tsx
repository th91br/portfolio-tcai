import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Flame,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Zap,
  DollarSign,
  Percent,
  Award,
  Target,
  BarChart3,
  Briefcase,
} from 'lucide-react';
import { Lead, LeadEvent, Deal, CommercialMetrics } from '../../../lib/supabase';

interface OverviewViewProps {
  leads: Lead[];
  deals: Deal[];
  events: LeadEvent[];
  metrics: CommercialMetrics;
  onSelectLead: (leadId: string) => void;
  onNavigateToLeads: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  leads,
  deals,
  events,
  metrics,
  onSelectLead,
  onNavigateToLeads,
}) => {
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('all');

  const now = new Date();
  const filteredLeads = leads.filter((lead) => {
    if (period === 'all') return true;
    const leadDate = new Date(lead.created_at);
    const diffDays = (now.getTime() - leadDate.getTime()) / (1000 * 3600 * 24);
    return period === '7d' ? diffDays <= 7 : diffDays <= 30;
  });

  const filteredDeals = deals.filter((deal) => {
    if (period === 'all') return true;
    const dDate = new Date(deal.created_at);
    const diffDays = (now.getTime() - dDate.getTime()) / (1000 * 3600 * 24);
    return period === '7d' ? diffDays <= 7 : diffDays <= 30;
  });

  // Métricas calculadas para o período
  const totalLeads = filteredLeads.length;
  const newLeads = filteredLeads.filter((l) => l.status === 'NOVO').length;
  const qualifiedLeads = filteredLeads.filter((l) => l.status !== 'NOVO' && l.status !== 'PERDIDO').length;

  const abertos = filteredDeals.filter(
    (d) => d.pipeline_stage !== 'FECHADO' && d.pipeline_stage !== 'PERDIDO'
  );
  const fechados = filteredDeals.filter((d) => d.pipeline_stage === 'FECHADO');
  const perdidos = filteredDeals.filter((d) => d.pipeline_stage === 'PERDIDO');
  const propostas = filteredDeals.filter((d) => d.pipeline_stage === 'PROPOSTA');

  const pipelineBruto = abertos.reduce(
    (acc, d) => acc + (d.proposed_value || d.estimated_value || 0),
    0
  );
  const pipelinePonderado = abertos.reduce(
    (acc, d) =>
      acc + ((d.proposed_value || d.estimated_value || 0) * (d.probability || 0)) / 100,
    0
  );
  const receitaFechada = fechados.reduce(
    (acc, d) => acc + (d.final_value || d.proposed_value || d.estimated_value || 0),
    0
  );

  const ticketMedio = fechados.length > 0 ? receitaFechada / fechados.length : 0;
  const totalConcluidos = fechados.length + perdidos.length;
  const winRate = totalConcluidos > 0 ? Math.round((fechados.length / totalConcluidos) * 100) : 0;
  const conversionRate = totalLeads > 0 ? Math.round((fechados.length / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6 font-kanit">
      {/* Topo & Filtro de Período */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-black text-2xl text-white uppercase tracking-tight">
            VISÃO GERAL DO PIPELINE COMERCIAL
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono">
            Métricas financeiras reais consolidadas a partir dos negócios e diagnósticos
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              period === '7d'
                ? 'bg-[#00D2F6] text-[#07111F] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            7 dias
          </button>
          <button
            type="button"
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              period === '30d'
                ? 'bg-[#00D2F6] text-[#07111F] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            30 dias
          </button>
          <button
            type="button"
            onClick={() => setPeriod('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              period === 'all'
                ? 'bg-[#00D2F6] text-[#07111F] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todo o período
          </button>
        </div>
      </div>

      {/* Grid de KPIs Financeiros Principais (Fase 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pipeline Bruto */}
        <div className="p-5 rounded-2xl bg-[#091524] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Pipeline Bruto
            </span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-bold text-2xl text-white font-mono">
            {pipelineBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <span className="text-[11px] font-mono text-slate-400 mt-1 block">
            {abertos.length} oportunidade{abertos.length !== 1 ? 's' : ''} em aberto
          </span>
        </div>

        {/* Pipeline Ponderado */}
        <div className="p-5 rounded-2xl bg-[#091524] border border-[#00D2F6]/30 relative overflow-hidden shadow-[0_0_20px_rgba(0,210,246,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#00D2F6] uppercase tracking-wider">
              Pipeline Ponderado
            </span>
            <Percent className="w-5 h-5 text-[#00D2F6]" />
          </div>
          <div className="font-bold text-2xl text-[#00D2F6] font-mono">
            {pipelinePonderado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <span className="text-[11px] font-mono text-slate-400 mt-1 block">
            Ajustado pela probabilidade
          </span>
        </div>

        {/* Receita Fechada */}
        <div className="p-5 rounded-2xl bg-[#091524] border border-emerald-500/30 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Receita Fechada
            </span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-bold text-2xl text-white font-mono">
            {receitaFechada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-1 block font-bold">
            {fechados.length} negócio{fechados.length !== 1 ? 's' : ''} fechado{fechados.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Ticket Médio */}
        <div className="p-5 rounded-2xl bg-[#091524] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Ticket Médio
            </span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="font-bold text-2xl text-white font-mono">
            {ticketMedio > 0
              ? ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : 'R$ 0,00'}
          </div>
          <span className="text-[11px] font-mono text-slate-400 mt-1 block">
            Por negócio fechado
          </span>
        </div>
      </div>

      {/* Grid de Eficiência de Vendas & Conversão */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Total de Leads
          </span>
          <span className="text-xl font-bold text-white font-mono">{totalLeads}</span>
        </div>

        {/* Propostas Abertas */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Propostas Abertas
          </span>
          <span className="text-xl font-bold text-purple-400 font-mono">{propostas.length}</span>
        </div>

        {/* Win Rate */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Win Rate
          </span>
          <span className="text-xl font-bold text-emerald-400 font-mono">{winRate}%</span>
          <span className="text-[9px] font-mono text-slate-500 block">
            Fechados ÷ (Fechados + Perdidos)
          </span>
        </div>

        {/* Ciclo Médio */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Ciclo Médio
          </span>
          <span className="text-xl font-bold text-white font-mono">
            {metrics.cicloVendasMedioDias} dias
          </span>
          <span className="text-[9px] font-mono text-slate-500 block">
            Criação até fechamento
          </span>
        </div>
      </div>

      {/* Leads Recentes & Oportunidades em Aberto */}
      <div className="p-5 rounded-2xl bg-[#091524] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold uppercase text-white tracking-wide">
            Oportunidades Comerciais Recentes
          </h3>
          <button
            type="button"
            onClick={onNavigateToLeads}
            className="text-xs font-mono text-[#00D2F6] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todos os leads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-white/10">
          {filteredDeals.slice(0, 5).map((deal) => {
            const lead = deal.lead || leads.find((l) => l.id === deal.lead_id);
            const val = deal.final_value || deal.proposed_value || deal.estimated_value;

            return (
              <div
                key={deal.id}
                onClick={() => onSelectLead(deal.lead_id)}
                className="py-3 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm hover:text-[#00D2F6] transition-colors">
                      {lead?.name || deal.title}
                    </span>
                    {lead?.company && (
                      <span className="text-xs font-mono text-slate-400">({lead.company})</span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[#00D2F6]">
                    {lead?.recommended_solution || 'Projeto TCA'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-white block">
                    {val
                      ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : 'A definir'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300">
                    {deal.pipeline_stage} • {deal.probability}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
