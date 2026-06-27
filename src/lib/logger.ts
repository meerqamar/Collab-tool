import * as Sentry from '@sentry/nextjs';

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  requestId?: string;
  userId?: string;
  durationMs?: number;
  [key: string]: unknown;
}

/**
 * Production structured JSON logger with request correlation and observability integration.
 */
export const logger = {
  info: (message: string, meta: Partial<LogEntry> = {}) => {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },
  warn: (message: string, meta: Partial<LogEntry> = {}) => {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },
  error: (message: string, error: unknown, meta: Partial<LogEntry> = {}) => {
    const entry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...meta,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error,
    };
    console.error(JSON.stringify(entry));
    if (error instanceof Error) {
      try {
        Sentry.captureException(error, { extra: meta });
      } catch {
        // Sentry SDK offline
      }
    }
  },
};
