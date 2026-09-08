import http from 'http';
import url, { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'whatsapp-conversations.json');
const CONFIG_FILE = path.join(DATA_DIR, 'agent-config.json');
const MEDIA_DIR = path.join(DATA_DIR, 'media');

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

const PORT = parseInt(process.env.AGENT_PORT || '3080', 10);
const FALLBACK_PORT = 3000;

// Estado em memória das conversas e leads para testes locais
const mockState = {
  kpis: {
    totalLeads: 24,
    hotLeads: 7,
    meetingsBooked: 5,
    conversionRate: '29.2%',
    activeChats: 4,
    avgResponseTimeSec: 8,
  },
  contacts: [
    {
      id: 'lead-1',
      name: 'Dr. Marcos Silva',
      company: 'Clínica Odonto Prime',
      phone: '+55 54 99123-4567',
      status: 'meeting_booked',
      statusLabel: 'Reunião Agendada',
      avatar: '👨‍⚕️',
      unread: 0,
      score: 96,
      slaTimeline: '7 DIAS ÚTEIS',
      projectType: 'Automação com IA & Atendimento 24/7',
      lastMessage: 'Perfeito, confirmo a reunião para amanhã às 14h.',
      lastMessageTime: '14:32',
      messages: [
        { sender: 'lead', text: 'Olá! Vi o portfólio da TCAI e gostaria de saber se vocês automatizam triagem no WhatsApp.', time: '14:20' },
        { sender: 'agent', text: 'Olá, Dr. Marcos! Seja bem-vindo à TCAI. 👋 Sim, desenvolvemos agentes autônomos integrados diretamente à API oficial do WhatsApp, CRM e agenda médica.', time: '14:21' },
        { sender: 'agent', text: 'Nosso agente faz a triagem do paciente, responde dúvidas sobre procedimentos e agenda a consulta em menos de 10 segundos.', time: '14:21' },
        { sender: 'lead', text: 'Sensacional! Qual é o prazo de entrega?', time: '14:25' },
        { sender: 'agent', text: 'Nosso SLA garantido para o pacote de Automação & Agente IA é de 7 dias úteis com código 100% pronto e homologado.', time: '14:26' },
        { sender: 'lead', text: 'Perfeito, confirmo a reunião para amanhã às 14h.', time: '14:32' },
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
        { sender: 'lead', text: 'Bom dia! Precisamos refazer nossa landing page de coleções com urgência para a Black Friday.', time: '10:50' },
        { sender: 'agent', text: 'Bom dia, Juliana! Com a metodologia da TCAI entregamos páginas de alta conversão em 3 dias úteis com SEO e performance 100/100.', time: '10:52' },
        { sender: 'lead', text: 'Gostei muito da proposta! Vou enviar para aprovação da diretoria.', time: '11:15' },
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
        { sender: 'lead', text: 'Olá Thiago! Vimos seu case do Prazo Guard. Vocês conseguem criar um painel sob medida para 50 motoristas?', time: '09:30' },
        { sender: 'agent', text: 'Olá Roberto! Sim, desenvolvemos sistemas sob medida com painel em tempo real, login seguro e relatórios automáticos em até 10 dias úteis.', time: '09:32' },
        { sender: 'lead', text: 'Precisamos controlar o status das entregas em tempo real.', time: '09:40' },
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
        { sender: 'lead', text: 'Boa tarde! Gostaria de entender se o agente pode qualificar causas trabalhistas.', time: '17:40' },
        { sender: 'agent', text: 'Boa tarde, Dra. Camila! Sim, o agente é configurado com as perguntas de qualificação do seu escritório e só repassa os casos válidos para o advogado.', time: '17:42' },
      ],
    },
  ],
  diagnostics: [
    {
      id: 'diag-1',
      title: 'Plataforma SaaS Multi-tenant',
      client: 'AgroTech Brasil',
      date: 'Hoje, 14:10',
      sla: '10 a 14 dias',
      score: '94%',
      status: 'HOT',
      budget: 'R$ 14.500 - R$ 22.000',
      stack: ['Next.js / Vite', 'Supabase / PostgreSQL', 'Stripe / Asaas', 'Tailwind CSS'],
    },
    {
      id: 'diag-2',
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
      id: 'diag-3',
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
      id: 'diag-4',
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
      id: 'diag-5',
      title: 'Painel Logístico com IA Preditiva',
      client: 'TransLog Sul Express',
      date: '02/09, 18:00',
      sla: '10 dias úteis',
      score: '91%',
      status: 'QUALIFICADO',
      budget: 'R$ 12.000 - R$ 18.000',
      stack: ['React 18', 'Tailwind CSS', 'FastAPI Python', 'Docker'],
    },
    {
      id: 'diag-6',
      title: 'Funil Automatizado & Esteira de Follow-ups',
      client: 'EducaOnline Cursos',
      date: '01/09, 15:30',
      sla: '5 dias úteis',
      score: '87%',
      status: 'TRIAGEM',
      budget: 'R$ 5.000 - R$ 7.500',
      stack: ['N8N / Webhooks', 'WhatsApp API', 'CRM TCAI', 'Supabase'],
    },
  ],
  meetings: [
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
    {
      id: 'meet-4',
      client: 'Dra. Camila Duarte (Duarte Advocacia)',
      time: 'Sexta-feira, 16:30 - 17:00',
      type: 'Google Meet',
      link: 'meet.google.com/tcai-duarte',
      topic: 'Demonstração: Qualificação Prévia de Clientes no WhatsApp',
    },
    {
      id: 'meet-5',
      client: 'Diretoria Hospital Vita Mais',
      time: 'Segunda-feira, 09:00 - 09:45',
      type: 'Google Meet',
      link: 'meet.google.com/tcai-vitamais',
      topic: 'Kickoff: Implantação de Agente IA na Recepção',
    },
  ],
};

// =====================================================================
// PERSISTÊNCIA EM DISCO E SEGURANÇA
// =====================================================================

function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 3000)
    .trim();
}

function parseJsonBody(req, limitBytes = 15728640) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytes = 0;
    req.on('data', chunk => {
      bytes += chunk.length;
      if (bytes > limitBytes) {
        reject(new Error('Payload Too Large'));
        req.destroy();
        return;
      }
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', err => reject(err));
  });
}

function loadStateFromDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (parsed.kpis && typeof parsed.kpis === 'object') {
          Object.assign(mockState.kpis, parsed.kpis);
        }
        if (Array.isArray(parsed.contacts) && parsed.contacts.length > 0) {
          mockState.contacts = parsed.contacts;
        }
        if (Array.isArray(parsed.diagnostics) && parsed.diagnostics.length > 0) {
          mockState.diagnostics = parsed.diagnostics;
        }
        if (Array.isArray(parsed.meetings) && parsed.meetings.length > 0) {
          mockState.meetings = parsed.meetings;
        }
        console.log(`💾 [TCAI Agent] Dados carregados de ${DATA_FILE} (${mockState.contacts.length} contatos)`);
      }
    } else {
      saveStateToDisk();
    }
  } catch (err) {
    console.warn(`⚠️ [TCAI Agent] Falha ao carregar arquivo de persistência:`, err.message);
  }
}

function saveStateToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(mockState, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`⚠️ [TCAI Agent] Falha ao salvar arquivo de persistência:`, err.message);
  }
}

// Carrega estado persistido
loadStateFromDisk();

// =====================================================================
// CONFIGURAÇÕES DO AGENTE, MOTOR GEMINI & MULTIMODAL
// =====================================================================

const DEFAULT_AGENT_CONFIG = {
  company: {
    companyName: 'TCAI - Thiago Cassol Antunes Inteligência Artificial',
    tradingName: 'TCAI Soluções Inteligentes',
    logoUrl: '/logo_tca.png',
    niche: 'Software Sob Medida, Automação & Agentes Cognitivos de IA',
    description: 'Desenvolvimento ágil de software corporativo, landing pages de alta conversão e agentes autônomos integrados ao WhatsApp com garantia contratual de entrega em até 3, 7 ou 10 dias úteis.',
    services: [
      'Desenvolvimento de Sistemas Web & SaaS',
      'Agentes de Inteligência Artificial para WhatsApp',
      'Landing Pages de Alta Conversão em 3 Dias Úteis',
      'Automação de Processos & Integrações de APIs',
      'Consultoria em Arquitetura de Software & IA',
    ],
    priceRange: 'R$ 3.500 a R$ 25.000',
    contactEmail: 'thiago91cassol@hotmail.com',
    contactPhone: '+55 54 98116-7720',
    businessHours: 'Segunda a Sexta, 08:00 às 19:00',
    location: 'Brasil / Atendimento Remoto Global',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-2.0-flash',
    temperature: 0.4,
    maxOutputTokens: 1024,
    enableMultimodalVision: true,
    enableAudioTranscription: true,
    systemPrompt: `Você é o Agente de Inteligência Artificial Oficial da TCAI (Thiago Cassol Antunes - Soluções em IA & Software)...`,
  },
  whatsapp: {
    provider: 'evolution',
    baseUrl: 'http://localhost:8080',
    apiKey: '',
    instanceId: 'tcai-agent-instance',
    phoneNumber: '+55 54 98116-7720',
    autoReplyEnabled: true,
    outboundDeliveryEnabled: false,
    sendAudioAsVoiceNote: true,
  },
  updatedAt: new Date().toISOString(),
};

function loadAgentConfigFromDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_AGENT_CONFIG,
          ...parsed,
          company: { ...DEFAULT_AGENT_CONFIG.company, ...(parsed.company || {}) },
          gemini: { ...DEFAULT_AGENT_CONFIG.gemini, ...(parsed.gemini || {}) },
          whatsapp: { ...DEFAULT_AGENT_CONFIG.whatsapp, ...(parsed.whatsapp || {}) },
        };
      }
    }
  } catch (err) {
    console.warn(`⚠️ [TCAI Agent] Falha ao carregar config do agente:`, err.message);
  }
  return { ...DEFAULT_AGENT_CONFIG };
}

function saveAgentConfigToDisk(newConfig) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    currentAgentConfig = {
      ...currentAgentConfig,
      ...newConfig,
      company: { ...currentAgentConfig.company, ...(newConfig.company || {}) },
      gemini: { ...currentAgentConfig.gemini, ...(newConfig.gemini || {}) },
      whatsapp: { ...currentAgentConfig.whatsapp, ...(newConfig.whatsapp || {}) },
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(currentAgentConfig, null, 2), 'utf-8');
    return currentAgentConfig;
  } catch (err) {
    console.warn(`⚠️ [TCAI Agent] Falha ao salvar config do agente:`, err.message);
    throw err;
  }
}

let currentAgentConfig = loadAgentConfigFromDisk();

function saveBase64MediaToFile({ base64, mimeType = '', filename = '' }) {
  try {
    const ext = mimeType.includes('png') ? '.png'
      : (mimeType.includes('jpeg') || mimeType.includes('jpg') ? '.jpg'
      : (mimeType.includes('webp') ? '.webp'
      : (mimeType.includes('ogg') ? '.ogg'
      : (mimeType.includes('mp3') ? '.mp3'
      : (mimeType.includes('wav') ? '.wav' : '.bin')))));

    const safeName = `${Date.now()}-${(filename || 'anexo').replace(/[^a-zA-Z0-9_.-]/g, '_')}${ext}`;
    const filePath = path.join(MEDIA_DIR, safeName);
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(filePath, buffer);
    return {
      url: `/media/${safeName}`,
      filePath,
      sizeBytes: buffer.length,
      mimeType,
    };
  } catch (err) {
    console.warn(`⚠️ [TCAI Agent] Falha ao salvar mídia em disco:`, err.message);
    return null;
  }
}

function generateContextualFallbackReply({ text = '', history = [], contact = null, hasMedia = false }) {
  const company = currentAgentConfig.company || {};
  const lower = (text || '').toLowerCase();

  if (hasMedia) {
    return `Recebi sua mídia com sucesso! 📷🎙️ Já registrei no dossiê de atendimento da ${company.tradingName || 'TCAI'}. Posso tirar suas dúvidas sobre nossos SLAs de 3, 7 ou 10 dias úteis, ou prefere agendar uma breve demonstração no Google Meet?`;
  }
  if (lower.includes('preço') || lower.includes('valor') || lower.includes('orçamento') || lower.includes('quanto custa')) {
    return `Nossos projetos têm faixas de investimento a partir de ${company.priceRange || 'R$ 3.500'}, com escopo sob medida e garantia formal em contrato. Posso preparar uma estimativa detalhada para o seu negócio?`;
  }
  if (lower.includes('prazo') || lower.includes('tempo') || lower.includes('dias') || lower.includes('sla')) {
    return `Trabalhamos com garantia de entrega expressa: 3 dias úteis para landing pages e sites de alta conversão, 7 dias úteis para agentes autônomos de IA no WhatsApp, e 10 dias úteis para sistemas corporativos completos.`;
  }
  if (lower.includes('reunião') || lower.includes('agenda') || lower.includes('conversar') || lower.includes('meet') || lower.includes('horário')) {
    return `Perfeito! Temos horários disponíveis no Google Meet para amanhã às 14h ou quinta-feira às 10h30. Qual desses horários é mais conveniente para você?`;
  }
  if (lower.includes('olá') || lower.includes('bom dia') || lower.includes('boa tarde') || lower.includes('boa noite') || lower.includes('oi')) {
    return `Olá! Seja bem-vindo(a) à ${company.tradingName || 'TCAI'}! 👋 Sou o agente inteligente de atendimento. Como posso te auxiliar com soluções em software, inteligência artificial e automação comercial hoje?`;
  }

  return `Entendido! A demanda para ${contact?.projectType || company.niche || 'sua empresa'} é muito promissora. Gostaria de agendar uma breve demonstração técnica de 15 minutos ou prefere receber o resumo de escopo em PDF com SLA garantido?`;
}

async function callGeminiMultimodal({ text = '', history = [], mediaBase64 = null, mediaMimeType = null, contact = null }) {
  const geminiConfig = currentAgentConfig.gemini || {};
  const companyConfig = currentAgentConfig.company || {};
  const apiKey = (geminiConfig.apiKey || '').trim();
  const model = geminiConfig.model || 'gemini-2.0-flash';

  const systemInstructionText = geminiConfig.systemPrompt || `Você é o Agente de Inteligência Artificial Oficial da ${companyConfig.tradingName || 'TCAI'}.
Nicho da Empresa: ${companyConfig.niche || 'Software & IA'}
Descrição: ${companyConfig.description || ''}
Serviços oferecidos: ${(companyConfig.services || []).join(', ')}
Faixa de Investimento: ${companyConfig.priceRange || 'Sob consulta'}
Horário de Atendimento: ${companyConfig.businessHours || 'Segunda a Sexta, 08:00 às 19:00'}
Contato: ${companyConfig.contactEmail || ''} / ${companyConfig.contactPhone || ''}
Localização: ${companyConfig.location || 'Brasil'}
Instruções:
- Seja ágil, empático, objetivo e focado em qualificação comercial e agendamento de reuniões.
- Se o cliente enviar foto ou áudio, compreenda e comente com riqueza de detalhes técnicos.
- Destaque o SLA garantido em contrato (3, 7 ou 10 dias úteis).`;

  if (!apiKey) {
    console.log(`ℹ️ [Gemini Engine] Chave de API não informada. Utilizando motor cognitivo com simulação contextual.`);
    return generateContextualFallbackReply({ text, history, contact, hasMedia: !!mediaBase64 });
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-6);
      for (const msg of recent) {
        contents.push({
          role: msg.sender === 'agent' ? 'model' : 'user',
          parts: [{ text: msg.text || '' }]
        });
      }
    }

    const currentParts = [];
    if (text) {
      currentParts.push({ text: text });
    }

    if (mediaBase64 && mediaMimeType) {
      currentParts.push({
        inline_data: {
          mime_type: mediaMimeType,
          data: mediaBase64
        }
      });
      if (!text) {
        if (mediaMimeType.startsWith('image/')) {
          currentParts.push({ text: 'O cliente enviou esta imagem pelo WhatsApp. Analise detalhadamente o conteúdo e responda como atendente comercial prestativo da empresa.' });
        } else if (mediaMimeType.startsWith('audio/')) {
          currentParts.push({ text: 'O cliente enviou este áudio de voz pelo WhatsApp. Ouça o áudio com atenção e responda com clareza e presteza.' });
        }
      }
    }

    if (currentParts.length === 0) {
      currentParts.push({ text: 'Olá!' });
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstructionText }]
      },
      contents: contents,
      generationConfig: {
        temperature: typeof geminiConfig.temperature === 'number' ? geminiConfig.temperature : 0.4,
        maxOutputTokens: typeof geminiConfig.maxOutputTokens === 'number' ? geminiConfig.maxOutputTokens : 1024,
      }
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errBody = await response.text();
      console.warn(`⚠️ [Gemini API Error] Status ${response.status}: ${errBody}`);
      return generateContextualFallbackReply({ text, history, contact, hasMedia: !!mediaBase64 });
    }

    const resData = await response.json();
    const candidate = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate && typeof candidate === 'string') {
      return candidate.trim();
    }
  } catch (err) {
    console.warn(`⚠️ [Gemini Engine] Erro na chamada: ${err.message}. Usando motor de contingência.`);
  }

  return generateContextualFallbackReply({ text, history, contact, hasMedia: !!mediaBase64 });
}

async function dispatchOutboundWhatsApp({ toPhone, text, mediaUrl = null, mediaType = 'image' }) {
  const waConfig = currentAgentConfig.whatsapp || {};
  if (!waConfig.outboundDeliveryEnabled) {
    console.log(`ℹ️ [WhatsApp Dispatcher] Outbound desabilitado (modo simulador). Destino: ${toPhone}`);
    return { success: true, dispatched: false, reason: 'Outbound disabled' };
  }

  const cleanPhone = (toPhone || '').replace(/\D/g, '');
  if (!cleanPhone) {
    return { success: false, error: 'Telefone inválido' };
  }

  try {
    if (waConfig.provider === 'evolution') {
      const baseUrl = (waConfig.baseUrl || 'http://localhost:8080').replace(/\/+$/, '');
      const instance = waConfig.instanceId || 'tcai-agent-instance';
      const endpoint = mediaUrl
        ? `${baseUrl}/message/sendMedia/${instance}`
        : `${baseUrl}/message/sendText/${instance}`;

      const headers = {
        'Content-Type': 'application/json',
        'apikey': waConfig.apiKey || ''
      };

      const payload = mediaUrl
        ? {
            number: cleanPhone,
            mediaMessage: {
              mediatype: mediaType === 'audio' ? 'audio' : 'image',
              caption: text || '',
              media: mediaUrl
            }
          }
        : {
            number: cleanPhone,
            textMessage: { text: text }
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      return { success: res.ok, status: res.status };
    }

    if (waConfig.provider === 'zapi') {
      const baseUrl = (waConfig.baseUrl || 'https://api.z-api.io').replace(/\/+$/, '');
      const endpoint = mediaUrl
        ? `${baseUrl}/instances/${waConfig.instanceId}/token/${waConfig.apiKey}/send-image`
        : `${baseUrl}/instances/${waConfig.instanceId}/token/${waConfig.apiKey}/send-text`;

      const payload = mediaUrl
        ? { phone: cleanPhone, image: mediaUrl, caption: text }
        : { phone: cleanPhone, message: text };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { success: res.ok, status: res.status };
    }

    if (waConfig.provider === 'meta') {
      const endpoint = `https://graph.facebook.com/v18.0/${waConfig.instanceId}/messages`;
      const payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: { body: text }
      };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${waConfig.apiKey}`
        },
        body: JSON.stringify(payload)
      });
      return { success: res.ok, status: res.status };
    }
  } catch (err) {
    console.warn(`⚠️ [WhatsApp Outbound Dispatch Error]:`, err.message);
    return { success: false, error: err.message };
  }

  return { success: true, dispatched: false };
}

function renderCockpitHtml() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TCAI — Cockpit WhatsApp & Agente IA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      min-height: 100%;
      margin: 0;
      padding: 0;
      background-color: #060D17;
      color: #F3F5F7;
      font-family: 'Kanit', sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    /* Custom Scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #07111F; }
    ::-webkit-scrollbar-thumb { background: #16273C; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #00D2F6; }

    /* App Header (Standalone) */
    .app-header {
      background: #0A1624;
      border-bottom: 1px solid #16273C;
      padding: 10px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      flex-shrink: 0;
      height: 52px;
    }
    .badge-online {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10B981;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      background: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10B981;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    /* Oculta header duplicado quando dentro de iframe no dashboard */
    body.is-embedded .app-header {
      display: none !important;
    }

    /* Views Containers - Sempre preenchem 100% da altura do iframe */
    .view-content {
      width: 100%;
      height: 100%;
      flex: 1 1 0%;
      min-height: 0;
      display: none;
      overflow: hidden;
    }
    .view-content.active {
      display: flex;
    }

    /* WhatsApp View 3-Column Layout */
    #view-whatsapp {
      width: 100%;
      height: 100%;
      min-height: 0;
      flex: 1 1 0%;
      position: relative;
    }
    .chats-list {
      width: 300px;
      height: 100%;
      min-height: 0;
      background: #07111F;
      border-right: 1px solid #16273C;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow: hidden;
    }
    #chats-container {
      flex: 1 1 0%;
      min-height: 0;
      overflow-y: auto;
    }
    .chat-item {
      padding: 13px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      cursor: pointer;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      transition: all 0.2s;
    }
    .chat-item:hover, .chat-item.active {
      background: rgba(0, 210, 246, 0.08);
      border-left: 3px solid #00D2F6;
    }

    /* Chat Pane */
    .chat-pane {
      flex: 1 1 0%;
      min-width: 0;
      height: 100%;
      min-height: 0;
      background: #050914;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .chat-header {
      padding: 10px 16px;
      background: #07111F;
      border-bottom: 1px solid #16273C;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .chat-messages {
      flex: 1 1 0%;
      min-height: 100px;
      padding: 16px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .bubble {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.5;
      position: relative;
      word-wrap: break-word;
    }
    .bubble-lead {
      align-self: flex-start;
      background: #0A1624;
      border: 1px solid #16273C;
      color: #E2E8F0;
      border-bottom-left-radius: 4px;
    }
    .bubble-agent {
      align-self: flex-end;
      background: linear-gradient(135deg, #004D7A 0%, #002244 100%);
      border: 1px solid rgba(0, 210, 246, 0.4);
      color: #FFFFFF;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 14px rgba(0, 210, 246, 0.15);
    }
    .bubble-time {
      font-size: 10px;
      opacity: 0.6;
      margin-top: 4px;
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Input bar */
    .chat-input-bar {
      padding: 10px 16px;
      background: #0A1624;
      border-top: 1px solid #16273C;
      display: flex;
      gap: 10px;
      align-items: center;
      flex-shrink: 0;
    }
    .chat-input {
      flex: 1;
      background: #050914;
      border: 1px solid #16273C;
      border-radius: 9999px;
      padding: 10px 18px;
      color: white;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }
    .chat-input:focus {
      border-color: #00D2F6;
    }
    .btn-send {
      background: linear-gradient(135deg, #00D2F6, #015EEF);
      color: #050914;
      border: none;
      padding: 9px 18px;
      border-radius: 9999px;
      font-weight: bold;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    /* Lead Dossier Sidebar */
    .details-sidebar {
      width: 300px;
      height: 100%;
      min-height: 0;
      background: #07111F;
      border-left: 1px solid #16273C;
      padding: 18px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex-shrink: 0;
    }

    /* Diagnostics, Kanban & Calendar styling */
    .grid-cards {
      flex: 1 1 0%;
      min-height: 0;
      width: 100%;
      height: 100%;
      padding: 22px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 16px;
      overflow-y: auto;
      align-content: start;
    }
    .card-box {
      background: #0A1624;
      border: 1px solid #16273C;
      border-radius: 16px;
      padding: 18px;
      transition: all 0.25s;
    }
    .card-box:hover {
      border-color: #00D2F6;
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 210, 246, 0.1);
    }

    .kanban-board {
      flex: 1 1 0%;
      min-height: 0;
      width: 100%;
      height: 100%;
      display: flex;
      gap: 16px;
      padding: 20px;
      overflow-x: auto;
      overflow-y: hidden;
      align-items: stretch;
    }
    .kanban-col {
      min-width: 260px;
      max-width: 300px;
      height: 100%;
      min-height: 0;
      background: #07111F;
      border: 1px solid #16273C;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      padding: 14px;
      gap: 12px;
      overflow-y: auto;
    }

    /* Botões responsivos móveis */
    .btn-mobile-back {
      display: none;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #00D2F6;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      flex-shrink: 0;
    }
    .btn-toggle-dossier {
      display: none;
      background: rgba(0, 210, 246, 0.12);
      border: 1px solid rgba(0, 210, 246, 0.3);
      color: #00D2F6;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: bold;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-close-dossier {
      display: none;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #94A3B8;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      align-items: center;
      justify-content: center;
    }

    /* Responsividade para Tablets (até 1024px) */
    @media (max-width: 1024px) {
      .btn-toggle-dossier {
        display: inline-flex;
      }
      .btn-close-dossier {
        display: inline-flex;
      }
      .details-sidebar {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 320px;
        z-index: 50;
        background: #07111F;
        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.85);
        transform: translateX(100%);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .details-sidebar.open {
        transform: translateX(0);
      }
      .chats-list {
        width: 260px;
      }
    }

    /* Responsividade para Smartphones (até 768px) */
    @media (max-width: 768px) {
      .btn-mobile-back {
        display: inline-flex;
      }
      .app-header {
        flex-direction: column;
        align-items: flex-start;
        padding: 8px 12px;
        gap: 6px;
        height: auto;
      }
      .chats-list {
        width: 100%;
        border-right: none;
      }
      .chat-pane {
        width: 100%;
      }
      .details-sidebar {
        width: 100%;
      }

      /* No mobile, alternamos entre lista de chats, conversa ativa e dossiê */
      #view-whatsapp.mobile-mode-chats .chat-pane,
      #view-whatsapp.mobile-mode-chats .details-sidebar {
        display: none !important;
      }
      #view-whatsapp.mobile-mode-chats .chats-list {
        display: flex !important;
      }

      #view-whatsapp.mobile-mode-chat .chats-list,
      #view-whatsapp.mobile-mode-chat .details-sidebar {
        display: none !important;
      }
      #view-whatsapp.mobile-mode-chat .chat-pane {
        display: flex !important;
      }

      #view-whatsapp.mobile-mode-dossier .chats-list,
      #view-whatsapp.mobile-mode-dossier .chat-pane {
        display: none !important;
      }
      #view-whatsapp.mobile-mode-dossier .details-sidebar {
        display: flex !important;
        position: relative;
        transform: none;
        box-shadow: none;
      }

      .bubble {
        max-width: 88%;
      }
      .grid-cards {
        grid-template-columns: 1fr;
        padding: 12px;
        gap: 12px;
      }
      .kanban-board {
        padding: 12px;
        gap: 12px;
      }
      .kanban-col {
        min-width: 82vw;
      }
      .chat-input {
        font-size: 14px;
        padding: 8px 14px;
      }
      .chat-input-bar {
        padding: 8px 10px;
        gap: 6px;
      }
    }

    /* Estilos Multimodais: Imagens, Áudios & Anexos */
    .bubble-img {
      max-width: 240px;
      max-height: 240px;
      width: auto;
      height: auto;
      border-radius: 12px;
      margin-bottom: 6px;
      display: block;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.12);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .bubble-img:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 16px rgba(0, 210, 246, 0.25);
    }
    .bubble-audio-player {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 220px;
      max-width: 280px;
      margin-bottom: 4px;
    }
    .bubble-audio-player audio {
      width: 100%;
      height: 36px;
      border-radius: 8px;
      outline: none;
    }
    .btn-attach {
      background: #07111F;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94A3B8;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .btn-attach:hover {
      background: rgba(0, 210, 246, 0.1);
      border-color: #00D2F6;
      color: #00D2F6;
    }
    .btn-attach.recording {
      background: rgba(244, 63, 94, 0.2);
      border-color: #F43F5E;
      color: #F43F5E;
      animation: pulse 1s infinite;
    }
    .media-preview-bar {
      display: none;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      background: #0A1624;
      border-top: 1px solid #16273C;
    }
    .media-preview-thumbnail {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #00D2F6;
    }
    .media-preview-info {
      flex: 1;
      font-size: 11px;
      color: #00D2F6;
      font-family: 'JetBrains Mono', monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .media-remove-btn {
      background: transparent;
      border: none;
      color: #F43F5E;
      cursor: pointer;
      font-size: 14px;
      padding: 4px;
    }
  </style>
</head>
<body>

  <!-- Top Bar com Perfil da Empresa Customizável -->
  <header class="app-header">
    <div style="display: flex; align-items: center; gap: 12px;">
      <img src="${currentAgentConfig.company.logoUrl || '/logo_tca.png'}" onerror="this.src='/logo_tca.png'" style="width: 34px; height: 34px; border-radius: 8px; object-fit: contain; background: #07111F; border: 1px solid rgba(0,210,246,0.3);" alt="Logo da Empresa" />
      <div>
        <div style="font-weight: 800; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
          ${currentAgentConfig.company.tradingName || 'TCAI Soluções Inteligentes'}
        </div>
        <div style="font-size: 10px; color: #94A3B8; font-family: 'JetBrains Mono', monospace;">
          ${currentAgentConfig.company.niche || 'Software & IA'} • SLA 3/7/10 Dias
        </div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 12px;">
      <div class="badge-online">
        <span class="pulse-dot"></span>
        <span>WHATSAPP (${currentAgentConfig.company.contactPhone || '+55 54 98116-7720'})</span>
      </div>
      <div style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #00D2F6; background: rgba(0, 210, 246, 0.1); border: 1px solid rgba(0, 210, 246, 0.25); padding: 4px 10px; border-radius: 8px;">
        MOTOR: ${currentAgentConfig.gemini.model || 'gemini-2.0-flash'}
      </div>
    </div>
  </header>

  <!-- 1. WhatsApp & Chat View -->
  <div id="view-whatsapp" class="view-content active">
    <!-- Chats Sidebar -->
    <div class="chats-list">
      <div style="padding: 14px 16px; border-bottom: 1px solid #16273C; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px;">
          Conversas Recentes (4)
        </span>
        <span style="font-size: 10px; background: #00D2F6; color: #060D17; padding: 2px 6px; border-radius: 10px; font-weight: bold;">LIVE</span>
      </div>
      <div id="chats-container">
        <!-- Rendered dynamically -->
      </div>
    </div>

    <!-- Active Chat Pane -->
    <div class="chat-pane">
      <div style="padding: 10px 16px; background: #07111F; border-bottom: 1px solid #16273C; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
          <button type="button" class="btn-mobile-back" onclick="mobileShowChats()" title="Voltar para lista de conversas">
            ← Conversas
          </button>
          <span id="active-lead-avatar" style="font-size: 20px; flex-shrink: 0;">👨‍⚕️</span>
          <div style="min-width: 0;">
            <h3 id="active-lead-name" style="font-size: 13px; font-weight: 700; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Dr. Marcos Silva</h3>
            <p id="active-lead-company" style="font-size: 10px; color: #94A3B8; font-family: 'JetBrains Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Clínica Odonto Prime • +55 54 99123-4567</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
          <span style="font-size: 9px; font-family: 'JetBrains Mono', monospace; background: rgba(0,210,246,0.15); color: #00D2F6; border: 1px solid rgba(0,210,246,0.3); padding: 3px 6px; border-radius: 6px; font-weight: bold; white-space: nowrap;">
            🤖 IA GEMINI ATIVA
          </span>
          <button type="button" class="btn-toggle-dossier" onclick="toggleDossier()" title="Ver Dossiê do Lead">
            📋 Dossiê
          </button>
        </div>
      </div>

      <!-- Messages Stream -->
      <div id="messages-stream" class="chat-messages">
        <!-- Rendered dynamically -->
      </div>

      <!-- Quick AI Suggestion Chips -->
      <div style="padding: 8px 16px; background: #07111F; border-top: 1px solid rgba(255,255,255,0.04); display: flex; gap: 8px; overflow-x: auto;">
        <span style="font-size: 10px; color: #00D2F6; font-family: 'JetBrains Mono', monospace; align-self: center; text-transform: uppercase;">Sugestões IA:</span>
        <button onclick="insertSuggestion('Confirmo a reunião para amanhã às 14h via Google Meet. Segue o link: meet.google.com/tcai-odonto')" style="background: rgba(0,210,246,0.1); border: 1px solid rgba(0,210,246,0.25); color: #E2E8F0; font-size: 11px; padding: 4px 10px; border-radius: 9999px; cursor: pointer; white-space: nowrap;">
          📅 Enviar Link do Meet
        </button>
        <button onclick="insertSuggestion('Perfeito! Já preparei a proposta técnica com SLA garantido de 7 dias úteis.')" style="background: rgba(0,210,246,0.1); border: 1px solid rgba(0,210,246,0.25); color: #E2E8F0; font-size: 11px; padding: 4px 10px; border-radius: 9999px; cursor: pointer; white-space: nowrap;">
          📄 Enviar Resumo da Proposta
        </button>
      </div>

      <!-- Preview de Mídia Anexada (Foto ou Áudio) -->
      <div id="media-preview-bar" class="media-preview-bar">
        <img id="media-preview-img" class="media-preview-thumbnail" style="display:none;" />
        <div id="media-preview-audio-icon" style="display:none; font-size: 20px;">🎙️</div>
        <div id="media-preview-text" class="media-preview-info">arquivo.png</div>
        <button type="button" class="media-remove-btn" onclick="clearStagedMedia()" title="Remover anexo">✕</button>
      </div>

      <!-- Message Input Bar Multimodal -->
      <form id="chat-form" class="chat-input-bar" onsubmit="handleSendMessage(event)">
        <!-- Input invisível para fotos e imagens -->
        <input type="file" id="image-file-input" accept="image/*" style="display: none;" onchange="handleImageSelected(event)" />
        <button type="button" class="btn-attach" onclick="document.getElementById('image-file-input').click()" title="Enviar Foto ou Imagem da Empresa">
          📷
        </button>

        <!-- Input invisível para fallback de arquivos de áudio -->
        <input type="file" id="audio-file-input" accept="audio/*" style="display: none;" onchange="handleAudioFileSelected(event)" />
        <button type="button" id="btn-record-audio" class="btn-attach" onclick="toggleAudioRecording()" title="Gravar Áudio de Voz ou Anexar Áudio">
          🎙️
        </button>

        <input id="chat-input-text" class="chat-input" type="text" placeholder="Digite uma mensagem ou comande o Agente IA..." autocomplete="off" />
        <button type="submit" class="btn-send">
          <span>Enviar</span>
          <span>→</span>
        </button>
      </form>
    </div>

    <!-- Lead Details & AI Dossier Sidebar -->
    <div id="details-sidebar" class="details-sidebar">
      <div style="border-bottom: 1px solid #16273C; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div>
          <span style="font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px;">
            Dossiê do Lead & Triagem IA
          </span>
          <h4 id="dossier-name" style="font-size: 15px; font-weight: 800; color: white; margin-top: 4px;">Dr. Marcos Silva</h4>
          <p id="dossier-phone" style="font-size: 11px; color: #00D2F6; font-family: 'JetBrains Mono', monospace;">+55 54 99123-4567</p>
        </div>
        <button type="button" class="btn-close-dossier" onclick="toggleDossier()" title="Fechar Dossiê">✕</button>
      </div>

      <div class="card-box" style="padding: 12px;">
        <div style="font-size: 10px; color: #94A3B8; font-family: 'JetBrains Mono', monospace; text-transform: uppercase;">Maturidade & Score Comercial</div>
        <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 4px;">
          <span id="dossier-score" style="font-size: 24px; font-weight: 900; color: #10B981;">96%</span>
          <span style="font-size: 11px; color: #10B981; font-weight: bold;">🔥 ALTÍSSIMA QUALIFICAÇÃO</span>
        </div>
      </div>

      <div class="card-box" style="padding: 12px; display: flex; flex-direction: column; gap: 6px;">
        <div style="font-size: 10px; color: #94A3B8; font-family: 'JetBrains Mono', monospace; text-transform: uppercase;">Escopo Identificado</div>
        <div id="dossier-project" style="font-size: 12px; font-weight: 700; color: white;">Automação com IA & Atendimento 24/7</div>
        <div style="font-size: 10px; color: #00D2F6; font-family: 'JetBrains Mono', monospace;" id="dossier-sla">SLA Garantido: 7 Dias Úteis</div>
      </div>

      <div class="card-box" style="padding: 12px; display: flex; flex-direction: column; gap: 6px;">
        <div style="font-size: 10px; color: #94A3B8; font-family: 'JetBrains Mono', monospace; text-transform: uppercase;">Empresa & IA Configurada</div>
        <div style="font-size: 12px; font-weight: 700; color: white;">${currentAgentConfig.company.tradingName || 'TCAI Soluções Inteligentes'}</div>
        <div style="font-size: 10px; color: #00D2F6; font-family: 'JetBrains Mono', monospace;">Motor: ${currentAgentConfig.gemini.model} • Visão & Áudio Ativos</div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
        <button onclick="alert('Reunião Google Meet confirmada e sincronizada com a agenda!')" style="width: 100%; padding: 10px; border-radius: 10px; background: rgba(0, 210, 246, 0.15); border: 1px solid #00D2F6; color: #00D2F6; font-weight: bold; font-size: 12px; cursor: pointer;">
          📅 Confirmar na Agenda
        </button>
        <button onclick="alert('Modo humano ativado: respostas do bot pausadas para este contato.')" style="width: 100%; padding: 10px; border-radius: 10px; background: #07111F; border: 1px solid #16273C; color: #94A3B8; font-size: 12px; cursor: pointer;">
          ✋ Pausar Agente IA
        </button>
      </div>
    </div>
  </div>

  <!-- 2. Hub de Diagnósticos View -->
  <div id="view-diagnostics" class="view-content">
    <div class="grid-cards" id="diagnostics-container">
      <!-- Rendered dynamically -->
    </div>
  </div>

  <!-- 3. Pipeline Kanban View -->
  <div id="view-kanban" class="view-content">
    <div class="kanban-board">
      <div class="kanban-col">
        <div style="font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">1. Triagem (2)</div>
        <div class="card-box" style="padding: 12px;">
          <div style="font-weight: 700; font-size: 13px;">Dra. Camila Duarte</div>
          <div style="font-size: 11px; color: #94A3B8;">Duarte Advocacia</div>
          <div style="font-size: 10px; color: #00D2F6; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Automação Jurídica</div>
        </div>
        <div class="card-box" style="padding: 12px;">
          <div style="font-weight: 700; font-size: 13px;">Carla Souza</div>
          <div style="font-size: 11px; color: #94A3B8;">Alpha Seguros</div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Esteira WhatsApp • R$ 5.500</div>
        </div>
      </div>
      <div class="kanban-col">
        <div style="font-size: 11px; font-weight: 800; color: #00D2F6; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">2. Qualificado por IA (2)</div>
        <div class="card-box" style="padding: 12px;">
          <div style="font-weight: 700; font-size: 13px;">Roberto Mendes</div>
          <div style="font-size: 11px; color: #94A3B8;">Mendes Logística</div>
          <div style="font-size: 10px; color: #00D2F6; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Painel Web • R$ 12.000</div>
        </div>
        <div class="card-box" style="padding: 12px;">
          <div style="font-weight: 700; font-size: 13px;">Dr. Fernando Torres</div>
          <div style="font-size: 11px; color: #94A3B8;">Hospital Vita Mais</div>
          <div style="font-size: 10px; color: #00D2F6; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Agente Recepção • R$ 9.800</div>
        </div>
      </div>
      <div class="kanban-col">
        <div style="font-size: 11px; font-weight: 800; color: #10B981; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">3. Reunião Agendada (2)</div>
        <div class="card-box" style="padding: 12px; border-color: rgba(16,185,129,0.4);">
          <div style="font-weight: 700; font-size: 13px;">Dr. Marcos Silva</div>
          <div style="font-size: 11px; color: #94A3B8;">Clínica Odonto Prime</div>
          <div style="font-size: 10px; color: #10B981; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Amanhã 14h • R$ 8.500</div>
        </div>
        <div class="card-box" style="padding: 12px; border-color: rgba(16,185,129,0.4);">
          <div style="font-weight: 700; font-size: 13px;">Vitor Santos</div>
          <div style="font-size: 11px; color: #94A3B8;">Indústria Metaltec</div>
          <div style="font-size: 10px; color: #10B981; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Segunda 09h • R$ 18.000</div>
        </div>
      </div>
      <div class="kanban-col">
        <div style="font-size: 11px; font-weight: 800; color: #F59E0B; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">4. Proposta Enviada (1)</div>
        <div class="card-box" style="padding: 12px;">
          <div style="font-weight: 700; font-size: 13px;">Juliana Rocha</div>
          <div style="font-size: 11px; color: #94A3B8;">Moda Sul E-commerce</div>
          <div style="font-size: 10px; color: #F59E0B; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Landing Page • R$ 4.800</div>
        </div>
      </div>
      <div class="kanban-col">
        <div style="font-size: 11px; font-weight: 800; color: #34D399; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">5. Fechado / Ganho (1)</div>
        <div class="card-box" style="padding: 12px; border-color: rgba(52,211,153,0.5); background: rgba(16,185,129,0.06);">
          <div style="font-weight: 700; font-size: 13px; color: #34D399;">AgroTech Brasil</div>
          <div style="font-size: 11px; color: #94A3B8;">Plataforma SaaS</div>
          <div style="font-size: 10px; color: #34D399; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">FECHADO • R$ 18.500</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. Agenda & Meets View -->
  <div id="view-calendar" class="view-content">
    <div class="grid-cards" id="meetings-container">
      <!-- Rendered dynamically -->
    </div>
  </div>

  <script>
    const data = ${JSON.stringify(mockState)};
    let currentContactId = 'lead-1';

    function renderChats() {
      const container = document.getElementById('chats-container');
      container.innerHTML = data.contacts.map(c => \`
        <div class="chat-item \${c.id === currentContactId ? 'active' : ''}" onclick="selectContact('\${c.id}')">
          <span style="font-size: 22px;">\${c.avatar}</span>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-weight: 700; font-size: 13px; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${c.name}</span>
              <span style="font-size: 10px; color: #94A3B8; font-family: 'JetBrains Mono', monospace;">\${c.lastMessageTime}</span>
            </div>
            <p style="font-size: 11px; color: #94A3B8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">\${c.lastMessage}</p>
            <div style="margin-top: 6px; display: flex; gap: 6px; align-items: center;">
              <span style="font-size: 9px; font-family: 'JetBrains Mono', monospace; padding: 2px 6px; border-radius: 4px; background: rgba(0,210,246,0.1); color: #00D2F6;">
                \${c.statusLabel}
              </span>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function selectContact(id) {
      currentContactId = id;
      const contact = data.contacts.find(c => c.id === id);
      if (!contact) return;

      document.getElementById('active-lead-avatar').innerText = contact.avatar;
      document.getElementById('active-lead-name').innerText = contact.name;
      document.getElementById('active-lead-company').innerText = \`\${contact.company} • \${contact.phone}\`;

      document.getElementById('dossier-name').innerText = contact.name;
      document.getElementById('dossier-phone').innerText = contact.phone;
      document.getElementById('dossier-score').innerText = contact.score + '%';
      document.getElementById('dossier-project').innerText = contact.projectType;
      document.getElementById('dossier-sla').innerText = 'SLA Garantido: ' + contact.slaTimeline;

      renderMessages(contact);
      renderChats();
      if (window.innerWidth <= 768) {
        mobileShowChat();
      }
    }

    function renderMessages(contact) {
      const stream = document.getElementById('messages-stream');
      stream.innerHTML = contact.messages.map(m => {
        let mediaHtml = '';
        if (m.media) {
          if (m.media.type === 'image') {
            mediaHtml = '<img src="' + m.media.url + '" class="bubble-img" alt="' + (m.media.caption || 'Foto enviada') + '" onclick="window.open(this.src)" />';
          } else if (m.media.type === 'audio') {
            mediaHtml = '<div class="bubble-audio-player"><audio controls src="' + m.media.url + '"></audio></div>';
          }
        }
        return '<div class="bubble ' + (m.sender === 'agent' ? 'bubble-agent' : 'bubble-lead') + '">' +
          mediaHtml +
          (m.text ? '<div>' + m.text + '</div>' : '') +
          '<div class="bubble-time">' + m.time + (m.sender === 'agent' ? ' ✓✓' : '') + '</div>' +
        '</div>';
      }).join('');
      stream.scrollTop = stream.scrollHeight;
    }

    function renderDiagnostics() {
      const container = document.getElementById('diagnostics-container');
      container.innerHTML = data.diagnostics.map(d => '<div class="card-box">' +
        '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">' +
          '<span style="font-size: 10px; font-family: monospace; background: rgba(0,210,246,0.15); color: #00D2F6; padding: 3px 8px; border-radius: 6px; font-weight: bold;">' +
            d.status + ' • SCORE ' + d.score +
          '</span>' +
          '<span style="font-size: 11px; color: #94A3B8; font-family: monospace;">' + d.date + '</span>' +
        '</div>' +
        '<h3 style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 4px;">' + d.title + '</h3>' +
        '<p style="font-size: 12px; color: #94A3B8; margin-bottom: 12px;">Cliente: <strong style="color: white;">' + d.client + '</strong></p>' +
        '<div style="padding: 10px; background: #07111F; border-radius: 10px; margin-bottom: 12px;">' +
          '<div style="font-size: 11px; color: #10B981; font-weight: bold;">Faixa Orçamentária: ' + d.budget + '</div>' +
          '<div style="font-size: 11px; color: #00D2F6; font-family: monospace; margin-top: 2px;">Prazo Estimado: ' + d.sla + '</div>' +
        '</div>' +
        '<div style="display: flex; flex-wrap: wrap; gap: 6px;">' +
          d.stack.map(s => '<span style="font-size: 10px; font-family: monospace; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: #CBD5E1;">' + s + '</span>').join('') +
        '</div>' +
      '</div>').join('');
    }

    function renderMeetings() {
      const container = document.getElementById('meetings-container');
      container.innerHTML = data.meetings.map(m => '<div class="card-box">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">' +
          '<span style="font-size: 11px; font-weight: bold; color: #10B981; font-family: monospace;">' + m.time + '</span>' +
          '<span style="font-size: 10px; background: rgba(16,185,129,0.1); color: #10B981; border: 1px solid rgba(16,185,129,0.3); padding: 2px 8px; border-radius: 6px;">AGENDADO</span>' +
        '</div>' +
        '<h3 style="font-size: 15px; font-weight: 800; color: white; margin-bottom: 4px;">' + m.client + '</h3>' +
        '<p style="font-size: 12px; color: #94A3B8; margin-bottom: 12px;">' + m.topic + '</p>' +
        '<a href="https://' + m.link + '" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none; font-size: 11px; font-family: monospace; color: #00D2F6; background: rgba(0,210,246,0.1); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(0,210,246,0.3);">' +
          '<span>Entrar no Meet</span> →' +
        '</a>' +
      '</div>').join('');
    }

    function insertSuggestion(text) {
      document.getElementById('chat-input-text').value = text;
      document.getElementById('chat-input-text').focus();
    }

    // Gerenciador de Mídias (Fotos e Áudios)
    let stagedMedia = null;
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecordingAudio = false;

    function handleImageSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        const fullBase64 = evt.target.result;
        const pureBase64 = fullBase64.split(',')[1];
        stagedMedia = {
          type: 'image',
          base64: pureBase64,
          mimeType: file.type || 'image/png',
          filename: file.name,
          previewUrl: fullBase64,
        };

        const previewBar = document.getElementById('media-preview-bar');
        const previewImg = document.getElementById('media-preview-img');
        const previewAudioIcon = document.getElementById('media-preview-audio-icon');
        const previewText = document.getElementById('media-preview-text');

        previewImg.src = fullBase64;
        previewImg.style.display = 'block';
        previewAudioIcon.style.display = 'none';
        previewText.innerText = '📷 Foto: ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
        previewBar.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    }

    function handleAudioFileSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        const fullBase64 = evt.target.result;
        const pureBase64 = fullBase64.split(',')[1];
        stagedMedia = {
          type: 'audio',
          base64: pureBase64,
          mimeType: file.type || 'audio/mp3',
          filename: file.name,
          previewUrl: fullBase64,
        };

        const previewBar = document.getElementById('media-preview-bar');
        const previewImg = document.getElementById('media-preview-img');
        const previewAudioIcon = document.getElementById('media-preview-audio-icon');
        const previewText = document.getElementById('media-preview-text');

        previewImg.style.display = 'none';
        previewAudioIcon.style.display = 'block';
        previewText.innerText = '🎙️ Áudio: ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
        previewBar.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    }

    async function toggleAudioRecording() {
      const btn = document.getElementById('btn-record-audio');
      if (isRecordingAudio) {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        isRecordingAudio = false;
        btn.classList.remove('recording');
        btn.innerHTML = '🎙️';
        btn.title = 'Gravar Áudio de Voz ou Anexar Áudio';
      } else {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => {
              if (e.data.size > 0) audioChunks.push(e.data);
            };
            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
              const reader = new FileReader();
              reader.onloadend = () => {
                const fullBase64 = reader.result;
                const pureBase64 = fullBase64.split(',')[1];
                stagedMedia = {
                  type: 'audio',
                  base64: pureBase64,
                  mimeType: 'audio/ogg',
                  filename: 'voz-' + Date.now() + '.ogg',
                  previewUrl: fullBase64,
                };

                const previewBar = document.getElementById('media-preview-bar');
                const previewImg = document.getElementById('media-preview-img');
                const previewAudioIcon = document.getElementById('media-preview-audio-icon');
                const previewText = document.getElementById('media-preview-text');

                previewImg.style.display = 'none';
                previewAudioIcon.style.display = 'block';
                previewText.innerText = '🎙️ Mensagem de Voz Gravada (' + Math.round(audioBlob.size / 1024) + ' KB)';
                previewBar.style.display = 'flex';
              };
              reader.readAsDataURL(audioBlob);
              stream.getTracks().forEach(t => t.stop());
            };

            mediaRecorder.start();
            isRecordingAudio = true;
            btn.classList.add('recording');
            btn.innerHTML = '⏹️';
            btn.title = 'Clique para finalizar a gravação de áudio';
          } catch (err) {
            console.warn('Microfone indisponível ou permissão não concedida:', err.message);
            document.getElementById('audio-file-input').click();
          }
        } else {
          document.getElementById('audio-file-input').click();
        }
      }
    }

    function clearStagedMedia() {
      stagedMedia = null;
      document.getElementById('media-preview-bar').style.display = 'none';
      document.getElementById('image-file-input').value = '';
      document.getElementById('audio-file-input').value = '';
    }

    async function handleSendMessage(e) {
      e.preventDefault();
      const input = document.getElementById('chat-input-text');
      const text = input.value.trim();
      const mediaToSend = stagedMedia;

      if (!text && !mediaToSend) return;

      const contact = data.contacts.find(c => c.id === currentContactId);
      if (!contact) return;

      const now = new Date();
      const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      const clientMsg = {
        sender: 'agent',
        text,
        time: timeStr,
        media: mediaToSend ? {
          type: mediaToSend.type,
          url: mediaToSend.previewUrl,
          caption: text
        } : undefined
      };

      contact.messages.push(clientMsg);
      contact.lastMessage = text || (mediaToSend.type === 'audio' ? '🎙️ Mensagem de voz' : '📷 Foto enviada');
      contact.lastMessageTime = timeStr;
      input.value = '';
      clearStagedMedia();

      renderMessages(contact);
      renderChats();

      // Sincroniza envio com o backend
      try {
        fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contactId: currentContactId,
            text,
            sender: 'agent',
            media: mediaToSend ? {
              type: mediaToSend.type,
              base64: mediaToSend.base64,
              mimeType: mediaToSend.mimeType,
              filename: mediaToSend.filename,
              caption: text
            } : undefined
          })
        }).catch(err => console.warn('Erro ao sincronizar mensagem:', err));
      } catch (err) {}

      // Simula resposta automática inteligente do lead após 1.5s
      setTimeout(() => {
        const replies = [
          'Entendido! Já visualizei o material e vou repassar para a diretoria.',
          'Excelente! Já deixei a reunião anotada na minha agenda.',
          'Ótimo Thiago, confirmo o recebimento do projeto.',
          'Perfeito, muito obrigado pelo atendimento ágil!'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        contact.messages.push({ sender: 'lead', text: randomReply, time: timeStr });
        contact.lastMessage = randomReply;
        renderMessages(contact);
        renderChats();

        fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contactId: currentContactId, text: randomReply, sender: 'lead' })
        }).catch(() => {});
      }, 1500);
    }

    // Sincronização periódica de novos contatos / leads vindos do CRM ou formulário
    async function syncLatestFromApi() {
      try {
        const res = await fetch('/api/contacts');
        if (res.ok) {
          const freshContacts = await res.json();
          if (Array.isArray(freshContacts) && freshContacts.length > 0) {
            const hasChanged = freshContacts.length !== data.contacts.length ||
              (freshContacts[0] && freshContacts[0].id !== data.contacts[0]?.id) ||
              (freshContacts[0] && freshContacts[0].lastMessage !== data.contacts[0]?.lastMessage);
            if (hasChanged) {
              data.contacts = freshContacts;
              renderChats();
              const curr = data.contacts.find(c => c.id === currentContactId);
              if (curr) renderMessages(curr);
            }
          }
        }
      } catch {}
    }
    setInterval(syncLatestFromApi, 4000);

    // Escuta comandos de troca de aba enviados pelo Dashboard pai via postMessage
    window.addEventListener('message', (e) => {
      if (!e.data) return;
      const view = e.data.view || e.data.tab;
      if (e.data.action === 'switchView' || e.data.type === 'SWITCH_VIEW' || (view && typeof view === 'string')) {
        switchView(view);
      }
    });

    function switchView(viewName) {
      if (!viewName) return;
      const map = {
        'whatsapp': 'whatsapp',
        'chat': 'whatsapp',
        'diagnosticos': 'diagnostics',
        'diagnostics': 'diagnostics',
        'kanban': 'kanban',
        'pipeline': 'kanban',
        'agenda': 'calendar',
        'calendar': 'calendar',
        'meets': 'calendar'
      };
      const resolved = map[String(viewName).toLowerCase()] || viewName;
      document.querySelectorAll('.view-content').forEach(el => el.classList.remove('active'));
      const target = document.getElementById('view-' + resolved);
      if (target) {
        target.classList.add('active');
      }
    }

    // Controle de Navegação Responsiva no Mobile e Drawer de Dossiê no Tablet
    let currentMobileView = 'chat'; // 'chats' | 'chat' | 'dossier'

    function updateMobileClasses() {
      const container = document.getElementById('view-whatsapp');
      if (!container) return;
      container.classList.remove('mobile-mode-chats', 'mobile-mode-chat', 'mobile-mode-dossier');
      if (window.innerWidth <= 768) {
        container.classList.add('mobile-mode-' + currentMobileView);
      }
    }

    function mobileShowChats() {
      currentMobileView = 'chats';
      updateMobileClasses();
    }

    function mobileShowChat() {
      currentMobileView = 'chat';
      updateMobileClasses();
      const sidebar = document.getElementById('details-sidebar');
      if (sidebar) sidebar.classList.remove('open');
    }

    function mobileShowDossier() {
      currentMobileView = 'dossier';
      updateMobileClasses();
    }

    function toggleDossier() {
      if (window.innerWidth <= 768) {
        if (currentMobileView === 'dossier') {
          mobileShowChat();
        } else {
          mobileShowDossier();
        }
      } else {
        const sidebar = document.getElementById('details-sidebar');
        if (sidebar) {
          sidebar.classList.toggle('open');
        }
      }
    }

    window.addEventListener('resize', updateMobileClasses);

    // Detecção de modo embutido em iframe para remover cabeçalhos duplicados
    if (window.self !== window.top || window.location.search.includes('embedded=true')) {
      document.body.classList.add('is-embedded');
    }

    // Inicialização
    const initialId = (data.contacts && data.contacts.length > 0) ? data.contacts[0].id : 'lead-1';
    selectContact(initialId);
    renderChats();
    updateMobileClasses();
    renderDiagnostics();
    renderMeetings();
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers para suportar iframe e fetch de qualquer porta local (5173, 4173, etc.)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 1. Servir arquivos de mídia estáticos enviados pelo WhatsApp ou Cockpit
  if (pathname.startsWith('/media/')) {
    const filename = path.basename(pathname);
    const filePath = path.join(MEDIA_DIR, filename);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.ogg': 'audio/ogg',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.pdf': 'application/pdf',
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // 1.1 Servir arquivos estáticos do diretório public se solicitados
  const publicFilePath = path.join(__dirname, '..', 'public', pathname.replace(/^\//, ''));
  if (pathname !== '/' && fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
    const ext = path.extname(publicFilePath).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.json': 'application/json',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' });
    fs.createReadStream(publicFilePath).pipe(res);
    return;
  }

  // 2. Configurações do Agente, Gemini e WhatsApp
  if (pathname === '/api/agent/config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(currentAgentConfig));
    return;
  }

  if (pathname === '/api/agent/config' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const updated = saveAgentConfigToDisk(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, config: updated }));
      return;
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // 3. Teste Live de Chave de API do Google Gemini
  if (pathname === '/api/agent/test-gemini' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const apiKey = (body.apiKey || currentAgentConfig.gemini.apiKey || '').trim();
      const model = body.model || currentAgentConfig.gemini.model || 'gemini-2.0-flash';

      if (!apiKey) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Chave de API do Gemini não informada.' }));
        return;
      }

      const start = Date.now();
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
      const testPayload = {
        contents: [{ role: 'user', parts: [{ text: 'Responda exatamente com uma palavra: OPERACIONAL' }] }],
        generationConfig: { maxOutputTokens: 10 }
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const testRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
        signal: controller.signal
      });
      clearTimeout(timeout);

      const latencyMs = Date.now() - start;

      if (!testRes.ok) {
        const errText = await testRes.text();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: `Gemini API HTTP ${testRes.status}: ${errText.slice(0, 300)}` }));
        return;
      }

      const testData = await testRes.json();
      const reply = testData?.candidates?.[0]?.content?.parts?.[0]?.text || 'OPERACIONAL';

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Conexão validada com sucesso via ${model}! Resposta do motor: "${reply.trim()}"`,
        latencyMs
      }));
      return;
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // 4. Upload de Mídia (Imagens e Áudios de Voz)
  if (pathname === '/api/media/upload' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      if (!body.base64) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Dados base64 ausentes' }));
        return;
      }
      const saved = saveBase64MediaToFile({
        base64: body.base64,
        mimeType: body.mimeType || 'application/octet-stream',
        filename: body.filename || 'anexo'
      });
      if (!saved) {
        throw new Error('Falha ao gravar arquivo de mídia no servidor.');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        url: saved.url,
        mimeType: saved.mimeType,
        sizeBytes: saved.sizeBytes,
        caption: sanitizeText(body.caption || '')
      }));
      return;
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // 5. Endpoint de telemetria / KPIs consultado pelo DashboardLayout / WhatsAppAgentView
  if (pathname === '/api/analytics/kpis' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockState.kpis));
    return;
  }

  // 6. Endpoint de status operacional
  if ((pathname === '/api/status' || pathname === '/api/health') && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      online: true,
      whatsappConnected: true,
      phoneNumber: currentAgentConfig.company.contactPhone || '+55 (54) 98116-7720',
      company: currentAgentConfig.company.tradingName || 'TCAI',
      model: currentAgentConfig.gemini.model,
      agentVersion: '3.0.0-multimodal',
      uptimeSec: Math.round(process.uptime()),
    }));
    return;
  }

  // 7. Endpoint de contatos e conversas ativas
  if (pathname === '/api/contacts' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockState.contacts));
    return;
  }

  // 8. Endpoint de diagnósticos
  if (pathname === '/api/diagnostics' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockState.diagnostics));
    return;
  }

  // 9. Endpoint de reuniões agendadas
  if (pathname === '/api/meetings' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockState.meetings));
    return;
  }

  // 10. Endpoint de ingestão de leads reais (vindo do diagnóstico do site ou modal de contato)
  if (pathname === '/api/leads' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const contactId = body.id || `lead-${Date.now()}`;
      const contactName = sanitizeText(body.name) || 'Novo Lead';
      const contactCompany = sanitizeText(body.company) || 'Empresa Privada';
      const contactPhone = sanitizeText(body.whatsapp) || currentAgentConfig.company.contactPhone || '+55 (54) 98116-7720';
      const scoreVal = typeof body.score === 'number' ? body.score : 85;
      const projectType = sanitizeText(body.solution) || sanitizeText(body.dealTitle) || 'Consultoria & Tecnologia';
      const estimatedVal = typeof body.estimatedValue === 'number' ? body.estimatedValue : 4500;
      const now = new Date();
      const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      let existing = mockState.contacts.find(c => c.id === contactId || (c.phone && c.phone === contactPhone));
      if (existing) {
        existing.name = contactName;
        existing.company = contactCompany;
        existing.projectType = projectType;
        existing.score = scoreVal;
        existing.lastMessageTime = timeStr;
      } else {
        const newContact = {
          id: contactId,
          name: contactName,
          company: contactCompany,
          phone: contactPhone,
          status: scoreVal >= 85 ? 'meeting_booked' : (scoreVal >= 60 ? 'ai_qualified' : 'triage'),
          statusLabel: scoreVal >= 85 ? 'Reunião Sugerida' : (scoreVal >= 60 ? 'Qualificado por IA' : 'Triagem Inicial'),
          avatar: '💼',
          unread: 1,
          score: scoreVal,
          slaTimeline: '7 DIAS ÚTEIS',
          projectType: projectType,
          lastMessage: `Diagnóstico recebido para ${projectType}`,
          lastMessageTime: timeStr,
          messages: [
            { sender: 'lead', text: `Olá! Acabei de enviar minha solicitação no site da ${currentAgentConfig.company.tradingName || 'TCAI'} para "${projectType}".`, time: timeStr },
            { sender: 'agent', text: `Olá, ${contactName}! Seja muito bem-vindo(a) à ${currentAgentConfig.company.tradingName || 'TCAI'}. Recebi sua demanda com score de qualificação ${scoreVal}%. Como posso te ajudar a acelerar esse projeto?`, time: timeStr },
          ],
        };
        mockState.contacts.unshift(newContact);

        // Atualiza métricas
        mockState.kpis.totalLeads = (mockState.kpis.totalLeads || 0) + 1;
        if (scoreVal >= 85) {
          mockState.kpis.hotLeads = (mockState.kpis.hotLeads || 0) + 1;
        }
        mockState.kpis.activeChats = (mockState.kpis.activeChats || 0) + 1;

        // Adiciona diagnóstico
        mockState.diagnostics.unshift({
          id: `diag-${Date.now()}`,
          title: projectType,
          client: `${contactName} (${contactCompany})`,
          date: 'Hoje, ' + timeStr,
          sla: '7 dias úteis',
          score: `${scoreVal}%`,
          status: scoreVal >= 85 ? 'HOT' : 'QUALIFICADO',
          budget: `R$ ${estimatedVal.toLocaleString('pt-BR')}`,
          stack: ['React / Vite', 'Supabase PostgreSQL', 'IA Cognitiva Gemini', 'WhatsApp Cloud API'],
        });
      }

      saveStateToDisk();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, contactId }));
      return;
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao processar lead', details: err.message }));
      return;
    }
  }

  // 11. Endpoint de envio/registro de mensagens em tempo real com Suporte Multimodal
  if (pathname === '/api/messages/send' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const contactId = body.contactId;
      const text = sanitizeText(body.text || '');
      const sender = body.sender === 'lead' ? 'lead' : 'agent';

      if (!contactId || (!text && !body.media)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'contactId e text ou media são obrigatórios' }));
        return;
      }

      const contact = mockState.contacts.find(c => c.id === contactId);
      if (!contact) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Contato não encontrado' }));
        return;
      }

      let mediaObj = null;
      if (body.media) {
        let mediaUrl = body.media.url;
        if (body.media.base64 && !mediaUrl) {
          const saved = saveBase64MediaToFile({
            base64: body.media.base64,
            mimeType: body.media.mimeType || '',
            filename: body.media.filename || 'anexo'
          });
          if (saved) mediaUrl = saved.url;
        }
        mediaObj = {
          type: body.media.type || (body.media.mimeType?.startsWith('audio') ? 'audio' : 'image'),
          url: mediaUrl || '',
          mimeType: body.media.mimeType,
          caption: sanitizeText(body.media.caption || '')
        };
      }

      const now = new Date();
      const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      const msgObj = { sender, text, time: timeStr };
      if (mediaObj) msgObj.media = mediaObj;

      contact.messages.push(msgObj);
      contact.lastMessage = text || (mediaObj?.type === 'audio' ? '🎙️ Mensagem de voz' : '📷 Foto enviada');
      contact.lastMessageTime = timeStr;

      let agentReplyMsg = null;

      // Se a mensagem for do lead, o Agente de IA responde autonomamente
      if (sender === 'lead') {
        const replyText = await callGeminiMultimodal({
          text,
          history: contact.messages,
          mediaBase64: body.media?.base64 || null,
          mediaMimeType: body.media?.mimeType || null,
          contact
        });

        agentReplyMsg = {
          sender: 'agent',
          text: replyText,
          time: timeStr
        };
        contact.messages.push(agentReplyMsg);
        contact.lastMessage = replyText;
        contact.unread = (contact.unread || 0) + 1;

        // Disparo WhatsApp Externo se ativado
        dispatchOutboundWhatsApp({
          toPhone: contact.phone,
          text: replyText
        }).catch(err => console.warn('Outbound dispatch error:', err.message));
      } else {
        // Envio do operador para o WhatsApp externo
        dispatchOutboundWhatsApp({
          toPhone: contact.phone,
          text: text,
          mediaUrl: mediaObj?.url,
          mediaType: mediaObj?.type
        }).catch(err => console.warn('Outbound dispatch error:', err.message));
      }

      saveStateToDisk();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: msgObj, agentReply: agentReplyMsg }));
      return;
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Falha ao processar mensagem', details: err.message }));
      return;
    }
  }

  // 12. Webhook aberto para WhatsApp Cloud API / Z-API / Evolution
  if (pathname === '/api/webhook/whatsapp' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const incomingPhone = sanitizeText(body.phone || body.from || body.sender || '');
      const incomingText = sanitizeText(body.text || body.message || body.body || '');
      const incomingName = sanitizeText(body.name || body.pushName || 'Lead WhatsApp');

      if (incomingText || body.media) {
        let contact = mockState.contacts.find(c => c.phone && incomingPhone && c.phone.includes(incomingPhone.replace(/\D/g, '')));
        const now = new Date();
        const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

        let mediaObj = null;
        if (body.media && body.media.base64) {
          const saved = saveBase64MediaToFile({
            base64: body.media.base64,
            mimeType: body.media.mimeType,
            filename: body.media.filename || 'anexo'
          });
          if (saved) {
            mediaObj = {
              type: body.media.type || (saved.mimeType.startsWith('audio') ? 'audio' : 'image'),
              url: saved.url,
              mimeType: saved.mimeType,
            };
          }
        }

        const leadMsg = {
          sender: 'lead',
          text: incomingText,
          time: timeStr,
          ...(mediaObj ? { media: mediaObj } : {})
        };

        if (!contact) {
          contact = {
            id: `lead-wa-${Date.now()}`,
            name: incomingName,
            company: 'WhatsApp Direto',
            phone: incomingPhone || currentAgentConfig.company.contactPhone || '+55 (54) 99999-9999',
            status: 'triage',
            statusLabel: 'Triagem Inicial',
            avatar: '💬',
            unread: 1,
            score: 75,
            slaTimeline: '7 DIAS ÚTEIS',
            projectType: 'Atendimento WhatsApp',
            lastMessage: incomingText || 'Mídia recebida',
            lastMessageTime: timeStr,
            messages: [leadMsg],
          };
          mockState.contacts.unshift(contact);
          mockState.kpis.activeChats = (mockState.kpis.activeChats || 0) + 1;
        } else {
          contact.messages.push(leadMsg);
          contact.lastMessage = incomingText || 'Mídia recebida';
          contact.lastMessageTime = timeStr;
          contact.unread = (contact.unread || 0) + 1;
        }

        // Se auto-resposta estiver habilitada, aciona Gemini e envia retorno
        if (currentAgentConfig.whatsapp.autoReplyEnabled) {
          const replyText = await callGeminiMultimodal({
            text: incomingText,
            history: contact.messages,
            mediaBase64: body.media?.base64 || null,
            mediaMimeType: body.media?.mimeType || null,
            contact
          });

          contact.messages.push({
            sender: 'agent',
            text: replyText,
            time: timeStr
          });
          contact.lastMessage = replyText;

          dispatchOutboundWhatsApp({
            toPhone: contact.phone,
            text: replyText
          }).catch(() => {});
        }

        saveStateToDisk();
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, processed: true }));
      return;
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // 13. Servir a interface visual do Cockpit do Agente de WhatsApp
  if (pathname === '/' || pathname === '/index.html' || pathname === '/whatsapp') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderCockpitHtml());
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint não encontrado', path: pathname }));
});

function startServer(portToUse) {
  server.listen(portToUse, () => {
    console.log(`\n============================================================`);
    console.log(`🚀 [TCAI WhatsApp Agent Server] ONLINE na porta ${portToUse}`);
    console.log(`   URL do Cockpit: http://localhost:${portToUse}`);
    console.log(`   Endpoint KPIs:  http://localhost:${portToUse}/api/analytics/kpis`);
    console.log(`============================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && portToUse === PORT) {
      console.warn(`⚠️ Porta ${PORT} já está em uso. Tentando porta secundária ${FALLBACK_PORT}...`);
      startServer(FALLBACK_PORT);
    } else {
      console.error(`❌ Erro no servidor do agente:`, err.message);
    }
  });
}

startServer(PORT);
