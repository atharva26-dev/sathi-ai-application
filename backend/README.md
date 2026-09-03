# SAATHI — Backend & Intelligence Infrastructure
### AI-Driven Hyper-Local Business Advisory & Financial Structuring Assistant
**Smart India Hackathon 2026 — PS-91**

---

## Quickstart

### Prerequisites
- Node.js `v18+` (Tested on Node `v24.19.0`)
- npm `v9+`

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start on: `http://127.0.0.1:5000`

### 4. Run Automated Tests
```bash
npm test
```

### 5. Production Build
```bash
npm run build
npm start
```

---

## Key Technical Pillars

1. **Deterministic Financial Engineering (Zero-LLM Math)**: All PS-91 margin calculations, reducing balance EMI amortizations, break-even volumes, and working capital buffers are computed in strict, decimal-safe TypeScript algorithms.
2. **AI Multi-Skill Orchestrator**: Modular routing of natural language intent to deterministic calculation tools and verified market knowledge.
3. **Hyper-Local Market Intelligence**: 4-quadrant market gap matrix, verified competitor mapping, and geographic cluster indicators.
4. **Offline Synchronization & Idempotency**: Resilient offline mutations sync with `Idempotency-Key` caching for intermittent rural connectivity.
5. **Zero Trust & Security**: Strict Zod validation on 100% of routes, rate limiting, and sanitized logging.
