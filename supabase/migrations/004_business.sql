-- ==========================================================================
-- SAATHI Database Foundation: 004_business.sql
-- Business Profiles and Business Ideas (User & AI Proposed)
-- ==========================================================================

-- Business Profiles Table
CREATE TABLE IF NOT EXISTS public.business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_category TEXT NOT NULL,
    business_subcategory TEXT,
    business_stage public.business_stage NOT NULL DEFAULT 'IDEA',
    description TEXT,
    experience_level TEXT,
    skills TEXT[] DEFAULT '{}',
    available_assets TEXT[] DEFAULT '{}',
    available_land TEXT,
    available_shop TEXT,
    existing_business TEXT,
    target_customers TEXT[] DEFAULT '{}',
    preferred_business_model TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_biz_profiles_user ON public.business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_biz_profiles_category ON public.business_profiles(business_category);
CREATE INDEX IF NOT EXISTS idx_biz_profiles_stage ON public.business_profiles(business_stage);
CREATE INDEX IF NOT EXISTS idx_biz_profiles_deleted ON public.business_profiles(deleted_at) WHERE deleted_at IS NULL;

CREATE TRIGGER set_business_profiles_updated_at
BEFORE UPDATE ON public.business_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Business Ideas Table (Distinguishing user proposed vs AI recommendations)
CREATE TABLE IF NOT EXISTS public.business_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    source public.business_idea_source NOT NULL DEFAULT 'user',
    opportunity_score NUMERIC(5,2) CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
    status public.business_idea_status NOT NULL DEFAULT 'proposed',
    reasoning TEXT,
    assumptions JSONB DEFAULT '{}'::jsonb,
    trust_info JSONB NOT NULL DEFAULT '{"level":"AI_ESTIMATE"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_biz_ideas_user ON public.business_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_biz_ideas_profile ON public.business_ideas(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_biz_ideas_status ON public.business_ideas(status);
CREATE INDEX IF NOT EXISTS idx_biz_ideas_source ON public.business_ideas(source);

CREATE TRIGGER set_business_ideas_updated_at
BEFORE UPDATE ON public.business_ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
