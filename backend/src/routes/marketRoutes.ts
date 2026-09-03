import { Router, Request, Response } from 'express';
import { marketService } from '../services/marketService.js';
import { lgdLocationService } from '../domain/location/lgdLocationService.js';
import { sendSuccess } from '../utils/response.js';

export const marketRoutes = Router();

/**
 * Primary canonical Market Gap Analysis API endpoint
 */
marketRoutes.post('/market-gap/analyze', async (req: Request, res: Response) => {
  const context = req.body || {};
  const analysis = await marketService.analyzeMarketGap(context);
  sendSuccess(res, analysis, 200, req.id);
});

/**
 * Primary canonical Local Market Intelligence API endpoint
 */
marketRoutes.post('/market/intelligence', async (req: Request, res: Response) => {
  const context = req.body || {};
  const intelligence = await marketService.getLocalMarketIntelligence(context);
  sendSuccess(res, intelligence, 200, req.id);
});

marketRoutes.get('/market/intelligence', async (req: Request, res: Response) => {
  const location = (req.query.location as string) || 'Palus, Sangli';
  const businessName = (req.query.business as string) || (req.query.category as string) || 'Micro-Enterprise';
  const availableCapital = parseFloat((req.query.capital as string) || '50000');
  const language = (req.query.language as 'mr' | 'hi' | 'en') || 'mr';
  const radiusKm = parseFloat((req.query.radiusKm as string) || '10');

  const locHierarchy = lgdLocationService.resolveLocationHierarchy(location) || {
    village: location,
    subDistrict: 'Taluka',
    block: 'Taluka',
    district: 'Sangli',
    state: 'Maharashtra'
  };

  const intelligence = await marketService.getLocalMarketIntelligence({
    location: locHierarchy,
    businessName,
    availableCapital,
    language,
    analysisRadiusKm: radiusKm
  });
  sendSuccess(res, intelligence, 200, req.id);
});

marketRoutes.post('/market/invalidate-cache', async (req: Request, res: Response) => {
  const userId = req.body.userId || '00000000-0000-0000-0000-000000000001';
  marketService.invalidateCacheForUser(userId);
  sendSuccess(res, { invalidated: true, userId }, 200, req.id);
});

marketRoutes.get('/market/radar', async (req: Request, res: Response) => {
  const location = (req.query.location as string) || 'सुपे, बारामती';
  const radiusKm = parseFloat((req.query.radiusKm as string) || '10');
  const category = (req.query.category as string) || (req.query.business as string);
  const radarData = await marketService.getMarketRadarData(location, radiusKm, category);
  sendSuccess(res, radarData, 200, req.id);
});

marketRoutes.get('/market/gap', async (req: Request, res: Response) => {
  const location = (req.query.location as string) || 'सुपे, बारामती';
  const category = (req.query.category as string) || (req.query.business as string);
  const radarData = await marketService.getMarketRadarData(location, 10, category);
  sendSuccess(res, radarData.opportunities, 200, req.id);
});

marketRoutes.get('/market/competitors', async (req: Request, res: Response) => {
  const location = (req.query.location as string) || 'सुपे, बारामती';
  const category = (req.query.category as string) || (req.query.business as string);
  const radarData = await marketService.getMarketRadarData(location, 10, category);
  sendSuccess(res, radarData.competitors, 200, req.id);
});
