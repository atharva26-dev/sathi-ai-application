import request from 'supertest';
import { createApp } from '../src/app';

jest.setTimeout(30000);

const app = createApp();

describe('SAATHI Backend REST API Integration End-to-End Test Suite', () => {
  describe('Health & Observability', () => {
    it('GET /health should return 200 UP with metadata and request_id', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('UP');
      expect(res.body.meta.request_id).toBeDefined();
    });

    it('GET /health/ready should return 200 READY', async () => {
      const res = await request(app).get('/health/ready');
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('READY');
    });
  });

  describe('Financial Structuring & Deterministic Math APIs', () => {
    it('POST /api/v1/finance/structure-project should return PS-91 project structure for ₹1,00,000', async () => {
      const res = await request(app)
        .post('/api/v1/finance/structure-project')
        .send({ availableCapital: 100000, marginPercent: 10, subsidyRate: 0.35 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.structure.projectCost).toBe(1000000);
      expect(res.body.data.structure.loanComponent).toBe(900000);
      expect(res.body.data.structure.estimatedSubsidy).toBe(350000);
      expect(res.body.data.schemeRoute.category).toBe('TERM_LOAN');
    });

    it('POST /api/v1/finance/structure-project should reject non-positive capital with 400 VALIDATION_ERROR', async () => {
      const res = await request(app)
        .post('/api/v1/finance/structure-project')
        .send({ availableCapital: -500 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/v1/finance/emi should return 60-month amortization schedule with 6-month moratorium', async () => {
      const res = await request(app)
        .post('/api/v1/finance/emi')
        .send({
          loanAmount: 900000,
          annualInterestRate: 9.5,
          tenureMonths: 60,
          moratoriumMonths: 6
        });

      expect(res.status).toBe(200);
      expect(res.body.data.loanAmount).toBe(900000);
      expect(res.body.data.moratoriumMonthlyPayment).toBe(7125);
      expect(res.body.data.schedule.length).toBe(60);
    });

    it('POST /api/v1/finance/break-even should compute break-even units correctly', async () => {
      const res = await request(app)
        .post('/api/v1/finance/break-even')
        .send({
          monthlyFixedCosts: 30000,
          variableCostPerUnit: 245,
          sellingPricePerUnit: 320
        });

      expect(res.status).toBe(200);
      expect(res.body.data.isViable).toBe(true);
      expect(res.body.data.breakEvenUnitsPerMonth).toBe(400);
    });
  });

  describe('Hyper-Local Market & Scheme APIs', () => {
    it('GET /api/v1/market/radar should return local indicators, buyers, suppliers, and competitors', async () => {
      const res = await request(app)
        .get('/api/v1/market/radar')
        .query({ location: 'सुपे, बारामती', radiusKm: 10 });

      expect(res.status).toBe(200);
      expect(res.body.data.centerLocation.name).toContain('Supe');
      expect(res.body.data.indicators.length).toBeGreaterThanOrEqual(3);
      expect(res.body.data.buyers.length).toBeGreaterThan(0);
      expect(res.body.data.competitors.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/schemes should return evaluated government schemes with required documents', async () => {
      const res = await request(app)
        .get('/api/v1/schemes')
        .query({ projectCost: 1000000, isRural: 'true' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
      expect(res.body.data[0].id).toBe('scheme_pmegp');
      expect(res.body.data[0].requiredDocuments.length).toBeGreaterThan(3);
    });
  });

  describe('AI Conversational Advisory & Multi-Skill Orchestrator', () => {
    it('POST /api/v1/ai/chat should answer capital queries using deterministic finance tools', async () => {
      const res = await request(app)
        .post('/api/v1/ai/chat')
        .send({
          message: 'माझ्याकडे १ लाख रुपये आहेत, मी कोणता व्यवसाय सुरू करू शकतो?',
          language: 'mr',
          context: { capital: 100000, location: 'सुपे, बारामती' }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cards.length).toBeGreaterThan(0);
      expect(res.body.data.voiceSpokenText).toBeDefined();
      expect(['FACT', 'CALCULATED', 'AI_ESTIMATE']).toContain(res.body.data.trustLevel);
    });

    it('POST /api/v1/ai/chat should answer EMI queries with exact calculations', async () => {
      const res = await request(app)
        .post('/api/v1/ai/chat')
        .send({
          message: 'माझा मासिक हप्ता (EMI) किती असेल?',
          language: 'mr',
          context: { capital: 100000 }
        });

      expect(res.status).toBe(200);
      expect(res.body.data.calculations).toBeDefined();
    });
  });

  describe('Offline Sync & Idempotency', () => {
    it('POST /api/v1/sync/push should process batch mutations with idempotency', async () => {
      const res = await request(app)
        .post('/api/v1/sync/push')
        .set('Idempotency-Key', 'test-idempotency-key-001')
        .send({
          deviceId: 'pwa-client-001',
          mutations: [
            {
              id: 'mut-1',
              entityType: 'mentor_tasks',
              entityId: 'task_1',
              operation: 'UPDATE',
              clientTimestamp: new Date().toISOString(),
              payload: { status: 'completed' }
            }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.data.syncedCount).toBe(1);
    });
  });
});
