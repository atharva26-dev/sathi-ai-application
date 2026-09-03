import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { mentorService } from '../services/mentorService.js';
import { sendSuccess } from '../utils/response.js';

export const roadmapRoutes = Router();

roadmapRoutes.get('/roadmap/tasks', async (req: Request, res: Response) => {
  const tasks = await mentorService.getTasks();
  sendSuccess(res, tasks, 200, req.id);
});

const taskToggleSchema = z.object({
  isCompleted: z.boolean()
});

roadmapRoutes.patch(
  '/roadmap/tasks/:id',
  validate({ body: taskToggleSchema }),
  async (req: Request, res: Response) => {
    const updated = await mentorService.toggleTaskStatus(req.params.id as string, req.body.isCompleted);
    sendSuccess(res, updated, 200, req.id);
  }
);

roadmapRoutes.get('/roadmap/expansion', async (req: Request, res: Response) => {
  const roadmap = await mentorService.getExpansionRoadmap();
  sendSuccess(res, roadmap, 200, req.id);
});
