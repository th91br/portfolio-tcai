import { Lead, Deal, FollowUp, LeadEvent } from '../../lib/supabase';

export const DEMO_ORIGIN_TAG = 'DEMO_MOCK';
export const LOCAL_STORAGE_DEMO_KEY = 'tcai_demo_scenario_cache';

export interface LocalDemoCache {
  leads: Lead[];
  deals: Deal[];
  followUps: FollowUp[];
  events: LeadEvent[];
}

export function getLocalDemoState(): LocalDemoCache | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DEMO_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setLocalDemoState(state: LocalDemoCache | null): void {
  try {
    if (!state) {
      localStorage.removeItem(LOCAL_STORAGE_DEMO_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_DEMO_KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.warn('Falha ao sincronizar local demo cache:', e);
  }
}

export function removeLeadFromLocalDemo(leadId: string): void {
  try {
    const current = getLocalDemoState();
    if (!current) return;
    setLocalDemoState({
      leads: current.leads.filter((l) => l.id !== leadId),
      deals: current.deals.filter((d) => d.lead_id !== leadId && d.id !== leadId),
      followUps: current.followUps.filter((f) => f.lead_id !== leadId),
      events: current.events,
    });
  } catch (e) {
    console.warn('Falha ao remover lead do cache demo local:', e);
  }
}
