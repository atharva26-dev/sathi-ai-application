// Structured JSON Logger (Sanitized, never logs secrets or passwords)
export const logger = {
  info: (message: string, meta: Record<string, any> = {}) => {
    console.log(
      JSON.stringify({
        level: 'INFO',
        message,
        timestamp: new Date().toISOString(),
        ...sanitizeMeta(meta)
      })
    );
  },
  warn: (message: string, meta: Record<string, any> = {}) => {
    console.warn(
      JSON.stringify({
        level: 'WARN',
        message,
        timestamp: new Date().toISOString(),
        ...sanitizeMeta(meta)
      })
    );
  },
  error: (message: string, error?: any, meta: Record<string, any> = {}) => {
    console.error(
      JSON.stringify({
        level: 'ERROR',
        message,
        error: error instanceof Error ? error.message : error,
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        ...sanitizeMeta(meta)
      })
    );
  }
};

// Redacts sensitive fields
const sanitizeMeta = (meta: Record<string, any>): Record<string, any> => {
  const sanitized = { ...meta };
  const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'key', 'apiKey', 'anonKey'];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  return sanitized;
};
