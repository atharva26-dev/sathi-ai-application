import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, '0.0.0.0', () => {
  logger.info(`SAATHI Backend Intelligence Server listening on http://127.0.0.1:${env.PORT}`);
  logger.info(`Health check: http://127.0.0.1:${env.PORT}/health`);
  logger.info(`API v1 Base: http://127.0.0.1:${env.PORT}${env.API_PREFIX}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing HTTP server gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});
