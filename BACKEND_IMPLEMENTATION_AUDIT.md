# BACKEND IMPLEMENTATION AUDIT — SAATHI
### Smart India Hackathon 2026 — PS-91

---

## 1. Existing Repository & Architecture Overview

| Layer | Current Status | Technology / Details | Notes |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Working & Consolidated** | React 18, TypeScript, Vite, Vanilla CSS, Lucide icons | Consolidated in `/frontend`. Fully functional with 22 screens, multilingual support, and offline PWA shell. |
| **Database** | **Schema Complete** | Supabase / PostgreSQL 15+ | 15 modular SQL migrations in `supabase/migrations/` covering profiles, locations, businesses, finance, schemes, loans, market intelligence, AI analyses, mentorship, conversations, and RLS. |
| **Backend** | **To Be Implemented** | Node.js / TypeScript / Express | Needs a robust, modular, production-grade backend under `/backend` with deterministic engines, AI orchestrator, and offline sync. |

---

## 2. What Is Working
- **Frontend UI/UX**: All 22 user journey screens are interactive and verified on `http://127.0.0.1:3000/`.
- **Database Architecture**: 15 idempotent migrations with Row Level Security (RLS) on 100% of tables, strong constraints, and realistic Baramati/Supe demo persona seed data.

---

## 3. What Is Incomplete & What Must Be Built
- **Backend Application Core (`/backend`)**:
  - Express.js + TypeScript server with standard `/api/v1` routes.
  - Supabase JWT authentication & user authorization middleware.
  - Request validation schemas (Zod).
  - Centralized error handling & structured logging with request IDs.
- **Deterministic Financial Calculation Engine (Zero-LLM Math)**:
  - PS-91 Margin-to-Project Waterfall: `Project Cost = Own Capital / 0.10`, `Loan Component = Project Cost * 0.90`.
  - PS-91 Scheme Rule Router with strict threshold boundaries (Micro-finance `<= ₹1.40L` at 6.5% vs Term Loan `> ₹1.40L` & `<= ₹50L` at 8.0%).
  - Reducing Balance EMI Amortization Schedule generator with moratorium grace periods.
  - Working capital liquidity buffers (15-day milk buffer, 1-month payroll, emergency reserve).
  - Break-Even Analysis (contribution per unit, division-by-zero protection, negative margin detection).
  - 3-Scenario Cash-Flow Engine (Base, Optimistic, Stress).
  - Business Stress Testing (Challenger mode with sales drop, raw material spike, runway calculation).
- **Hyper-Local Market Intelligence Engine**:
  - 4-Quadrant Market Opportunity Matrix (Demand vs Competition).
  - Reusable market area clustering (5-10 km radius).
  - Verified vs Estimated Competitor Mapping with data provenance citation.
- **AI Orchestrator & Modular Skills Layer**:
  - Modular skill dispatchers (`BusinessAdvisor`, `MarketAnalyst`, `FinancialManager`, `SchemeAdvisor`, `RiskAnalyst`, `MarketingManager`, `GrowthMentor`).
  - Backend tool-calling system ensuring LLM relies on backend code for all calculations.
  - Multilingual response formatting (Marathi, Hindi, English).
  - Hallucination guardrails & explicit trust labeling (`VERIFIED`, `CALCULATED`, `USER_PROVIDED`, `AI_ESTIMATE`, `NEEDS_VERIFICATION`).
- **Offline Synchronization Engine**:
  - `Idempotency-Key` header validation and response caching.
  - Incremental batch push/pull synchronization endpoints (`/api/v1/sync/push`, `/api/v1/sync/pull`, `/api/v1/sync/ack`).
- **Comprehensive Test Suite**:
  - Extensive unit and boundary tests for financial math, scheme routing, and API integration.

---

## 4. Security & Reliability Strategy
- **Zero Client Calculation Trust**: All financial math computed authoritatively server-side.
- **Credential Protection**: `SUPABASE_SERVICE_ROLE_KEY` used strictly server-side for background/audit tasks; never exposed to frontend.
- **Rate Limiting**: Tiered rate limits (stricter for AI/Voice endpoints, standard for profiles).
- **Prompt Injection Defense**: External/retrieved data treated strictly as untrusted data inputs, never as system instructions.
- **Audit Logging**: Structured events for financial calculations, scheme assessments, and plan modifications.

---

## 5. Implementation Sequence

1. **Phase 1**: Backend Foundation (`package.json`, `tsconfig.json`, Express app, config, middleware, error handlers, Supabase clients).
2. **Phase 2**: Deterministic Financial Engine (PS-91 waterfall, EMI, moratorium, break-even, cash flow, stress testing, working capital).
3. **Phase 3**: Scheme Rule Router & Discovery Engine (Configurable/versioned rules, PMEGP, Mudra, CMEGP, loan discovery).
4. **Phase 4**: User Profile, Location & Business Domain Services (CRUD, location hierarchy, candidate idea discovery).
5. **Phase 5**: Hyper-Local Market Intelligence Engine (Market gaps, 4-quadrant scoring, competitor mapping, data provenance).
6. **Phase 6**: AI Orchestrator & Tool Calling (Modular skills, intent detection, deterministic tool calls, hallucination control, multilingual translation).
7. **Phase 7**: Marketing, Growth & Mentorship Roadmap Services (Customer acquisition channels, phased expansion gates, actionable task checklist).
8. **Phase 8**: Voice & Offline Sync Engine (STT/TTS provider abstraction, idempotency, batch push/pull sync).
9. **Phase 9**: Automated Unit & Integration Test Suite (Boundary financial tests, routing tests, API tests).
10. **Phase 10**: Documentation & Verification (`API_DOCUMENTATION.md`, health check verification).
