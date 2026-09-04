import http from 'http';
import url from 'url';

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
  ],
};

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
    body {
      background-color: #060D17;
      color: #F3F5F7;
      font-family: 'Kanit', sans-serif;
      overflow-x: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    /* Custom Scrollbars */
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #07111F; }
    ::-webkit-scrollbar-thumb { background: #16273C; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #00D2F6; }

    /* App Header */
    .app-header {
      background: #0A1624;
      border-bottom: 1px solid #16273C;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-shrink: 0;
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

    /* Views */
    .view-content {
      flex: 1;
      display: none;
      height: calc(100vh - 60px);
      overflow: hidden;
    }
    .view-content.active {
      display: flex;
    }

    /* WhatsApp View 3-Column Layout */
    .chats-list {
      width: 320px;
      background: #07111F;
      border-right: 1px solid #16273C;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .chat-item {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      cursor: pointer;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      transition: all 0.2s;
    }
    .chat-item:hover, .chat-item.active {
      background: rgba(0, 210, 246, 0.06);
      border-left: 3px solid #00D2F6;
    }
    .chat-pane {
      flex: 1;
      background: #050914;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .bubble {
      max-width: 70%;
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
    .details-sidebar {
      width: 320px;
      background: #07111F;
      border-left: 1px solid #16273C;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex-shrink: 0;
    }

    /* Diagnostics & Kanban & Calendar styling */
    .grid-cards {
      padding: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
      overflow-y: auto;
      width: 100%;
    }
    .card-box {
      background: #0A1624;
      border: 1px solid #16273C;
      border-radius: 16px;
      padding: 20px;
      transition: all 0.25s;
    }
    .card-box:hover {
      border-color: #00D2F6;
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 210, 246, 0.1);
    }

    .kanban-board {
      display: flex;
      gap: 16px;
      padding: 20px;
      overflow-x: auto;
      width: 100%;
      height: 100%;
    }
    .kanban-col {
      min-width: 260px;
      background: #07111F;
      border: 1px solid #16273C;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      padding: 14px;
      gap: 12px;
    }

    /* Input bar */
    .chat-input-bar {
      padding: 12px 16px;
      background: #0A1624;
      border-top: 1px solid #16273C;
      display: flex;
      gap: 10px;
      align-items: center;
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

    /* Oculta header duplicado quando dentro de iframe no dashboard */
    body.is-embedded .app-header {
      display: none !important;
    }
    body.is-embedded .view-content {
      height: 100vh !important;
    }

    /* Botões responsivos móveis */
    .btn-mobile-back {
      display: none;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #00D2F6;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 14px;
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
        width: 270px;
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
        padding: 10px 14px;
        gap: 8px;
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
  </style>
</head>
<body>

  <!-- Top Bar -->
  <header class="app-header">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #00D2F6, #015EEF); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #060D17;">
        ⚡
      </div>
      <div>
        <div style="font-weight: 800; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
          TCAI WhatsApp CRM & Agente Autônomo
        </div>
        <div style="font-size: 10px; color: #94A3B8; font-family: 'JetBrains Mono', monospace;">
          API Oficial • IA Cognitiva • SLA 3/7/10 Dias
        </div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 12px;">
      <div class="badge-online">
        <span class="pulse-dot"></span>
        <span>WHATSAPP CONECTADO (+55 54 98116-7720)</span>
      </div>
      <div style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #00D2F6; background: rgba(0, 210, 246, 0.1); border: 1px solid rgba(0, 210, 246, 0.25); padding: 4px 10px; border-radius: 8px;">
        LATÊNCIA: 12ms
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
            🤖 IA ATIVA
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

      <!-- Message Input -->
      <form id="chat-form" class="chat-input-bar" onsubmit="handleSendMessage(event)">
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
        <div style="font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">1. Triagem (1)</div>
        <div class="card-box" style="padding: 12px;">
          <div style="font-weight: 700; font-size: 13px;">Dra. Camila Duarte</div>
          <div style="font-size: 11px; color: #94A3B8;">Duarte Advocacia</div>
          <div style="font-size: 10px; color: #00D2F6; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Automação Jurídica</div>
        </div>
      </div>
      <div class="kanban-col">
        <div style="font-size: 11px; font-weight: 800; color: #00D2F6; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">2. Qualificado por IA (1)</div>
        <div class="card-box" style="padding: 12px;">
          <div style="font-weight: 700; font-size: 13px;">Roberto Mendes</div>
          <div style="font-size: 11px; color: #94A3B8;">Mendes Logística</div>
          <div style="font-size: 10px; color: #00D2F6; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Painel Web • R$ 12.000</div>
        </div>
      </div>
      <div class="kanban-col">
        <div style="font-size: 11px; font-weight: 800; color: #10B981; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">3. Reunião Agendada (1)</div>
        <div class="card-box" style="padding: 12px; border-color: rgba(16,185,129,0.4);">
          <div style="font-weight: 700; font-size: 13px;">Dr. Marcos Silva</div>
          <div style="font-size: 11px; color: #94A3B8;">Clínica Odonto Prime</div>
          <div style="font-size: 10px; color: #10B981; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">Amanhã 14h • R$ 8.500</div>
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
      stream.innerHTML = contact.messages.map(m => \`
        <div class="bubble \${m.sender === 'agent' ? 'bubble-agent' : 'bubble-lead'}">
          <div>\${m.text}</div>
          <div class="bubble-time">\${m.time} \${m.sender === 'agent' ? '✓✓' : ''}</div>
        </div>
      \`).join('');
      stream.scrollTop = stream.scrollHeight;
    }

    function renderDiagnostics() {
      const container = document.getElementById('diagnostics-container');
      container.innerHTML = data.diagnostics.map(d => \`
        <div class="card-box">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <span style="font-size: 10px; font-family: 'JetBrains Mono', monospace; background: rgba(0,210,246,0.15); color: #00D2F6; padding: 3px 8px; border-radius: 6px; font-weight: bold;">
              \${d.status} • SCORE \${d.score}
            </span>
            <span style="font-size: 11px; color: #94A3B8; font-family: 'JetBrains Mono', monospace;">\${d.date}</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 4px;">\${d.title}</h3>
          <p style="font-size: 12px; color: #94A3B8; margin-bottom: 12px;">Cliente: <strong style="color: white;">\${d.client}</strong></p>
          <div style="padding: 10px; background: #07111F; border-radius: 10px; margin-bottom: 12px;">
            <div style="font-size: 11px; color: #10B981; font-weight: bold;">Faixa Orçamentária: \${d.budget}</div>
            <div style="font-size: 11px; color: #00D2F6; font-family: 'JetBrains Mono', monospace; margin-top: 2px;">Prazo Estimado: \${d.sla}</div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            \${d.stack.map(s => \`<span style="font-size: 10px; font-family: 'JetBrains Mono', monospace; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: #CBD5E1;">\${s}</span>\`).join('')}
          </div>
        </div>
      \`).join('');
    }

    function renderMeetings() {
      const container = document.getElementById('meetings-container');
      container.innerHTML = data.meetings.map(m => \`
        <div class="card-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 11px; font-weight: bold; color: #10B981; font-family: 'JetBrains Mono', monospace;">\${m.time}</span>
            <span style="font-size: 10px; background: rgba(16,185,129,0.1); color: #10B981; border: 1px solid rgba(16,185,129,0.3); padding: 2px 8px; border-radius: 6px;">AGENDADO</span>
          </div>
          <h3 style="font-size: 15px; font-weight: 800; color: white; margin-bottom: 4px;">\${m.client}</h3>
          <p style="font-size: 12px; color: #94A3B8; margin-bottom: 12px;">\${m.topic}</p>
          <a href="https://\${m.link}" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #00D2F6; background: rgba(0,210,246,0.1); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(0,210,246,0.3);">
            <span>Entrar no Meet</span> →
          </a>
        </div>
      \`).join('');
    }

    function insertSuggestion(text) {
      document.getElementById('chat-input-text').value = text;
      document.getElementById('chat-input-text').focus();
    }

    function handleSendMessage(e) {
      e.preventDefault();
      const input = document.getElementById('chat-input-text');
      const text = input.value.trim();
      if (!text) return;

      const contact = data.contacts.find(c => c.id === currentContactId);
      if (!contact) return;

      const now = new Date();
      const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      contact.messages.push({ sender: 'agent', text, time: timeStr });
      contact.lastMessage = text;
      contact.lastMessageTime = timeStr;
      input.value = '';

      renderMessages(contact);
      renderChats();

      // Simula resposta automática inteligente do lead após 2 segundos
      setTimeout(() => {
        const replies = [
          'Entendido, vou separar os acessos aqui e te aviso.',
          'Excelente! Já deixei a reunião anotada na minha agenda.',
          'Ótimo Thiago, aguardo o envio do PDF para finalizar.',
          'Perfeito, muito obrigado pelo atendimento rápido!'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        contact.messages.push({ sender: 'lead', text: randomReply, time: timeStr });
        contact.lastMessage = randomReply;
        renderMessages(contact);
        renderChats();
      }, 1500);
    }

    // Escuta comandos de troca de aba enviados pelo Dashboard pai via postMessage
    window.addEventListener('message', (e) => {
      if (e.data && e.data.action === 'switchView') {
        switchView(e.data.view);
      }
    });

    function switchView(viewName) {
      document.querySelectorAll('.view-content').forEach(el => el.classList.remove('active'));
      const target = document.getElementById('view-' + viewName);
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
    selectContact('lead-1');
    updateMobileClasses();
    renderDiagnostics();
    renderMeetings();
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
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

  // 1. Endpoint de telemetria / KPIs consultado pelo DashboardLayout / WhatsAppAgentView
  if (pathname === '/api/analytics/kpis') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockState.kpis));
    return;
  }

  // 2. Endpoint de status operacional
  if (pathname === '/api/status' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      online: true,
      whatsappConnected: true,
      phoneNumber: '+55 (54) 98116-7720',
      agentVersion: '2.4.0',
      uptimeSec: Math.round(process.uptime()),
    }));
    return;
  }

  // 3. Endpoint de contatos e mensagens
  if (pathname === '/api/contacts') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockState.contacts));
    return;
  }

  // 4. Servir a aplicação visual do Cockpit do Agente de WhatsApp
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
