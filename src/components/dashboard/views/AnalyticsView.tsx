import React from 'react';
import {
  BarChart3,
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

interface AnalyticsViewProps {
  leads: Lead[];
  deals: Deal[];
  events: LeadEvent[];
  metrics: CommercialMetrics;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  leads,
  deals,
  events,
  metrics,
}) => {
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

  return (
    <div className="space-y-8 font-kanit">
      <div>
        <h2 className="font-black text-2xl text-white uppercase tracking-tight">
          ANALYTICS & FUNIL COMERCIAL
        </h2>
        <p className="text-xs text-[#94A3B8] font-mono">
          Taxas reais de conversão entre etapas e análise de receita por solução e origem
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. FUNIL COMERCIAL COMPLETO (LEADS -> FECHADOS)                           */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#091524] border border-white/10 space-y-6">
        <h3 className="font-bold text-base text-white uppercase tracking-tight flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#00D2F6]" />
          <span>FUNIL DE VENDAS (CONVERSÃO ETAPA A ETAPA)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {/* 1. Leads */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                1. LEADS
              </span>
              <div className="text-2xl font-black text-white font-mono">{funil.leads}</div>
            </div>
            <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-[#00D2F6]">
              Base 100%
            </div>
          </div>

          {/* 2. Qualificados */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                2. QUALIFICADOS
              </span>
              <div className="text-2xl font-black text-white font-mono">{funil.qualificados}</div>
            </div>
            <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-cyan-400">
              ↓ {taxaQualificados}% dos leads
            </div>
          </div>

          {/* 3. Contatados */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                3. CONTATADOS
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
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                4. REUNIÕES
              </span>
              <div className="text-2xl font-black text-white font-mono">{funil.reunioes}</div>
            </div>
            <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-indigo-400">
              ↓ {taxaReunioes}% agendadas
            </div>
          </div>

          {/* 5. Propostas */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                5. PROPOSTAS
              </span>
              <div className="text-2xl font-black text-purple-400 font-mono">{funil.propostas}</div>
            </div>
            <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-purple-400">
              ↓ {taxaPropostas}% propostas
            </div>
          </div>

          {/* 6. Fechados */}
          <div className="p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/30 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.06)]">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1 font-bold">
                6. FECHADOS
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
      <div className="p-5 sm:p-6 rounded-2xl bg-[#091524] border border-white/10 space-y-4">
        <h3 className="font-bold text-base text-white uppercase tracking-tight flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#00D2F6]" />
          <span>DESEMPENHO COMERCIAL POR SOLUÇÃO</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase">
                <th className="py-2.5 px-3">Solução Recomendada</th>
                <th className="py-2.5 px-3 text-center">Leads</th>
                <th className="py-2.5 px-3 text-center">Propostas</th>
                <th className="py-2.5 px-3 text-center">Fechados</th>
                <th className="py-2.5 px-3 text-right">Receita Fechada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {Object.entries(solAnalysis).map(([sol, data]) => (
                <tr key={sol} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-bold text-white font-kanit text-sm">{sol}</td>
                  <td className="py-3 px-3 text-center text-slate-300">{data.leads}</td>
                  <td className="py-3 px-3 text-center text-purple-400 font-bold">
                    {data.propostas}
                  </td>
                  <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                    {data.fechados}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {data.receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ATRIBUIÇÃO POR ORIGEM / UTM                                            */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#091524] border border-white/10 space-y-4">
        <h3 className="font-bold text-base text-white uppercase tracking-tight flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#00D2F6]" />
          <span>RECEITA & CONVERSÃO POR ORIGEM / UTM</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase">
                <th className="py-2.5 px-3">Origem / Canal</th>
                <th className="py-2.5 px-3 text-center">Total Leads</th>
                <th className="py-2.5 px-3 text-center">Qualificados</th>
                <th className="py-2.5 px-3 text-center">Fechados</th>
                <th className="py-2.5 px-3 text-right">Receita</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {Object.entries(utmAnalysis).map(([origin, data]) => (
                <tr key={origin} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-200">{origin}</td>
                  <td className="py-3 px-3 text-center text-slate-300">{data.leads}</td>
                  <td className="py-3 px-3 text-center text-cyan-400 font-bold">
                    {data.qualificados}
                  </td>
                  <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                    {data.fechados}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {data.receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
