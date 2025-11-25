// src/services/whatsapp-simulado.service.js
const botStats = require('../utils/botStats');
const conversationService = require('./conversation.service');

/**
 * Servicio de WhatsApp simulado para pruebas sin necesidad de navegador
 */
class WhatsAppSimuladoService {
  constructor() {
    this.client = {
      sendText: this.simularEnvioMensaje.bind(this),
      sendImage: this.simularEnvioImagen.bind(this),
      onMessage: this.simularRecepcionMensaje.bind(this)
    };
    this.listeners = {};
    this.mensajesSimulados = [];
  }

  /**
   * Simula el envío de un mensaje de texto
   */
  async simularEnvioMensaje(to, message) {
    console.log(`📤 [SIMULADO] Enviando a ${to}: "${message}"`);
    
    const mensaje = {
      id: `msg_${Date.now()}`,
      from: 'bot',
      to: to,
      body: message,
      timestamp: new Date(),
      type: 'chat'
    };
    
    this.mensajesSimulados.push(mensaje);
    botStats.mensajesEnviados++;
    
    return { id: mensaje.id, status: 'sent' };
  }

  /**
   * Simula el envío de una imagen
   */
  async simularEnvioImagen(to, imagePath, caption = '') {
    console.log(`📷 [SIMULADO] Enviando imagen a ${to}: ${imagePath}`);
    
    const mensaje = {
      id: `img_${Date.now()}`,
      from: 'bot',
      to: to,
      body: caption,
      timestamp: new Date(),
      type: 'image',
      imagePath: imagePath
    };
    
    this.mensajesSimulados.push(mensaje);
    botStats.mensajesEnviados++;
    
    return { id: mensaje.id, status: 'sent' };
  }

  /**
   * Simula la recepción de un mensaje
   */
  simularRecepcionMensaje(callback) {
    this.listeners.message = callback;
    console.log('📱 [SIMULADO] WhatsApp simulado listo para recibir mensajes');
  }

  /**
   * Simula un mensaje entrante (para pruebas)
   */
  async simularMensajeEntrante(from, message) {
    console.log(`📥 [SIMULADO] Mensaje recibido de ${from}: "${message}"`);
    
    const mensajeSimulado = {
      id: `incoming_${Date.now()}`,
      from: from,
      to: 'bot',
      body: message,
      timestamp: new Date(),
      type: 'chat',
      isGroupMsg: false,
      isStatus: false,
      fromMe: false
    };
    
    this.mensajesSimulados.push(mensajeSimulado);
    botStats.mensajesRecibidos++;
    
    // Procesar el mensaje si hay un listener
    if (this.listeners.message) {
      await this.listeners.message(mensajeSimulado);
    }
    
    return mensajeSimulado;
  }

  /**
   * Obtiene el historial de mensajes simulados
   */
  getMensajesSimulados() {
    return this.mensajesSimulados;
  }

  /**
   * Limpia el historial de mensajes
   */
  limpiarHistorial() {
    this.mensajesSimulados = [];
    console.log('🗑️ [SIMULADO] Historial de mensajes limpiado');
  }

  /**
   * Obtiene estadísticas del servicio simulado
   */
  getStats() {
    return {
      totalMensajes: this.mensajesSimulados.length,
      mensajesEnviados: this.mensajesSimulados.filter(m => m.from === 'bot').length,
      mensajesRecibidos: this.mensajesSimulados.filter(m => m.from !== 'bot').length,
      ultimoMensaje: this.mensajesSimulados[this.mensajesSimulados.length - 1] || null
    };
  }
}

// Crear instancia única
const whatsappSimulado = new WhatsAppSimuladoService();

/**
 * Función para probar el flujo completo de mensajes
 */
async function probarFlujoCompleto() {
  console.log('\n🧪 INICIANDO PRUEBA DE FLUJO COMPLETO DE WHATSAPP\n');
  
  // Simular mensajes de prueba
  const mensajesDePrueba = [
    { from: '5491234567890@c.us', message: 'Hola, buenos días' },
    { from: '5491234567890@c.us', message: '¿Tienen leche?' },
    { from: '5491234567890@c.us', message: '¿Cuánto cuesta el pan?' },
    { from: '5491234567890@c.us', message: 'Gracias, adiós' }
  ];
  
  for (const test of mensajesDePrueba) {
    console.log(`\n--- PRUEBA: ${test.message} ---`);
    await whatsappSimulado.simularMensajeEntrante(test.from, test.message);
    
    // Pequeña pausa entre mensajes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Prueba de flujo completo finalizada');
  console.log('\n📊 Estadísticas:');
  console.log(whatsappSimulado.getStats());
}

/**
 * Inicializar el servicio simulado
 */
async function initWhatsAppSimulado() {
  try {
    console.log('\n📱 INICIANDO SERVICIO DE WHATSAPP SIMULADO');
    console.log('=====================================\n');
    
    // Configurar el cliente simulado en botStats
    botStats.client = whatsappSimulado.client;
    
    // Configurar el listener de mensajes
    whatsappSimulado.simularRecepcionMensaje(async (message) => {
      try {
        console.log(`\n📱 MENSAJE RECIBIDO:`);
        console.log(`   De: ${message.from}`);
        console.log(`   Mensaje: "${message.body}"`);
        
        // Procesar con el servicio de conversación
        const result = await conversationService.processIncomingMessage(
          message.from,
          'bot',
          message.body
        );
        
        console.log(`\n🧠 RESPUESTA DE IA:`);
        console.log(`   Intención: ${result.intent.intention} (${Math.round(result.intent.confidence * 100)}%)`);
        console.log(`   Respuesta: "${result.response}"`);
        
        // Enviar respuesta simulada
        await whatsappSimulado.client.sendText(message.from, result.response);
        
      } catch (error) {
        console.error('❌ Error procesando mensaje:', error);
      }
    });
    
    console.log('✅ WhatsApp Simulado iniciado correctamente');
    console.log('\n💡 Para probar el flujo, ejecuta:');
    console.log('   await probarFlujoCompleto();');
    
    // Iniciar prueba automática después de 2 segundos
    setTimeout(async () => {
      await probarFlujoCompleto();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error al iniciar WhatsApp Simulado:', error);
  }
}

module.exports = {
  initWhatsAppSimulado,
  whatsappSimulado,
  probarFlujoCompleto
};