// src/server.js
require('dotenv').config();
const express = require('express');
const prisma = require('./config/database');
const botStats = require('./utils/botStats');
const { server: log } = require('./utils/logger');
const { initWhatsApp } = require('./services/whatsapp.service');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging para requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    log.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    }, `${req.method} ${req.url} ${res.statusCode}`);
  });
  next();
});

// API Routes
app.use('/', routes);

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 9090;

app.listen(PORT, async () => {
  log.info('========================================');
  log.info('   CHATBOT LA INMACULADA - INICIADO');
  log.info('========================================');
  log.info({ port: PORT }, `Servidor corriendo en: http://localhost:${PORT}`);
  log.info({ endpoint: '/stats' }, `Estadísticas: http://localhost:${PORT}/stats`);
  log.info({ endpoint: '/productos' }, `Productos API: http://localhost:${PORT}/productos`);
  log.info('Iniciando conexión con WhatsApp...');
  
  await initWhatsApp();
});

// Manejo de cierre
process.on('SIGINT', async () => {
  log.warn('Cerrando aplicación...');
  await prisma.$disconnect();
  if (botStats.client) await botStats.client.close();
  log.info('Aplicación cerrada correctamente');
  process.exit();
});
