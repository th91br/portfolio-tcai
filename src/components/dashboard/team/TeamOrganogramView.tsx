import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Bot,
  Zap,
  Activity,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Settings,
  Trash2,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SubagentRole, SubagentDepartment } from '../../../services/agent/subagentTypes';
import {
  getSubagents,
  toggleSubagentStatus,
  deleteSubagent,
} from '../../../services/agent/subagentStorage';
import { getSentinelMetrics } from '../../../services/security/cyberSentinelService';
import { AgentHireModal } from './AgentHireModal';
import { SecurityAlertsDrawer } from './SecurityAlertsDrawer';

export const TeamOrganogramView: React.FC = () => {
  const [agents, setAgents] = useState<SubagentRole[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('TODOS');
  const [selectedAgentToEdit, setSelectedAgentToEdit] = useState<SubagentRole | null>(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showSecurityDrawer, setShowSecurityDrawer] = useState(false);
  const [sentinelMetrics, setSentinelMetrics] = useState(getSentinelMetrics());

  const refreshAgents = () => {
    setAgents(getSubagents());
    setSentinelMetrics(getSentinelMetrics());
  };

  useEffect(() => {
    refreshAgents();
  }, []);

  const handleToggleStatus = (id: string) => {
    toggleSubagentStatus(id);
    refreshAgents();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja dispensar o agente "${name}" do organograma?`)) {
      deleteSubagent(id);
      refreshAgents();
    }
  };

  const filteredAgents =
    selectedDepartment === 'TODOS'
      ? agents
      : agents.filter((a) => a.department === selectedDepartment);

  const totalTasks = (agents || []).reduce((acc, a) => acc + (a.metrics?.tasksCompleted || 0), 0);
  const activeCount = (agents || []).filter((a) => a.status === 'active').length;

  return (
    <div className="space-y-6 font-kanit">
      {/* Topo / Masthead Executivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A1624]/60 border border-white/10 p-5 sm:p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 uppercase">
              Multi-Agent Architecture 3.0
            </span>
            <span className="text-[10px] font-mono text-slate-400">White-Label Enterprise</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Organograma & Time de Agentes de IA
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl font-light mt-0.5">
            Especialistas autônomos operando em sincronia para a empresa: vendas na linha de frente, inteligência de fechamento, marketing e monitoramento de cyber segurança 24/7.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowSecurityDrawer(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Auditoria Sentinela 24/7</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedAgentToEdit(null);
              setShowHireModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00D2F6]/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Contratar Agente</span>
          </button>
        </div>
      </div>

      {/* Banner de Proteção do Sentinela de Cyber Segurança */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#091524] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">
                Sentinela de Cyber Segurança & SRE em Operação
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                99.9% UPTIME
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Proteção ativa contra ataques de injeção de prompt no WhatsApp, verificação contínua de latência ({sentinelMetrics.avgLatencyMs}ms) e contingência pronta.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/5 font-mono text-xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Ameaças Bloqueadas</span>
            <span className="text-emerald-400 font-bold">{sentinelMetrics.blockedThreats} interceptações</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSecurityDrawer(true)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs transition-colors cursor-pointer"
          >
            Ver Logs
          </button>
        </div>
      </div>

      {/* Cards de Métricas Consolidadas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#091524] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Total de Agentes</span>
          <span className="text-xl font-bold text-white font-mono mt-1 block">{agents.length}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#091524] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Agentes em Atividade</span>
          <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
            {activeCount} <span className="text-xs font-normal text-slate-500">/ {agents.length}</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#091524] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Tarefas Concluídas</span>
          <span className="text-xl font-bold text-[#00D2F6] font-mono mt-1 block">{totalTasks}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#091524] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Camada de Blindagem</span>
          <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">Anti-Jailbreak</span>
        </div>
      </div>

      {/* Filtros por Departamento */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['TODOS', 'Comercial', 'Estratégia', 'Marketing', 'Segurança', 'Operações', 'Atendimento'].map(
          (dep) => (
            <button
              key={dep}
              type="button"
              onClick={() => setSelectedDepartment(dep)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedDepartment === dep
                  ? 'bg-[#00D2F6] text-[#07111F]'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {dep}
            </button>
          )
        )}
      </div>

      {/* Grid do Organograma de Agentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className={`p-5 rounded-2xl bg-[#091524] border transition-all space-y-4 shadow-lg ${
              agent.status === 'active'
                ? 'border-white/10 hover:border-[#00D2F6]/30'
                : 'border-white/5 opacity-60'
            }`}
          >
            {/* Topo do Card */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 text-2xl flex items-center justify-center shrink-0">
                  {agent.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-white/[0.05] text-slate-300 border border-white/10">
                      {agent.department}
                    </span>
                    {agent.isCore && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#00D2F6]/10 text-[#00D2F6] border border-[#00D2F6]/20">
                        Nativo
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-base">{agent.name}</h4>
                  <p className="text-xs text-[#00D2F6] font-mono">{agent.roleTitle}</p>
                </div>
              </div>

              {/* Botão Alternar Status */}
              <button
                type="button"
                onClick={() => handleToggleStatus(agent.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  agent.status === 'active'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
                title={agent.status === 'active' ? 'Pausar Agente' : 'Ativar Agente'}
              >
                {agent.status === 'active' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ATIVO</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>PAUSADO</span>
                  </>
                )}
              </button>
            </div>

            {/* Descrição de Atuação */}
            <p className="text-xs text-slate-300 leading-relaxed font-light">{agent.description}</p>

            {/* Capacidades & Permissões */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Capacidades Operacionais:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/10 text-[10px] font-mono text-slate-300"
                  >
                    {cap === 'read_crm' && '📂 Consulta CRM'}
                    {cap === 'write_proposals' && '📄 Elabora Propostas'}
                    {cap === 'whatsapp_reply' && '💬 WhatsApp 24/7'}
                    {cap === 'security_firewall' && '🛡️ Firewall Anti-Jailbreak'}
                    {cap === 'generate_copy' && '✍️ Copy & SEO'}
                    {cap === 'analyze_metrics' && '📊 Análise Estratégica'}
                    {cap === 'health_check' && '🩺 Watchdog SRE'}
                  </span>
                ))}
              </div>
            </div>

            {/* Rodapé do Card com Métricas e Ações */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3 text-slate-400">
                <span>Tarefas: <strong className="text-white">{agent.metrics?.tasksCompleted || 0}</strong></span>
                <span>Latência: <strong className="text-[#00D2F6]">{agent.metrics?.avgLatencyMs || 120}ms</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAgentToEdit(agent);
                    setShowHireModal(true);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                  title="Configurar Prompt e Regras"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>

                {!agent.isCore && (
                  <button
                    type="button"
                    onClick={() => handleDelete(agent.id, agent.name)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title="Dispensar Agente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Contratação / Edição de Subagente */}
      {showHireModal && (
        <AgentHireModal
          agentToEdit={selectedAgentToEdit}
          onClose={() => setShowHireModal(false)}
          onSaved={() => refreshAgents()}
        />
      )}

      {/* Drawer de Auditoria do Sentinela de Cyber Segurança */}
      {showSecurityDrawer && (
        <SecurityAlertsDrawer onClose={() => setShowSecurityDrawer(false)} />
      )}
    </div>
  );
};
