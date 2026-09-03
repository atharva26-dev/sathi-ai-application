-- ==========================================================================
-- SAATHI Database Foundation: 006_schemes.sql
-- Government Schemes, Dynamic Rules, Documentation Checklists, and Assessments
-- ==========================================================================

-- Schemes Master Table (Versionable government/institutional schemes)
CREATE TABLE IF NOT EXISTS public.schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_name TEXT NOT NULL,
    scheme_type TEXT NOT NULL, -- e.g. 'CAPITAL_SUBSIDY', 'CREDIT_GUARANTEE', 'INTEREST_SUBVENTION'
    description TEXT NOT NULL,
    authority TEXT NOT NULL, -- e.g. 'KVIC / Ministry of MSME', 'Ministry of Finance'
    official_source_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'superseded', 'upcoming')),
    version TEXT NOT NULL DEFAULT '1.0',
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schemes_status ON public.schemes(status);
CREATE INDEX IF NOT EXISTS idx_schemes_type ON public.schemes(scheme_type);
CREATE TRIGGER set_schemes_updated_at
BEFORE UPDATE ON public.schemes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Scheme Rules Table (Extensible rule engine data without hard-coding schemas)
CREATE TABLE IF NOT EXISTS public.scheme_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL, -- 'MIN_MAX_CAPITAL', 'SUBSIDY_RATE', 'INTEREST_RATE', 'TENURE_MORATORIUM', 'ELIGIBILITY_CRITERIA'
    rule_data JSONB NOT NULL,
    priority INT NOT NULL DEFAULT 1 CHECK (priority >= 1),
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheme_rules_scheme ON public.scheme_rules(scheme_id);
CREATE INDEX IF NOT EXISTS idx_scheme_rules_type ON public.scheme_rules(rule_type);

-- Scheme Documents Table (Required document lists for applications)
CREATE TABLE IF NOT EXISTS public.scheme_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    description TEXT,
    mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    source_url TEXT,
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheme_docs_scheme ON public.scheme_documents(scheme_id);
CREATE TRIGGER set_scheme_documents_updated_at
BEFORE UPDATE ON public.scheme_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Scheme Eligibility Assessments Table (Decision support assessments, never fake approvals)
CREATE TABLE IF NOT EXISTS public.scheme_eligibility_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
    input_snapshot JSONB NOT NULL,
    eligibility_result public.scheme_suitability NOT NULL DEFAULT 'needs_information',
    confidence NUMERIC(5,2) CHECK (confidence >= 0 AND confidence <= 100),
    reasons JSONB DEFAULT '[]'::jsonb,
    missing_information JSONB DEFAULT '[]'::jsonb,
    rule_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheme_assess_user ON public.scheme_eligibility_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_scheme_assess_scheme ON public.scheme_eligibility_assessments(scheme_id);
CREATE INDEX IF NOT EXISTS idx_scheme_assess_result ON public.scheme_eligibility_assessments(eligibility_result);
