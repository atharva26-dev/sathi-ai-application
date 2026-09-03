-- ==========================================================================
-- SAATHI Database Foundation: 010_marketing.sql
-- Tactical Rural Marketing Plans and Phased Expansion Roadmaps
-- ==========================================================================

-- Marketing Plans Table (Tactical rural channels and customer acquisition playbooks)
CREATE TABLE IF NOT EXISTS public.marketing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_idea_id UUID NOT NULL REFERENCES public.business_ideas(id) ON DELETE CASCADE,
    target_customer TEXT NOT NULL,
    positioning TEXT NOT NULL,
    pricing_strategy JSONB NOT NULL DEFAULT '{}'::jsonb,
    channels JSONB NOT NULL DEFAULT '[]'::jsonb,
    customer_acquisition JSONB NOT NULL DEFAULT '[]'::jsonb,
    campaigns JSONB DEFAULT '[]'::jsonb,
    budget NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (budget >= 0),
    assumptions JSONB DEFAULT '{}'::jsonb,
    version INT NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mktg_plans_user ON public.marketing_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_mktg_plans_idea ON public.marketing_plans(business_idea_id);
CREATE TRIGGER set_marketing_plans_updated_at
BEFORE UPDATE ON public.marketing_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Expansion Plans Table (Phased roadmap with strict prerequisite safety gates)
CREATE TABLE IF NOT EXISTS public.expansion_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_idea_id UUID NOT NULL REFERENCES public.business_ideas(id) ON DELETE CASCADE,
    current_stage TEXT NOT NULL DEFAULT 'STAGE_1_ESTABLISHMENT',
    three_month_goals JSONB DEFAULT '[]'::jsonb,
    six_month_goals JSONB DEFAULT '[]'::jsonb,
    one_year_goals JSONB DEFAULT '[]'::jsonb,
    three_year_goals JSONB DEFAULT '[]'::jsonb,
    savings_target NUMERIC(14,2) DEFAULT 0.00 CHECK (savings_target >= 0),
    reinvestment_strategy JSONB DEFAULT '{}'::jsonb,
    expansion_conditions JSONB DEFAULT '[]'::jsonb, -- e.g. "Do not expand until 6 continuous months of prompt EMI repayment"
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expansion_plans_user ON public.expansion_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_expansion_plans_idea ON public.expansion_plans(business_idea_id);
CREATE TRIGGER set_expansion_plans_updated_at
BEFORE UPDATE ON public.expansion_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
