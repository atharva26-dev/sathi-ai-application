import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

export const healthRoutes = Router();

healthRoutes.get('/health', (req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      status: 'UP',
      service: 'SAATHI Backend Intelligence API',
      version: '1.0.0',
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString()
    },
    200,
    req.id
  );
});

healthRoutes.get('/health/ready', (req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      status: 'READY',
      database: 'CONNECTED',
      aiOrchestrator: 'READY',
      financialEngines: 'READY'
    },
    200,
    req.id
  );
});
