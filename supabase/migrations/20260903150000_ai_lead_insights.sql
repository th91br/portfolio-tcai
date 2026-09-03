-- =====================================================================
-- MIGRATION: FASE 4 — TCA SALES COPILOT COM IA (PERSISTÊNCIA & INSIGHTS)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.ai_lead_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL DEFAULT 'full_analysis'
        CHECK (insight_type IN ('full_analysis', 'meeting_prep', 'proposal_strategy', 'loss_analysis')),
    structured_output JSONB NOT NULL,
    model TEXT DEFAULT 'sales_copilot_v1',
    prompt_version TEXT NOT NULL DEFAULT 'sales_copilot_v1',
    source_snapshot_hash TEXT NOT NULL,
    helpful_feedback BOOLEAN DEFAULT NULL,
    tokens_usage JSONB DEFAULT '{}'::jsonb,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    generated_by TEXT DEFAULT 'Thiago',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para busca rápida, cache por hash e histórico temporal
CREATE INDEX IF NOT EXISTS idx_ai_lead_insights_lead_id ON public.ai_lead_insights(lead_id);
CREATE INDEX IF NOT EXISTS idx_ai_lead_insights_hash ON public.ai_lead_insights(source_snapshot_hash);
CREATE INDEX IF NOT EXISTS idx_ai_lead_insights_created_at ON public.ai_lead_insights(created_at DESC);

-- RLS: Apenas usuário administrativo autenticado pode acessar
ALTER TABLE public.ai_lead_insights ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.ai_lead_insights FROM anon;

DROP POLICY IF EXISTS "Admin full access on ai_lead_insights" ON public.ai_lead_insights;
CREATE POLICY "Admin full access on ai_lead_insights" 
ON public.ai_lead_insights FOR ALL TO authenticated 
USING (true) WITH CHECK (true);
