// src/services/whatsapp.service.js
const wppconnect = require('@wppconnect-team/wppconnect');
const botStats = require('../utils/botStats');
const conversationService = require('./conversation.service');
const imageSearchService = require('./image-search.service');

/**
 * Filtra mensajes no deseados con lógica mejorada.
 * Devuelve 'true' si el mensaje debe ser ignorado.
 * @param {object} message - El objeto del mensaje de wppconnect.
 * @returns {boolean} - True para ignorar, False para procesar.
 */
function filterMessage(message) {
  // 1. Ignorar si no es un mensaje de chat, imagen o documento
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

  // 4. Para mensajes de texto, requiere contenido
  //    Para imágenes, no requiere body (puede tener caption opcional)
  if (message.type === 'chat' && (!message.body || message.body.trim().length === 0)) {
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
  const body = message.body || '';
  const timestamp = new Date(message.timestamp * 1000).toISOString();
  const messageType = message.type;

  // --- Logging en consola con formato mejorado ---
  console.log('\n🤖 =========================================');
  console.log(`[${timestamp}] 💬 Nuevo mensaje (${messageType})`);
  console.log(`👤 Cliente: ${senderName} (${senderId})`);
  if (messageType === 'image') {
    console.log(`🖼️ Imagen recibida${body ? ` con caption: "${body}"` : ''}`);
  } else {
    console.log(`📝 Mensaje: "${body}"`);
  }
  console.log('========================================= 🚀');

  botStats.mensajesRecibidos++;
  
  try {
    let result;
    
    // Procesar según tipo de mensaje
    if (messageType === 'image') {
      // 🖼️ BÚSQUEDA POR IMAGEN
      console.log('🖼️ Procesando imagen con Gemini Vision...');
      result = await handleImageMessage(message, senderId, botPhone, body);
    } else {
      // 📝 MENSAJE DE TEXTO NORMAL
      console.log('🧠 Procesando con inteligencia artificial...');
      result = await conversationService.processIncomingMessage(senderId, botPhone, body);
    }
    
    console.log(`🎯 Intención detectada: ${result.intent.intention} (confianza: ${result.intent.confidence})`);
    console.log(`💡 Respuesta generada: "${result.response.substring(0, 100)}..."`);
    
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
 * Maneja mensajes de imagen - Búsqueda de productos por imagen
 * @param {object} message - Mensaje de WhatsApp con imagen
 * @param {string} senderId - ID del remitente
 * @param {string} botPhone - Número del bot
 * @param {string} caption - Caption opcional de la imagen
 * @returns {Promise<Object>} - Resultado del procesamiento
 */
async function handleImageMessage(message, senderId, botPhone, caption) {
  try {
    // 1. Notificar que estamos procesando
    if (botStats.client) {
      await botStats.client.sendText(senderId, '🔍 *Analizando tu imagen...* dame unos segundos pues 🦜');
    }
    
    // 2. Descargar la imagen
    console.log('📥 Descargando imagen...');
    const buffer = await botStats.client.decryptFile(message);
    
    if (!buffer) {
      throw new Error('No se pudo descargar la imagen');
    }
    
    // 3. Convertir a base64
    const base64Image = buffer.toString('base64');
    const mimeType = message.mimetype || 'image/jpeg';
    
    console.log(`📊 Imagen descargada: ${Math.round(buffer.length / 1024)}KB, tipo: ${mimeType}`);
    
    // 4. Analizar con Gemini Vision
    const searchResult = await imageSearchService.analyzeProductImage(base64Image, mimeType, caption);
    
    // 5. Guardar en conversación
    const conversation = await conversationService.getOrCreateConversation(senderId, botPhone);
    await conversationService.saveMessage(
      conversation.id, 
      `[IMAGEN: ${searchResult.analysis?.productIdentified || 'producto no identificado'}]${caption ? ` - ${caption}` : ''}`, 
      'USER',
      'image'
    );
    await conversationService.saveMessage(conversation.id, searchResult.response, 'BOT');
    
    // 6. Actualizar estadísticas
    botStats.incrementarIntencion ? botStats.incrementarIntencion('consulta_imagen') : null;
    
    return {
      intent: {
        intention: 'consulta_imagen',
        confidence: searchResult.analysis?.confidence || 0.8,
        requires_action: false
      },
      response: searchResult.response,
      context: {
        imageAnalysis: searchResult.analysis,
        productsFound: searchResult.products?.length || 0
      },
      conversationId: conversation.id,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Error al procesar imagen:', error);
    
    return {
      intent: {
        intention: 'error_imagen',
        confidence: 0,
        requires_action: false
      },
      response: `😅 *¡Uy, parcero!* No pude analizar bien tu imagen.\n\n` +
                `Puede ser que:\n` +
                `• La imagen esté muy oscura o borrosa\n` +
                `• El producto no se vea claramente\n` +
                `• El archivo sea muy grande\n\n` +
                `💡 *Tip:* Intenta enviar una foto más clara del producto, o escríbeme qué estás buscando y te ayudo al toque! 🦜`,
      context: { error: error.message },
      timestamp: new Date().toISOString()
    };
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
  handleImageMessage,
  filterMessage,
};
