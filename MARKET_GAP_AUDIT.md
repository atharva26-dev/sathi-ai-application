# SAATHI — Market Gap & Opportunity Engine Forensic Audit Report

### Smart India Hackathon 2026 — PS-91
**Audit Date:** September 2, 2026

---

## 1. Executive Summary & Defect Statement

### The Defect:
When an entrepreneur (e.g. Atharva Suryawanshi in Palus) selects **"Mobile & Electronics Repair"** with **₹2,50,000** capital:
- The Home screen correctly reflects: `Mobile & Electronics Repair | Own Capital: ₹2,50,000 | Estimated Surplus: ₹87,500`.
- However, clicking **"Market Gap & Opportunity"** navigates to `MarketGapScreen.tsx` which displays:
  - **"ताजे पनीर (Fresh Malai Paneer)"** with 🧀 cheese icon.
  - Quadrant scatter points labeled "कच्चे" (Raw milk), "संतुलित" (Cattle feed), "स्थानिक" (Cold transport).
  - Hardcoded Marathi title *"तुमच्या भागात कुठे संधी आहे?"* despite the global app language set to English (`Eng`).

---

## 2. Root Cause Forensic Trace (End-to-End Flow)

```
[User Input / Onboarding]
   │
   ▼
[User Profile / UserContext]
   │ (Contains: name="Atharva", village="Palus", business="Mobile & Electronics Repair", capital=250000)
   │
   ├──▶ [HomeScreen.tsx] ---------> Displays "Mobile & Electronics Repair" correctly
   │
   └──▶ [MarketGapScreen.tsx] ----> ❌ BROKEN DISCONNECT:
                                     1. Does NOT read useUser() or profile!
                                     2. Calls marketService.getMarketGaps() with NO parameters.
                                     3. marketService.ts returns static constant MARKET_GAP_ITEMS (Paneer, Curd).
                                     4. Ignores active language (hardcodes Marathi strings).
                                     5. Ignores backend POST /api/v1/market-gap/analyze.
```

### Detailed Root Cause Breakdown:

1. **Frontend Screen Decoupling (`MarketGapScreen.tsx:28-29`)**:
   ```typescript
   // MarketGapScreen.tsx
   const gaps = marketService.getMarketGaps(); // <- No user context passed!
   const [selectedGap, setSelectedGap] = useState<MarketGapItem>(gaps[0]); // Hardcoded to Paneer
   ```
   `MarketGapScreen.tsx` was completely isolated from `UserContext`. It did not pass `profile.desiredBusiness`, `profile.village`, `profile.block`, `profile.ownCapital`, or `language`.

2. **Frontend Mock Service Statically Bound to Dairy (`frontend/src/services/marketService.ts:3-160`)**:
   `MARKET_GAP_ITEMS` is a static constant array hardcoded with:
   - `gap_paneer` (Fresh Malai Paneer)
   - `gap_curd` (Fresh Set Curd)
   - `gap_raw_milk` (Raw Loose Milk)
   - `gap_animal_feed` (Balanced Cattle Feed)
   - `gap_cold_transport` (Reefer Ice Box Delivery)
   `COMPETITORS` and `LOCAL_MARKET_MAP_DATA` in `marketService.ts` were similarly hardcoded with Baramati/Supe dairy distributors and milk farmers.

3. **Backend Route Parameter Deficiency (`backend/src/routes/marketRoutes.ts:7-24`)**:
   - `GET /api/v1/market/radar` only read `location` (defaulting to `'सुपे, बारामती'`) and ignored `business`, `businessCategory`, `capital`, and `language`.
   - `GET /api/v1/market/gap` called `marketService.getMarketRadarData(location)` without passing business classification or financial capital.

4. **Absence of Canonical `MarketContext`**:
   The application lacked a unified contract linking `userId`, `businessName`, `businessCategory`, `locationHierarchy` (State, District, Taluka, Village, LGD codes), `capital`, `radiusKm`, and `language`.

5. **Arbitrary Static Scores**:
   Market gap opportunity scores (`91/100`, `88/100`) were static numbers rather than real-time deterministic scores derived from:
   $$\text{Opportunity Score} = w_1 \cdot \text{Demand} + w_2 \cdot (100 - \text{Competition}) + w_3 \cdot \text{CapitalFit} + w_4 \cdot \text{Access} + w_5 \cdot \text{Margin} + w_6 \cdot \text{CustomerPain} - \text{RiskPenalty}$$

6. **Missing Local Government Directory (LGD) Geographic Hierarchy**:
   Location entry in onboarding was free text without official LGD codes (`state_code`, `district_code`, `subdistrict_code`, `village_code`, `pincode`).

---

## 3. Repair Blueprint & Architectural Strategy

| Phase | Action Item | Target Implementation |
|---|---|---|
| **Phase 2** | Canonical Market Context | Define unified `MarketContext` type across frontend & backend. |
| **Phase 3 & 4** | Business as Source of Truth & Eliminate Dairy Bias | Remove static `MARKET_GAP_ITEMS` from universal responses; isolate dairy fixtures. |
| **Phase 5 & 6** | Arbitrary Business Support | Support any standard or custom business (e.g. "Solar pump installation"). |
| **Phase 7–11** | India LGD Location Hierarchy & Search | Normalized tables/services for States, Districts, Sub-districts/Talukas, Villages with search API. |
| **Phase 14–16** | Location & Business Specific Competitors | Competitor engine strictly matching business archetype and location radius. |
| **Phase 17–20** | Multi-Dimensional Deterministic Scoring | Calculate Demand, Competition, Capital Fit, Accessibility, Margin, Risk breakdown. |
| **Phase 21** | Cache Invalidation | Compound cache key: `market-gap:${userId}:${businessFingerprint}:${locationId}:${capital}:${radiusKm}:${lang}`. |
| **Phase 22–24** | Dynamic Opportunity Cards & Quadrant | Dynamic 4-quadrant scatter plot and cards based on calculated scores. |
| **Phase 25–40** | Multilingual & Free-form AI Grounding | Context-grounded advice in user's active language without hallucinated statistics. |
| **Phase 41–50** | API & Frontend UI Overhaul | Connect `MarketGapScreen.tsx` to live backend `POST /api/v1/market-gap/analyze`. |
