export interface PipelineStageDefinition {
  id: string;
  name: string;
  badgeColor: string;
  defaultProb: number;
  isWon?: boolean;
  isLost?: boolean;
}

export interface PipelineDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  isDefault?: boolean;
  stages: PipelineStageDefinition[];
  createdAt: string;
}

const STORAGE_KEY_PIPELINES = 'tcai_custom_pipelines';
const STORAGE_KEY_ACTIVE_PIPELINE = 'tcai_active_pipeline_id';

export const INDUSTRY_PIPELINE_PRESETS: PipelineDefinition[] = [
  {
    id: 'pipeline_digital_sales',
    name: 'Vendas Digitais & Tráfego Pago (Padrão)',
    description: 'Pipeline ideal para captura de tráfego pago, qualificação imediata e conversão ágil.',
    icon: '🚀',
    isDefault: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    stages: [
      { id: 'NOVO', name: 'NOVO', badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10', defaultProb: 10 },
      { id: 'QUALIFICADO', name: 'QUALIFICADO', badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10', defaultProb: 20 },
      { id: 'CONTATADO', name: 'CONTATADO', badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10', defaultProb: 30 },
      { id: 'REUNIÃO', name: 'REUNIÃO', badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10', defaultProb: 50 },
      { id: 'PROPOSTA', name: 'PROPOSTA', badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10', defaultProb: 65 },
      { id: 'NEGOCIAÇÃO', name: 'NEGOCIAÇÃO', badgeColor: 'border-pink-500/40 text-pink-400 bg-pink-500/10', defaultProb: 80 },
      { id: 'FECHADO', name: 'FECHADO', badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10', defaultProb: 100, isWon: true },
      { id: 'PERDIDO', name: 'PERDIDO', badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10', defaultProb: 0, isLost: true },
    ],
  },
  {
    id: 'pipeline_clinics_health',
    name: 'Clínicas Médicas & Odontologia',
    description: 'Funil focado no comparecimento presencial e fechamento de planos de tratamento de alto ticket.',
    icon: '🩺',
    createdAt: '2026-01-01T00:00:00.000Z',
    stages: [
      { id: 'NOVO', name: 'LEAD RECEBIDO', badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10', defaultProb: 15 },
      { id: 'QUALIFICADO', name: 'TRIAGEM CLÍNICA IA', badgeColor: 'border-teal-500/40 text-teal-400 bg-teal-500/10', defaultProb: 35 },
      { id: 'REUNIÃO', name: 'AVALIAÇÃO AGENDADA', badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10', defaultProb: 60 },
      { id: 'PROPOSTA', name: 'COMPARECEU NA CLÍNICA', badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10', defaultProb: 80 },
      { id: 'FECHADO', name: 'TRATAMENTO FECHADO', badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10', defaultProb: 100, isWon: true },
      { id: 'PERDIDO', name: 'NÃO COMPARECEU / DESISTÊNCIA', badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10', defaultProb: 0, isLost: true },
    ],
  },
  {
    id: 'pipeline_real_estate',
    name: 'Imobiliárias & Corretores de Imóveis',
    description: 'Cadência para visitação de lançamentos e fechamento de contratos de locação ou venda.',
    icon: '🏢',
    createdAt: '2026-01-01T00:00:00.000Z',
    stages: [
      { id: 'NOVO', name: 'NOVO INTERESSADO', badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10', defaultProb: 10 },
      { id: 'QUALIFICADO', name: 'PERFIL APROVADO (IA)', badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10', defaultProb: 25 },
      { id: 'CONTATADO', name: 'VISITA AGENDADA', badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10', defaultProb: 45 },
      { id: 'REUNIÃO', name: 'VISITA REALIZADA', badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10', defaultProb: 65 },
      { id: 'PROPOSTA', name: 'PROPOSTA / ANÁLISE DE CRÉDITO', badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10', defaultProb: 85 },
      { id: 'FECHADO', name: 'IMÓVEL VENDIDO / ESCRITURADO', badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10', defaultProb: 100, isWon: true },
      { id: 'PERDIDO', name: 'DESISTÊNCIA / SEM CRÉDITO', badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10', defaultProb: 0, isLost: true },
    ],
  },
  {
    id: 'pipeline_b2b_enterprise',
    name: 'B2B Enterprise & Software Sob Medida',
    description: 'Ciclo complexo com múltiplos tomadores de decisão, demos técnicas e SLA contratual.',
    icon: '💼',
    createdAt: '2026-01-01T00:00:00.000Z',
    stages: [
      { id: 'NOVO', name: 'MQL (INBOUND)', badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10', defaultProb: 15 },
      { id: 'QUALIFICADO', name: 'SQL QUALIFICADO', badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10', defaultProb: 30 },
      { id: 'REUNIÃO', name: 'DEMO EXECUTIVA', badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10', defaultProb: 55 },
      { id: 'PROPOSTA', name: 'PROPOSTA TÉCNICA & SLA', badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10', defaultProb: 75 },
      { id: 'NEGOCIAÇÃO', name: 'NEGOCIAÇÃO JURÍDICA / COMPRAS', badgeColor: 'border-pink-500/40 text-pink-400 bg-pink-500/10', defaultProb: 90 },
      { id: 'FECHADO', name: 'CONTRATO ASSINADO', badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10', defaultProb: 100, isWon: true },
      { id: 'PERDIDO', name: 'PERDIDO', badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10', defaultProb: 0, isLost: true },
    ],
  },
];

export function getPipelines(): PipelineDefinition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PIPELINES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  savePipelines(INDUSTRY_PIPELINE_PRESETS);
  return INDUSTRY_PIPELINE_PRESETS;
}

export function savePipelines(pipelines: PipelineDefinition[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PIPELINES, JSON.stringify(pipelines));
  } catch (err) {
    console.warn('Erro ao salvar pipelines customizados:', err);
  }
}

export function getActivePipeline(): PipelineDefinition {
  const pipelines = getPipelines();
  try {
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_PIPELINE);
    if (activeId) {
      const found = pipelines.find((p) => p.id === activeId);
      if (found) return found;
    }
  } catch {}

  return pipelines[0] || INDUSTRY_PIPELINE_PRESETS[0];
}

export function setActivePipelineId(pipelineId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PIPELINE, pipelineId);
  } catch {}
}

export function savePipeline(pipeline: PipelineDefinition): void {
  const pipelines = getPipelines();
  const index = pipelines.findIndex((p) => p.id === pipeline.id);
  if (index >= 0) {
    pipelines[index] = pipeline;
  } else {
    pipelines.push(pipeline);
  }
  savePipelines(pipelines);
}

export function deletePipeline(id: string): boolean {
  const pipelines = getPipelines();
  if (pipelines.length <= 1) return false; // Impede deletar o último funil
  const updated = pipelines.filter((p) => p.id !== id);
  savePipelines(updated);

  const active = getActivePipeline();
  if (active.id === id) {
    setActivePipelineId(updated[0].id);
  }
  return true;
}
