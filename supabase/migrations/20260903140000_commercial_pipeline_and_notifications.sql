-- =====================================================================
-- MIGRATION: FASE 3 — PIPELINE COMERCIAL, DEALS, NOTIFICAÇÕES & FOLLOW-UPS
-- =====================================================================

-- 1. ATUALIZAR CONSTRAINT DE STATUS EM LEADS PARA 8 ETAPAS
ALTER TABLE public.leads 
DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE public.leads 
ADD CONSTRAINT leads_status_check 
CHECK (status IN ('NOVO', 'QUALIFICADO', 'CONTATADO', 'REUNIÃO', 'PROPOSTA', 'NEGOCIAÇÃO', 'FECHADO', 'PERDIDO'));

-- 2. TABELA DE NEGÓCIOS / OPORTUNIDADES (DEALS)
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    pipeline_stage TEXT NOT NULL DEFAULT 'NOVO' 
        CHECK (pipeline_stage IN ('NOVO', 'QUALIFICADO', 'CONTATADO', 'REUNIÃO', 'PROPOSTA', 'NEGOCIAÇÃO', 'FECHADO', 'PERDIDO')),
    estimated_value NUMERIC(12,2) DEFAULT NULL,
    proposed_value NUMERIC(12,2) DEFAULT NULL,
    final_value NUMERIC(12,2) DEFAULT NULL,
    probability INTEGER NOT NULL DEFAULT 10 
        CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE DEFAULT NULL,
    proposal_date DATE DEFAULT NULL,
    closed_at TIMESTAMPTZ DEFAULT NULL,
    lost_reason TEXT DEFAULT NULL,
    lost_observation TEXT DEFAULT NULL,
    next_action TEXT DEFAULT NULL,
    next_action_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance e consultas analíticas
CREATE INDEX IF NOT EXISTS idx_deals_lead_id ON public.deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_deals_closed_at ON public.deals(closed_at);
CREATE INDEX IF NOT EXISTS idx_deals_next_action_at ON public.deals(next_action_at);

-- 3. TABELA DE FOLLOW-UPS (PRÓXIMAS AÇÕES)
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    notes TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'PENDENTE' 
        CHECK (status IN ('PENDENTE', 'CONCLUIDO', 'CANCELADO')),
    completed_at TIMESTAMPTZ DEFAULT NULL,
    completed_by TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_deal_id ON public.follow_ups(deal_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_scheduled_at ON public.follow_ups(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_ups(status);

-- 4. TABELA DE NOTIFICAÇÕES INTERNAS DO CRM
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL 
        CHECK (type IN ('novo_lead', 'alta_prioridade', 'followup_hoje', 'followup_atrasado', 'proposta', 'fechado', 'perdido', 'sistema')),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ DEFAULT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 5. ATIVAÇÃO DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Revoga acesso anônimo total
REVOKE ALL ON public.deals FROM anon;
REVOKE ALL ON public.follow_ups FROM anon;
REVOKE ALL ON public.notifications FROM anon;

-- Políticas para usuários autenticados (Admin)
DROP POLICY IF EXISTS "Admin full access on deals" ON public.deals;
CREATE POLICY "Admin full access on deals" 
ON public.deals FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access on follow_ups" ON public.follow_ups;
CREATE POLICY "Admin full access on follow_ups" 
ON public.follow_ups FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access on notifications" ON public.notifications;
CREATE POLICY "Admin full access on notifications" 
ON public.notifications FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

-- 6. MIGRAÇÃO DE DADOS EXISTENTES (CRIAR DEALS PARA LEADS QUE AINDA NÃO POSSUEM)
INSERT INTO public.deals (lead_id, title, pipeline_stage, probability, created_at, updated_at)
SELECT 
    l.id, 
    COALESCE(l.company, l.name) || ' — ' || COALESCE(l.recommended_solution, 'Projeto Digital'),
    CASE 
        WHEN l.status IN ('NOVO', 'QUALIFICADO', 'CONTATADO', 'REUNIÃO', 'PROPOSTA', 'NEGOCIAÇÃO', 'FECHADO', 'PERDIDO') THEN l.status
        ELSE 'NOVO'
    END,
    CASE 
        WHEN l.status = 'FECHADO' THEN 100
        WHEN l.status = 'NEGOCIAÇÃO' THEN 80
        WHEN l.status = 'PROPOSTA' THEN 65
        WHEN l.status = 'REUNIÃO' THEN 50
        WHEN l.status = 'CONTATADO' THEN 30
        WHEN l.status = 'QUALIFICADO' THEN 20
        WHEN l.status = 'PERDIDO' THEN 0
        ELSE 10
    END,
    l.created_at,
    l.updated_at
FROM public.leads l
WHERE NOT EXISTS (SELECT 1 FROM public.deals d WHERE d.lead_id = l.id);

-- 7. ATUALIZAÇÃO DA RPC submit_diagnostic_lead PARA GERAR DEAL E NOTIFICAÇÃO
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
    v_deal_id UUID;
    v_answer JSONB;
    v_clean_phone TEXT;
    v_clamped_score INTEGER;
    v_deal_title TEXT;
    v_score_cat TEXT;
BEGIN
    -- Validações de entrada
    IF p_name IS NULL OR length(trim(p_name)) < 2 THEN
        RAISE EXCEPTION 'O nome deve conter pelo menos 2 caracteres.';
    END IF;

    IF p_email IS NULL OR lower(trim(p_email)) !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'O formato do e-mail informado é inválido.';
    END IF;

    v_clean_phone := regexp_replace(p_whatsapp, '\D', '', 'g');
    IF length(v_clean_phone) < 10 OR length(v_clean_phone) > 15 THEN
        RAISE EXCEPTION 'O WhatsApp deve conter DDD válido e no mínimo 10 dígitos numéricos.';
    END IF;

    IF p_consent_lgpd IS NOT TRUE THEN
        RAISE EXCEPTION 'O consentimento LGPD é mandatório para submissão do projeto.';
    END IF;

    -- Anti-flood 30 segundos
    IF EXISTS (
        SELECT 1 FROM public.leads
        WHERE (email = lower(trim(p_email)) OR regexp_replace(whatsapp, '\D', '', 'g') = v_clean_phone)
        AND created_at > (now() - INTERVAL '30 seconds')
    ) THEN
        RAISE EXCEPTION 'Muitas solicitações em curto intervalo. Aguarde 30 segundos.';
    END IF;

    v_clamped_score := GREATEST(0, LEAST(100, COALESCE(p_score, 0)));
    v_score_cat := CASE
        WHEN v_clamped_score >= 70 THEN 'ALTA PRIORIDADE'
        WHEN v_clamped_score >= 40 THEN 'POTENCIAL'
        ELSE 'INICIAL'
    END;

    -- Inserir Lead
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
        v_score_cat,
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

    -- Inserir Respostas
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

    -- Inserir Lead Score
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
        v_score_cat,
        COALESCE(p_score_breakdown, '{}'::jsonb)
    );

    -- Inserir Histórico de Status
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

    -- CRIAR AUTOMATICAMENTE A OPORTUNIDADE COMERCIAL (DEAL)
    v_deal_title := COALESCE(nullif(trim(p_company), ''), trim(p_name)) || ' — ' || COALESCE(p_recommended_solution, 'Projeto Digital');
    INSERT INTO public.deals (
        lead_id,
        title,
        pipeline_stage,
        probability,
        next_action,
        next_action_at
    ) VALUES (
        v_lead_id,
        v_deal_title,
        'NOVO',
        10,
        'Primeiro contato via WhatsApp para alinhamento',
        now() + INTERVAL '2 hours'
    )
    RETURNING id INTO v_deal_id;

    -- CRIAR NOTIFICAÇÃO INTERNA NO CRM
    IF v_score_cat = 'ALTA PRIORIDADE' THEN
        INSERT INTO public.notifications (
            title,
            message,
            type,
            lead_id,
            deal_id,
            metadata
        ) VALUES (
            'NOVO LEAD — ALTA PRIORIDADE',
            trim(p_name) || ' • ' || COALESCE(p_recommended_solution, 'Projeto') || ' (Score: ' || v_clamped_score || ')',
            'alta_prioridade',
            v_lead_id,
            v_deal_id,
            jsonb_build_object(
                'score', v_clamped_score,
                'solution', p_recommended_solution,
                'company', p_company
            )
        );
    ELSE
        INSERT INTO public.notifications (
            title,
            message,
            type,
            lead_id,
            deal_id,
            metadata
        ) VALUES (
            'Novo Lead Captado',
            trim(p_name) || ' • ' || COALESCE(p_recommended_solution, 'Projeto'),
            'novo_lead',
            v_lead_id,
            v_deal_id,
            jsonb_build_object(
                'score', v_clamped_score,
                'solution', p_recommended_solution
            )
        );
    END IF;

    -- Evento de Conversão
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
                'deal_id', v_deal_id,
                'recommended_solution', p_recommended_solution,
                'score', v_clamped_score,
                'score_category', v_score_cat
            )
        );
    END IF;

    RETURN v_lead_id;
END;
$$;

-- 8. FUNÇÃO RPC PARA TRANSIÇÃO DE ESTÁGIO DE NEGÓCIO COM AUDITORIA
CREATE OR REPLACE FUNCTION public.update_deal_stage(
    p_deal_id UUID,
    p_new_stage TEXT,
    p_final_value NUMERIC DEFAULT NULL,
    p_lost_reason TEXT DEFAULT NULL,
    p_lost_observation TEXT DEFAULT NULL,
    p_probability INTEGER DEFAULT NULL,
    p_changed_by TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_deal RECORD;
    v_suggested_prob INTEGER;
    v_author TEXT;
BEGIN
    SELECT * INTO v_deal FROM public.deals WHERE id = p_deal_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Oportunidade não encontrada.';
    END IF;

    v_author := COALESCE(auth.jwt() ->> 'email', nullif(trim(p_changed_by), ''), 'Administrador TCA');

    -- Sugestão padrão de probabilidade por etapa caso não informada
    IF p_probability IS NOT NULL THEN
        v_suggested_prob := GREATEST(0, LEAST(100, p_probability));
    ELSE
        v_suggested_prob := CASE
            WHEN p_new_stage = 'FECHADO' THEN 100
            WHEN p_new_stage = 'NEGOCIAÇÃO' THEN 80
            WHEN p_new_stage = 'PROPOSTA' THEN 65
            WHEN p_new_stage = 'REUNIÃO' THEN 50
            WHEN p_new_stage = 'CONTATADO' THEN 30
            WHEN p_new_stage = 'QUALIFICADO' THEN 20
            WHEN p_new_stage = 'PERDIDO' THEN 0
            ELSE 10
        END;
    END IF;

    -- Atualiza Deal
    UPDATE public.deals
    SET pipeline_stage = p_new_stage,
        probability = v_suggested_prob,
        final_value = CASE WHEN p_new_stage = 'FECHADO' THEN COALESCE(p_final_value, final_value, proposed_value, estimated_value) ELSE final_value END,
        closed_at = CASE WHEN p_new_stage = 'FECHADO' THEN now() ELSE closed_at END,
        lost_reason = CASE WHEN p_new_stage = 'PERDIDO' THEN p_lost_reason ELSE lost_reason END,
        lost_observation = CASE WHEN p_new_stage = 'PERDIDO' THEN p_lost_observation ELSE lost_observation END,
        updated_at = now()
    WHERE id = p_deal_id;

    -- Sincroniza Lead
    UPDATE public.leads
    SET status = p_new_stage,
        updated_at = now()
    WHERE id = v_deal.lead_id;

    -- Registra Histórico
    INSERT INTO public.lead_status_history (
        lead_id,
        old_status,
        new_status,
        changed_by
    ) VALUES (
        v_deal.lead_id,
        v_deal.pipeline_stage,
        p_new_stage,
        v_author
    );

    -- Notificações contextuais
    IF p_new_stage = 'PROPOSTA' AND v_deal.pipeline_stage <> 'PROPOSTA' THEN
        INSERT INTO public.notifications (title, message, type, lead_id, deal_id)
        VALUES ('Proposta Comercial Enviada', 'Oportunidade "' || v_deal.title || '" avançou para Proposta.', 'proposta', v_deal.lead_id, p_deal_id);
    ELSIF p_new_stage = 'FECHADO' AND v_deal.pipeline_stage <> 'FECHADO' THEN
        INSERT INTO public.notifications (title, message, type, lead_id, deal_id)
        VALUES ('🎉 Negócio Fechado!', 'Oportunidade "' || v_deal.title || '" foi CONCLUÍDA com sucesso.', 'fechado', v_deal.lead_id, p_deal_id);
    ELSIF p_new_stage = 'PERDIDO' AND v_deal.pipeline_stage <> 'PERDIDO' THEN
        INSERT INTO public.notifications (title, message, type, lead_id, deal_id)
        VALUES ('Oportunidade Perdida', 'Negócio "' || v_deal.title || '" marcado como Perdido (' || COALESCE(p_lost_reason, 'Não especificado') || ').', 'perdido', v_deal.lead_id, p_deal_id);
    END IF;
END;
$$;

-- Permissões de Execução
GRANT EXECUTE ON FUNCTION public.update_deal_stage TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.submit_diagnostic_lead TO anon, authenticated, service_role;
