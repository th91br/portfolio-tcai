/**
 * TCAI — Serviço Unificado de CRM 360°
 * Sincroniza e unifica Leads do site (Supabase/formulários) e Contatos do WhatsApp
 * garantindo uma visão única de pipeline, métricas e histórico.
 */

import { Lead, Deal, PipelineStage } from '../../lib/supabase';
import { ChatContact } from '../agent/agentChatService';
import { getStoredRealLeadsData, saveStoredRealLeadsData } from '../leads/realLeadsStorage';
import { addTimelineEvent } from './timelineService';

export function mapContactStageToPipeline(stage: string): PipelineStage {
  switch (stage) {
    case 'triage':
      return 'NOVO';
    case 'ai_qualified':
      return 'QUALIFICADO';
    case 'proposal_sent':
      return 'PROPOSTA';
    case 'meeting_booked':
      return 'REUNIÃO';
    case 'closed':
      return 'FECHADO';
    default:
      return 'NOVO';
  }
}

export function mapPipelineToContactStage(
  stage: PipelineStage
): 'triage' | 'ai_qualified' | 'proposal_sent' | 'meeting_booked' | 'closed' {
  switch (stage) {
    case 'NOVO':
    case 'CONTATADO':
      return 'triage';
    case 'QUALIFICADO':
      return 'ai_qualified';
    case 'PROPOSTA':
    case 'NEGOCIAÇÃO':
      return 'proposal_sent';
    case 'REUNIÃO':
      return 'meeting_booked';
    case 'FECHADO':
      return 'closed';
    case 'PERDIDO':
      return 'triage';
    default:
      return 'triage';
  }
}

/**
 * Sincroniza a lista de contatos do WhatsApp para a base global de leads do CRM.
 */
export function syncWhatsAppContactsToCrm(contacts: ChatContact[]): void {
  if (!Array.isArray(contacts) || contacts.length === 0) return;

  const store = getStoredRealLeadsData();
  let modified = false;

  for (const contact of contacts) {
    const cleanPhone = (contact.phone || '').replace(/\D/g, '');
    const leadId = `lead_wa_${contact.id}`;

    // Procura lead existente por ID ou telefone
    const existingLeadIndex = store.leads.findIndex(
      (l) => l.id === leadId || (cleanPhone && (l.phone || l.whatsapp || '').replace(/\D/g, '') === cleanPhone)
    );

    const pipelineStage = mapContactStageToPipeline(contact.status || 'triage');
    const estimatedVal = 7500;

    if (existingLeadIndex >= 0) {
      // Atualiza lead existente se houver mudanças
      const existing = store.leads[existingLeadIndex];
      const needsUpdate =
        existing.status !== pipelineStage ||
        existing.name !== contact.name ||
        existing.company !== contact.company;

      if (needsUpdate) {
        store.leads[existingLeadIndex] = {
          ...existing,
          name: contact.name || existing.name,
          company: contact.company || existing.company,
          status: pipelineStage,
          notes: contact.projectType || existing.notes,
          updated_at: new Date().toISOString(),
        };

        // Atualiza Deal correspondente
        const deal = store.deals.find((d) => d.lead_id === existing.id || d.id === existing.id);
        if (deal) {
          deal.pipeline_stage = pipelineStage;
          deal.updated_at = new Date().toISOString();
        }
        modified = true;
      }
    } else {
      // Cria novo Lead a partir do contato do WhatsApp
      const newLead: Lead = {
        id: leadId,
        name: contact.name || 'Contato WhatsApp',
        company: contact.company || 'Empresa em Prospecção',
        whatsapp: contact.phone || '',
        phone: contact.phone || '',
        email: `${contact.name.toLowerCase().replace(/\s+/g, '.') || 'contato'}@cliente.com`,
        status: pipelineStage,
        recommended_solution: contact.projectType || 'Solução Inteligente TCAI',
        solution_reason: 'Lead originado e qualificado via WhatsApp',
        score: contact.score || 80,
        score_category: (contact.score || 80) >= 80 ? 'ALTA PRIORIDADE' : 'POTENCIAL',
        consent_lgpd: true,
        origin: 'WhatsApp',
        source: 'WhatsApp',
        utm_source: 'whatsapp',
        utm_medium: 'direct',
        utm_campaign: null,
        utm_term: null,
        utm_content: null,
        device: 'mobile',
        notes: contact.projectType || 'Contato originado na Central de WhatsApp',
        project_type: contact.projectType || 'Software Sob Medida',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const newDeal: Deal = {
        id: `deal_${leadId}`,
        lead_id: leadId,
        title: `${contact.company || contact.name} — Solução TCAI`,
        pipeline_stage: pipelineStage,
        estimated_value: estimatedVal,
        proposed_value: estimatedVal,
        final_value: null,
        probability: contact.score || 70,
        expected_close_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        proposal_date: new Date().toISOString().split('T')[0],
        closed_at: null,
        next_action: 'Apresentação Comercial',
        next_action_at: new Date(Date.now() + 2 * 86400000).toISOString(),
        lost_reason: null,
        lost_observation: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      store.leads.unshift(newLead);
      store.deals.unshift(newDeal);
      modified = true;

      // Cria evento inicial na timeline do contato
      addTimelineEvent(contact.id, {
        type: 'lead_created',
        title: 'Lead Sincronizado no CRM',
        description: `Contato ${contact.name} (${contact.company}) integrado ao funil comercial da TCAI.`,
        author: 'Sistema Unificado',
      });
    }
  }

  if (modified) {
    saveStoredRealLeadsData(store);
  }
}
