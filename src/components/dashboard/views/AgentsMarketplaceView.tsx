import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  ArrowRight,
  Settings2,
  Mic,
  Plus,
  Users,
  Building2,
  PhoneCall,
  Sliders,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  Edit2,
  Trash2,
  Phone,
  Mail,
  CheckCircle2,
  ExternalLink,
  Bot,
  Network
} from 'lucide-react';
import { TeamOrganogramView } from '../team/TeamOrganogramView';
import {
  agentTeamService,
  DigitalAgent,
  AgentDepartment
} from '../../../services/agents/agentTeamService';
import {
  SalesRep,
  SalesTeamSettings,
  getSalesTeam,
  saveSalesTeam,
  getSalesTeamSettings,
  saveSalesTeamSettings,
  assignNextLead,
  generateWhatsAppHandoffUrl
} from '../../../services/crm/salesTeamService';
import { AgentConfigDrawer } from '../agents/AgentConfigDrawer';
import { CustomAgentModal } from '../agents/CustomAgentModal';
import { Tenant } from '../../../services/tenants/tenantService';

interface AgentsMarketplaceViewProps {
  activeTenant: Tenant;
}

export const AgentsMarketplaceView: React.FC<AgentsMarketplaceViewProps> = ({
  activeTenant
}) => {
  // Aba principal de Equipe: Especialistas 24h vs Equipe Humana vs Organograma
  const [activeMainTab, setActiveMainTab] = useState<'ai' | 'human' | 'organogram'>('ai');

  // Estado dos Agentes de IA
  const [agents, setAgents] = useState<DigitalAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<DigitalAgent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | AgentDepartment>('all');

  // Estado da Equipe Humana
  const [humanTeam, setHumanTeam] = useState<SalesRep[]>([]);
  const [teamSettings, setTeamSettings] = useState<SalesTeamSettings>(getSalesTeamSettings());
  const [editingRep, setEditingRep] = useState<SalesRep | null>(null);
  const [isCreatingRep, setIsCreatingRep] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carregar dados
  useEffect(() => {
    setAgents(agentTeamService.getAgents(activeTenant.id));
    setHumanTeam(getSalesTeam());
    setTeamSettings(getSalesTeamSettings());
  }, [activeTenant.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Handlers de Especialistas IA ---
  const handleOpenConfig = (agent: DigitalAgent) => {
    setSelectedAgent(agent);
    setIsDrawerOpen(true);
  };

  const handleSaveAgent = (updatedAgent: DigitalAgent) => {
    const updated = agentTeamService.updateAgent(
      activeTenant.id,
      updatedAgent.id,
      updatedAgent
    );
    setAgents(updated);
    setSelectedAgent(updatedAgent);
    showToast(`Parâmetros de ${updatedAgent.name} atualizados com sucesso!`);
  };

  const handleToggleHire = (agentId: string, customPrice?: number) => {
    const updated = agentTeamService.toggleHireAgent(
      activeTenant.id,
      agentId,
      customPrice
    );
    setAgents(updated);
  };

  // --- Handlers da Equipe Humana ---
  const handleToggleRepStatus = (repId: string) => {
    const updated = humanTeam.map((r) => {
      if (r.id === repId) {
        const next = r.status === 'active' ? 'inactive' : 'active';
        return { ...r, status: next as SalesRep['status'] };
      }
      return r;
    });
    setHumanTeam(updated);
    saveSalesTeam(updated);
    showToast('Status do vendedor atualizado.');
  };

  const handleDeleteRep = (repId: string) => {
    const target = humanTeam.find((r) => r.id === repId);
    if (!target) return;
    if (confirm(`Remover ${target.name} da equipe comercial?`)) {
      const updated = humanTeam.filter((r) => r.id !== repId);
      setHumanTeam(updated);
      saveSalesTeam(updated);
      showToast(`${target.name} removido da equipe.`);
    }
  };

  const handleSaveRep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRep) return;
    let updated: SalesRep[];
    if (isCreatingRep) {
      updated = [editingRep, ...humanTeam];
      showToast(`Vendedor ${editingRep.name} cadastrado com sucesso!`);
    } else {
      updated = humanTeam.map((r) => (r.id === editingRep.id ? editingRep : r));
      showToast(`Dados de ${editingRep.name} atualizados.`);
    }
    setHumanTeam(updated);
    saveSalesTeam(updated);
    setEditingRep(null);
    setIsCreatingRep(false);
  };

  const handleTestRoundRobin = () => {
    const result = assignNextLead(`test_${Date.now()}`);
    if (result) {
      showToast(`⚡ Lead distribuído via Round Robin para: ${result.repName}`);
      setHumanTeam(getSalesTeam());
    } else {
      showToast('Nenhum vendedor elegível ou ativo no momento.');
    }
  };

  const handleTestHandoff = (rep: SalesRep) => {
    const url = generateWhatsAppHandoffUrl(
      rep,
      'Dr. Roberto Siqueira',
      'Hospital Vitae',
      94
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Contadores
  const hiredCount = agents.filter((a) => a.status === 'hired').length;
  const totalCount = agents.length;
  const activeHumanCount = humanTeam.filter((r) => r.status === 'active').length;
  const totalRevenue = humanTeam.reduce((acc, r) => acc + (r.totalRevenueWon || 0), 0);

  const departments: {
    key: AgentDepartment;
    title: string;
    subtitle: string;
  }[] = [
    {
      key: 'vendas',
      title: 'Vendas & Atendimento',
      subtitle: 'Quem vende e responde enquanto você dorme'
    },
    {
      key: 'marketing',
      title: 'Marketing & Conteúdo',
      subtitle: 'Quem faz sua marca aparecer e atrai compradores'
    },
    {
      key: 'operacoes',
      title: 'Operações & Gestão',
      subtitle: 'Quem organiza e protege o fluxo de contratos e cobranças'
    }
  ];

  const filteredDepartments =
    activeFilter === 'all'
      ? departments
      : departments.filter((d) => d.key === activeFilter);

  return (
    <div className="space-y-8 animate-fadeIn text-[#F3F5F7]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#00D2F6] text-[#07111F] font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Seletor de Força de Trabalho Híbrida */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2F6] font-semibold">
              FORÇA DE TRABALHO HÍBRIDA
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {activeTenant.tradingName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Equipe Comercial & Especialistas
          </h1>
          <p className="text-xs text-slate-400">
            Gestão unificada do time autônomo 24h e dos vendedores humanos com distribuição Round Robin
          </p>
        </div>

        {/* Segmented Control de Abas Híbridas */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 self-start md:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveMainTab('ai')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeMainTab === 'ai'
                ? 'bg-[#00D2F6] text-[#07111F] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Especialistas 24h</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-slate-950/40">
              {hiredCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('human')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeMainTab === 'human'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vendedores Humanos</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-slate-950/40">
              {activeHumanCount}/{humanTeam.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('organogram')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeMainTab === 'organogram'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm border border-purple-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-purple-300" />
            <span>Organograma & Hierarquia</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: ESPECIALISTAS 24H (IA / AUTÔNOMO)                                   */}
      {/* ========================================================================= */}
      {activeMainTab === 'ai' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Banner Interativo "SOB MEDIDA / Criar meu agente" */}
          <div
            onClick={() => setIsCustomModalOpen(true)}
            className="group relative p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0C1A2E] via-[#091626] to-[#0B2138] border border-slate-800 hover:border-[#00D2F6]/60 transition-all duration-300 cursor-pointer shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D2F6]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00D2F6]/10 transition-colors" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-[#00D2F6] shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6 stroke-current stroke-[2]"
                  >
                    <path d="M3 12h3l3-6 4 12 3-6h5" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00D2F6]">
                      SOB MEDIDA
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-[#00D2F6]/10 text-[#00D2F6] rounded-full border border-[#00D2F6]/20">
                      Implementação Personalizada
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#00D2F6] transition-colors">
                    Criar meu agente
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Descreva o que sua operação precisa; nossa equipe mapeia seus fluxos, conecta suas ferramentas e entrega um funcionário pronto para o seu nicho.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#00D2F6] group-hover:translate-x-1 transition-transform self-end sm:self-center">
                <span>Solicitar Especialista</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Filtros Departamentais */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                Todos os Departamentos
              </button>
              {departments.map((dep) => (
                <button
                  key={dep.key}
                  onClick={() => setActiveFilter(dep.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === dep.key
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  {dep.title}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span>
                {hiredCount} de {totalCount} ativos no time
              </span>
            </div>
          </div>

          {/* Cards de Especialistas por Departamento */}
          <div className="space-y-10">
            {filteredDepartments.map((dept) => {
              const deptAgents = agents.filter((a) => a.department === dept.key);
              const deptHiredCount = deptAgents.filter((a) => a.status === 'hired').length;

              return (
                <div key={dept.key} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2.5">
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        {dept.title}
                      </h2>
                      <span className="text-xs text-slate-400 italic">
                        {dept.subtitle}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 self-start sm:self-auto">
                      {deptAgents.length} especialistas • {deptHiredCount} no time
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {deptAgents.map((agent) => {
                      const isHired = agent.status === 'hired';

                      return (
                        <div
                          key={agent.id}
                          className={`group relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                            isHired
                              ? 'bg-[#0A1727]/90 border-slate-800 hover:border-slate-700 shadow-lg'
                              : 'bg-[#081220]/70 border-slate-800/60 hover:border-slate-700/80 hover:bg-[#091524]'
                          }`}
                        >
                          <div>
                            <div className="flex items-start gap-3.5 mb-3.5">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center relative flex-shrink-0 border transition-all shadow-inner ${
                                  isHired
                                    ? 'bg-slate-900 border-[#00D2F6]/40 text-[#00D2F6]'
                                    : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="w-6 h-6 stroke-current stroke-[2]"
                                >
                                  <path d="M2 13h2l2-4 3 8 3-10 2 8 2-4h6" />
                                </svg>

                                {isHired && (
                                  <span
                                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#091524] shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
                                    title="Operando 24h"
                                  />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-white tracking-tight truncate group-hover:text-[#00D2F6] transition-colors">
                                  {agent.name}
                                </h3>
                                <p className="text-xs text-slate-400 truncate">
                                  {agent.role}
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-slate-300 italic mb-3">
                              "{agent.tagline}"
                            </p>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {agent.capabilities.map((cap) => (
                                <span
                                  key={cap}
                                  className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-300"
                                >
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                            {isHired ? (
                              <>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                                  <Check className="w-4 h-4" />
                                  <span>No seu time</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleOpenConfig(agent)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Settings2 className="w-3.5 h-3.5" />
                                  <span>Ajustar</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <div>
                                  <span className="text-[10px] text-slate-500 uppercase font-mono block">
                                    Mensalidade
                                  </span>
                                  <span className="text-xs font-bold text-white font-mono">
                                    R$ {agent.pricing.activePrice.toLocaleString('pt-BR')}/mês
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenConfig(agent)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                                    title="Detalhes & Parâmetros"
                                  >
                                    <Sliders className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleHire(agent.id)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#07111F] bg-[#00D2F6] hover:bg-[#00b8d9] flex items-center gap-1 shadow-[0_0_12px_rgba(0,210,246,0.3)] transition-all cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Contratar</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: VENDEDORES & ROUND ROBIN (EQUIPE HUMANA)                            */}
      {/* ========================================================================= */}
      {activeMainTab === 'human' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Métricas Globais da Equipe Humana */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Vendedores Ativos
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">
                  {activeHumanCount}
                </span>
                <span className="text-xs text-slate-500">de {humanTeam.length} cadastrados</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Receita Gerada pelo Time
              </span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                R$ {totalRevenue.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Modo Round Robin
              </span>
              <span className="text-sm font-bold text-cyan-400 font-mono uppercase block mt-1">
                {teamSettings.roundRobinMode === 'circular' ? 'Rotativo Circular' : 'Capacidade Ponderada'}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Ação Rápida
                </span>
                <span className="text-xs text-slate-300">Simular Roteamento</span>
              </div>
              <button
                type="button"
                onClick={handleTestRoundRobin}
                className="px-3 py-1.5 rounded-xl bg-[#00D2F6]/15 hover:bg-[#00D2F6]/25 border border-[#00D2F6]/40 text-[#00D2F6] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Testar</span>
              </button>
            </div>
          </div>

          {/* Barra de Ações da Equipe Humana */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Vendedores Cadastrados para Recebimento de Leads
              </h3>
              <p className="text-xs text-slate-400">
                Os leads qualificados pelo especialista autônomo (Davi) são distribuídos automaticamente para esses atendentes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingRep({
                  id: `rep_${Date.now()}`,
                  name: '',
                  email: '',
                  phone: '',
                  whatsapp: '',
                  avatar: '💼',
                  role: 'closer',
                  roleTitle: 'Vendedor Consultivo',
                  status: 'active',
                  weight: 1,
                  leadsAssignedCount: 0,
                  dealsWonCount: 0,
                  totalRevenueWon: 0
                });
                setIsCreatingRep(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#00D2F6] hover:bg-[#00b8d9] text-[#07111F] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,210,246,0.3)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Vendedor</span>
            </button>
          </div>

          {/* Formulário Inline de Cadastro/Edição de Vendedor */}
          {editingRep && (
            <form onSubmit={handleSaveRep} className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white">
                  {isCreatingRep ? 'Cadastrar Novo Vendedor' : `Editar Vendedor: ${editingRep.name}`}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingRep(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={editingRep.name}
                    onChange={(e) => setEditingRep({ ...editingRep, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-[#00D2F6] focus:outline-none"
                    placeholder="Ex: Carlos Oliveira"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">WhatsApp Oficial (DDD + Número)</label>
                  <input
                    type="text"
                    required
                    value={editingRep.whatsapp}
                    onChange={(e) => setEditingRep({ ...editingRep, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-[#00D2F6] focus:outline-none"
                    placeholder="5511999998888"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cargo / Especialidade</label>
                  <input
                    type="text"
                    required
                    value={editingRep.roleTitle}
                    onChange={(e) => setEditingRep({ ...editingRep, roleTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-[#00D2F6] focus:outline-none"
                    placeholder="Ex: Closer B2B • Fechamento"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRep(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Salvar Vendedor
                </button>
              </div>
            </form>
          )}

          {/* Grid de Cards de Vendedores Humanos */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {humanTeam.map((rep) => {
              const isActive = rep.status === 'active';

              return (
                <div
                  key={rep.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner">
                          {rep.avatar || '💼'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white tracking-tight">
                              {rep.name}
                            </h4>
                            {rep.isHead && (
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold uppercase">
                                Head
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 block">{rep.roleTitle}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleRepStatus(rep.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors cursor-pointer border ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {isActive ? '● Ativo no RR' : '○ Pausado'}
                      </button>
                    </div>

                    {/* Métricas do Vendedor */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 my-3 text-center">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Leads</span>
                        <span className="text-xs font-bold text-white font-mono">{rep.leadsAssignedCount}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Fechados</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">{rep.dealsWonCount}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Receita</span>
                        <span className="text-xs font-bold text-cyan-400 font-mono">
                          R$ {(rep.totalRevenueWon / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{rep.whatsapp || rep.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{rep.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rodapé do Card Humano */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-3">
                    <button
                      type="button"
                      onClick={() => handleTestHandoff(rep)}
                      className="text-xs text-[#00D2F6] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Testar Transbordo</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRep(rep);
                          setIsCreatingRep(false);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                        title="Editar Vendedor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRep(rep.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                        title="Remover Vendedor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: ORGANOGRAMA & HIERARQUIA DA EMPRESA                                */}
      {/* ========================================================================= */}
      {activeMainTab === 'organogram' && (
        <div className="pt-1 animate-fadeIn">
          <TeamOrganogramView />
        </div>
      )}

      {/* Drawer de Configuração & Parâmetros do Especialista */}
      <AgentConfigDrawer
        isOpen={isDrawerOpen}
        agent={selectedAgent}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveAgent}
        onToggleHire={handleToggleHire}
        tenantName={activeTenant.tradingName}
      />

      {/* Modal Sob Medida */}
      <CustomAgentModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        tenantId={activeTenant.id}
        tenantName={activeTenant.tradingName}
      />
    </div>
  );
};
