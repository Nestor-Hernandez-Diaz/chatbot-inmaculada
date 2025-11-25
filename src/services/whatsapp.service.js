// src/services/whatsapp.service.js
const wppconnect = require('@wppconnect-team/wppconnect');
const botStats = require('../utils/botStats');
const conversationService = require('./conversation.service');

/**
 * Filtra mensajes no deseados con lógica mejorada.
 * Devuelve 'true' si el mensaje debe ser ignorado.
 * @param {object} message - El objeto del mensaje de wppconnect.
 * @returns {boolean} - True para ignorar, False para procesar.
 */
function filterMessage(message) {
  // 1. Ignorar si no es un mensaje de chat (ej. cambio de foto de perfil)
  if (message.type !== 'chat' && message.type !== 'image' && message.type !== 'document') {
    return true;
  }

  // 2. Ignorar estados de contactos
  if (message.from === 'status@broadcast' || message.isStatus) {
    return true;
  }

  // 3. Ignorar mensajes de grupos (doble verificación)
  //    wppconnect ya provee `isGroupMsg`, pero `endsWith('@g.us')` es un reaseguro.
  if (message.isGroupMsg || message.chatId.endsWith('@g.us')) {
    return true;
  }

  // 4. Ignorar mensajes sin contenido de texto (si solo quieres procesar texto)
  if (!message.body || message.body.trim().length === 0) {
    return true;
  }

  // Si pasa todos los filtros, es un mensaje directo y válido.
  return false;
}

/**
 * Manejador de mensajes entrantes con IA integrada.
 * @param {object} message - El objeto del mensaje de wppconnect.
 */
async function handleMessage(message) {
  if (filterMessage(message)) {
    return;
  }

  // --- Extracción de datos del mensaje ---
  const senderId = message.from;
  const botPhone = message.to;
  const senderName = message.sender.pushname || message.notifyName || 'Desconocido';
  const body = message.body;
  const timestamp = new Date(message.timestamp * 1000).toISOString();

  // --- Logging en consola con formato mejorado ---
  console.log('\n🤖 =========================================');
  console.log(`[${timestamp}] 💬 Nuevo mensaje`);
  console.log(`👤 Cliente: ${senderName} (${senderId})`);
  console.log(`📝 Mensaje: "${body}"`);
  console.log('========================================= 🚀');

  botStats.mensajesRecibidos++;
  
  try {
    // Procesar mensaje con IA
    console.log('🧠 Procesando con inteligencia artificial...');
    
    const result = await conversationService.processIncomingMessage(senderId, botPhone, body);
    
    console.log(`🎯 Intención detectada: ${result.intent.intention} (confianza: ${result.intent.confidence})`);
    console.log(`💡 Respuesta generada: "${result.response}"`);
    
    // Enviar respuesta al cliente
    if (botStats.client) {
      await botStats.client.sendText(senderId, result.response);
      botStats.mensajesEnviados++;
      console.log('✅ Respuesta enviada exitosamente');
    }
    
    // Guardar estadísticas adicionales
    if (result.intent.requires_action) {
      botStats.consultasProcesadas++;
    }
    
  } catch (error) {
    console.error('❌ Error al procesar mensaje:', error);
    
    // Enviar mensaje de error al cliente
    const errorMessage = 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente. 🙏';
    
    if (botStats.client) {
      try {
        await botStats.client.sendText(senderId, errorMessage);
        botStats.mensajesEnviados++;
      } catch (sendError) {
        console.error('Error al enviar mensaje de error:', sendError);
      }
    }
  }
}

/**
 * Inicializa el cliente de WhatsApp y establece los listeners.
 */
async function initWhatsApp() {
  try {
    const client = await wppconnect.create({
      session: 'inmaculada-bot-simple',
      catchQR: (base64Qr, asciiQR) => {
        console.log('Escanea el codigo QR con tu telefono:');
        console.log(asciiQR);
      },
      statusFind: (statusSession, session) => {
        console.log('Estado de la sesion:', statusSession);
        if (statusSession === 'isLogged') {
          console.log('Conexion con WhatsApp exitosa.');
        }
      },
      headless: 'new',
      logQR: true,
      autoClose: 0,
      disableWelcome: true,
      browserArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    botStats.client = client;
    client.onMessage(handleMessage);
    console.log('Servicio de WhatsApp listo y escuchando mensajes.');

  } catch (error) {
    console.error('Error al inicializar WhatsApp:', error);
  }
}

module.exports = {
  initWhatsApp,
  handleMessage,
  filterMessage,
};
