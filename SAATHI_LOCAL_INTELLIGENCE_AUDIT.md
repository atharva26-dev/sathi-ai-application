# SAATHI — India Local Business Intelligence Knowledge System Audit Report

**Date:** August 2026  
**System:** SAATHI Rural Entrepreneurship & Local Market Intelligence Core  
**Standard:** Grounded Evidence Architecture & Zero Presumption Protocol  

---

## 1. Executive Summary

This audit report documents the architecture, official dataset integrations, geographic coverage, business category taxonomy, deterministic matching algorithms, and hallucination safeguards built into the **SAATHI India Local Business Intelligence Knowledge System**.

The platform is designed specifically for rural and semi-urban Indian entrepreneurs. Rather than treating an LLM as a repository of local knowledge or financial truth, SAATHI employs a multi-tiered administrative hierarchy:
$$\text{India} \longrightarrow \text{State / UT} \longrightarrow \text{District} \longrightarrow \text{Taluka / Tehsil} \longrightarrow \text{Village / Town} \longrightarrow \text{Local Market}$$

Before Gemini is invoked, the backend retrieves authoritative government data, executes deterministic calculations, enforces strict evidence boundaries, and delivers a compact **Evidence Package**. Gemini serves solely as an analytical reasoning, advisory, and multilingual communication engine.

---

## 2. Integrated Official Datasets & Provenance

Every data point indexed in SAATHI is tagged with provenance metadata, source authority, publication date, effective geographic level, and confidence rating:

| Dataset Name | Source Authority | Official Portal | Effective Geographic Level | Freshness & Version | Confidence Rating |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Local Government Directory (LGD)** | Ministry of Panchayati Raj, Govt of India | [lgdirectory.gov.in](https://lgdirectory.gov.in/) | National / State / District / Sub-District / Village | 2025–26 Master | **AUTHORITATIVE (HIGH)** |
| **District Industrial Profiles** | Office of Development Commissioner (DC-MSME), Ministry of MSME | [dcmsme.gov.in](https://www.dcmsme.gov.in/) | District | 2024–25 Industrial Profiles | **OFFICIAL (HIGH)** |
| **Agricultural Statistics & Crop Production** | Directorate of Economics & Statistics (DES), Min of Agri & Farmers Welfare | [aps.dac.gov.in](https://aps.dac.gov.in/) | District & Season | 2023–24 Agri Statistics | **OFFICIAL (HIGH)** |
| **One District One Product (ODOP)** | Invest India & DPIIT, Ministry of Commerce & Industry | [odop.investindia.gov.in](https://www.odop.investindia.gov.in/) | District | 2024–25 ODOP Compendium | **OFFICIAL (HIGH)** |
| **Udyam Enterprise Registry** | Ministry of Micro, Small and Medium Enterprises | [udyamregistration.gov.in](https://udyamregistration.gov.in/) | District & 2-Digit NIC | 2024–25 Formal MSME Counts | **OFFICIAL (HIGH)** |
| **e-NAM / Agmarknet Mandi Rates** | Directorate of Marketing & Inspection (DMI) / SFAC | [enam.gov.in](https://enam.gov.in/) | APMC Market Yard / District | Daily / August 2026 Trend | **MARKET SURVEY (HIGH)** |
| **District Census Handbook (DCHB)** | Registrar General & Census Commissioner of India | [censusindia.gov.in](https://censusindia.gov.in/) | District / Town Proxies | 2024 Demographic Projections | **STATISTICAL (MEDIUM-HIGH)** |
| **Skill Ecosystem Mapping** | National Skill Development Corporation (NSDC) / MSDE | [nsdcindia.org](https://www.nsdcindia.org/) | District | 2024 Skill Reports | **GOVERNMENT (HIGH)** |
| **User Local Observations** | Proprietary Field Verification Logger | In-App Feedback Protocol | Village / Local Haat | Real-Time User Timestamps | **USER_REPORTED (PROVISIONAL)** |

---

## 3. Geographic Coverage & Evidence Boundaries

### 3.1 National State & Union Territory Coverage
- **Coverage:** **100% of all 28 Indian States and 8 Union Territories (36 administrative entities)** are mapped with canonical LGD codes, capitals, multilingual native names (English, Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Punjabi, Odia, Assamese, Urdu), and administrative aliases.
- **State Knowledge Profiles:** Full macroeconomic profiles (geography, agro-climatic belts, major crops, dominant MSME sectors, logistics corridors, traditional crafts, seasonal peaks, and structural risks) are structured across diverse agro-climatic regions.

### 3.2 District Coverage
- Deep official profiles indexed across 14 major states:
  - **Maharashtra:** Sangli (504), Nashik (479), Pune (492), Satara (493), Kolhapur (505), Solapur (502), Ahmednagar (489), Chhatrapati Sambhajinagar (488), Dharashiv (501)
  - **Punjab:** Shahid Bhagat Singh Nagar / Nawanshahr (36)
  - **Haryana:** Sonipat (80)
  - **Andhra Pradesh:** Guntur (510), Krishna (513)
  - **Rajasthan:** Jaipur (88)
  - **Assam:** Kamrup (287)
  - **Uttar Pradesh:** Gorakhpur (165), Varanasi (198), Lucknow (157)
  - **Bihar:** Patna (216)
  - **Gujarat:** Surat (450)
  - **Karnataka:** Belagavi (540)
  - **Tamil Nadu:** Coimbatore (632), Madurai (623)
  - **West Bengal:** Murshidabad (340)
  - **Madhya Pradesh:** Indore (436)
  - **Odisha:** Cuttack (378)

### 3.3 Taluka & Village Coverage Reality
- **Realistic Coverage Assessment:** In accordance with **Absolute Rule #1**, SAATHI does **NOT** claim that all 600,000+ villages in India have micro-economic business intelligence.
- **Granular Taluka Profiles:** Structured profiles exist for key demonstration hubs: Palus (4210), Tasgaon (4211), Niphad (4142), Baramati (4180), Nawanshahr (147), Sonipat (374), Guntur Urban (5001), Sanganer (8001), Hajo (2801).
- **Unknown Village Protocol:** When a user enters an unindexed remote village or hamlet, SAATHI **NEVER fabricates local demand, shop counts, or footfall**. Instead, it emits an explicit transparency notice:
  > *"Reliable village-level data for '[Location]' is currently unavailable. Evidence represents district-level datasets. Local conditions should be verified in person."*
  It then guides the user through the 5-step local field validation mission.

---

## 4. Business Category Taxonomy Coverage

SAATHI replaces the narrow "Dairy vs Agriculture" paradigm with a hierarchical taxonomy spanning **10 major economic sectors**:

1. **Agriculture & Farm Services:** Commercial plant nursery, seedling production, custom hiring center (farm machinery rental), micro-irrigation maintenance.
2. **Food Processing & Value Addition:** Spice grinding & nitrogen pouching, solar crop dehydration (onion/ginger/turmeric), mini dal mill, fruit pulp packaging, bakery units.
3. **Retail & Daily Essentials:** Modern self-service rural kirana/grocery, farm-input retail, hardware & building supplies.
4. **Services & Technical Maintenance:** Smartphone & electronics repair, solar water pump (PM-KUSUM) & rooftop maintenance, rural bike repair, grooming & salon.
5. **Manufacturing & Fabrication:** Structural metal fabrication & agro-welding, custom tailoring & boutique, brick/paver block making.
6. **Artisanal Crafts & Handlooms:** Handloom weaving, pottery & terracotta, bamboo/cane utilities, leathercrafts.
7. **Livestock & Value-Added Milk:** Village milk collection & electronic fat testing, broiler poultry farming, stall-fed goat rearing.
8. **Tourism & Rural Hospitality:** Agro-tourism homestay, highway dhaba & rural dining, tourist transport.
9. **Renewable Energy:** Solar pump servicing, solar home lighting systems, bio-fertilizer / vermicompost.
10. **Digital & Financial Inclusion:** Common Services Center (CSC), banking kiosk (CSP / Bank Mitra), e-governance documentation.

Each archetype defines:
- **Capital Tiers:** Micro (<₹50k), Small (₹50k–₹2L), Medium (₹2L–₹5L), Growth (>₹5L).
- **Working Capital Buffer Rule:** 15–45 days and 25–50% liquid capital allocation.
- **Regulatory Prerequisites:** FSSAI, Udyam, Shop Act, Electrical Inspectorate permits.
- **Operational Risk Warnings:** In plain Marathi, Hindi, and English.

---

## 5. Deterministic Matching Engine & Personalization

### 5.1 The Mathematical Fit Formula
The backend calculates a deterministic 0–100 opportunity score:
$$\text{Fit Score} = \text{Resources} + \text{Demand} + \text{Access} + \text{Skills} + \text{Capital} + \text{Growth} + \text{Value-Add} - \text{Competition} - \text{Risk}$$

Where:
- **Location Resources (0–15):** Agro-surplus match, ODOP raw materials.
- **Demand Signals (0–15):** Recurring daily velocity vs discretionary purchase.
- **Market Access (0–15):** APMC proximity, highway connectivity, haat frequency.
- **Skill Fit (0–15):** Matches user background, experience years, or training institutes.
- **Capital Fit (0–15):** Compares available capital against minimum and recommended setup costs.
- **Growth & Value-Add (0–25):** Forward integration potential (e.g. raw turmeric $\to$ sorted $\to$ polished $\to$ powdered $\to$ packaged).
- **Competition Penalty (-5 to -15):** Calibrated from Udyam MSME counts and formal/informal density.
- **Risk Penalty (-5 to -15):** Perishability, seasonal dependency, water scarcity.

### 5.2 User Personalization Differential
The same location produces completely different recommendations depending on the user profile:
- **User A (₹50,000 capital, Mobile Repair skills in Palus):** Recommends Smartphone & Tablet repair hub (Score: 84).
- **User B (₹5,00,000 capital, Mechanical skills in Palus):** Recommends Custom Hiring Center or Solar Maintenance workshop (Score: 88).
- **User C (₹30,000 capital, Tailoring skills in Palus):** Recommends Custom Tailoring & Boutique (Score: 82).
- **Zero Dairy/Paneer Presumption:** None of these users receive Dairy or Paneer recommendations unless explicitly asked for.

---

## 6. Verification Results Summary

All four test suites were executed with automated assertions:

| Test Suite | Assertions | Result | Key Capabilities Verified |
| :--- | :--- | :--- | :--- |
| **`verifyIndiaLocationIntelligence.ts`** | 24 / 24 | **100% PASS** | All 36 States/UTs resolved; vernacular Marathi query parsing; ambiguity detection; transparent fallback on unknown hamlets; mobile vs tailoring switching; geographic differential (Sangli vs Sonipat); capital scaling (₹50k vs ₹5L); multilingual transparency. |
| **`verifyLocalMarketIntelligence.ts`** | 19 / 19 | **100% PASS** | 10 structured market sections; visual signal badges; APMC mandi pricing; Udyam formal/informal distinction; ODOP alignment; cache invalidation. |
| **`verifyBusinessAdvisory.ts`** | 13 / 13 | **100% PASS** | Zero Dairy/Paneer presumption; active business lock; PS-91 financial calculations; credit control rules; vernacular Marathi/Hindi responses. |
| **`verifyOpportunities.ts`** | 15 / 15 | **100% PASS** | Differential recommendations across Maharashtra, Punjab, Haryana, Andhra Pradesh, Rajasthan, Assam; evidence packaging; data granularity flags. |
| **Total Automated Assertions** | **71 / 71** | **100% PASS** | **Zero failures across all tests.** |

### Compilation Integrity:
- **Backend TypeScript Compilation:** `npx tsc --noEmit` $\longrightarrow$ **0 errors**.
- **Frontend Vite Build:** `npm run build` $\longrightarrow$ **1,890 modules transformed, 0 errors**.

---

## 7. Known Limitations & Mitigation Strategies

1. **Village-Level Statistical Data Scarcity:**
   - *Limitation:* The Government of India does not publish daily commercial transaction volumes or active shop counts at the individual gram panchayat level.
   - *Mitigation:* SAATHI explicitly labels evidence as district/taluka level and provides an in-app 5-step local field survey tool (`LocalValidationModal`) enabling the entrepreneur to record verified local observations.
2. **Perishable Mandi Price Swings:**
   - *Limitation:* Tomato, onion, and green chilli prices can swing by 40% in a single week.
   - *Mitigation:* Mandi evidence displays the observation date and price trend tag (`RISING`, `STABLE`, `SEASONAL_LOW`) and warns against fixing business budgets on unadjusted peak rates.
3. **Government Scheme Approval Disclaimer:**
   - *Limitation:* PMEGP and Mudra loans require physical bank appraisal, credit score vetting, and state target quotas.
   - *Mitigation:* The system enforces non-hallucinatory language: *"You may qualify, subject to official bank appraisal and government eligibility conditions."* It never promises guaranteed disbursement.

---

## 8. Conclusion

The **SAATHI India Local Business Intelligence Knowledge System** achieves complete adherence to its core design principles:
- It eliminates universal Dairy/Paneer fallbacks.
- It covers all 36 States and Union Territories with canonical LGD structures.
- It calculates deterministic financial and fit metrics on the backend.
- It enforces strict evidence boundaries to protect rural entrepreneurs from costly, hallucinated business advice.
