/**
 * Centralized logging utility for application observability (QR-4).
 * Provides structured logging with different severity levels.
 * In production, logs can be sent to CloudWatch or other monitoring services.
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(`[${LogLevel.DEBUG}]`, message, context || '');
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext) {
    console.info(`[${LogLevel.INFO}]`, message, context || '');
    this.sendToMonitoring(LogLevel.INFO, message, context);
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext) {
    console.warn(`[${LogLevel.WARN}]`, message, context || '');
    this.sendToMonitoring(LogLevel.WARN, message, context);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error, context?: LogContext) {
    console.error(`[${LogLevel.ERROR}]`, message, error || '', context || '');
    this.sendToMonitoring(LogLevel.ERROR, message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    });
  }

  /**
   * Log user actions for analytics
   */
  logUserAction(action: string, details?: LogContext) {
    this.info(`User Action: ${action}`, details);
  }

  /**
   * Log API calls for monitoring
   */
  logApiCall(endpoint: string, method: string, duration?: number, status?: number) {
    this.info(`API Call: ${method} ${endpoint}`, {
      method,
      endpoint,
      duration,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log performance metrics
   */
  logPerformance(metric: string, value: number, unit: string = 'ms') {
    this.info(`Performance: ${metric}`, {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send logs to monitoring service (CloudWatch, Datadog, etc.)
   * TODO: Implement actual monitoring service integration
   */
  private sendToMonitoring(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment) {
      // In production, send to CloudWatch or other monitoring service
      // Example: AWS CloudWatch Logs, Datadog, Sentry, etc.
      // For now, we just structure the log for future integration
      const logEntry = {
        level,
        message,
        context,
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE,
      };

      // TODO: Send logEntry to monitoring service
      // await cloudWatchClient.putLogEvents(logEntry);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
