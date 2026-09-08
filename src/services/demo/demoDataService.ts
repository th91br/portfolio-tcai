import { supabase, Lead, Deal, FollowUp, LeadEvent, PipelineStage } from '../../lib/supabase';
import {
  DEMO_ORIGIN_TAG,
  LOCAL_STORAGE_DEMO_KEY,
  LocalDemoCache,
  getLocalDemoState,
  setLocalDemoState,
  removeLeadFromLocalDemo,
} from './demoStorage';

export {
  DEMO_ORIGIN_TAG,
  LOCAL_STORAGE_DEMO_KEY,
  getLocalDemoState,
  setLocalDemoState,
  removeLeadFromLocalDemo,
};
export type { LocalDemoCache };

export interface DemoScenarioResult {
  success: boolean;
  leadsCreated: number;
  dealsCreated: number;
  followUpsCreated: number;
  eventsCreated: number;
  error?: string;
}

/**
 * Retorna se o conjunto de leads atual possui registros demonstrativos
 */
export function hasDemoData(leads: Lead[]): boolean {
  if (leads.some((l) => l.origin === DEMO_ORIGIN_TAG)) return true;
  const localCache = getLocalDemoState();
  return Boolean(localCache && localCache.leads.length > 0);
}

/**
 * Retorna a contagem de leads de demonstração
 */
export function countDemoData(leads: Lead[]): number {
  const fromLeads = leads.filter((l) => l.origin === DEMO_ORIGIN_TAG).length;
  if (fromLeads > 0) return fromLeads;
  const localCache = getLocalDemoState();
  return localCache ? localCache.leads.length : 0;
}

/**
 * GERAÇÃO COMPLETA DO CENÁRIO DEMONSTRATIVO PARA VÍDEO
 */
export async function generateDemoScenario(): Promise<DemoScenarioResult> {
  try {
    // 1. Limpa dados demo prévios
    await clearDemoScenario();

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const daysAgo = (days: number) => {
      const d = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return d.toISOString();
    };
    const daysAhead = (days: number, hour: string = '14:00') => {
      const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      return `${d.toISOString().split('T')[0]}T${hour}:00.000Z`;
    };
    const todayAt = (hour: string) => `${todayStr}T${hour}:00.000Z`;

    // 2. Definição dos 11 Leads Fakes em Todas as 8 Etapas
    const demoLeadsDef = [
      // ETAPA 1: NOVO
      {
        id: 'demo_lead_1',
        name: 'Dr. Rafael Silveira',
        company: 'Clínica OdontoPrime',
        whatsapp: '(11) 98765-4321',
        email: 'rafael@odontoprime.com.br',
        status: 'NOVO' as PipelineStage,
        recommended_solution: 'Inteligência Artificial & Automação',
        solution_reason: 'Automatização do atendimento a pacientes com IA humanizada 24/7.',
        score: 88,
        score_category: 'ALTA PRIORIDADE' as const,
        dealTitle: 'OdontoPrime — Agente Virtual IA & Agendamentos',
        estimated_value: 9500,
        proposed_value: null,
        final_value: null,
        probability: 10,
        created_at: daysAgo(1),
        followUp: {
          action: 'Chamar no WhatsApp para apresentar diagnóstico',
          scheduled_at: daysAhead(3, '10:00'),
          notes: 'Paciente quer saber se a IA integra com o prontuário SimplesDental.',
        },
      },
      {
        id: 'demo_lead_2',
        name: 'Mariana Vasconcelos',
        company: 'Bella Donna Cosméticos',
        whatsapp: '(85) 98712-3456',
        email: 'mariana@belladonnacosmeticos.com.br',
        status: 'NOVO' as PipelineStage,
        recommended_solution: 'Desenvolvimento Web & Performance',
        solution_reason: 'E-commerce lento e com perda de conversão mobile.',
        score: 74,
        score_category: 'POTENCIAL' as const,
        dealTitle: 'Bella Donna — E-commerce Headless Alta Performance',
        estimated_value: 6200,
        proposed_value: null,
        final_value: null,
        probability: 10,
        created_at: daysAgo(2),
        followUp: null,
      },

      // ETAPA 2: QUALIFICADO
      {
        id: 'demo_lead_3',
        name: 'Camila Mendes',
        company: 'TechFlow Soluções Cloud',
        whatsapp: '(19) 99123-4567',
        email: 'camila@techflow.io',
        status: 'QUALIFICADO' as PipelineStage,
        recommended_solution: 'Arquitetura Cloud & DevOps',
        solution_reason: 'Modernização de infraestrutura com microsserviços escaláveis.',
        score: 94,
        score_category: 'ALTA PRIORIDADE' as const,
        dealTitle: 'TechFlow — Infraestrutura Serverless & Microsserviços',
        estimated_value: 16000,
        proposed_value: null,
        final_value: null,
        probability: 20,
        created_at: daysAgo(3),
        followUp: {
          action: 'Apresentar protótipo navegável da esteira de automação',
          scheduled_at: daysAhead(2, '14:00'),
          notes: 'Camila solicitou benchmark de redução de custos AWS.',
        },
      },

      // ETAPA 3: CONTATADO
      {
        id: 'demo_lead_4',
        name: 'Dr. Marcelo Santos',
        company: 'Santos & Prado Advocacia',
        whatsapp: '(21) 98456-7890',
        email: 'marcelo@santosprado.adv.br',
        status: 'CONTATADO' as PipelineStage,
        recommended_solution: 'Inteligência Artificial & Automação',
        solution_reason: 'Triagem e geração assistida de minutas de peças processuais com IA.',
        score: 82,
        score_category: 'ALTA PRIORIDADE' as const,
        dealTitle: 'Santos & Prado — Triagem Jurídica com LLMs',
        estimated_value: 8500,
        proposed_value: null,
        final_value: null,
        probability: 30,
        created_at: daysAgo(5),
        next_action: 'Alinhar escopo via WhatsApp',
        followUp: {
          action: 'Solicitar retorno do alinhamento preliminar',
          scheduled_at: daysAgo(1), // ATRASADO!
          notes: 'Mandei áudio com detalhes técnicos, aguardando parecer do sócio.',
        },
      },

      // ETAPA 4: REUNIÃO
      {
        id: 'demo_lead_5',
        name: 'Bruno Alcantara',
        company: 'Nexus Logística Brasil',
        whatsapp: '(41) 99678-1234',
        email: 'bruno@nexuslog.com.br',
        status: 'REUNIÃO' as PipelineStage,
        recommended_solution: 'Consultoria Estratégica & CRM',
        solution_reason: 'Integração de TMS próprio com CRM comercial unificado.',
        score: 95,
        score_category: 'ALTA PRIORIDADE' as const,
        dealTitle: 'Nexus Logística — Painel Executivo & Integração TMS',
        estimated_value: 28000,
        proposed_value: null,
        final_value: null,
        probability: 50,
        created_at: daysAgo(7),
        next_action: 'Reunião de alinhamento com diretoria técnica',
        followUp: {
          action: 'Reunião de alinhamento com diretoria técnica',
          scheduled_at: todayAt('16:30'), // HOJE!
          notes: 'Apresentar arquitetura de dados e estimativa de entrega em 4 sprints.',
        },
      },

      // ETAPA 5: PROPOSTA
      {
        id: 'demo_lead_6',
        name: 'Eng. Juliana Costa',
        company: 'Vanguard Engenharia',
        whatsapp: '(31) 98890-5432',
        email: 'juliana@vanguardeng.com.br',
        status: 'PROPOSTA' as PipelineStage,
        recommended_solution: 'Desenvolvimento Web & Performance',
        solution_reason: 'Portal do cliente para acompanhamento em tempo real de obras.',
        score: 91,
        score_category: 'ALTA PRIORIDADE' as const,
        dealTitle: 'Vanguard Eng — Portal de Obras & Plataforma de Clientes',
        estimated_value: 19500,
        proposed_value: 19500,
        final_value: null,
        probability: 65,
        created_at: daysAgo(9),
        proposal_date: daysAgo(2),
        expected_close_date: daysAhead(7),
        next_action: 'Enviar proposta comercial revisada',
        followUp: {
          action: 'Enviar proposta comercial revisada com escopo técnico',
          scheduled_at: todayAt('18:00'), // HOJE!
          notes: 'Incluir cláusula de garantia de performance de 90 dias.',
        },
      },
      {
        id: 'demo_lead_7',
        name: 'Rodrigo Nogueira',
        company: 'Alfa Saúde Corporativa',
        whatsapp: '(61) 99543-2109',
        email: 'rodrigo@alfasaude.com.br',
        status: 'PROPOSTA' as PipelineStage,
        recommended_solution: 'Design System & UX/UI',
        solution_reason: 'Redesign e padronização da experiência do paciente no aplicativo.',
        score: 78,
        score_category: 'POTENCIAL' as const,
        dealTitle: 'Alfa Saúde — Redesign Completo do App de Telemedicina',
        estimated_value: 12000,
        proposed_value: 12000,
        final_value: null,
        probability: 65,
        created_at: daysAgo(6),
        proposal_date: daysAgo(1),
        expected_close_date: daysAhead(10),
        followUp: null,
      },

      // ETAPA 6: NEGOCIAÇÃO
      {
        id: 'demo_lead_8',
        name: 'Fernando Ribeiro',
        company: 'Grupo Imobiliário Habitat',
        whatsapp: '(51) 99234-5678',
        email: 'fernando@habitatimoveis.com.br',
        status: 'NEGOCIAÇÃO' as PipelineStage,
        recommended_solution: 'Inteligência Artificial & Automação',
        solution_reason: 'Hub imobiliário com qualificação automática e distribuição de leads.',
        score: 96,
        score_category: 'ALTA PRIORIDADE' as const,
        dealTitle: 'Grupo Habitat — Hub Imobiliário IA & Qualificação Automática',
        estimated_value: 32000,
        proposed_value: 32000,
        final_value: null,
        probability: 80,
        created_at: daysAgo(12),
        proposal_date: daysAgo(5),
        expected_close_date: daysAhead(3),
        next_action: 'Ajustar minuta contratual e formas de pagamento',
        followUp: {
          action: 'Ajustar minuta contratual e formas de pagamento',
          scheduled_at: todayAt('19:15'), // HOJE!
          notes: 'Diretor aprovou o valor, só falta fechar parcelamento em 3x.',
        },
      },

      // ETAPA 7: FECHADO
      {
        id: 'demo_lead_9',
        name: 'Carlos Eduardo Rocha',
        company: 'Apex Indústria Metalúrgica',
        whatsapp: '(11) 97123-9876',
        email: 'carlos@apexmetal.ind.br',
        status: 'FECHADO' as PipelineStage,
        recommended_solution: 'Inteligência Artificial & Automação',
        solution_reason: 'Sistema preditivo de telemetria e manutenção de equipamentos.',
        score: 98,
        score_category: 'ALTA PRIORIDADE' as const,
        dealTitle: 'Apex Indústria — Sistema Preditivo de Manutenção com IA',
        estimated_value: 24500,
        proposed_value: 24500,
        final_value: 24500,
        probability: 100,
        created_at: daysAgo(18),
        closed_at: daysAgo(3),
        followUp: {
          action: 'Kickoff do projeto com equipe de engenharia',
          scheduled_at: daysAhead(4, '11:00'), // PRÓXIMOS!
          notes: 'Apresentar cronograma e receber credenciais de acesso às máquinas.',
        },
      },
      {
        id: 'demo_lead_10',
        name: 'Beatriz Fontana',
        company: 'Fontana Joias & Acessórios',
        whatsapp: '(47) 98812-3456',
        email: 'beatriz@fontanajoias.com.br',
        status: 'FECHADO' as PipelineStage,
        recommended_solution: 'Desenvolvimento Web & Performance',
        solution_reason: 'Loja virtual exclusiva de alto padrão com modelagem 3D dos anéis.',
        score: 92,
        score_category: 'ALTA PRIORIDADE' as const,
        dealTitle: 'Fontana Joias — Rebranding & E-commerce 3D Exclusivo',
        estimated_value: 14800,
        proposed_value: 14800,
        final_value: 14800,
        probability: 100,
        created_at: daysAgo(25),
        closed_at: daysAgo(10),
        followUp: null,
      },

      // ETAPA 8: PERDIDO
      {
        id: 'demo_lead_11',
        name: 'Gustavo Meirelles',
        company: 'StartUp NeoVenture',
        whatsapp: '(11) 96543-2198',
        email: 'gustavo@neoventure.com.br',
        status: 'PERDIDO' as PipelineStage,
        recommended_solution: 'Consultoria Estratégica & CRM',
        solution_reason: 'MVP de plataforma fintech para antecipação de recebíveis.',
        score: 45,
        score_category: 'INICIAL' as const,
        dealTitle: 'NeoVenture — MVP de Plataforma Fintech',
        estimated_value: 15000,
        proposed_value: 15000,
        final_value: null,
        probability: 0,
        created_at: daysAgo(15),
        lost_reason: 'Sem orçamento',
        lost_observation: 'Optaram por postergar o projeto para o próximo trimestre após rodada de captação.',
        followUp: {
          action: 'Verificar se mantêm interesse para próximo trimestre',
          scheduled_at: daysAgo(2), // ATRASADO!
          notes: 'Rodada de investimento Seed prevista para o mês que vem.',
        },
      },
    ];

    const preparedLeads: Lead[] = [];
    const preparedDeals: Deal[] = [];
    const preparedFollowUps: FollowUp[] = [];

    // Tenta inserção no Supabase e prepara cache local
    for (const leadDef of demoLeadsDef) {
      let leadId = leadDef.id;

      // Inserção no Supabase
      try {
        const { data: leadData, error: leadErr } = await supabase
          .from('leads')
          .insert({
            name: leadDef.name,
            company: leadDef.company,
            whatsapp: leadDef.whatsapp,
            email: leadDef.email,
            status: leadDef.status,
            recommended_solution: leadDef.recommended_solution,
            solution_reason: leadDef.solution_reason,
            score: leadDef.score,
            score_category: leadDef.score_category,
            consent_lgpd: true,
            origin: DEMO_ORIGIN_TAG,
            utm_source: 'google',
            utm_medium: 'cpc',
            utm_campaign: 'demonstracao_video',
            device: 'Desktop (1920px)',
            created_at: leadDef.created_at,
            updated_at: leadDef.closed_at || leadDef.created_at,
          })
          .select()
          .single();

        if (!leadErr && leadData) {
          leadId = leadData.id;

          // Inserir Score Detalhado
          await supabase.from('lead_scores').insert({
            lead_id: leadId,
            total_score: leadDef.score,
            fit_score: Math.round(leadDef.score * 0.25),
            intent_score: Math.round(leadDef.score * 0.25),
            urgency_score: Math.round(leadDef.score * 0.25),
            readiness_score: Math.round(leadDef.score * 0.25),
            score_category: leadDef.score_category,
            breakdown: {
              fit: Math.round(leadDef.score * 0.25),
              intent: Math.round(leadDef.score * 0.25),
              urgency: Math.round(leadDef.score * 0.25),
              readiness: Math.round(leadDef.score * 0.25),
              is_demo: true,
            },
          });

          // Inserir Deal
          const { data: dealData } = await supabase
            .from('deals')
            .insert({
              lead_id: leadId,
              title: leadDef.dealTitle,
              pipeline_stage: leadDef.status,
              estimated_value: leadDef.estimated_value,
              proposed_value: leadDef.proposed_value,
              final_value: leadDef.final_value,
              probability: leadDef.probability,
              proposal_date: leadDef.proposal_date || null,
              expected_close_date: leadDef.expected_close_date || null,
              closed_at: leadDef.closed_at || null,
              lost_reason: leadDef.lost_reason || null,
              lost_observation: leadDef.lost_observation || null,
              next_action: leadDef.next_action || null,
              created_at: leadDef.created_at,
              updated_at: leadDef.closed_at || leadDef.created_at,
            })
            .select()
            .single();

          // Inserir Follow-up
          if (leadDef.followUp) {
            await supabase.from('follow_ups').insert({
              lead_id: leadId,
              deal_id: dealData?.id || null,
              action: leadDef.followUp.action,
              scheduled_at: leadDef.followUp.scheduled_at,
              notes: leadDef.followUp.notes,
              status: 'PENDENTE',
              created_at: leadDef.created_at,
            });
          }
        }
      } catch (err) {
        console.warn('Supabase insert warning for demo lead:', err);
      }

      // Constrói objeto de Lead local
      const fullLead: Lead = {
        id: leadId,
        name: leadDef.name,
        company: leadDef.company,
        whatsapp: leadDef.whatsapp,
        email: leadDef.email,
        status: leadDef.status,
        recommended_solution: leadDef.recommended_solution,
        solution_reason: leadDef.solution_reason,
        score: leadDef.score,
        score_category: leadDef.score_category,
        consent_lgpd: true,
        origin: DEMO_ORIGIN_TAG,
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'demonstracao_video',
        utm_term: 'desenvolvedor software ia',
        utm_content: 'banner_video',
        device: 'Desktop (1920px)',
        created_at: leadDef.created_at,
        updated_at: leadDef.closed_at || leadDef.created_at,
      };
      preparedLeads.push(fullLead);

      // Constrói objeto de Deal local
      const dealId = `deal_${leadId}`;
      const fullDeal: Deal = {
        id: dealId,
        lead_id: leadId,
        title: leadDef.dealTitle,
        pipeline_stage: leadDef.status,
        estimated_value: leadDef.estimated_value,
        proposed_value: leadDef.proposed_value,
        final_value: leadDef.final_value,
        probability: leadDef.probability,
        proposal_date: leadDef.proposal_date || null,
        expected_close_date: leadDef.expected_close_date || null,
        closed_at: leadDef.closed_at || null,
        lost_reason: leadDef.lost_reason || null,
        lost_observation: leadDef.lost_observation || null,
        next_action: leadDef.next_action || null,
        next_action_at: null,
        created_at: leadDef.created_at,
        updated_at: leadDef.closed_at || leadDef.created_at,
        lead: fullLead,
      };
      preparedDeals.push(fullDeal);

      // Constrói objeto de Follow-up local
      if (leadDef.followUp) {
        const fullFollowUp: FollowUp = {
          id: `followup_${leadId}`,
          lead_id: leadId,
          deal_id: dealId,
          action: leadDef.followUp.action,
          scheduled_at: leadDef.followUp.scheduled_at,
          notes: leadDef.followUp.notes,
          status: 'PENDENTE',
          completed_at: null,
          completed_by: null,
          created_at: leadDef.created_at,
          lead: fullLead,
          deal: fullDeal,
        };
        preparedFollowUps.push(fullFollowUp);
      }
    }

    // 4. Inserir Eventos de Telemetria Fictícios
    const demoEvents: LeadEvent[] = [];
    const eventCounts = {
      diagnostic_view: 128,
      diagnostic_start: 74,
      diagnostic_step: 42,
      diagnostic_complete: 24,
      diagnostic_lead_created: 11,
      diagnostic_whatsapp_click: 8,
    };

    for (const [eventName, count] of Object.entries(eventCounts)) {
      for (let i = 0; i < count; i++) {
        demoEvents.push({
          id: `event_${eventName}_${i}`,
          session_id: `demo_session_${eventName}_${i}`,
          event_name: eventName as any,
          step_number: eventName === 'diagnostic_step' ? (i % 5) + 1 : null,
          metadata: {
            is_demo: true,
            source: 'video_demonstrativo',
            device: i % 3 === 0 ? 'Mobile (390px)' : 'Desktop (1920px)',
          },
          created_at: daysAgo(Math.floor(Math.random() * 20)),
        });
      }
    }

    // Tenta persistir eventos no Supabase
    try {
      await supabase.from('lead_events').insert(demoEvents);
    } catch {
      // continua com cache local
    }

    // 5. Salva estado completo no LocalStorage Cache para garantia total
    setLocalDemoState({
      leads: preparedLeads,
      deals: preparedDeals,
      followUps: preparedFollowUps,
      events: demoEvents,
    });

    return {
      success: true,
      leadsCreated: preparedLeads.length,
      dealsCreated: preparedDeals.length,
      followUpsCreated: preparedFollowUps.length,
      eventsCreated: demoEvents.length,
    };
  } catch (err: any) {
    console.error('Falha ao gerar dados demo:', err);
    return {
      success: false,
      leadsCreated: 0,
      dealsCreated: 0,
      followUpsCreated: 0,
      eventsCreated: 0,
      error: err.message || 'Erro inesperado ao gerar dados demo.',
    };
  }
}

/**
 * LIMPEZA COMPLETA DOS DADOS DEMO
 */
export async function clearDemoScenario(): Promise<{ success: boolean; deletedLeads: number }> {
  try {
    // 1. Limpa cache local
    setLocalDemoState(null);

    // 2. Tenta limpar Supabase
    try {
      const { data: demoLeads } = await supabase
        .from('leads')
        .select('id')
        .eq('origin', DEMO_ORIGIN_TAG);

      const ids = (demoLeads || []).map((l) => l.id);

      if (ids.length > 0) {
        await Promise.allSettled([
          supabase.from('deals').delete().in('lead_id', ids),
          supabase.from('follow_ups').delete().in('lead_id', ids),
          supabase.from('lead_notes').delete().in('lead_id', ids),
          supabase.from('lead_answers').delete().in('lead_id', ids),
          supabase.from('lead_scores').delete().in('lead_id', ids),
          supabase.from('lead_status_history').delete().in('lead_id', ids),
          supabase.from('ai_lead_insights').delete().in('lead_id', ids),
          supabase.from('notifications').delete().in('lead_id', ids),
        ]);
        await supabase.from('leads').delete().in('id', ids);
      }

      await supabase.from('leads').delete().eq('origin', DEMO_ORIGIN_TAG);
      await supabase.from('lead_events').delete().like('session_id', 'demo_%');
    } catch (err) {
      console.warn('Supabase remote cleanup warning:', err);
    }

    return { success: true, deletedLeads: 11 };
  } catch (err) {
    console.error('Falha ao limpar cenário demo:', err);
    return { success: false, deletedLeads: 0 };
  }
}
