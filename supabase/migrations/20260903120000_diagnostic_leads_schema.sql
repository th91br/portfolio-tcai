-- =====================================================================
-- MIGRATION: TCA DIAGNÓSTICO & DASHBOARD DE LEADS
-- Criação de tabelas, índices, RLS e funções seguras (RPCs)
-- =====================================================================

-- 1. TABELA PRINCIPAL DE LEADS
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    status TEXT NOT NULL DEFAULT 'NOVO' CHECK (status IN ('NOVO', 'QUALIFICADO', 'CONTATADO', 'REUNIÃO', 'PROPOSTA', 'FECHADO', 'PERDIDO')),
    recommended_solution TEXT NOT NULL,
    solution_reason TEXT,
    score INTEGER NOT NULL DEFAULT 0,
    score_category TEXT NOT NULL DEFAULT 'INICIAL' CHECK (score_category IN ('ALTA PRIORIDADE', 'POTENCIAL', 'INICIAL')),
    consent_lgpd BOOLEAN NOT NULL DEFAULT true,
    origin TEXT DEFAULT 'Diagnóstico TCA',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    device TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABELA DE RESPOSTAS DO DIAGNÓSTICO
CREATE TABLE IF NOT EXISTS public.lead_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    question_title TEXT NOT NULL,
    answer_value TEXT NOT NULL,
    answer_label TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABELA DE SCORE DETALHADO DO LEAD
CREATE TABLE IF NOT EXISTS public.lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE UNIQUE,
    total_score INTEGER NOT NULL,
    fit_score INTEGER NOT NULL,
    intent_score INTEGER NOT NULL,
    urgency_score INTEGER NOT NULL,
    readiness_score INTEGER NOT NULL,
    score_category TEXT NOT NULL,
    breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TABELA DE EVENTOS DO DIAGNÓSTICO (TELEMETRIA E ANALYTICS)
CREATE TABLE IF NOT EXISTS public.lead_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    step_number INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. TABELA DE ANOTAÇÕES INTERNAS DO DASHBOARD
CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. TABELA DE HISTÓRICO DE STATUS (PIPELINE)
CREATE TABLE IF NOT EXISTS public.lead_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- ÍNDICES DE PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_recommended_solution ON public.leads(recommended_solution);
CREATE INDEX IF NOT EXISTS idx_lead_answers_lead_id ON public.lead_answers(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_scores_lead_id ON public.lead_scores(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_status_history_lead_id ON public.lead_status_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_events_session_id ON public.lead_events(session_id);
CREATE INDEX IF NOT EXISTS idx_lead_events_event_name ON public.lead_events(event_name);
CREATE INDEX IF NOT EXISTS idx_lead_events_created_at ON public.lead_events(created_at DESC);

-- =====================================================================
-- SEGURANÇA E POLÍTICAS ROW LEVEL SECURITY (RLS)
-- =====================================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;

-- Limpeza de políticas existentes para idempotência
DROP POLICY IF EXISTS "Authenticated users full access on leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users full access on lead_answers" ON public.lead_answers;
DROP POLICY IF EXISTS "Authenticated users full access on lead_scores" ON public.lead_scores;
DROP POLICY IF EXISTS "Authenticated users full access on lead_notes" ON public.lead_notes;
DROP POLICY IF EXISTS "Authenticated users full access on lead_status_history" ON public.lead_status_history;
DROP POLICY IF EXISTS "Authenticated users full access on lead_events" ON public.lead_events;
DROP POLICY IF EXISTS "Anon can insert events" ON public.lead_events;

-- Políticas de acesso total para usuários autenticados (Thiago no Dashboard)
CREATE POLICY "Authenticated users full access on leads"
    ON public.leads FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access on lead_answers"
    ON public.lead_answers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access on lead_scores"
    ON public.lead_scores FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access on lead_notes"
    ON public.lead_notes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access on lead_status_history"
    ON public.lead_status_history FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access on lead_events"
    ON public.lead_events FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Permissão para público/anônimo registrar eventos de analytics do diagnóstico
CREATE POLICY "Anon can insert events"
    ON public.lead_events FOR INSERT
    TO anon
    WITH CHECK (true);

-- =====================================================================
-- FUNÇÃO RPC TRANSACIONAL E ATÔMICA: submit_diagnostic_lead
-- Permite envio público seguro com validação sem expor leituras de outros leads
-- =====================================================================
CREATE OR REPLACE FUNCTION public.submit_diagnostic_lead(
    p_name TEXT,
    p_whatsapp TEXT,
    p_email TEXT,
    p_company TEXT,
    p_consent_lgpd BOOLEAN,
    p_recommended_solution TEXT,
    p_solution_reason TEXT,
    p_score INTEGER,
    p_score_category TEXT,
    p_fit_score INTEGER,
    p_intent_score INTEGER,
    p_urgency_score INTEGER,
    p_readiness_score INTEGER,
    p_score_breakdown JSONB,
    p_answers JSONB,
    p_origin TEXT DEFAULT 'Diagnóstico TCA',
    p_utm_source TEXT DEFAULT NULL,
    p_utm_medium TEXT DEFAULT NULL,
    p_utm_campaign TEXT DEFAULT NULL,
    p_utm_term TEXT DEFAULT NULL,
    p_utm_content TEXT DEFAULT NULL,
    p_device TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_lead_id UUID;
    v_answer JSONB;
BEGIN
    -- 1. Validações de segurança
    IF p_name IS NULL OR trim(p_name) = '' THEN
        RAISE EXCEPTION 'O nome é obrigatório.';
    END IF;

    IF p_whatsapp IS NULL OR trim(p_whatsapp) = '' THEN
        RAISE EXCEPTION 'O WhatsApp é obrigatório.';
    END IF;

    IF p_email IS NULL OR trim(p_email) = '' THEN
        RAISE EXCEPTION 'O E-mail é obrigatório.';
    END IF;

    IF p_consent_lgpd IS NOT TRUE THEN
        RAISE EXCEPTION 'O consentimento LGPD é obrigatório para envio do diagnóstico.';
    END IF;

    -- 2. Inserção na tabela principal leads
    INSERT INTO public.leads (
        name,
        whatsapp,
        email,
        company,
        status,
        recommended_solution,
        solution_reason,
        score,
        score_category,
        consent_lgpd,
        origin,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        device
    ) VALUES (
        trim(p_name),
        trim(p_whatsapp),
        lower(trim(p_email)),
        nullif(trim(p_company), ''),
        'NOVO',
        p_recommended_solution,
        p_solution_reason,
        COALESCE(p_score, 0),
        COALESCE(p_score_category, 'INICIAL'),
        p_consent_lgpd,
        COALESCE(p_origin, 'Diagnóstico TCA'),
        p_utm_source,
        p_utm_medium,
        p_utm_campaign,
        p_utm_term,
        p_utm_content,
        p_device
    )
    RETURNING id INTO v_lead_id;

    -- 3. Inserção das respostas individuais
    IF p_answers IS NOT NULL AND jsonb_array_length(p_answers) > 0 THEN
        FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
        LOOP
            INSERT INTO public.lead_answers (
                lead_id,
                step_number,
                question_id,
                question_title,
                answer_value,
                answer_label
            ) VALUES (
                v_lead_id,
                COALESCE((v_answer->>'step_number')::integer, 1),
                COALESCE(v_answer->>'question_id', 'unknown'),
                COALESCE(v_answer->>'question_title', ''),
                COALESCE(v_answer->>'answer_value', ''),
                COALESCE(v_answer->>'answer_label', '')
            );
        END LOOP;
    END IF;

    -- 4. Inserção do score detalhado
    INSERT INTO public.lead_scores (
        lead_id,
        total_score,
        fit_score,
        intent_score,
        urgency_score,
        readiness_score,
        score_category,
        breakdown
    ) VALUES (
        v_lead_id,
        COALESCE(p_score, 0),
        COALESCE(p_fit_score, 0),
        COALESCE(p_intent_score, 0),
        COALESCE(p_urgency_score, 0),
        COALESCE(p_readiness_score, 0),
        COALESCE(p_score_category, 'INICIAL'),
        COALESCE(p_score_breakdown, '{}'::jsonb)
    );

    -- 5. Registro do histórico inicial de status
    INSERT INTO public.lead_status_history (
        lead_id,
        old_status,
        new_status,
        changed_by
    ) VALUES (
        v_lead_id,
        NULL,
        'NOVO',
        'Sistema (Diagnóstico Concluído)'
    );

    -- 6. Registro do evento de conversão
    IF p_session_id IS NOT NULL THEN
        INSERT INTO public.lead_events (
            session_id,
            event_name,
            step_number,
            metadata
        ) VALUES (
            p_session_id,
            'diagnostic_lead_created',
            8,
            jsonb_build_object(
                'lead_id', v_lead_id,
                'recommended_solution', p_recommended_solution,
                'score', p_score,
                'score_category', p_score_category
            )
        );
    END IF;

    RETURN v_lead_id;
END;
$$;

-- Permissões de execução para a função de submissão
REVOKE ALL ON FUNCTION public.submit_diagnostic_lead FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_diagnostic_lead TO anon, authenticated, service_role;

-- =====================================================================
-- FUNÇÃO RPC PARA LOG DE EVENTOS (ANALYTICS DO FUNIL)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.log_diagnostic_event(
    p_session_id TEXT,
    p_event_name TEXT,
    p_step_number INTEGER DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.lead_events (
        session_id,
        event_name,
        step_number,
        metadata
    ) VALUES (
        COALESCE(p_session_id, gen_random_uuid()::text),
        p_event_name,
        p_step_number,
        COALESCE(p_metadata, '{}'::jsonb)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.log_diagnostic_event FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_diagnostic_event TO anon, authenticated, service_role;

-- =====================================================================
-- FUNÇÃO RPC PARA MUDANÇA DE STATUS NO KANBAN COM HISTÓRICO
-- =====================================================================
CREATE OR REPLACE FUNCTION public.update_lead_pipeline_status(
    p_lead_id UUID,
    p_new_status TEXT,
    p_changed_by TEXT DEFAULT 'Administrador'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_old_status TEXT;
BEGIN
    SELECT status INTO v_old_status FROM public.leads WHERE id = p_lead_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lead não encontrado.';
    END IF;

    IF v_old_status <> p_new_status THEN
        UPDATE public.leads
        SET status = p_new_status,
            updated_at = now()
        WHERE id = p_lead_id;

        INSERT INTO public.lead_status_history (
            lead_id,
            old_status,
            new_status,
            changed_by
        ) VALUES (
            p_lead_id,
            v_old_status,
            p_new_status,
            p_changed_by
        );
    END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.update_lead_pipeline_status FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_lead_pipeline_status TO authenticated, service_role;
