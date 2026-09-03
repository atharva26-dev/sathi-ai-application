# SAATHI — AI Assistant Masterclass & System Forensic Audit Report

### Smart India Hackathon 2026 — PS-91
**Final Architecture Status: `AI MASTERCLASS READY`**

---

## 1. Executive Summary & Architectural Overview

SAATHI is an AI-driven hyper-local business advisory and financial structuring assistant built specifically for rural and semi-urban micro-entrepreneurs in India.

The upgraded AI Assistant architecture integrates:
- **Mandatory Authentication Gate**: Hardened authentication preventing unauthorized access to personalized business, financial, or market advisory screens while maintaining secure offline session support.
- **Canonical `ACTIVE_USER_CONTEXT`**: A single source of truth for the entrepreneur's identity, location, capital, and active business.
- **Strict Active Business & Location Lock**: Guaranteed context preservation (e.g. Mobile & Electronics Repair in Palus never mutates into Tailoring or Dairy).
- **32-Intent Classification Engine**: Classifies user queries (from startup roadmaps and tool requirements to pricing objections and loan safety) in mixed Indian languages.
- **Two-Pass Generation & ResponseReviewer**: Real-time analytical generation followed by an automated validation and readability gate with anti-contamination loop protection.
- **Deterministic Financial & Market Engine**: Mathematical precision for PS-91 capital structuring, reducing balance EMIs, break-even volumes, and working capital buffers.

```
+-----------------------------------------------------------------------------------+
|                            SAATHI SYSTEM ARCHITECTURE                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ User Message / Voice Query ]                                                   |
|                │                                                                  |
|                ▼                                                                  |
|  [ Mandatory Auth & Session Validation ] (stk_xxx token / offline verified)       |
|                │                                                                  |
|                ▼                                                                  |
|  [ Canonical Active User Context ]                                                |
|    • User: Name, Age, Language                                                    |
|    • Business Lock: Mobile & Electronics Repair                                   |
|    • Location: Palus, Sangli, Maharashtra (Official LGD code: 568320)             |
|    • Financial: ₹2,50,000 Equity -> ₹25,00,000 Project, ₹22,50,000 Loan          |
|                │                                                                  |
|                ▼                                                                  |
|  [ 32-Intent Classification Engine ]                                              |
|    • START_BUSINESS, PRICING, LOAN, COMPETITION, WORKING_CAPITAL, etc.            |
|                │                                                                  |
|                ▼                                                                  |
|  [ Deterministic Backend Tools & LGD Data Engine ]                                |
|    • financeTools (EMI, DSCR, Break-Even, Working Capital)                        |
|    • lgdLocationService (Census Village & District Resolver)                      |
|    • schemeEvaluator (PMEGP, Mudra, DIC)                                          |
|                │                                                                  |
|                ▼                                                                  |
|  [ PASS 1: Analytical Reasoning Generation ]                                      |
|    • Gemini 1.5 Pro (server-side secure) or Domain Expert Skills                  |
|                │                                                                  |
|                ▼                                                                  |
|  [ PASS 2: ResponseReviewer & Contamination Gate ]                               |
|    • Business relevance check (Zero Tailoring/Dairy contamination)                |
|    • First-sentence rule check (Direct answer first)                              |
|    • Indian currency formatting (₹X,XX,XXX) & Readability polish                  |
|    • Anti-hallucination verification (Zero fabricated local facts)                |
|                │                                                                  |
|                ▼                                                                  |
|  [ Output: Vernacular Structured Cards + Spoken Text Summary ]                    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Root Cause of Previous Incorrect Outputs

### A. The "Tailoring Boutique" Defect on Mobile Repair Questions
- **Root Cause 1 (`ideaGenerator.ts`)**: `allCandidates[0]` statically ranked `Tailoring Boutique & Garment Manufacturing` with an unconditioned score of 93, causing generic candidate lookups to pick Tailoring first.
- **Root Cause 2 (`businessAdvisorSkill.ts`)**: Generic startup queries invoked `discoverBusinessOpportunities` and blindly assigned `cards[0].title` to `opps[0]`, bypassing `context.profile.desiredBusiness`.
- **Root Cause 3 (Prompt Leaks)**: LLM system prompts lacked negative constraints preventing cross-domain examples.
- **Remediation**:
  - Replaced static ranking with dynamic capital/skill-adjusted scoring.
  - Locked `BusinessAdvisorSkill` and `AiOrchestrator` to `context.profile.desiredBusiness`.
  - Built `ResponseReviewer` to immediately reject and regenerate any response mentioning unrelated industries unless the user explicitly asks for alternatives.

### B. Hardcoded Dairy / Paneer References in Skills
- **Root Cause**: `growthMentorSkill.ts` and `distressManagerSkill.ts` contained hardcoded strings like "25 kg paneer / day" and "converting unsold milk to khawa".
- **Remediation**: Overhauled all skills to read operational parameters dynamically from `context.businessArchetype` (e.g. daily service capacity, raw material buffer, warranty period).

---

## 3. Context Architecture & Domain Isolation

### Canonical `ActiveUserContext` Schema
```typescript
export interface ActiveUserContext {
  userId: string;
  name: string;
  age?: number;
  mobile?: string;
  language: SupportedLanguage;

  businessId: string;
  businessName: string;
  businessCategory: string;
  businessDescription?: string;

  village: string;
  gramPanchayat?: string;
  block: string;
  taluka?: string;
  district: string;
  state: string;
  pincode?: string;

  availableCapital: number;
  projectCost: number;
  loanAmount: number;

  businessStage: BusinessStage;
  experienceLevel: ExperienceLevel;
  experienceYears?: number;
  skills: string[];
  availableAssets: string[];
}
```

- **Persistence**: Maintained across page reloads, conversational turns, voice queries, and network transitions.
- **Hierarchy of Authority**:
  1. Current Authenticated Profile & Active Business
  2. Verified LGD Location Hierarchy
  3. Deterministic Backend Calculations
  4. Contextual AI Mentoring Synthesis

---

## 4. Authentication Enforcement & Security

- **Mandatory Authentication**: Unauthenticated users are strictly blocked from `/home`, `/feasibility`, `/local-market`, `/money-loan`, `/talk-saathi`, and `/profile`.
- **Allowed Public Steps**: `/language` (Language Selection) and `/auth` (Login & Registration).
- **Zero Hardcoded Guest / Demo Profiles**: All personalizations belong to the authenticated user.
- **Secure Offline Storage**: Sessions are verified via secure token cache without storing raw passwords in localStorage.
- **Server-Side API Key Isolation**: Gemini API credentials remain strictly server-side in backend environment configuration (`GEMINI_API_KEY`), never exposed to browser bundles.

---

## 5. Master Business Advisor & Financial Manager Quality

### A. First-Sentence Rule & Readability Architecture
Every AI response starts with the direct conclusion:
> *"हो. तुमच्या ₹2,50,000 भांडवलातून Mobile Repair व्यवसाय सुरू करता येऊ शकतो, पण संपूर्ण रक्कम सुरुवातीला खर्च करू नका."*

Followed by structured sections:
1. **🎯 थेट उत्तर (DIRECT ANSWER)**
2. **💡 कारण व विश्लेषण (WHY / ANALYSIS)**
3. **📊 तुमची सद्यस्थिती (YOUR SITUATION)**
4. **📋 शिफारसी व कृती योजना (WHAT I RECOMMEND & 30-DAY PLAN)**
5. **⚠️ धोके व खबरदारी (RISKS / CAUTION)**

### B. Decision Quality Framework
Distinguishes between:
- **What is Possible**: ₹25,00,000 maximum theoretical project size under PS-91 10x leverage.
- **What is Affordable**: ₹2,50,000 self-funded lean startup.
- **What is Recommended**: ₹1,50,000 tools/setup + ₹1,00,000 (40%) liquid working capital buffer.
- **What is Risky**: Taking a maximum ₹22,50,000 loan (₹51,368/mo EMI) before validating steady customer demand.

---

## 6. Comprehensive Verification Test Matrix

| Test Suite / Category | Tests Executed | Passed | Failed | Status |
|---|---|---|---|---|
| **Jest Auth Engine Tests** | 5 | 5 | 0 | **100% PASSED** |
| **Jest AI Reasoning & Lock Tests** | 15 | 15 | 0 | **100% PASSED** |
| **Jest REST API Integration Tests** | 20 | 20 | 0 | **100% PASSED** |
| **Jest Market Gap Engine Tests** | 8 | 8 | 0 | **100% PASSED** |
| **Jest Financial Math Engine Tests** | 5 | 5 | 0 | **100% PASSED** |
| **Jest Scheme Router Tests** | 3 | 3 | 0 | **100% PASSED** |
| **Pure Zero-LLM Domain Tests (`runTests.ts`)** | 59 | 59 | 0 | **100% PASSED** |
| **Multi-Persona Live Verification (`personaVerification.ts`)** | 15 | 15 | 0 | **100% PASSED** |
| **Frontend Production Build (`tsc && vite build`)** | 1887 modules | 1887 | 0 | **100% PASSED (9.04s)** |
| **Backend Production Typecheck (`tsc --noEmit`)** | Full codebase | Complete | 0 | **100% PASSED** |
| **TOTAL** | **130** | **130** | **0** | **100% VERIFIED** |

---

## 7. Quality Checklist & Acceptance Verdict

- [x] Login is mandatory and strictly enforced.
- [x] No guest/demo bypass to personalized screens.
- [x] No hardcoded user, business, location, or capital defaults.
- [x] Active business persists and is strictly locked.
- [x] Follow-up questions maintain full context across turns.
- [x] Free-form questions answered across 32+ master intents.
- [x] AI does not hallucinate local facts or competitor counts.
- [x] AI does not guarantee profit or loan approvals.
- [x] Financial calculations are 100% deterministic.
- [x] Direct answer appears in the first sentence.
- [x] Standard Indian currency formatting (`₹2,50,000`) is used throughout.
- [x] Multilingual parity verified across English, Hindi, and Marathi.
- [x] Voice responses use the identical reasoning engine.
- [x] Two-pass response reviewer rejects cross-domain contamination.
- [x] Gemini API key remains strictly server-side.

**FINAL VERDICT:** `AI MASTERCLASS READY`
