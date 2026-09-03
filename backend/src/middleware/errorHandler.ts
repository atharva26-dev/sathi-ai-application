import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details: Record<string, any>;

  constructor(code: string, message: string, statusCode = 400, details: Record<string, any> = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const requestId = req.id || 'req_unknown';

  logger.error('Unhandled request exception', err, {
    requestId,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.statusCode, err.details, requestId);
    return;
  }

  // Syntax error / JSON parse error from express.json()
  if (err.type === 'entity.parse.failed') {
    sendError(res, 'INVALID_JSON', 'Malformed JSON payload in request body.', 400, {}, requestId);
    return;
  }

  // Generic internal server error
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred while processing your request.'
    : err.message || 'Internal Server Error';

  sendError(res, 'INTERNAL_SERVER_ERROR', message, 500, {}, requestId);
};
