import { CONTACT_CONFIG } from '../../utils/contactUtils';
import { LeadScoreCategory } from '../../lib/supabase';

export interface DiagnosticAnswersRecord {
  necessidade?: string;
  necessidadeLabel?: string;
  problema?: string;
  problemaLabel?: string;
  estagio?: string;
  estagioLabel?: string;
  objetivo?: string;
  objetivoLabel?: string;
  prazo?: string;
  prazoLabel?: string;
  investimento?: string;
  investimentoLabel?: string;
  decisao?: string;
  decisaoLabel?: string;
  [key: string]: string | undefined;
}

export interface RecommendationResult {
  solutionKey: 'site' | 'software' | 'saas' | 'automacao';
  solutionTitle: string;
  badge: string;
  slaTime: string;
  reason: string;
  priorities: string[];
  nextStep: string;
}

export interface ScoreBreakdownResult {
  totalScore: number;
  fitScore: number;
  intentScore: number;
  urgencyScore: number;
  readinessScore: number;
  category: LeadScoreCategory;
  breakdown: {
    fit: { points: number; max: 25; justification: string };
    intent: { points: number; max: 25; justification: string };
    urgency: { points: number; max: 25; justification: string };
    readiness: { points: number; max: 25; justification: string };
  };
}

// =====================================================================
// CÁLCULO DETERMINÍSTICO DO LEAD SCORE (0 A 100)
// =====================================================================

export function calculateLeadScore(answers: DiagnosticAnswersRecord): ScoreBreakdownResult {
  // 1. DIMENSÃO FIT (0 a 25 pontos) — Perfil e poder decisório
  let fitScore = 12;
  let fitJustification = 'Decisor em mapeamento';

  switch (answers.decisao) {
    case 'proprietario_socio':
      fitScore = 25;
      fitJustification = 'Proprietário/Sócio com autonomia total';
      break;
    case 'responsavel_decisao':
      fitScore = 22;
      fitJustification = 'Responsável direto pela contratação técnica';
      break;
    case 'equipe_responsavel':
      fitScore = 15;
      fitJustification = 'Membro da equipe com influência interna';
      break;
    case 'pesquisando_apresentar':
      fitScore = 12;
      fitJustification = 'Levantamento para apresentação à diretoria';
      break;
    case 'projeto_pessoal':
      fitScore = 8;
      fitJustification = 'Projeto pessoal em validação inicial';
      break;
  }

  // 2. DIMENSÃO INTENÇÃO (0 a 25 pontos) — Alinhamento de objetivo
  let intentScore = 14;
  let intentJustification = 'Objetivo geral';

  switch (answers.objetivo) {
    case 'gerar_oportunidades':
      intentScore = 25;
      intentJustification = 'Foco agressivo em novas vendas e ROI direto';
      break;
    case 'escalar_negocio':
      intentScore = 25;
      intentJustification = 'Foco em escala operacional e crescimento sustentável';
      break;
    case 'criar_receita':
      intentScore = 22;
      intentJustification = 'Lançamento de novo fluxo de receita';
      break;
    case 'automatizar_operacao':
      intentScore = 22;
      intentJustification = 'Eficiência extrema através de automação';
      break;
    case 'economizar_tempo':
      intentScore = 18;
      intentJustification = 'Redução de custos operacionais e retrabalho';
      break;
    case 'organizar_processos':
      intentScore = 16;
      intentJustification = 'Centralização e governança de dados';
      break;
    case 'melhorar_posicionamento':
      intentScore = 16;
      intentJustification = 'Consolidação de autoridade de marca';
      break;
  }

  // 3. DIMENSÃO URGÊNCIA (0 a 25 pontos) — Janela de execução
  let urgencyScore = 10;
  let urgencyJustification = 'Prazo em definição';

  switch (answers.prazo) {
    case 'quanto_antes':
      urgencyScore = 25;
      urgencyJustification = 'Prontidão imediata para iniciar';
      break;
    case 'proximos_30_dias':
      urgencyScore = 20;
      urgencyJustification = 'Janela de curto prazo (próximos 30 dias)';
      break;
    case 'entre_30_60_dias':
      urgencyScore = 15;
      urgencyJustification = 'Janela de médio prazo (30 a 60 dias)';
      break;
    case 'proximos_meses':
      urgencyScore = 10;
      urgencyJustification = 'Planejamento para os próximos meses';
      break;
    case 'apenas_pesquisando':
      urgencyScore = 5;
      urgencyJustification = 'Fase preliminar de pesquisa e benchmarks';
      break;
  }

  // 4. DIMENSÃO PRONTIDÃO (0 a 25 pontos) — Maturidade + Viabilidade
  let stagePoints = 8;
  switch (answers.estagio) {
    case 'preciso_escalar':
      stagePoints = 14;
      break;
    case 'precisa_melhorar':
      stagePoints = 12;
      break;
    case 'planejado':
      stagePoints = 10;
      break;
    case 'problema_sem_solucao':
      stagePoints = 8;
      break;
    case 'apenas_ideia':
      stagePoints = 6;
      break;
  }

  let investPoints = 5;
  switch (answers.investimento) {
    case 'invest_acima_15k':
      investPoints = 11;
      break;
    case 'invest_7k_15k':
      investPoints = 9;
      break;
    case 'invest_3k_7k':
      investPoints = 7;
      break;
    case 'invest_ate_3k':
      investPoints = 5;
      break;
    case 'invest_entender':
      investPoints = 5;
      break;
  }

  const readinessScore = Math.min(25, stagePoints + investPoints);
  const readinessJustification = `Maturidade (${stagePoints} pts) + Faixa orçamentária (${investPoints} pts)`;

  const totalScore = Math.min(100, Math.max(0, fitScore + intentScore + urgencyScore + readinessScore));

  let category: LeadScoreCategory = 'INICIAL';
  if (totalScore >= 70) {
    category = 'ALTA PRIORIDADE';
  } else if (totalScore >= 40) {
    category = 'POTENCIAL';
  } else {
    category = 'INICIAL';
  }

  return {
    totalScore,
    fitScore,
    intentScore,
    urgencyScore,
    readinessScore,
    category,
    breakdown: {
      fit: { points: fitScore, max: 25, justification: fitJustification },
      intent: { points: intentScore, max: 25, justification: intentJustification },
      urgency: { points: urgencyScore, max: 25, justification: urgencyJustification },
      readiness: { points: readinessScore, max: 25, justification: readinessJustification },
    },
  };
}

// =====================================================================
// MOTOR DE RECOMENDAÇÃO DETERMINÍSTICO
// =====================================================================

export function determineRecommendation(answers: DiagnosticAnswersRecord): RecommendationResult {
  const necessidade = answers.necessidade || '';
  const problema = answers.problema || '';
  const objetivo = answers.objetivo || '';

  // 1. Regra para AUTOMAÇÃO / AGENTE DE IA
  if (
    necessidade === 'automacao_ia' ||
    problema.includes('automacao') ||
    problema === 'atendimento_repetitivo' ||
    problema === 'qualificacao_leads' ||
    problema === 'processos_manuais_tempo' ||
    objetivo === 'automatizar_operacao'
  ) {
    return {
      solutionKey: 'automacao',
      solutionTitle: 'AUTOMAÇÃO & AGENTE DE IA',
      badge: 'INTELIGÊNCIA OPERACIONAL 24/7',
      slaTime: '7 DIAS ÚTEIS',
      reason:
        'Sua maior oportunidade está em eliminar tarefas repetitivas, atendimento manual e gargalos de qualificação com agentes inteligentes e fluxos automatizados integrados aos seus canais.',
      priorities: [
        'Triagem autônoma de contatos 24/7 no WhatsApp',
        'Integração direta com ferramentas operacionais e CRM',
        'Economia imediata de horas operacionais da equipe',
      ],
      nextStep: 'Desenhar o fluxo operacional e configurar o agente de IA com as regras do seu negócio.',
    };
  }

  // 2. Regra para SOFTWARE / SISTEMA
  if (
    necessidade === 'software_sistema' ||
    problema.includes('software') ||
    problema === 'sistema_interno_crm' ||
    problema === 'portal_clientes' ||
    problema === 'painel_administrativo' ||
    objetivo === 'organizar_processos'
  ) {
    return {
      solutionKey: 'software',
      solutionTitle: 'SOFTWARE & SISTEMA SOB MEDIDA',
      badge: 'CÓDIGO 100% PROPRIETÁRIO',
      slaTime: '10 DIAS ÚTEIS',
      reason:
        'Seu cenário exige uma aplicação estruturada com regras de negócio exclusivas, painéis administrativos dedicados e banco de dados seguro, sem depender de plataformas engessadas.',
      priorities: [
        'Arquitetura escalável sob medida em React e PostgreSQL',
        'Centralização de dados com autenticação e níveis de acesso',
        'Eliminação de planilhas frágeis e retrabalho operacional',
      ],
      nextStep: 'Definir os requisitos de arquitetura e aprovar o protótipo funcional para início da engenharia.',
    };
  }

  // 3. Regra para SAAS / MICRO-SAAS
  if (
    necessidade === 'saas_ideia' ||
    problema.includes('saas') ||
    problema === 'assinatura_recorrente' ||
    problema === 'dor_especifica_b2b' ||
    objetivo === 'criar_receita'
  ) {
    return {
      solutionKey: 'saas',
      solutionTitle: 'PLATAFORMA SAAS / MICRO-SAAS',
      badge: 'RECEITA RECORRENTE ESCALÁVEL',
      slaTime: '10 DIAS ÚTEIS',
      reason:
        'Você possui uma visão de produto digital escalável que necessita de um MVP funcional, sistema de cobrança recorrente e autenticação profissional entregue com velocidade no mercado.',
      priorities: [
        'MVP rápido para validação de produto e retenção de usuários',
        'Integração de checkout de assinaturas (Stripe / Asaas)',
        'Painel multi-tenant com segurança e inteligência nativa',
      ],
      nextStep: 'Mapear a jornada essencial do usuário e iniciar o desenvolvimento do MVP de alta conversão.',
    };
  }

  // 4. Padrão: SITE / LANDING PAGE
  return {
    solutionKey: 'site',
    solutionTitle: 'SITE DE ALTA CONVERSÃO & POSICIONAMENTO',
    badge: 'ENTREGA RECORDE COM AUTORIDADE MÁXIMA',
    slaTime: '3 DIAS ÚTEIS',
    reason:
      'A prioridade imediata para o seu momento é construir autoridade incontestável, carregar em milissegundos e transformar visitantes em clientes pagantes com copywriting estratégico e design executivo.',
    priorities: [
      'Design premium que destaca seu negócio da concorrência',
      'Estrutura ultra-otimizada para conversão de leads e WhatsApp',
      'Performance 100/100 sem templates lentos de WordPress',
    ],
    nextStep: 'Alinhar as diretrizes de conteúdo e colocar a versão definitiva no ar em 3 dias úteis.',
  };
}

// =====================================================================
// GERADOR DE MENSAGEM DO WHATSAPP CONTEXTUALIZADA
// =====================================================================

export function generateDiagnosticWhatsAppUrl(params: {
  leadName: string;
  answers: DiagnosticAnswersRecord;
  recommendation: RecommendationResult;
}): string {
  const { leadName, answers, recommendation } = params;

  const lines = [
    `*Olá Thiago! Concluí o Diagnóstico no seu site.* 🎯`,
    ``,
    `*👤 Nome:* ${leadName || 'Não informado'}`,
    answers.empresa ? `*🏢 Empresa:* ${answers.empresa}` : null,
    `*📌 Necessidade:* ${answers.necessidadeLabel || answers.necessidade || 'Não informada'}`,
    `*⚠️ Problema / Foco:* ${answers.problemaLabel || answers.problema || 'Não informado'}`,
    `*📊 Estágio Atual:* ${answers.estagioLabel || answers.estagio || 'Não informado'}`,
    `*🎯 Principal Objetivo:* ${answers.objetivoLabel || answers.objetivo || 'Não informado'}`,
    `*⏱️ Prazo Desejado:* ${answers.prazoLabel || answers.prazo || 'Não informado'}`,
    `*💰 Faixa de Investimento:* ${answers.investimentoLabel || answers.investimento || 'A definir'}`,
    ``,
    `*🚀 Solução Recomendada pelo Diagnóstico:*`,
    `*${recommendation.solutionTitle}* (${recommendation.slaTime})`,
    ``,
    `Gostaria de conversar com você sobre esse projeto e entender os próximos passos!`,
  ].filter((l): l is string => l !== null);

  const fullText = lines.join('\n');
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(fullText)}`;
}

/**
 * Mensagem gerada no Dashboard para Thiago responder ao Lead
 */
export function generateDashboardWhatsAppContactUrl(params: {
  leadName: string;
  leadWhatsapp: string;
  recommendedSolution: string;
  primaryGoal?: string;
  problem?: string;
}): string {
  const { leadName, leadWhatsapp, recommendedSolution, primaryGoal, problem } = params;

  // Limpa caracteres não numéricos do telefone
  const cleanPhone = leadWhatsapp.replace(/\D/g, '');
  const phoneFormatted = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const firstName = leadName.trim().split(' ')[0] || 'Tudo bem';

  const lines = [
    `Olá, ${firstName}! Tudo bem? 👋`,
    ``,
    `Aqui é o *Thiago Cassol Antunes*.`,
    `Recebi seu diagnóstico no meu portfólio para o seu projeto de *${recommendedSolution}*.`,
    ``,
    problem ? `Vi que seu foco principal é resolver *${problem.toLowerCase()}*${primaryGoal ? ` para *${primaryGoal.toLowerCase()}*` : ''}.` : `Analisei suas respostas com atenção.`,
    ``,
    `Podemos conversar alguns minutos para eu te apresentar o melhor caminho tecnológico para tirarmos isso do papel com agilidade?`,
  ];

  return `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(lines.join('\n'))}`;
}
