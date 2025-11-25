// src/server-simulado.js
require('dotenv').config();
const express = require('express');
const prisma = require('./config/database');
const botStats = require('./utils/botStats');
const { initWhatsAppSimulado } = require('./services/whatsapp-simulado.service');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/', routes);

// ==================== INICIAR SERVIDOR SIMULADO ====================
const PORT = process.env.PORT || 9091;

app.listen(PORT, async () => {
  console.log('\n🚀 ========================================');
  console.log('   CHATBOT LA INMACULADA - MODO SIMULADO');
  console.log('========================================\n');
  console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📊 Estadísticas: http://localhost:${PORT}/stats`);
  console.log(`📦 Productos API: http://localhost:${PORT}/productos`);
  console.log('\n⏳ Iniciando WhatsApp Simulado...\n');
  
  try {
    await initWhatsAppSimulado();
    console.log('\n✅ WhatsApp Simulado iniciado correctamente');
    console.log('\n🧪 El bot está listo para recibir mensajes simulados');
    console.log('💡 Los mensajes de prueba se ejecutarán automáticamente');
    
  } catch (error) {
    console.error('❌ Error al iniciar WhatsApp Simulado:', error);
  }
});

// Manejo de errores
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});