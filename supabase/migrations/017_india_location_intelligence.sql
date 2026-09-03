-- ==========================================================================
-- SAATHI Database Foundation: 017_india_location_intelligence.sql
-- India Geographic Master, State/Taluka Knowledge & User Observation Engine
-- Multi-Tier Administrative Schema: India -> State -> District -> Taluka -> Village
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. STATE & UNION TERRITORY PROFILES TABLE
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.state_profiles (
    state_lgd_code INTEGER PRIMARY KEY,
    state_name TEXT NOT NULL,
    capital TEXT NOT NULL,
    state_type TEXT NOT NULL CHECK (state_type IN ('STATE', 'UNION_TERRITORY')),
    geography_and_climate TEXT NOT NULL,
    dominant_economic_sectors JSONB NOT NULL DEFAULT '[]'::jsonb,
    major_agricultural_sectors JSONB NOT NULL DEFAULT '[]'::jsonb,
    major_crops JSONB NOT NULL DEFAULT '[]'::jsonb,
    major_livestock_and_fisheries JSONB NOT NULL DEFAULT '[]'::jsonb,
    prominent_msme_industries JSONB NOT NULL DEFAULT '[]'::jsonb,
    traditional_crafts JSONB NOT NULL DEFAULT '[]'::jsonb,
    key_commercial_centres JSONB NOT NULL DEFAULT '[]'::jsonb,
    major_logistics_corridors JSONB NOT NULL DEFAULT '[]'::jsonb,
    seasonal_patterns JSONB NOT NULL DEFAULT '{}'::jsonb,
    state_specific_risks JSONB NOT NULL DEFAULT '[]'::jsonb,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. TALUKA / TEHSIL PROFILES TABLE
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.taluka_profiles (
    subdistrict_lgd_code INTEGER PRIMARY KEY,
    subdistrict_name TEXT NOT NULL,
    district_lgd_code INTEGER NOT NULL,
    district_name TEXT NOT NULL,
    state_lgd_code INTEGER NOT NULL REFERENCES public.state_profiles(state_lgd_code) ON DELETE CASCADE,
    local_geographic_features TEXT NOT NULL,
    major_crops_and_surplus JSONB NOT NULL DEFAULT '[]'::jsonb,
    local_markets_and_apmcs JSONB NOT NULL DEFAULT '[]'::jsonb,
    prominent_local_occupations JSONB NOT NULL DEFAULT '[]'::jsonb,
    primary_enterprise_clusters JSONB NOT NULL DEFAULT '[]'::jsonb,
    infrastructure_rating TEXT NOT NULL DEFAULT 'MEDIUM',
    water_and_power_availability TEXT NOT NULL,
    seasonal_trading_periods JSONB NOT NULL DEFAULT '[]'::jsonb,
    local_risks JSONB NOT NULL DEFAULT '[]'::jsonb,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_taluka_district ON public.taluka_profiles(district_lgd_code);

-- --------------------------------------------------------------------------
-- 3. BUSINESS TAXONOMY ARCHETYPES TABLE
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.business_taxonomy (
    id TEXT PRIMARY KEY,
    sector TEXT NOT NULL,
    sub_sector TEXT NOT NULL,
    canonical_title TEXT NOT NULL,
    title_native JSONB NOT NULL DEFAULT '{}'::jsonb,
    capital_tier TEXT NOT NULL,
    minimum_capital_required NUMERIC(12,2) NOT NULL,
    recommended_starting_capital NUMERIC(12,2) NOT NULL,
    working_capital_buffer_days INTEGER NOT NULL DEFAULT 30,
    working_capital_percent_recommended INTEGER NOT NULL DEFAULT 35,
    required_skill_level TEXT NOT NULL,
    key_asset_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    seasonal_sensitivity TEXT NOT NULL DEFAULT 'MEDIUM',
    regulatory_prerequisites JSONB NOT NULL DEFAULT '[]'::jsonb,
    operational_risk_warning JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_biz_taxonomy_sector ON public.business_taxonomy(sector);

-- --------------------------------------------------------------------------
-- 4. USER MARKET OBSERVATIONS TABLE (Proprietary Local Ground Intelligence)
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_market_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.location_masters(id) ON DELETE SET NULL,
    village_name TEXT NOT NULL,
    district_lgd_code INTEGER,
    business_archetype_id TEXT REFERENCES public.business_taxonomy(id) ON DELETE SET NULL,
    observed_price NUMERIC(10,2),
    observed_competitor_count INTEGER,
    customer_interest_level TEXT CHECK (customer_interest_level IN ('VERY_HIGH', 'MODERATE', 'LOW', 'UNKNOWN')),
    field_notes TEXT,
    verification_status TEXT NOT NULL DEFAULT 'USER_REPORTED' CHECK (verification_status IN ('USER_REPORTED', 'COMMUNITY_VERIFIED', 'OFFICIAL_SURVEY')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_obs_district ON public.user_market_observations(district_lgd_code);
CREATE INDEX IF NOT EXISTS idx_user_obs_archetype ON public.user_market_observations(business_archetype_id);
CREATE INDEX IF NOT EXISTS idx_user_obs_user ON public.user_market_observations(user_id);
