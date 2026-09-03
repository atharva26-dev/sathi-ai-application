-- ==========================================================================
-- SAATHI Database Foundation: 009_ai.sql
-- AI Analysis Results, Transparent Assumptions, Cost/Revenue Models,
-- and Non-Overwriting Simulation Scenarios
-- ==========================================================================

-- AI Analysis Results Table (Structured outputs, prompt versioning, and provenance)
CREATE TABLE IF NOT EXISTS public.ai_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN (
        'business_recommendation',
        'market_analysis',
        'swot',
        'risk_analysis',
        'pricing',
        'marketing',
        'expansion',
        'stress_test',
        'mentor_plan'
    )),
    entity_type TEXT NOT NULL, -- e.g. 'business_ideas', 'market_areas'
    entity_id UUID NOT NULL,
    input_snapshot JSONB NOT NULL,
    output JSONB NOT NULL,
    confidence NUMERIC(5,2) CHECK (confidence >= 0 AND confidence <= 100),
    data_sources JSONB DEFAULT '[]'::jsonb,
    assumptions JSONB DEFAULT '[]'::jsonb,
    model_identifier TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    analysis_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_results_user ON public.ai_analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_type ON public.ai_analysis_results(analysis_type);
CREATE INDEX IF NOT EXISTS idx_ai_results_entity ON public.ai_analysis_results(entity_type, entity_id);

-- Analysis Assumptions Table (Transparency: "What assumptions were made by AI?")
CREATE TABLE IF NOT EXISTS public.analysis_assumptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES public.ai_analysis_results(id) ON DELETE CASCADE,
    assumption_type TEXT NOT NULL, -- e.g. 'RAW_MATERIAL_PRICE', 'DAILY_DEMAND_CAPACITY', 'ENERGY_TARIFF'
    description TEXT NOT NULL,
    value JSONB DEFAULT '{}'::jsonb,
    importance TEXT NOT NULL DEFAULT 'HIGH' CHECK (importance IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assumptions_analysis ON public.analysis_assumptions(analysis_id);

-- Business Cost Models Table
CREATE TABLE IF NOT EXISTS public.business_cost_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_idea_id UUID NOT NULL REFERENCES public.business_ideas(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1 CHECK (version >= 1),
    equipment_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (equipment_cost >= 0),
    infrastructure_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (infrastructure_cost >= 0),
    inventory_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (inventory_cost >= 0),
    working_capital NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (working_capital >= 0),
    labour_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (labour_cost >= 0),
    rent NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (rent >= 0),
    utilities NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (utilities >= 0),
    transport NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (transport >= 0),
    marketing NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (marketing >= 0),
    other_costs NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (other_costs >= 0),
    total_cost NUMERIC(14,2) NOT NULL CHECK (total_cost >= 0),
    assumptions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cost_models_idea ON public.business_cost_models(business_idea_id);

-- Business Revenue Models Table
CREATE TABLE IF NOT EXISTS public.business_revenue_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_idea_id UUID NOT NULL REFERENCES public.business_ideas(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1 CHECK (version >= 1),
    product TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    expected_volume NUMERIC(12,2) NOT NULL CHECK (expected_volume >= 0),
    selling_price NUMERIC(14,2) NOT NULL CHECK (selling_price >= 0),
    monthly_revenue NUMERIC(14,2) NOT NULL CHECK (monthly_revenue >= 0),
    seasonality JSONB DEFAULT '{}'::jsonb,
    assumptions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rev_models_idea ON public.business_revenue_models(business_idea_id);

-- Business Simulations Table (Does not overwrite past scenario simulations)
CREATE TABLE IF NOT EXISTS public.business_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_idea_id UUID NOT NULL REFERENCES public.business_ideas(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL CHECK (scenario_name IN ('base', 'optimistic', 'pessimistic', 'stress_test', 'custom')),
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_biz_sims_user ON public.business_simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_biz_sims_idea ON public.business_simulations(business_idea_id);
