-- =====================================================================
-- MIGRATION: FASE 4 — EXCLUSIVE ADMIN LOCKDOWN (SEGURANÇA PREMIUM)
-- =====================================================================
-- Esta migration garante matematicamente no nível do banco de dados que:
-- 1. NENHUM outro usuário pode ser criado em auth.users.
-- 2. APENAS o e-mail thiago91cassol@hotmail.com tem permissão RLS de leitura/escrita.
-- =====================================================================

-- 1. FUNÇÃO E TRIGGER PARA BLOQUEAR QUALQUER NOVO CADASTRO EM AUTH.USERS
CREATE OR REPLACE FUNCTION public.lock_admin_signups()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF LOWER(NEW.email) != 'thiago91cassol@hotmail.com' THEN
    RAISE EXCEPTION 'Acesso Negado: Novos cadastros estão permanentemente bloqueados neste sistema.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lock_admin_signups ON auth.users;
CREATE TRIGGER trg_lock_admin_signups
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.lock_admin_signups();

-- 2. FUNÇÃO HELPER PARA VALIDAÇÃO SEGURA DE ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'thiago91cassol@hotmail.com');
$$;

-- 3. POLÍTICAS RLS BLINDADAS PARA TODAS AS TABELAS DO CRM

-- A) LEADS
DROP POLICY IF EXISTS "Admin full access on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated full access to leads" ON public.leads;
CREATE POLICY "Exclusive admin access on leads" 
ON public.leads FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- B) LEAD_ANSWERS
DROP POLICY IF EXISTS "Admin full access on lead_answers" ON public.lead_answers;
DROP POLICY IF EXISTS "Allow authenticated full access to lead_answers" ON public.lead_answers;
CREATE POLICY "Exclusive admin access on lead_answers" 
ON public.lead_answers FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- C) LEAD_SCORES
DROP POLICY IF EXISTS "Admin full access on lead_scores" ON public.lead_scores;
DROP POLICY IF EXISTS "Allow authenticated full access to lead_scores" ON public.lead_scores;
CREATE POLICY "Exclusive admin access on lead_scores" 
ON public.lead_scores FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- D) LEAD_NOTES
DROP POLICY IF EXISTS "Admin full access on lead_notes" ON public.lead_notes;
DROP POLICY IF EXISTS "Allow authenticated full access to lead_notes" ON public.lead_notes;
CREATE POLICY "Exclusive admin access on lead_notes" 
ON public.lead_notes FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- E) LEAD_EVENTS
DROP POLICY IF EXISTS "Admin full access on lead_events" ON public.lead_events;
DROP POLICY IF EXISTS "Allow authenticated full access to lead_events" ON public.lead_events;
CREATE POLICY "Exclusive admin access on lead_events" 
ON public.lead_events FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- F) LEAD_STATUS_HISTORY
DROP POLICY IF EXISTS "Admin full access on lead_status_history" ON public.lead_status_history;
DROP POLICY IF EXISTS "Allow authenticated full access to lead_status_history" ON public.lead_status_history;
CREATE POLICY "Exclusive admin access on lead_status_history" 
ON public.lead_status_history FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- G) DEALS
DROP POLICY IF EXISTS "Admin full access on deals" ON public.deals;
CREATE POLICY "Exclusive admin access on deals" 
ON public.deals FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- H) FOLLOW_UPS
DROP POLICY IF EXISTS "Admin full access on follow_ups" ON public.follow_ups;
CREATE POLICY "Exclusive admin access on follow_ups" 
ON public.follow_ups FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- I) NOTIFICATIONS
DROP POLICY IF EXISTS "Admin full access on notifications" ON public.notifications;
CREATE POLICY "Exclusive admin access on notifications" 
ON public.notifications FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- J) AI_LEAD_INSIGHTS
DROP POLICY IF EXISTS "Admin full access on ai_lead_insights" ON public.ai_lead_insights;
CREATE POLICY "Exclusive admin access on ai_lead_insights" 
ON public.ai_lead_insights FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());
