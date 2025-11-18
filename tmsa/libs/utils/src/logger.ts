export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export interface LoggerOptions {
  name: string;
  level?: LogLevel;
}

export class Logger {
  private readonly name: string;
  private readonly level: LogLevel;

  constructor(options: LoggerOptions) {
    this.name = options.name;
    this.level = options.level ?? (process.env.LOG_LEVEL as LogLevel) ?? 'info';
  }

  private shouldLog(level: LogLevel) {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.level];
  }

  private format(message: string) {
    return `[${new Date().toISOString()}][${this.name}] ${message}`;
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog('debug')) {
      console.debug(this.format(message), context ?? '');
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog('info')) {
      console.info(this.format(message), context ?? '');
    }
  }

  warn(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog('warn')) {
      console.warn(this.format(message), context ?? '');
    }
  }

  error(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog('error')) {
      console.error(this.format(message), context ?? '');
    }
  }
}
