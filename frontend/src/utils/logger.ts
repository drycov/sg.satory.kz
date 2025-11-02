/**
 * Универсальный модуль логирования (Browser/Node)
 * Поддерживает уровни, фильтрацию, интеграции и безопасную сериализацию.
 */

export type LogLevel = "error" | "warn" | "info" | "debug";
export type Environment = "development" | "staging" | "production";
export type LogContext = Record<string, unknown>;

export interface LoggerOptions {
  level?: LogLevel;
  environment?: Environment;
  disableConsole?: boolean;
  beforeSend?: (error: Error, context: LogContext) => boolean | void;
  integrations?: {
    sentry?: (error: Error, context: LogContext) => void;
    logrocket?: (error: Error, context: LogContext) => void;
    datadog?: (error: Error, context: LogContext) => void;
  };
}

/** ==========================
 *  DEFAULT CONFIG
 *  ========================== */
const DEFAULT_OPTIONS: Required<LoggerOptions> = {
  level: "error",
  environment:
    (import.meta.env.MODE as Environment) || "development",
  disableConsole: false,
  beforeSend: () => true,
  integrations: {},
};

let options = { ...DEFAULT_OPTIONS };

/** ==========================
 *  PUBLIC API
 *  ========================== */

/** Инициализация логгера */
export const initLogger = (config: LoggerOptions = {}) => {
  options = { ...DEFAULT_OPTIONS, ...config };
  logDebug("Logger initialized", { options });
};

/** ==========================
 *  INTERNAL UTILITIES
 *  ========================== */

/** Безопасная нормализация ошибки */
const normalizeError = (input: unknown): Error => {
  if (input instanceof Error) return input;
  if (typeof input === "string") return new Error(input);
  try {
    return new Error(`Non-error thrown: ${JSON.stringify(input)}`);
  } catch {
    return new Error("Unknown error (circular or unserializable)");
  }
};

/** Безопасная сериализация JSON */
const safeStringify = (data: unknown): string => {
  const seen = new WeakSet();
  return JSON.stringify(data, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    return value;
  });
};

/** ==========================
 *  LOGGING CORE
 *  ========================== */

/** Уровни логирования в порядке важности */
const LEVEL_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const isLoggable = (level: LogLevel): boolean => {
  return LEVEL_PRIORITY[level] <= LEVEL_PRIORITY[options.level];
};

/** Отправка в backend */
const sendToServer = async (payload: {
  message: string;
  stack?: string;
  context?: LogContext;
  level: LogLevel;
  timestamp: string;
}) => {
  try {
    // await fetch("/api/logs", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: safeStringify(payload),
    //   keepalive: true,
    // });
  } catch (err) {
    if (!options.disableConsole)
      console.warn("[Logger] Failed to send log:", err);
  }
};

/** Основная функция логирования */
const log = (level: LogLevel, input: unknown, context: LogContext = {}) => {
  if (!isLoggable(level)) return;

  const error = normalizeError(input);

  const fullContext: LogContext = {
    ...context,
    environment: options.environment,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "server",
    url: typeof location !== "undefined" ? location.href : "n/a",
  };

  if (options.beforeSend && options.beforeSend(error, fullContext) === false)
    return;

  if (!options.disableConsole && options.environment !== "production") {
    const prefix = `[${level.toUpperCase()}]`;
    const logFn =
      level === "error"
        ? console.error
        : level === "warn"
        ? console.warn
        : level === "info"
        ? console.info
        : console.debug;
    logFn(prefix, error.message);
    if (error.stack) console.debug(error.stack);
    console.debug("Context:", fullContext);
  }

  // Интеграции
  if (level === "error") {
    options.integrations.sentry?.(error, fullContext);
    options.integrations.logrocket?.(error, fullContext);
    options.integrations.datadog?.(error, fullContext);
  }

  // Отправляем на backend только ошибки
  if (level === "error") {
    void sendToServer({
      message: error.message,
      stack: error.stack,
      context: fullContext,
      level,
      timestamp: new Date().toISOString(),
    });
  }
};

/** ==========================
 *  PUBLIC METHODS
 *  ========================== */

/** Логирование ошибки */
export const captureException = (err: unknown, ctx?: LogContext) =>
  log("error", err, ctx);

/** Предупреждение */
export const captureWarning = (warn: unknown, ctx?: LogContext) =>
  log("warn", warn, ctx);

/** Информационное сообщение */
export const logInfo = (msg: string, ctx?: LogContext) =>
  log("info", msg, ctx);

/** Отладка */
export const logDebug = (msg: string, ctx?: LogContext) =>
  log("debug", msg, ctx);

/** Сокращённый алиас */
export const logger = {
  error: captureException,
  warn: captureWarning,
  info: logInfo,
  debug: logDebug,
  init: initLogger,
};
