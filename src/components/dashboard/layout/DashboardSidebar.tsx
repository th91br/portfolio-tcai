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
        {isCollapsed && !isMobileOpen ? (
          <div className="h-16 flex items-center justify-center border-b border-slate-800/80">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800/80 transition-all text-slate-400 hover:text-white group cursor-pointer relative"
              title="Expandir barra lateral"
            >
              <img
                src="/logo_tca.png"
                alt="Logo TCA"
                className="h-7 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-[0_2px_8px_rgba(0,210,246,0.3)]"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#07111F] border border-slate-700 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <ChevronRight className="w-2.5 h-2.5 text-[#00D2F6]" />
              </div>
            </button>
          </div>
        ) : (
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src="/logo_tca.png"
                alt="Logo TCA"
                className="h-7 w-auto object-contain flex-shrink-0 drop-shadow-[0_2px_8px_rgba(0,210,246,0.3)]"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white tracking-wider uppercase font-sans">
                  TCAI COMERCIAL
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  Motor de Vendas B2B
                </span>
              </div>
            </div>

            {/* Botão de Fechar no Mobile */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Botão de Recolher no Desktop */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Recolher barra lateral"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

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
          <div className="py-2.5 flex justify-center">
            <button
              type="button"
              onClick={() => onSelectTab('leads')}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Buscar (⌘K)"
            >
              <Search className="w-4 h-4 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Lista de Navegação por Grupos */}
        <div
          className={`flex-1 py-2 space-y-4 ${
            isCollapsed && !isMobileOpen
              ? 'px-0 overflow-y-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              : 'px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800'
          }`}
        >
          {/* Grupo 1: Comercial */}
          <div className={`space-y-1 ${isCollapsed && !isMobileOpen ? 'w-full flex flex-col items-center' : ''}`}>
            {(!isCollapsed || isMobileOpen) ? (
              <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Comercial
              </span>
            ) : (
              <div className="my-1.5 w-8 h-[1px] bg-slate-800/80 mx-auto" />
            )}

            {/* Visão Geral */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('overview'))}
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? `w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative ${
                      activeTab === 'overview'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 shadow-[0_0_12px_rgba(0,210,246,0.15)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`
                  : `w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                      activeTab === 'overview'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
              }`}
              title="Painel Geral"
            >
              <LayoutDashboard className={`w-4 h-4 flex-shrink-0 ${activeTab === 'overview' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
              {(!isCollapsed || isMobileOpen) && <span>Painel Geral</span>}
            </button>

            {/* Atendimento WhatsApp */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('whatsapp'))}
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? `w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative ${
                      activeTab === 'whatsapp'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`
                  : `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                      activeTab === 'whatsapp'
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
              }`}
              title="Atendimento WhatsApp"
            >
              {isCollapsed && !isMobileOpen ? (
                <>
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeTab === 'whatsapp' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeTab === 'whatsapp' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>Atendimento WhatsApp</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </>
              )}
            </button>

            {/* Funis de Vendas */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('pipeline'))}
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? `w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative ${
                      activeTab === 'pipeline'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 shadow-[0_0_12px_rgba(0,210,246,0.15)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`
                  : `w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                      activeTab === 'pipeline'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
              }`}
              title="Funis de Vendas (Kanban)"
            >
              <Kanban className={`w-4 h-4 flex-shrink-0 ${activeTab === 'pipeline' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
              {(!isCollapsed || isMobileOpen) && <span>Funis de Vendas</span>}
            </button>

            {/* Oportunidades & Leads */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('leads'))}
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? `w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative ${
                      activeTab === 'leads'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 shadow-[0_0_12px_rgba(0,210,246,0.15)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`
                  : `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                      activeTab === 'leads'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
              }`}
              title="Oportunidades & Leads"
            >
              {isCollapsed && !isMobileOpen ? (
                <>
                  <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'leads' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
                  {newLeadsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-[#07111F] text-[9px] font-bold flex items-center justify-center shadow">
                      {newLeadsCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'leads' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
                    <span>Oportunidades & Leads</span>
                  </div>
                  {newLeadsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#07111F] text-[10px] font-bold">
                      {newLeadsCount}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Compromissos & Agenda */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('followups'))}
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? `w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative ${
                      activeTab === 'followups'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 shadow-[0_0_12px_rgba(0,210,246,0.15)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`
                  : `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                      activeTab === 'followups'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
              }`}
              title="Compromissos & Agenda"
            >
              {isCollapsed && !isMobileOpen ? (
                <>
                  <Clock className={`w-4 h-4 flex-shrink-0 ${activeTab === 'followups' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
                  {overdueFollowUpsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow">
                      {overdueFollowUpsCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Clock className={`w-4 h-4 flex-shrink-0 ${activeTab === 'followups' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
                    <span>Compromissos & Agenda</span>
                  </div>
                  {overdueFollowUpsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {overdueFollowUpsCount}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Métricas & Conversão */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('analytics'))}
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? `w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative ${
                      activeTab === 'analytics'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 shadow-[0_0_12px_rgba(0,210,246,0.15)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`
                  : `w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                      activeTab === 'analytics'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
              }`}
              title="Métricas & Conversão"
            >
              <BarChart3 className={`w-4 h-4 flex-shrink-0 ${activeTab === 'analytics' ? 'text-[#00D2F6]' : 'text-slate-400'}`} />
              {(!isCollapsed || isMobileOpen) && <span>Métricas & Conversão</span>}
            </button>
          </div>

          {/* Grupo 2: Empresas & Gestão */}
          <div className={`space-y-1 ${isCollapsed && !isMobileOpen ? 'w-full flex flex-col items-center' : ''}`}>
            {(!isCollapsed || isMobileOpen) ? (
              <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pt-2 border-t border-slate-800/60">
                Empresas & Gestão
              </span>
            ) : (
              <div className="my-1.5 w-8 h-[1px] bg-slate-800/80 mx-auto" />
            )}

            {/* Equipe & Atendentes (Especialistas 24h + Vendedores) */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onSelectTab('agents'))}
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? `w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative ${
                      activeTab === 'agents'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 shadow-[0_0_12px_rgba(0,210,246,0.15)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`
                  : `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                      activeTab === 'agents'
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
              }`}
              title="Equipe & Atendentes (Especialistas 24h e Vendedores)"
            >
              {isCollapsed && !isMobileOpen ? (
                <>
                  <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'agents' ? 'text-[#00D2F6]' : 'text-cyan-400'}`} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'agents' ? 'text-[#00D2F6]' : 'text-cyan-400'}`} />
                    <span>Equipe & Atendentes</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#00D2F6]/15 text-[#00D2F6] text-[10px] font-bold border border-[#00D2F6]/30">
                    Híbrido
                  </span>
                </>
              )}
            </button>

            {/* Contas & Faturamento (MRR) */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onOpenModal('tenants'))}
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? 'w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  : 'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
              title="Contas & Faturamento (MRR)"
            >
              <Building className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>Contas & Faturamento</span>}
            </button>
          </div>

          {/* Grupo 3: Canais & Automações */}
          <div className={`space-y-1 ${isCollapsed && !isMobileOpen ? 'w-full flex flex-col items-center' : ''}`}>
            {(!isCollapsed || isMobileOpen) ? (
              <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pt-2 border-t border-slate-800/60">
                Canais & Configurações
              </span>
            ) : (
              <div className="my-1.5 w-8 h-[1px] bg-slate-800/80 mx-auto" />
            )}

            {/* Mensagens de Voz */}
            <button
              type="button"
              onClick={() => handleItemClick(() => onOpenModal('voice'))}
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? 'w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  : 'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white'
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
              className={`transition-all cursor-pointer ${
                isCollapsed && !isMobileOpen
                  ? 'w-10 h-10 mx-auto flex items-center justify-center rounded-xl relative text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  : 'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
              title="Entrada de Leads (Webhooks & Ads)"
            >
              <Radio className="w-4 h-4 text-purple-400 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>Entrada de Leads (Ads)</span>}
            </button>
          </div>
        </div>

        {/* Rodapé da Sidebar: Segurança, Portfólio & Logout */}
        <div className={`border-t border-slate-800/80 bg-slate-950/40 space-y-1 ${isCollapsed && !isMobileOpen ? 'p-2 flex flex-col items-center' : 'p-3'}`}>
          {/* Trocar Senha */}
          <button
            type="button"
            onClick={() => handleItemClick(() => onOpenModal('password'))}
            className={`transition-colors cursor-pointer ${
              isCollapsed && !isMobileOpen
                ? 'w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60'
                : 'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Segurança & Senha"
          >
            <KeyRound className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Segurança & Senha</span>}
          </button>

          {/* Ver Portfólio */}
          <a
            href="/"
            className={`transition-colors flex items-center ${
              isCollapsed && !isMobileOpen
                ? 'w-10 h-10 mx-auto justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60'
                : 'w-full gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60'
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
            className={`transition-colors cursor-pointer ${
              isCollapsed && !isMobileOpen
                ? 'w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-rose-400 hover:bg-rose-500/10'
                : 'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10'
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
