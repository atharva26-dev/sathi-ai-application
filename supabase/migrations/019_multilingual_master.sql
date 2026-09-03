-- ==============================================================================
-- SAATHI — 019_multilingual_master.sql
-- Master Indian Languages Catalog (22 Scheduled Languages of India + English)
-- ==============================================================================

-- 1. Safely expand public.language_code enum to encompass all 22 scheduled languages
DO $$ 
BEGIN
    -- List of additional scheduled language codes
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'ur' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'ur';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'ne' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'ne';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'kok' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'kok';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'mai' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'mai';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'doi' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'doi';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'ks' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'ks';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'brx' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'brx';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'sat' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'sat';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'mni' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'mni';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'sa' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'sa';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'sd' AND enumtypid = 'public.language_code'::regtype) THEN
        ALTER TYPE public.language_code ADD VALUE 'sd';
    END IF;
END $$;

-- 2. Master Languages Reference Table
CREATE TABLE IF NOT EXISTS public.languages (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    script TEXT NOT NULL,
    direction TEXT NOT NULL DEFAULT 'ltr' CHECK (direction IN ('ltr', 'rtl')),
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    ui_supported BOOLEAN NOT NULL DEFAULT true,
    voice_input_supported BOOLEAN NOT NULL DEFAULT true,
    voice_output_supported BOOLEAN NOT NULL DEFAULT true,
    ai_response_supported BOOLEAN NOT NULL DEFAULT true,
    fallback_language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Populate initial 23 official languages (22 Scheduled Languages + English)
INSERT INTO public.languages (
    id, code, name, native_name, script, direction, is_enabled, ui_supported, voice_input_supported, voice_output_supported, ai_response_supported, fallback_language
) VALUES
    ('lang_mr', 'mr', 'Marathi', 'मराठी', 'Devanagari', 'ltr', true, true, true, true, true, 'en'),
    ('lang_hi', 'hi', 'Hindi', 'हिन्दी', 'Devanagari', 'ltr', true, true, true, true, true, 'en'),
    ('lang_en', 'en', 'English', 'English', 'Latin', 'ltr', true, true, true, true, true, 'en'),
    ('lang_bn', 'bn', 'Bengali', 'বাংলা', 'Bengali', 'ltr', true, true, true, true, true, 'en'),
    ('lang_ta', 'ta', 'Tamil', 'தமிழ்', 'Tamil', 'ltr', true, true, true, true, true, 'en'),
    ('lang_te', 'te', 'Telugu', 'తెలుగు', 'Telugu', 'ltr', true, true, true, true, true, 'en'),
    ('lang_gu', 'gu', 'Gujarati', 'ગુજરાતી', 'Gujarati', 'ltr', true, true, true, true, true, 'en'),
    ('lang_kn', 'kn', 'Kannada', 'ಕನ್ನಡ', 'Kannada', 'ltr', true, true, true, true, true, 'en'),
    ('lang_ml', 'ml', 'Malayalam', 'മലയാളം', 'Malayalam', 'ltr', true, true, true, true, true, 'en'),
    ('lang_or', 'or', 'Odia', 'ଓଡ଼ିଆ', 'Odia', 'ltr', true, true, true, true, true, 'en'),
    ('lang_pa', 'pa', 'Punjabi', 'ਪੰਜਾਬੀ', 'Gurmukhi', 'ltr', true, true, true, true, true, 'en'),
    ('lang_as', 'as', 'Assamese', 'অসমীয়া', 'Bengali-Assamese', 'ltr', true, true, true, true, true, 'en'),
    ('lang_ur', 'ur', 'Urdu', 'اردو', 'Perso-Arabic', 'rtl', true, true, true, true, true, 'en'),
    ('lang_ne', 'ne', 'Nepali', 'नेपाली', 'Devanagari', 'ltr', true, true, true, true, true, 'hi'),
    ('lang_kok', 'kok', 'Konkani', 'कोंकणी', 'Devanagari', 'ltr', true, true, true, true, true, 'mr'),
    ('lang_mai', 'mai', 'Maithili', 'मैथिली', 'Devanagari', 'ltr', true, true, true, true, true, 'hi'),
    ('lang_doi', 'doi', 'Dogri', 'डोगरी', 'Devanagari', 'ltr', true, true, true, true, true, 'hi'),
    ('lang_ks', 'ks', 'Kashmiri', 'کٲشُر', 'Perso-Arabic', 'rtl', true, true, true, true, true, 'ur'),
    ('lang_brx', 'brx', 'Bodo', 'बोडो', 'Devanagari', 'ltr', true, true, true, true, true, 'as'),
    ('lang_sat', 'sat', 'Santali', 'संथाली / ᱥᱟᱱᱛᱟᱲᱤ', 'Ol Chiki', 'ltr', true, true, true, true, true, 'hi'),
    ('lang_mni', 'mni', 'Manipuri', 'মৈতৈলোন্ / মণিপুরী', 'Meitei Mayek', 'ltr', true, true, true, true, true, 'bn'),
    ('lang_sa', 'sa', 'Sanskrit', 'संस्कृतम्', 'Devanagari', 'ltr', true, true, true, true, true, 'hi'),
    ('lang_sd', 'sd', 'Sindhi', 'سنڌي / सिन्धी', 'Perso-Arabic', 'rtl', true, true, true, true, true, 'hi')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    native_name = EXCLUDED.native_name,
    script = EXCLUDED.script,
    direction = EXCLUDED.direction,
    updated_at = NOW();

COMMENT ON TABLE public.languages IS 'Master registry of official Indian languages supporting progressive localization, voice locales, and text direction';
