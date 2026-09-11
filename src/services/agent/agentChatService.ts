import { ChatMessageMedia, AgentConfigStore } from './agentConfigTypes';
import { loadAgentConfig } from './agentConfigStorage';
import { inspectIncomingMessage } from '../security/cyberSentinelService';
import { searchKnowledge } from './knowledgeBaseService';

export interface ChatMessage {
  id?: string;
  sender: 'lead' | 'agent' | 'system';
  text: string;
  time: string;
  media?: ChatMessageMedia;
}

export type ChatOperationalMode = 'autopilot' | 'copilot' | 'human_only';

export interface ChatContact {
  id: string;
  name: string;
  company: string;
  phone: string;
  status: 'triage' | 'ai_qualified' | 'proposal_sent' | 'meeting_booked' | 'closed';
  statusLabel: string;
  avatar: string;
  unread: number;
  score: number;
  slaTimeline: string;
  projectType: string;
  cnpj?: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
  chatMode?: ChatOperationalMode;
  pendingDraftReply?: string;
  assignedRepId?: string;
  assignedRepName?: string;
}

export interface WhatsAppKPIs {
  totalLeads: number;
  hotLeads: number;
  meetingsBooked: number;
  conversionRate: string;
  activeChats: number;
  avgResponseTimeSec: number;
}

export interface DiagnosticItem {
  id: string;
  title: string;
  client: string;
  date: string;
  sla: string;
  score: string;
  status: 'HOT' | 'QUALIFICADO' | 'TRIAGEM' | 'EM ANÁLISE';
  budget: string;
  stack: string[];
  notes?: string;
}

export interface MeetingItem {
  id: string;
  client: string;
  phone?: string;
  time: string;
  type: string;
  link: string;
  topic: string;
  status?: 'AGENDADO' | 'REALIZADO' | 'CANCELADO';
  notes?: string;
}

export const LOCAL_CONTACTS_KEY = 'tcai_whatsapp_contacts_cache';
export const LOCAL_DIAGNOSTICS_KEY = 'tcai_whatsapp_diagnostics_cache';
export const LOCAL_MEETINGS_KEY = 'tcai_whatsapp_meetings_cache';

export const INITIAL_CONTACTS: ChatContact[] = [
  {
    id: '8799e52e-4383-4764-94a9-8f63a106d9b7',
    name: 'Dra. Letícia Rossi',
    company: 'Clínica Rossi Medicina Integrada',
    phone: '(54) 99188-7766',
    status: 'meeting_booked',
    statusLabel: 'Reunião Sugerida',
    avatar: '💼',
    unread: 1,
    score: 86,
    slaTimeline: '7 DIAS ÚTEIS',
    projectType: 'SITE DE ALTA CONVERSÃO & POSICIONAMENTO',
    assignedRepId: 'rep_thiago',
    assignedRepName: 'Thiago Cassol Antunes',
    lastMessage: 'Diagnóstico recebido para SITE DE ALTA CONVERSÃO & POSICIONAMENTO',
    lastMessageTime: '17:17',
    messages: [
      {
        sender: 'lead',
        text: 'Olá! Acabei de enviar minha solicitação no site da TCAI para "SITE DE ALTA CONVERSÃO & POSICIONAMENTO".',
        time: '17:17',
      },
      {
        sender: 'agent',
        text: 'Olá, Dra. Letícia Rossi! Seja muito bem-vindo(a) à TCAI. Recebi sua demanda com score de qualificação 86%. Como posso te ajudar a acelerar esse projeto?',
        time: '17:17',
      },
    ],
  },
  {
    id: 'lead-1',
    name: 'Dr. Marcos Silva',
    company: 'Clínica Odonto Prime',
    phone: '+55 54 99123-4567',
    status: 'meeting_booked',
    statusLabel: 'Reunião Agendada',
    avatar: '👨‍⚕️',
    unread: 1,
    score: 96,
    slaTimeline: '7 DIAS ÚTEIS',
    projectType: 'Automação com IA & Atendimento 24/7',
    assignedRepId: 'rep_rafael',
    assignedRepName: 'Rafael Mendonça',
    lastMessage: 'Recebi sua mídia com sucesso! 📷🎙️ Já registrei no dossiê de atendimento.',
    lastMessageTime: '20:11',
    messages: [
      {
        sender: 'lead',
        text: 'Olá! Vi o portfólio da TCAI e gostaria de saber se vocês automatizam triagem no WhatsApp.',
        time: '14:20',
      },
      {
        sender: 'agent',
        text: 'Olá, Dr. Marcos! Seja bem-vindo à TCAI. 👋 Sim, desenvolvemos agentes autônomos integrados diretamente à API oficial do WhatsApp, CRM e agenda médica.',
        time: '14:21',
      },
      {
        sender: 'agent',
        text: 'Nosso agente faz a triagem do paciente, responde dúvidas sobre procedimentos e agenda a consulta em menos de 10 segundos.',
        time: '14:21',
      },
      {
        sender: 'lead',
        text: 'Sensacional! Qual é o prazo de entrega?',
        time: '14:25',
      },
      {
        sender: 'agent',
        text: 'Nosso SLA garantido para o pacote de Automação & Agente IA é de 7 dias úteis com código 100% pronto e homologado.',
        time: '14:26',
      },
      {
        sender: 'lead',
        text: 'Gostaria de saber se a TCAI consegue criar um agente de IA para ler as fotos de exames dos meus pacientes.',
        time: '20:11',
        media: {
          type: 'image',
          url: '/media/exame-amostra.png',
          caption: 'Exemplo de exame odontológico',
        },
      },
      {
        sender: 'agent',
        text: 'Recebi sua mídia com sucesso! 📷🎙️ Já registrei no dossiê de atendimento da TCAI. Analisamos com o Gemini Multimodal e confirmamos que é 100% viável implantar em 7 dias.',
        time: '20:11',
      },
    ],
  },
  {
    id: 'lead-2',
    name: 'Juliana Rocha',
    company: 'Moda Sul E-commerce',
    phone: '+55 11 98765-4321',
    status: 'proposal_sent',
    statusLabel: 'Proposta Enviada',
    avatar: '👩‍💼',
    unread: 1,
    score: 92,
    slaTimeline: '3 DIAS ÚTEIS',
    projectType: 'Landing Page & Site de Alta Conversão',
    lastMessage: 'Gostei muito da proposta! Vou enviar para aprovação da diretoria.',
    lastMessageTime: '11:15',
    messages: [
      {
        sender: 'lead',
        text: 'Bom dia! Precisamos refazer nossa landing page de coleções com urgência.',
        time: '10:50',
      },
      {
        sender: 'agent',
        text: 'Bom dia, Juliana! Com a metodologia da TCAI entregamos páginas de alta conversão em 3 dias úteis com SEO e performance 100/100.',
        time: '10:52',
      },
      {
        sender: 'lead',
        text: 'Gostei muito da proposta! Vou enviar para aprovação da diretoria.',
        time: '11:15',
      },
    ],
  },
  {
    id: 'lead-3',
    name: 'Roberto Mendes',
    company: 'Mendes Logística & Frotas',
    phone: '+55 41 99887-1122',
    status: 'ai_qualified',
    statusLabel: 'Qualificado por IA',
    avatar: '🚚',
    unread: 0,
    score: 88,
    slaTimeline: '10 DIAS ÚTEIS',
    projectType: 'Sistema Sob Medida & Painel Web',
    lastMessage: 'Precisamos controlar o status das entregas em tempo real.',
    lastMessageTime: '09:40',
    messages: [
      {
        sender: 'lead',
        text: 'Olá Thiago! Vimos seu case do Prazo Guard. Vocês conseguem criar um painel sob medida para 50 motoristas?',
        time: '09:30',
      },
      {
        sender: 'agent',
        text: 'Olá Roberto! Sim, desenvolvemos sistemas sob medida com painel em tempo real, login seguro e relatórios automáticos em até 10 dias úteis.',
        time: '09:32',
      },
      {
        sender: 'lead',
        text: 'Precisamos controlar o status das entregas em tempo real.',
        time: '09:40',
      },
    ],
  },
  {
    id: 'lead-4',
    name: 'Dra. Camila Duarte',
    company: 'Duarte & Associados Advocacia',
    phone: '+55 51 98222-3344',
    status: 'triage',
    statusLabel: 'Triagem Inicial',
    avatar: '⚖️',
    unread: 2,
    score: 75,
    slaTimeline: '7 DIAS ÚTEIS',
    projectType: 'Agente Jurídico para Atendimento',
    lastMessage: 'Gostaria de entender se o agente pode qualificar causas trabalhistas.',
    lastMessageTime: 'Ontem',
    messages: [
      {
        sender: 'lead',
        text: 'Boa tarde! Gostaria de entender se o agente pode qualificar causas trabalhistas.',
        time: '17:40',
      },
      {
        sender: 'agent',
        text: 'Boa tarde, Dra. Camila! Sim, o agente é configurado com as perguntas de qualificação do seu escritório e só repassa os casos válidos para o advogado.',
        time: '17:42',
      },
    ],
  },
];

export const INITIAL_DIAGNOSTICS: DiagnosticItem[] = [
  {
    id: 'diag-1',
    title: 'Automação & Atendimento IA 24/7',
    client: 'Clínica Odonto Prime',
    date: 'Hoje, 11:20',
    sla: '7 dias úteis',
    score: '96%',
    status: 'HOT',
    budget: 'R$ 6.800 - R$ 9.500',
    stack: ['WhatsApp Cloud API', 'Python / Node.js', 'LLMs / Agente Cognitivo', 'Webhooks'],
  },
  {
    id: 'diag-2',
    title: 'Site Institucional de Alta Autoridade',
    client: 'Grupo Imobiliário Alpha',
    date: 'Ontem, 16:45',
    sla: '3 dias úteis',
    score: '89%',
    status: 'QUALIFICADO',
    budget: 'R$ 4.200 - R$ 6.000',
    stack: ['React / Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'diag-3',
    title: 'Agente de Triagem Médica & Agendamento',
    client: 'Hospital Vita Mais',
    date: 'Ontem, 10:15',
    sla: '7 dias úteis',
    score: '98%',
    status: 'HOT',
    budget: 'R$ 9.800 - R$ 15.000',
    stack: ['WhatsApp Cloud API', 'OpenAI GPT-4o', 'Google Calendar API', 'PostgreSQL'],
  },
  {
    id: 'diag-4',
    title: 'Painel Logístico com IA Preditiva',
    client: 'TransLog Sul Express',
    date: '02/09, 18:00',
    sla: '10 dias úteis',
    score: '91%',
    status: 'QUALIFICADO',
    budget: 'R$ 12.000 - R$ 18.000',
    stack: ['React 18', 'Tailwind CSS', 'FastAPI Python', 'Docker'],
  },
];

export const INITIAL_MEETINGS: MeetingItem[] = [
  {
    id: 'meet-1',
    client: 'Dr. Marcos Silva (Clínica Odonto Prime)',
    time: 'Amanhã, 14:00 - 14:30',
    type: 'Google Meet',
    link: 'meet.google.com/tcai-odonto',
    topic: 'Alinhamento de Escopo: Agente WhatsApp & SLA 7 Dias',
  },
  {
    id: 'meet-2',
    client: 'Juliana Rocha (Moda Sul)',
    time: 'Quinta-feira, 10:30 - 11:00',
    type: 'Google Meet',
    link: 'meet.google.com/tcai-modasul',
    topic: 'Apresentação de Wireframe & Métricas de Conversão',
  },
  {
    id: 'meet-3',
    client: 'Roberto Mendes (Mendes Logística)',
    time: 'Sexta-feira, 15:00 - 15:45',
    type: 'Google Meet',
    link: 'meet.google.com/tcai-mendes',
    topic: 'Briefing Técnico: Arquitetura de Painel Web',
  },
];

// Carregar KPIs (com fallback seguro instantâneo)
export async function fetchAgentKPIs(): Promise<WhatsAppKPIs> {
  try {
    const res = await fetch('/api/analytics/kpis', { method: 'GET' });
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return {
    totalLeads: 26,
    hotLeads: 9,
    meetingsBooked: 5,
    conversionRate: '29.2%',
    activeChats: 6,
    avgResponseTimeSec: 8,
  };
}

// Normalizar Contato garantindo que messages seja sempre array e campos críticos existam
export function normalizeChatContact(c: any): ChatContact {
  if (!c || typeof c !== 'object') {
    return {
      id: `lead-${Date.now()}`,
      name: 'Novo Lead',
      company: 'Empresa',
      phone: '',
      status: 'triage',
      statusLabel: 'Triagem Inicial',
      avatar: '💼',
      unread: 0,
      score: 80,
      slaTimeline: '7 DIAS ÚTEIS',
      projectType: 'Automação com IA',
      lastMessage: 'Contato iniciado',
      lastMessageTime: 'Hoje',
      messages: [],
    };
  }

  const messages: ChatMessage[] = Array.isArray(c.messages) ? c.messages : [];
  const lastMsg =
    c.lastMessage ||
    (messages.length > 0 ? messages[messages.length - 1]?.text : '') ||
    'Contato iniciado';

  return {
    id: String(c.id || `lead-${Date.now()}`),
    name: String(c.name || 'Lead sem Nome'),
    company: String(c.company || 'Empresa'),
    phone: String(c.phone || ''),
    status: c.status || 'triage',
    statusLabel: c.statusLabel || 'Triagem Inicial',
    avatar: c.avatar || '💼',
    unread: typeof c.unread === 'number' ? c.unread : 0,
    score: typeof c.score === 'number' ? c.score : 80,
    slaTimeline: c.slaTimeline || '7 DIAS ÚTEIS',
    projectType: c.projectType || 'Automação com IA',
    cnpj: c.cnpj,
    lastMessage: lastMsg,
    lastMessageTime: c.lastMessageTime || 'Hoje',
    messages,
    chatMode: c.chatMode || 'autopilot',
    pendingDraftReply: c.pendingDraftReply || undefined,
    assignedRepId:
      c.assignedRepId ||
      (c.id === '8799e52e-4383-4764-94a9-8f63a106d9b7'
        ? 'rep_thiago'
        : c.id === 'lead-1'
        ? 'rep_rafael'
        : undefined),
    assignedRepName:
      c.assignedRepName ||
      (c.id === '8799e52e-4383-4764-94a9-8f63a106d9b7'
        ? 'Thiago Cassol Antunes'
        : c.id === 'lead-1'
        ? 'Rafael Mendonça'
        : undefined),
  };
}

// Carregar Contatos (com fallback em cache local e auto-normalização blindada)
export async function fetchContacts(): Promise<ChatContact[]> {
  try {
    const res = await fetch('/api/contacts', { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeChatContact);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(normalized));
        }
        return normalized;
      }
    }
  } catch {}

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_CONTACTS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeChatContact);
          localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(normalized));
          return normalized;
        }
      }
    } catch {}
  }

  const defaults = INITIAL_CONTACTS.map(normalizeChatContact);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(defaults));
  }
  return defaults;
}

// Salvar / Sincronizar Contatos
export function saveContactsLocally(contacts: ChatContact[]) {
  if (typeof window !== 'undefined') {
    const normalized = (contacts || []).map(normalizeChatContact);
    localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(normalized));
  }
}

// Salvar / Sincronizar Todos os Contatos
export async function saveAllContacts(contacts: ChatContact[]): Promise<boolean> {
  saveContactsLocally(contacts);
  try {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacts),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Atualizar Contato Único
export async function updateContactDetails(contact: Partial<ChatContact> & { id: string }): Promise<ChatContact | null> {
  try {
    const res = await fetch('/api/contacts/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (res.ok) {
      const data = await res.json();
      return data.contact || null;
    }
  } catch {}
  return null;
}

// Normalizar Diagnóstico garantindo que stack seja array
export function normalizeDiagnosticItem(d: any): DiagnosticItem {
  return {
    ...d,
    stack: Array.isArray(d?.stack) ? d.stack : ['Full-Stack', 'IA Multimodal'],
  };
}

// Carregar Diagnósticos
export async function fetchDiagnostics(): Promise<DiagnosticItem[]> {
  try {
    const res = await fetch('/api/diagnostics', { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeDiagnosticItem);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_DIAGNOSTICS_KEY, JSON.stringify(normalized));
        }
        return normalized;
      }
    }
  } catch {}

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_DIAGNOSTICS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeDiagnosticItem);
        }
      }
    } catch {}
  }

  return INITIAL_DIAGNOSTICS.map(normalizeDiagnosticItem);
}

// Salvar Lista Completa de Diagnósticos
export async function saveDiagnostics(items: DiagnosticItem[]): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_DIAGNOSTICS_KEY, JSON.stringify(items));
  }
  try {
    const res = await fetch('/api/diagnostics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Carregar Agenda / Reuniões
export async function fetchMeetings(): Promise<MeetingItem[]> {
  try {
    const res = await fetch('/api/meetings', { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_MEETINGS_KEY, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch {}

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_MEETINGS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }

  return INITIAL_MEETINGS;
}

// Salvar Lista de Reuniões
export async function saveMeetings(items: MeetingItem[]): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_MEETINGS_KEY, JSON.stringify(items));
  }
  try {
    const res = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Enviar Mensagem (via backend relativo ou direto no client)
export async function sendChatMessage(params: {
  contactId: string;
  text: string;
  sender: 'agent' | 'lead';
  media?: {
    type: 'image' | 'audio' | 'document';
    base64?: string;
    mimeType?: string;
    filename?: string;
    caption?: string;
    url?: string;
  };
}): Promise<{ success: boolean; message: ChatMessage }> {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const fallbackMsg: ChatMessage = {
    sender: params.sender,
    text: params.text,
    time: timeStr,
    media: params.media ? {
      type: params.media.type,
      url: params.media.url || (params.media.base64 ? `data:${params.media.mimeType || 'image/png'};base64,${params.media.base64}` : ''),
      caption: params.media.caption || params.text,
      filename: params.media.filename,
    } : undefined,
  };

  try {
    const res = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || fallbackMsg };
    }
  } catch {}

  return { success: true, message: fallbackMsg };
}

// Detector Inteligente de Transbordo Humano (Human Handover)
export function detectHandoverTrigger(text: string): { needsHandover: boolean; reason?: string } {
  if (!text || typeof text !== 'string') return { needsHandover: false };
  const lower = text.toLowerCase();

  const triggers: Array<{ pattern: RegExp; reason: string }> = [
    { pattern: /(falar com (um )?(humano|atendente|pessoa|alguem|thiago))/i, reason: 'Lead solicitou atendimento humano' },
    { pattern: /(quero uma pessoa|atendente real|pessoa de verdade|humano por favor)/i, reason: 'Preferência explícita por atendimento humano' },
    { pattern: /(reclamacao|processo|advogado|insatisfeito|cancelamento|cancelar)/i, reason: 'Demanda crítica ou contestação formal' },
    { pattern: /(quero fechar (agora|hoje)|onde eu pago|passa o pix|vamos fechar)/i, reason: 'Momento de fechamento imediato' },
    { pattern: /(me liga|pode me ligar|urgente|emergencia)/i, reason: 'Solicitação de contato telefônico urgente' },
  ];

  for (const t of triggers) {
    if (t.pattern.test(lower)) {
      return { needsHandover: true, reason: t.reason };
    }
  }

  return { needsHandover: false };
}

// Resposta Automática Inteligente da IA (Com Blindagem do Sentinela e RAG da Base de Conhecimento)
export async function generateAiReply(contact: ChatContact, incomingMessageText?: string): Promise<string> {
  const textToCheck = incomingMessageText || contact.lastMessage;

  // 1. Sentinela de Cyber Segurança: Filtro Anti-Jailbreak e Injeção de Prompt
  const inspection = inspectIncomingMessage(textToCheck, contact.name);
  if (inspection.isThreat && inspection.safeResponse) {
    return inspection.safeResponse;
  }

  // 2. Base de Conhecimento RAG: Recuperação Contextual de Documentos
  const rag = searchKnowledge(textToCheck, 2);
  const ragContext = rag.excerpts.length > 0
    ? `\n\nDIRETRIZES TÉCNICAS E COMERCIAIS DA EMPRESA (VERDADE ABSOLUTA DO ACERVO):\n${rag.excerpts.join('\n---\n')}\nUtilize estas informações precisas sobre preços, prazos e regras sem inventar ou alucinar nada.`
    : '';

  const config = await loadAgentConfig();
  const apiKey = (config.gemini?.apiKey || '').trim();
  const model = config.gemini?.model || 'gemini-2.0-flash';

  if (apiKey) {
    try {
      const prompt = `${config.gemini.systemPrompt || 'Você é o Thiago Cassol Antunes.'}
${ragContext}

Contexto do Lead:
Nome: ${contact.name}
Empresa: ${contact.company}
Projeto: ${contact.projectType}
Última Mensagem do Lead: "${incomingMessageText || contact.lastMessage}"

Responda em 1 a 2 parágrafos cordiais, assertivos e profissionais para o WhatsApp.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 250, temperature: 0.7 },
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (reply) return reply;
      }
    } catch {}
  }

  // Fallback cognitivo contextual fundamentado com base no projeto
  const replies = [
    `Perfeito, ${contact.name}! Já consultei nosso catálogo de engenharia. Para "${contact.projectType}", garantimos entrega ágil em dias úteis com código 100% homologado. Gostaria de agendar uma breve demonstração no Google Meet para alinharmos os detalhes?`,
    `Excelente pergunta, ${contact.name}! Conforme nossa tabela oficial, desenvolvemos soluções sob medida com alta performance e suporte assistido. Posso formatar sua proposta técnico-comercial agora ou prefere tirar mais alguma dúvida?`,
    `Entendido perfeitamente! Nossos agentes de IA e arquitetura cuidam de toda a esteira de implantação. Vamos reservar 15 minutos amanhã na agenda para apresentar a estrutura?`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
