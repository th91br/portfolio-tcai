/**
 * TCAI — Serviço de Propostas Comerciais & Contratos Executivos
 * Gerencia geração, edição, cálculo financeiro, garantias contratuais e persistência de propostas.
 */

export interface ScopeDeliverable {
  title: string;
  description: string;
}

export interface PaymentTerms {
  upfrontPercent: number; // Ex: 50%
  deliveryPercent: number; // Ex: 50%
  pixDiscountPercent?: number; // Ex: 5% à vista
  installmentsMax?: number; // Ex: até 3x no cartão corporativo
  customNotes?: string;
}

export interface CommercialProposal {
  id: string;
  proposalNumber: string;
  contactId: string;
  clientName: string;
  company: string;
  cnpj?: string;
  phone?: string;
  title: string;
  summary: string;
  scopeItems: ScopeDeliverable[];
  techStack: string[];
  slaDays: number;
  investmentTotal: number;
  paymentTerms: PaymentTerms;
  guarantees: string[];
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  publicSlug: string;
  createdAt: string;
  validUntil: string;
}

const PROPOSALS_STORAGE_KEY = 'tcai_commercial_proposals_v1';

export function getProposals(contactId?: string): CommercialProposal[] {
  try {
    const raw = localStorage.getItem(PROPOSALS_STORAGE_KEY);
    if (!raw) return [];
    const list: CommercialProposal[] = JSON.parse(raw);
    if (contactId) {
      return list.filter((p) => p.contactId === contactId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function getProposalById(id: string): CommercialProposal | null {
  const all = getProposals();
  return all.find((p) => p.id === id) || null;
}

export function saveProposal(proposal: CommercialProposal): CommercialProposal {
  const all = getProposals();
  const index = all.findIndex((p) => p.id === proposal.id);

  let updatedList: CommercialProposal[];
  if (index >= 0) {
    updatedList = [...all];
    updatedList[index] = proposal;
  } else {
    updatedList = [proposal, ...all];
  }

  try {
    localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(updatedList));
  } catch {
    // ignore
  }

  return proposal;
}

export function deleteProposal(id: string): boolean {
  const all = getProposals();
  const filtered = all.filter((p) => p.id !== id);
  try {
    localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function generateProposalNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PROP-${year}-${random}`;
}

export function formatProposalWhatsAppMessage(proposal: CommercialProposal): string {
  const upfrontVal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    (proposal.investmentTotal * (proposal.paymentTerms.upfrontPercent || 50)) / 100
  );
  const deliveryVal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    (proposal.investmentTotal * (proposal.paymentTerms.deliveryPercent || 50)) / 100
  );
  const totalVal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    proposal.investmentTotal
  );

  const scopeList = proposal.scopeItems
    .slice(0, 4)
    .map((item) => `• *${item.title}*: ${item.description}`)
    .join('\n');

  return (
    `*PROPOSTA TÉCNICO-COMERCIAL — TCAI*\n` +
    `Ref: ${proposal.proposalNumber}\n\n` +
    `Olá, *${proposal.clientName}* (${proposal.company})!\n` +
    `Aqui é o Thiago. Preparei a proposta executiva do seu projeto:\n\n` +
    `📌 *Projeto:* ${proposal.title}\n` +
    `⏱️ *Prazo Garantido em Contrato:* ${proposal.slaDays} dias úteis\n` +
    `🛠️ *Stack Tecnológica:* ${proposal.techStack.join(', ')}\n\n` +
    `📋 *Escopo e Entregáveis:* \n${scopeList}\n\n` +
    `💰 *Condições de Investimento:*\n` +
    `- *Total:* ${totalVal}\n` +
    `- Entrada (${proposal.paymentTerms.upfrontPercent}%): ${upfrontVal}\n` +
    `- Saldo na Entrega (${proposal.paymentTerms.deliveryPercent}%): ${deliveryVal}\n` +
    (proposal.paymentTerms.pixDiscountPercent
      ? `- Desconto à vista no PIX: ${proposal.paymentTerms.pixDiscountPercent}%\n`
      : '') +
    `\n🔒 *Garantias Contratuais TCAI:*\n` +
    `✓ Código-fonte 100% proprietário (sem mensalidades ocultas)\n` +
    `✓ Garantia técnica de 90 dias com suporte prioritário\n` +
    `✓ Penalidade contratual em caso de descumprimento do SLA de entrega\n\n` +
    `Fico à disposição para tirar qualquer dúvida e emitirmos o contrato para início imediato!`
  );
}

export function getDefaultGuarantees(): string[] {
  return [
    'Propriedade Intelectual Plena: O código-fonte, banco de dados e ativos digitais pertencem 100% à sua empresa após a liquidação.',
    'Garantia Técnica de Estabilidade: 90 dias de cobertura contra qualquer inconformidade ou bug nos módulos entregues.',
    'SLA Rigoroso de Entrega: Cronograma estipulado com cláusula de penalidade em caso de atraso sem justificativa técnica.',
    'Deploy em Produção Assistido: Publicação, configuração de domínio próprio, SSL e testes operacionais inclusos.',
  ];
}
