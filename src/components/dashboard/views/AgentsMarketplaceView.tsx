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
  DollarSign
} from 'lucide-react';
import {
  agentTeamService,
  DigitalAgent,
  AgentDepartment
} from '../../../services/agents/agentTeamService';
import { AgentConfigDrawer } from '../agents/AgentConfigDrawer';
import { CustomAgentModal } from '../agents/CustomAgentModal';
import { Tenant } from '../../../services/tenants/tenantService';

interface AgentsMarketplaceViewProps {
  activeTenant: Tenant;
}

export const AgentsMarketplaceView: React.FC<AgentsMarketplaceViewProps> = ({
  activeTenant
}) => {
  const [agents, setAgents] = useState<DigitalAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<DigitalAgent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | AgentDepartment>('all');

  // Carregar agentes do tenant
  useEffect(() => {
    const data = agentTeamService.getAgents(activeTenant.id);
    setAgents(data);
  }, [activeTenant.id]);

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
  };

  const handleToggleHire = (agentId: string, customPrice?: number) => {
    const updated = agentTeamService.toggleHireAgent(
      activeTenant.id,
      agentId,
      customPrice
    );
    setAgents(updated);
  };

  // Contadores
  const hiredCount = agents.filter((a) => a.status === 'hired').length;
  const totalCount = agents.length;

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
      {/* 1. Header Hero "Sua Empresa 24h" */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2F6] font-semibold">
            SUA EMPRESA 24H
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            {activeTenant.tradingName}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
          Monte sua empresa que trabalha 24h
        </h1>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Especialistas prontos: contrate em 1 clique, converse a qualquer hora — eles aprendem com o playbook da sua empresa e respondem diretamente no WhatsApp.
        </p>
      </div>

      {/* 2. Banner Interativo "SOB MEDIDA / Criar meu agente" */}
      <div
        onClick={() => setIsCustomModalOpen(true)}
        className="group relative p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0C1A2E] via-[#091626] to-[#0B2138] border border-slate-800 hover:border-[#00D2F6]/60 transition-all duration-300 cursor-pointer shadow-xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D2F6]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00D2F6]/10 transition-colors" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            {/* Ícone de Onda Estilizada */}
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

      {/* 3. Barra de Filtro de Departamentos & Resumo */}
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

      {/* 4. Grupos de Departamentos com os Cards de Especialistas */}
      <div className="space-y-10">
        {filteredDepartments.map((dept) => {
          const deptAgents = agents.filter((a) => a.department === dept.key);
          const deptHiredCount = deptAgents.filter((a) => a.status === 'hired').length;

          return (
            <div key={dept.key} className="space-y-4">
              {/* Título do Departamento */}
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

              {/* Grid de Cards dos Especialistas */}
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
                        {/* Topo do Card: Avatar com Waveform + Nome e Cargo */}
                        <div className="flex items-start gap-3.5 mb-3.5">
                          {/* Caixa de Ícone com Onda Estilizada */}
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

                            {/* Ponto Verde Operacional se Ativo */}
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

                        {/* Frase de Impacto em Itálico */}
                        <p className="text-xs text-slate-300 italic mb-3">
                          "{agent.tagline}"
                        </p>

                        {/* Tags de Competências Operacionais */}
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

                      {/* Rodapé do Card: Status de Contratação & Ações */}
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
