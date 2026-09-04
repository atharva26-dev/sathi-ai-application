import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { rateLimiter } from '../middleware/rateLimit.js';
import { aiOrchestrator } from '../ai/orchestrator.js';
import { sendSuccess } from '../utils/response.js';

import { SUPPORTED_LANGUAGES } from '../config/constants.js';

export const aiRoutes = Router();

const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  language: z.enum(SUPPORTED_LANGUAGES).default('mr'),
  userId: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string()
      })
    )
    .optional(),
  context: z
    .object({
      userId: z.string().optional(),
      capital: z.number().optional(),
      location: z.string().optional(),
      businessName: z.string().optional(),
      riskAppetite: z.enum(['CONSERVATIVE', 'MODERATE', 'GROWTH']).optional(),
      liveAreaContext: z
        .object({
          competitorCount: z.number().optional(),
          localObstacles: z.string().optional(),
          dynamicAnswers: z
            .array(
              z.object({
                questionId: z.string().optional(),
                question: z.string(),
                answer: z.string()
              })
            )
            .optional(),
          collectedAt: z.string().optional()
        })
        .optional()
    })
    .optional()
});

aiRoutes.post(
  '/ai/chat',
  rateLimiter(true), // Strict rate limiter for AI queries
  validate({ body: chatMessageSchema }),
  async (req: Request, res: Response) => {
    const { message, language, context, userId, history } = req.body;
    const uid = userId || context?.userId || (req.headers['x-user-id'] as string) || '00000000-0000-0000-0000-000000000001';
    const response = await aiOrchestrator.handleUserMessage(message, language, context, uid, history);
    sendSuccess(res, response, 200, req.id);
  }
);
