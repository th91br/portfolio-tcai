/**
 * TCAI Digital Agents Team Service
 * Gerenciamento de Especialistas Digitais Autônomos 24h
 * Suporte a contratação modular, precificação flexível por porte de empresa (Pequena, Média, Enterprise)
 * e parametrização operacional por tenant.
 */

export type AgentDepartment = 'vendas' | 'marketing' | 'operacoes';
export type CompanyTier = 'small' | 'medium' | 'enterprise';

export interface DigitalAgent {
  id: string;
  name: string;
  role: string;
  department: AgentDepartment;
  departmentLabel: string;
  tagline: string;
  description: string;
  capabilities: string[];
  tone: 'consultative' | 'empathetic' | 'analytical' | 'direct';
  voiceId?: string;
  voiceName?: string;
  status: 'hired' | 'available' | 'paused';
  hiredAt?: string;
  pricing: {
    small: number;
    medium: number;
    enterprise: number;
    activePrice: number; // Preço efetivamente cobrado deste tenant
    setupFee: number;
  };
  stats: {
    conversationsCount: number;
    conversionRate: number;
    audiosSent: number;
  };
  permissions: {
    canSendAudio: boolean;
    canMoveKanban: boolean;
    canScheduleMeetings: boolean;
    canHandoffToHuman: boolean;
    canGenerateProposals: boolean;
  };
}

export interface CustomAgentRequest {
  tenantId: string;
  companyName: string;
  agentObjective: string;
  niche: string;
  requiredIntegrations: string[];
  contactEmail: string;
  contactPhone: string;
  budgetTier: CompanyTier;
  createdAt: string;
}

const STORAGE_PREFIX = 'tcai_digital_agents_';

const DEFAULT_AGENTS: DigitalAgent[] = [
  // --- Vendas & Atendimento ---
  {
    id: 'davi-closer',
    name: 'Davi',
    role: 'Vendedor & Closer Autônomo',
    department: 'vendas',
    departmentLabel: 'Vendas & Atendimento',
    tagline: 'Nenhum lead esfria',
    description: 'Atendimento consultivo imediato via WhatsApp, qualificação de interesse, condução do lead pelas etapas do funil e fechamento com envio de áudios realistas.',
    capabilities: ['atendimento-whatsapp', 'qualificacao-imediata', 'envio-audio-ptt', 'quebra-de-objecoes'],
    tone: 'consultative',
    voiceId: 'thiago-master',
    voiceName: 'Thiago Cassol (Fundador)',
    status: 'hired',
    hiredAt: '2026-08-15',
    pricing: {
      small: 490,
      medium: 1200,
      enterprise: 2900,
      activePrice: 490,
      setupFee: 1500
    },
    stats: {
      conversationsCount: 842,
      conversionRate: 28.4,
      audiosSent: 312
    },
    permissions: {
      canSendAudio: true,
      canMoveKanban: true,
      canScheduleMeetings: true,
      canHandoffToHuman: true,
      canGenerateProposals: true
    }
  },
  {
    id: 'sofia-suporte',
    name: 'Sofia',
    role: 'Atendimento ao Cliente & Triagem',
    department: 'vendas',
    departmentLabel: 'Vendas & Atendimento',
    tagline: 'Cliente respondido em minutos',
    description: 'Esclarece dúvidas frequentes sobre serviços, planos e horários, agenda visitas/reuniões e faz o transbordo inteligente para a equipe humana quando necessário.',
    capabilities: ['suporte-24-7', 'playbook-atendimento', 'agendamento-agenda', 'triagem-humana'],
    tone: 'empathetic',
    voiceId: 'camila-closer',
    voiceName: 'Camila Rocha (Closer B2B)',
    status: 'hired',
    hiredAt: '2026-08-20',
    pricing: {
      small: 390,
      medium: 890,
      enterprise: 1900,
      activePrice: 390,
      setupFee: 900
    },
    stats: {
      conversationsCount: 520,
      conversionRate: 42.0,
      audiosSent: 97
    },
    permissions: {
      canSendAudio: true,
      canMoveKanban: false,
      canScheduleMeetings: true,
      canHandoffToHuman: true,
      canGenerateProposals: false
    }
  },
  {
    id: 'lucas-sdr',
    name: 'Lucas',
    role: 'SDR Inbound / Qualificador 60s',
    department: 'vendas',
    departmentLabel: 'Vendas & Atendimento',
    tagline: 'Contato no primeiro minuto do anúncio',
    description: 'Recebe novos leads do Meta Ads e formulários no primeiro minuto, filtra perfil ideal (BANT) e direciona para os vendedores certos via Round Robin.',
    capabilities: ['inbound-ads', 'resposta-60s', 'qualificacao-bant', 'round-robin'],
    tone: 'direct',
    voiceId: 'rafael-sdr',
    voiceName: 'Rafael Mendes (SDR Consultivo)',
    status: 'available',
    pricing: {
      small: 450,
      medium: 990,
      enterprise: 2200,
      activePrice: 450,
      setupFee: 1200
    },
    stats: {
      conversationsCount: 0,
      conversionRate: 0,
      audiosSent: 0
    },
    permissions: {
      canSendAudio: true,
      canMoveKanban: true,
      canScheduleMeetings: false,
      canHandoffToHuman: true,
      canGenerateProposals: false
    }
  },

  // --- Marketing & Conteúdo ---
  {
    id: 'lia-copy',
    name: 'Lia',
    role: 'Copywriter de Alta Conversão',
    department: 'marketing',
    departmentLabel: 'Marketing & Conteúdo',
    tagline: 'Copy que converte',
    description: 'Escreve abordagens comerciais de alto impacto, mensagens de reativação de clientes inativos, roteiros de áudio persuasivos e propostas comerciais personalizadas.',
    capabilities: ['copywriting', 'propostas-personalizadas', 'recuperacao-leads', 'estudio-de-copy'],
    tone: 'consultative',
    status: 'hired',
    hiredAt: '2026-09-01',
    pricing: {
      small: 490,
      medium: 1100,
      enterprise: 2400,
      activePrice: 490,
      setupFee: 1000
    },
    stats: {
      conversationsCount: 194,
      conversionRate: 35.8,
      audiosSent: 0
    },
    permissions: {
      canSendAudio: false,
      canMoveKanban: false,
      canScheduleMeetings: false,
      canHandoffToHuman: false,
      canGenerateProposals: true
    }
  },
  {
    id: 'bela-conteudo',
    name: 'Bela',
    role: 'Redatora de Conteúdo / SEO',
    department: 'marketing',
    departmentLabel: 'Marketing & Conteúdo',
    tagline: 'Encontrada no Google',
    description: 'Produz artigos profundos e autorais para o blog e portfólio da empresa, posts para LinkedIn/Instagram e materiais educativos de nutrição comercial.',
    capabilities: ['artigo-seo', 'autoridade-tecnica', 'estudos-de-caso', 'nutricao-conteudo'],
    tone: 'analytical',
    status: 'available',
    pricing: {
      small: 390,
      medium: 850,
      enterprise: 1800,
      activePrice: 390,
      setupFee: 800
    },
    stats: {
      conversationsCount: 0,
      conversionRate: 0,
      audiosSent: 0
    },
    permissions: {
      canSendAudio: false,
      canMoveKanban: false,
      canScheduleMeetings: false,
      canHandoffToHuman: false,
      canGenerateProposals: false
    }
  },

  // --- Operações & Gestão ---
  {
    id: 'arthur-compliance',
    name: 'Arthur',
    role: 'Validador de Contratos & Compliance',
    department: 'operacoes',
    departmentLabel: 'Operações & Gestão',
    tagline: 'Contratos blindados e sem atrasos',
    description: 'Verifica termos contratuais, exigências técnicas do cliente e conformidade com LGPD antes do fechamento final para evitar passivos operacionais.',
    capabilities: ['analise-contratual', 'conformidade-lgpd', 'alerta-riscos', 'checklist-fechamento'],
    tone: 'analytical',
    status: 'available',
    pricing: {
      small: 590,
      medium: 1400,
      enterprise: 3200,
      activePrice: 590,
      setupFee: 1800
    },
    stats: {
      conversationsCount: 0,
      conversionRate: 0,
      audiosSent: 0
    },
    permissions: {
      canSendAudio: false,
      canMoveKanban: false,
      canScheduleMeetings: false,
      canHandoffToHuman: true,
      canGenerateProposals: true
    }
  },
  {
    id: 'clara-cobranca',
    name: 'Clara',
    role: 'Auditora de Cobrança & Confirmações',
    department: 'operacoes',
    departmentLabel: 'Operações & Gestão',
    tagline: 'Recebimento no prazo sem atrito',
    description: 'Envia avisos sutis de vencimento de faturas no WhatsApp, tira dúvidas de emissão de notas fiscais e confirma presença em compromissos para zerar faltas.',
    capabilities: ['lembrete-pagamento', 'confirmacao-reuniao', 'pos-venda-ativo', 'conciliacao-recibos'],
    tone: 'empathetic',
    status: 'available',
    pricing: {
      small: 350,
      medium: 790,
      enterprise: 1600,
      activePrice: 350,
      setupFee: 700
    },
    stats: {
      conversationsCount: 0,
      conversionRate: 0,
      audiosSent: 0
    },
    permissions: {
      canSendAudio: true,
      canMoveKanban: false,
      canScheduleMeetings: true,
      canHandoffToHuman: true,
      canGenerateProposals: false
    }
  }
];

class AgentTeamService {
  getAgents(tenantId: string = 'matriz-tcai'): DigitalAgent[] {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + tenantId);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    this.saveAgents(tenantId, DEFAULT_AGENTS);
    return DEFAULT_AGENTS;
  }

  saveAgents(tenantId: string, agents: DigitalAgent[]): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + tenantId, JSON.stringify(agents));
    } catch (e) {
      console.error('Erro ao persistir agentes:', e);
    }
  }

  toggleHireAgent(
    tenantId: string,
    agentId: string,
    customMonthlyPrice?: number
  ): DigitalAgent[] {
    const agents = this.getAgents(tenantId);
    const updated = agents.map((agent) => {
      if (agent.id === agentId) {
        const isHiring = agent.status !== 'hired';
        return {
          ...agent,
          status: isHiring ? ('hired' as const) : ('available' as const),
          hiredAt: isHiring ? new Date().toISOString().split('T')[0] : undefined,
          pricing: {
            ...agent.pricing,
            activePrice: customMonthlyPrice !== undefined ? customMonthlyPrice : agent.pricing.activePrice
          }
        };
      }
      return agent;
    });

    this.saveAgents(tenantId, updated);
    return updated;
  }

  updateAgent(
    tenantId: string,
    agentId: string,
    updates: Partial<DigitalAgent>
  ): DigitalAgent[] {
    const agents = this.getAgents(tenantId);
    const updated = agents.map((agent) => {
      if (agent.id === agentId) {
        return {
          ...agent,
          ...updates,
          pricing: {
            ...agent.pricing,
            ...(updates.pricing || {})
          },
          permissions: {
            ...agent.permissions,
            ...(updates.permissions || {})
          }
        };
      }
      return agent;
    });

    this.saveAgents(tenantId, updated);
    return updated;
  }

  requestCustomAgent(request: CustomAgentRequest): boolean {
    try {
      const existingKey = 'tcai_custom_agent_requests';
      const raw = localStorage.getItem(existingKey);
      const list: CustomAgentRequest[] = raw ? JSON.parse(raw) : [];
      list.unshift(request);
      localStorage.setItem(existingKey, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Erro ao salvar solicitação de agente sob medida:', e);
      return false;
    }
  }
}

export const agentTeamService = new AgentTeamService();
