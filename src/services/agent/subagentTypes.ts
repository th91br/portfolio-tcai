/**
 * TCAI — Arquitetura Multi-Agente Corporativa
 * Tipagens para os Subagentes Especialistas e o Sentinela de Cyber Segurança
 */

export type SubagentDepartment =
  | 'Comercial'
  | 'Estratégia'
  | 'Marketing'
  | 'Segurança'
  | 'Operações'
  | 'Atendimento'
  | 'Customizado';

export type SubagentStatus = 'active' | 'paused' | 'standby' | 'alert';

export type SubagentCapability =
  | 'read_crm'
  | 'write_proposals'
  | 'whatsapp_reply'
  | 'security_firewall'
  | 'generate_copy'
  | 'analyze_metrics'
  | 'create_subagents'
  | 'health_check';

export interface SubagentRole {
  id: string;
  name: string;
  roleTitle: string;
  department: SubagentDepartment;
  status: SubagentStatus;
  avatar: string;
  description: string;
  systemPrompt: string;
  capabilities: SubagentCapability[];
  isCore: boolean;
  createdAt: string;
  lastActiveAt: string;
  metrics: {
    tasksCompleted: number;
    alertsTriggered: number;
    avgLatencyMs: number;
  };
}

export type SecurityIncidentType =
  | 'prompt_injection'
  | 'rate_limit'
  | 'connection_dropped'
  | 'unauthorized_access'
  | 'jailbreak_attempt';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityIncident {
  id: string;
  timestamp: string;
  type: SecurityIncidentType;
  severity: SecuritySeverity;
  title: string;
  description: string;
  sourceContact?: string;
  payloadSnippet?: string;
  actionTaken: 'blocked' | 'alert_sent' | 'failover_activated' | 'logged';
  resolved: boolean;
}

export interface SentinelHealthMetrics {
  uptimePercentage: number;
  avgLatencyMs: number;
  totalInspections: number;
  blockedThreats: number;
  activeFailover: boolean;
  lastIncidentAt: string | null;
  status: 'healthy' | 'degraded' | 'critical';
}
