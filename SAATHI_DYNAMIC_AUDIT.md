# SAATHI — MASTER DYNAMIC AI, MULTILINGUAL, LOCATION-AWARE & BUSINESS-AGNOSTIC FORENSIC AUDIT
### Smart India Hackathon 2026 — PS-91
**Audit Date**: September 1, 2026  
**Auditor**: Lead Product Designer, Frontend Architect, and Backend Systems Engineer  
**Mode**: Pure Read-Only Audit & Forensic Trace  

---

## 1. Executive Summary

This forensic audit identifies the exact root causes behind:
1. **Onboarding UX Defects**: Pre-filled/preset options (e.g. Ramesh Patil, Supe Baramati, ₹1,00,000, Dairy) that override natural user input.
2. **Language Inconsistencies**: Language selection dropping to Marathi or English due to fallback `translations.mr` and hardcoded strings bypassing the translation schema.
3. **Limited Language Coverage**: Only 3 languages (`mr`, `hi`, `en`) officially registered in `supportedLanguages`, while 22 Eighth Schedule languages need structural representation.
4. **Restricted AI Conversation**: Frontend `conversationService.ts` executing local hardcoded string matching without proxying free-form questions to the backend `/api/v1/ai/chat`.
5. **Location & Business Bias**: Hardcoded Dairy & Paneer unit economics (₹36/L milk, ₹310/kg paneer, 25 kg/day, Baramati cluster) in context engine and market matrix.

---

## 2. Detailed Findings (A through S)

### A. Where User Language is Stored
- **Frontend Storage**: `localStorage.getItem('preferred_language')` managed by `LanguageProvider` in [frontend/src/context/LanguageContext.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/LanguageContext.tsx).
- **Profile Object**: `UserProfile.preferredLanguage` in [frontend/src/services/profileService.ts](file:///c:/Users/Dell/Documents/sathi/frontend/src/services/profileService.ts) and [backend/src/services/profileService.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/services/profileService.ts).
- **Default Value**: Hardcoded to `'mr'` in both contexts.

### B. Where Selected Language is Lost
- **Locale Fallback Bug**: In [frontend/src/locales/index.ts](file:///c:/Users/Dell/Documents/sathi/frontend/src/locales/index.ts#L24-L26):
  ```ts
  export function getTranslation(lang: LanguageCode): TranslationSchema {
    return translations[lang] || translations.mr; // ❌ Falls back to Marathi when any other language is requested!
  }
  ```
- **Voice Greeting Bias**: In [LanguageSelectScreen.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/LanguageSelectScreen.tsx#L18-L23), an audio prompt in Marathi plays unconditionally on mount before language is picked.
- **Voice Onboarding Prompt Bias**: In [VoiceOnboardingFlow.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/VoiceOnboardingFlow.tsx#L52-L97), `audioPrompt` strings on every step are literal Marathi strings.

### C. Where UI Strings Bypass Localization
1. [VoiceOnboardingFlow.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/VoiceOnboardingFlow.tsx): Step audio prompts, placeholder texts, and `quickPresets` chips.
2. [MarketGapScreen.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/MarketGapScreen.tsx): Story mode texts, buyer hotel names, product units (`kg`, `लिटर`).
3. [PricingStrategyScreen.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/PricingStrategyScreen.tsx): Hardcoded unit prices and cost items (`कच्चा माल`, `दूध`).
4. [CompetitorMappingScreen.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/CompetitorMappingScreen.tsx): Competitor names and route notes.
5. [ProfileScreen.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/ProfileScreen.tsx): Skill tags and asset checklist strings.

### D. Where Marathi is Hardcoded
- `DEFAULT_PROFILE` and `DEMO_PROFILE` in [frontend/src/services/profileService.ts](file:///c:/Users/Dell/Documents/sathi/frontend/src/services/profileService.ts) and [backend/src/services/profileService.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/services/profileService.ts).
- Initial state of `answers` in [VoiceOnboardingFlow.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/VoiceOnboardingFlow.tsx#L32-L42).
- Hardcoded Marathi in `LanguageProvider` default state `'mr'`.

### E. Where Dairy is Hardcoded
- [UserContext.tsx](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/UserContext.tsx#L23): `return opportunities[0]; // Dairy & Paneer default`
- [businessService.ts](file:///c:/Users/Dell/Documents/sathi/frontend/src/services/businessService.ts#L11): `biz_dairy_paneer` as the static opportunity.
- [marketService.ts](file:///c:/Users/Dell/Documents/sathi/frontend/src/services/marketService.ts#L5): `gap_paneer` as default gap item.
- [backend/src/ai/context/contextEngine.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/ai/context/contextEngine.ts#L23-L28): `dailyMilkSurplus`, `unmetPaneerDemandKg`, `rawMaterialCost: 245`, `sellingPrice: 320`.
- [backend/src/domain/market/competitorEngine.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/domain/market/competitorEngine.ts#L21): `category = 'Dairy & Milk Products'`.

### F. Where Location is Stored
- User profile in `localStorage` under `user_profile` (`village`, `block`, `district`, `state`).
- Backend session profile in `backend/src/services/profileService.ts`.

### G. Where Location is Passed to Backend
- `POST /api/v1/profile/onboard` with body `{ village, block, district, state }`.
- `POST /api/v1/ai/chat` with body `{ context: { location } }`.
- `GET /api/v1/market/radar?cluster=...` and `GET /api/v1/businesses/discovery?cluster=...`.

### H. Where Location is Used by AI
- [backend/src/ai/context/contextEngine.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/ai/context/contextEngine.ts): `locationCluster` formatted into prompt context and passed to domain matrix tools.
- [backend/src/ai/providers/geminiProvider.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/ai/providers/geminiProvider.ts): Passed in `systemPrompt` as authoritative location.

### I. Where Business Category is Stored
- `UserProfile.desiredBusiness` and `UserProfile.existingBusiness`.
- `UserContext.selectedOpportunity`.

### J. Where Business Category is Passed to Backend
- `POST /api/v1/profile/onboard` with body `{ desiredBusiness, existingBusiness }`.
- `POST /api/v1/ai/chat` with body `{ context: { businessName } }`.

### K. Where Business Category is Used by AI
- In [contextEngine.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/ai/context/contextEngine.ts) as `activeConversationState.selectedBusiness`.
- In [geminiProvider.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/ai/providers/geminiProvider.ts) in system prompt.

### L. Where Predefined Questions are Generated
- [frontend/src/services/conversationService.ts](file:///c:/Users/Dell/Documents/sathi/frontend/src/services/conversationService.ts#L6-L39): `SUGGESTED_QUESTIONS` map.

### M. Where Free-Form User Questions are Handled
- **Frontend Defect**: [frontend/src/services/conversationService.ts](file:///c:/Users/Dell/Documents/sathi/frontend/src/services/conversationService.ts#L136-L232) intercepts user text with static `if-else` keywords rather than dispatching to backend `/api/v1/ai/chat`.
- **Backend Capability**: [backend/src/routes/aiRoutes.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/routes/aiRoutes.ts) exposes `POST /api/v1/ai/chat` which fully supports arbitrary free-form queries.

### N. Where Gemini is Called
- Exclusively in [backend/src/ai/providers/geminiProvider.ts](file:///c:/Users/Dell/Documents/sathi/backend/src/ai/providers/geminiProvider.ts#L86-L106) via Google Generative Language API endpoint.

### O. Which Gemini Model / Configuration is Used
- Model: `gemini-1.5-flash` / `gemini-1.5-pro` (configurable via `env.AI_MODEL_NAME`).
- Config: `temperature: 0.2`, `maxOutputTokens: 2048`, `responseMimeType: 'application/json'`.

### P. Whether Gemini is Called from Backend or Frontend
- **100% Backend**. Zero client-side API calls to Google Gemini.

### Q. Whether API Keys are Exposed
- **Secure**: `GEMINI_API_KEY` is loaded strictly by `backend/src/config/env.ts` from `.env.local`. It is not present in Vite defines, frontend assets, logs, or response payloads.

### R. Which Data is Real vs Mock/Demo
- **Deterministic Math & Rules (REAL)**: PS-91 waterfall formulas ($M / 0.10$), Reducing balance EMI with 6-month moratorium, Break-even zero-division formulas, PMEGP 35% subsidy rules, RBI working capital norms.
- **Demo Placeholders (MOCK)**: Ramesh Patil profile, Supe Baramati village, fixed 28 dhabas and milk surplus statistics.

### S. Which Existing Components Can Safely Be Reused
- All 22 screen layouts and navigation transitions.
- PWA service worker and manifest (`/public/sw.js`, `/public/manifest.json`).
- Core CSS design system tokens (`index.css`).
- Express server, Zod validation, JWT authentication, rate limiting, and idempotency engine.

---

## 3. Root Cause Summary Table

| Issue ID | Problem Description | Root Cause File & Line | Target Repair Strategy |
| :--- | :--- | :--- | :--- |
| **RC-1** | Onboarding pre-fills Ramesh Patil and artificial options | `VoiceOnboardingFlow.tsx:32-42`, `profileService.ts:27-40` | Empty initial state, clear placeholders, free text/voice input fields. |
| **RC-2** | Fallback drops to Marathi when English is selected | `locales/index.ts:24-26` | Fallback hierarchy: `selected -> configured -> English (en)`. |
| **RC-3** | Indian languages limited to 3 choices | `locales/index.ts:18-22` | Support 22 Eighth Schedule Indian languages + English in language selector. |
| **RC-4** | Frontend AI ignores free-form questions and backend API | `conversationService.ts:136-232` | Proxy user questions to backend `/api/v1/ai/chat` with dynamic context. |
| **RC-5** | Hardcoded Dairy & Baramati across calculations | `contextEngine.ts`, `ideaGenerator.ts`, `marketOpportunityMatrix.ts`, `competitorEngine.ts` | Dynamic business normalizer & dynamic location-aware market/competitor generator. |
| **RC-6** | Unit economics assumed to be milk/paneer | `BusinessSimulatorScreen.tsx`, `PricingStrategyScreen.tsx`, `FinancialManagerScreen.tsx` | Dynamic unit labels (`units/day`, `items`, `services`, `repairs`, `orders`) based on selected business. |

---

## 4. Master Repair Blueprint

```
1. UNIFIED USER CONTEXT (Frontend + Backend)
   - Store real user inputs (name, age, mobile, location, capital, business, stage).
   - Empty initial defaults for new users; load demo ONLY when explicitly requested.

2. EXPANDED INDIAN LOCALIZATION ENGINE
   - 22 Eighth Schedule languages + English native names in native scripts.
   - Strict fallback to English if string missing; never force Marathi.
   - Centralize all static screen strings into translation keys.

3. DYNAMIC BUSINESS ADVISORY ENGINE
   - Category Normalizer: maps "tailoring", "mobile repair", "kirana", "dairy", "poultry", "solar pump", etc. to structured business schemas.
   - Business-specific unit economics: capex, raw materials, pricing floor/ceiling, daily volumes, key assets, licenses, and specific risks.

4. DYNAMIC LOCATION & MARKET ENGINE
   - Adapts market radar, competition, local demand, and transport logistics to user's specified village, block, district, and state.
   - Transparent truth labeling: `FACT`, `CALCULATED`, `AI_ESTIMATE`.

5. FREE-FORM AI ORCHESTRATION PIPELINE
   - Frontend `conversationService.ts` dispatches to backend `/api/v1/ai/chat`.
   - Multi-skill reasoning over user profile, business domain, location, and conversation memory.
   - Handles any question, follow-up, or mixed-language speech.
```
