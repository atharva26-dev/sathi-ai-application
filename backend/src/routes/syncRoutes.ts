import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { idempotencyMiddleware } from '../middleware/idempotency.js';
import { syncService } from '../services/syncService.js';
import { sendSuccess } from '../utils/response.js';

export const syncRoutes = Router();

const syncPushSchema = z.object({
  deviceId: z.string(),
  mutations: z.array(
    z.object({
      id: z.string(),
      entityType: z.string(),
      entityId: z.string(),
      operation: z.enum(['INSERT', 'UPDATE', 'DELETE']),
      clientTimestamp: z.string(),
      payload: z.record(z.any())
    })
  )
});

syncRoutes.post(
  '/sync/push',
  idempotencyMiddleware,
  validate({ body: syncPushSchema }),
  async (req: Request, res: Response) => {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const { deviceId, mutations } = req.body;
    const result = await syncService.processPushMutations(userId, deviceId, mutations);
    sendSuccess(res, result, 200, req.id);
  }
);

syncRoutes.get('/sync/pull', async (req: Request, res: Response) => {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
  const lastSyncTimestamp = req.query.since as string | undefined;
  const result = await syncService.pullServerUpdates(userId, lastSyncTimestamp);
  sendSuccess(res, result, 200, req.id);
});

syncRoutes.post('/sync/ack', (req: Request, res: Response) => {
  sendSuccess(res, { acknowledged: true, timestamp: new Date().toISOString() }, 200, req.id);
});
