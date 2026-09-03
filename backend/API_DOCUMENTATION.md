# SAATHI Backend API Documentation
### Smart India Hackathon 2026 — PS-91

---

## 1. Overview & Architecture

- **Base URL**: `http://127.0.0.1:5000/api/v1`
- **Protocol**: REST over HTTPS / HTTP with standard JSON envelopes.
- **Authentication**: Supabase JWT (`Authorization: Bearer <token>`).
- **Idempotency**: Supported on mutation endpoints via `Idempotency-Key` header.
- **Rate Limiting**: Tiered (30 req/min for AI, 120 req/min for standard queries).

---

## 2. Standard Response Format

### Success:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "request_id": "req_uuid4",
    "timestamp": "2026-09-01T17:00:00.000Z"
  }
}
```

### Failure:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Available capital must be greater than zero.",
    "details": {}
  },
  "meta": {
    "request_id": "req_uuid4",
    "timestamp": "2026-09-01T17:00:00.000Z"
  }
}
```

---

## 3. Core API Endpoints

### 3.1 Health & Observability
- **`GET /health`**: Returns system status and uptime.
- **`GET /health/ready`**: Returns dependency readiness.

### 3.2 Deterministic Financial Mathematics (Zero-LLM Math)
- **`POST /api/v1/finance/structure-project`**
  - **Body**: `{ "availableCapital": 100000, "marginPercent": 10, "subsidyRate": 0.35 }`
  - **Response**: PS-91 structured project cost (₹10,00,000), loan component (₹9,00,000), estimated PMEGP subsidy (₹3,50,000), and scheme routing category.
- **`POST /api/v1/finance/emi`**
  - **Body**: `{ "loanAmount": 900000, "annualInterestRate": 9.5, "tenureMonths": 60, "moratoriumMonths": 6 }`
  - **Response**: Monthly regular EMI, monthly moratorium interest-only payment, total interest payable, and 60-month detailed amortization schedule.
- **`POST /api/v1/finance/break-even`**
  - **Body**: `{ "monthlyFixedCosts": 30000, "variableCostPerUnit": 245, "sellingPricePerUnit": 320 }`
  - **Response**: Contribution margin (₹75), break-even units/month (400), daily target (14 kg/day), break-even revenue (₹1,28,000).
- **`POST /api/v1/finance/cash-flow`**
  - **Body**: `{ "dailyUnits": 25, "sellingPrice": 320, "rawMaterialCost": 245, "monthlyLabor": 15000, "monthlyRentPower": 8000, "monthlyTransport": 6000, "monthlyOtherFixed": 3000, "monthlyLoanEMI": 19000 }`
  - **Response**: Base, Optimistic, and Stress case monthly revenues, expenses, net surplus, and Debt Service Coverage Ratio (DSCR).
- **`POST /api/v1/finance/working-capital`**
  - **Body**: `{ "unitsPerDay": 25, "rawMaterialCostPerUnit": 180, "monthlySalaries": 15000, "monthlyUtilities": 10000, "availableCapital": 100000 }`
  - **Response**: 15-day raw milk buffer cost (₹67,500), monthly operating overhead, emergency reserve, and liquidity gap analysis.
- **`POST /api/v1/finance/stress-test`**
  - **Body**: `{ "dailyUnits": 25, "sellingPrice": 320, "rawMaterialCost": 245, "monthlyFixed": 32000, "availableReserve": 75000 }`
  - **Response**: 4 scenario impact evaluations (Normal, Peak +20%, Sales Drop -30%, Milk Spike +15%), survival runway months, and resilience score.

### 3.3 AI Conversational Advisory & Multi-Skill Orchestrator
- **`POST /api/v1/ai/chat`**
  - **Body**: `{ "message": "माझ्याकडे १ लाख रुपये आहेत, मी कोणता व्यवसाय सुरू करू शकतो?", "language": "mr", "context": { "capital": 100000, "location": "सुपे, बारामती" } }`
  - **Response**: Multi-lingual vernacular answer, voice text, interactive UI card payloads, suggested follow-ups, verified source citations, and trust level badge (`CALCULATED` / `FACT` / `AI_ESTIMATE`).

### 3.4 Hyper-Local Market & Scheme Discovery
- **`GET /api/v1/market/radar?location=सुपे, बारामती&radiusKm=10`**: Returns geographic cluster center, verified market indicators, nearby buyers, suppliers, and competitors.
- **`GET /api/v1/market/gap`**: Returns 4-quadrant demand vs competition matrix items.
- **`GET /api/v1/market/competitors`**: Returns verified and estimated competitor listings.
- **`GET /api/v1/schemes?projectCost=1000000&isRural=true`**: Returns evaluated government schemes (PMEGP, Mudra, CMEGP) with required document checklists.

### 3.5 Marketing & Growth Roadmap
- **`GET /api/v1/marketing/channels`**: Returns rural customer acquisition channel playbooks.
- **`GET /api/v1/marketing/pricing?cost=245`**: Returns pricing floor, competitor ceiling, and recommended price.
- **`GET /api/v1/roadmap/tasks`**: Returns action items categorized into Today, This Week, This Month, Next 90 Days.
- **`PATCH /api/v1/roadmap/tasks/:id`**: Toggles task completion status.
- **`GET /api/v1/roadmap/expansion`**: Returns expansion milestones with prerequisite safety gates.

### 3.6 Low-Connectivity Offline Synchronization
- **`POST /api/v1/sync/push`** (with `Idempotency-Key` header): Processes batch offline mutations.
- **`GET /api/v1/sync/pull`**: Pulls incremental server updates since timestamp.
- **`POST /api/v1/sync/ack`**: Acknowledges client synchronization state.
