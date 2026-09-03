import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import { env } from '../config/env.js';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export const rateLimiter = (isAiEndpoint = false) => {
  const maxRequests = isAiEndpoint
    ? env.RATE_LIMIT_AI_PER_MINUTE
    : env.RATE_LIMIT_STANDARD_PER_MINUTE;
  const windowMs = 60 * 1000; // 1 minute window

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const userId = req.user?.id || clientIp;
    const bucketKey = `${isAiEndpoint ? 'ai' : 'std'}:${userId}`;
    const now = Date.now();

    const record = rateLimitStore.get(bucketKey);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(bucketKey, {
        count: 1,
        resetTime: now + windowMs
      });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    if (record.count >= maxRequests) {
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      sendError(
        res,
        'RATE_LIMIT_EXCEEDED',
        `Too many requests. Please wait ${Math.ceil((record.resetTime - now) / 1000)} seconds before trying again.`,
        429,
        { retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000) },
        req.id
      );
      return;
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - record.count);
    next();
  };
};
