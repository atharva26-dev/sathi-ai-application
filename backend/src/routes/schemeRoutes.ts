import { Router, Request, Response } from 'express';
import { schemeService } from '../services/schemeService.js';
import { sendSuccess } from '../utils/response.js';

export const schemeRoutes = Router();

schemeRoutes.get('/schemes', async (req: Request, res: Response) => {
  const projectCost = parseFloat((req.query.projectCost as string) || '1000000');
  const isRural = req.query.isRural !== 'false';
  const schemes = await schemeService.getSchemes(projectCost, isRural);
  sendSuccess(res, schemes, 200, req.id);
});

schemeRoutes.get('/schemes/:id', async (req: Request, res: Response) => {
  const scheme = await schemeService.getSchemeById(req.params.id as string);
  sendSuccess(res, scheme, 200, req.id);
});
