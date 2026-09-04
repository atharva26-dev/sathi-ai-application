-- ==========================================================================
-- SAATHI Database Foundation: 020_village_parameters_intelligence.sql
-- Unified Multi-Source Village & Location Ground Intelligence
-- Synthesizes Census 2011 DCHB, Mission Antyodaya 2020, Circlewise Rainfall 2026,
-- and HCES 2022-23 Consumption Benchmarks
-- ==========================================================================

-- 1. EXTEND EXTENSIONS IF NOT ALREADY PRESENT
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. VILLAGE INTELLIGENCE TABLE (The Core Grounding Dataset for Chatbot)
CREATE TABLE IF NOT EXISTS public.village_intelligence (
    village_code INTEGER PRIMARY KEY,
    village_name TEXT NOT NULL,
    gram_panchayat_code INTEGER,
    gram_panchayat_name TEXT,
    subdistrict_code INTEGER,
    subdistrict_name TEXT,
    district_code INTEGER NOT NULL,
    district_name TEXT NOT NULL,
    state_code INTEGER NOT NULL DEFAULT 27,
    state_name TEXT NOT NULL DEFAULT 'Maharashtra',
    reference_year INTEGER DEFAULT 2020,

    -- Demographics & Population
    total_population INTEGER NOT NULL DEFAULT 0,
    male_population INTEGER NOT NULL DEFAULT 0,
    female_population INTEGER NOT NULL DEFAULT 0,
    total_households INTEGER NOT NULL DEFAULT 0,
    sc_population INTEGER NOT NULL DEFAULT 0,
    st_population INTEGER NOT NULL DEFAULT 0,
    geographical_area_hectares NUMERIC(10,2) DEFAULT 0,

    -- Location & Spatial Distances (DCHB Census)
    distance_to_subdistrict_hq_km NUMERIC(8,2),
    distance_to_district_hq_km NUMERIC(8,2),
    distance_to_nearest_statutory_town_km NUMERIC(8,2),
    nearest_statutory_town_name TEXT,

    -- Agriculture, Livelihood & Economy
    farm_activity_hhs INTEGER NOT NULL DEFAULT 0,
    non_farm_activity_hhs INTEGER NOT NULL DEFAULT 0,
    govt_seed_centres BOOLEAN NOT NULL DEFAULT FALSE,
    watershed_dev_projects BOOLEAN NOT NULL DEFAULT FALSE,
    community_rainwater_harvesting BOOLEAN NOT NULL DEFAULT FALSE,
    farmers_collectives BOOLEAN NOT NULL DEFAULT FALSE,
    food_grain_warehouses BOOLEAN NOT NULL DEFAULT FALSE,
    primary_processing_facilities BOOLEAN NOT NULL DEFAULT FALSE,
    custom_hiring_centres BOOLEAN NOT NULL DEFAULT FALSE,
    soil_testing_centre BOOLEAN NOT NULL DEFAULT FALSE,
    fertilizer_shop BOOLEAN NOT NULL DEFAULT FALSE,

    -- Infrastructure, Utilities & Business Enabling
    bank_available BOOLEAN NOT NULL DEFAULT FALSE,
    bank_distance TEXT,
    atm_available BOOLEAN NOT NULL DEFAULT FALSE,
    bc_w_internet BOOLEAN NOT NULL DEFAULT FALSE,
    internet_broadband BOOLEAN NOT NULL DEFAULT FALSE,
    all_weather_road BOOLEAN NOT NULL DEFAULT FALSE,
    internal_pucca_roads BOOLEAN NOT NULL DEFAULT FALSE,
    public_transport BOOLEAN NOT NULL DEFAULT FALSE,
    railway_station BOOLEAN NOT NULL DEFAULT FALSE,
    common_service_centre BOOLEAN NOT NULL DEFAULT FALSE,
    domestic_electricity_hours NUMERIC(4,1) NOT NULL DEFAULT 0,
    electricity_msme BOOLEAN NOT NULL DEFAULT FALSE,
    market_available BOOLEAN NOT NULL DEFAULT FALSE,
    piped_tap_water BOOLEAN NOT NULL DEFAULT FALSE,
    telephone_services BOOLEAN NOT NULL DEFAULT FALSE,
    clean_energy_hhs INTEGER NOT NULL DEFAULT 0,
    solar_wind_elect BOOLEAN NOT NULL DEFAULT FALSE,
    post_office BOOLEAN NOT NULL DEFAULT FALSE,
    panchayat_bhawan BOOLEAN NOT NULL DEFAULT FALSE,
    primary_school BOOLEAN NOT NULL DEFAULT FALSE,
    middle_school BOOLEAN NOT NULL DEFAULT FALSE,
    high_school BOOLEAN NOT NULL DEFAULT FALSE,
    higher_secondary_school BOOLEAN NOT NULL DEFAULT FALSE,
    vocational_training_centre BOOLEAN NOT NULL DEFAULT FALSE,
    subcentre BOOLEAN NOT NULL DEFAULT FALSE,
    subcentre_distance TEXT,
    veterinary_clinic BOOLEAN NOT NULL DEFAULT FALSE,
    veterinary_distance TEXT,
    drainage BOOLEAN NOT NULL DEFAULT FALSE,

    -- Housing Quality
    kutcha_wall_roof_hhs INTEGER NOT NULL DEFAULT 0,
    kutcha_wall_roof_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
    pmay_houses INTEGER NOT NULL DEFAULT 0,
    pmay_permanent_waitlist INTEGER NOT NULL DEFAULT 0,

    -- Circlewise Rainfall Season 2026 (Live Seasonal Proxy)
    rainfall_circle_name TEXT,
    rainfall_actual_mm NUMERIC(8,2),
    rainfall_normal_mm NUMERIC(8,2),
    rainfall_departure_pct NUMERIC(6,2),
    rainfall_season_status TEXT,

    -- Macroeconomic Consumer Spending Benchmarks (HCES 2022-23)
    rural_mpce_inr NUMERIC(8,2) NOT NULL DEFAULT 4002.00,
    urban_mpce_inr NUMERIC(8,2) NOT NULL DEFAULT 6646.00,
    food_expenditure_pct NUMERIC(5,2) NOT NULL DEFAULT 47.00,
    non_food_expenditure_pct NUMERIC(5,2) NOT NULL DEFAULT 53.00,

    -- Raw / Full Attributes Document
    raw_attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Search and Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_village_intel_name ON public.village_intelligence(village_name);
CREATE INDEX IF NOT EXISTS idx_village_intel_dist ON public.village_intelligence(district_name);
CREATE INDEX IF NOT EXISTS idx_village_intel_subdist ON public.village_intelligence(subdistrict_name);
CREATE INDEX IF NOT EXISTS idx_village_intel_dist_code ON public.village_intelligence(district_code);
CREATE INDEX IF NOT EXISTS idx_village_intel_subdist_code ON public.village_intelligence(subdistrict_code);
CREATE INDEX IF NOT EXISTS idx_village_intel_gp_code ON public.village_intelligence(gram_panchayat_code);

-- Full-text / Trigram Index for fuzzy village name searching
CREATE INDEX IF NOT EXISTS idx_village_intel_trgm ON public.village_intelligence USING gin (village_name gin_trgm_ops);

-- 3. DISTRICT INTELLIGENCE TABLE (All-India Fallback Dataset)
CREATE TABLE IF NOT EXISTS public.district_intelligence (
    id TEXT PRIMARY KEY,
    year INTEGER NOT NULL DEFAULT 2020,
    state_name TEXT NOT NULL,
    state_code TEXT NOT NULL,
    district_name TEXT NOT NULL,
    district_code TEXT NOT NULL,
    villages_surveyed INTEGER NOT NULL DEFAULT 0,
    tot_pop BIGINT NOT NULL DEFAULT 0,
    pop_male BIGINT NOT NULL DEFAULT 0,
    pop_female BIGINT NOT NULL DEFAULT 0,
    tot_hh BIGINT NOT NULL DEFAULT 0,
    bank INTEGER NOT NULL DEFAULT 0,
    atm INTEGER NOT NULL DEFAULT 0,
    internet_bb INTEGER NOT NULL DEFAULT 0,
    all_weather_road INTEGER NOT NULL DEFAULT 0,
    elec_msme INTEGER NOT NULL DEFAULT 0,
    mandi INTEGER NOT NULL DEFAULT 0,
    reg_mkt INTEGER NOT NULL DEFAULT 0,
    weekly_haat INTEGER NOT NULL DEFAULT 0,
    chc INTEGER NOT NULL DEFAULT 0,
    phc INTEGER NOT NULL DEFAULT 0,
    vocational INTEGER NOT NULL DEFAULT 0,
    raw_attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dist_intel_name ON public.district_intelligence(district_name);
CREATE INDEX IF NOT EXISTS idx_dist_intel_state ON public.district_intelligence(state_name);

-- 4. CIRCLEWISE RAINFALL RECORDS (Maharashtra 2026 Season)
CREATE TABLE IF NOT EXISTS public.circle_rainfall_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_name TEXT NOT NULL,
    district_name TEXT,
    june_actual_mm NUMERIC(8,2),
    july_actual_mm NUMERIC(8,2),
    august_actual_mm NUMERIC(8,2),
    september_actual_mm NUMERIC(8,2),
    cumulative_actual_mm NUMERIC(8,2),
    cumulative_normal_mm NUMERIC(8,2),
    departure_percent NUMERIC(6,2),
    season_year INTEGER NOT NULL DEFAULT 2026,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rainfall_circle ON public.circle_rainfall_records(circle_name);
CREATE INDEX IF NOT EXISTS idx_rainfall_district ON public.circle_rainfall_records(district_name);

-- 5. MACROECONOMIC CONSUMPTION BENCHMARKS (HCES 2022-23)
CREATE TABLE IF NOT EXISTS public.macro_consumption_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_name TEXT NOT NULL UNIQUE,
    rural_mpce_inr NUMERIC(10,2) NOT NULL,
    urban_mpce_inr NUMERIC(10,2) NOT NULL,
    rural_food_share_pct NUMERIC(5,2) NOT NULL DEFAULT 47.00,
    rural_non_food_share_pct NUMERIC(5,2) NOT NULL DEFAULT 53.00,
    survey_year TEXT NOT NULL DEFAULT '2022-23',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed HCES 2022-23 benchmarks for primary states
INSERT INTO public.macro_consumption_benchmarks (state_name, rural_mpce_inr, urban_mpce_inr, rural_food_share_pct, rural_non_food_share_pct) VALUES
('Maharashtra', 4002.00, 6646.00, 47.30, 52.70),
('Tamil Nadu', 4883.00, 7649.00, 44.80, 55.20),
('Rajasthan', 3885.00, 5634.00, 48.10, 51.90),
('Andhra Pradesh', 4870.00, 6782.00, 46.50, 53.50),
('Bihar', 3384.00, 4768.00, 50.50, 49.50),
('Gujarat', 3798.00, 6624.00, 46.90, 53.10),
('Uttar Pradesh', 3191.00, 5082.00, 49.20, 50.80),
('All India', 3773.00, 6459.00, 46.40, 53.60)
ON CONFLICT (state_name) DO UPDATE SET
    rural_mpce_inr = EXCLUDED.rural_mpce_inr,
    urban_mpce_inr = EXCLUDED.urban_mpce_inr;

-- 6. RPC SEARCH FUNCTION FOR VILLAGES
CREATE OR REPLACE FUNCTION public.search_village_ground_intelligence(
    p_query TEXT,
    p_district TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS SETOF public.village_intelligence
LANGUAGE sql
STABLE
AS $$
    SELECT *
    FROM public.village_intelligence
    WHERE
        (p_district IS NULL OR p_district = '' OR district_name ILIKE '%' || p_district || '%')
        AND (
            p_query IS NULL OR p_query = ''
            OR village_name ILIKE '%' || p_query || '%'
            OR subdistrict_name ILIKE '%' || p_query || '%'
            OR gram_panchayat_name ILIKE '%' || p_query || '%'
        )
    ORDER BY
        CASE
            WHEN village_name ILIKE p_query THEN 1
            WHEN village_name ILIKE p_query || '%' THEN 2
            ELSE 3
        END,
        total_population DESC
    LIMIT p_limit;
$$;
