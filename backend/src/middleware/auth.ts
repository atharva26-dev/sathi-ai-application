import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  isDemo: boolean;
  token: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Check for demo bypass header in development
    const demoUserHeader = req.headers['x-demo-user-id'] as string;
    if (demoUserHeader && process.env.NODE_ENV !== 'production') {
      req.user = {
        id: demoUserHeader,
        email: 'ramesh.patil@baramati.demo',
        isDemo: true,
        token: 'demo-token'
      };
      return next();
    }

    sendError(res, 'UNAUTHORIZED', 'Missing or invalid Authorization header.', 401, {}, req.id);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      sendError(res, 'INVALID_TOKEN', 'The provided authentication token is expired or invalid.', 401, {}, req.id);
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      isDemo: user.user_metadata?.is_demo === true,
      token
    };

    next();
  } catch (err) {
    logger.error('Authentication verification error', err, { requestId: req.id });
    sendError(res, 'AUTH_VERIFICATION_FAILED', 'Failed to verify authentication token.', 500, {}, req.id);
  }
};

// Optional auth: Attaches user if valid token present, but does not reject anonymous visitors
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const demoUserHeader = req.headers['x-demo-user-id'] as string;
    if (demoUserHeader) {
      req.user = {
        id: demoUserHeader,
        email: 'demo@saathi.internal',
        isDemo: true,
        token: 'demo-token'
      };
    }
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        isDemo: user.user_metadata?.is_demo === true,
        token
      };
    }
  } catch (e) {
    // Ignore error for optional auth
  }

  next();
};
