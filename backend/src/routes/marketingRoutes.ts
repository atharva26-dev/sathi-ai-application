import { Router, Request, Response } from 'express';
import { getRuralMarketingPlaybooks, calculatePricingGuidance } from '../domain/marketing/ruralMarketingEngine.js';
import { sendSuccess } from '../utils/response.js';

export const marketingRoutes = Router();

marketingRoutes.get('/marketing/channels', (req: Request, res: Response) => {
  const playbooks = getRuralMarketingPlaybooks();
  sendSuccess(res, playbooks, 200, req.id);
});

marketingRoutes.get('/marketing/pricing', (req: Request, res: Response) => {
  const cost = parseFloat((req.query.cost as string) || '245');
  const pricing = calculatePricingGuidance(cost);
  sendSuccess(res, pricing, 200, req.id);
});
