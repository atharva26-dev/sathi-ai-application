-- ==========================================================================
-- SAATHI Database Foundation: 016_district_data_engine.sql
-- Multi-Source Authoritative Official Indian Data Layers & Opportunity Engine
-- Local Government Directory (LGD) Hierarchy Mapping & Data Provenance
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. EXTEND DATA SOURCES CATALOG
-- --------------------------------------------------------------------------

INSERT INTO public.data_sources (id, name, source_type, official, url, description, last_verified_at, version, status)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Office of DC-MSME District Industrial Profiles', 'GOVERNMENT_CENSUS', true, 'https://www.dcmsme.gov.in/', 'Official District Industrial Profiles published by Ministry of MSME, Govt of India.', now(), '2024-25', 'active'),
    ('c0000000-0000-0000-0000-000000000002', 'Directorate of Economics and Statistics (DES)', 'GOVERNMENT_CENSUS', true, 'https://aps.dac.gov.in/', 'District-wise, season-wise crop area, production, and yield statistics from Ministry of Agriculture & Farmers Welfare.', now(), '2023-24', 'active'),
    ('c0000000-0000-0000-0000-000000000003', 'One District One Product (ODOP) - DPIIT', 'GOVERNMENT_CENSUS', true, 'https://www.odop.investindia.gov.in/', 'Official district specialization products under Invest India and Department for Promotion of Industry and Internal Trade.', now(), '2024-25', 'active'),
    ('c0000000-0000-0000-0000-000000000004', 'Udyam MSME Registration Registry', 'COOPERATIVE_REGISTRY', true, 'https://udyamregistration.gov.in/', 'Registered micro, small, and medium enterprises count by 2-digit NIC classification.', now(), '2024-25', 'active'),
    ('c0000000-0000-0000-0000-000000000005', 'e-NAM / Agmarknet APMC Market Data', 'MARKET_SURVEY', true, 'https://enam.gov.in/', 'Physical arrivals, traded quantities, and minimum/modal/maximum commodity auction prices.', now(), '2025-26', 'active'),
    ('c0000000-0000-0000-0000-000000000006', 'District Census Handbook (DCHB) - RGI India', 'GOVERNMENT_CENSUS', true, 'https://censusindia.gov.in/', 'Village and town demographic proxies, household numbers, rural electrification, and road connectivity.', now(), '2024 Proj', 'active'),
    ('c0000000-0000-0000-0000-000000000007', 'National Skill Development Corporation (NSDC)', 'GOVERNMENT_CENSUS', true, 'https://www.nsdcindia.org/', 'District skill ecosystem mapping and vocational training capacity.', now(), '2024', 'active')
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------------
-- 2. DISTRICT INDUSTRIAL PROFILES TABLE (DC-MSME)
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.district_industrial_profiles (
    district_lgd_code INTEGER PRIMARY KEY,
    district_name TEXT NOT NULL,
    state_lgd_code INTEGER NOT NULL,
    state_name TEXT NOT NULL,
    major_resources JSONB NOT NULL DEFAULT '{}'::jsonb,
    existing_clusters JSONB NOT NULL DEFAULT '[]'::jsonb,
    artisan_clusters JSONB NOT NULL DEFAULT '[]'::jsonb,
    service_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
    potential_msmes JSONB NOT NULL DEFAULT '[]'::jsonb,
    exportable_products JSONB NOT NULL DEFAULT '[]'::jsonb,
    prominent_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dist_prof_state ON public.district_industrial_profiles(state_lgd_code);

-- --------------------------------------------------------------------------
-- 3. DISTRICT CROP PRODUCTION STATISTICS TABLE (DES)
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.district_crop_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_lgd_code INTEGER NOT NULL,
    crop_name TEXT NOT NULL,
    season TEXT NOT NULL,
    data_year TEXT NOT NULL,
    area_hectares NUMERIC(12,2) NOT NULL,
    production_tonnes NUMERIC(14,2) NOT NULL,
    yield_kg_per_hectare NUMERIC(10,2) NOT NULL,
    market_surplus_rank TEXT NOT NULL DEFAULT 'HIGH',
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crop_stat_dist ON public.district_crop_statistics(district_lgd_code);
CREATE INDEX IF NOT EXISTS idx_crop_stat_crop ON public.district_crop_statistics(crop_name);

-- --------------------------------------------------------------------------
-- 4. DISTRICT ODOP TABLE (DPIIT / Invest India)
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.district_odop_products (
    district_lgd_code INTEGER PRIMARY KEY,
    district_name TEXT NOT NULL,
    state_lgd_code INTEGER NOT NULL,
    state_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_category TEXT NOT NULL,
    is_gi_tagged BOOLEAN NOT NULL DEFAULT FALSE,
    specialization_rationale TEXT NOT NULL,
    export_potential TEXT NOT NULL DEFAULT 'NATIONAL',
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 5. DISTRICT UDYAM MSME REGISTRY TABLE
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.district_udyam_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_lgd_code INTEGER NOT NULL,
    nic_code TEXT NOT NULL,
    sector_name TEXT NOT NULL,
    micro_count INTEGER NOT NULL DEFAULT 0,
    small_count INTEGER NOT NULL DEFAULT 0,
    medium_count INTEGER NOT NULL DEFAULT 0,
    estimated_informal_multiplier NUMERIC(4,2) NOT NULL DEFAULT 2.00,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_udyam_dist ON public.district_udyam_activity(district_lgd_code);
CREATE INDEX IF NOT EXISTS idx_udyam_nic ON public.district_udyam_activity(nic_code);

-- --------------------------------------------------------------------------
-- 6. MANDI APMC PRICE & ARRIVALS TABLE (e-NAM / Agmarknet)
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.mandi_price_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity TEXT NOT NULL,
    market_name TEXT NOT NULL,
    district_lgd_code INTEGER NOT NULL,
    arrival_tonnes NUMERIC(10,2) NOT NULL,
    traded_quantity_tonnes NUMERIC(10,2) NOT NULL,
    min_price_per_quintal NUMERIC(10,2) NOT NULL,
    modal_price_per_quintal NUMERIC(10,2) NOT NULL,
    max_price_per_quintal NUMERIC(10,2) NOT NULL,
    record_date DATE NOT NULL,
    price_trend TEXT NOT NULL DEFAULT 'STABLE',
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mandi_dist ON public.mandi_price_records(district_lgd_code);
CREATE INDEX IF NOT EXISTS idx_mandi_commodity ON public.mandi_price_records(commodity);
CREATE INDEX IF NOT EXISTS idx_mandi_date ON public.mandi_price_records(record_date);

-- --------------------------------------------------------------------------
-- 7. DISTRICT DEMOGRAPHICS & INFRASTRUCTURE TABLE (Census DCHB)
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.district_demographics (
    district_lgd_code INTEGER PRIMARY KEY,
    district_name TEXT NOT NULL,
    state_lgd_code INTEGER NOT NULL,
    state_name TEXT NOT NULL,
    total_population BIGINT NOT NULL,
    rural_population_percent NUMERIC(5,2) NOT NULL,
    household_count BIGINT NOT NULL,
    electrification_percent NUMERIC(5,2) NOT NULL,
    banking_facility_coverage TEXT NOT NULL DEFAULT 'HIGH',
    paved_road_access_percent NUMERIC(5,2) NOT NULL,
    broadband_internet_coverage_percent NUMERIC(5,2) NOT NULL,
    commercial_hub_count INTEGER NOT NULL DEFAULT 5,
    demand_index_score INTEGER NOT NULL DEFAULT 80,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 8. DISTRICT SKILL ECOSYSTEM TABLE (NSDC / MSDE)
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.district_skills (
    district_lgd_code INTEGER PRIMARY KEY,
    district_name TEXT NOT NULL,
    state_name TEXT NOT NULL,
    mapped_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    vocational_centers_count INTEGER NOT NULL DEFAULT 10,
    traditional_crafts JSONB NOT NULL DEFAULT '[]'::jsonb,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
