// src/services/tenants/tenantService.ts
// Motor Corporativo de Gestão Multi-Tenant & Controle de Clientes B2B (MRR & Agentes)

export type TenantPlan = 'starter' | 'pro' | 'enterprise' | 'custom';
export type TenantStatus = 'active' | 'trial' | 'suspended' | 'cancelled';

export interface TenantUsageMetrics {
  leadsProcessedMonth: number;
  maxLeadsAllowed: number;
  audioMessagesSent: number;
  textMessagesSent: number;
  aiTokensEstimated: number;
  lastActiveAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  tradingName: string;
  cnpjOrCpf?: string;
  segment: 'clinics' | 'real_estate' | 'b2b_software' | 'digital_sales' | 'legal' | 'services' | 'other';
  segmentLabel: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  plan: TenantPlan;
  planName: string;
  monthlyFee: number; // Em R$
  setupFeePaid: number; // Em R$
  status: TenantStatus;
  createdAt: string;
  nextBillingDate: string;
  whatsappInstanceName: string;
  whatsappConnected: boolean;
  agentActive: boolean;
  activePipelineId?: string;
  usage: TenantUsageMetrics;
  customNotes?: string;
}

const STORAGE_KEY_TENANTS = 'tcai_enterprise_tenants_v1';
const STORAGE_KEY_ACTIVE_TENANT = 'tcai_active_tenant_id_v1';

// Tenants Padrão Iniciais (1 Matriz + 3 Clientes Corporativos Reais)
const DEFAULT_TENANTS: Tenant[] = [
  {
    id: 'tenant-tcai-matriz',
    name: 'TCAI — Thiago Cassol Antunes',
    tradingName: 'TCAI Tecnologia & Automação com IA',
    segment: 'b2b_software',
    segmentLabel: 'Engenharia de IA & Software',
    contactName: 'Thiago Cassol Antunes',
    contactEmail: 'thiago91cassol@gmail.com',
    contactPhone: '+55 48 99183-7448',
    plan: 'enterprise',
    planName: 'Enterprise Matriz (Infraestrutura Própria)',
    monthlyFee: 0,
    setupFeePaid: 0,
    status: 'active',
    createdAt: '2026-01-10T00:00:00Z',
    nextBillingDate: '2026-10-01',
    whatsappInstanceName: 'TCAI-Oficial-01',
    whatsappConnected: true,
    agentActive: true,
    activePipelineId: 'pipeline-b2b',
    usage: {
      leadsProcessedMonth: 142,
      maxLeadsAllowed: 10000,
      audioMessagesSent: 48,
      textMessagesSent: 1890,
      aiTokensEstimated: 312000,
      lastActiveAt: new Date().toISOString(),
    },
    customNotes: 'Operação Matriz do Thiago. Acesso irrestrito a todos os recursos da plataforma.',
  },
  {
    id: 'tenant-clinica-sorriso-prime',
    name: 'Clínica Sorriso Prime Odontologia Avançada Ltda',
    tradingName: 'Sorriso Prime Odonto',
    cnpjOrCpf: '38.412.981/0001-44',
    segment: 'clinics',
    segmentLabel: 'Clínicas Médicas & Odontologia',
    contactName: 'Dra. Vanessa Mendonça',
    contactEmail: 'diretoria@sorrisoprime.com.br',
    contactPhone: '+55 11 98844-2121',
    plan: 'pro',
    planName: 'Pro Business (R$ 1.900/mês)',
    monthlyFee: 1900,
    setupFeePaid: 4500,
    status: 'active',
    createdAt: '2026-07-15T00:00:00Z',
    nextBillingDate: '2026-09-25',
    whatsappInstanceName: 'SorrisoPrime-Atendimento-IA',
    whatsappConnected: true,
    agentActive: true,
    activePipelineId: 'pipeline-clinicas',
    usage: {
      leadsProcessedMonth: 384,
      maxLeadsAllowed: 600,
      audioMessagesSent: 112,
      textMessagesSent: 2450,
      aiTokensEstimated: 480000,
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    customNotes: 'Funil adaptado para agendamento de implantes e harmonização facial com envio de áudio no agendamento.',
  },
  {
    id: 'tenant-alpha-urban-imoveis',
    name: 'Alpha Urban Empreendimentos & Imóveis de Luxo',
    tradingName: 'Alpha Urban Imóveis',
    cnpjOrCpf: '24.918.330/0001-19',
    segment: 'real_estate',
    segmentLabel: 'Imobiliárias & Corretores de Alto Padrão',
    contactName: 'Carlos Eduardo Fontes',
    contactEmail: 'carlos@alphaurban.com.br',
    contactPhone: '+55 47 99712-4400',
    plan: 'enterprise',
    planName: 'Scale Enterprise (R$ 3.500/mês)',
    monthlyFee: 3500,
    setupFeePaid: 7000,
    status: 'active',
    createdAt: '2026-06-01T00:00:00Z',
    nextBillingDate: '2026-10-05',
    whatsappInstanceName: 'AlphaUrban-Vendas-01',
    whatsappConnected: true,
    agentActive: true,
    activePipelineId: 'pipeline-imobiliarias',
    usage: {
      leadsProcessedMonth: 610,
      maxLeadsAllowed: 1500,
      audioMessagesSent: 230,
      textMessagesSent: 5120,
      aiTokensEstimated: 950000,
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    },
    customNotes: 'Plano com 5 corretores humanos plugados no Round Robin e qualificação de patrimônio investível.',
  },
  {
    id: 'tenant-nexus-cloud-b2b',
    name: 'Nexus Cloud Infrastructure Solutions',
    tradingName: 'Nexus Cloud B2B',
    cnpjOrCpf: '19.824.512/0001-83',
    segment: 'b2b_software',
    segmentLabel: 'B2B Enterprise & Software',
    contactName: 'Mariana Duarte (Head Comercial)',
    contactEmail: 'm.duarte@nexuscloud.tech',
    contactPhone: '+55 19 98120-7733',
    plan: 'starter',
    planName: 'Starter Pilot (Período de Avaliação)',
    monthlyFee: 1400,
    setupFeePaid: 3000,
    status: 'trial',
    createdAt: '2026-09-01T00:00:00Z',
    nextBillingDate: '2026-09-18',
    whatsappInstanceName: 'Nexus-SDR-Autonomo',
    whatsappConnected: true,
    agentActive: true,
    activePipelineId: 'pipeline-b2b',
    usage: {
      leadsProcessedMonth: 85,
      maxLeadsAllowed: 300,
      audioMessagesSent: 19,
      textMessagesSent: 820,
      aiTokensEstimated: 145000,
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    customNotes: 'Trial em fase final de validação. Transição para plano Pro no próximo ciclo.',
  },
];

export function getStoredTenants(): Tenant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TENANTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TENANTS, JSON.stringify(DEFAULT_TENANTS));
      return DEFAULT_TENANTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TENANTS;
  } catch {
    return DEFAULT_TENANTS;
  }
}

export function saveStoredTenants(tenants: Tenant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TENANTS, JSON.stringify(tenants));
  } catch (err) {
    console.error('[tenantService] Erro ao salvar tenants:', err);
  }
}

export function getActiveTenantId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_TENANT);
    if (stored) return stored;
    return 'tenant-tcai-matriz';
  } catch {
    return 'tenant-tcai-matriz';
  }
}

export function setActiveTenantId(tenantId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TENANT, tenantId);
    window.dispatchEvent(new CustomEvent('tcai_tenant_changed', { detail: { tenantId } }));
  } catch (err) {
    console.error('[tenantService] Erro ao salvar active tenant:', err);
  }
}

export function getActiveTenant(): Tenant {
  const tenants = getStoredTenants();
  const activeId = getActiveTenantId();
  const found = tenants.find((t) => t.id === activeId);
  return found || tenants[0] || DEFAULT_TENANTS[0];
}

export function saveTenant(tenantData: Partial<Tenant> & { name: string }): Tenant {
  const tenants = getStoredTenants();
  const now = new Date().toISOString();

  if (tenantData.id) {
    // Update existing
    const index = tenants.findIndex((t) => t.id === tenantData.id);
    if (index >= 0) {
      const updated: Tenant = {
        ...tenants[index],
        ...tenantData,
      };
      tenants[index] = updated;
      saveStoredTenants(tenants);
      return updated;
    }
  }

  // Create new tenant
  const newTenantId = `tenant-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newTenant: Tenant = {
    id: newTenantId,
    name: tenantData.name,
    tradingName: tenantData.tradingName || tenantData.name,
    cnpjOrCpf: tenantData.cnpjOrCpf || '',
    segment: tenantData.segment || 'services',
    segmentLabel: tenantData.segmentLabel || 'Serviços & Negócios Locais',
    contactName: tenantData.contactName || 'Responsável Comercial',
    contactEmail: tenantData.contactEmail || '',
    contactPhone: tenantData.contactPhone || '',
    plan: tenantData.plan || 'pro',
    planName: tenantData.planName || 'Pro Business (R$ 1.900/mês)',
    monthlyFee: tenantData.monthlyFee || 1900,
    setupFeePaid: tenantData.setupFeePaid || 3500,
    status: tenantData.status || 'active',
    createdAt: now,
    nextBillingDate: tenantData.nextBillingDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
    whatsappInstanceName: tenantData.whatsappInstanceName || `${tenantData.name.replace(/\s+/g, '')}-Wpp`,
    whatsappConnected: tenantData.whatsappConnected ?? true,
    agentActive: tenantData.agentActive ?? true,
    activePipelineId: tenantData.activePipelineId || 'pipeline-digital-sales',
    usage: {
      leadsProcessedMonth: 0,
      maxLeadsAllowed: tenantData.plan === 'enterprise' ? 2000 : tenantData.plan === 'pro' ? 800 : 350,
      audioMessagesSent: 0,
      textMessagesSent: 0,
      aiTokensEstimated: 0,
      lastActiveAt: now,
    },
    customNotes: tenantData.customNotes || 'Novo cliente corporativo cadastrado na esteira TCAI.',
  };

  tenants.push(newTenant);
  saveStoredTenants(tenants);
  return newTenant;
}

export function toggleTenantStatus(tenantId: string): Tenant | null {
  const tenants = getStoredTenants();
  const index = tenants.findIndex((t) => t.id === tenantId);
  if (index < 0) return null;

  const current = tenants[index];
  const nextStatus: TenantStatus = current.status === 'active' ? 'suspended' : 'active';
  const updated: Tenant = {
    ...current,
    status: nextStatus,
    agentActive: nextStatus === 'active',
  };

  tenants[index] = updated;
  saveStoredTenants(tenants);
  return updated;
}

export function toggleTenantAgentActive(tenantId: string): Tenant | null {
  const tenants = getStoredTenants();
  const index = tenants.findIndex((t) => t.id === tenantId);
  if (index < 0) return null;

  const current = tenants[index];
  const updated: Tenant = {
    ...current,
    agentActive: !current.agentActive,
  };

  tenants[index] = updated;
  saveStoredTenants(tenants);
  return updated;
}

// Métricas Globais para a Visão SuperAdmin (Thiago)
export interface GlobalTenantSummary {
  totalTenants: number;
  activeTenantsCount: number;
  trialTenantsCount: number;
  suspendedTenantsCount: number;
  totalMrr: number; // Monthly Recurring Revenue
  totalSetupRevenue: number;
  totalLeadsThisMonth: number;
  totalAudiosSentThisMonth: number;
  totalTokensThisMonth: number;
}

export function calculateGlobalTenantSummary(): GlobalTenantSummary {
  const tenants = getStoredTenants();
  return tenants.reduce<GlobalTenantSummary>(
    (acc, t) => {
      acc.totalTenants += 1;
      if (t.status === 'active') {
        acc.activeTenantsCount += 1;
        acc.totalMrr += t.monthlyFee;
      } else if (t.status === 'trial') {
        acc.trialTenantsCount += 1;
        acc.totalMrr += t.monthlyFee;
      } else if (t.status === 'suspended') {
        acc.suspendedTenantsCount += 1;
      }
      acc.totalSetupRevenue += t.setupFeePaid;
      acc.totalLeadsThisMonth += t.usage.leadsProcessedMonth;
      acc.totalAudiosSentThisMonth += t.usage.audioMessagesSent;
      acc.totalTokensThisMonth += t.usage.aiTokensEstimated;
      return acc;
    },
    {
      totalTenants: 0,
      activeTenantsCount: 0,
      trialTenantsCount: 0,
      suspendedTenantsCount: 0,
      totalMrr: 0,
      totalSetupRevenue: 0,
      totalLeadsThisMonth: 0,
      totalAudiosSentThisMonth: 0,
      totalTokensThisMonth: 0,
    }
  );
}
