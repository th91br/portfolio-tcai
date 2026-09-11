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
  Trash2,
  Film,
  CheckCircle2,
  MessageSquare,
  Cpu,
  Radio,
  Building,
  Mic,
  ChevronDown,
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
import {
  generateDemoScenario,
  clearDemoScenario,
  hasDemoData,
  countDemoData,
} from '../../services/demo/demoDataService';
import { OverviewView } from './views/OverviewView';
import { LeadsListView } from './views/LeadsListView';
import { PipelineKanbanView } from './views/PipelineKanbanView';
import { FollowUpsView } from './views/FollowUpsView';
import { AnalyticsView } from './views/AnalyticsView';
import { WhatsAppAgentView } from './views/WhatsAppAgentView';
import { AgentsMarketplaceView } from './views/AgentsMarketplaceView';
import { LeadDetailsDrawer } from './views/LeadDetailsDrawer';
import { NotificationsCenter } from './notifications/NotificationsCenter';
import { ChangePasswordModal } from './auth/ChangePasswordModal';
import { AgentSettingsModal } from './settings/AgentSettingsModal';
import { WebhookHubModal } from './integrations/WebhookHubModal';
import { SalesTeamModal } from './team/SalesTeamModal';
import { TenantMasterModal } from './tenants/TenantMasterModal';
import { VoiceStudioModal } from './voice/VoiceStudioModal';
import { DashboardSidebar, DashboardTabKey, DashboardModalKey } from './layout/DashboardSidebar';
import { DashboardHeader } from './layout/DashboardHeader';
import {
  Tenant,
  getActiveTenant,
  getStoredTenants,
  setActiveTenantId,
} from '../../services/tenants/tenantService';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
  const [showAgentSettingsModal, setShowAgentSettingsModal] = useState(false);
  const [showWebhookHubModal, setShowWebhookHubModal] = useState(false);
  const [showSalesTeamModal, setShowSalesTeamModal] = useState(false);
  const [showTenantMasterModal, setShowTenantMasterModal] = useState(false);
  const [showVoiceStudioModal, setShowVoiceStudioModal] = useState(false);
  const [activeTenant, setActiveTenant] = useState<Tenant>(getActiveTenant());
  const [allTenants, setAllTenants] = useState<Tenant[]>(getStoredTenants());
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);
  const [showDeleteDemoModal, setShowDeleteDemoModal] = useState(false);
  const [demoFeedback, setDemoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isDemoActive = hasDemoData(leads);
  const demoCount = countDemoData(leads);

  const handleGenerateDemo = async () => {
    setIsProcessingDemo(true);
    setDemoFeedback(null);
    try {
      const result = await generateDemoScenario();
      if (result.success) {
        setDemoFeedback({
          type: 'success',
          message: `${result.leadsCreated} contatos e negócios fakes gerados com sucesso nas 8 etapas!`,
        });
        await loadData();
      } else {
        setDemoFeedback({
          type: 'error',
          message: result.error || 'Erro ao gerar dados demonstrativos.',
        });
      }
    } catch (err: any) {
      setDemoFeedback({
        type: 'error',
        message: err.message || 'Erro inesperado ao gerar dados.',
      });
    } finally {
      setIsProcessingDemo(false);
      setTimeout(() => setDemoFeedback(null), 5000);
    }
  };

  const handleClearDemo = async () => {
    setIsProcessingDemo(true);
    setDemoFeedback(null);
    try {
      const result = await clearDemoScenario();
      setShowDeleteDemoModal(false);
      if (result.success) {
        setDemoFeedback({
          type: 'success',
          message: 'Todos os contatos e dados demonstrativos foram excluídos com sucesso!',
        });
        await loadData();
      }
    } catch (err: any) {
      setDemoFeedback({
        type: 'error',
        message: err.message || 'Erro ao excluir dados demo.',
      });
    } finally {
      setIsProcessingDemo(false);
      setTimeout(() => setDemoFeedback(null), 5000);
    }
  };

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

  useEffect(() => {
    const handleTenantChanged = () => {
      setActiveTenant(getActiveTenant());
      setAllTenants(getStoredTenants());
      loadData();
      setRefreshKey((k) => k + 1);
    };
    window.addEventListener('tcai_tenant_changed', handleTenantChanged);
    return () => window.removeEventListener('tcai_tenant_changed', handleTenantChanged);
  }, [loadData]);

  const newLeadsCount = leads.filter((l) => l.status === 'NOVO').length;
  const now = new Date().getTime();
  const overdueFollowUpsCount = followUps.filter(
    (f) => f.status === 'PENDENTE' && new Date(f.scheduled_at).getTime() < now
  ).length;

  return (
    <div className="h-screen w-full bg-[#07111F] text-[#F3F5F7] font-sans flex overflow-hidden selection:bg-[#00D2F6]/30 selection:text-white">
      {/* Sidebar Lateral Recolhível */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenModal={(modalKey) => {
          if (modalKey === 'tenants') setShowTenantMasterModal(true);
          if (modalKey === 'voice') setShowVoiceStudioModal(true);
          if (modalKey === 'webhooks') setShowWebhookHubModal(true);
          if (modalKey === 'team') setShowSalesTeamModal(true);
          if (modalKey === 'settings') setShowAgentSettingsModal(true);
          if (modalKey === 'password') setShowChangePasswordModal(true);
        }}
        newLeadsCount={newLeadsCount}
        overdueFollowUpsCount={overdueFollowUpsCount}
        activeTenantName={activeTenant.tradingName}
        onLogout={onLogout}
      />

      {/* Área Principal de Conteúdo */}
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        }`}
      >
        {/* Topbar Limpa & Executiva */}
        <DashboardHeader
          user={user}
          activeTab={activeTab}
          activeTenant={activeTenant}
          allTenants={allTenants}
          onSelectTenant={(t) => {
            setActiveTenant(t);
            loadData();
            setRefreshKey((k) => k + 1);
          }}
          onOpenTenantMaster={() => setShowTenantMasterModal(true)}
          onOpenChangePassword={() => setShowChangePasswordModal(true)}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isDemoActive={isDemoActive}
          demoCount={demoCount}
          isProcessingDemo={isProcessingDemo}
          onGenerateDemo={handleGenerateDemo}
          onOpenDeleteDemo={() => setShowDeleteDemoModal(true)}
          onSelectLead={(id) => setSelectedLeadId(id)}
          refreshKey={refreshKey}
          onLogout={onLogout}
        />

        {/* Conteúdo Principal com Rolagem Suave */}
        <main
          className={`flex-1 overflow-y-auto w-full transition-all duration-300 ${
            activeTab === 'pipeline' || activeTab === 'whatsapp' ? 'max-w-[1920px] px-3 sm:px-6 py-4' : 'max-w-7xl mx-auto p-4 sm:p-8'
          }`}
        >
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

            {activeTab === 'whatsapp' && (
              <WhatsAppAgentView leads={leads} />
            )}

            {activeTab === 'agents' && (
              <AgentsMarketplaceView activeTenant={activeTenant} />
            )}
          </>
        )}
      </main>
      </div>

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

      {/* Modal Executivo de Ajustes do Agente IA, Empresa & WhatsApp */}
      <AgentSettingsModal
        isOpen={showAgentSettingsModal}
        onClose={() => setShowAgentSettingsModal(false)}
      />

      {/* Modal Hub de Webhooks & Inbound Ads */}
      <WebhookHubModal
        isOpen={showWebhookHubModal}
        onClose={() => setShowWebhookHubModal(false)}
        onLeadCreated={() => {
          loadData();
          setRefreshKey((k) => k + 1);
        }}
      />

      {/* Modal de Time Comercial & Round Robin */}
      <SalesTeamModal
        isOpen={showSalesTeamModal}
        onClose={() => setShowSalesTeamModal(false)}
        onTeamUpdated={() => {
          loadData();
          setRefreshKey((k) => k + 1);
        }}
      />

      {/* Modal Master de Clientes Corporativos & MRR */}
      <TenantMasterModal
        isOpen={showTenantMasterModal}
        onClose={() => setShowTenantMasterModal(false)}
        onSelectTenant={(tenant) => {
          setActiveTenant(tenant);
          loadData();
          setRefreshKey((k) => k + 1);
        }}
      />

      {/* Modal Voice Studio & Clonagem de Voz PTT */}
      <VoiceStudioModal
        isOpen={showVoiceStudioModal}
        onClose={() => setShowVoiceStudioModal(false)}
      />

      {/* Toast de Feedback Demo */}
      {demoFeedback && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 font-mono text-xs ${
              demoFeedback.type === 'success'
                ? 'bg-[#0A1D2B] border-emerald-500/40 text-emerald-300'
                : 'bg-[#2B0A12] border-rose-500/40 text-rose-300'
            }`}
          >
            {demoFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{demoFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Modal de Confirmação para Excluir Todos os Fakes */}
      {showDeleteDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#091524] border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold block">
                GERENCIAMENTO DE REGISTROS
              </span>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                Excluir Registros da Base?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Esta ação removerá os <strong className="text-white">{demoCount} registros</strong> criados para demonstração,
                além das oportunidades associadas em cada etapa do pipeline, follow-ups e métricas de teste.
              </p>
              <p className="text-[11px] text-emerald-400/80 font-mono">
                Seus leads e dados comerciais reais não serão afetados.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isProcessingDemo}
                onClick={() => setShowDeleteDemoModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isProcessingDemo}
                onClick={handleClearDemo}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                {isProcessingDemo ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{isProcessingDemo ? 'Excluindo...' : 'Sim, Excluir Registros'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
