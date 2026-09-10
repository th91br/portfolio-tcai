/**
 * TCAI — Base de Conhecimento Corporativa (Enterprise RAG Hub)
 * Gerencia indexação de documentos (PDF, TXT, CSV, JSON), catálogos e tabelas de preços
 * Alimenta o cérebro da IA com contexto estrito para eliminar alucinações
 */

export interface KnowledgeDocument {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'txt' | 'csv' | 'json';
  fileSize: string;
  uploadedAt: string;
  tokenEstimate: number;
  category: 'tabela_precos' | 'catalogo' | 'politicas' | 'faq' | 'geral';
  isActive: boolean;
  content: string;
  summary: string;
}

const KNOWLEDGE_STORAGE_KEY = 'tcai_knowledge_base_v1';

// Documentos oficiais pré-indexados da TCAI
export const DEFAULT_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-tabela-precos-2026',
    title: 'Tabela Oficial de Preços e Prazos B2B (2026)',
    fileName: 'tabela-precos-tcai-2026.pdf',
    fileType: 'pdf',
    fileSize: '142 KB',
    uploadedAt: '2026-09-01',
    tokenEstimate: 1450,
    category: 'tabela_precos',
    isActive: true,
    summary: 'Tabela com valores de referência para Landing Pages (3 dias úteis), Agentes WhatsApp IA (7 dias) e Sistemas Web (10 dias).',
    content: `TABELA OFICIAL DE PREÇOS E PRAZOS — TCAI SOLUÇÕES INTELIGENTES (2026)

1. SITE DE ALTA CONVERSÃO / LANDING PAGE DE ALTA PERFORMANCE
- Prazo Garantido em Contrato: 3 dias úteis.
- Investimento Médio: R$ 2.500,00 a R$ 4.500,00.
- Entregáveis: Design executivo sob medida, performance 100/100 no Google PageSpeed, SEO técnico avançado, copywriting persuasivo, integração com WhatsApp e formulários.

2. AGENTE DE INTELIGÊNCIA ARTIFICIAL PARA WHATSAPP
- Prazo Garantido em Contrato: 7 dias úteis.
- Investimento Médio: R$ 4.500,00 a R$ 8.500,00 (Setup) + Manutenção/Infraestrutura sob consulta.
- Entregáveis: Conexão direta com a API do WhatsApp, atendimento humanizado em 1ª pessoa, entendimento de áudios e imagens de exames/produtos via Gemini 2.0 Multimodal, qualificação de leads, agendamento de reuniões no Google Meet e CRM integrado.

3. SISTEMA SAAS SOB MEDIDA / PAINEL WEB CORPORATIVO
- Prazo Garantido em Contrato: 10 dias úteis (MVP validado).
- Investimento Médio: R$ 8.500,00 a R$ 25.000,00.
- Entregáveis: Autenticação segura de usuários, banco de dados PostgreSQL relacional, painel Kanban/Analytics, relatórios em PDF, permissões hierárquicas e hospedagem em nuvem de alta disponibilidade.

CONDIÇÕES DE PAGAMENTO:
- Padrão: 50% de sinal na assinatura + 50% na homologação e entrega do código pronto.
- À vista com 10% de desconto no PIX instantâneo.
- Parcelamento em até 12x no cartão de crédito corporativo via link seguro.`,
  },
  {
    id: 'doc-sla-garantias',
    title: 'Diretrizes Contratuais e SLA Bilateral',
    fileName: 'manual-sla-garantias.pdf',
    fileType: 'pdf',
    fileSize: '98 KB',
    uploadedAt: '2026-09-02',
    tokenEstimate: 980,
    category: 'politicas',
    isActive: true,
    summary: 'Regras de garantia de entrega em 3, 7 ou 10 dias úteis com multa contratual pró-cliente caso ocorra atraso injustificado.',
    content: `POLÍTICA DE SLA GARANTIDO E DIRETRIZES CONTRATUAIS — TCAI

COMPROMISSO DE ENTREGA RIGOROSA:
- A TCAI opera com a metodologia ágil de Sprint Fechada. O cliente não espera meses para ver o software funcionando.
- Prazos formais: 3 dias úteis (Landing Pages), 7 dias úteis (Agentes de IA e Automações) ou 10 dias úteis (Sistemas Web).

GARANTIAS BILATERAIS:
- A contagem de dias úteis inicia-se no primeiro dia útil seguinte ao pagamento do sinal e entrega do material básico pelo cliente.
- Caso a TCAI atrase a entrega por motivos internos sem motivo de força maior, o cliente recebe desconto contratual pré-fixado de 5% por dia de atraso até o limite de 20%.
- Todo projeto inclui 30 dias de suporte técnico assistido pós-entrega com correção imediata de bugs sem custo adicional.`,
  },
  {
    id: 'doc-faq-comercial',
    title: 'Dúvidas Frequentes e Quebra de Objeções',
    fileName: 'faq-comercial-diretoria.txt',
    fileType: 'txt',
    fileSize: '64 KB',
    uploadedAt: '2026-09-05',
    tokenEstimate: 1120,
    category: 'faq',
    isActive: true,
    summary: 'Respostas para dúvidas sobre segurança LGPD, propriedade do código-fonte e compatibilidade com outros softwares.',
    content: `MANUAL DE DÚVIDAS FREQUENTES — ATENDIMENTO CONSULTIVO

P: O código-fonte pertence a quem ao final do projeto?
R: O código-fonte pertence 100% ao cliente contratante. Não amarramos o cliente em mensalidades abusivas de propriedade intelectual. Entregamos repositório GitHub limpo e documentado.

P: O sistema é compatível com LGPD?
R: Sim. Tratamos os dados com criptografia de ponta a ponta (HTTPS/TLS 1.3), bancos de dados seguros em PostgreSQL com Row-Level Security e servidores com certificação SOC2/ISO 27001.

P: O WhatsApp pode ser bloqueado se usarmos IA?
R: Não, pois utilizamos arquitetura oficial de conexão com controle estrito de latência humana, sem disparos em massa agressivos, simulando o comportamento de digitação natural e respeitando as políticas da Meta.`,
  },
];

/**
 * Obtém todos os documentos da base de conhecimento
 */
export function getKnowledgeDocuments(): KnowledgeDocument[] {
  try {
    const raw = localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(DEFAULT_KNOWLEDGE_DOCUMENTS));
      return DEFAULT_KNOWLEDGE_DOCUMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {}

  return DEFAULT_KNOWLEDGE_DOCUMENTS;
}

/**
 * Salva a lista de documentos
 */
export function saveKnowledgeDocuments(docs: KnowledgeDocument[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(docs));
  }
}

/**
 * Adiciona um novo documento à base
 */
export function addKnowledgeDocument(doc: Omit<KnowledgeDocument, 'id' | 'uploadedAt' | 'tokenEstimate'>): KnowledgeDocument {
  const docs = getKnowledgeDocuments();
  const tokenEstimate = Math.ceil((doc.content || '').length / 4);

  const newDoc: KnowledgeDocument = {
    ...doc,
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    uploadedAt: new Date().toISOString().split('T')[0],
    tokenEstimate,
  };

  const updated = [newDoc, ...docs];
  saveKnowledgeDocuments(updated);
  return newDoc;
}

/**
 * Alterna status ativo de um documento
 */
export function toggleKnowledgeDocument(id: string): void {
  const docs = getKnowledgeDocuments();
  const updated = docs.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d));
  saveKnowledgeDocuments(updated);
}

/**
 * Remove documento da base
 */
export function deleteKnowledgeDocument(id: string): void {
  const docs = getKnowledgeDocuments();
  const updated = docs.filter((d) => d.id !== id);
  saveKnowledgeDocuments(updated);
}

/**
 * Motor de Busca Semântica e Relevância Contextual (RAG)
 * Recupera os trechos mais pertinentes para anexar ao prompt da IA
 */
export function searchKnowledge(query: string, topK: number = 2): { excerpts: string[]; sources: string[] } {
  if (!query || !query.trim()) return { excerpts: [], sources: [] };

  const docs = getKnowledgeDocuments().filter((d) => d.isActive);
  const terms = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scoredDocs = docs.map((doc) => {
    const normalizedContent = doc.content
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    let score = 0;
    terms.forEach((term) => {
      const occurrences = (normalizedContent.match(new RegExp(term, 'g')) || []).length;
      score += occurrences;
      if (doc.title.toLowerCase().includes(term)) {
        score += 5;
      }
    });

    return { doc, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);

  const relevant = scoredDocs.filter((item) => item.score > 0).slice(0, topK);

  if (relevant.length === 0) {
    // Se não houver match direto por termo, pega o primeiro ativo de preços/geral como base
    const defaultDoc = docs.find((d) => d.category === 'tabela_precos') || docs[0];
    if (defaultDoc) {
      return {
        excerpts: [defaultDoc.content.slice(0, 1200)],
        sources: [defaultDoc.title],
      };
    }
    return { excerpts: [], sources: [] };
  }

  return {
    excerpts: relevant.map((r) => r.doc.content.slice(0, 1500)),
    sources: relevant.map((r) => r.doc.title),
  };
}
