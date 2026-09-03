import { createClient } from '@supabase/supabase-js';

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
 * Submete o lead completo e respostas via RPC segura e atômica
 */
export async function submitDiagnostic(payload: DiagnosticSubmissionPayload): Promise<{ success: boolean; leadId?: string; error?: string }> {
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
      console.error('Supabase RPC Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, leadId: data };
  } catch (err: any) {
    console.error('Submit lead error:', err);
    return { success: false, error: err.message || 'Erro ao conectar ao banco de dados.' };
  }
}

// =====================================================================
// SERVIÇOS PRIVADOS DO DASHBOARD (REQUER AUTENTICAÇÃO)
// =====================================================================

export async function fetchAllLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Lead[];
}

export async function fetchLeadFullDetails(leadId: string): Promise<{
  lead: Lead;
  answers: LeadAnswer[];
  score: LeadScoreDetail | null;
  notes: LeadNote[];
  history: LeadStatusHistory[];
}> {
  const [leadRes, answersRes, scoreRes, notesRes, historyRes] = await Promise.all([
    supabase.from('leads').select('*').eq('id', leadId).single(),
    supabase.from('lead_answers').select('*').eq('lead_id', leadId).order('step_number', { ascending: true }),
    supabase.from('lead_scores').select('*').eq('lead_id', leadId).maybeSingle(),
    supabase.from('lead_notes').select('*').eq('lead_id', leadId).order('created_at', { ascending: false }),
    supabase.from('lead_status_history').select('*').eq('lead_id', leadId).order('created_at', { ascending: false }),
  ]);

  if (leadRes.error) throw leadRes.error;

  return {
    lead: leadRes.data as Lead,
    answers: (answersRes.data || []) as LeadAnswer[],
    score: (scoreRes.data || null) as LeadScoreDetail | null,
    notes: (notesRes.data || []) as LeadNote[],
    history: (historyRes.data || []) as LeadStatusHistory[],
  };
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
  const { data, error } = await supabase
    .from('lead_notes')
    .insert({
      lead_id: leadId,
      content,
      author_email: authorEmail,
    })
    .select()
    .single();

  if (error) throw error;
  return data as LeadNote;
}

export async function fetchEventsForAnalytics(): Promise<LeadEvent[]> {
  const { data, error } = await supabase
    .from('lead_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1500);

  if (error) throw error;
  return (data || []) as LeadEvent[];
}

// =====================================================================
// DEALS (OPORTUNIDADES COMERCIAIS)
// =====================================================================

export async function fetchDeals(): Promise<Deal[]> {
  try {
    const { data: dealsData, error: dealsError } = await supabase
      .from('deals')
      .select('*, lead:leads(*)')
      .order('created_at', { ascending: false });

    if (!dealsError && dealsData && dealsData.length > 0) {
      return dealsData as Deal[];
    }
  } catch (err) {
    console.warn('Tabela deals indisponível ou vazia, fallback para leads:', err);
  }

  // Fallback: se a tabela de deals ainda não estiver criada ou estiver vazia,
  // mapeia os leads existentes como deals para manter a UI 100% funcional
  const { data: leadsData, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (leadsError) throw leadsError;

  return (leadsData || []).map((lead) => ({
    id: lead.id,
    lead_id: lead.id,
    title: `${lead.company || lead.name} — ${lead.recommended_solution || 'Projeto Digital'}`,
    pipeline_stage: (lead.status as PipelineStage) || 'NOVO',
    estimated_value: null,
    proposed_value: null,
    final_value: null,
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
    next_action: null,
    next_action_at: null,
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

  // 1. Tenta atualizar via RPC caso exista
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

  // 2. Fallback de update direto nas tabelas
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
    // deal table might not have been created yet
  }

  // Atualiza lead correspondente
  await updateLeadStatus(leadId, newStage, changedBy);
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
  try {
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*, lead:leads(*), deal:deals(*)')
      .order('scheduled_at', { ascending: true });

    if (!error && data) return data as FollowUp[];
  } catch {
    // Tabela ainda vazia ou indisponível
  }
  return [];
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

