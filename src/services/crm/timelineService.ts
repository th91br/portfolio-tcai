/**
 * TCAI — Serviço de Linha do Tempo Unificada & Audit Trail (Timeline 360°)
 * Registra cronologicamente todas as ações comerciais, mensagens, diagnósticos e notas internas privadas.
 */

export type TimelineEventType =
  | 'lead_created'
  | 'whatsapp_message'
  | 'diagnostic_created'
  | 'proposal_sent'
  | 'meeting_scheduled'
  | 'stage_changed'
  | 'internal_note'
  | 'cnpj_enriched'
  | 'payment_received';

export interface TimelineEvent {
  id: string;
  contactId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: string;
  author?: string;
  metadata?: Record<string, unknown>;
}

const TIMELINE_STORAGE_PREFIX = 'tcai_timeline_';

export function getTimelineForContact(contactId: string): TimelineEvent[] {
  if (!contactId) return [];
  try {
    const raw = localStorage.getItem(`${TIMELINE_STORAGE_PREFIX}${contactId}`);
    if (raw) {
      const items: TimelineEvent[] = JSON.parse(raw);
      // Retorna em ordem decrescente (mais recente no topo)
      return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  } catch {
    // ignore parsing errors
  }
  return [];
}

export function saveTimelineEvents(contactId: string, events: TimelineEvent[]): void {
  if (!contactId) return;
  try {
    localStorage.setItem(`${TIMELINE_STORAGE_PREFIX}${contactId}`, JSON.stringify(events));
  } catch {
    // ignore storage quota errors
  }
}

export function addTimelineEvent(
  contactId: string,
  eventData: {
    type: TimelineEventType;
    title: string;
    description: string;
    author?: string;
    timestamp?: string;
    metadata?: Record<string, unknown>;
  }
): TimelineEvent {
  const current = getTimelineForContact(contactId);

  const newEvent: TimelineEvent = {
    id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    contactId,
    type: eventData.type,
    title: eventData.title,
    description: eventData.description,
    timestamp: eventData.timestamp || new Date().toISOString(),
    author: eventData.author || 'Thiago (TCAI)',
    metadata: eventData.metadata,
  };

  const updated = [newEvent, ...current];
  saveTimelineEvents(contactId, updated);
  return newEvent;
}

export function addInternalNote(contactId: string, noteText: string, author: string = 'Thiago'): TimelineEvent {
  return addTimelineEvent(contactId, {
    type: 'internal_note',
    title: 'Nota Interna Privada',
    description: noteText,
    author,
    metadata: { isPrivate: true },
  });
}
