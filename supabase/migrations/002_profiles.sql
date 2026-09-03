-- ==========================================================================
-- SAATHI Database Foundation: 002_profiles.sql
-- User Identities, Consents, and Device Registry (Linked to Supabase Auth)
-- ==========================================================================

-- User Profiles Table (1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    preferred_language public.language_code NOT NULL DEFAULT 'mr',
    age_range TEXT CHECK (age_range IN ('18-25', '26-35', '36-45', '46-60', '60+')),
    phone_metadata JSONB DEFAULT '{}'::jsonb, -- e.g. masked phone, carrier region without storing raw PII unnecessarily
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    is_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_profiles_lang ON public.profiles(preferred_language);
CREATE INDEX IF NOT EXISTS idx_profiles_demo ON public.profiles(is_demo) WHERE is_demo = TRUE;
CREATE INDEX IF NOT EXISTS idx_profiles_deleted ON public.profiles(deleted_at) WHERE deleted_at IS NULL;

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- User Consents Table (Explicit consent audit trail)
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL CHECK (consent_type IN ('terms', 'privacy', 'voice_processing', 'data_storage', 'analytics', 'location')),
    version TEXT NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at TIMESTAMPTZ,
    CONSTRAINT uq_user_consent_version UNIQUE (user_id, consent_type, version)
);

CREATE INDEX IF NOT EXISTS idx_user_consents_user_type ON public.user_consents(user_id, consent_type);

-- User Devices Table (For PWA and offline synchronization tracking)
CREATE TABLE IF NOT EXISTS public.user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_identifier TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('android', 'ios', 'web', 'pwa')),
    app_version TEXT NOT NULL,
    push_subscription JSONB,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_device UNIQUE (user_id, device_identifier)
);

CREATE INDEX IF NOT EXISTS idx_user_devices_user ON public.user_devices(user_id);
CREATE TRIGGER set_user_devices_updated_at
BEFORE UPDATE ON public.user_devices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to automatically provision a profile row when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        preferred_language,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'उद्योजक मित्र'),
        COALESCE((NEW.raw_user_meta_data->>'preferred_language')::public.language_code, 'mr'),
        now(),
        now()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
