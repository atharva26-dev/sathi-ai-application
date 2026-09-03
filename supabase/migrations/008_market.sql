-- ==========================================================================
-- SAATHI Database Foundation: 008_market.sql
-- Market Intelligence, Reusable Market Areas, Indicators, Competitor Mapping,
-- Data Provenance, and Versioned Market Gap Reports
-- ==========================================================================

-- Data Sources Catalog (Provenance tracking for data confidence)
CREATE TABLE IF NOT EXISTS public.data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN (
        'GOVERNMENT_CENSUS',
        'MARKET_SURVEY',
        'COOPERATIVE_REGISTRY',
        'AI_SYNTHESIS',
        'USER_REPORT'
    )),
    official BOOLEAN NOT NULL DEFAULT FALSE,
    url TEXT,
    description TEXT,
    last_verified_at TIMESTAMPTZ,
    version TEXT NOT NULL DEFAULT '1.0',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_data_sources_updated_at
BEFORE UPDATE ON public.data_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Data Source References Table ("Where did this information come from?")
CREATE TABLE IF NOT EXISTS public.data_source_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- e.g. 'competitor_records', 'market_indicators', 'schemes'
    entity_id UUID NOT NULL,
    reference_url TEXT,
    reference_identifier TEXT,
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    effective_date DATE,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ds_ref_entity ON public.data_source_references(entity_type, entity_id);

-- Reusable Market Areas Table (Avoids duplicating geographic datasets per user)
CREATE TABLE IF NOT EXISTS public.market_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES public.location_masters(id) ON DELETE CASCADE,
    radius_km NUMERIC(5,2) NOT NULL CHECK (radius_km > 0),
    data_source TEXT,
    source_reference TEXT,
    data_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_market_area_loc_radius UNIQUE (location_id, radius_km, data_version)
);

CREATE INDEX IF NOT EXISTS idx_market_areas_loc ON public.market_areas(location_id);
CREATE TRIGGER set_market_areas_updated_at
BEFORE UPDATE ON public.market_areas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Market Indicators Table (Demographic, demand, and volume statistics)
CREATE TABLE IF NOT EXISTS public.market_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_area_id UUID NOT NULL REFERENCES public.market_areas(id) ON DELETE CASCADE,
    indicator_type TEXT NOT NULL, -- e.g. 'milch_cattle_density', 'highway_dhaba_count', 'raw_milk_daily_volume'
    value_numeric NUMERIC(14,4),
    value_text TEXT,
    unit TEXT,
    confidence NUMERIC(5,2) CHECK (confidence >= 0 AND confidence <= 100),
    data_source TEXT,
    source_reference TEXT,
    effective_date DATE,
    data_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_market_indicators_area ON public.market_indicators(market_area_id);
CREATE INDEX IF NOT EXISTS idx_market_indicators_type ON public.market_indicators(indicator_type);

-- Competitor Records Table (Verified vs AI Estimate with confidence tags)
CREATE TABLE IF NOT EXISTS public.competitor_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_area_id UUID NOT NULL REFERENCES public.market_areas(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    subcategory TEXT,
    business_name TEXT NOT NULL,
    location_precision TEXT NOT NULL DEFAULT 'VILLAGE' CHECK (location_precision IN ('VILLAGE', 'BLOCK', 'DISTRICT', 'EXACT')),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    source_type TEXT NOT NULL DEFAULT 'AI_ESTIMATE',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    confidence NUMERIC(5,2) NOT NULL DEFAULT 80.00 CHECK (confidence >= 0 AND confidence <= 100),
    price_range JSONB DEFAULT '{}'::jsonb,
    services JSONB DEFAULT '[]'::jsonb,
    known_gaps JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_competitors_area ON public.competitor_records(market_area_id);
CREATE INDEX IF NOT EXISTS idx_competitors_category ON public.competitor_records(category);
CREATE INDEX IF NOT EXISTS idx_competitors_verified ON public.competitor_records(verified);
CREATE TRIGGER set_competitor_records_updated_at
BEFORE UPDATE ON public.competitor_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Distribution Channels Table
CREATE TABLE IF NOT EXISTS public.distribution_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_area_id UUID NOT NULL REFERENCES public.market_areas(id) ON DELETE CASCADE,
    channel_type TEXT NOT NULL, -- e.g. 'HIGHWAY_DHABA', 'WHATSAPP_COMMUNITY', 'WEEKLY_HAAT', 'COOP_DAIRY'
    name TEXT NOT NULL,
    description TEXT,
    typical_reach TEXT,
    estimated_margin NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dist_channels_area ON public.distribution_channels(market_area_id);

-- Supplier Records Table (Local raw material sources)
CREATE TABLE IF NOT EXISTS public.supplier_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_area_id UUID NOT NULL REFERENCES public.market_areas(id) ON DELETE CASCADE,
    supplier_name TEXT NOT NULL,
    raw_material_type TEXT NOT NULL,
    approximate_location TEXT,
    typical_supply_capacity TEXT,
    indicative_rate TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_area ON public.supplier_records(market_area_id);

-- Market Opportunities Table (4-Quadrant Market Gap Analytics)
CREATE TABLE IF NOT EXISTS public.market_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_area_id UUID NOT NULL REFERENCES public.market_areas(id) ON DELETE CASCADE,
    business_category TEXT NOT NULL,
    demand_score NUMERIC(5,2) NOT NULL CHECK (demand_score >= 0 AND demand_score <= 100),
    competition_score NUMERIC(5,2) NOT NULL CHECK (competition_score >= 0 AND competition_score <= 100),
    opportunity_score NUMERIC(5,2) NOT NULL CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
    evidence JSONB DEFAULT '[]'::jsonb,
    assumptions JSONB DEFAULT '[]'::jsonb,
    confidence NUMERIC(5,2) NOT NULL DEFAULT 85.00 CHECK (confidence >= 0 AND confidence <= 100),
    analysis_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_market_opps_area ON public.market_opportunities(market_area_id);
CREATE INDEX IF NOT EXISTS idx_market_opps_category ON public.market_opportunities(business_category);

-- Versioned User Market Reports Table
CREATE TABLE IF NOT EXISTS public.market_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_idea_id UUID REFERENCES public.business_ideas(id) ON DELETE SET NULL,
    market_area_id UUID REFERENCES public.market_areas(id) ON DELETE SET NULL,
    report_version TEXT NOT NULL DEFAULT '1.0',
    summary TEXT NOT NULL,
    demand_analysis JSONB DEFAULT '{}'::jsonb,
    competition_analysis JSONB DEFAULT '{}'::jsonb,
    market_gap JSONB DEFAULT '{}'::jsonb,
    pricing_analysis JSONB DEFAULT '{}'::jsonb,
    distribution_analysis JSONB DEFAULT '{}'::jsonb,
    risk_analysis JSONB DEFAULT '{}'::jsonb,
    evidence JSONB DEFAULT '[]'::jsonb,
    assumptions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_market_reports_user ON public.market_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_market_reports_idea ON public.market_reports(business_idea_id);
