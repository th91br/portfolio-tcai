import { ServiceItem, ProjectItem, DecorativeAsset, ShowcaseCardItem, ReviewCardItem } from '../types';

export const REVIEWS_HEADER = {
  pill: 'AVALIAÇÕES 5.0 ★ • RESULTADOS REAIS',
  headline: 'QUEM CONFIA NA TCAI PARA CONSTRUIR O PRÓXIMO NÍVEL DO SEU NEGÓCIO',
  tagline: 'Depoimentos de fundadores, diretores e profissionais que escalaram suas operações com tecnologia sob medida, inteligência e design de alto impacto.',
};

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



// Preserved for any legacy references
export const SHOWCASE_HEADER = {
  pill: REVIEWS_HEADER.pill,
  tagline: REVIEWS_HEADER.tagline,
};
export const SHOWCASE_CARDS_ROW1 = [];
export const SHOWCASE_CARDS_ROW2 = [];
export const MARQUEE_IMAGES: string[] = [];
export const ROW_1_IMAGES: string[] = [];
export const ROW_2_IMAGES: string[] = [];




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

export const HERO_DATA = {
  title: 'OLÁ, EU SOU O THIAGO',
  tagline:
    'TECNOLOGIA COM ESTRATÉGIA. SOLUÇÕES PENSADAS PARA RESOLVER PROBLEMAS E GERAR RESULTADOS.',
  subtext:
    'Sites, software, sistemas e automações desenvolvidos para transformar necessidades reais em soluções digitais.',
  ctaButton: 'VAMOS CRIAR →',
};

export const ABOUT_DATA = {
  heading: 'SOBRE MIM',
  text: 'Sou Thiago Cassol Antunes, tenho 35 anos e sou movido pela curiosidade por tecnologia, inovação e Inteligência Artificial. Há mais de 5 anos estudo, desenvolvo e aplico tecnologia na teoria e na prática, transformando ideias e problemas reais em soluções digitais funcionais. Meu trabalho combina estratégia, agilidade, segurança e experiência do usuário, sempre preservando o branding, a identidade e os objetivos de cada projeto. Não acredito em tecnologia apenas por tecnologia. Acredito em criar aquilo que realmente faz sentido para o negócio.',
  ctaButton: 'FALE COMIGO →',
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'service-1',
    number: '01',
    name: 'SITES PROFISSIONAIS',
    description:
      'Sites modernos, responsivos e estratégicos, desenvolvidos para fortalecer sua presença digital, comunicar autoridade e transformar visitantes em oportunidades.',
  },
  {
    id: 'service-2',
    number: '02',
    name: 'LANDING PAGES',
    description:
      'Páginas planejadas para conversão, combinando estratégia, comunicação e experiência para campanhas, serviços, produtos e geração de leads.',
  },
  {
    id: 'service-3',
    number: '03',
    name: 'SOFTWARE & SISTEMAS',
    description:
      'Sistemas, plataformas e soluções digitais desenvolvidas para organizar operações, reduzir processos manuais e transformar ideias em produtos reais.',
  },
  {
    id: 'service-4',
    number: '04',
    name: 'AUTOMAÇÃO COM IA',
    description:
      'Automação inteligente de processos, operações e atendimentos utilizando Inteligência Artificial para aumentar produtividade, velocidade e capacidade de escala.',
  },
  {
    id: 'service-5',
    number: '05',
    name: 'INTEGRAÇÕES & APIS',
    description:
      'Integrações avançadas entre sistemas legados, gateways de pagamento, CRMs e bancos de dados para operações digitais blindadas e em tempo real.',
  },
  {
    id: 'service-6',
    number: '06',
    name: 'AGENTES AUTÔNOMOS & IA',
    description:
      'Modelagem e implantação de agentes inteligentes com LLMs para triagem estratégica, atendimento 24/7 de alta conversão e automação cognitiva profunda de fluxos de trabalho.',
  },
];

export const PROJECTS_HEADER = {
  title: 'PROJETOS',
  openingHeadline: 'IDEIAS QUE SAÍRAM DO PAPEL.',
  openingDescription:
    'Uma seleção de projetos desenvolvidos para diferentes necessidades, negócios e desafios. Cada solução começa pela compreensão do problema. Depois vêm estratégia, arquitetura, experiência e execução. O resultado precisa ser mais do que bonito. Precisa funcionar.',
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
    col1BottomImage: '/assets/branding/thiago_studio.jpg',
    col2Image: '/assets/branding/thiago_studio.jpg',
    liveUrl: 'https://tcai.com.br/iniciar-projeto',
    description:
      'Transforme sua ideia, operação ou necessidade de mercado em uma solução digital de alto impacto. Desenvolvemos Sites Profissionais, Landing Pages de Alta Conversão, Softwares Sob Medida, SaaS e Automações Inteligentes com IA, com estratégia, código limpo e foco em resultados.',
    year: '2026',
    technologies: [
      'Sites Profissionais',
      'Landing Pages',
      'Softwares Sob Medida',
      'SaaS & Micro SaaS',
      'Automação com IA',
    ],
    ctaButtonLabel: 'VAMOS CRIAR MEU PROJETO →',
  },
];


export const FINAL_CTA_DATA = {
  tagline: 'TEM UMA IDEIA?',
  headline: 'VAMOS TIRAR DO PAPEL.',
  description:
    'Se você precisa de um site, landing page, sistema, software ou automação com Inteligência Artificial, podemos transformar sua necessidade em uma solução digital clara, segura e estratégica.',
  primaryButton: 'QUERO CRIAR MEU PROJETO →',
  secondaryButton: 'VAMOS CONVERSAR →',
};

export const CONTACT_DATA = {
  heading: 'VAMOS CRIAR ALGO QUE FAÇA SENTIDO?',
  description:
    'Conte um pouco sobre sua ideia, problema ou projeto. Eu analiso o cenário e te ajudo a encontrar uma solução digital que combine estratégia, tecnologia e viabilidade.',
  name: 'Thiago Cassol Antunes',
  role: 'Tecnologia • Software • Web • Automação com IA',
};
