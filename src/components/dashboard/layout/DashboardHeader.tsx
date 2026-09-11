// src/components/dashboard/layout/DashboardHeader.tsx
// Topbar Executiva Limpa, Humanizada e Sem Poluição (Substitui os 12 botões horizontais)

import React, { useState, useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import {
  Menu,
  Building,
  ChevronDown,
  Sparkles,
  Trash2,
  KeyRound,
  ExternalLink,
  LogOut,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { Tenant, setActiveTenantId } from '../../../services/tenants/tenantService';
import { NotificationsCenter } from '../notifications/NotificationsCenter';
import { DashboardTabKey } from './DashboardSidebar';

interface DashboardHeaderProps {
  user: User;
  activeTab: DashboardTabKey;
  activeTenant: Tenant;
  allTenants: Tenant[];
  onSelectTenant: (tenant: Tenant) => void;
  onOpenTenantMaster: () => void;
  onOpenChangePassword: () => void;
  onToggleMobileMenu: () => void;
  isDemoActive: boolean;
  demoCount: number;
  isProcessingDemo: boolean;
  onGenerateDemo: () => void;
  onOpenDeleteDemo: () => void;
  onSelectLead: (leadId: string) => void;
  refreshKey: number;
  onLogout: () => void;
}

const TAB_TITLES: Record<DashboardTabKey, { section: string; title: string }> = {
  overview: { section: 'Comercial', title: 'Painel Geral' },
  whatsapp: { section: 'Comercial', title: 'Atendimento WhatsApp' },
  pipeline: { section: 'Comercial', title: 'Funis de Vendas' },
  leads: { section: 'Comercial', title: 'Oportunidades & Leads' },
  followups: { section: 'Comercial', title: 'Compromissos & Agenda' },
  analytics: { section: 'Comercial', title: 'Métricas & Conversão' },
  agents: { section: 'Empresas & Gestão', title: 'Equipe Digital' },
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  activeTab,
  activeTenant,
  allTenants,
  onSelectTenant,
  onOpenTenantMaster,
  onOpenChangePassword,
  onToggleMobileMenu,
  isDemoActive,
  demoCount,
  isProcessingDemo,
  onGenerateDemo,
  onOpenDeleteDemo,
  onSelectLead,
  refreshKey,
  onLogout,
}) => {
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tenantMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Fecha menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tenantMenuRef.current && !tenantMenuRef.current.contains(e.target as Node)) {
        setShowTenantMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentNav = TAB_TITLES[activeTab] || { section: 'Comercial', title: 'Painel' };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#07111F]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Esquerda: Menu Mobile + Breadcrumb da Tela */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          title="Abrir Menu de Navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">{currentNav.section}</span>
          <span className="text-slate-400 hidden sm:inline">/</span>
          <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            {currentNav.title}
          </h1>
        </div>
      </div>

      {/* Centro: Status Operacional Silencioso */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Operação Sincronizada</span>
      </div>

      {/* Direita: Seletor de Tenant, Notificações e Perfil */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Seletor Elegante de Empresa / Tenant */}
        <div className="relative" ref={tenantMenuRef}>
          <button
            type="button"
            onClick={() => setShowTenantMenu(!showTenantMenu)}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Alternar entre empresas clientes"
          >
            <Building className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="max-w-[120px] sm:max-w-[170px] truncate text-white">
              {activeTenant.tradingName}
            </span>
            <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
              {activeTenant.status === 'active' ? 'Ativo' : 'Trial'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Menu Dropdown de Tenants */}
          {showTenantMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-[#091524] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80 mb-1 flex items-center justify-between">
                <span>Empresas Cadastradas</span>
                <span>{allTenants.length}</span>
              </div>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {allTenants.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setActiveTenantId(t.id);
                      onSelectTenant(t);
                      setShowTenantMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      t.id === activeTenant.id
                        ? 'bg-[#00D2F6]/15 text-[#00D2F6] font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate">{t.tradingName}</span>
                      <span className="text-[10px] text-slate-400">{t.segmentLabel}</span>
                    </div>
                    {t.id === activeTenant.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6] flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div className="pt-2 mt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowTenantMenu(false);
                    onOpenTenantMaster();
                  }}
                  className="w-full px-3 py-1.5 rounded-xl text-xs text-center text-[#00D2F6] hover:bg-[#00D2F6]/10 font-semibold transition-colors cursor-pointer"
                >
                  Gerenciar Todas as Contas & MRR
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Central de Notificações */}
        <NotificationsCenter onSelectLead={onSelectLead} refreshTrigger={refreshKey} />

        {/* Menu do Perfil do Thiago (Substitui botões soltos de Demonstração, Trocar Senha e Logout) */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D2F6]/20 to-[#015EEF]/30 border border-slate-700 hover:border-[#00D2F6]/50 flex items-center justify-center text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Menu do Usuário"
          >
            TC
          </button>

          {/* Menu Dropdown de Perfil */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#091524] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                <p className="text-xs font-semibold text-white truncate">
                  Thiago Cassol Antunes
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user.email}
                </p>
              </div>

              {/* Ação de Demonstração Comercial */}
              <div className="py-1">
                {isDemoActive ? (
                  <button
                    type="button"
                    disabled={isProcessingDemo}
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenDeleteDemo();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {isProcessingDemo ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>Excluir Registros de Teste ({demoCount})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isProcessingDemo}
                    onClick={() => {
                      setShowProfileMenu(false);
                      onGenerateDemo();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {isProcessingDemo ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    )}
                    <span>Popular Demonstração</span>
                  </button>
                )}
              </div>

              <div className="pt-1 border-t border-slate-800 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenChangePassword();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  <span>Segurança & Senha</span>
                </button>

                <a
                  href="/"
                  className="w-full px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Ver Portfólio Público</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Encerrar Sessão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
