-- ==========================================================================
-- SAATHI Database Foundation: 005_finance.sql
-- Financial Profiles, PS-91 Project Structuring, and Immutable Snapshots
-- ==========================================================================

-- User Resources Table
CREATE TABLE IF NOT EXISTS public.user_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    capital_available NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (capital_available >= 0),
    land_available TEXT,
    shop_available TEXT,
    equipment_available TEXT[] DEFAULT '{}',
    vehicle_available TEXT[] DEFAULT '{}',
    livestock_available TEXT,
    family_support TEXT,
    skills TEXT[] DEFAULT '{}',
    experience TEXT,
    other_resources JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_resources_user ON public.user_resources(user_id);
CREATE TRIGGER set_user_resources_updated_at
BEFORE UPDATE ON public.user_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Financial Profiles Table
CREATE TABLE IF NOT EXISTS public.financial_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    available_margin NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (available_margin >= 0),
    existing_savings NUMERIC(14,2) DEFAULT 0.00 CHECK (existing_savings >= 0),
    existing_business_cash NUMERIC(14,2) DEFAULT 0.00 CHECK (existing_business_cash >= 0),
    other_available_capital NUMERIC(14,2) DEFAULT 0.00 CHECK (other_available_capital >= 0),
    monthly_household_commitments NUMERIC(14,2) DEFAULT 0.00 CHECK (monthly_household_commitments >= 0),
    preferred_investment NUMERIC(14,2) DEFAULT 0.00 CHECK (preferred_investment >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fin_profiles_user ON public.financial_profiles(user_id);
CREATE TRIGGER set_financial_profiles_updated_at
BEFORE UPDATE ON public.financial_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Project Plans Table (PS-91 Project Cost Allocation)
CREATE TABLE IF NOT EXISTS public.project_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL,
    project_name TEXT NOT NULL,
    total_project_cost NUMERIC(14,2) NOT NULL CHECK (total_project_cost >= 0),
    own_contribution NUMERIC(14,2) NOT NULL CHECK (own_contribution >= 0),
    loan_component NUMERIC(14,2) NOT NULL CHECK (loan_component >= 0),
    working_capital NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (working_capital >= 0),
    equipment_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (equipment_cost >= 0),
    infrastructure_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (infrastructure_cost >= 0),
    inventory_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (inventory_cost >= 0),
    marketing_budget NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (marketing_budget >= 0),
    emergency_reserve NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (emergency_reserve >= 0),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'submitted_for_appraisal', 'archived')),
    version INT NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_plans_user ON public.project_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_project_plans_biz ON public.project_plans(business_profile_id);
CREATE TRIGGER set_project_plans_updated_at
BEFORE UPDATE ON public.project_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Financial Calculation Snapshots (Immutable calculation history for audit and reproducibility)
CREATE TABLE IF NOT EXISTS public.financial_calculation_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_plan_id UUID REFERENCES public.project_plans(id) ON DELETE SET NULL,
    calculation_type TEXT NOT NULL CHECK (calculation_type IN (
        'margin_to_project',
        'loan_structure',
        'emi',
        'cash_flow',
        'break_even',
        'working_capital',
        'scenario_analysis'
    )),
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    rule_version TEXT NOT NULL DEFAULT 'v1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calc_snapshots_user ON public.financial_calculation_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_calc_snapshots_type ON public.financial_calculation_snapshots(calculation_type);
CREATE INDEX IF NOT EXISTS idx_calc_snapshots_created ON public.financial_calculation_snapshots(created_at DESC);
