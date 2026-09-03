export interface DiagnosticOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface DiagnosticQuestion {
  step: number;
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  options: DiagnosticOption[];
}

// =====================================================================
// ETAPAS E PERGUNTAS DO DIAGNÓSTICO TCA
// =====================================================================

export const STEP_1_NECESSIDADE: DiagnosticQuestion = {
  step: 1,
  id: 'necessidade',
  category: 'ETAPA 01 — NECESSIDADE',
  title: 'O que você quer resolver hoje?',
  subtitle: 'Selecione o objetivo central que melhor define sua prioridade de negócio neste momento.',
  options: [
    {
      id: 'presenca_digital',
      label: 'Criar ou melhorar minha presença digital',
      description: 'Site institucional ou reformulação com posicionamento premium',
    },
    {
      id: 'gerar_leads',
      label: 'Gerar mais leads ou vendas',
      description: 'Landing pages de alta conversão para tráfego e campanhas',
    },
    {
      id: 'software_sistema',
      label: 'Criar um software ou sistema',
      description: 'Plataforma sob medida, CRM interno ou painel corporativo',
    },
    {
      id: 'saas_ideia',
      label: 'Transformar uma ideia em SaaS',
      description: 'Produto digital escalável com modelo de assinatura',
    },
    {
      id: 'automacao_ia',
      label: 'Automatizar processos com IA',
      description: 'Agentes autônomos, triagem e fluxos integrados 24/7',
    },
    {
      id: 'ainda_nao_sei',
      label: 'Ainda não sei qual solução preciso',
      description: 'Quero orientação técnica para mapear o melhor caminho',
    },
  ],
};

// =====================================================================
// ETAPA 2 CONDICIONAL — PROBLEMA ESPECÍFICO
// =====================================================================

export const STEP_2_CONDITIONAL: Record<string, DiagnosticQuestion> = {
  // Se escolheu Automação com IA
  automacao_ia: {
    step: 2,
    id: 'problema_automacao',
    category: 'ETAPA 02 — PROBLEMA ESPECÍFICO',
    title: 'Qual problema mais consome tempo hoje?',
    subtitle: 'Identifique onde ocorrem os maiores gargalos operacionais na sua rotina.',
    options: [
      { id: 'atendimento_repetitivo', label: 'Atendimento repetitivo', description: 'Responder as mesmas dúvidas repetidamente no WhatsApp' },
      { id: 'qualificacao_leads', label: 'Qualificação de leads', description: 'Filtrar contatos frios antes de passar para o time de vendas' },
      { id: 'processos_administrativos', label: 'Processos administrativos', description: 'Emissão de documentos, conferência e cadastros manuais' },
      { id: 'organizacao_informacoes', label: 'Organização de informações', description: 'Dados espalhados em planilhas sem centralização' },
      { id: 'integracao_ferramentas', label: 'Integração entre ferramentas', description: 'Conectar CRM, WhatsApp, Gateway de pagamento e ERP' },
      { id: 'outro_processo_manual', label: 'Outro processo manual', description: 'Gargalo customizado que exige inteligência operacional' },
    ],
  },

  // Se escolheu Presença Digital ou Gerar Leads (Sites / Landing Pages)
  presenca_digital: {
    step: 2,
    id: 'problema_site',
    category: 'ETAPA 02 — PRINCIPAL OBJETIVO',
    title: 'Qual é o principal objetivo do site?',
    subtitle: 'Direcione a estratégia visual e arquitetura de conversão da página.',
    options: [
      { id: 'posicionamento', label: 'Posicionamento', description: 'Transmitir autoridade executiva e valor inquestionável' },
      { id: 'geracao_leads', label: 'Geração de leads', description: 'Capturar contatos qualificados e direcionar para o comercial' },
      { id: 'venda_servico', label: 'Venda de serviço', description: 'Apresentar e vender ofertas de alto ticket' },
      { id: 'apresentacao_empresa', label: 'Apresentação da empresa', description: 'Portfólio institucional completo para clientes e parceiros' },
      { id: 'landing_page_campanha', label: 'Landing page de campanha', description: 'Página focada em anúncios no Google Ads e Meta Ads' },
      { id: 'modernizar_site', label: 'Modernizar site existente', description: 'Substituir site antigo e lento por código moderno ultrarrápido' },
    ],
  },
  gerar_leads: {
    step: 2,
    id: 'problema_site_leads',
    category: 'ETAPA 02 — PRINCIPAL OBJETIVO',
    title: 'Qual é o principal objetivo de conversão?',
    subtitle: 'Direcione a estratégia comercial que deve guiar os visitantes.',
    options: [
      { id: 'geracao_leads', label: 'Geração de leads', description: 'Capturar contatos qualificados e direcionar para o comercial' },
      { id: 'landing_page_campanha', label: 'Landing page de campanha', description: 'Página focada em anúncios no Google Ads e Meta Ads' },
      { id: 'venda_servico', label: 'Venda de serviço', description: 'Apresentar e vender ofertas de alto ticket' },
      { id: 'posicionamento', label: 'Posicionamento', description: 'Transmitir autoridade executiva e valor inquestionável' },
      { id: 'modernizar_site', label: 'Modernizar site existente', description: 'Substituir site antigo e lento por código moderno ultrarrápido' },
      { id: 'apresentacao_empresa', label: 'Apresentação da empresa', description: 'Portfólio institucional completo para clientes e parceiros' },
    ],
  },

  // Se escolheu Software / Sistema
  software_sistema: {
    step: 2,
    id: 'problema_software',
    category: 'ETAPA 02 — ESCOPO DO SISTEMA',
    title: 'Qual tipo de sistema você precisa?',
    subtitle: 'Defina a natureza da aplicação técnica para desenharmos a arquitetura ideal.',
    options: [
      { id: 'sistema_interno_crm', label: 'Sistema interno / CRM / ERP', description: 'Gestão operacional de clientes, ordens e controle da equipe' },
      { id: 'portal_clientes', label: 'Portal para clientes ou parceiros', description: 'Área com login seguro para consulta de dados e serviços' },
      { id: 'automacao_workflow', label: 'Automação de fluxo de trabalho operacional', description: 'Orquestração de regras de negócio automatizadas' },
      { id: 'painel_administrativo', label: 'Painel administrativo com banco de dados', description: 'Dashboard gerencial com relatórios e controle de acessos' },
      { id: 'modernizacao_legado', label: 'Modernização de sistema legado', description: 'Migração de sistemas obsoletos para web moderna na nuvem' },
      { id: 'outro_sistema_medida', label: 'Outro sistema sob medida', description: 'Solução personalizada para um fluxo de negócio específico' },
    ],
  },

  // Se escolheu SaaS / Micro-SaaS
  saas_ideia: {
    step: 2,
    id: 'problema_saas',
    category: 'ETAPA 02 — MODELO DO PRODUTO',
    title: 'Qual é o foco do seu produto SaaS?',
    subtitle: 'Compreenda a proposta de valor do software como serviço que deseja lançar.',
    options: [
      { id: 'dor_especifica_b2b', label: 'Resolver dor específica de um nicho B2B', description: 'Software vertical para empresas de um segmento específico' },
      { id: 'assinatura_recorrente', label: 'Plataforma por assinatura recorrente', description: 'Cobrança mensal automatizada via Stripe ou Asaas' },
      { id: 'ferramenta_ia_integrada', label: 'Ferramenta com inteligência artificial integrada', description: 'Produto que usa modelos de IA para entregar valor ao usuário' },
      { id: 'marketplace_multi_usuario', label: 'Marketplace ou plataforma multi-usuário', description: 'Conectar dois lados do mercado com painéis distintos' },
      { id: 'mvp_rapido', label: 'Validar um MVP funcional rapidamente', description: 'Versão enxuta colocada no ar em tempo recorde para tração' },
      { id: 'outra_ideia_saas', label: 'Outra ideia inovadora', description: 'Conceito exclusivo com grande potencial de escala' },
    ],
  },

  // Se escolheu "Ainda não sei"
  ainda_nao_sei: {
    step: 2,
    id: 'problema_diagnostico',
    category: 'ETAPA 02 — DESAFIO ATUAL',
    title: 'Qual é o maior desafio atual do seu negócio?',
    subtitle: 'Vamos identificar onde a tecnologia pode gerar o maior retorno sobre investimento.',
    options: [
      { id: 'pouca_visibilidade', label: 'Pouca visibilidade e credibilidade online', description: 'Falta um canal profissional para transmitir confiança' },
      { id: 'processos_manuais_tempo', label: 'Processos manuais e perda de tempo', description: 'Horas gastas em tarefas que poderiam rodar sozinhas' },
      { id: 'perda_vendas_automacao', label: 'Perda de vendas por demora no atendimento', description: 'Clientes desistem porque não recebem resposta rápida' },
      { id: 'desorganizacao_dados', label: 'Dificuldade de organizar dados e clientes', description: 'Controle descentralizado e falha de acompanhamento' },
      { id: 'falta_tecnologia_propria', label: 'Dependência de plataformas de terceiros', description: 'Necessidade de ter um ativo digital próprio e seguro' },
      { id: 'entender_lucro', label: 'Quero entender onde a tecnologia gera mais lucro', description: 'Avaliação técnica e estratégica sem compromisso' },
    ],
  },
};

// =====================================================================
// ETAPAS 3 A 7
// =====================================================================

export const STEP_3_ESTAGIO: DiagnosticQuestion = {
  step: 3,
  id: 'estagio',
  category: 'ETAPA 03 — ESTÁGIO DO PROJETO',
  title: 'Em que estágio seu projeto está?',
  subtitle: 'Isso ajuda a calibrar a estratégia técnica e o modelo de entrega ideal.',
  options: [
    { id: 'apenas_ideia', label: 'É apenas uma ideia', description: 'Na fase de concepção e desenho do modelo' },
    { id: 'planejado', label: 'Já tenho algo planejado', description: 'Estrutura, escopo ou referências já definidos' },
    { id: 'precisa_melhorar', label: 'Já existe, mas precisa melhorar', description: 'Solução no ar, mas com falhas de design, código ou conversão' },
    { id: 'preciso_escalar', label: 'Já funciona e preciso escalar', description: 'Operação validada que exige robustez técnica e automação' },
    { id: 'problema_sem_solucao', label: 'Tenho o problema, mas ainda não sei a solução', description: 'Preciso de aconselhamento sênior para a melhor escolha' },
  ],
};

export const STEP_4_OBJETIVO: DiagnosticQuestion = {
  step: 4,
  id: 'objetivo',
  category: 'ETAPA 04 — RESULTADO PRINCIPAL',
  title: 'Qual resultado você mais quer alcançar?',
  subtitle: 'A métrica que determinará o sucesso deste investimento.',
  options: [
    { id: 'gerar_oportunidades', label: 'Gerar oportunidades', description: 'Atrair leads qualificados e novos contratos' },
    { id: 'economizar_tempo', label: 'Economizar tempo', description: 'Eliminar tarefas repetitivas e retrabalho da equipe' },
    { id: 'automatizar_operacao', label: 'Automatizar operação', description: 'Fazer o negócio rodar com processos autônomos 24/7' },
    { id: 'melhorar_posicionamento', label: 'Melhorar posicionamento', description: 'Destacar-se com design sofisticado e código de ponta' },
    { id: 'criar_receita', label: 'Criar nova fonte de receita', description: 'Monetizar um novo produto ou serviço digital' },
    { id: 'organizar_processos', label: 'Organizar processos', description: 'Centralizar informações e ter visibilidade de ponta a ponta' },
    { id: 'escalar_negocio', label: 'Escalar o negócio', description: 'Crescer faturamento sem aumentar custos na mesma proporção' },
  ],
};

export const STEP_5_PRAZO: DiagnosticQuestion = {
  step: 5,
  id: 'prazo',
  category: 'ETAPA 05 — HORIZONTE DE TEMPO',
  title: 'Quando pretende colocar isso em prática?',
  subtitle: 'Nossa entrega varia de 3 a 10 dias úteis dependendo da complexidade.',
  options: [
    { id: 'quanto_antes', label: 'O quanto antes', description: 'Prioridade máxima, pronto para iniciar imediatamente' },
    { id: 'proximos_30_dias', label: 'Próximos 30 dias', description: 'Planejando início para as próximas semanas' },
    { id: 'entre_30_60_dias', label: 'Entre 30 e 60 dias', description: 'Alinhando orçamento e cronograma interno' },
    { id: 'proximos_meses', label: 'Nos próximos meses', description: 'Visão de médio prazo no planejamento anual' },
    { id: 'apenas_pesquisando', label: 'Estou apenas pesquisando', description: 'Levantando possibilidades de viabilidade técnica' },
  ],
};

// Faixas de investimento configuráveis (sem valores fixos inventados, permitindo expansão)
export const INVESTMENT_OPTIONS: DiagnosticOption[] = [
  { id: 'invest_ate_3k', label: 'Até R$ 3.000', description: 'Ideal para landing pages de alta conversão e entregas ágeis' },
  { id: 'invest_3k_7k', label: 'R$ 3.000 a R$ 7.000', description: 'Sites institucionais completos ou automações dedicadas com IA' },
  { id: 'invest_7k_15k', label: 'R$ 7.000 a R$ 15.000', description: 'Softwares sob medida, portais integrados ou MVPs de SaaS' },
  { id: 'invest_acima_15k', label: 'Acima de R$ 15.000', description: 'Sistemas complexos, plataformas de alta escala e ecossistemas' },
  { id: 'invest_entender', label: 'Ainda preciso entender o investimento necessário.', description: 'Quero avaliar a relação de custo-benefício para meu escopo' },
];

export const STEP_6_INVESTIMENTO: DiagnosticQuestion = {
  step: 6,
  id: 'investimento',
  category: 'ETAPA 06 — FAIXA DE INVESTIMENTO',
  title: 'Qual faixa de investimento você considera viável?',
  subtitle: 'Essa informação permite recomendar uma arquitetura compatível com seu momento financeiro.',
  options: INVESTMENT_OPTIONS,
};

export const STEP_7_DECISAO: DiagnosticQuestion = {
  step: 7,
  id: 'decisao',
  category: 'ETAPA 07 — PAPEL NO PROJETO',
  title: 'Qual é sua relação com este projeto?',
  subtitle: 'Para sabermos como direcionar as informações estratégicas e técnicas.',
  options: [
    { id: 'proprietario_socio', label: 'Sou proprietário/sócio', description: 'Fundador ou sócio com poder deliberativo' },
    { id: 'responsavel_decisao', label: 'Sou responsável pela decisão', description: 'Diretor ou gestor encarregado da escolha técnica' },
    { id: 'equipe_responsavel', label: 'Faço parte da equipe responsável', description: 'Membro do time técnico, operacional ou de marketing' },
    { id: 'pesquisando_apresentar', label: 'Estou pesquisando para apresentar internamente', description: 'Montando dossiê para aprovação de diretoria' },
    { id: 'projeto_pessoal', label: 'É um projeto pessoal', description: 'Empreendimento próprio em fase de validação' },
  ],
};
