-- ==========================================================================
-- SAATHI Database Foundation: 001_extensions.sql
-- Extensions, Core Enums, and Utility Functions
-- ==========================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Standardized Trigger Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = clock_timestamp();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------------------
-- DOMAIN ENUMS
-- --------------------------------------------------------------------------

-- Multilingual language codes supported across India
DO $$ BEGIN
    CREATE TYPE public.language_code AS ENUM (
        'mr', -- Marathi
        'hi', -- Hindi
        'en', -- English
        'gu', -- Gujarati
        'bn', -- Bengali
        'ta', -- Tamil
        'te', -- Telugu
        'kn', -- Kannada
        'ml', -- Malayalam
        'or', -- Odia
        'pa', -- Punjabi
        'as'  -- Assamese
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Data Trust & Provenance Level (Preserving critical fact vs estimate distinction)
DO $$ BEGIN
    CREATE TYPE public.data_trust_level AS ENUM (
        'FACT',
        'USER_INPUT',
        'CALCULATED',
        'AI_ESTIMATE',
        'OFFICIAL_VERIFICATION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Business Lifecycle Stages
DO $$ BEGIN
    CREATE TYPE public.business_stage AS ENUM (
        'IDEA',
        'PLANNING',
        'EARLY_STAGE',
        'OPERATING',
        'SCALING',
        'PAUSED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Business Idea Source & Status
DO $$ BEGIN
    CREATE TYPE public.business_idea_source AS ENUM (
        'user',
        'ai_recommendation',
        'system',
        'imported'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.business_idea_status AS ENUM (
        'proposed',
        'selected',
        'rejected',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Government/Bank Scheme Suitability Status
DO $$ BEGIN
    CREATE TYPE public.scheme_suitability AS ENUM (
        'potentially_eligible',
        'needs_information',
        'not_eligible',
        'requires_official_verification'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Loan Provider Categories
DO $$ BEGIN
    CREATE TYPE public.loan_provider_type AS ENUM (
        'bank',
        'government',
        'financial_institution',
        'cooperative',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Mentor Task Lifecycle
DO $$ BEGIN
    CREATE TYPE public.task_status AS ENUM (
        'pending',
        'in_progress',
        'completed',
        'skipped'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Offline Synchronization Status
DO $$ BEGIN
    CREATE TYPE public.sync_status AS ENUM (
        'pending',
        'synced',
        'conflict',
        'failed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Audit Trail Actor Types
DO $$ BEGIN
    CREATE TYPE public.actor_type AS ENUM (
        'user',
        'system',
        'admin',
        'service'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
