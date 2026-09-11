// src/components/dashboard/tenants/TenantMasterModal.tsx
// Gestão Executiva de Empresas Clientes, Contratos e Receita Recorrente (MRR)

import React, { useState } from 'react';
import {
  X,
  Building,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Plus,
  Search,
  BarChart3,
  Mic,
  Pause,
  Play,
  Layers,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Sliders,
  Check,
} from 'lucide-react';
import {
  Tenant,
  TenantPlan,
  TenantStatus,
  getStoredTenants,
  saveTenant,
  toggleTenantStatus,
  toggleTenantAgentActive,
  getActiveTenantId,
  setActiveTenantId,
  calculateGlobalTenantSummary,
} from '../../../services/tenants/tenantService';

interface TenantMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTenant?: (tenant: Tenant) => void;
}

export const TenantMasterModal: React.FC<TenantMasterModalProps> = ({
  isOpen,
  onClose,
  onSelectTenant,
}) => {
  const [tenants, setTenants] = useState<Tenant[]>(getStoredTenants());
  const [activeTenantId, setActiveTenantIdState] = useState<string>(getActiveTenantId());
  const [activeModalTab, setActiveModalTab] = useState<'list' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'suspended'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State para Novo Cliente
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newTradingName, setNewTradingName] = useState('');
  const [newCnpj, setNewCnpj] = useState('');
  const [newSegment, setNewSegment] = useState<Tenant['segment']>('clinics');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newPlan, setNewPlan] = useState<TenantPlan>('pro');
  const [newMonthlyFee, setNewMonthlyFee] = useState(1900);
  const [newSetupFee, setNewSetupFee] = useState(3500);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const summary = calculateGlobalTenantSummary();

  const handleSelectTenant = (tenant: Tenant) => {
    setActiveTenantId(tenant.id);
    setActiveTenantIdState(tenant.id);
    if (onSelectTenant) onSelectTenant(tenant);
    showToast(`Ambiente alternado para "${tenant.tradingName}".`);
    onClose();
  };

  const handleToggleStatus = (tenantId: string) => {
    const updated = toggleTenantStatus(tenantId);
    if (updated) {
      setTenants(getStoredTenants());
      showToast(`Status da empresa alterado para ${updated.status === 'active' ? 'Ativo' : 'Pausado'}.`);
    }
  };

  const handleToggleAgent = (tenantId: string) => {
    const updated = toggleTenantAgentActive(tenantId);
    if (updated) {
      setTenants(getStoredTenants());
      showToast(`Atendimento digital ${updated.agentActive ? 'ATIVADO' : 'PAUSADO'} para esta conta.`);
    }
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const segmentLabels: Record<Tenant['segment'], string> = {
      clinics: 'Clínicas Médicas & Odontologia',
      real_estate: 'Imobiliárias & Alto Padrão',
      b2b_software: 'B2B Enterprise & Software',
      digital_sales: 'Vendas Digitais & Tráfego Pago',
      legal: 'Advocacia & Jurídico',
      services: 'Serviços Especializados',
      other: 'Corporativo Geral',
    };

    const planNames: Record<TenantPlan, string> = {
      starter: 'Starter Pilot',
      pro: 'Pro Business',
      enterprise: 'Scale Enterprise',
      custom: 'Enterprise Custom',
    };

    const created = saveTenant({
      name: newCompanyName,
      tradingName: newTradingName || newCompanyName,
      cnpjOrCpf: newCnpj,
      segment: newSegment,
      segmentLabel: segmentLabels[newSegment],
      contactName: newContactName,
      contactEmail: newContactEmail,
      contactPhone: newContactPhone,
      plan: newPlan,
      planName: `${planNames[newPlan]} (R$ ${newMonthlyFee.toLocaleString('pt-BR')}/mês)`,
      monthlyFee: Number(newMonthlyFee),
      setupFeePaid: Number(newSetupFee),
      status: 'active',
      agentActive: true,
      whatsappConnected: true,
    });

    setTenants(getStoredTenants());
    setActiveModalTab('list');
    showToast(`Empresa "${created.tradingName}" cadastrada com sucesso!`);

    // Reset Form
    setNewCompanyName('');
    setNewTradingName('');
    setNewCnpj('');
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tradingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.segmentLabel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#091524] border border-slate-800 rounded-2xl shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden">
        {/* Toast Notificação */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-50 px-4 py-2 bg-emerald-600 border border-emerald-500 text-white text-xs font-medium rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Cabeçalho Executivo com Abas Limpas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#07111F] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#00D2F6]">
              <Building className="w-5 h-5 text-[#00D2F6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Contas & Faturamento
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-medium">
                  {tenants.length} Empresas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gerenciamento de clientes corporativos, mensalidades recorrentes e parâmetros de atendimento
              </p>
            </div>
          </div>

          {/* Seletor de Abas & Fechar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveModalTab('list')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                  activeModalTab === 'list'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Empresas Cadastradas
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('create')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeModalTab === 'create'
                    ? 'bg-[#00D2F6] text-[#07111F] font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Empresa</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo da Aba: Lista de Clientes */}
        {activeModalTab === 'list' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* 4 Cards de Métricas Financeiras & Operacionais */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-5 bg-slate-950/40 border-b border-slate-800/80">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Receita Mensal (MRR)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  R$ {summary.totalMrr.toLocaleString('pt-BR')},00
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span>R$ {summary.totalSetupRevenue.toLocaleString('pt-BR')} em implantações</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Empresas Ativas</span>
                  <Building className="w-4 h-4 text-[#00D2F6]" />
                </div>
                <div className="text-lg font-bold text-white">
                  {summary.activeTenantsCount} <span className="text-xs font-normal text-slate-400">/ {summary.totalTenants} contas</span>
                </div>
                <div className="text-[11px] text-cyan-300 mt-1">
                  {summary.trialTenantsCount > 0 ? `${summary.trialTenantsCount} em período de avaliação` : 'Todas em dia'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Leads Processados</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-lg font-bold text-slate-100 font-mono">
                  {summary.totalLeadsThisMonth.toLocaleString('pt-BR')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Neste ciclo mensal
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Mensagens de Voz</span>
                  <Mic className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-purple-300 font-mono">
                  {summary.totalAudiosSentThisMonth}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Áudios consultivos enviados
                </div>
              </div>
            </div>

            {/* Barra de Filtro e Busca */}
            <div className="px-6 py-3 bg-[#07111F] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por empresa, segmento ou contato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6]"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                    statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas ({tenants.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                    statusFilter === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ativas
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('trial')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                    statusFilter === 'trial' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Trial
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('suspended')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                    statusFilter === 'suspended' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pausadas
                </button>
              </div>
            </div>

            {/* Lista com Rolagem Confortável e Visibilidade Total */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 min-h-[300px] max-h-[50vh]">
              {filteredTenants.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Nenhuma empresa encontrada com os filtros selecionados.
                </div>
              ) : (
                filteredTenants.map((tenant) => {
                  const isCurrent = tenant.id === activeTenantId;
                  const usagePercent = Math.min(
                    100,
                    Math.round((tenant.usage.leadsProcessedMonth / tenant.usage.maxLeadsAllowed) * 100)
                  );

                  return (
                    <div
                      key={tenant.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-slate-900/90 border-[#00D2F6]/60 shadow-lg'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Informações da Empresa */}
                        <div className="space-y-1.5 flex-1 min-w-[280px]">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              {tenant.tradingName}
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-[#00D2F6] text-[#07111F] text-[10px] font-bold">
                                  AMBIENTE ATIVO
                                </span>
                              )}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 font-medium">
                              {tenant.segmentLabel}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                tenant.status === 'active'
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : tenant.status === 'trial'
                                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {tenant.status === 'active' ? 'Ativo' : tenant.status === 'trial' ? 'Avaliação' : 'Pausado'}
                            </span>
                          </div>

                          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span>{tenant.name}</span>
                            {tenant.cnpjOrCpf && <span className="font-mono">CNPJ: {tenant.cnpjOrCpf}</span>}
                            <span>Contato: {tenant.contactName} ({tenant.contactPhone})</span>
                          </div>

                          {tenant.customNotes && (
                            <p className="text-[11px] text-slate-400/90 italic">
                              "{tenant.customNotes}"
                            </p>
                          )}
                        </div>

                        {/* Plano, Finanças e Consumo */}
                        <div className="flex flex-wrap items-center gap-4 text-xs min-w-[260px] bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Mensalidade</div>
                            <div className="text-white font-bold font-mono">
                              {tenant.monthlyFee > 0 ? `R$ ${tenant.monthlyFee.toLocaleString('pt-BR')}/mês` : 'Operação Matriz'}
                            </div>
                            <div className="text-[10px] text-slate-400">Vencimento: {tenant.nextBillingDate}</div>
                          </div>

                          <div className="flex-1 min-w-[120px]">
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                              <span>Capacidade: {tenant.usage.leadsProcessedMonth} / {tenant.usage.maxLeadsAllowed}</span>
                              <span className="font-mono">{usagePercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  usagePercent > 85 ? 'bg-rose-400' : 'bg-[#00D2F6]'
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                              <Mic className="w-2.5 h-2.5 text-purple-400" />
                              <span>{tenant.usage.audioMessagesSent} áudios enviados</span>
                            </div>
                          </div>
                        </div>

                        {/* Ações Rápidas */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isCurrent ? (
                            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700">
                              <Check className="w-3.5 h-3.5 text-[#00D2F6]" />
                              Visualizando
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectTenant(tenant)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-[#00D2F6] hover:text-[#07111F] text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                              title="Alternar para este cliente e ver os dados no CRM"
                            >
                              <span>Acessar CRM</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleAgent(tenant.id)}
                            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                              tenant.agentActive
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title={tenant.agentActive ? 'Atendimento Digital Ativo (Clique para pausar)' : 'Atendimento Pausado'}
                          >
                            <Sliders className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(tenant.id)}
                            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                              tenant.status === 'active'
                                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                            }`}
                            title={tenant.status === 'active' ? 'Pausar Conta da Empresa' : 'Reativar Conta'}
                          >
                            {tenant.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Conteúdo da Aba: Cadastrar Nova Empresa */}
        {activeModalTab === 'create' && (
          <form onSubmit={handleCreateTenant} className="p-6 overflow-y-auto space-y-6 max-h-[70vh]">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white">
                Cadastrar Nova Empresa Cliente
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Preencha os dados do cliente para provisionar a esteira comercial e os parâmetros de atendimento.
              </p>
            </div>

            {/* Grupo 1: Dados da Empresa */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                1. Identificação da Empresa
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Razão Social / Nome Oficial</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Clínica Odonto Vida Ltda"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Nome Fantasia / Marca</label>
                  <input
                    type="text"
                    placeholder="Ex: Odonto Vida"
                    value={newTradingName}
                    onChange={(e) => setNewTradingName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Nicho / Segmento</label>
                  <select
                    value={newSegment}
                    onChange={(e) => setNewSegment(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#00D2F6]"
                  >
                    <option value="clinics">Clínicas Médicas & Odontologia</option>
                    <option value="real_estate">Imobiliárias & Corretores</option>
                    <option value="b2b_software">B2B Enterprise & Software</option>
                    <option value="digital_sales">Vendas Digitais & Tráfego</option>
                    <option value="legal">Advocacia & Jurídico</option>
                    <option value="services">Serviços Especializados</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">CNPJ ou CPF</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={newCnpj}
                    onChange={(e) => setNewCnpj(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>
              </div>
            </div>

            {/* Grupo 2: Contato Principal */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                2. Contato do Responsável
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Nome do Decisor</label>
                  <input
                    type="text"
                    placeholder="Ex: Dra. Mariana Silva"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">E-mail Comercial</label>
                  <input
                    type="email"
                    placeholder="contato@empresa.com.br"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">WhatsApp Comercial</label>
                  <input
                    type="text"
                    placeholder="+55 11 99999-9999"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>
              </div>
            </div>

            {/* Grupo 3: Plano Comercial & Mensalidade */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                3. Plano & Faturamento
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Plano Contratado</label>
                  <select
                    value={newPlan}
                    onChange={(e) => {
                      const p = e.target.value as TenantPlan;
                      setNewPlan(p);
                      if (p === 'starter') setNewMonthlyFee(990);
                      if (p === 'pro') setNewMonthlyFee(1900);
                      if (p === 'enterprise') setNewMonthlyFee(3500);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#00D2F6]"
                  >
                    <option value="starter">Starter Pilot (R$ 990/mês)</option>
                    <option value="pro">Pro Business (R$ 1.900/mês)</option>
                    <option value="enterprise">Scale Enterprise (R$ 3.500/mês)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Mensalidade (R$)</label>
                  <input
                    type="number"
                    value={newMonthlyFee}
                    onChange={(e) => setNewMonthlyFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Taxa de Setup / Implantação (R$)</label>
                  <input
                    type="number"
                    value={newSetupFee}
                    onChange={(e) => setNewSetupFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>
              </div>
            </div>

            {/* Ações do Formulário */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModalTab('list')}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Voltar à Lista
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] text-xs font-semibold shadow-lg transition-all cursor-pointer"
              >
                Cadastrar & Provisionar Empresa
              </button>
            </div>
          </form>
        )}

        {/* Rodapé Fixo */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#07111F] flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Isolamento seguro de dados: cada empresa opera em seu próprio funil e banco de dados.</span>
          </div>
          <div>
            Ambiente selecionado: <strong className="text-white">{tenants.find((t) => t.id === activeTenantId)?.tradingName}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
