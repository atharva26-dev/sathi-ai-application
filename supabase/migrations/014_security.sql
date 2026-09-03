-- ==========================================================================
-- SAATHI Database Foundation: 014_security.sql
-- Row Level Security (RLS) Policies, Audit Logs, and Storage Architecture
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. AUDIT LOG ARCHITECTURE
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_type public.actor_type NOT NULL DEFAULT 'user',
    action TEXT NOT NULL, -- e.g. 'UPDATE_PROFILE', 'GENERATE_FINANCIAL_PLAN', 'ASSESS_SCHEME'
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb, -- Safe metadata (NO passwords, NO tokens)
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- --------------------------------------------------------------------------
-- 2. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- --------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_calculation_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_eligibility_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repayment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repayment_schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_source_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_assumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_cost_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_revenue_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expansion_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localized_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 3. PUBLIC & REFERENCE DATA READ POLICIES
-- --------------------------------------------------------------------------

-- Master Locations
CREATE POLICY "Public read location masters"
ON public.location_masters FOR SELECT
TO authenticated, anon
USING (true);

-- Government Schemes & Documents
CREATE POLICY "Public read active schemes"
ON public.schemes FOR SELECT
TO authenticated, anon
USING (status = 'active');

CREATE POLICY "Public read scheme rules"
ON public.scheme_rules FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Public read scheme documents"
ON public.scheme_documents FOR SELECT
TO authenticated, anon
USING (true);

-- Loan Products
CREATE POLICY "Public read active loan products"
ON public.loan_products FOR SELECT
TO authenticated, anon
USING (status = 'active');

-- Market Intelligence Reference Data
CREATE POLICY "Public read data sources"
ON public.data_sources FOR SELECT
TO authenticated, anon
USING (status = 'active');

CREATE POLICY "Public read data source references"
ON public.data_source_references FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Public read market areas"
ON public.market_areas FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Public read market indicators"
ON public.market_indicators FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Public read competitor records"
ON public.competitor_records FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Public read distribution channels"
ON public.distribution_channels FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Public read supplier records"
ON public.supplier_records FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Public read market opportunities"
ON public.market_opportunities FOR SELECT
TO authenticated, anon
USING (true);

-- Multilingual Localized Content
CREATE POLICY "Public read localized content"
ON public.localized_content FOR SELECT
TO authenticated, anon
USING (true);

-- --------------------------------------------------------------------------
-- 4. USER DATA ISOLATION POLICIES (Strict auth.uid() = user_id)
-- --------------------------------------------------------------------------

-- Profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Consents & Devices
CREATE POLICY "Users manage own consents"
ON public.user_consents FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own devices"
ON public.user_devices FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Locations
CREATE POLICY "Users manage own locations"
ON public.user_locations FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Business Domain
CREATE POLICY "Users manage own business profiles"
ON public.business_profiles FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own business ideas"
ON public.business_ideas FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own cost models"
ON public.business_cost_models FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.business_ideas
    WHERE business_ideas.id = business_cost_models.business_idea_id
    AND business_ideas.user_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.business_ideas
    WHERE business_ideas.id = business_cost_models.business_idea_id
    AND business_ideas.user_id = auth.uid()
));

CREATE POLICY "Users manage own revenue models"
ON public.business_revenue_models FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.business_ideas
    WHERE business_ideas.id = business_revenue_models.business_idea_id
    AND business_ideas.user_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.business_ideas
    WHERE business_ideas.id = business_revenue_models.business_idea_id
    AND business_ideas.user_id = auth.uid()
));

-- Financial Domain
CREATE POLICY "Users manage own resources"
ON public.user_resources FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own financial profiles"
ON public.financial_profiles FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own project plans"
ON public.project_plans FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own financial snapshots"
ON public.financial_calculation_snapshots FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Assessments & Loans
CREATE POLICY "Users view own scheme assessments"
ON public.scheme_eligibility_assessments FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own loan assessments"
ON public.loan_assessments FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own repayment schedules"
ON public.repayment_schedules FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own repayment schedule items"
ON public.repayment_schedule_items FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.repayment_schedules
    WHERE repayment_schedules.id = repayment_schedule_items.repayment_schedule_id
    AND repayment_schedules.user_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.repayment_schedules
    WHERE repayment_schedules.id = repayment_schedule_items.repayment_schedule_id
    AND repayment_schedules.user_id = auth.uid()
));

-- Market Reports & AI Results
CREATE POLICY "Users manage own market reports"
ON public.market_reports FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own AI results"
ON public.ai_analysis_results FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own analysis assumptions"
ON public.analysis_assumptions FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.ai_analysis_results
    WHERE ai_analysis_results.id = analysis_assumptions.analysis_id
    AND ai_analysis_results.user_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.ai_analysis_results
    WHERE ai_analysis_results.id = analysis_assumptions.analysis_id
    AND ai_analysis_results.user_id = auth.uid()
));

CREATE POLICY "Users manage own simulations"
ON public.business_simulations FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Marketing & Expansion
CREATE POLICY "Users manage own marketing plans"
ON public.marketing_plans FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own expansion plans"
ON public.expansion_plans FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Mentorship
CREATE POLICY "Users manage own mentor plans"
ON public.mentor_plans FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own mentor tasks"
ON public.mentor_tasks FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.mentor_plans
    WHERE mentor_plans.id = mentor_tasks.mentor_plan_id
    AND mentor_plans.user_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.mentor_plans
    WHERE mentor_plans.id = mentor_tasks.mentor_plan_id
    AND mentor_plans.user_id = auth.uid()
));

-- Conversations & Voice
CREATE POLICY "Users manage own conversations"
ON public.conversations FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own conversation messages"
ON public.conversation_messages FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = conversation_messages.conversation_id
    AND conversations.user_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = conversation_messages.conversation_id
    AND conversations.user_id = auth.uid()
));

CREATE POLICY "Users manage own voice sessions"
ON public.voice_sessions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Sync & Notifications
CREATE POLICY "Users manage own sync records"
ON public.sync_records FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own notifications"
ON public.notifications FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Audit logs (Users can only see their own audit trail; service role can insert)
CREATE POLICY "Users view own audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role manages audit logs"
ON public.audit_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- --------------------------------------------------------------------------
-- 5. SUPABASE STORAGE BUCKET CONFIGURATION & POLICIES
-- --------------------------------------------------------------------------

-- Storage Buckets (Ensured in storage.buckets)
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('profile_assets', 'profile_assets', false),
    ('report_exports', 'report_exports', false),
    ('voice_recordings', 'voice_recordings', false),
    ('scheme_documents', 'scheme_documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Profile Assets (Users access only their own folder: userId/*)
CREATE POLICY "User profile asset access"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'profile_assets' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'profile_assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage Policy: Report Exports
CREATE POLICY "User report export access"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'report_exports' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'report_exports' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage Policy: Voice Recordings (Short retention, user-isolated)
CREATE POLICY "User voice recording access"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'voice_recordings' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'voice_recordings' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage Policy: Scheme Documents (Public read)
CREATE POLICY "Public scheme document read"
ON storage.objects FOR SELECT
TO authenticated, anon
USING (bucket_id = 'scheme_documents');
