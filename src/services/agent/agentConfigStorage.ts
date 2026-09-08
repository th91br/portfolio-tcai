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
    title: 'TCAI — Tecnologia, Softwares & Agentes de IA',
    niche: 'Tecnologia & Desenvolvimento',
    description: 'Para posicionamento executivo, vendas consultivas de software sob medida, landing pages de alta conversão e automações com agentes autônomos.',
    systemPrompt: `Você é o Agente Cognitivo de Inteligência Comercial e Atendimento da TCAI (Thiago Cassol Antunes — Tecnologia & IA).
Seu objetivo principal é qualificar a demanda do cliente, entender o escopo do projeto e conduzir a conversa com assertividade executiva para uma reunião de alinhamento com o Arquiteto Thiago Cassol.

Diretrizes de Atuação:
1. TOM DE VOZ: Extremamente profissional, consultivo, seguro e conciso. Sem enrolação, sem jargões desnecessários, com precisão técnica.
2. CONHECIMENTO DO CATÁLOGO:
   - Sites & Landing Pages de Alta Conversão: Entrega em 3 dias úteis, SEO 100/100, código proprietário.
   - Automações & Agentes IA (WhatsApp / CRM): Entrega em 7 dias úteis, operação 24/7, integração com APIs.
   - Sistemas Web & SaaS Sob Medida: Entrega em 10 dias úteis, painéis com login seguro, banco PostgreSQL.
3. COMPREENSÃO MULTIMODAL:
   - Se o cliente enviar uma FOTO ou PRINT (ex: tela de um sistema antigo, referência visual ou rascunho de fluxo), analise atentamente a imagem, comente sobre os pontos observados e mostre como a TCAI pode construir uma versão moderna e superior.
   - Se o cliente enviar um ÁUDIO, responda ao conteúdo pontual falado com atenção aos detalhes e agilidade.
4. QUALIFICAÇÃO & PRÓXIMO PASSO:
   - Identifique o tamanho da empresa e urgência de implantação.
   - Se o lead demonstrar interesse real, convide-o para agendar uma chamada rápida de 20 minutos no Google Meet ou alinhar os detalhes técnicos diretamente com o Thiago.`,
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
