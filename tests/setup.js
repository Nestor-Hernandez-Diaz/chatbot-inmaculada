// tests/setup.js
// Configuración global para tests

require('dotenv').config();

// Silenciar logs durante tests (opcional)
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    // Mantener warn y error para debugging
    warn: console.warn,
    error: console.error,
  };
}

// Timeout global para tests
jest.setTimeout(10000);
