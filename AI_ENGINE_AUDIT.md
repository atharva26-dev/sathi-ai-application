# SAATHI — Master AI Advisor Engine Audit

> **Document:** `AI_ENGINE_AUDIT.md`  
> **System:** Gemini-Powered SAATHI AI Advisor with Domain Instructions, Structured Context, Deterministic Financial Engines, Knowledge Base Integration, and Multilingual Reasoning  
> **Date:** September 2026

---

## 1. Existing AI Architecture
The previous AI architecture had an orchestrator dispatching user messages through:
- Intent detection with basic keywords.
- Single uncontrolled system prompt that contained mixed domain prompts.
- A 5-archetype business catalog with a fallback that risked cross-domain contamination or defaulting to dairy/tailoring.
- Skills that lacked deep rural constraints (such as credit sales discipline, competitor price undercutting, and cash shortages).

---

## 2. Problems Found & Addressed
1. **Narrow Archetype Coverage:** Only 5 basic archetypes existed (`dairy`, `tailoring`, `mobile_repair`, `grocery`, `poultry`). Users asking about goat farming, welding, bakeries, salons, handicrafts, spices, agri-inputs, logistics, or homestays lacked domain templates.
   - *Fix:* Expanded `businessCatalog.ts` to 16 full rural micro-enterprise archetypes with complete English, Hindi, and Marathi assets, pricing strategies, and operational parameters.
2. **Missing Mentor Mode for Undecided Users:** When a user asked "I don't know what business to start", earlier versions generated generic text or assumed a default business.
   - *Fix:* Implemented dedicated Mentor Mode in `BusinessAdvisorSkill` asking 3 clarifying questions (Capital, Location/Space, Skills/Interests).
3. **Open-Ended Rural Dilemmas:** Real rural entrepreneurs face specific dilemmas (e.g., customers demanding credit/udhaari, competitors selling cheaper, or sales being high but cash short at month-end).
   - *Fix:* Implemented specialized sub-intents in `BusinessAdvisorSkill` and `FinancialManagerSkill` with practical, conservative rural rules (e.g., 10% credit ceiling, 30-day service warranty, and owner's salary separation).
4. **Anti-Hallucination on Unverified Village Data:** Asking for exact competitor counts in small villages previously risked hallucination.
   - *Fix:* Enforced explicit acknowledgement of unverified local census data coupled with a 6-Step Field Validation Guide.

---

## 3. Layered Prompt Architecture
Prompts are structured into layered modules rather than a monolithic string:
- **Layer 1: Master Advisory Role** (17-in-1 Rural Advisory Council: Business Advisor, Financial Manager, Market Analyst, Loan Explainer, Scheme Navigator, Risk Analyst, Mentor, and Practical Problem Solver).
- **Layer 2: Source of Truth Tags** (USER-PROVIDED FACT, CALCULATED VALUE, VERIFIED EXTERNAL, GENERAL BUSINESS, AI ESTIMATE, ASSUMPTION, UNKNOWN).
- **Layer 3: Grassroots Knowledge Base** (Ingested from *"Rural Entrepreneurship in India – A Review"* covering liquidity constraints, middlemen bypass, power/infrastructure limits, and value-addition).
- **Layer 4: Anti-Hallucination & Field Validation Guidelines** (Explicit uncertainty declarations + 6-step local market checks).
- **Layer 5: Active Business Lock & Context** (Strictly zero dairy assumption unless active business is dairy).
- **Layer 6: Deterministic Financial Anchors** (Exact PS-91 project cost, loan component, PMEGP subsidy, EMI, moratorium interest, break-even units, and working capital buffer).
- **Layer 7: Output Structure & Readability** (`## Short Answer`, `## What this means for you`, `## Numbers`, `## Opportunity`, `## Risks`, `## What I recommend`, `## Next 3 Steps`).
- **Layer 8: Voice-Spoken Audio Summary** (1-2 natural, paced sentences for rural text-to-speech).
- **Layer 9: Authoritative Language Directive** (100% adherence to the user's selected language).

---

## 4. Gemini Integration & Security
- **API Key Security:** The Gemini API key is accessed exclusively server-side from `env.AI_API_KEY` (or `GEMINI_API_KEY`). It is never exposed in client bundles, logs, database records, or prompts visible to users.
- **Provider Implementation:** Utilizes Google Generative Language API directly via native `fetch` with structured JSON schema (`responseMimeType: 'application/json'`).
- **Resilience:** Features 2-pass retry with abort timeouts and automatic fallback to deterministic domain expert skills.

---

## 5. Context & Memory Architecture
- **Context Engine:** Assembles user profile, resolved Local Government Directory (LGD) geography (Village → Block → District → State), normalized business archetype, and deterministic financial calculations.
- **Conversational Memory:** Tracks user ID memory store with active business, last detected intent, and previous decisions.
- **Dynamic Parameter Extraction:** Extracts numeric capital updates (e.g. *"I have only ₹50,000"*) and business switch requests directly from free text, updating context overrides in real time.

---

## 6. Business Personalization (16 Rural Archetypes)
The engine provides deep domain support for:
1. `dairy`: Fresh Dairy & Paneer Processing (दूध प्रक्रिया व ताजे मलाई पनीर)
2. `mobile_repair`: Mobile & Electronics Repair (मोबाईल व लॅपटॉप रिपेअरिंग)
3. `tailoring`: Tailoring & Garments (लेडीज व जेंट्स टेलरिंग व गारमेंट्स)
4. `grocery`: Grocery & Kirana Store (किराणा व दैनंदिन वस्तू स्टोअर)
5. `poultry`: Poultry & Broiler Farming (कुक्कुटपालन केंद्र)
6. `goat_farming`: Stall-Fed Goat & Sheep Farming (शेळीपालन व पैदास केंद्र)
7. `bakery`: Bakery & Fresh Snacks Production (बेकरी व स्नॅक्स युनिट)
8. `salon`: Grooming Salon & Beauty Parlor (सलून व ब्युटी पार्लर)
9. `welding`: Welding & Metal Fabrication (वेल्डिंग व फॅब्रिकेशन)
10. `digital_services`: CSC / Cyber / Citizen Services (आपले सरकार / सीएससी केंद्र)
11. `handicrafts`: Handicrafts & Artisanal Crafts (स्थानिक हस्तकला व मातीकाम)
12. `food_processing`: Spices, Pickles & Food Processing (मसाले, लोणचे व पापड)
13. `agri_services`: Agri-Inputs, Seeds & Fertilizers (कृषी सेवा केंद्र व बियाणे)
14. `rural_transport`: Rural Logistics & Transport (मालवाहतूक सेवा)
15. `rural_tourism`: Agro-Tourism & Rural Homestay (कृषी पर्यटन व होमस्टे)
16. `generic_custom`: Custom Micro-Enterprise fallback

---

## 7. Financial Integration & PS-91 Structuring
- **Deterministic Math:** AI does not fabricate arithmetic. It reads and explains calculations from `projectCostCalculator.ts`, `emiCalculator.ts`, `breakEvenCalculator.ts`, and `workingCapitalCalculator.ts`.
- **PS-91 Ratio:** 10% Own Capital Equity → 90% Potential Loan Leverage → 35% PMEGP Rural Subsidy.
- **Safe vs Theoretical:** AI distinguishes between theoretical maximum loan eligibility and recommended safe initial investment (60% capex + 40% liquid working capital reserve).

---

## 8. Multilingual & Voice Integration
- **Selected Language is Authoritative:** Supports Marathi (`mr`), Hindi (`hi`), and English (`en`), with mappings for 20 additional Indian regional languages.
- **Voice Response Mode:** Generates a dedicated `voiceSpokenText` attribute optimized for Web Speech synthesis with natural phrasing, zero markdown symbols, and simple vocabulary.

---

## 9. Testing & Regression Validation
- **Automated Test Suite:** 6 test suites and 65 tests passing with 100% success rate (`npm test` in backend).
- **TypeScript & Bundler Validation:** Clean `tsc` compilation on backend and clean production Vite bundle on frontend.
- **Zero Regressions:** Existing authentication, database schema, PWA, and offline storage services were preserved untouched.

---

## 10. Remaining Limitations
- While 16 primary rural business archetypes are fully parameterized, highly specialized non-traditional micro-enterprises use the `generic_custom` adaptive model.
- Real-time live shop counts for remote villages require user-conducted 6-step field validation due to the absence of a live nationwide retail sensor API.
