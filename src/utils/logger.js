// src/utils/logger.js
const pino = require('pino');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Configuración de transporte según el entorno
const transport = isDevelopment
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }
  : undefined;

// Crear logger con configuración
const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport,
  base: {
    service: 'chatbot-inmaculada',
    version: require('../../package.json').version,
  },
  // Redactar información sensible
  redact: {
    paths: ['password', 'token', 'apiKey', '*.password', '*.token'],
    censor: '[REDACTED]',
  },
});

// Crear child loggers para diferentes módulos
const createChildLogger = (module) => {
  return logger.child({ module });
};

// Loggers específicos para cada módulo
const loggers = {
  server: createChildLogger('server'),
  whatsapp: createChildLogger('whatsapp'),
  ai: createChildLogger('ai'),
  database: createChildLogger('database'),
  api: createChildLogger('api'),
  conversation: createChildLogger('conversation'),
};

module.exports = {
  logger,
  createChildLogger,
  ...loggers,
};
