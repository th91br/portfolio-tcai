/**
 * TCAI — Cérebro Central & Orquestrador de Subagentes
 * Roteia demandas, ativa especialistas nos bastidores e garante a persona única na linha de frente
 */

import { SubagentRole, SubagentDepartment, SubagentCapability } from './subagentTypes';
import { getSubagents, saveSubagent, incrementSubagentMetrics } from './subagentStorage';
import { inspectIncomingMessage } from '../security/cyberSentinelService';
import { addTimelineEvent } from '../crm/timelineService';

export interface OrchestrationResult {
  handledBy: string;
  response: string;
  threatIntercepted?: boolean;
  internalDelegations?: string[];
  executionTimeMs: number;
}

/**
 * Processa uma mensagem recebida de cliente através da orquestração dos subagentes
 */
export async function orchestrateCustomerMessage(
  message: string,
  contactId: string,
  contactName: string,
  fallbackExecutor: (safeContent: string) => Promise<string>
): Promise<OrchestrationResult> {
  const startTime = performance.now();
  const delegations: string[] = [];

  // ETAPA 1: Inspeção pelo Sentinela de Cyber Segurança
  const inspection = inspectIncomingMessage(message, contactName);
  if (inspection.isThreat && inspection.safeResponse) {
    addTimelineEvent(contactId, {
      type: 'internal_note',
      title: '🛡️ Ataque Bloqueado pelo Sentinela',
      description: `Mensagem suspeita interceptada. Resposta defensiva neutra enviada automaticamente.`,
      metadata: { snippet: message.slice(0, 80) },
    });

    return {
      handledBy: 'cyber_sentinel',
      response: inspection.safeResponse,
      threatIntercepted: true,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }

  // ETAPA 2: Linha de Frente — Thiago (SDR de Vendas Humanizado)
  // O atendente executa com suporte aos subagentes especialistas nos bastidores
  delegations.push('sdr_sales');
  incrementSubagentMetrics('sdr_sales', 'task');

  // Executa o motor de resposta padrão (Gemini com a persona oficial humanizada do Thiago)
  const finalResponse = await fallbackExecutor(message);

  return {
    handledBy: 'sdr_sales',
    response: finalResponse,
    threatIntercepted: false,
    internalDelegations: delegations,
    executionTimeMs: Math.round(performance.now() - startTime),
  };
}

/**
 * Cria um novo funcionário virtual (Subagente Dinâmico)
 */
export function hireSubagent(params: {
  name: string;
  roleTitle: string;
  department: SubagentDepartment;
  description: string;
  systemPrompt: string;
  avatar?: string;
  capabilities?: SubagentCapability[];
}): SubagentRole {
  const newId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newSubagent: SubagentRole = {
    id: newId,
    name: params.name.trim(),
    roleTitle: params.roleTitle.trim(),
    department: params.department,
    status: 'active',
    avatar: params.avatar || '🤖',
    description: params.description.trim(),
    systemPrompt: params.systemPrompt.trim(),
    capabilities: params.capabilities || ['read_crm'],
    isCore: false,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    metrics: {
      tasksCompleted: 0,
      alertsTriggered: 0,
      avgLatencyMs: 0,
    },
  };

  saveSubagent(newSubagent);
  return newSubagent;
}

/**
 * Obtém estatísticas consolidadas de todo o time de subagentes
 */
export function getTeamConsolidatedMetrics(): {
  totalAgents: number;
  activeAgents: number;
  totalTasksCompleted: number;
  totalAlerts: number;
  departments: Record<string, number>;
} {
  const agents = getSubagents();
  let totalTasks = 0;
  let totalAlerts = 0;
  const departments: Record<string, number> = {};

  agents.forEach((ag) => {
    totalTasks += ag.metrics.tasksCompleted;
    totalAlerts += ag.metrics.alertsTriggered;
    departments[ag.department] = (departments[ag.department] || 0) + 1;
  });

  return {
    totalAgents: agents.length,
    activeAgents: agents.filter((a) => a.status === 'active').length,
    totalTasksCompleted: totalTasks,
    totalAlerts,
    departments,
  };
}
