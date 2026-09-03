import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      id: string;
      startTime: number;
    }
  }
}

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const existingId = req.headers['x-request-id'] as string;
  const requestId = existingId || `req_${uuidv4()}`;

  req.id = requestId;
  req.startTime = Date.now();
  res.setHeader('X-Request-Id', requestId);
  next();
};
