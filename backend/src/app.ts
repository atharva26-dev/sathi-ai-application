import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { correlationIdMiddleware } from './middleware/correlationId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';
import { healthRoutes } from './routes/healthRoutes.js';

export const createApp = (): Express => {
  const app = express();

  // Security & standard middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow all local dev origins and configured CORS origins
        if (!origin || env.CORS_ORIGIN.split(',').includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in hackathon/dev environment
        }
      },
      credentials: true
    })
  );

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(correlationIdMiddleware);

  if (env.NODE_ENV !== 'test') {
    app.use(
      morgan(':method :url :status :res[content-length] - :response-time ms [req_id: :req[x-request-id]]')
    );
  }

  // Root health routes
  app.use(healthRoutes);

  // Versioned API routes
  app.use(env.API_PREFIX, apiRouter);

  // 404 handler for undefined endpoints
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.method} ${req.originalUrl} not found.`
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString()
      }
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
};
