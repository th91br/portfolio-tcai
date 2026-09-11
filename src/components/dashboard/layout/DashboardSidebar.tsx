// src/components/dashboard/layout/DashboardSidebar.tsx
// Sidebar Lateral Recolhível de Nível Enterprise (Inspirada no Linear / Vercel / Raycast)

import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Users,
  Clock,
  BarChart3,
  Building,
  Mic,
  Radio,
  Sliders,
  KeyRound,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Flame,
  Shield,
  Briefcase,
  X,
} from 'lucide-react';

export type DashboardTabKey =
  | 'overview'
  | 'pipeline'
  | 'followups'
  | 'leads'
  | 'analytics'
  | 'whatsapp'
  | 'agents';

export type DashboardModalKey =
  | 'tenants'
  | 'voice'
  | 'webhooks'
  | 'team'
  | 'settings'
  | 'password'
  | 'demo';

interface DashboardSidebarProps {
  activeTab: DashboardTabKey;
  onSelectTab: (tab: DashboardTabKey) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenModal: (modal: DashboardModalKey) => void;
  newLeadsCount?: number;
  overdueFollowUpsCount?: number;
  activeTenantName?: string;
  onLogout: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onOpenModal,
  newLeadsCount = 0,
  overdueFollowUpsCount = 0,
  activeTenantName = 'TCAI Matriz',
  onLogout,
}) => {
  const handleItemClick = (action: () => void) => {
    action();
    if (isMobileOpen) onCloseMobile();
  };

  return (
    <>
      {/* Overlay Escurecido para Mobile */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Container Principal da Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#07111F] border-r border-slate-800/80 transition-all duration-300 select-none ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'}`}
      >
        {/* Cabeçalho da Sidebar */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="/logo_tca.png"
              alt="Logo TCA"
              className="h-7 w-auto object-contain flex-shrink-0 drop-shadow-[0_2px_8px_rgba(0,210,246,0.3)]"
            />
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white tracking-wider uppercase font-sans">
                  TCAI COMERCIAL
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  Motor de Vendas B2B
                </span>
              </div>
            )}
          </div>

          {/* Botão de Fechar no Mobile */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Botão de Recolher/Expandir no Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Busca Rápida Estilo ⌘K */}
        {(!isCollapsed || isMobileOpen) ? (
          <div className="px-3 pt-3 pb-1">
            <div
              onClick={() => onSelectTab('leads')}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Buscar...</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                ⌘K
              </span>
            </div>
          </div>
        ) : (
          <div className="py-3 flex justify-center">
            <button
              onClick={() => onSelectTab('leads')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              title="Buscar (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Lista de Navegação por Grupos */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Grupo 1: Comercial */}
          <div className="space-y-1">
            {(!isCollapsed || isMobileOpen) && (
              <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Comercial
              </span>
            )}

            {/* Visão Geral */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('overview'))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              title="Painel Geral"
            >
              <LayoutDashboard className={`w-4 h-4 flex-shrink-0 ${activeTab === 'overview' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
              {(!isCollapsed || isMobileOpen) && <span>Painel Geral</span>}
            </button>

            {/* Atendimento WhatsApp */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('whatsapp'))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              title="Atendimento WhatsApp"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeTab === 'whatsapp' ? 'text-emerald-400' : 'text-slate-400'}`} />
                {(!isCollapsed || isMobileOpen) && <span>Atendimento WhatsApp</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Funis de Vendas */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('pipeline'))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              title="Funis de Vendas (Kanban)"
            >
              <Kanban className={`w-4 h-4 flex-shrink-0 ${activeTab === 'pipeline' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
              {(!isCollapsed || isMobileOpen) && <span>Funis de Vendas</span>}
            </button>

            {/* Oportunidades & Leads */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('leads'))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              title="Oportunidades & Leads"
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'leads' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
                {(!isCollapsed || isMobileOpen) && <span>Oportunidades & Leads</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && newLeadsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#07111F] text-[10px] font-bold">
                  {newLeadsCount}
                </span>
              )}
            </button>

            {/* Compromissos & Agenda */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('followups'))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'followups'
                  ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              title="Compromissos & Agenda"
            >
              <div className="flex items-center gap-3">
                <Clock className={`w-4 h-4 flex-shrink-0 ${activeTab === 'followups' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
                {(!isCollapsed || isMobileOpen) && <span>Compromissos & Agenda</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && overdueFollowUpsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {overdueFollowUpsCount}
                </span>
              )}
            </button>

            {/* Métricas & Conversão */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('analytics'))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              title="Métricas & Conversão"
            >
              <BarChart3 className={`w-4 h-4 flex-shrink-0 ${activeTab === 'analytics' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
              {(!isCollapsed || isMobileOpen) && <span>Métricas & Conversão</span>}
            </button>
          </div>

          {/* Grupo 2: Empresas & Gestão */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            {(!isCollapsed || isMobileOpen) && (
              <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Empresas & Gestão
              </span>
            )}

            {/* Equipe Digital (Especialistas 24h) */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('agents'))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'agents'
                  ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              title="Equipe Digital (Especialistas 24h)"
            >
              <div className="flex items-center gap-3">
                <Sparkles className={`w-4 h-4 flex-shrink-0 ${activeTab === 'agents' ? 'text-[#00D2F6]' : 'text-amber-400'}`} />
                {(!isCollapsed || isMobileOpen) && <span>Equipe Digital</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#00D2F6]/15 text-[#00D2F6] text-[10px] font-bold border border-[#00D2F6]/30">
                  24h
                </span>
              )}
            </button>

            {/* Contas & Faturamento (MRR) */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onOpenModal('tenants'))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
              }`}
              title="Contas & Faturamento (MRR)"
            >
              <Building className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>Contas & Faturamento</span>}
            </button>

            {/* Equipe Comercial */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onOpenModal('team'))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
              }`}
              title="Equipe Comercial & Distribuição"
            >
              <Users className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>Equipe & Vendedores</span>}
            </button>
          </div>

          {/* Grupo 3: Canais & Automações */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            {(!isCollapsed || isMobileOpen) && (
              <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Canais & Configurações
              </span>
            )}

            {/* Mensagens de Voz */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onOpenModal('voice'))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
              }`}
              title="Mensagens de Voz & Timbre Comercial"
            >
              <Mic className="w-4 h-4 text-purple-400 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>Mensagens de Voz</span>}
            </button>

            {/* Entrada de Leads (Webhooks) */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onOpenModal('webhooks'))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
              }`}
              title="Entrada de Leads (Webhooks & Ads)"
            >
              <Radio className="w-4 h-4 text-purple-400 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>Entrada de Leads (Ads)</span>}
            </button>

            {/* Ajustes de Atendimento */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onOpenModal('settings'))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
              }`}
              title="Ajustes de Atendimento & Horários"
            >
              <Sliders className="w-4 h-4 text-[#00D2F6] flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>Ajustes de Atendimento</span>}
            </button>
          </div>
        </div>

        {/* Rodapé da Sidebar: Segurança, Portfólio & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-1">
          {/* Trocar Senha */}
          <button
            type="button"
            onClick={() => handleItemClick(() => onOpenModal('password'))}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
            }`}
            title="Segurança & Senha"
          >
            <KeyRound className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Segurança & Senha</span>}
          </button>

          {/* Ver Portfólio */}
          <a
            href="/"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
            }`}
            title="Ver Portfólio"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Ver Portfólio</span>}
          </a>

          {/* Sair */}
          <button
            type="button"
            onClick={() => handleItemClick(onLogout)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
            }`}
            title="Encerrar Sessão"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Encerrar Sessão</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
