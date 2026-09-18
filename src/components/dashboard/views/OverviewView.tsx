import React, { useMemo, useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  Bot,
  Radio,
  ArrowRight,
  Target,
  FileText,
  Activity,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Lead, LeadEvent, Deal, CommercialMetrics } from '../../../lib/supabase';
import { BusinessOnboardingCard } from '../onboarding/BusinessOnboardingCard';
import { Tenant } from '../../../services/tenants/tenantService';
import { agentTeamService, getAgentLifecycleMeta } from '../../../services/agents/agentTeamService';
import { getKnowledgeDocuments } from '../../../services/agent/knowledgeBaseService';
import { hasDemoData } from '../../../services/demo/demoDataService';

interface OverviewViewProps {
  leads: Lead[];
  deals: Deal[];
  events: LeadEvent[];
  metrics: CommercialMetrics;
  onSelectLead: (leadId: string) => void;
  onNavigateToLeads: () => void;
  onNavigateToTab?: (tab: string) => void;
  activeTenant?: Tenant;
  isDemoActive?: boolean;
}

export type PeriodFilter = 'today' | '7d' | '30d' | 'all';

export const OverviewView: React.FC<OverviewViewProps> = ({
  leads,
  deals,
  events,
  metrics,
  onSelectLead,
  onNavigateToLeads,
  onNavigateToTab,
  activeTenant,
  isDemoActive
}) => {
  const [period, setPeriod] = useState<PeriodFilter>('all');

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000;

  const isDateInPeriod = (dateStr: string | null | undefined): boolean => {
    if (!dateStr) return false;
    const time = new Date(dateStr).getTime();
    if (isNaN(time)) return false;
    if (period === 'all') return true;
    if (period === 'today') {
      return time >= startOfToday && time < endOfToday;
    }
    const diffDays = (now.getTime() - time) / (1000 * 3600 * 24);
    if (diffDays < 0) return false;
    return period === '7d' ? diffDays <= 7 : diffDays <= 30;
  };

  const filteredLeads = leads.filter((lead) => isDateInPeriod(lead.created_at));
  const filteredDeals = deals.filter((deal) => {
    if (period === 'all') return true;
    return (
      isDateInPeriod(deal.created_at) ||
      isDateInPeriod(deal.closed_at) ||
      isDateInPeriod(deal.proposal_date)
    );
  });
  const filteredEvents = events.filter((e) => isDateInPeriod(e.created_at));

  // Estado real dos Especialistas do Tenant
  const tenantId = activeTenant?.id || 'tenant-tcai-matriz';
  const tenantAgents = agentTeamService.getAgents(tenantId);
  const hiredAgents = tenantAgents.filter((a) => a.status === 'hired');
  const activeAgents = tenantAgents.filter((a) => a.lifecycleState === 'active' || (a.status === 'hired' && !a.lifecycleState));
  const reviewOrTestingAgents = tenantAgents.filter((a) => a.lifecycleState === 'review' || a.lifecycleState === 'testing' || a.lifecycleState === 'draft');

  const isWhatsAppConnected = activeTenant?.whatsappConnected === true;
  const hasActiveAgent = activeAgents.length > 0;
  const hasReviewOrTestingAgent = reviewOrTestingAgents.length > 0;
  const hasKnowledge = useMemo(
    () => getKnowledgeDocuments().some((document) => document.isActive && document.content.trim().length > 0),
    []
  );
  const isDemoMode = useMemo(() => hasDemoData(leads), [leads]);
  const operationStatus = !isWhatsAppConnected
    ? { label: 'Canal pendente', className: 'bg-rose-50 text-rose-700 border-rose-200', dotClassName: 'bg-rose-500' }
    : hasActiveAgent
      ? { label: 'Operação ativa', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dotClassName: 'bg-emerald-500' }
      : { label: 'Configuração pendente', className: 'bg-amber-50 text-amber-800 border-amber-200', dotClassName: 'bg-amber-500' };

  // Contagens da Operação Real
  const totalLeads = filteredLeads.length;
  const newLeads = filteredLeads.filter((l) => l.status === 'NOVO');
  const pendingLeadsCount = newLeads.length;
  const diagnosticLeads = filteredLeads.filter((l) => Boolean(l.recommended_solution));
  const abertos = filteredDeals.filter(
    (d) => d.pipeline_stage !== 'FECHADO' && d.pipeline_stage !== 'PERDIDO'
  );

  // Determinar o Estado Real do "Próximo Passo" (Elemento Dominante)
  const getNextStepConfig = () => {
    if (!isWhatsAppConnected) {
      return {
        badge: 'Canal pendente',
        badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        title: 'Conecte seu WhatsApp para começar a receber conversas.',
        description: 'Sua linha comercial ainda não está sincronizada. Conecte o WhatsApp Web da sua empresa para habilitar a recepção de clientes.',
        actionText: 'Conectar WhatsApp',
        actionTab: 'whatsapp',
        icon: Radio
      };
    }

    if (hiredAgents.length === 0) {
      return {
        badge: 'Equipe vazia',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        title: 'Escolha ou crie um agente para organizar o atendimento.',
        description: 'Seu canal de entrada está pronto, mas ainda não há nenhum especialista digital escalado para qualificar e recepcionar contatos.',
        actionText: 'Escolher Especialista',
        actionTab: 'agents',
        icon: Bot
      };
    }

    if (!hasActiveAgent && hasReviewOrTestingAgent) {
      return {
        badge: 'Homologação necessária',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        title: 'Revise seu agente antes de ativá-lo.',
        description: 'Seu especialista está em homologação. Teste no simulador interno antes de liberá-lo para interagir com contatos reais.',
        actionText: 'Revisar & Homologar',
        actionTab: 'agents',
        icon: Sparkles
      };
    }

    // Operação Ativa
    return {
      badge: 'Operação em andamento',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      title: 'Sua operação está ativa. Veja o que está acontecendo.',
      description: pendingLeadsCount > 0
        ? `Você tem ${pendingLeadsCount} contato${pendingLeadsCount > 1 ? 's' : ''} aguardando atendimento ou acompanhamento no WhatsApp.`
        : 'O atendimento autônomo está respondendo contatos 24/7 na linha oficial com prontidão contínua.',
      actionText: 'Ver Conversas',
      actionTab: 'whatsapp',
      icon: MessageSquare
    };
  };

  const nextStep = getNextStepConfig();
  const NextStepIcon = nextStep.icon;

  // Tradução humanizada de eventos reais do Supabase
  const formatHumanEvent = (event: LeadEvent) => {
    let label = 'Interação registrada';
    if (event.event_name === 'diagnostic_complete') label = 'Diagnóstico comercial concluído';
    else if (event.event_name === 'diagnostic_start') label = 'Diagnóstico iniciado';
    else if (event.event_name === 'diagnostic_view') label = 'Página do diagnóstico visualizada';
    else if (event.event_name === 'diagnostic_lead_created') label = 'Novo lead cadastrado via diagnóstico';
    else if (event.event_name === 'diagnostic_whatsapp_click') label = 'Clique para atendimento no WhatsApp';
    else if (event.event_name === 'diagnostic_step') label = `Etapa ${event.step_number || 1} do diagnóstico respondida`;

    const origin = (event.metadata?.utm_source as string) || (event.metadata?.origin as string) || 'Canal Oficial';
    const dateObj = new Date(event.created_at);
    const dateStr = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
      : 'Hoje';

    return { label, origin, dateStr };
  };

  return (
    <div className="space-y-6 font-kanit">
      {/* ========================================================================= */}
      {/* 1. CABEÇALHO CONTEXTUAL DISCRETO                                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Visão geral
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${operationStatus.className}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${operationStatus.dotClassName}`} />
              {operationStatus.label}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
            Vamos organizar o próximo passo da sua operação.
          </p>
        </div>

        {/* Filtro de Período Discreto */}
        <div
          role="group"
          aria-label="Filtro de período comercial"
          className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono self-start sm:self-auto"
        >
          {(['today', '7d', '30d', 'all'] as PeriodFilter[]).map((p) => {
            const label = p === 'today' ? 'Diário' : p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : 'Todo o período';
            const isActive = period === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#8a5a00] text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BLOCO PRINCIPAL: "PRÓXIMO PASSO" (ELEMENTO VISUAL DOMINANTE)            */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-[#C08E3A]/40 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C08E3A]/15 border border-[#C08E3A]/30 flex items-center justify-center text-[#8a5a00] flex-shrink-0 mt-0.5">
              <NextStepIcon className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#8a5a00] uppercase tracking-wider block">
                Próximo passo
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {nextStep.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-sans max-w-2xl leading-relaxed">
                {nextStep.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center flex-shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToTab && onNavigateToTab(nextStep.actionTab)}
              className="px-4 py-2.5 rounded-xl bg-[#8a5a00] hover:bg-[#734b00] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>{nextStep.actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CHECKLIST DE CONFIGURAÇÃO (SEQUÊNCIA CURTA BASEADA NO ESTADO REAL)      */}
      {/* ========================================================================= */}
      <BusinessOnboardingCard
        onNavigateToTab={onNavigateToTab}
        onOpenSimulador={() => onNavigateToTab && onNavigateToTab('agents')}
        isChannelConnected={isWhatsAppConnected}
        hasObjective={hiredAgents.length > 0}
        hasKnowledge={hasKnowledge}
        hasTested={hiredAgents.length > 0}
        isOperationActive={hasActiveAgent}
      />

      {/* ========================================================================= */}
      {/* 4. ATALHOS PRINCIPAIS (MÁXIMO DE 4 AÇÕES ÚTEIS)                            */}
      {/* ========================================================================= */}
      <div>
        <div className="mb-2.5">
            <span className="text-sm font-semibold text-slate-700">
            Ações da operação
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Atalho 1: Ver Conversas */}
          <button
            type="button"
            onClick={() => onNavigateToTab && onNavigateToTab('whatsapp')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#8a5a00]/40 hover:bg-slate-50/80 transition-all text-left flex items-start justify-between group cursor-pointer shadow-sm"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#8a5a00] transition-colors truncate">
                  Ver Conversas
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Atendimento ativo no WhatsApp
              </p>
              <span className="text-[11px] font-mono text-emerald-700 font-bold block pt-1">
                {pendingLeadsCount > 0 ? `${pendingLeadsCount} nova(s)` : 'Linha online'}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors flex-shrink-0 mt-0.5" />
          </button>

          {/* Atalho 2: Ver Contatos */}
          <button
            type="button"
            onClick={onNavigateToLeads}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#8a5a00]/40 hover:bg-slate-50/80 transition-all text-left flex items-start justify-between group cursor-pointer shadow-sm"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#8a5a00] transition-colors truncate">
                  Ver Contatos
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Carteira de leads e clientes
              </p>
              <span className="text-[11px] font-mono text-slate-700 font-bold block pt-1">
                {totalLeads} cadastrado{totalLeads !== 1 ? 's' : ''}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors flex-shrink-0 mt-0.5" />
          </button>

          {/* Atalho 3: Abrir Funil */}
          <button
            type="button"
            onClick={() => onNavigateToTab && onNavigateToTab('pipeline')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#8a5a00]/40 hover:bg-slate-50/80 transition-all text-left flex items-start justify-between group cursor-pointer shadow-sm"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#8a5a00] flex-shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#8a5a00] transition-colors truncate">
                  Abrir Funil
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Oportunidades em aberto
              </p>
              <span className="text-[11px] font-mono text-[#8a5a00] font-bold block pt-1">
                {abertos.length} oportunidade{abertos.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors flex-shrink-0 mt-0.5" />
          </button>

          {/* Atalho 4: Equipe e atendentes */}
          <button
            type="button"
            onClick={() => onNavigateToTab && onNavigateToTab('agents')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#8a5a00]/40 hover:bg-slate-50/80 transition-all text-left flex items-start justify-between group cursor-pointer shadow-sm"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#8a5a00] flex-shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#8a5a00] transition-colors truncate">
                  Equipe e atendentes
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Atendentes e regras do negócio
              </p>
              <span className="text-[11px] font-mono text-slate-700 font-bold block pt-1">
                {activeAgents.length} ativo{activeAgents.length !== 1 ? 's' : ''} • {hiredAgents.length} no time
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors flex-shrink-0 mt-0.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. RESUMO DA OPERAÇÃO (SOMENTE DADOS REAIS EXISTENTES)                     */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Resumo da operação
            </h3>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Movimentações comerciais e contatos registrados no sistema
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToLeads}
            className="text-xs font-mono font-bold text-[#8a5a00] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver carteira completa</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="py-10 px-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">
              Assim que sua operação começar, os principais movimentos aparecerão aqui.
            </p>
            <p className="text-xs text-slate-600 font-sans max-w-md mx-auto">
              Nenhum contato registrado nesta janela de data. Quando você receber mensagens no WhatsApp ou cadastrar propostas, o resumo atualizará em tempo real.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLeads.slice(0, 5).map((lead) => {
              const matchingDeal = deals.find((d) => d.lead_id === lead.id);
              const val = matchingDeal?.final_value || matchingDeal?.proposed_value || matchingDeal?.estimated_value;

              return (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead.id)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm hover:text-[#8a5a00] transition-colors truncate">
                        {lead.name}
                      </span>
                      {lead.company && (
                        <span className="text-xs font-mono font-medium text-slate-600 truncate">({lead.company})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono font-semibold text-[#8a5a00] truncate">
                        {lead.recommended_solution || 'Diagnóstico Geral'}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-[11px] text-slate-600 font-mono font-medium">
                        {lead.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold font-mono text-slate-900 block">
                      {val
                        ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : 'A negociar'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                      {lead.origin || 'WhatsApp'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. ATIVIDADE RECENTE (FEED AUDITÁVEL COM EVENTOS REAIS)                     */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Atividade recente
            </h3>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Registro auditável de eventos operacionais e diagnósticos
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
            <Activity className="w-7 h-7 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">
              Nenhuma atividade recente registrada nesta janela.
            </p>
            <p className="text-xs text-slate-600 font-sans max-w-md mx-auto">
              Interações com o diagnóstico, novas conversas no WhatsApp e mudanças de fase aparecerão aqui em ordem cronológica.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEvents.slice(0, 6).map((evt) => {
              const formatted = formatHumanEvent(evt);
              return (
                <div
                  key={evt.id}
                  className="py-2.5 flex items-center justify-between gap-4 px-2 hover:bg-slate-50 rounded-lg transition-colors text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-[#C08E3A] flex-shrink-0" />
                    <span className="text-slate-900 font-semibold text-xs sm:text-sm font-sans truncate">
                      {formatted.label}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] sm:text-[11px] font-medium font-sans truncate flex-shrink-0">
                      {formatted.origin}
                    </span>
                  </div>

                  <span className="text-slate-600 font-mono text-xs font-medium flex-shrink-0">
                    {formatted.dateStr}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
