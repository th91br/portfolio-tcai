import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  MessageCircle,
  ExternalLink,
  Building,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Lead, LeadStatus, LeadScoreCategory } from '../../../lib/supabase';

interface LeadsListViewProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const LeadsListView: React.FC<LeadsListViewProps> = ({
  leads,
  onSelectLead,
  onRefresh,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [solutionFilter, setSolutionFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'score_desc' | 'score_asc'>('date_desc');

  // Filtragem e ordenação computada
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Busca textual
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = lead.name.toLowerCase().includes(term);
          const matchEmail = lead.email.toLowerCase().includes(term);
          const matchCompany = (lead.company || '').toLowerCase().includes(term);
          const matchPhone = lead.whatsapp.includes(term);
          if (!matchName && !matchEmail && !matchCompany && !matchPhone) {
            return false;
          }
        }

        // Filtro de Status
        if (statusFilter !== 'ALL' && lead.status !== statusFilter) {
          return false;
        }

        // Filtro de Solução
        if (solutionFilter !== 'ALL' && !lead.recommended_solution.includes(solutionFilter)) {
          return false;
        }

        // Filtro de Categoria
        if (categoryFilter !== 'ALL' && lead.score_category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'score_desc') {
          return b.score - a.score;
        }
        if (sortBy === 'score_asc') {
          return a.score - b.score;
        }
        return 0;
      });
  }, [leads, searchTerm, statusFilter, solutionFilter, categoryFilter, sortBy]);

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Busca */}
      <div className="p-4 rounded-2xl bg-[#091524] border border-white/[0.08] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, e-mail, empresa ou WhatsApp..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] font-sans"
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Dropdowns de Filtro */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          {/* Filtro Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 focus:outline-none focus:border-[#00D2F6]"
          >
            <option value="ALL">Status: Todos</option>
            <option value="NOVO">NOVO</option>
            <option value="QUALIFICADO">QUALIFICADO</option>
            <option value="CONTATADO">CONTATADO</option>
            <option value="REUNIÃO">REUNIÃO</option>
            <option value="PROPOSTA">PROPOSTA</option>
            <option value="FECHADO">FECHADO</option>
            <option value="PERDIDO">PERDIDO</option>
          </select>

          {/* Filtro Solução */}
          <select
            value={solutionFilter}
            onChange={(e) => setSolutionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 focus:outline-none focus:border-[#00D2F6]"
          >
            <option value="ALL">Solução: Todas</option>
            <option value="SITE">Site / Landing Page</option>
            <option value="SOFTWARE">Software / Sistema</option>
            <option value="SAAS">SaaS / Micro-SaaS</option>
            <option value="AUTOMAÇÃO">Automação / IA</option>
          </select>

          {/* Filtro Categoria */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 focus:outline-none focus:border-[#00D2F6]"
          >
            <option value="ALL">Classificação: Todas</option>
            <option value="ALTA PRIORIDADE">Alta Prioridade</option>
            <option value="POTENCIAL">Potencial</option>
            <option value="INICIAL">Inicial</option>
          </select>

          {/* Ordenação */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 focus:outline-none focus:border-[#00D2F6]"
          >
            <option value="date_desc">Mais Recentes</option>
            <option value="date_asc">Mais Antigos</option>
            <option value="score_desc">Maior Score</option>
            <option value="score_asc">Menor Score</option>
          </select>
        </div>
      </div>

      {/* Tabela de Leads */}
      <div className="rounded-2xl bg-[#091524] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A1624] text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3.5 px-4">Lead / Empresa</th>
                <th className="py-3.5 px-4">WhatsApp</th>
                <th className="py-3.5 px-4">Solução Indicada</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Data</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono italic">
                    Nenhum lead encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead.id)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-[#00D2F6] transition-colors">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        {lead.company ? (
                          <>
                            <Building className="w-3 h-3 text-slate-500" />
                            <span>{lead.company}</span>
                          </>
                        ) : (
                          <span>{lead.email}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {lead.whatsapp}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200">
                        {lead.recommended_solution}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          lead.score_category === 'ALTA PRIORIDADE'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : lead.score_category === 'POTENCIAL'
                            ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30'
                            : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                        }`}
                      >
                        {lead.score} pts
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[10px] font-mono text-slate-300 border border-white/[0.06]">
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#00D2F6] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Ver Dossiê</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
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

export default LeadsListView;
