-- ==========================================================================
-- SAATHI Database Foundation: 007_loans.sql
-- Loan Products, Loan Assessments, and Precise Amortization Repayment Schedules
-- ==========================================================================

-- Loan Products Master Table
CREATE TABLE IF NOT EXISTS public.loan_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type public.loan_provider_type NOT NULL DEFAULT 'bank',
    provider_name TEXT NOT NULL, -- e.g. 'State Bank of India', 'Baramati Sahakari Bank'
    product_name TEXT NOT NULL,
    description TEXT,
    interest_rate NUMERIC(6,4) NOT NULL CHECK (interest_rate >= 0), -- annual percentage rate (e.g. 9.5000)
    interest_type TEXT NOT NULL DEFAULT 'REDUCING' CHECK (interest_type IN ('FIXED', 'REDUCING', 'SUBSIDIZED')),
    minimum_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (minimum_amount >= 0),
    maximum_amount NUMERIC(14,2) NOT NULL CHECK (maximum_amount >= minimum_amount),
    minimum_tenure INT NOT NULL DEFAULT 12 CHECK (minimum_tenure >= 1), -- months
    maximum_tenure INT NOT NULL DEFAULT 84 CHECK (maximum_tenure >= minimum_tenure),
    moratorium INT NOT NULL DEFAULT 0 CHECK (moratorium >= 0), -- months
    eligibility_summary TEXT,
    official_source_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loan_products_status ON public.loan_products(status);
CREATE INDEX IF NOT EXISTS idx_loan_products_provider ON public.loan_products(provider_type, provider_name);
CREATE TRIGGER set_loan_products_updated_at
BEFORE UPDATE ON public.loan_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Loan Assessments Table (Simulation & guidance assessment, NOT a loan application)
CREATE TABLE IF NOT EXISTS public.loan_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    loan_product_id UUID REFERENCES public.loan_products(id) ON DELETE SET NULL,
    requested_amount NUMERIC(14,2) NOT NULL CHECK (requested_amount > 0),
    assessment_input JSONB NOT NULL,
    assessment_output JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('draft', 'completed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loan_assess_user ON public.loan_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_assess_product ON public.loan_assessments(loan_product_id);

-- Repayment Schedules Table (Amortization Plan Container)
CREATE TABLE IF NOT EXISTS public.repayment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    loan_assessment_id UUID REFERENCES public.loan_assessments(id) ON DELETE SET NULL,
    loan_amount NUMERIC(14,2) NOT NULL CHECK (loan_amount > 0),
    interest_rate NUMERIC(6,4) NOT NULL CHECK (interest_rate >= 0),
    tenure_months INT NOT NULL CHECK (tenure_months > 0),
    moratorium_months INT NOT NULL DEFAULT 0 CHECK (moratorium_months >= 0),
    payment_frequency TEXT NOT NULL DEFAULT 'MONTHLY' CHECK (payment_frequency IN ('MONTHLY', 'QUARTERLY', 'ANNUAL')),
    calculation_version TEXT NOT NULL DEFAULT 'v1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_repay_sched_user ON public.repayment_schedules(user_id);

-- Repayment Schedule Items Table (Month-by-month deterministic amortization schedule rows)
CREATE TABLE IF NOT EXISTS public.repayment_schedule_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repayment_schedule_id UUID NOT NULL REFERENCES public.repayment_schedules(id) ON DELETE CASCADE,
    period_number INT NOT NULL CHECK (period_number >= 1),
    period_start DATE,
    period_end DATE,
    opening_balance NUMERIC(14,2) NOT NULL CHECK (opening_balance >= 0),
    principal NUMERIC(14,2) NOT NULL CHECK (principal >= 0),
    interest NUMERIC(14,2) NOT NULL CHECK (interest >= 0),
    payment NUMERIC(14,2) NOT NULL CHECK (payment >= 0),
    closing_balance NUMERIC(14,2) NOT NULL CHECK (closing_balance >= 0),
    status TEXT NOT NULL DEFAULT 'projected' CHECK (status IN ('projected', 'paid', 'overdue', 'deferred')),
    CONSTRAINT uq_schedule_period UNIQUE (repayment_schedule_id, period_number)
);

CREATE INDEX IF NOT EXISTS idx_repay_items_schedule ON public.repayment_schedule_items(repayment_schedule_id, period_number);
