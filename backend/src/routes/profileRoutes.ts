import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { optionalAuth } from '../middleware/auth.js';
import { profileService } from '../services/profileService.js';
import { sendSuccess } from '../utils/response.js';

export const profileRoutes = Router();

profileRoutes.get('/profile', optionalAuth, async (req: Request, res: Response) => {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
  const profile = await profileService.getProfile(userId);
  sendSuccess(res, profile, 200, req.id);
});

const onboardSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  preferredLanguage: z.string().default('mr'),
  village: z.string().optional(),
  block: z.string().optional(),
  district: z.string().optional(),
  ownCapital: z.number().nonnegative('Capital must be non-negative').default(100000),
  skills: z.array(z.string()).optional(),
  availableAssets: z.array(z.string()).optional()
});

profileRoutes.post(
  '/profile/onboard',
  optionalAuth,
  validate({ body: onboardSchema }),
  async (req: Request, res: Response) => {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const profile = await profileService.updateProfile(userId, {
      ...req.body,
      isOnboarded: true
    });
    sendSuccess(res, profile, 200, req.id);
  }
);

profileRoutes.patch(
  '/profile',
  optionalAuth,
  validate({ body: onboardSchema.partial() }),
  async (req: Request, res: Response) => {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const updated = await profileService.updateProfile(userId, req.body);
    sendSuccess(res, updated, 200, req.id);
  }
);
