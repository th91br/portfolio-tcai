import { ServiceItem, ProjectItem, DecorativeAsset, ReviewCardItem } from '../types';

export const HERO_DATA = {
  title: 'THIAGO CASSOL ANTUNES',
  statusBadge: 'DISPONIBILIDADE: 2 VAGAS PARA ESTE MÊS',
  headlineP1: 'TECNOLOGIA COM ESTRATÉGIA.',
  headlineP2: 'SOLUÇÕES QUE GERAM RESULTADOS.',
  subtext:
    'Desenvolvo Sites de Alta Conversão, Softwares Sob Medida e Automações Inteligentes com IA. Sem intermediários, com código proprietário e entrega recorde de 3 a 10 dias úteis.',
  slaBadges: [
    { type: 'Sites & Landing Pages', time: '3 Dias Úteis', icon: 'zap', highlight: '⚡ Alta Conversão' },
    { type: 'Automações & Agentes IA', time: '7 Dias Úteis', icon: 'bot', highlight: '🤖 Operação 24/7' },
    { type: 'Softwares & SaaS', time: '10 Dias Úteis', icon: 'code', highlight: '💻 Sistemas Sob Medida' },
  ],
  primaryCta: 'INICIAR MEU PROJETO →',
  secondaryCta: 'VER CASES REAIS ↓',
};

export const REVIEWS_HEADER = {
  pill: 'AVALIAÇÕES 5.0 ★ • RESULTADOS REAIS',
  headline: 'QUEM CONFIA NA TCAI PARA CONSTRUIR O PRÓXIMO NÍVEL DO SEU NEGÓCIO',
  tagline: 'Depoimentos de fundadores, diretores e profissionais que escalaram suas operações com tecnologia sob medida, inteligência e design de alto impacto.',
};

export const METRICS_DATA = [
  { value: '+5 Anos', label: 'Estudo & Aplicação Prática em IA e Software' },
  { value: '3 a 10 Dias', label: 'Prazos Recordes de Entrega Garantida' },
  { value: '100%', label: 'Código Proprietário sem Templates Lentos' },
  { value: '0 Intermediários', label: 'Alinhamento Direto com o Especialista' },
];

export const COMPARISON_DATA = {
  pill: 'DECISÃO INTELIGENTE',
  headline: 'POR QUE EMPRESAS EXIGENTES ESCOLHEM A TCAI?',
  tagline: 'Veja a diferença entre o modelo tradicional de agências lentas e o método direto, ágil e estratégico desenvolvido por Thiago Cassol Antunes.',
  traditional: [
    {
      title: 'Meses de Espera e Atrasos',
      desc: 'Projetos arrastados por 60 a 180 dias com cronogramas estourados e perda do timing de mercado.',
    },
    {
      title: 'Repasses e Falha de Comunicação',
      desc: 'Atendentes e gerentes de conta que repassam recados para desenvolvedores terceirizados sem entender seu negócio.',
    },
    {
      title: 'Templates Genéricos e Pesados',
      desc: 'Instalação de temas prontos com dezenas de plugins instáveis que quebram com atualizações e deixam o site lento.',
    },
    {
      title: 'Custos Inflados e Retrabalhos',
      desc: 'Você paga a estrutura física e a folha salarial da agência em orçamentos exorbitantes sem garantia de conversão.',
    },
  ],
  tcaiMethod: [
    {
      title: 'Entregas em 3, 7 ou 10 Dias Úteis',
      desc: 'Sua solução no ar em tempo recorde gerando autoridade e receita enquanto concorrentes ainda planejam reuniões.',
    },
    {
      title: 'Contato Direto com Quem Constrói',
      desc: 'Você fala diretamente com Thiago, que pensa a estratégia, a arquitetura e programa cada linha com rigor.',
    },
    {
      title: 'Código Moderno, Seguro & IA Nativa',
      desc: 'Desenvolvido em React, TypeScript, Tailwind e inteligência artificial aplicada para alta velocidade e escalabilidade.',
    },
    {
      title: 'Foco Absoluto em Conversão & ROI',
      desc: 'Cada componente, botão e fluxo é construído para transformar visitantes em clientes pagantes e reduzir custos operacionais.',
    },
  ],
};

export const CORE_OFFERS = [
  {
    id: 'offer-1',
    number: '01',
    category: 'SITES & LANDING PAGES',
    name: 'Sites de Alta Conversão & Presença Digital',
    sla: '3 DIAS ÚTEIS',
    slaHighlight: '⚡ Entrega Recorde',
    tagline: 'Para marcas e profissionais que exigem autoridade inquestionável e captação ativa de clientes.',
    features: [
      'Design exclusivo de alto padrão (sem templates genéricos)',
      'Copywriting persuasivo orientado à conversão imediata',
      'Velocidade extrema de carregamento e SEO estruturado',
      'Integração direta com WhatsApp, CRM e formulários',
      '100% responsivo para mobile, tablet e desktop',
    ],
    idealFor: 'Lançamentos, empresas, clínicas, consultorias, serviços premium e captação de leads qualificados.',
  },
  {
    id: 'offer-2',
    number: '02',
    category: 'AUTOMAÇÕES & AGENTES DE IA',
    name: 'Automação de Processos & Agentes 24/7',
    sla: '7 DIAS ÚTEIS',
    slaHighlight: '🤖 Eficiência Máxima',
    tagline: 'Para operações que precisam eliminar tarefas manuais e atender clientes no piloto automático.',
    features: [
      'Agentes inteligentes com IA para qualificação de leads 24/7',
      'Sincronização em tempo real entre WhatsApp, CRM e planilhas',
      'Disparos automáticos de propostas, lembretes e contratos',
      'Triagem cognitiva com linguagem natural e regras de negócio',
      'Redução drástica de tempo de resposta e custo com equipe',
    ],
    idealFor: 'Escalar vendas, qualificar oportunidades sem intervenção humana e organizar rotinas operacionais.',
  },
  {
    id: 'offer-3',
    number: '03',
    category: 'SOFTWARE & SISTEMAS SOB MEDIDA',
    name: 'Plataformas Web, SaaS & Softwares',
    sla: '10 DIAS ÚTEIS',
    slaHighlight: '💻 Arquitetura Robusta',
    tagline: 'Para negócios que necessitam de sistemas próprios, dashboards operacionais e plataformas escaláveis.',
    features: [
      'Painéis administrativos e dashboards em tempo real',
      'Autenticação segura, controle de permissões e perfis',
      'Bancos de dados relacionais e APIs de alta performance',
      'Módulos financeiros, cobranças automatizadas e relatórios',
      'Infraestrutura pronta para milhares de usuários simultâneos',
    ],
    idealFor: 'Startups, SaaS, controle de processos jurídicos, escolas esportivas e sistemas internos de gestão.',
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Diagnóstico & Estratégia',
    duration: 'Dia 1',
    desc: 'Análise profunda da sua necessidade, do modelo de negócios e definição do escopo técnico exato sem enrolação.',
  },
  {
    step: '02',
    title: 'Design & Arquitetura',
    duration: 'Dias 2 a 3',
    desc: 'Construção da interface de alto padrão, hierarquia visual e fluxo de conversão calibrado para o seu público.',
  },
  {
    step: '03',
    title: 'Engenharia, Código & IA',
    duration: 'Dias 4 a 8',
    desc: 'Desenvolvimento full-stack robusto, integrações de APIs, testes de carga e implantação de inteligência artificial.',
  },
  {
    step: '04',
    title: 'Deploy & Lançamento',
    duration: 'Dia 3, 7 ou 10',
    desc: 'Publicação oficial em nuvem de alta disponibilidade, testes finais em produção e entrega com suporte direto.',
  },
];

export const ABOUT_DATA = {
  heading: 'SOBRE THIAGO CASSOL ANTUNES',
  role: 'Tecnologia • Software • Web • Automação com IA',
  text: 'Sou Thiago Cassol Antunes, tenho 35 anos e sou movido pela curiosidade por tecnologia, inovação e Inteligência Artificial. Há mais de 5 anos estudo, desenvolvo e aplico tecnologia na teoria e na prática, transformando ideias e problemas reais em soluções digitais funcionais. Meu trabalho combina estratégia, agilidade, segurança e experiência do usuário, sempre preservando o branding, a identidade e os objetivos de cada projeto. Não acredito em tecnologia apenas por tecnologia. Acredito em criar aquilo que realmente faz sentido para o negócio.',
  ctaButton: 'FALE COMIGO NO WHATSAPP →',
  executiveImage: '/assets/branding/thiago_executive.jpg',
  lifestyleImage: '/assets/branding/thiago_lifestyle.jpg',
  sunsetImage: '/assets/branding/thiago_sunset.jpg',
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'service-1',
    number: '01',
    name: 'SITES PROFISSIONAIS',
    description:
      'Sites modernos, responsivos e estratégicos, desenvolvidos para fortalecer sua presença digital, comunicar autoridade e transformar visitantes em oportunidades. Entrega em 3 dias úteis.',
  },
  {
    id: 'service-2',
    number: '02',
    name: 'LANDING PAGES',
    description:
      'Páginas planejadas para conversão, combinando estratégia, comunicação e experiência para campanhas, serviços, produtos e geração de leads. Entrega em 3 dias úteis.',
  },
  {
    id: 'service-3',
    number: '03',
    name: 'SOFTWARE & SISTEMAS',
    description:
      'Sistemas, plataformas e soluções digitais desenvolvidas para organizar operações, reduzir processos manuais e transformar ideias em produtos reais. Entrega em 10 dias úteis.',
  },
  {
    id: 'service-4',
    number: '04',
    name: 'AUTOMAÇÃO COM IA',
    description:
      'Automação inteligente de processos, operações e atendimentos utilizando Inteligência Artificial para aumentar produtividade, velocidade e capacidade de escala. Entrega em 7 dias úteis.',
  },
  {
    id: 'service-5',
    number: '05',
    name: 'INTEGRAÇÕES & APIS',
    description:
      'Integrações avançadas entre sistemas legados, gateways de pagamento, CRMs e bancos de dados para operações digitais blindadas e em tempo real.',
  },
];

export const PROJECTS_HEADER = {
  title: 'PROJETOS',
  openingHeadline: 'CASES REAIS. RESULTADOS COMPROVADOS.',
  openingDescription:
    'Uma seleção de soluções digitais em produção desenvolvidas para clientes que exigem alta performance, segurança e design de ponta.',
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'esportiz',
    number: '01',
    name: 'Esportiz — Gestão Esportiva',
    category: 'SAAS',
    col1TopImage: '/assets/projects/esportiz/esportiz_dashboard.png',
    col1BottomImage: '/assets/projects/esportiz/esportiz_features.png',
    col2Image: '/assets/projects/esportiz/esportiz_hero.png',
    liveUrl: 'https://www.esportiz.com.br/',
    description:
      'Plataforma SaaS completa para gestão de escolas esportivas, quadras, arenas e centros de treinamento. Controle unificado de alunos, chamadas de presença, pagamentos e cobranças automatizadas, contratos digitais e relatórios gerenciais em tempo real.',
    year: '2026',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'prazoguard',
    number: '02',
    name: 'PrazoGuard Pro — Gestão Processual',
    category: 'SOFTWARE',
    col1TopImage: '/assets/projects/prazoguard/prazoguard_dashboard.png',
    col1BottomImage: '/assets/projects/prazoguard/prazoguard_features.png',
    col2Image: '/assets/projects/prazoguard/prazoguard_hero.png',
    liveUrl: 'https://prazo-guard-pro.vercel.app/',
    description:
      'Software de alta performance para organização, controle de prazos e gestão processual jurídica. Centralização de processos, delegação de tarefas por responsável, alertas de vencimento com redução de ruído e visão clara de prioridades.',
    year: '2026',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'compradeouro',
    number: '03',
    name: 'Compra de Ouro Caxias',
    category: 'WEB',
    col1TopImage: '/assets/projects/compradeouro/compradeouro_avaliacao.png',
    col1BottomImage: '/assets/projects/compradeouro/compradeouro_details.png',
    col2Image: '/assets/projects/compradeouro/compradeouro_hero.png',
    liveUrl: 'https://www.compradeourocaxias.com.br/',
    description:
      'Plataforma institucional e canal de conversão digital para avaliação e compra de ouro e joias em Caxias do Sul. Foco em autoridade, transparência, segurança, discrição e atendimento direto com mais de 18 anos de experiência de mercado.',
    year: '2025',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'SEO Otimizado', 'UI/UX Design'],
  },
  {
    id: 'joiasag',
    number: '04',
    name: 'Joias AG Caxias',
    category: 'WEB',
    col1TopImage: '/assets/projects/joiasag/joiasag_services.png',
    col1BottomImage: '/assets/projects/joiasag/joiasag_portfolio.png',
    col2Image: '/assets/projects/joiasag/joiasag_hero.png',
    liveUrl: 'https://www.joiasagcaxias.com.br/',
    description:
      'Website institucional e catálogo digital para tradicional ateliê de joalheria em Caxias do Sul. Apresentação de consertos, reformas em ouro e prata, peças sob encomenda e gravações a laser com mais de 30 anos de tradição.',
    year: '2025',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Design System', 'SEO Local'],
  },
  {
    id: 'seu-projeto',
    number: '05',
    name: 'Seu Projeto Aqui — Da Ideia ao Lançamento',
    category: 'VAMOS CRIAR JUNTOS?',
    isCtaCard: true,
    col1TopImage: '/assets/branding/tca_logo.png',
    col1BottomImage: '/assets/branding/thiago_executive.jpg',
    col2Image: '/assets/branding/thiago_executive.jpg',
    liveUrl: 'https://tcai.com.br/iniciar-projeto',
    description:
      'Transforme sua ideia, operação ou necessidade de mercado em uma solução digital de alto impacto. Desenvolvemos Sites Profissionais em 3 dias, Automações em 7 dias e Softwares Sob Medida em 10 dias com estratégia, código limpo e foco em resultados.',
    year: '2026',
    technologies: [
      'Sites em 3 Dias',
      'Automações em 7 Dias',
      'Softwares em 10 Dias',
      'SaaS & Plataformas',
      'Agentes de IA',
    ],
    ctaButtonLabel: 'VAMOS CRIAR MEU PROJETO →',
  },
];

export const REVIEWS_ROW1: ReviewCardItem[] = [
  {
    id: 'rev-esportiz',
    projectName: 'Esportiz — Gestão Esportiva',
    clientName: 'Marcelo Fagundes',
    clientRole: 'Fundador & Diretor de Operações',
    category: 'SAAS & GESTÃO ESPORTIVA',
    rating: 5,
    review:
      'O Thiago não apenas desenvolveu o SaaS do Esportiz, mas nos ajudou a modelar toda a lógica financeira e de turmas. A plataforma é rápida, intuitiva e reduziu nosso trabalho manual em mais de 70%. Execução técnica impecável.',
    metricHighlight: '70% menos trabalho manual',
    tagColor: '#00D2F6',
    logoText: 'EZ',
    logoImage: '/assets/testimonials/esportiz_logo.png',
    logoBg: 'bg-[#0F1E36]',
  },
  {
    id: 'rev-compradeouro',
    projectName: 'Compra de Ouro Caxias',
    clientName: 'Rita Pereira',
    clientRole: 'Diretora & Avaliadora Especialista',
    category: 'SITES PROFISSIONAIS & CONVERSÃO',
    rating: 5,
    review:
      'Precisávamos de um site que transmitisse segurança e autoridade imediata para nossos mais de 18 anos de mercado. O volume de contatos qualificados triplicou nas primeiras semanas. O retorno do investimento foi imediato.',
    metricHighlight: '3x mais contatos qualificados',
    tagColor: '#FFB800',
    logoText: 'CO',
    logoImage: '/assets/testimonials/compra_de_ouro_logo.png',
    logoBg: 'bg-black',
  },
  {
    id: 'rev-vortex',
    projectName: 'Vortex Automações & IA',
    clientName: 'Gabriel M. Vasconcellos',
    clientRole: 'Head de Tecnologia & Inovação',
    category: 'AUTOMAÇÃO COM IA & AGENTES',
    rating: 5,
    review:
      'Implementamos agentes inteligentes para triagem e qualificação de leads corporativos. A arquitetura criada pelo Thiago é robusta, sem falhas e permitiu escalar nosso atendimento com excelência sem inchar a equipe.',
    metricHighlight: 'Escala sem inchar equipe',
    tagColor: '#10B981',
    logoText: 'VX',
    logoImage: '/assets/testimonials/vortex_logo.jpg',
    logoBg: 'bg-white',
  },
  {
    id: 'rev-joiasag',
    projectName: 'Joias AG Caxias',
    clientName: 'Antônio G. & Família',
    clientRole: 'Mestres Ourives • 30+ Anos de Tradição',
    category: 'WEBSITE INSTITUCIONAL & CATÁLOGO',
    rating: 5,
    review:
      'Mais de 30 anos de história precisavam de uma vitrine digital à altura do nosso trabalho artesanal. O site valorizou cada peça sob encomenda e trouxe novos clientes exigentes que buscam discrição e confiança.',
    metricHighlight: 'Autoridade e prestígio digital',
    tagColor: '#E2E8F0',
    logoText: 'AG',
    logoImage: '/assets/testimonials/joias_ag_logo.png',
    logoBg: 'bg-white',
  },
];

export const REVIEWS_ROW2: ReviewCardItem[] = [
  {
    id: 'rev-prazoguard',
    projectName: 'PrazoGuard Pro',
    clientName: 'Dr. Rodrigo S. Alencar',
    clientRole: 'Sócio Coordenador de Controladoria Jurídica',
    category: 'SOFTWARE JURÍDICO SOB MEDIDA',
    rating: 5,
    review:
      'No Direito, perder um prazo é inadmissível. O software que o Thiago construiu trouxe tranquilidade absoluta para a nossa banca. Interface limpa, alertas inteligentes e zero falhas operacionais.',
    metricHighlight: 'Zero falhas operacionais',
    tagColor: '#0096F5',
    logoText: 'PG',
    logoImage: '/assets/testimonials/prazoguard_logo.png',
    logoBg: 'bg-white',
  },
  {
    id: 'rev-nexus',
    projectName: 'Nexus Capital Advisors',
    clientName: 'Felipe D’Ávila',
    clientRole: 'Managing Partner',
    category: 'SISTEMAS FINANCEIROS & DASHBOARDS',
    rating: 5,
    review:
      'Os dashboards em tempo real desenvolvidos pela TCAI transformaram a forma como acompanhamos ativos e reportamos aos investidores. Velocidade extrema, segurança de dados e clareza visual de altíssimo padrão.',
    metricHighlight: 'Telemetria em tempo real',
    tagColor: '#8B5CF6',
    logoText: 'NC',
    logoImage: '/assets/testimonials/nexus_capital_logo.png',
    logoBg: 'bg-white',
  },
  {
    id: 'rev-mariana',
    projectName: 'Mariana Bittencourt Advocacia',
    clientName: 'Dra. Mariana Bittencourt',
    clientRole: 'Advogada & Consultora Empresarial',
    category: 'LANDING PAGE DE ALTA CONVERSÃO',
    rating: 5,
    review:
      'A landing page passa exatamente o posicionamento executivo que meus clientes empresariais exigem. O Thiago pensou na estrutura persuasiva, velocidade de abertura e design. A taxa de conversão é excelente.',
    metricHighlight: 'Alta conversão corporativa',
    tagColor: '#EC4899',
    logoText: 'MB',
    logoImage: '/assets/testimonials/mariana_bittencourt_logo.png',
    logoBg: 'bg-white',
  },
  {
    id: 'rev-lumina',
    projectName: 'Clínica Lumina Odontologia',
    clientName: 'Dr. Henrique Zanetti',
    clientRole: 'Diretor Clínico',
    category: 'PORTAL INSTITUCIONAL & CAPTAÇÃO',
    rating: 5,
    review:
      'Queríamos uma presença online que refletisse a tecnologia de ponta dos nossos tratamentos. O portal ficou moderno, ultra-rápido e com agendamento integrado. O feedback dos pacientes tem sido excepcional.',
    metricHighlight: 'Experiência fluida ao paciente',
    tagColor: '#14B8A6',
    logoText: 'CL',
    logoImage: '/assets/testimonials/clinica_lumina_logo.jpg',
    logoBg: 'bg-white',
  },
];

export const ABOUT_DECORATIVE_ASSETS: DecorativeAsset[] = [
  {
    id: 'moon-icon',
    title: 'Moon Icon',
    src: '/assets/3d/moon_icon.png',
    alt: '3D Smiley Icon',
    widthClasses: 'w-[120px] sm:w-[160px] md:w-[210px]',
    positionClasses: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%]',
    delay: 0.1,
    x: -80,
    y: 0,
    duration: 0.9,
  },
  {
    id: 'p59-object',
    title: '3D Object',
    src: '/assets/3d/p59_1.png',
    alt: '3D Geometric Artifact',
    widthClasses: 'w-[100px] sm:w-[140px] md:w-[180px]',
    positionClasses: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]',
    delay: 0.25,
    x: -80,
    y: 0,
    duration: 0.9,
  },
  {
    id: 'lego-icon',
    title: 'Lego Icon',
    src: '/assets/3d/lego_icon.png',
    alt: '3D Lego Artifact',
    widthClasses: 'w-[120px] sm:w-[160px] md:w-[210px]',
    positionClasses: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%]',
    delay: 0.15,
    x: 80,
    y: 0,
    duration: 0.9,
  },
  {
    id: 'group-134',
    title: '3D Group Object',
    src: '/assets/3d/group_134.png',
    alt: '3D Compound Composition',
    widthClasses: 'w-[130px] sm:w-[170px] md:w-[220px]',
    positionClasses: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]',
    delay: 0.3,
    x: 80,
    y: 0,
    duration: 0.9,
  },
];

export const FINAL_CTA_DATA = {
  tagline: 'PRONTO PARA O PRÓXIMO NÍVEL?',
  headline: 'VAMOS CONSTRUIR SEU PROJETO EM TEMPO RECORDE.',
  description:
    'Se você precisa de um Site em 3 dias, uma Automação com IA em 7 dias ou um Software Sob Medida em 10 dias, converse diretamente comigo e receba uma proposta estratégica em menos de 2 horas.',
  primaryButton: 'INICIAR PROJETO NO WHATSAPP →',
  secondaryButton: 'ENVIAR SOLICITAÇÃO POR E-MAIL',
};

export const CONTACT_DATA = {
  heading: 'VAMOS FECHAR UMA PARCERIA DE ALTO IMPACTO?',
  description:
    'Conte seu objetivo, desafio ou ideia. Eu analiso a viabilidade, desenho a melhor arquitetura e entrego com rigor máximo de qualidade.',
  name: 'Thiago Cassol Antunes',
  role: 'Diretor de Tecnologia & Desenvolvedor Estratégico',
};
