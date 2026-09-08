import { Lead, Deal, FollowUp, LeadNote, LeadStatus, PipelineStage } from '../../lib/supabase';

export const REAL_LEADS_STORAGE_KEY = 'tcai_real_leads_store';

export interface RealLeadsStore {
  leads: Lead[];
  deals: Deal[];
  followUps: FollowUp[];
  notes: Record<string, LeadNote[]>;
}

function getInitialStore(): RealLeadsStore {
  return {
    leads: [],
    deals: [],
    followUps: [],
    notes: {},
  };
}

export function getStoredRealLeadsData(): RealLeadsStore {
  try {
    const raw = localStorage.getItem(REAL_LEADS_STORAGE_KEY);
    if (!raw) return getInitialStore();
    const parsed = JSON.parse(raw);
    return {
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      deals: Array.isArray(parsed.deals) ? parsed.deals : [],
      followUps: Array.isArray(parsed.followUps) ? parsed.followUps : [],
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
    };
  } catch {
    return getInitialStore();
  }
}

export function saveStoredRealLeadsData(data: RealLeadsStore): void {
  try {
    localStorage.setItem(REAL_LEADS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Falha ao gravar armazenamento local de leads reais:', err);
  }
}

export function saveRealLeadSubmission(lead: Lead, deal?: Deal, followUp?: FollowUp): void {
  const store = getStoredRealLeadsData();

  // Remove duplicata prévia se mesmo email ou mesmo ID
  store.leads = store.leads.filter(
    (l) => l.id !== lead.id && (!lead.email || l.email?.toLowerCase() !== lead.email.toLowerCase())
  );
  store.leads.unshift(lead);

  if (deal) {
    store.deals = store.deals.filter((d) => d.id !== deal.id && d.lead_id !== lead.id);
    store.deals.unshift(deal);
  }

  if (followUp) {
    store.followUps = store.followUps.filter((f) => f.id !== followUp.id && f.lead_id !== lead.id);
    store.followUps.unshift(followUp);
  }

  saveStoredRealLeadsData(store);

  // Notifica o servidor local do WhatsApp em background sem bloquear
  notifyWhatsAppAgentServer(lead, deal).catch(() => {});
}

export function updateStoredDealStage(
  dealId: string,
  newStage: PipelineStage,
  extra?: {
    finalValue?: number | null;
    lostReason?: string | null;
    lostObservation?: string | null;
    probability?: number;
  }
): void {
  const store = getStoredRealLeadsData();
  const deal = store.deals.find((d) => d.id === dealId || d.lead_id === dealId);
  if (deal) {
    deal.pipeline_stage = newStage;
    if (extra?.probability !== undefined) deal.probability = extra.probability;
    if (extra?.finalValue !== undefined) deal.final_value = extra.finalValue;
    if (extra?.lostReason !== undefined) deal.lost_reason = extra.lostReason;
    if (extra?.lostObservation !== undefined) deal.lost_observation = extra.lostObservation;
    deal.updated_at = new Date().toISOString();

    // Sincroniza lead correspondente
    const lead = store.leads.find((l) => l.id === deal.lead_id);
    if (lead) {
      lead.status = newStage;
      lead.updated_at = new Date().toISOString();
    }
    saveStoredRealLeadsData(store);
  }
}

export function updateStoredLeadStatus(leadId: string, newStatus: LeadStatus): void {
  const store = getStoredRealLeadsData();
  const lead = store.leads.find((l) => l.id === leadId);
  if (lead) {
    lead.status = newStatus;
    lead.updated_at = new Date().toISOString();

    const deal = store.deals.find((d) => d.lead_id === leadId || d.id === leadId);
    if (deal) {
      deal.pipeline_stage = newStatus;
      deal.updated_at = new Date().toISOString();
    }
    saveStoredRealLeadsData(store);
  }
}

export function addStoredLeadNote(note: LeadNote): void {
  const store = getStoredRealLeadsData();
  if (!store.notes[note.lead_id]) {
    store.notes[note.lead_id] = [];
  }
  store.notes[note.lead_id].unshift(note);
  saveStoredRealLeadsData(store);
}

export function getStoredLeadNotes(leadId: string): LeadNote[] {
  const store = getStoredRealLeadsData();
  return store.notes[leadId] || [];
}

export function deleteStoredRealLead(leadId: string): void {
  const store = getStoredRealLeadsData();
  store.leads = store.leads.filter((l) => l.id !== leadId);
  store.deals = store.deals.filter((d) => d.lead_id !== leadId && d.id !== leadId);
  store.followUps = store.followUps.filter((f) => f.lead_id !== leadId);
  delete store.notes[leadId];
  saveStoredRealLeadsData(store);
}

/**
 * Notifica o servidor local do agente WhatsApp (porta 3080 ou 3000)
 * para criar imediatamente um chat ativo com dossiê do lead.
 */
export async function notifyWhatsAppAgentServer(lead: Lead, deal?: Deal): Promise<boolean> {
  const candidatePorts = [3080, 3000, 3001];

  for (const port of candidatePorts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`http://localhost:${port}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lead.id,
          name: lead.name,
          whatsapp: lead.whatsapp,
          email: lead.email,
          company: lead.company,
          score: lead.score,
          scoreCategory: lead.score_category,
          solution: lead.recommended_solution,
          reason: lead.solution_reason,
          dealTitle: deal?.title,
          estimatedValue: deal?.estimated_value,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        return true;
      }
    } catch {
      // Tenta a próxima porta sem quebrar o fluxo
    }
  }

  return false;
}
