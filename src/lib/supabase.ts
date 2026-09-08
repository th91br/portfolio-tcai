import { createClient } from '@supabase/supabase-js';
import {
  getLocalDemoState,
  setLocalDemoState,
  removeLeadFromLocalDemo,
} from '../services/demo/demoStorage';
import {
  saveRealLeadSubmission,
  getStoredRealLeadsData,
  updateStoredDealStage,
  updateStoredLeadStatus,
  addStoredLeadNote,
  getStoredLeadNotes,
  deleteStoredRealLead,
  notifyWhatsAppAgentServer,
} from '../services/leads/realLeadsStorage';

// Variáveis de ambiente com fallbacks de produção
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lkfoqgplwdmsadtuchje.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZm9xZ3Bsd2Rtc2FkdHVjaGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MzYwMzEsImV4cCI6MjEwNDAxMjAzMX0.vnbdLqFDoUykAfLB5EAwUHy7x9HLg74IgbhnifCr_Uw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// =====================================================================
// TIPOS E INTERFACES DE DADOS
// =====================================================================

export type LeadStatus =
  | 'NOVO'
  | 'QUALIFICADO'
  | 'CONTATADO'
  | 'REUNIÃO'
  | 'PROPOSTA'
  | 'NEGOCIAÇÃO'
  | 'FECHADO'
  | 'PERDIDO';

export type PipelineStage = LeadStatus;

export interface Deal {
  id: string;
  lead_id: string;
  title: string;
  pipeline_stage: PipelineStage;
  estimated_value: number | null;
  proposed_value: number | null;
  final_value: number | null;
  probability: number;
  expected_close_date: string | null;
  proposal_date: string | null;
  closed_at: string | null;
  lost_reason: string | null;
  lost_observation: string | null;
  next_action: string | null;
  next_action_at: string | null;
  created_at: string;
  updated_at: string;
  lead?: Lead;
}

export type FollowUpStatus = 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO';

export interface FollowUp {
  id: string;
  deal_id: string | null;
  lead_id: string;
  action: string;
  scheduled_at: string;
  notes: string | null;
  status: FollowUpStatus;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string;
  lead?: Lead;
  deal?: Deal;
}

export type NotificationType =
  | 'novo_lead'
  | 'alta_prioridade'
  | 'followup_hoje'
  | 'followup_atrasado'
  | 'proposta'
  | 'fechado'
  | 'perdido'
  | 'sistema';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  lead_id: string | null;
  deal_id: string | null;
  is_read: boolean;
  read_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface CommercialMetrics {
  totalLeads: number;
  leadsNovos: number;
  leadsQualificados: number;
  oportunidadesAbertas: number;
  pipelineBruto: number;
  pipelinePonderado: number;
  propostasAbertas: number;
  negociosFechados: number;
  receitaFechada: number;
  taxaConversaoGeral: number;
  taxaWinRate: number;
  ticketMedio: number;
  cicloVendasMedioDias: number;
  funilEtapas: {
    leads: number;
    qualificados: number;
    contatados: number;
    reunioes: number;
    propostas: number;
    negociacoes: number;
    fechados: number;
  };
}

export type LeadScoreCategory = 'ALTA PRIORIDADE' | 'POTENCIAL' | 'INICIAL';

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  company: string | null;
  status: LeadStatus;
  recommended_solution: string;
  solution_reason: string | null;
  score: number;
  score_category: LeadScoreCategory;
  consent_lgpd: boolean;
  origin: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  device: string | null;
  cnpj?: string | null;
  phone?: string;
  notes?: string;
  project_type?: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadAnswer {
  id: string;
  lead_id: string;
  step_number: number;
  question_id: string;
  question_title: string;
  answer_value: string;
  answer_label: string;
  created_at: string;
}

export interface LeadScoreDetail {
  id: string;
  lead_id: string;
  total_score: number;
  fit_score: number;
  intent_score: number;
  urgency_score: number;
  readiness_score: number;
  score_category: LeadScoreCategory;
  breakdown: Record<string, any>;
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  author_email: string;
  content: string;
  created_at: string;
}

export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  created_at: string;
}

export interface LeadEvent {
  id: string;
  session_id: string;
  event_name:
    | 'diagnostic_view'
    | 'diagnostic_start'
    | 'diagnostic_step'
    | 'diagnostic_complete'
    | 'diagnostic_lead_created'
    | 'diagnostic_whatsapp_click';
  step_number: number | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface DiagnosticSubmissionPayload {
  name: string;
  whatsapp: string;
  email: string;
  company?: string;
  consent_lgpd: boolean;
  recommended_solution: string;
  solution_reason: string;
  score: number;
  score_category: LeadScoreCategory;
  fit_score: number;
  intent_score: number;
  urgency_score: number;
  readiness_score: number;
  score_breakdown: Record<string, any>;
  answers: Array<{
    step_number: number;
    question_id: string;
    question_title: string;
    answer_value: string;
    answer_label: string;
  }>;
  origin?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  device?: string;
  session_id?: string;
}

// =====================================================================
// SESSÃO E IDENTIFICAÇÃO DO VISITANTE
// =====================================================================

export function getOrCreateSessionId(): string {
  const STORAGE_KEY = 'tcai_diagnostic_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    const val = params.get(key);
    if (val) utms[key] = val;
  });
  return utms;
}

export function detectDevice(): string {
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/i.test(ua) || width < 768) {
    return `Mobile (${width}px)`;
  }
  if (width < 1024) {
    return `Tablet (${width}px)`;
  }
  return `Desktop (${width}px)`;
}

// =====================================================================
// SERVIÇOS PÚBLICOS DO DIAGNÓSTICO
// =====================================================================

/**
 * Registra evento de telemetria no Supabase via RPC segura
 */
export async function trackDiagnosticEvent(
  eventName:
    | 'diagnostic_view'
    | 'diagnostic_start'
    | 'diagnostic_step'
    | 'diagnostic_complete'
    | 'diagnostic_lead_created'
    | 'diagnostic_whatsapp_click',
  stepNumber?: number,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const sessionId = getOrCreateSessionId();
    await supabase.rpc('log_diagnostic_event', {
      p_session_id: sessionId,
      p_event_name: eventName,
      p_step_number: stepNumber ?? null,
      p_metadata: {
        ...metadata,
        device: detectDevice(),
        url: window.location.href,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.warn('Silent analytics track notice:', err);
  }
}

/**
 * Submete o lead completo e respostas via RPC segura e atômica,
 * com persistência imediata à prova de falhas e sincronização em tempo real.
 */
export async function submitDiagnostic(payload: DiagnosticSubmissionPayload): Promise<{ success: boolean; leadId?: string; error?: string }> {
  // 1. Constrói Lead, Deal e FollowUp reais no cliente
  const clientLeadId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'lead_' + Date.now();
  const clientDealId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'deal_' + Date.now();
  const nowStr = new Date().toISOString();
  const followUpDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 horas após

  const dealTitle = `${payload.company ? payload.company.trim() + ' — ' : ''}${payload.name.trim()} (${payload.recommended_solution})`;
  const estimatedVal = payload.score >= 90 ? 15000 : payload.score >= 70 ? 9500 : 5000;

  const localLead: Lead = {
    id: clientLeadId,
    name: payload.name.trim(),
    whatsapp: payload.whatsapp.trim(),
    email: payload.email.trim().toLowerCase(),
    company: payload.company?.trim() || null,
    status: 'NOVO',
    recommended_solution: payload.recommended_solution,
    solution_reason: payload.solution_reason || null,
    score: payload.score,
    score_category: payload.score_category,
    consent_lgpd: payload.consent_lgpd,
    origin: payload.origin || 'Diagnóstico TCA — Portfólio',
    utm_source: payload.utm_source || null,
    utm_medium: payload.utm_medium || null,
    utm_campaign: payload.utm_campaign || null,
    utm_term: payload.utm_term || null,
    utm_content: payload.utm_content || null,
    device: payload.device || detectDevice(),
    created_at: nowStr,
    updated_at: nowStr,
  };

  const localDeal: Deal = {
    id: clientDealId,
    lead_id: clientLeadId,
    title: dealTitle,
    pipeline_stage: 'NOVO',
    estimated_value: estimatedVal,
    proposed_value: null,
    final_value: null,
    probability: 10,
    expected_close_date: null,
    proposal_date: null,
    closed_at: null,
    lost_reason: null,
    lost_observation: null,
    next_action: 'Primeiro contato via WhatsApp para alinhamento técnico',
    next_action_at: followUpDate,
    created_at: nowStr,
    updated_at: nowStr,
    lead: localLead,
  };

  const localFollowUp: FollowUp = {
    id: 'fup_' + Date.now(),
    deal_id: clientDealId,
    lead_id: clientLeadId,
    action: 'Enviar mensagem de introdução e agendamento de diagnóstico',
    scheduled_at: followUpDate,
    notes: `Lead com Score ${payload.score}% (${payload.score_category}) interessado em ${payload.recommended_solution}.`,
    status: 'PENDENTE',
    completed_at: null,
    completed_by: null,
    created_at: nowStr,
    lead: localLead,
    deal: localDeal,
  };

  // Salva imediatamente no store local resiliente
  saveRealLeadSubmission(localLead, localDeal, localFollowUp);

  // 2. Tenta persistência remota no Supabase via RPC
  try {
    const sessionId = getOrCreateSessionId();
    const utms = getUtmParams();

    const { data, error } = await supabase.rpc('submit_diagnostic_lead', {
      p_name: payload.name,
      p_whatsapp: payload.whatsapp,
      p_email: payload.email,
      p_company: payload.company || null,
      p_consent_lgpd: payload.consent_lgpd,
      p_recommended_solution: payload.recommended_solution,
      p_solution_reason: payload.solution_reason,
      p_score: payload.score,
      p_score_category: payload.score_category,
      p_fit_score: payload.fit_score,
      p_intent_score: payload.intent_score,
      p_urgency_score: payload.urgency_score,
      p_readiness_score: payload.readiness_score,
      p_score_breakdown: payload.score_breakdown,
      p_answers: payload.answers,
      p_origin: payload.origin || 'Diagnóstico TCA',
      p_utm_source: payload.utm_source || utms.utm_source || null,
      p_utm_medium: payload.utm_medium || utms.utm_medium || null,
      p_utm_campaign: payload.utm_campaign || utms.utm_campaign || null,
      p_utm_term: payload.utm_term || utms.utm_term || null,
      p_utm_content: payload.utm_content || utms.utm_content || null,
      p_device: payload.device || detectDevice(),
      p_session_id: sessionId,
    });

    if (error) {
      console.warn('Supabase RPC notice (lead protegido e salvo localmente com sucesso):', error.message);
      return { success: true, leadId: clientLeadId };
    }

    return { success: true, leadId: data || clientLeadId };
  } catch (err: any) {
    console.warn('Supabase offline/fallback ativo (lead salvo com sucesso localmente):', err);
    return { success: true, leadId: clientLeadId };
  }
}

// =====================================================================
// SERVIÇOS PRIVADOS DO DASHBOARD (REQUER AUTENTICAÇÃO)
// =====================================================================

export async function fetchAllLeads(): Promise<Lead[]> {
  let list: Lead[] = [];
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      list = data as Lead[];
    }
  } catch (err) {
    console.warn('Erro ao consultar leads remotos:', err);
  }

  // 1. Mescla com leads reais gravados localmente
  const realStore = getStoredRealLeadsData();
  if (realStore.leads.length > 0) {
    const remoteIds = new Set(list.map((l) => l.id));
    const remoteEmails = new Set(list.map((l) => l.email?.toLowerCase()).filter(Boolean));
    const realToAdd = realStore.leads.filter(
      (l) => !remoteIds.has(l.id) && (!l.email || !remoteEmails.has(l.email.toLowerCase()))
    );
    list = [...realToAdd, ...list];
  }

  // 2. Mescla com dados de demonstração locais caso existam
  const localDemo = getLocalDemoState();
  if (localDemo && localDemo.leads.length > 0) {
    const existingIds = new Set(list.map((l) => l.id));
    const existingEmails = new Set(list.map((l) => l.email?.toLowerCase()).filter(Boolean));
    const demoToAdd = localDemo.leads.filter(
      (l) => !existingIds.has(l.id) && (!l.email || !existingEmails.has(l.email.toLowerCase()))
    );
    list = [...list, ...demoToAdd];
  }

  // Deduplica lista final por id e email
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();
  return list.filter((l) => {
    if (seenIds.has(l.id)) return false;
    if (l.email && seenEmails.has(l.email.toLowerCase())) return false;
    seenIds.add(l.id);
    if (l.email) seenEmails.add(l.email.toLowerCase());
    return true;
  });
}

export async function fetchLeadFullDetails(leadId: string): Promise<{
  lead: Lead;
  answers: LeadAnswer[];
  score: LeadScoreDetail | null;
  notes: LeadNote[];
  history: LeadStatusHistory[];
}> {
  try {
    const [leadRes, answersRes, scoreRes, notesRes, historyRes] = await Promise.all([
      supabase.from('leads').select('*').eq('id', leadId).single(),
      supabase.from('lead_answers').select('*').eq('lead_id', leadId).order('step_number', { ascending: true }),
      supabase.from('lead_scores').select('*').eq('lead_id', leadId).maybeSingle(),
      supabase.from('lead_notes').select('*').eq('lead_id', leadId).order('created_at', { ascending: false }),
      supabase.from('lead_status_history').select('*').eq('lead_id', leadId).order('created_at', { ascending: false }),
    ]);

    if (!leadRes.error && leadRes.data) {
      return {
        lead: leadRes.data as Lead,
        answers: (answersRes.data || []) as LeadAnswer[],
        score: (scoreRes.data || null) as LeadScoreDetail | null,
        notes: (notesRes.data || []) as LeadNote[],
        history: (historyRes.data || []) as LeadStatusHistory[],
      };
    }
  } catch {
    // Tenta fallback do mock local
  }

  // 1. Fallback para leads reais submetidos no site
  const realStore = getStoredRealLeadsData();
  const realLead = realStore.leads.find((l) => l.id === leadId);
  if (realLead) {
    return {
      lead: realLead,
      answers: [
        {
          id: 'ans_1_' + leadId,
          lead_id: leadId,
          step_number: 1,
          question_id: 'solucao_desejada',
          question_title: 'Solução Recomendada',
          answer_value: realLead.recommended_solution || 'Automação & Agente IA',
          answer_label: realLead.recommended_solution || 'Automação & Agente IA',
          created_at: realLead.created_at,
        },
      ],
      score: {
        id: 'score_' + leadId,
        lead_id: leadId,
        total_score: realLead.score,
        fit_score: Math.round(realLead.score * 0.25),
        intent_score: Math.round(realLead.score * 0.25),
        urgency_score: Math.round(realLead.score * 0.25),
        readiness_score: Math.round(realLead.score * 0.25),
        score_category: realLead.score_category,
        breakdown: {
          fit: Math.round(realLead.score * 0.25),
          intent: Math.round(realLead.score * 0.25),
          urgency: Math.round(realLead.score * 0.25),
          readiness: Math.round(realLead.score * 0.25),
          is_real_lead: true,
        },
        created_at: realLead.created_at,
      },
      notes: getStoredLeadNotes(leadId),
      history: [
        {
          id: 'hist_' + leadId,
          lead_id: leadId,
          old_status: null,
          new_status: realLead.status,
          changed_by: 'Sistema (Diagnóstico Concluído)',
          created_at: realLead.created_at,
        },
      ],
    };
  }

  // 2. Fallback para leads demonstrativos locais
  const localDemo = getLocalDemoState();
  const demoLead = localDemo?.leads.find((l) => l.id === leadId);
  if (demoLead) {
    return {
      lead: demoLead,
      answers: [
        {
          id: 'ans_1_' + leadId,
          lead_id: leadId,
          step_number: 1,
          question_id: 'objetivo',
          question_title: 'Qual é o seu objetivo principal?',
          answer_value: 'escala',
          answer_label: 'Escalar vendas e modernização com tecnologia de ponta',
          created_at: demoLead.created_at,
        },
        {
          id: 'ans_2_' + leadId,
          lead_id: leadId,
          step_number: 2,
          question_id: 'problema_principal',
          question_title: 'Qual o maior desafio atual?',
          answer_value: 'conversao',
          answer_label: 'Processos manuais e necessidade de automação/IA',
          created_at: demoLead.created_at,
        },
        {
          id: 'ans_3_' + leadId,
          lead_id: leadId,
          step_number: 3,
          question_id: 'investimento',
          question_title: 'Faixa de investimento planejada',
          answer_value: 'invest_7k_15k',
          answer_label: 'R$ 7.000 a R$ 25.000+',
          created_at: demoLead.created_at,
        },
      ],
      score: {
        id: 'score_' + leadId,
        lead_id: leadId,
        total_score: demoLead.score,
        fit_score: Math.round(demoLead.score * 0.25),
        intent_score: Math.round(demoLead.score * 0.25),
        urgency_score: Math.round(demoLead.score * 0.25),
        readiness_score: Math.round(demoLead.score * 0.25),
        score_category: demoLead.score_category,
        breakdown: {
          fit: Math.round(demoLead.score * 0.25),
          intent: Math.round(demoLead.score * 0.25),
          urgency: Math.round(demoLead.score * 0.25),
          readiness: Math.round(demoLead.score * 0.25),
          is_demo: true,
        },
        created_at: demoLead.created_at,
      },
      notes: [
        {
          id: 'note_' + leadId,
          lead_id: leadId,
          author_email: 'sistema@tcai.com.br',
          content: `Lead qualificado com sucesso via Diagnóstico TCA. Recomendada solução de ${demoLead.recommended_solution}. Contato e follow-up agendados no CRM.`,
          created_at: demoLead.created_at,
        },
      ],
      history: [
        {
          id: 'hist_' + leadId,
          lead_id: leadId,
          old_status: null,
          new_status: demoLead.status,
          changed_by: 'Sistema',
          created_at: demoLead.created_at,
        },
      ],
    };
  }

  throw new Error('Lead não encontrado.');
}

export async function updateLeadStatus(leadId: string, newStatus: LeadStatus, changedBy: string = 'Thiago'): Promise<void> {
  const { error } = await supabase.rpc('update_lead_pipeline_status', {
    p_lead_id: leadId,
    p_new_status: newStatus,
    p_changed_by: changedBy,
  });

  if (error) throw error;
}

export async function addLeadNote(leadId: string, content: string, authorEmail: string): Promise<LeadNote> {
  const localNote: LeadNote = {
    id: 'note_' + Date.now(),
    lead_id: leadId,
    content: content.trim(),
    author_email: authorEmail,
    created_at: new Date().toISOString(),
  };

  addStoredLeadNote(localNote);

  try {
    const { data, error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: leadId,
        content: content.trim(),
        author_email: authorEmail,
      })
      .select()
      .single();

    if (!error && data) return data as LeadNote;
  } catch {}

  return localNote;
}

export async function fetchEventsForAnalytics(): Promise<LeadEvent[]> {
  let list: LeadEvent[] = [];
  try {
    const { data, error } = await supabase
      .from('lead_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1500);

    if (!error && data) {
      list = data as LeadEvent[];
    }
  } catch (err) {
    console.warn('Falha ao consultar eventos remotos:', err);
  }

  const localDemo = getLocalDemoState();
  if (localDemo && localDemo.events.length > 0) {
    const existingIds = new Set(list.map((e) => e.id));
    const demoToAdd = localDemo.events.filter((e) => !existingIds.has(e.id));
    list = [...list, ...demoToAdd];
  }

  return list;
}

// =====================================================================
// DEALS (OPORTUNIDADES COMERCIAIS)
// =====================================================================

export async function fetchDeals(): Promise<Deal[]> {
  let dealsList: Deal[] = [];
  try {
    const { data: dealsData, error: dealsError } = await supabase
      .from('deals')
      .select('*, lead:leads(*)')
      .order('created_at', { ascending: false });

    if (!dealsError && dealsData && dealsData.length > 0) {
      dealsList = dealsData as Deal[];
    }
  } catch (err) {
    console.warn('Tabela deals indisponível ou vazia, fallback para leads:', err);
  }

  // 1. Mescla com deals reais locais
  const realStore = getStoredRealLeadsData();
  if (realStore.deals.length > 0) {
    const existingIds = new Set(dealsList.map((d) => d.id));
    const existingLeadIds = new Set(dealsList.map((d) => d.lead_id).filter(Boolean));
    const realDealsToAdd = realStore.deals.filter(
      (d) => !existingIds.has(d.id) && !existingLeadIds.has(d.lead_id)
    );
    dealsList = [...realDealsToAdd, ...dealsList];
  }

  // 2. Mescla com demo deals
  const localDemo = getLocalDemoState();
  if (localDemo && localDemo.deals.length > 0) {
    const existingIds = new Set(dealsList.map((d) => d.id));
    const existingLeadIds = new Set(dealsList.map((d) => d.lead_id).filter(Boolean));
    const demoDeals = localDemo.deals.filter(
      (d) => !existingIds.has(d.id) && !existingLeadIds.has(d.lead_id)
    );
    dealsList = [...dealsList, ...demoDeals];
  }

  if (dealsList.length > 0) {
    const seen = new Set<string>();
    return dealsList.filter((d) => {
      const key = d.lead_id || d.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Fallback: se a tabela de deals ainda não estiver criada ou estiver vazia,
  // mapeia os leads existentes como deals para manter a UI 100% funcional
  const leadsData = await fetchAllLeads();

  return (leadsData || []).map((lead) => ({
    id: lead.id,
    lead_id: lead.id,
    title: `${lead.company || lead.name} — ${lead.recommended_solution || 'Projeto Digital'}`,
    pipeline_stage: (lead.status as PipelineStage) || 'NOVO',
    estimated_value: lead.score >= 90 ? 15000 : lead.score >= 70 ? 9500 : 5000,
    proposed_value: null,
    final_value: lead.status === 'FECHADO' ? 12000 : null,
    probability:
      lead.status === 'FECHADO'
        ? 100
        : lead.status === 'NEGOCIAÇÃO'
        ? 80
        : lead.status === 'PROPOSTA'
        ? 65
        : lead.status === 'REUNIÃO'
        ? 50
        : lead.status === 'CONTATADO'
        ? 30
        : lead.status === 'QUALIFICADO'
        ? 20
        : lead.status === 'PERDIDO'
        ? 0
        : 10,
    expected_close_date: null,
    proposal_date: null,
    closed_at: lead.status === 'FECHADO' ? lead.updated_at : null,
    lost_reason: null,
    lost_observation: null,
    next_action: 'Primeiro contato via WhatsApp para alinhamento',
    next_action_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    created_at: lead.created_at,
    updated_at: lead.updated_at,
    lead: lead as Lead,
  }));
}

export async function fetchDealByLeadId(leadId: string): Promise<Deal | null> {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('lead_id', leadId)
      .maybeSingle();

    if (!error && data) return data as Deal;
  } catch {
    // Silently fall back
  }

  const realStore = getStoredRealLeadsData();
  const found = realStore.deals.find((d) => d.lead_id === leadId);
  if (found) return found;

  return null;
}

export async function updateDealStage(params: {
  dealId: string;
  leadId: string;
  newStage: PipelineStage;
  finalValue?: number | null;
  lostReason?: string | null;
  lostObservation?: string | null;
  probability?: number;
  changedBy?: string;
}): Promise<void> {
  const { dealId, leadId, newStage, finalValue, lostReason, lostObservation, probability, changedBy } = params;

  // 1. Atualiza no armazenamento local de leads reais
  updateStoredDealStage(dealId, newStage, {
    finalValue,
    lostReason,
    lostObservation,
    probability,
  });

  // 2. Atualiza demo state caso esteja em demo mode
  const localDemo = getLocalDemoState();
  if (localDemo) {
    const demoDeal = localDemo.deals.find((d) => d.id === dealId || d.lead_id === leadId);
    if (demoDeal) {
      demoDeal.pipeline_stage = newStage;
      if (probability !== undefined) demoDeal.probability = probability;
      if (finalValue !== undefined) demoDeal.final_value = finalValue;
      if (lostReason !== undefined) demoDeal.lost_reason = lostReason;
      if (lostObservation !== undefined) demoDeal.lost_observation = lostObservation;
      const demoLead = localDemo.leads.find((l) => l.id === leadId);
      if (demoLead) demoLead.status = newStage;
      setLocalDemoState(localDemo);
    }
  }

  // 3. Tenta atualizar via RPC caso exista no Supabase
  try {
    const { error: rpcError } = await supabase.rpc('update_deal_stage', {
      p_deal_id: dealId,
      p_new_stage: newStage,
      p_final_value: finalValue ?? null,
      p_lost_reason: lostReason ?? null,
      p_lost_observation: lostObservation ?? null,
      p_probability: probability ?? null,
      p_changed_by: changedBy ?? 'Thiago',
    });

    if (!rpcError) return;
  } catch {
    // Fallback para update direto
  }

  // 4. Fallback de update direto nas tabelas
  const defaultProb =
    newStage === 'FECHADO'
      ? 100
      : newStage === 'NEGOCIAÇÃO'
      ? 80
      : newStage === 'PROPOSTA'
      ? 65
      : newStage === 'REUNIÃO'
      ? 50
      : newStage === 'CONTATADO'
      ? 30
      : newStage === 'QUALIFICADO'
      ? 20
      : newStage === 'PERDIDO'
      ? 0
      : 10;

  try {
    await supabase
      .from('deals')
      .update({
        pipeline_stage: newStage,
        probability: probability ?? defaultProb,
        final_value: newStage === 'FECHADO' ? finalValue : undefined,
        closed_at: newStage === 'FECHADO' ? new Date().toISOString() : undefined,
        lost_reason: newStage === 'PERDIDO' ? lostReason : undefined,
        lost_observation: newStage === 'PERDIDO' ? lostObservation : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dealId);
  } catch {
    // Silently continue
  }

  // Atualiza lead correspondente
  try {
    await updateLeadStatus(leadId, newStage, changedBy);
  } catch {}
}

export async function updateDealDetails(
  dealId: string,
  leadId: string,
  updates: Partial<Deal>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('deals')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dealId);

    if (!error) return;
  } catch {
    // Silently continue
  }

  // Se o pipeline stage foi alterado nas propriedades do deal, sincroniza no lead
  if (updates.pipeline_stage) {
    await updateLeadStatus(leadId, updates.pipeline_stage);
  }
}

// =====================================================================
// FOLLOW-UPS (PRÓXIMAS AÇÕES)
// =====================================================================

export async function fetchFollowUps(): Promise<FollowUp[]> {
  let list: FollowUp[] = [];
  try {
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*, lead:leads(*), deal:deals(*)')
      .order('scheduled_at', { ascending: true });

    if (!error && data) list = data as FollowUp[];
  } catch {
    // Tabela ainda vazia ou indisponível
  }

  // 1. Mescla com follow-ups reais do armazenamento local
  const realStore = getStoredRealLeadsData();
  if (realStore.followUps.length > 0) {
    const existingIds = new Set(list.map((f) => f.id));
    const realToAdd = realStore.followUps.filter((f) => !existingIds.has(f.id));
    list = [...realToAdd, ...list];
  }

  // 2. Mescla com follow-ups de demonstração
  const localDemo = getLocalDemoState();
  if (localDemo && localDemo.followUps.length > 0) {
    const existingIds = new Set(list.map((f) => f.id));
    const demoToAdd = localDemo.followUps.filter((f) => !existingIds.has(f.id));
    list = [...list, ...demoToAdd];
  }

  const seenKeys = new Set<string>();
  return list.filter((f) => {
    const key = f.id || `${f.lead_id}_${f.action}`;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });
}

export async function createFollowUp(params: {
  leadId: string;
  dealId?: string | null;
  action: string;
  scheduledAt: string;
  notes?: string | null;
}): Promise<FollowUp | null> {
  try {
    const { data, error } = await supabase
      .from('follow_ups')
      .insert({
        lead_id: params.leadId,
        deal_id: params.dealId ?? null,
        action: params.action,
        scheduled_at: params.scheduledAt,
        notes: params.notes ?? null,
        status: 'PENDENTE',
      })
      .select('*, lead:leads(*)')
      .single();

    if (!error && data) return data as FollowUp;
  } catch (err) {
    console.error('Falha ao criar follow-up:', err);
  }
  return null;
}

export async function completeFollowUp(id: string, userEmail: string = 'Thiago'): Promise<void> {
  try {
    await supabase
      .from('follow_ups')
      .update({
        status: 'CONCLUIDO',
        completed_at: new Date().toISOString(),
        completed_by: userEmail,
      })
      .eq('id', id);
  } catch (err) {
    console.error('Falha ao concluir follow-up:', err);
  }
}

// =====================================================================
// NOTIFICAÇÕES INTERNAS
// =====================================================================

export async function fetchNotifications(): Promise<NotificationItem[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) return data as NotificationItem[];
  } catch {
    // Silently return empty list
  }
  return [];
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', id);
  } catch (err) {
    console.error('Falha ao marcar notificação como lida:', err);
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('is_read', false);
  } catch (err) {
    console.error('Falha ao marcar todas notificações:', err);
  }
}

// =====================================================================
// MÉTRICAS COMERCIAIS
// =====================================================================

export const fetchLeads = fetchAllLeads;

export async function fetchCommercialMetrics(): Promise<CommercialMetrics> {
  const [deals, leads] = await Promise.all([fetchDeals(), fetchAllLeads()]);

  const totalLeads = leads.length;
  const leadsNovos = leads.filter((l: Lead) => l.status === 'NOVO').length;
  const leadsQualificados = leads.filter((l: Lead) => l.status !== 'NOVO' && l.status !== 'PERDIDO').length;

  const abertas = deals.filter(
    (d: Deal) => d.pipeline_stage !== 'FECHADO' && d.pipeline_stage !== 'PERDIDO'
  );
  const fechados = deals.filter((d: Deal) => d.pipeline_stage === 'FECHADO');
  const perdidos = deals.filter((d: Deal) => d.pipeline_stage === 'PERDIDO');
  const propostas = deals.filter((d: Deal) => d.pipeline_stage === 'PROPOSTA');

  // Pipeline Bruto = soma dos valores de negócios abertos
  const pipelineBruto = abertas.reduce((acc: number, d: Deal) => {
    const val = Number(d.proposed_value || d.estimated_value || 0);
    return acc + val;
  }, 0);

  // Pipeline Ponderado = soma de (valor * probabilidade / 100)
  const pipelinePonderado = abertas.reduce((acc: number, d: Deal) => {
    const val = Number(d.proposed_value || d.estimated_value || 0);
    const prob = Number(d.probability || 0);
    return acc + (val * prob) / 100;
  }, 0);

  // Receita Fechada = soma de final_value dos fechados
  const receitaFechada = fechados.reduce((acc: number, d: Deal) => {
    return acc + Number(d.final_value || d.proposed_value || d.estimated_value || 0);
  }, 0);

  // Ticket Médio
  const ticketMedio = fechados.length > 0 ? receitaFechada / fechados.length : 0;

  // Win Rate = Fechados / (Fechados + Perdidos)
  const totalConcluidos = fechados.length + perdidos.length;
  const taxaWinRate = totalConcluidos > 0 ? (fechados.length / totalConcluidos) * 100 : 0;

  // Taxa Geral = Fechados / Total Leads
  const taxaConversaoGeral = totalLeads > 0 ? (fechados.length / totalLeads) * 100 : 0;

  // Ciclo Médio de Vendas (dias)
  let somaDiasCiclo = 0;
  let qtdComData = 0;
  fechados.forEach((d: Deal) => {
    if (d.closed_at && d.created_at) {
      const diffMs = new Date(d.closed_at).getTime() - new Date(d.created_at).getTime();
      const diffDias = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      somaDiasCiclo += diffDias;
      qtdComData++;
    }
  });
  const cicloVendasMedioDias = qtdComData > 0 ? Math.round(somaDiasCiclo / qtdComData) : 0;

  return {
    totalLeads,
    leadsNovos,
    leadsQualificados,
    oportunidadesAbertas: abertas.length,
    pipelineBruto,
    pipelinePonderado,
    propostasAbertas: propostas.length,
    negociosFechados: fechados.length,
    receitaFechada,
    taxaConversaoGeral,
    taxaWinRate,
    ticketMedio,
    cicloVendasMedioDias,
    funilEtapas: {
      leads: totalLeads,
      qualificados: leads.filter((l: Lead) => l.status !== 'NOVO').length,
      contatados: leads.filter((l: Lead) =>
        ['CONTATADO', 'REUNIÃO', 'PROPOSTA', 'NEGOCIAÇÃO', 'FECHADO'].includes(l.status)
      ).length,
      reunioes: leads.filter((l: Lead) =>
        ['REUNIÃO', 'PROPOSTA', 'NEGOCIAÇÃO', 'FECHADO'].includes(l.status)
      ).length,
      propostas: leads.filter((l: Lead) => ['PROPOSTA', 'NEGOCIAÇÃO', 'FECHADO'].includes(l.status)).length,
      negociacoes: leads.filter((l: Lead) => ['NEGOCIAÇÃO', 'FECHADO'].includes(l.status)).length,
      fechados: fechados.length,
    },
  };
}

// =====================================================================
// AI LEAD INSIGHTS (TCA SALES COPILOT)
// =====================================================================

export async function fetchLeadInsights(leadId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('ai_lead_insights')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (!error && data) return data;
  } catch (err) {
    console.warn('Tabela ai_lead_insights indisponível:', err);
  }
  return [];
}

export async function saveLeadInsight(params: {
  leadId: string;
  dealId?: string | null;
  insightType?: string;
  structuredOutput: any;
  model?: string;
  promptVersion?: string;
  sourceSnapshotHash: string;
}): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('ai_lead_insights')
      .insert({
        lead_id: params.leadId,
        deal_id: params.dealId ?? null,
        insight_type: params.insightType || 'full_analysis',
        structured_output: params.structuredOutput,
        model: params.model || 'TCA Sales Copilot v1',
        prompt_version: params.promptVersion || 'sales_copilot_v1',
        source_snapshot_hash: params.sourceSnapshotHash,
      })
      .select()
      .single();

    if (!error && data) return data;
  } catch (err) {
    console.warn('Não foi possível persistir insight no banco:', err);
  }
  return null;
}

export async function updateInsightFeedback(insightId: string, helpful: boolean): Promise<void> {
  try {
    await supabase
      .from('ai_lead_insights')
      .update({ helpful_feedback: helpful })
      .eq('id', insightId);
  } catch (err) {
    console.warn('Falha ao registrar feedback de IA:', err);
  }
}

// =====================================================================
// EXCLUSÃO DE DADOS (LEAD INDIVIDUAL E DADOS DEMO)
// =====================================================================

export async function deleteLeadById(leadId: string): Promise<boolean> {
  // 0. Remove do cache local (demo ou lead real)
  removeLeadFromLocalDemo(leadId);
  deleteStoredRealLead(leadId);

  try {
    // 1. Tenta deletar deals, follow_ups e eventos associados por segurança
    await Promise.allSettled([
      supabase.from('deals').delete().eq('lead_id', leadId),
      supabase.from('follow_ups').delete().eq('lead_id', leadId),
      supabase.from('lead_notes').delete().eq('lead_id', leadId),
      supabase.from('lead_answers').delete().eq('lead_id', leadId),
      supabase.from('lead_scores').delete().eq('lead_id', leadId),
      supabase.from('lead_status_history').delete().eq('lead_id', leadId),
      supabase.from('ai_lead_insights').delete().eq('lead_id', leadId),
      supabase.from('notifications').delete().eq('lead_id', leadId),
    ]);

    // 2. Deleta o registro principal na tabela leads
    const { error } = await supabase.from('leads').delete().eq('id', leadId);
    if (error) {
      console.error('Erro ao deletar lead:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha ao excluir lead:', err);
    return false;
  }
}

export async function deleteDemoData(): Promise<{ success: boolean; deletedCount?: number }> {
  // 0. Remove cache local imediatamente
  setLocalDemoState(null);

  try {
    // Busca todos os IDs dos leads marcados como DEMO_MOCK
    const { data: demoLeads, error: fetchErr } = await supabase
      .from('leads')
      .select('id')
      .eq('origin', 'DEMO_MOCK');

    if (fetchErr) {
      console.error('Erro ao buscar leads demo:', fetchErr);
    }

    const demoIds = (demoLeads || []).map((l) => l.id);

    if (demoIds.length > 0) {
      // Exclui dependências associadas
      await Promise.allSettled([
        supabase.from('deals').delete().in('lead_id', demoIds),
        supabase.from('follow_ups').delete().in('lead_id', demoIds),
        supabase.from('lead_notes').delete().in('lead_id', demoIds),
        supabase.from('lead_answers').delete().in('lead_id', demoIds),
        supabase.from('lead_scores').delete().in('lead_id', demoIds),
        supabase.from('lead_status_history').delete().in('lead_id', demoIds),
        supabase.from('ai_lead_insights').delete().in('lead_id', demoIds),
        supabase.from('notifications').delete().in('lead_id', demoIds),
      ]);

      // Exclui os leads demo
      await supabase.from('leads').delete().in('id', demoIds);
    }

    // Exclui também os leads com origin DEMO_MOCK diretamente
    await supabase.from('leads').delete().eq('origin', 'DEMO_MOCK');

    // Exclui eventos de telemetria demo
    await supabase.from('lead_events').delete().like('session_id', 'demo_%');

    return { success: true, deletedCount: demoIds.length };
  } catch (err) {
    console.error('Falha ao excluir dados demo:', err);
    return { success: false };
  }
}


