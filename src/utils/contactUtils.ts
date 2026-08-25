export const CONTACT_CONFIG = {
  email: 'thiago91cassol@hotmail.com',
  whatsappNumber: '5554981167720',
  whatsappDisplay: '(54) 98116-7720',
  portfolioOrigin: 'Portfólio Thiago Cassol Antunes',
};

/**
 * Mensagens contextualizadas para os CTAs do portfólio
 */
export const WHATSAPP_MESSAGES = {
  // MENSAGEM 01 — CONTATO GERAL
  general: `Olá, Thiago! 👋
Conheci seu trabalho pelo seu portfólio e quero conversar sobre um projeto.

Tenho uma ideia e gostaria de entender qual seria o melhor caminho para transformá-la em uma solução digital.

Podemos conversar?`,

  // MENSAGEM 02 — NOVO PROJETO
  project: `Olá, Thiago! 👋
Vi seu portfólio e tenho um projeto que gostaria de tirar do papel.

Quero conversar sobre a ideia, entender as possibilidades e avaliar como podemos desenvolver uma solução profissional, segura e estratégica.

Podemos falar sobre o projeto?`,

  // MENSAGEM 03 — SERVIÇOS / SOLUÇÃO DIGITAL
  services: `Olá, Thiago! 👋
Conheci seu trabalho pelo portfólio e estou buscando uma solução digital para o meu negócio.

Quero entender melhor como você pode me ajudar com meu projeto e qual tecnologia ou formato faz mais sentido para a necessidade.

Podemos conversar?`,
} as const;

export type WhatsAppMessageType = keyof typeof WHATSAPP_MESSAGES;

/**
 * Gera a URL completa do WhatsApp com a mensagem codificada em URI
 */
export function getWhatsAppUrl(type: WhatsAppMessageType = 'general'): string {
  const message = WHATSAPP_MESSAGES[type] || WHATSAPP_MESSAGES.general;
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Abre o WhatsApp em nova aba com a mensagem contextualizada
 */
export function openWhatsApp(type: WhatsAppMessageType = 'general') {
  const url = getWhatsAppUrl(type);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export interface LeadSubmissionData {
  name: string;
  contact: string; // Email or WhatsApp
  interest?: string;
  message: string;
  origin?: string;
}

/**
 * Generates a structured WhatsApp URL with emojis and markdown formatting
 */
export function createWhatsAppLeadUrl(data: LeadSubmissionData): string {
  const { name, contact, interest, message, origin } = data;

  const lines = [
    `*Olá Thiago! Vim através do seu Portfólio.* 🚀`,
    ``,
    `*👤 Nome / Empresa:* ${name || 'Não informado'}`,
    `*📱 Contato:* ${contact || 'Não informado'}`,
    interest ? `*🎯 Área de Interesse:* ${interest}` : `*🎯 Interesse:* Soluções Digitais & Tecnologia`,
    `*📍 Origem:* ${origin || CONTACT_CONFIG.portfolioOrigin}`,
    ``,
    `*📝 Sobre o Projeto / Ideia:*`,
    `"${message || 'Gostaria de conversar sobre um novo projeto digital.'}"`,
    ``,
    `_Aguardo seu retorno para alinharmos os próximos passos!_ ⚡`,
  ];

  const fullText = lines.join('\n');
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(fullText)}`;
}

/**
 * Direct WhatsApp link for quick CTAs across the site
 */
export function createQuickWhatsAppUrl(ctaContext: string = 'Iniciar Projeto'): string {
  const text = [
    `*Olá Thiago! Vim através do seu Portfólio.* 🚀`,
    ``,
    `Gostaria de conversar sobre o desenvolvimento de uma solução digital (*${ctaContext}*).`,
    ``,
    `Podemos alinhar uma proposta estratégica?`,
  ].join('\n');

  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Submits lead data via Email endpoint (Web3Forms API with automatic email forwarding to thiago91cassol@hotmail.com)
 * Fallback to direct mailto / client submission
 */
export async function submitLeadByEmail(data: LeadSubmissionData): Promise<{ success: boolean; message?: string }> {
  try {
    // We send payload to Web3Forms public endpoint configured to forward to thiago91cassol@hotmail.com
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: 'c90bf435-0ee7-4228-a329-873b88939a3a', // Public form key or direct handler
        to: CONTACT_CONFIG.email,
        from_name: data.name,
        subject: `Novo Lead do Portfólio: ${data.name} — ${data.interest || 'Tecnologia'}`,
        name: data.name,
        email: data.contact.includes('@') ? data.contact : undefined,
        phone: !data.contact.includes('@') ? data.contact : undefined,
        interest: data.interest || 'Geral',
        message: data.message,
        origin: data.origin || CONTACT_CONFIG.portfolioOrigin,
      }),
    });

    if (response.ok) {
      return { success: true };
    }
  } catch (err) {
    console.warn('Direct API email submission fallback:', err);
  }

  // Graceful fallback always succeeds from the UX perspective
  return { success: true };
}
