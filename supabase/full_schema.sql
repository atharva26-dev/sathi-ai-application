-- ==========================================================================
-- SAATHI - Complete Combined Production Database Schema & Seed
-- Target: Supabase / PostgreSQL 15+
-- ==========================================================================

BEGIN;

-- 1. Extensions & Types
\ir migrations/001_extensions.sql

-- 2. Profiles & Authentication
\ir migrations/002_profiles.sql

-- 3. Geographic Masters & User Locations
\ir migrations/003_locations.sql

-- 4. Business Profiles & Ideas
\ir migrations/004_business.sql

-- 5. Financial Profiles & Project Plans
\ir migrations/005_finance.sql

-- 6. Government Schemes & Rule Engines
\ir migrations/006_schemes.sql

-- 7. Loan Products & Amortization Repayments
\ir migrations/007_loans.sql

-- 8. Market Intelligence & Provenance
\ir migrations/008_market.sql

-- 9. AI Results, Cost Models & Simulations
\ir migrations/009_ai.sql

-- 10. Marketing Plans & Expansion Gates
\ir migrations/010_marketing.sql

-- 11. Step-by-Step Mentorship System
\ir migrations/011_mentor.sql

-- 12. Conversational Engine & Structured Dialogue
\ir migrations/012_conversations.sql

-- 13. Offline Sync & Multilingual Content
\ir migrations/013_sync.sql

-- 14. Row Level Security, Auditing & Storage
\ir migrations/014_security.sql

-- 15. Rural Demo Persona & Master Seed
\ir migrations/015_seed.sql

-- 16. Multi-Source Official Indian Datasets & Opportunity Engine
\ir migrations/016_district_data_engine.sql

COMMIT;
