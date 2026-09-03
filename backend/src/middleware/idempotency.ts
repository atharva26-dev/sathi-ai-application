import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

interface CachedResponse {
  statusCode: number;
  body: any;
  timestamp: number;
}

// In-memory idempotency cache (keyed by idempotencyKey + userId)
const idempotencyStore = new Map<string, CachedResponse>();

export const idempotencyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Only apply to state-modifying requests (POST, PUT, PATCH, DELETE)
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'] as string;
  if (!idempotencyKey) {
    return next();
  }

  const userId = req.user?.id || 'anonymous';
  const cacheKey = `${userId}:${idempotencyKey}`;
  const now = Date.now();
  const ttlMs = env.IDEMPOTENCY_TTL_SECONDS * 1000;

  // Check existing cache
  const cached = idempotencyStore.get(cacheKey);
  if (cached && now - cached.timestamp < ttlMs) {
    res.setHeader('X-Idempotent-Replayed', 'true');
    res.status(cached.statusCode).json(cached.body);
    return;
  }

  // Intercept json() response to capture payload
  const originalJson = res.json.bind(res);
  res.json = (body: any): Response => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyStore.set(cacheKey, {
        statusCode: res.statusCode,
        body,
        timestamp: Date.now()
      });
    }
    return originalJson(body);
  };

  next();
};
