// src/components/dashboard/tenants/TenantMasterModal.tsx
// Modal Executivo Master de Gestão Multi-Tenant, Controle de MRR e Clientes B2B

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
  Smartphone,
  Plus,
  Search,
  Filter,
  BarChart3,
  Cpu,
  Mic,
  Pause,
  Play,
  Layers,
  ArrowRight,
  TrendingUp,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'suspended'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
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
  };

  const handleToggleStatus = (tenantId: string) => {
    const updated = toggleTenantStatus(tenantId);
    if (updated) {
      setTenants(getStoredTenants());
      showToast(`Status da empresa alterado para ${updated.status.toUpperCase()}.`);
    }
  };

  const handleToggleAgent = (tenantId: string) => {
    const updated = toggleTenantAgentActive(tenantId);
    if (updated) {
      setTenants(getStoredTenants());
      showToast(`Agente ${updated.agentActive ? 'ATIVADO' : 'PAUSADO'} para esta conta.`);
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
      services: 'Serviços & Negócios Locais',
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
    setShowCreateForm(false);
    showToast(`Nova empresa cliente "${created.tradingName}" cadastrada com sucesso!`);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#091524] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Toast Notificação */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-50 px-4 py-2 bg-emerald-500/90 border border-emerald-400 text-white text-xs font-mono rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Cabeçalho do SuperAdmin */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#07111F]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-[#00D2F6]/20 border border-[#00D2F6]/30 text-[#00D2F6]">
              <Building className="w-6 h-6 text-[#00D2F6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Gestão Master de Clientes & MRR
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[10px] font-mono text-[#00D2F6] font-bold">
                  SUPERADMIN HUB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Controle de empresas clientes, recorrência mensal, limites de leads e status dos agentes autônomos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Cards de Métricas Globais (MRR, Clientes, Leads, Áudios) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-6 bg-[#07111F]/50 border-b border-white/5">
          <div className="p-3.5 rounded-xl bg-[#091524] border border-emerald-500/20 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
              <span>MRR RECORRENTE</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-emerald-300 font-mono">
              R$ {summary.totalMrr.toLocaleString('pt-BR')},00
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>+ R$ {summary.totalSetupRevenue.toLocaleString('pt-BR')} em Setup pago</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#091524] border border-[#00D2F6]/20 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
              <span>EMPRESAS ATIVAS</span>
              <Building className="w-3.5 h-3.5 text-[#00D2F6]" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono">
              {summary.activeTenantsCount} <span className="text-xs font-normal text-slate-400">/ {summary.totalTenants} contas</span>
            </div>
            <div className="text-[10px] text-cyan-300 mt-1 font-mono">
              {summary.trialTenantsCount > 0 ? `${summary.trialTenantsCount} em período de Trial` : '100% de adimplência'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#091524] border border-cyan-500/20 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
              <span>LEADS DO MÊS</span>
              <Users className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-cyan-300 font-mono">
              {summary.totalLeadsThisMonth.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Processados via Webhook & IA
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#091524] border border-purple-500/20 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
              <span>ÁUDIOS DE VOZ PTT</span>
              <Mic className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-purple-300 font-mono">
              {summary.totalAudiosSentThisMonth}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Enviados com voz clonada
            </div>
          </div>
        </div>

        {/* Barra de Filtros & Ações */}
        <div className="px-6 py-3 bg-[#07111F] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar empresa, nicho, responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#091524] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#091524] p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-[#00D2F6]/20 text-[#00D2F6] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas ({tenants.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'active' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ativas
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('trial')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'trial' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Trial
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('suspended')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'suspended' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pausadas
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-xs font-mono font-bold text-[#07111F] hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,246,0.2)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Cliente Corporativo</span>
          </button>
        </div>

        {/* Formulário Retrátil de Novo Cliente */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateTenant}
            className="p-4 sm:p-6 bg-[#0a1829] border-b border-[#00D2F6]/30 animate-in fade-in"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00D2F6]" />
                Cadastrar Nova Empresa Cliente na Plataforma
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono mb-4">
              <div>
                <label className="text-slate-300 block mb-1">Razão Social / Nome Oficial</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clínica Odonto Vida Ltda"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Nome Fantasia / Marca</label>
                <input
                  type="text"
                  placeholder="Ex: Odonto Vida"
                  value={newTradingName}
                  onChange={(e) => setNewTradingName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Nicho / Segmento de Atuação</label>
                <select
                  value={newSegment}
                  onChange={(e) => setNewSegment(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
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
                <label className="text-slate-300 block mb-1">CNPJ ou CPF</label>
                <input
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={newCnpj}
                  onChange={(e) => setNewCnpj(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Nome do Responsável / Decisor</label>
                <input
                  type="text"
                  placeholder="Ex: Dra. Mariana Silva"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">E-mail Comercial</label>
                <input
                  type="email"
                  placeholder="contato@empresa.com.br"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">WhatsApp Comercial da Empresa</label>
                <input
                  type="text"
                  placeholder="+55 11 99999-9999"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Plano & Recorrência</label>
                <select
                  value={newPlan}
                  onChange={(e) => {
                    const p = e.target.value as TenantPlan;
                    setNewPlan(p);
                    if (p === 'starter') setNewMonthlyFee(990);
                    if (p === 'pro') setNewMonthlyFee(1900);
                    if (p === 'enterprise') setNewMonthlyFee(3500);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
                >
                  <option value="starter">Starter Pilot (R$ 990/mês)</option>
                  <option value="pro">Pro Business (R$ 1.900/mês)</option>
                  <option value="enterprise">Scale Enterprise (R$ 3.500/mês)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Mensalidade (R$ / mês)</label>
                <input
                  type="number"
                  value={newMonthlyFee}
                  onChange={(e) => setNewMonthlyFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Taxa de Setup / Implantação (R$)</label>
                <input
                  type="number"
                  value={newSetupFee}
                  onChange={(e) => setNewSetupFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-white focus:outline-none focus:border-[#00D2F6]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-mono font-bold text-[#07111F] cursor-pointer shadow-lg"
              >
                Salvar & Provisionar Instância
              </button>
            </div>
          </form>
        )}

        {/* Lista de Empresas Clientes */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredTenants.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              Nenhuma empresa cliente encontrada com os filtros atuais.
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
                      ? 'bg-[#00D2F6]/5 border-[#00D2F6]/50 shadow-[0_0_20px_rgba(0,210,246,0.1)]'
                      : 'bg-[#07111F] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Bloco Esquerda: Informações Principais */}
                    <div className="space-y-1.5 flex-1 min-w-[280px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {tenant.tradingName}
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#00D2F6] text-[#07111F] text-[10px] font-mono font-bold">
                              AMBIENTE ATIVO
                            </span>
                          )}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                          {tenant.segmentLabel}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            tenant.status === 'active'
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                              : tenant.status === 'trial'
                              ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                          }`}
                        >
                          {tenant.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>{tenant.name}</span>
                        {tenant.cnpjOrCpf && <span>CNPJ: {tenant.cnpjOrCpf}</span>}
                        <span>Resp: {tenant.contactName} ({tenant.contactPhone})</span>
                      </div>

                      <div className="text-[11px] text-slate-500 italic">
                        "{tenant.customNotes}"
                      </div>
                    </div>

                    {/* Bloco Central: Plano, Finanças e Consumo de Leads */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono min-w-[260px] bg-black/20 p-2.5 rounded-xl border border-white/5">
                      <div>
                        <div className="text-[10px] text-slate-400">PLANO & MENSALIDADE</div>
                        <div className="text-white font-bold">
                          {tenant.monthlyFee > 0 ? `R$ ${tenant.monthlyFee.toLocaleString('pt-BR')}/mês` : 'Operação Matriz'}
                        </div>
                        <div className="text-[10px] text-slate-400">Venc: {tenant.nextBillingDate}</div>
                      </div>

                      <div className="flex-1 min-w-[120px]">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>LEADS: {tenant.usage.leadsProcessedMonth} / {tenant.usage.maxLeadsAllowed}</span>
                          <span>{usagePercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              usagePercent > 85 ? 'bg-rose-400' : 'bg-[#00D2F6]'
                            }`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-purple-300 mt-1 flex items-center gap-1">
                          <Mic className="w-2.5 h-2.5" />
                          <span>{tenant.usage.audioMessagesSent} áudios PTT</span>
                        </div>
                      </div>
                    </div>

                    {/* Bloco Direita: Ações do SuperAdmin */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isCurrent ? (
                        <span className="px-3 py-1.5 rounded-xl bg-[#00D2F6]/20 border border-[#00D2F6]/40 text-[#00D2F6] text-xs font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Visualizando
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectTenant(tenant)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#00D2F6] hover:text-[#07111F] text-white text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="Alternar para este cliente e ver os dados no CRM"
                        >
                          <span>Acessar CRM</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleAgent(tenant.id)}
                        className={`p-2 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                          tenant.agentActive
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                            : 'border-slate-600 bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={tenant.agentActive ? 'Agente de IA está Ativo (Clique para pausar)' : 'Agente Pausado'}
                      >
                        <Cpu className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(tenant.id)}
                        className={`p-2 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                          tenant.status === 'active'
                            ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                        }`}
                        title={tenant.status === 'active' ? 'Suspender/Pausar Conta do Cliente' : 'Reativar Conta'}
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

        {/* Rodapé Informativo */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#07111F] flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Isolamento rígido de instâncias: cada cliente opera em seu próprio funil e banco de dados.</span>
          </div>
          <div className="text-slate-300">
            Ambiente ativo: <strong className="text-[#00D2F6]">{tenants.find((t) => t.id === activeTenantId)?.tradingName}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
