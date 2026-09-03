-- ==========================================================================
-- SAATHI Database Foundation: 003_locations.sql
-- Geographic Hierarchy & Privacy-Aware User Location Architecture
-- ==========================================================================

-- Standard Administrative Location Master Data Table
CREATE TABLE IF NOT EXISTS public.location_masters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL DEFAULT 'India',
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    block TEXT NOT NULL, -- Taluka / Tehsil / Block
    gram_panchayat TEXT,
    village TEXT NOT NULL,
    postal_code TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    metadata JSONB DEFAULT '{}'::jsonb, -- census code, local hub classification, agro-climatic zone
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loc_master_state_dist ON public.location_masters(state, district);
CREATE INDEX IF NOT EXISTS idx_loc_master_block_village ON public.location_masters(block, village);
CREATE INDEX IF NOT EXISTS idx_loc_master_pincode ON public.location_masters(postal_code);
CREATE INDEX IF NOT EXISTS idx_loc_master_trgm ON public.location_masters USING gin (village gin_trgm_ops);

CREATE TRIGGER set_location_masters_updated_at
BEFORE UPDATE ON public.location_masters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- User Location Link Table (Privacy-aware, does not require exact GPS coordinates)
CREATE TABLE IF NOT EXISTS public.user_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.location_masters(id) ON DELETE SET NULL,
    custom_village TEXT,
    custom_block TEXT,
    custom_district TEXT,
    custom_state TEXT DEFAULT 'Maharashtra',
    precision_level TEXT NOT NULL CHECK (precision_level IN ('VILLAGE', 'BLOCK', 'DISTRICT', 'EXACT')) DEFAULT 'VILLAGE',
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_locations_user ON public.user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_loc ON public.user_locations(location_id);

CREATE TRIGGER set_user_locations_updated_at
BEFORE UPDATE ON public.user_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
