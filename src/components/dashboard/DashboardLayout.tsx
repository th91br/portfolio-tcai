import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import {
  LayoutDashboard,
  Users,
  Kanban,
  BarChart3,
  LogOut,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  Briefcase,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';
import {
  Lead,
  LeadEvent,
  Deal,
  FollowUp,
  CommercialMetrics,
  fetchLeads,
  fetchDeals,
  fetchFollowUps,
  fetchEventsForAnalytics,
  fetchCommercialMetrics,
  supabase,
} from '../../lib/supabase';
import { OverviewView } from './views/OverviewView';
import { LeadsListView } from './views/LeadsListView';
import { PipelineKanbanView } from './views/PipelineKanbanView';
import { FollowUpsView } from './views/FollowUpsView';
import { AnalyticsView } from './views/AnalyticsView';
import { LeadDetailsDrawer } from './views/LeadDetailsDrawer';
import { NotificationsCenter } from './notifications/NotificationsCenter';
import { ChangePasswordModal } from './auth/ChangePasswordModal';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

type TabKey = 'overview' | 'pipeline' | 'followups' | 'leads' | 'analytics';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [metrics, setMetrics] = useState<CommercialMetrics>({
    totalLeads: 0,
    leadsNovos: 0,
    leadsQualificados: 0,
    oportunidadesAbertas: 0,
    pipelineBruto: 0,
    pipelinePonderado: 0,
    propostasAbertas: 0,
    negociosFechados: 0,
    receitaFechada: 0,
    taxaConversaoGeral: 0,
    taxaWinRate: 0,
    ticketMedio: 0,
    cicloVendasMedioDias: 0,
    funilEtapas: {
      leads: 0,
      qualificados: 0,
      contatados: 0,
      reunioes: 0,
      propostas: 0,
      negociacoes: 0,
      fechados: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [leadsData, dealsData, followUpsData, eventsData, metricsData] = await Promise.all([
        fetchLeads(),
        fetchDeals(),
        fetchFollowUps(),
        fetchEventsForAnalytics(),
        fetchCommercialMetrics(),
      ]);
      setLeads(leadsData);
      setDeals(dealsData);
      setFollowUps(followUpsData);
      setEvents(eventsData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  // Realtime subscriptions para leads, deals, follow_ups e notifications
  useEffect(() => {
    const channel = supabase
      .channel('crm_realtime_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        loadData();
        setRefreshKey((k) => k + 1);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, () => {
        loadData();
        setRefreshKey((k) => k + 1);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follow_ups' }, () => {
        loadData();
        setRefreshKey((k) => k + 1);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        setRefreshKey((k) => k + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  const newLeadsCount = leads.filter((l) => l.status === 'NOVO').length;
  const now = new Date().getTime();
  const overdueFollowUpsCount = followUps.filter(
    (f) => f.status === 'PENDENTE' && new Date(f.scheduled_at).getTime() < now
  ).length;

  return (
    <div className="min-h-screen w-full bg-[#07111F] text-[#F3F5F7] font-kanit flex flex-col selection:bg-[#00D2F6]/30 selection:text-white">
      {/* Top Bar Administrativa */}
      <header className="sticky top-0 z-40 bg-[#0A1624]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Marca & Título */}
        <div className="flex items-center gap-3">
          <img
            src="/logo_tca.png"
            alt="Logo TCA"
            className="h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,210,246,0.3)]"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-wide uppercase">
                THIAGO CASSOL ANTUNES
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[9px] font-mono text-[#00D2F6] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6] animate-pulse" />
                DASHBOARD PRIVADO
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[220px]">
              {user.email}
            </span>
          </div>
        </div>

        {/* Ações Rápidas & Notificações */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Central de Notificações Internas */}
          <NotificationsCenter
            onSelectLead={(id) => setSelectedLeadId(id)}
            refreshTrigger={refreshKey}
          />

          <button
            type="button"
            onClick={() => setShowChangePasswordModal(true)}
            className="px-3 py-1.5 rounded-full border border-white/10 hover:border-[#00D2F6]/40 bg-white/[0.03] hover:bg-[#00D2F6]/10 text-xs font-mono text-slate-300 hover:text-[#00D2F6] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Segurança & Alteração de Senha"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="hidden sm:inline">Trocar Senha</span>
          </button>

          <a
            href="/"
            className="px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.03] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span className="hidden sm:inline">Ver Portfólio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-mono text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Encerrar Sessão"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Navegação por Abas */}
      <nav className="bg-[#07111F] border-b border-white/[0.06] px-4 sm:px-8 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#00D2F6]/20 to-[#015EEF]/20 border border-[#00D2F6]/40 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span>VISÃO GERAL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-gradient-to-r from-[#00D2F6]/20 to-[#015EEF]/20 border border-[#00D2F6]/40 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span>PIPELINE (8 ETAPAS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('followups')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'followups'
                ? 'bg-gradient-to-r from-[#00D2F6]/20 to-[#015EEF]/20 border border-[#00D2F6]/40 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span>FOLLOW-UPS</span>
            {overdueFollowUpsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                {overdueFollowUpsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-[#00D2F6]/20 to-[#015EEF]/20 border border-[#00D2F6]/40 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span>LEADS</span>
            {newLeadsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#07111F] text-[10px] font-bold">
                {newLeadsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-[#00D2F6]/20 to-[#015EEF]/20 border border-[#00D2F6]/40 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span>MÉTRICAS & FUNIL</span>
          </button>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#00D2F6]" />
            <p className="text-xs font-mono">Sincronizando com Supabase PostgreSQL...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewView
                leads={leads}
                deals={deals}
                events={events}
                metrics={metrics}
                onSelectLead={(id) => setSelectedLeadId(id)}
                onNavigateToLeads={() => setActiveTab('leads')}
              />
            )}

            {activeTab === 'pipeline' && (
              <PipelineKanbanView
                deals={deals}
                leads={leads}
                onSelectLead={(id) => setSelectedLeadId(id)}
                onRefresh={loadData}
                adminEmail={user.email || 'Thiago'}
              />
            )}

            {activeTab === 'followups' && (
              <FollowUpsView
                followUps={followUps}
                leads={leads}
                deals={deals}
                onSelectLead={(id) => setSelectedLeadId(id)}
                onRefresh={loadData}
                adminEmail={user.email || 'Thiago'}
              />
            )}

            {activeTab === 'leads' && (
              <LeadsListView
                leads={leads}
                onSelectLead={(id) => setSelectedLeadId(id)}
                onRefresh={loadData}
                isLoading={loading}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                leads={leads}
                deals={deals}
                events={events}
                metrics={metrics}
              />
            )}
          </>
        )}
      </main>

      {/* Dossiê Lateral do Lead (Drawer com Ficha Comercial) */}
      <LeadDetailsDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onLeadUpdated={loadData}
        adminEmail={user.email || 'Thiago'}
      />

      {/* Modal Seguro de Alteração de Senha */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        userEmail={user.email || ''}
      />
    </div>
  );
};
