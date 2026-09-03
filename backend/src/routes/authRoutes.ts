import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const authRoutes = Router();

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  mobile: z.string().min(10, 'Mobile must be at least 10 digits'),
  pin: z.string().min(4, 'PIN/Password must be at least 4 digits'),
  preferredLanguage: z.string().optional().default('mr'),
  village: z.string().optional(),
  block: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  ownCapital: z.number().optional().default(250000),
  desiredBusiness: z.string().optional().default('Mobile & Electronics Repair'),
  skills: z.array(z.string()).optional(),
  availableAssets: z.array(z.string()).optional()
});

const loginSchema = z.object({
  mobile: z.string().min(10, 'Mobile must be at least 10 digits'),
  pin: z.string().min(4, 'PIN/Password must be at least 4 digits')
});

authRoutes.post(
  '/auth/register',
  validate({ body: registerSchema }),
  async (req: Request, res: Response) => {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 201, req.id);
    } catch (err: any) {
      sendError(res, 'REGISTRATION_FAILED', err.message, 400, {}, req.id);
    }
  }
);

authRoutes.post(
  '/auth/login',
  validate({ body: loginSchema }),
  async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body);
      if (!result) {
        sendError(res, 'INVALID_CREDENTIALS', 'Invalid mobile number or PIN', 401, {}, req.id);
        return;
      }
      sendSuccess(res, result, 200, req.id);
    } catch (err: any) {
      sendError(res, 'LOGIN_FAILED', err.message, 400, {}, req.id);
    }
  }
);

authRoutes.get('/auth/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    sendError(res, 'UNAUTHORIZED', 'Missing Authorization header', 401, {}, req.id);
    return;
  }
  const session = authService.validateToken(authHeader);
  if (!session) {
    sendError(res, 'UNAUTHORIZED', 'Invalid or expired session token', 401, {}, req.id);
    return;
  }
  sendSuccess(res, { session, profile: session.profile }, 200, req.id);
});
