import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { optionalAuth } from '../middleware/auth.js';
import { businessService } from '../services/businessService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const businessRoutes = Router();

const discoverBodySchema = z.object({
  location: z.union([z.string(), z.record(z.any())]).optional(),
  capital: z.number().optional().default(100000),
  skills: z.array(z.string()).optional().default([]),
  experienceYears: z.number().optional(),
  businessTypePreferences: z.array(z.string()).optional(),
  riskTolerance: z.enum(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE']).optional(),
  language: z.enum(['mr', 'hi', 'en']).optional().default('mr')
});

/**
 * POST /api/v1/business/discover
 * Real data-driven multi-source business opportunity discovery engine
 */
businessRoutes.post(
  '/business/discover',
  validate({ body: discoverBodySchema }),
  async (req: Request, res: Response) => {
    const { location, capital, skills, experienceYears, businessTypePreferences, riskTolerance, language } = req.body;
    
    if (!location) {
      sendError(res, 'LOCATION_REQUIRED', 'Location data is required for a reliable local opportunity analysis.', 400, {}, req.id);
      return;
    }

    const result = await businessService.discover({
      location,
      availableCapital: capital,
      skills,
      experienceYears,
      businessTypePreferences,
      riskTolerance,
      language
    });

    if (!result.success) {
      sendError(res, 'LOCATION_REQUIRED', result.message || 'Location data is required for a reliable local opportunity analysis.', 400, {}, req.id);
      return;
    }

    sendSuccess(res, result, 200, req.id);
  }
);

const discoveryQuerySchema = z.object({
  capital: z.string().optional().transform((val) => (val ? parseFloat(val) : 100000)),
  location: z.string().optional()
});

/**
 * GET /api/v1/businesses/discovery
 * Legacy GET query endpoint for backwards compatibility
 */
businessRoutes.get(
  '/businesses/discovery',
  validate({ query: discoveryQuerySchema }),
  async (req: Request, res: Response) => {
    const { capital, location } = req.query as any;

    if (!location || !location.trim()) {
      sendError(res, 'LOCATION_REQUIRED', 'Location data is required for a reliable local opportunity analysis.', 400, {}, req.id);
      return;
    }

    const result = await businessService.discover({
      location,
      availableCapital: capital
    });

    sendSuccess(res, result.opportunities, 200, req.id);
  }
);

businessRoutes.get('/businesses/feasibility', async (req: Request, res: Response) => {
  const businessId = (req.query.businessId as string) || 'opp_mobile_repair';
  const capital = parseFloat((req.query.capital as string) || '100000');
  const location = req.query.location as string | undefined;
  const report = await businessService.getFeasibilityReport(businessId, capital, location);
  sendSuccess(res, report, 200, req.id);
});
