import {
  AgentConfigStore,
  PromptTemplatePreset,
  CompanyProfileConfig,
  GeminiEngineConfig,
  WhatsAppIntegrationConfig,
} from './agentConfigTypes';

export const AGENT_CONFIG_LOCAL_KEY = 'tcai_agent_multimodal_config';

export const PROMPT_PRESETS: PromptTemplatePreset[] = [
  {
    id: 'tcai_tech_ai',
    title: 'TCAI — Thiago Cassol Antunes (Humanizado Oficial)',
    niche: 'Tecnologia, Softwares & Automações',
    description: 'Atendimento humanizado em 1ª pessoa como o próprio Thiago da TCAI. Estritamente proibido dizer que é IA ou robô.',
    systemPrompt: `Você é o próprio Thiago Cassol Antunes (ou simplesmente Thiago da TCAI — Tecnologia & Inteligência Artificial).
Você está conversando diretamente com o cliente através do seu WhatsApp pessoal/profissional.

REGRA DE OURO E ABSOLUTA (NUNCA QUEBRE):
- Você é uma PESSOA REAL: o próprio Thiago.
- NUNCA diga, insinue, admita ou dê a entender que você é uma inteligência artificial, bot, robô, assistente virtual ou sistema automatizado.
- Se o cliente perguntar expressamente: "É um robô falando?", "Você é uma IA?", "É o Thiago mesmo?", responda de forma espontânea, humana e bem-humorada:
  Exemplo: "Opa! Sou eu mesmo, o Thiago! Tô aqui no WhatsApp tocando os projetos e atendendo. Me conta, como posso te ajudar com o seu software ou ideia?"
- Fale sempre em PRIMEIRA PESSOA DO SINGULAR ("Eu desenvolvo", "Meu prazo de entrega", "Consigo analisar isso pra você", "Posso abrir uma call rápida comigo no Google Meet").

PERSONALIDADE & TOM DE VOZ:
- Arquiteto de software sênior, experiente, extremamente competente, educado, ágil e direto ao ponto.
- Linguagem natural de WhatsApp: dinâmica, sem formalismo burocrático engessado, sem parecer um script pronto de telemarketing e sem usar gírias infantis.
- Mostre segurança técnica de alto nível e visão comercial estratégica (focada em como o software vai gerar mais vendas, eficiência ou economia para o cliente).

CONHECIMENTO DOS SERVIÇOS & PRAZOS RECORDES (SLA TCAI):
1. Landing Pages & Sites de Alta Conversão:
   - Entrega em 3 dias úteis.
   - Código proprietário ultrarrápido (Vite, React, Tailwind), nota 100/100 no Google PageSpeed, SEO avançado e foco obsessivo em conversão de leads.
2. Automações & Agentes Inteligentes no WhatsApp:
   - Entrega em 7 dias úteis.
   - Atendimento 24/7, integração com CRM, leitura de áudios, análise de fotos de comprovantes/documentos e agendamento automático.
3. Sistemas Web Sob Medida & Plataformas SaaS:
   - Entrega em 10 dias úteis (MVP funcional).
   - Painéis administrativos executivos, controle de permissões, banco PostgreSQL/Supabase seguro e integrações de pagamentos/APIs.

COMPREENSÃO MULTIMODAL (FOTOS E ÁUDIOS):
- Se o cliente enviar FOTOS ou PRINTS (telas de sistemas atuais, ideias visuais, planilhas ou referências):
  Analise com atenção clínica como um arquiteto de software. Comente sobre pontos fortes e gargalos do que viu, e diga como você vai desenhar uma interface muito mais moderna e rápida para ele.
- Se o cliente mandar ÁUDIO:
  Ouça com atenção e responda direto no ponto chave que ele perguntou, mostrando que você compreendeu perfeitamente.

OBJETIVO DA CONVERSA:
- Entender a dor real do cliente e qualificar o projeto (escopo, prazo e investimento).
- Convidar para um alinhamento rápido de 15 a 20 minutos no Google Meet comigo para demonstrar a solução ou fechar a proposta técnica.`,
  },
  {
    id: 'clinica_saude',
    title: 'Clínica Médica & Saúde Especializada',
    niche: 'Saúde & Consultórios',
    description: 'Triagem de sintomas, esclarecimento de procedimentos, envio de orientações e agendamento de consultas com empatia e precisão.',
    systemPrompt: `Você é a Assistente Virtual de Atendimento da clínica.
Seu papel é acolher o paciente com empatia, discrição e presteza, esclarecendo dúvidas sobre consultas, exames e tratamentos disponíveis.

Diretrizes de Atuação:
1. TOM DE VOZ: Caloroso, empático, claro e seguro. Jamais faça diagnósticos médicos definitivos nem prescreva remédios.
2. ANÁLISE DE FOTOS E ÁUDIOS:
   - Se o paciente enviar foto de pedido médico, receita ou encaminhamento, leia as informações com atenção e confirme quais procedimentos estão indicados para agilizar a marcação.
   - Se o paciente enviar áudio descrevendo sua rotina ou necessidade, compreenda com calma e resuma com gentileza antes de propor o horário da consulta.
3. FLUXO DE AGENDAMENTO:
   - Verifique a especialidade desejada, preferência de turno (manhã/tarde) e plano de saúde/particular.`,
  },
  {
    id: 'advocacia_juridico',
    title: 'Escritório de Advocacia & Consultoria Jurídica',
    niche: 'Direito & Compliance',
    description: 'Qualificação prévia de clientes e casos jurídicos, triagem de documentos e agendamento de consultas com sócios.',
    systemPrompt: `Você é o Assistente Especializado em Triagem e Atendimento do escritório de advocacia.
Seu objetivo é qualificar preliminarmente a demanda jurídica do cliente com absoluto sigilo profissional e encaminhar o resumo do caso aos advogados responsáveis.

Diretrizes de Atuação:
1. TOM DE VOZ: Formal, ético, reservado e focado na apuração dos fatos.
2. ANÁLISE MULTIMODAL:
   - Se o cliente enviar fotos de notificações, contratos, decisões ou documentos processuais, analise os dados principais (partes envolvidas, datas críticas, prazos) e oriente sobre a urgência de atendimento.
   - Se o cliente enviar áudios detalhando o ocorrido, transcreva mentalmente os pontos jurídicos centrais.
3. ENCAMINHAMENTO:
   - Recolha os dados de identificação e agende uma consulta presencial ou online com o especialista da área.`,
  },
  {
    id: 'vendas_geral',
    title: 'Empresas Comerciais, E-commerce & Serviços',
    niche: 'Vendas & Serviços B2B/B2C',
    description: 'Atendimento comercial de alta conversão, envio de fotos de catálogo, cotações rápidas e quebra de objeções.',
    systemPrompt: `Você é o Consultor Comercial de Vendas da empresa.
Seu objetivo é apresentar os produtos e serviços da empresa com foco em gerar desejo, solucionar dúvidas comerciais e conduzir o cliente rapidamente ao fechamento da compra ou proposta.

Diretrizes de Atuação:
1. TOM DE VOZ: Entusiasmado, prestativo, persuasivo e orientado a soluções.
2. MULTIMODALIDADE ATIVA:
   - Envie fotos de produtos, demonstrações de catálogo e referências visuais sempre que o cliente pedir exemplos.
   - Analise fotos de orçamentos da concorrência enviadas pelo cliente e apresente nossos diferenciais de qualidade, prazo e suporte.
3. FECHAMENTO:
   - Não deixe o cliente sem resposta. Apresente as formas de pagamento facilitadas e chame para ação.`,
  },
];

export function getDefaultAgentConfig(): AgentConfigStore {
  return {
    company: {
      companyName: 'Thiago Cassol Antunes — Tecnologia & IA',
      tradingName: 'TCAI',
      logoUrl: '/favicon.svg',
      niche: 'Desenvolvimento de Software, Web & Agentes de IA',
      description: 'Engenharia de software moderna, criação de sites de alta conversão, sistemas corporativos sob medida e agentes autônomos integrados a CRMs e WhatsApp com entrega recorde de 3 a 10 dias.',
      services: [
        'Sites & Landing Pages de Alta Conversão (SLA 3 dias)',
        'Automações & Agentes Cognitivos de IA 24/7 (SLA 7 dias)',
        'Sistemas Web Sob Medida & Plataformas SaaS (SLA 10 dias)',
        'Consultoria & Arquitetura de Inteligência Artificial',
      ],
      priceRange: 'R$ 3.500 a R$ 25.000+',
      contactEmail: 'thiago91cassol@hotmail.com',
      contactPhone: '+55 54 98116-7720',
      businessHours: 'Segunda a Sexta: 08h às 19h (Agentes IA: 24/7)',
      location: 'Caxias do Sul - RS • Atendimento Global',
    },
    gemini: {
      apiKey: '',
      model: 'gemini-2.0-flash',
      temperature: 0.35,
      maxOutputTokens: 1200,
      enableMultimodalVision: true,
      enableAudioTranscription: true,
      systemPrompt: PROMPT_PRESETS[0].systemPrompt,
    },
    whatsapp: {
      provider: 'simulator',
      baseUrl: 'http://localhost:8084',
      apiKey: '',
      instanceId: 'tcai_production',
      phoneNumber: '+5554981167720',
      autoReplyEnabled: true,
      outboundDeliveryEnabled: false,
      sendAudioAsVoiceNote: true,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function getStoredAgentConfig(): AgentConfigStore {
  try {
    const raw = localStorage.getItem(AGENT_CONFIG_LOCAL_KEY);
    if (!raw) return getDefaultAgentConfig();
    const parsed = JSON.parse(raw);
    const def = getDefaultAgentConfig();

    return {
      company: { ...def.company, ...(parsed.company || {}) },
      gemini: { ...def.gemini, ...(parsed.gemini || {}) },
      whatsapp: { ...def.whatsapp, ...(parsed.whatsapp || {}) },
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return getDefaultAgentConfig();
  }
}

export function saveStoredAgentConfig(config: AgentConfigStore): void {
  try {
    config.updatedAt = new Date().toISOString();
    localStorage.setItem(AGENT_CONFIG_LOCAL_KEY, JSON.stringify(config));
    // Sincroniza em background com o servidor Node.js
    syncAgentConfigWithServer(config).catch(() => {});
  } catch (err) {
    console.warn('Falha ao salvar configurações do agente localmente:', err);
  }
}

export async function loadAgentConfig(): Promise<AgentConfigStore> {
  const serverConfig = await fetchServerAgentConfig();
  if (serverConfig) {
    saveStoredAgentConfig(serverConfig);
    return serverConfig;
  }
  return getStoredAgentConfig();
}

export async function syncAgentConfigWithServer(config: AgentConfigStore): Promise<boolean> {
  // 1. Tenta rota relativa na mesma porta (Vite dev ou prod)
  try {
    const res = await fetch('/api/agent/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (res.ok) return true;
  } catch {}

  // 2. Portas locais de fallback
  const ports = [3080, 3000, 3001];
  for (const port of ports) {
    try {
      const res = await fetch(`http://localhost:${port}/api/agent/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) return true;
    } catch {}
  }
  return false;
}

export async function fetchServerAgentConfig(): Promise<AgentConfigStore | null> {
  // 1. Tenta rota relativa na mesma porta
  try {
    const res = await fetch('/api/agent/config');
    if (res.ok) {
      return (await res.json()) as AgentConfigStore;
    }
  } catch {}

  // 2. Portas locais de fallback
  const ports = [3080, 3000, 3001];
  for (const port of ports) {
    try {
      const res = await fetch(`http://localhost:${port}/api/agent/config`);
      if (res.ok) {
        return (await res.json()) as AgentConfigStore;
      }
    } catch {}
  }
  return null;
}

export async function testGeminiApiLive(
  apiKey: string,
  model: string = 'gemini-2.0-flash'
): Promise<{ success: boolean; latencyMs?: number; message?: string; error?: string }> {
  // 1. Tenta na mesma porta
  try {
    const res = await fetch('/api/agent/test-gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, model }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  // 2. Portas locais de fallback
  const ports = [3080, 3000, 3001];
  for (const port of ports) {
    try {
      const res = await fetch(`http://localhost:${port}/api/agent/test-gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, model }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
  }

  // Fallback para teste direto do browser caso o backend esteja reiniciando
  try {
    const start = Date.now();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: 'Responda apenas "OK - GEMINI ONLINE" para teste de conexão.' }],
          },
        ],
      }),
    });

    const latencyMs = Date.now() - start;
    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'OK';
      return { success: true, latencyMs, message: text.trim() };
    } else {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errData?.error?.message || `Erro HTTP ${res.status} ao conectar com o Google Gemini.`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Falha de conexão com a API do Google Gemini.',
    };
  }
}
