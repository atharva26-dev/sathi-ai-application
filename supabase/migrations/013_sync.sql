-- ==========================================================================
-- SAATHI Database Foundation: 013_sync.sql
-- Offline-First Synchronization Logs, Notifications, and System Multilingual Content
-- ==========================================================================

-- Offline Client Synchronization Records Table
CREATE TABLE IF NOT EXISTS public.sync_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.user_devices(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL, -- e.g. 'mentor_tasks', 'business_ideas', 'financial_profiles'
    entity_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    client_timestamp TIMESTAMPTZ NOT NULL,
    server_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    sync_status public.sync_status NOT NULL DEFAULT 'pending',
    conflict_version INT DEFAULT 1,
    payload_hash TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sync_records_user ON public.sync_records(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_records_status ON public.sync_records(sync_status);
CREATE INDEX IF NOT EXISTS idx_sync_records_entity ON public.sync_records(entity_type, entity_id);
CREATE TRIGGER set_sync_records_updated_at
BEFORE UPDATE ON public.sync_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- User Notifications Table (Targeted guidance, scheme alerts, not spam)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('SCHEME_ALERT', 'MENTOR_REMINDER', 'MARKET_OPPORTUNITY', 'SYSTEM', 'LOAN_UPDATE')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- Localized Content Table (Normalized multilingual system dictionary, term explainers, and audio mappings)
CREATE TABLE IF NOT EXISTS public.localized_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_key TEXT NOT NULL,
    language public.language_code NOT NULL,
    title TEXT,
    body TEXT NOT NULL,
    audio_reference TEXT,
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_localized_content UNIQUE (content_key, language, version)
);

CREATE INDEX IF NOT EXISTS idx_loc_content_key_lang ON public.localized_content(content_key, language);
CREATE TRIGGER set_localized_content_updated_at
BEFORE UPDATE ON public.localized_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
