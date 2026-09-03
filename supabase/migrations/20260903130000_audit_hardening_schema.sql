-- =====================================================================
-- MIGRATION: HARDENING, SEGURANÇA E AUDITORIA (FASE 2)
-- Validações server-side, anti-flood, sanitização e isolamento de privilégios
-- =====================================================================

-- 1. ADICIONAR TIMESTAMP EXPLICITO DE CONSENTIMENTO LGPD
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ DEFAULT now();

-- 2. REFORÇO DE PERMISSÕES MÍNIMAS: REVOGAR QUALQUER ACESSO DIRETO DE ESCRITA/LEITURA ANON
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.leads FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.lead_answers FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.lead_scores FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.lead_notes FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.lead_status_history FROM anon;
REVOKE SELECT, UPDATE, DELETE ON public.lead_events FROM anon;

-- Permite apenas INSERT em lead_events para tracking anônimo
GRANT INSERT ON public.lead_events TO anon;

-- 3. RECRIAÇÃO ROBUSTA DA FUNÇÃO submit_diagnostic_lead COM VALIDAÇÕES RÍGIDAS
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
    v_clean_phone TEXT;
    v_clamped_score INTEGER;
BEGIN
    -- Validação: Nome
    IF p_name IS NULL OR length(trim(p_name)) < 2 THEN
        RAISE EXCEPTION 'O nome deve conter pelo menos 2 caracteres.';
    END IF;

    -- Validação: E-mail com Regex RFC básico
    IF p_email IS NULL OR lower(trim(p_email)) !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'O formato do e-mail informado é inválido.';
    END IF;

    -- Validação: Telefone limpo (mínimo 10 dígitos numéricos para DDD + número)
    v_clean_phone := regexp_replace(p_whatsapp, '\D', '', 'g');
    IF length(v_clean_phone) < 10 OR length(v_clean_phone) > 15 THEN
        RAISE EXCEPTION 'O WhatsApp deve conter DDD válido e no mínimo 10 dígitos numéricos.';
    END IF;

    -- Validação: Consentimento LGPD
    IF p_consent_lgpd IS NOT TRUE THEN
        RAISE EXCEPTION 'O consentimento LGPD é mandatório para submissão do projeto.';
    END IF;

    -- Proteção Anti-Flood / Anti-Spam (rejeita envios repetidos do mesmo e-mail ou telefone em menos de 30s)
    IF EXISTS (
        SELECT 1 FROM public.leads
        WHERE (email = lower(trim(p_email)) OR regexp_replace(whatsapp, '\D', '', 'g') = v_clean_phone)
        AND created_at > (now() - INTERVAL '30 seconds')
    ) THEN
        RAISE EXCEPTION 'Muitas solicitações em curto intervalo. Por favor aguarde 30 segundos antes de enviar novamente.';
    END IF;

    -- Clamping de segurança do Score (garante limites entre 0 e 100)
    v_clamped_score := GREATEST(0, LEAST(100, COALESCE(p_score, 0)));

    -- Inserção segura na tabela de leads
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
        consent_timestamp,
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
        COALESCE(p_recommended_solution, 'Solução TCA'),
        p_solution_reason,
        v_clamped_score,
        CASE
            WHEN v_clamped_score >= 70 THEN 'ALTA PRIORIDADE'
            WHEN v_clamped_score >= 40 THEN 'POTENCIAL'
            ELSE 'INICIAL'
        END,
        p_consent_lgpd,
        now(),
        COALESCE(p_origin, 'Diagnóstico TCA'),
        p_utm_source,
        p_utm_medium,
        p_utm_campaign,
        p_utm_term,
        p_utm_content,
        p_device
    )
    RETURNING id INTO v_lead_id;

    -- Inserção das respostas estruturadas
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

    -- Inserção do score detalhado com clamping nas dimensões
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
        v_clamped_score,
        GREATEST(0, LEAST(25, COALESCE(p_fit_score, 0))),
        GREATEST(0, LEAST(25, COALESCE(p_intent_score, 0))),
        GREATEST(0, LEAST(25, COALESCE(p_urgency_score, 0))),
        GREATEST(0, LEAST(25, COALESCE(p_readiness_score, 0))),
        CASE
            WHEN v_clamped_score >= 70 THEN 'ALTA PRIORIDADE'
            WHEN v_clamped_score >= 40 THEN 'POTENCIAL'
            ELSE 'INICIAL'
        END,
        COALESCE(p_score_breakdown, '{}'::jsonb)
    );

    -- Histórico inicial de status
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

    -- Evento de conversão
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
                'score', v_clamped_score,
                'score_category', CASE
                    WHEN v_clamped_score >= 70 THEN 'ALTA PRIORIDADE'
                    WHEN v_clamped_score >= 40 THEN 'POTENCIAL'
                    ELSE 'INICIAL'
                END
            )
        );
    END IF;

    RETURN v_lead_id;
END;
$$;

-- 4. RECRIAÇÃO DE log_diagnostic_event COM WHITELIST DE EVENTOS
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
    -- Whitelist de eventos conhecidos para evitar poluição da tabela
    IF p_event_name NOT IN (
        'diagnostic_view',
        'diagnostic_start',
        'diagnostic_step',
        'diagnostic_complete',
        'diagnostic_lead_created',
        'diagnostic_whatsapp_click'
    ) THEN
        RETURN; -- Ignora silenciosamente eventos não autorizados
    END IF;

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

-- 5. ATUALIZAÇÃO SEGURA DE update_lead_pipeline_status COM AUDITORIA
CREATE OR REPLACE FUNCTION public.update_lead_pipeline_status(
    p_lead_id UUID,
    p_new_status TEXT,
    p_changed_by TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_old_status TEXT;
    v_author TEXT;
BEGIN
    -- Auditoria do autor: usa o email do JWT autenticado ou fallback informado
    v_author := COALESCE(auth.jwt() ->> 'email', nullif(trim(p_changed_by), ''), 'Administrador TCA');

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
            v_author
        );
    END IF;
END;
$$;

-- Garantia de privilégios de execução
GRANT EXECUTE ON FUNCTION public.submit_diagnostic_lead TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.log_diagnostic_event TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_lead_pipeline_status TO authenticated, service_role;
