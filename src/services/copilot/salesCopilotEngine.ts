import { Lead, LeadAnswer, LeadScoreDetail, LeadNote, Deal, LeadStatusHistory } from '../../lib/supabase';
import {
  CopilotAnalysisOutput,
  ExecutiveSummary,
  OpportunityAnalysis,
  ApproachStrategy,
  RecommendedQuestion,
  PossibleObjection,
  MeetingPrepBriefing,
  ProposalStrategy,
  LossAnalysis,
} from './copilotTypes';

/**
 * Versão do Prompt Interno do Copiloto
 */
export const SALES_COPILOT_PROMPT_VERSION = 'sales_copilot_v1';

/**
 * Gera um hash determinístico a partir dos dados do lead para detecção de cache.
 * Se o lead não sofreu alterações nas respostas, status, notas ou valores, o insight anterior é reutilizado.
 */
export function generateSnapshotHash(params: {
  lead: Lead;
  answers: LeadAnswer[];
  deal?: Deal | null;
  notes?: LeadNote[];
}): string {
  const { lead, answers, deal, notes } = params;
  const sortedAnswers = [...answers]
    .sort((a, b) => a.step_number - b.step_number)
    .map((a) => `${a.question_id}:${a.answer_value}`)
    .join('|');

  const notesHash = (notes || []).map((n) => `${n.id}:${n.content.length}`).join(',');
  const dealHash = deal
    ? `${deal.pipeline_stage}:${deal.proposed_value}:${deal.estimated_value}:${deal.final_value}:${deal.probability}:${deal.lost_reason || ''}`
    : 'nodeal';

  const rawString = `${lead.id}|${lead.status}|${lead.score}|${dealHash}|${sortedAnswers}|${notesHash}`;

  // Simple, fast deterministic string hash (base36)
  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    const char = rawString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `snap_${Math.abs(hash).toString(36)}_${rawString.length}`;
}

/**
 * Motor de Inteligência Comercial do TCA Sales Copilot
 * Constrói análises densas, contextualizadas e sem respostas genéricas.
 */
export function synthesizeSalesCopilotInsight(params: {
  lead: Lead;
  answers: LeadAnswer[];
  deal?: Deal | null;
  score?: LeadScoreDetail | null;
  notes?: LeadNote[];
  history?: LeadStatusHistory[];
}): CopilotAnalysisOutput {
  const { lead, answers, deal, score, notes } = params;

  // Extrai respostas chave com fallbacks seguros
  const answerMap = new Map<string, { value: string; label: string; question: string }>();
  answers.forEach((a) => {
    answerMap.set(a.question_id, {
      value: a.answer_value,
      label: a.answer_label,
      question: a.question_title,
    });
  });

  const getAns = (id: string) => answerMap.get(id)?.label || 'Informação não disponível.';
  const getRaw = (id: string) => answerMap.get(id)?.value || '';

  const necessidade = getAns('necessidade');
  const problema =
    answerMap.get('problema_site')?.label ||
    answerMap.get('problema_software')?.label ||
    answerMap.get('problema_saas')?.label ||
    answerMap.get('problema_automacao')?.label ||
    getAns('problema') ||
    'Não especificado no diagnóstico';

  const estagio = getAns('estagio');
  const objetivo = getAns('objetivo');
  const prazo = getAns('prazo');
  const investimento = getAns('investimento');
  const decisao = getAns('decisao');

  const firstName = lead.name.trim().split(' ')[0] || 'Cliente';
  const companyOrName = lead.company ? `${lead.name} (${lead.company})` : lead.name;
  const currentStage = deal?.pipeline_stage || lead.status;
  const solucao = lead.recommended_solution || 'Solução Tecnológica TCA';

  // =========================================================================
  // 1. RESUMO EXECUTIVO
  // =========================================================================
  const summary: ExecutiveSummary = {
    whoIs: `${companyOrName}, prospectado via ${lead.origin || 'Portfólio TCA'} com Lead Score de ${lead.score} pts (${lead.score_category}).`,
    whatIsLookingFor: necessidade !== 'Informação não disponível.' ? necessidade : `Projeto voltado a ${solucao}.`,
    mainProblem: problema,
    primaryGoal: objetivo,
    currentMoment: estagio,
    urgencyLevel: prazo.toLowerCase().includes('30 dias') || prazo.toLowerCase().includes('imediato')
      ? `Alta urgência — prazo declarado de ${prazo.toLowerCase()}.`
      : `Janela planejada — ${prazo.toLowerCase()}.`,
    decisionCapacity: decisao.toLowerCase().includes('responsável')
      ? 'Decisor direto do projeto técnico e orçamentário.'
      : `Participação decisória: ${decisao}.`,
    recommendedSolution: `${solucao} (Score: ${lead.score}/100)`,
    commercialStatus: `Estágio atual: ${currentStage}${deal?.proposed_value ? ` | Proposta de R$ ${deal.proposed_value.toLocaleString('pt-BR')}` : ''}${deal?.estimated_value ? ` | Estimado R$ ${deal.estimated_value.toLocaleString('pt-BR')}` : ''}.`,
  };

  // =========================================================================
  // 2. OPORTUNIDADE IDENTIFICADA
  // =========================================================================
  let opportunityArea = '';
  let howTcaHelps = '';
  let expectedBusinessBenefit = '';

  if (solucao.toLowerCase().includes('saas')) {
    opportunityArea = 'Transformação de visão de produto digital em MVP funcional com tração rápida e cobrança recorrente.';
    howTcaHelps = 'Desenvolvimento full-stack sob medida em React e PostgreSQL com autenticação multi-tenant e gateway de pagamento integrado em até 10 dias úteis.';
    expectedBusinessBenefit = 'Validação imediata de hipótese de mercado sem desperdício de capital em equipes infladas ou tecnologias engessadas.';
  } else if (solucao.toLowerCase().includes('automação') || solucao.toLowerCase().includes('ia')) {
    opportunityArea = 'Eliminação de gargalos em triagem manual, atendimento repetitivo e sincronização de dados entre canais.';
    howTcaHelps = 'Construção de agentes autônomos de IA e fluxos operacionais conectados via webhooks e APIs diretas ao WhatsApp/CRM do cliente.';
    expectedBusinessBenefit = 'Aumento na velocidade de qualificação de leads, redução de retrabalho manual da equipe e atendimento 24/7.';
  } else if (solucao.toLowerCase().includes('software') || solucao.toLowerCase().includes('sistema')) {
    opportunityArea = 'Centralização de processos internos que hoje dependem de planilhas dispersas ou sistemas legados rígidos.';
    howTcaHelps = 'Engenharia de software proprietária com banco de dados relacional, controle rigoroso de permissões e interfaces responsivas ultra-rápidas.';
    expectedBusinessBenefit = 'Segurança de dados corporativos, visibilidade gerencial em tempo real e eficiência operacional multiplicada.';
  } else {
    opportunityArea = 'Reposicionamento digital e aceleração da taxa de conversão de visitantes para contatos diretos no WhatsApp.';
    howTcaHelps = 'Arquitetura web premium com performance 100/100, copywriting focado em autoridade técnica e zero dependência de templates lentos.';
    expectedBusinessBenefit = 'Diferenciação imediata frente à concorrência e aumento na geração orgânica de reuniões comerciais.';
  }

  const opportunity: OpportunityAnalysis = {
    relevantProblem: `O lead indicou como maior dor: "${problema}". Isso impacta diretamente o alcance de "${objetivo}".`,
    opportunityArea,
    howTcaHelps,
    idealSolutionFit: `A recomendação de ${solucao} é perfeitamente alinhada ao estágio declarado ("${estagio}") e ao perfil de decisão ("${decisao}").`,
    expectedBusinessBenefit,
  };

  // =========================================================================
  // 3. ESTRATÉGIA DE ABORDAGEM
  // =========================================================================
  const approach: ApproachStrategy = {
    bestAngle: `Iniciar pelo impacto prático de "${problema.toLowerCase()}" na rotina do negócio, validando como isso tem retardado "${objetivo.toLowerCase()}".`,
    conversationStarter: `Mencionar que analisou as respostas do diagnóstico e percebeu clareza na busca por ${necessidade.toLowerCase()}, parabenizando pela maturidade técnica.`,
    attentionPoints: [
      `Validar se o prazo declarado (${prazo}) é rígido ou flexível para entrega em fases/sprints.`,
      `Confirmar se a faixa orçamentária (${investimento}) já possui verba alocada ou se dependerá de validação interna.`,
      `Observar se existem ferramentas ou integrações legadas que o lead não detalhou no diagnóstico inicial.`,
    ],
    howToDemonstrateValue: [
      `Apresentar a metodologia de entrega ágil da TCA (arquitetura proprietária sem templates genéricos).`,
      `Demonstrar que o escopo pode ser estruturado em um MVP de impacto rápido para mitigar qualquer risco de investimento.`,
      `Focar na segurança, escalabilidade e na relação custo-benefício frente à contratação de uma agência tradicional lenta.`,
    ],
    whatToAvoid: [
      `Evitar jargões técnicos excessivos antes de entender o foco de negócio de ${firstName}.`,
      `Não passar estimativas de valor fechadas antes de delimitar o escopo prioritário e os entregáveis essenciais.`,
      `Não tratar este lead como genérico — ele investiu tempo respondendo 7 etapas detalhadas.`,
    ],
    recommendedNextStep: currentStage === 'NOVO'
      ? 'Conectar via WhatsApp com mensagem personalizada e propor uma conversa rápida de 15 minutos para alinhamento de escopo.'
      : currentStage === 'QUALIFICADO' || currentStage === 'CONTATADO'
      ? 'Agendar reunião técnica de diagnóstico e demonstração de cases correlatos.'
      : currentStage === 'REUNIÃO'
      ? 'Conduzir a call com as perguntas estratégicas recomendadas e fechar os requisitos para a proposta.'
      : 'Apresentar a proposta comercial com foco em valor gerado e ancoragem no ROI esperado.',
  };

  // =========================================================================
  // 4. PERGUNTAS RECOMENDADAS PARA A REUNIÃO
  // =========================================================================
  const questions: RecommendedQuestion[] = [
    {
      question: `Hoje, como a sua operação lida no dia a dia com "${problema.toLowerCase()}" e quantas horas ou recursos isso consome por semana?`,
      purpose: 'Quantificar o custo da inação e o impacto financeiro/operacional real da dor.',
      category: 'impacto',
    },
    {
      question: `Para atingir o objetivo de "${objetivo.toLowerCase()}", quais soluções ou ferramentas vocês já tentaram implementar no passado e por que não funcionaram?`,
      purpose: 'Descobrir histórico de tentativas, frustrações anteriores e restrições técnicas.',
      category: 'processo',
    },
    {
      question: `Quem serão os usuários finais que mais utilizarão a solução no dia a dia e quais integrações são mandatórias logo no primeiro dia?`,
      purpose: 'Delimitar o escopo mínimo viável (MVP) e mapear dependências externas.',
      category: 'tecnica',
    },
    {
      question: `Vocês estabeleceram o prazo de "${prazo.toLowerCase()}". Existe algum marco de mercado ou evento que trava essa data limite?`,
      purpose: 'Avaliar se o prazo é motivado por um evento real ou se é uma estimativa genérica.',
      category: 'necessidade',
    },
    {
      question: `Considerando a faixa de investimento de ${investimento}, vocês preferem um modelo de entrega faseada com validação contínua ou um projeto fechado de escopo completo?`,
      purpose: 'Alinhar modelo de contratação e flexibilidade orçamentária.',
      category: 'orcamento',
    },
    {
      question: `Além de você (${decisao}), haverá outro sócio ou diretor técnico envolvido na aprovação da proposta final?`,
      purpose: 'Mapear com precisão o comitê de compra para não gerar propostas estagnadas.',
      category: 'decisao',
    },
  ];

  // =========================================================================
  // 5. POSSÍVEIS OBJEÇÕES (HIPÓTESES)
  // =========================================================================
  const possibleObjections: PossibleObjection[] = [
    {
      hypothesis: 'Objeção de Investimento / Faixa Orçamentária',
      evidence: `O lead selecionou a faixa orçamentária "${investimento}". Caso o escopo expandido supere esse limite, poderá haver hesitação inicial.`,
      howToValidateAndOvercome: 'Propor fatiamento do projeto: entregar o núcleo de maior ROI na primeira fase e escalonar os módulos secundários.',
    },
    {
      hypothesis: 'Objeção de Complexidade e Tempo de Implantação',
      evidence: `Dada a urgência de "${prazo}", o cliente pode temer que o desenvolvimento sob medida demore mais do que uma ferramenta pronta.`,
      howToValidateAndOvercome: 'Enfatizar a agilidade do método TCA (entregas funcionais a cada sprint e arquitetura moderna sem retrabalho).',
    },
    {
      hypothesis: 'Dúvida sobre Suporte e Continuidade Técnica',
      evidence: 'Projetos de software e automação frequentemente geram receio de dependência técnica pós-entrega.',
      howToValidateAndOvercome: 'Esclarecer que todo o código é 100% proprietário do cliente, acompanhado de documentação completa e suporte pós-publicação.',
    },
  ];

  // =========================================================================
  // 6. MENSAGEM SUGERIDA PARA WHATSAPP
  // =========================================================================
  const whatsappMessage = `Olá, ${firstName}! Tudo bem? 👋

Aqui é o Thiago Cassol Antunes.
Recebi seu diagnóstico pelo meu portfólio e analisei as respostas do seu projeto com atenção.

Vi que seu objetivo principal é ${objetivo.toLowerCase()} e que o desafio central hoje está em ${problema.toLowerCase()}.

Para o seu momento (${estagio.toLowerCase()}), a estrutura de *${solucao}* faz total sentido para acelerarmos com qualidade e segurança técnica.

Você teria 15 minutos amanhã ou quinta para uma rápida conversa de alinhamento? Quero te mostrar o melhor caminho para tirarmos isso do papel sem desperdício de tempo.`;

  // =========================================================================
  // 7. PRÓXIMO PASSO RECOMENDADO
  // =========================================================================
  const recommendedNextAction = currentStage === 'NOVO'
    ? `Enviar mensagem personalizada no WhatsApp para ${firstName} propondo alinhamento de escopo para ${solucao}.`
    : currentStage === 'REUNIÃO'
    ? `Conduzir reunião com foco em fatiamento de MVP e validação do prazo de ${prazo}.`
    : `Apresentar minuta de proposta focada em mitigar a dor de "${problema}".`;

  // =========================================================================
  // 8. PREPARAÇÃO PARA REUNIÃO (BRIEFING 60s)
  // =========================================================================
  const meetingPrep: MeetingPrepBriefing = {
    context: `${companyOrName} busca ${necessidade.toLowerCase()} para ${objetivo.toLowerCase()}. Lead Score: ${lead.score} pts.`,
    problem: problema,
    goal: objetivo,
    probableSolution: solucao,
    pointsToValidate: [
      `Se ${firstName} já possui especificações desenhadas ou se partiremos do zero.`,
      `Data limite de entrega (${prazo}) e flexibilidade para entregas parciais.`,
      `Ferramentas ou bancos de dados que precisarão se conectar à solução.`,
    ],
    strategicQuestions: questions.slice(0, 4).map((q) => q.question),
    possibleObjections: [
      `Preço vs Escopo (faixa de ${investimento}).`,
      `Garantia de cumprimento do prazo de ${prazo}.`,
    ],
    desiredOutcome: `Aprovar o escopo do MVP e obter autorização para emissão da proposta comercial definitiva.`,
  };

  // =========================================================================
  // 9. ESTRATÉGIA DE PROPOSTA (Se em Proposta ou Negociação)
  // =========================================================================
  let proposalStrategy: ProposalStrategy | undefined;
  if (['PROPOSTA', 'NEGOCIAÇÃO', 'FECHADO'].includes(currentStage)) {
    proposalStrategy = {
      coreProblem: problema,
      priorityScope: [
        `Módulo essencial para resolução de "${problema}".`,
        `Arquitetura de dados centralizada e segura em PostgreSQL.`,
        `Interface responsiva e painel administrativo direto ao ponto.`,
      ],
      highlightItems: [
        'Propriedade integral do código-fonte (sem licenças recorrentes abusivas).',
        'Prazos acordados por contrato e SLA de entrega rápida.',
        'Metodologia de comunicação direta e suporte especializado com o fundador.',
      ],
      scopeRisks: [
        'Adição tardia de novas integrações de terceiros não mapeadas.',
        'Atraso no fornecimento de acessos ou conteúdos por parte do cliente.',
      ],
      openQuestionsToResolve: [
        'Definir se o cliente fornecerá ambiente cloud próprio ou utilizará infraestrutura recomendada.',
        'Validar se haverá necessidade de treinamento de equipe ou apenas documentação.',
      ],
      valueArguments: [
        `Eliminar o custo recorrente gerado pela dor de "${problema}".`,
        `Entregar a base pronta para escalar "${objetivo}" sem retrabalho futuro.`,
      ],
    };
  }

  // =========================================================================
  // 10. ANÁLISE DE PERDA (Se em Perdido)
  // =========================================================================
  let lossAnalysis: LossAnalysis | undefined;
  if (currentStage === 'PERDIDO') {
    lossAnalysis = {
      probableMainCause: deal?.lost_reason || 'Motivo não especificado no CRM.',
      commercialLearnings: [
        `Verificar se a qualificação de orçamento (${investimento}) foi alinhada logo no primeiro contato.`,
        `Avaliar se o tempo de resposta entre o diagnóstico e a primeira abordagem foi ágil o suficiente.`,
        `Reforçar a apresentação de protótipos visuais precoces para reduzir a percepção de risco do lead.`,
      ],
      identifiedPattern: `Oportunidade perdida na etapa de ${deal?.pipeline_stage || 'funil'}. Motivo registrado: "${deal?.lost_reason || 'Outro'}".`,
      futureImprovementRecommendation: 'Para perfis semelhantes, ancorar o valor no custo da inação antes de apresentar tabelas de investimento financeiro.',
    };
  }

  const sourceSnapshotHash = generateSnapshotHash({ lead, answers, deal, notes });

  return {
    summary,
    opportunity,
    approach,
    questions,
    possibleObjections,
    whatsappMessage,
    recommendedNextAction,
    meetingPrep,
    proposalStrategy,
    lossAnalysis,
    confidenceNotes: [
      'Análise sintetizada a partir das 7 respostas oficiais do Diagnóstico TCA.',
      'Lead Score determinístico preservado em 100% como régua oficial de qualificação.',
      'As objeções e pontos de abordagem são hipóteses comerciais e devem ser validadas durante a conversa.',
    ],
    sourceSnapshotHash,
    generatedAt: new Date().toISOString(),
    model: 'TCA Sales Copilot v1 (Engine)',
    promptVersion: SALES_COPILOT_PROMPT_VERSION,
  };
}
