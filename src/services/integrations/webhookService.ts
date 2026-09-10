import { Lead, Deal } from '../../lib/supabase';
import { saveRealLeadSubmission } from '../leads/realLeadsStorage';
import { addTimelineEvent } from '../crm/timelineService';
import { saveContactsLocally, fetchContacts, ChatContact } from '../agent/agentChatService';
import { assignNextLead } from '../crm/salesTeamService';

export interface WebhookConfig {
  id: string;
  token: string;
  isActive: boolean;
  defaultPipelineId: string;
  targetStageId: string;
  autoAssignSalesRep: boolean;
  notifyWhatsApp: boolean;
  createdAt: string;
  lastWebhookAt?: string;
  totalReceived: number;
}

export interface WebhookLogEntry {
  id: string;
  receivedAt: string;
  provider: 'meta_ads' | 'google_ads' | 'elementor' | 'typeform' | 'custom';
  status: 'success' | 'error';
  ip?: string;
  rawPayload: Record<string, any>;
  parsedData: {
    name: string;
    email?: string;
    phone: string;
    company?: string;
    origin?: string;
    utmSource?: string;
    utmCampaign?: string;
    notes?: string;
  };
  createdLeadId?: string;
  assignedRepName?: string;
  errorMessage?: string;
}

const STORAGE_KEY_WEBHOOK_CONFIG = 'tcai_webhook_config';
const STORAGE_KEY_WEBHOOK_LOGS = 'tcai_webhook_logs';

export function getWebhookConfig(): WebhookConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEBHOOK_CONFIG);
    if (raw) return JSON.parse(raw);
  } catch {}

  const defaultConfig: WebhookConfig = {
    id: 'tcai_whk_config_main',
    token: 'tcai_live_whk_' + Math.random().toString(36).substring(2, 10),
    isActive: true,
    defaultPipelineId: 'pipeline_digital_sales',
    targetStageId: 'NOVO',
    autoAssignSalesRep: true,
    notifyWhatsApp: true,
    createdAt: new Date().toISOString(),
    totalReceived: 8,
  };

  saveWebhookConfig(defaultConfig);
  return defaultConfig;
}

export function saveWebhookConfig(config: WebhookConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_WEBHOOK_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.warn('Erro ao salvar configuração do webhook:', err);
  }
}

export function rotateWebhookToken(): string {
  const config = getWebhookConfig();
  config.token = 'tcai_live_whk_' + Math.random().toString(36).substring(2, 10);
  saveWebhookConfig(config);
  return config.token;
}

export function getWebhookLogs(): WebhookLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEBHOOK_LOGS);
    if (raw) return JSON.parse(raw);
  } catch {}

  // Logs iniciais de demonstração executiva de anúncios reais
  const defaultLogs: WebhookLogEntry[] = [
    {
      id: 'log_whk_001',
      receivedAt: 'Hoje às 16:32',
      provider: 'meta_ads',
      status: 'success',
      rawPayload: {
        form_id: 'meta_form_leads_2026',
        ad_name: 'Vídeo Carrossel - Soluções IA',
        campaign_name: 'Campanha Escalar Vendas - Q3',
        full_name: 'Dr. Fernando Vasconcelos',
        email: 'contato@clinicaortopedica.com.br',
        phone_number: '+5511998811223',
        empresa: 'Clínica OrtoViva',
      },
      parsedData: {
        name: 'Dr. Fernando Vasconcelos',
        email: 'contato@clinicaortopedica.com.br',
        phone: '+55 11 99881-1223',
        company: 'Clínica OrtoViva',
        origin: 'Meta Ads (Instagram / Facebook)',
        utmSource: 'meta_ads',
        utmCampaign: 'Campanha Escalar Vendas - Q3',
      },
      createdLeadId: 'lead_meta_001',
      assignedRepName: 'Thiago Cassol (Lead Closer)',
    },
    {
      id: 'log_whk_002',
      receivedAt: 'Hoje às 14:15',
      provider: 'google_ads',
      status: 'success',
      rawPayload: {
        google_key: 'adwords_lead_ext',
        first_name: 'Mariana',
        last_name: 'Albuquerque',
        user_email: 'mariana@logisticaleste.com.br',
        user_phone: '+5547988334455',
        company: 'Log Leste Transportes',
      },
      parsedData: {
        name: 'Mariana Albuquerque',
        email: 'mariana@logisticaleste.com.br',
        phone: '+55 47 98833-4455',
        company: 'Log Leste Transportes',
        origin: 'Google Ads (Search B2B)',
        utmSource: 'google_ads',
        utmCampaign: 'Busca - Software de Automação',
      },
      createdLeadId: 'lead_google_002',
      assignedRepName: 'Rafael Mendonça (SDR)',
    },
  ];

  saveWebhookLogs(defaultLogs);
  return defaultLogs;
}

export function saveWebhookLogs(logs: WebhookLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WEBHOOK_LOGS, JSON.stringify(logs.slice(0, 50)));
  } catch (err) {
    console.warn('Erro ao salvar logs do webhook:', err);
  }
}

/**
 * Normalizador Universal Inteligente de Payloads
 * Mapeia variações de chaves enviadas por Meta Ads, Google Ads, Elementor, Typeform, Webflow, etc.
 */
export function normalizeIncomingLeadPayload(raw: Record<string, any>): WebhookLogEntry['parsedData'] {
  const getVal = (...keys: string[]): string => {
    for (const k of keys) {
      if (raw[k] !== undefined && raw[k] !== null && String(raw[k]).trim() !== '') {
        return String(raw[k]).trim();
      }
    }
    return '';
  };

  // 1. Extração do Nome
  let name = getVal(
    'full_name',
    'fullName',
    'name',
    'nome',
    'nome_completo',
    'lead_name',
    'first_name',
    'seu_nome'
  );
  const lastName = getVal('last_name', 'sobrenome');
  if (lastName && !name.includes(lastName)) {
    name = `${name} ${lastName}`.trim();
  }
  if (!name) name = 'Lead via Webhook';

  // 2. Extração do Telefone / WhatsApp
  const phone = getVal(
    'phone_number',
    'phone',
    'whatsapp',
    'telefone',
    'celular',
    'mobile',
    'contato',
    'user_phone'
  );

  // 3. Extração do E-mail
  const email = getVal('email', 'e-mail', 'mail', 'user_email', 'seu_email');

  // 4. Extração da Empresa
  const company = getVal('company', 'empresa', 'company_name', 'razao_social', 'nome_empresa');

  // 5. Origem & UTMs
  let origin = getVal('origin', 'origem', 'lead_source', 'source');
  if (!origin) {
    if (raw.ad_id || raw.ad_name || raw.campaign_name || raw.form_id) {
      origin = 'Meta Ads (Instagram / Facebook)';
    } else if (raw.google_key || raw.gclid) {
      origin = 'Google Ads';
    } else {
      origin = 'Webhook Integrado';
    }
  }

  const utmSource = getVal('utm_source', 'utmSource') || (origin.includes('Meta') ? 'meta_ads' : 'webhook');
  const utmCampaign = getVal('utm_campaign', 'utmCampaign', 'campaign_name', 'campaign');
  const notes = getVal('message', 'mensagem', 'obs', 'observacao', 'notes', 'interesse');

  return {
    name,
    email: email || undefined,
    phone: phone || '+55 (11) 99999-0000',
    company: company || 'Empresa em Potencial',
    origin,
    utmSource,
    utmCampaign: utmCampaign || undefined,
    notes: notes || undefined,
  };
}

/**
 * Processador Principal de Ingestão de Webhook
 * Cria o Lead, o Deal, adiciona à fila de contatos do WhatsApp e executa Round Robin.
 */
export async function processInboundWebhook(
  rawPayload: Record<string, any>,
  provider: WebhookLogEntry['provider'] = 'custom'
): Promise<{ success: boolean; leadId?: string; error?: string; assignedRep?: string }> {
  try {
    const config = getWebhookConfig();
    if (!config.isActive) {
      return { success: false, error: 'O endpoint de Webhook está temporariamente desativado nas configurações.' };
    }

    const parsed = normalizeIncomingLeadPayload(rawPayload);
    const leadId = `lead_whk_${Date.now()}`;
    const dealId = `deal_whk_${Date.now()}`;

    // Roteamento inteligente de vendedor (Round Robin)
    let assignedRepName = 'Thiago Cassol (Lead Closer)';
    if (config.autoAssignSalesRep) {
      const assignment = assignNextLead(leadId, config.defaultPipelineId);
      if (assignment) {
        assignedRepName = assignment.repName;
      }
    }

    // Criação do Lead Estruturado no CRM
    const newLead: Lead = {
      id: leadId,
      name: parsed.name,
      whatsapp: parsed.phone,
      email: parsed.email || 'lead@inbound.com',
      phone: parsed.phone,
      company: parsed.company || null,
      origin: parsed.origin || 'Webhook Integrado',
      utm_source: parsed.utmSource || null,
      utm_campaign: parsed.utmCampaign || null,
      utm_medium: null,
      utm_term: null,
      utm_content: null,
      device: 'webhook_api',
      status: 'NOVO',
      score: 85,
      score_category: 'ALTA PRIORIDADE',
      consent_lgpd: true,
      recommended_solution: parsed.notes || 'Qualificação Automática via Webhook',
      solution_reason: 'Entrada instantânea via campanha de tráfego pago',
      assigned_rep_name: assignedRepName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Criação do Deal no Pipeline
    const newDeal: Deal = {
      id: dealId,
      lead_id: leadId,
      title: `${parsed.company || parsed.name} — Oportunidade Inbound`,
      pipeline_stage: 'NOVO',
      pipeline_id: config.defaultPipelineId,
      assigned_rep_name: assignedRepName,
      estimated_value: 8500,
      proposed_value: null,
      final_value: null,
      probability: 10,
      expected_close_date: null,
      proposal_date: null,
      closed_at: null,
      lost_reason: null,
      lost_observation: null,
      next_action: 'Contato Imediato da IA no WhatsApp',
      next_action_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lead: newLead,
    };

    // Salva nos repositórios centrais do CRM
    saveRealLeadSubmission(newLead, newDeal);

    // Registra evento de auditoria na timeline
    addTimelineEvent(leadId, {
      type: 'whatsapp_message',
      title: `Lead capturado via ${parsed.origin}`,
      description: `Lead recebido e atribuído para ${assignedRepName} pelo motor Round Robin.`,
      author: 'TCAI Inbound Gateway',
    });

    // Injeta na lista de conversas do WhatsApp para atendimento imediato
    const currentContacts = await fetchContacts();
    const newContact: ChatContact = {
      id: leadId,
      name: parsed.name,
      company: parsed.company || 'Empresa Inbound',
      phone: parsed.phone,
      status: 'triage',
      statusLabel: 'Triagem Inicial',
      avatar: '💼',
      unread: 1,
      score: 85,
      slaTimeline: '7 DIAS ÚTEIS',
      projectType: 'Solução sob Medida',
      lastMessage: `Olá! Recebemos sua solicitação via ${parsed.origin}. O motor de IA já está pronto para te atender.`,
      lastMessageTime: 'Agora',
      messages: [
        {
          sender: 'system',
          text: `⚡ Lead capturado em tempo real via ${parsed.origin}. Vendedor atribuído: ${assignedRepName}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          sender: 'agent',
          text: `Olá, ${parsed.name}! Tudo bem? Aqui é o Thiago da TCAI. Recebi sua solicitação referente à sua empresa ${parsed.company || ''}. Como posso te ajudar a acelerar esse projeto?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    saveContactsLocally([newContact, ...currentContacts]);

    // Atualiza estatísticas e histórico de logs
    config.totalReceived = (config.totalReceived || 0) + 1;
    config.lastWebhookAt = new Date().toISOString();
    saveWebhookConfig(config);

    const logs = getWebhookLogs();
    const newLog: WebhookLogEntry = {
      id: `whk_log_${Date.now()}`,
      receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      provider,
      status: 'success',
      rawPayload,
      parsedData: parsed,
      createdLeadId: leadId,
      assignedRepName,
    };
    saveWebhookLogs([newLog, ...logs]);

    return { success: true, leadId, assignedRep: assignedRepName };
  } catch (err: any) {
    console.error('Erro no processador de webhook:', err);
    return { success: false, error: err.message || 'Erro interno ao processar payload do webhook.' };
  }
}
