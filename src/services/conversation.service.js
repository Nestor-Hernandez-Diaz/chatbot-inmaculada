// src/services/conversation.service.js
const prisma = require('../config/database');
const aiService = require('./ai-advanced.service'); // Usar IA avanzada
const botStats = require('../utils/botStats');

class ConversationService {
  /**
   * Obtiene o crea una conversación de WhatsApp
   * @param {string} customerPhone - Número del cliente
   * @param {string} botPhone - Número del bot
   * @returns {Promise<Object>} - Conversación
   */
  async getOrCreateConversation(customerPhone, botPhone) {
    try {
      let conversation = await prisma.whatsappConversation.findFirst({
        where: {
          customerPhone: customerPhone,
          botPhone: botPhone,
          status: 'OPEN'
        },
        include: {
          messages: {
            orderBy: { timestamp: 'desc' },
            take: 10
          },
          Order: {
            where: { status: 'PENDING' },
            include: { items: true }
          }
        }
      });

      if (!conversation) {
        conversation = await prisma.whatsappConversation.create({
          data: {
            customerPhone: customerPhone,
            botPhone: botPhone,
            status: 'OPEN'
          },
          include: {
            messages: [],
            Order: []
          }
        });
      }

      return conversation;
    } catch (error) {
      console.error('Error al obtener/crear conversación:', error);
      throw error;
    }
  }

  /**
   * Guarda un mensaje en la conversación
   * @param {number} conversationId - ID de la conversación
   * @param {string} content - Contenido del mensaje
   * @param {string} sender - 'USER' o 'BOT'
   * @param {string} contentType - Tipo de contenido
   * @returns {Promise<Object>} - Mensaje guardado
   */
  async saveMessage(conversationId, content, sender, contentType = 'text') {
    try {
      const message = await prisma.message.create({
        data: {
          id: this.generateMessageId(),
          conversationId: conversationId,
          sender: sender,
          content: content,
          contentType: contentType,
          timestamp: new Date()
        }
      });

      return message;
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
      throw error;
    }
  }

  /**
   * Genera un ID único para mensajes de WhatsApp
   * @returns {string} - ID del mensaje
   */
  generateMessageId() {
    return `wamid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene el historial de mensajes formateado para IA
   * @param {number} conversationId - ID de la conversación
   * @returns {Promise<Array>} - Historial formateado
   */
  async getConversationHistory(conversationId) {
    try {
      const messages = await prisma.message.findMany({
        where: { conversationId: conversationId },
        orderBy: { timestamp: 'desc' },
        take: 10
      });

      return messages.reverse().map(msg => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp
      }));
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
  }

  /**
   * Procesa un mensaje entrante con IA
   * @param {string} customerPhone - Número del cliente
   * @param {string} botPhone - Número del bot
   * @param {string} messageContent - Contenido del mensaje
   * @returns {Promise<Object>} - Respuesta procesada
   */
  async processIncomingMessage(customerPhone, botPhone, messageContent) {
    try {
      // Obtener o crear conversación
      const conversation = await this.getOrCreateConversation(customerPhone, botPhone);
      
      // Guardar mensaje del usuario
      await this.saveMessage(conversation.id, messageContent, 'USER');
      
      // Procesar con IA
      const aiResult = await aiService.analyzeMessage(messageContent, customerPhone);
      
      // Guardar respuesta del bot
      await this.saveMessage(conversation.id, aiResult.response, 'BOT');
      
      // Actualizar estadísticas
      botStats.incrementarIntencion(aiResult.intent);
      await this.updateConversationStats(conversation.id);
      
      return {
        intent: {
          intention: aiResult.intent,
          confidence: aiResult.confidence / 100
        },
        response: aiResult.response,
        context: aiResult.context,
        conversationId: conversation.id,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      return {
        intent: { intention: 'error', confidence: 0 },
        response: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente. 🙏',
        context: {},
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Actualiza estadísticas de la conversación
   * @param {number} conversationId - ID de la conversación
   */
  async updateConversationStats(conversationId) {
    try {
      const messageCount = await prisma.message.count({
        where: { conversationId: conversationId }
      });

      // Si hay muchos mensajes, marcar como que necesita atención
      if (messageCount > 20) {
        await prisma.whatsappConversation.update({
          where: { id: conversationId },
          data: { status: 'NEEDS_ATTENTION' }
        });
      }
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
    }
  }

  /**
   * Cierra una conversación
   * @param {number} conversationId - ID de la conversación
   * @returns {Promise<Object>} - Conversación actualizada
   */
  async closeConversation(conversationId) {
    try {
      return await prisma.whatsappConversation.update({
        where: { id: conversationId },
        data: { status: 'CLOSED' }
      });
    } catch (error) {
      console.error('Error al cerrar conversación:', error);
      throw error;
    }
  }

  /**
   * Obtiene conversaciones que necesitan atención humana
   * @returns {Promise<Array>} - Conversaciones pendientes
   */
  async getConversationsNeedingAttention() {
    try {
      return await prisma.whatsappConversation.findMany({
        where: { status: 'NEEDS_ATTENTION' },
        include: {
          messages: {
            orderBy: { timestamp: 'desc' },
            take: 5
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
    } catch (error) {
      console.error('Error al obtener conversaciones pendientes:', error);
      return [];
    }
  }

  /**
   * Obtiene el carrito activo del cliente
   * @param {number} conversationId - ID de la conversación
   * @returns {Promise<Object|null>} - Carrito activo
   */
  async getActiveCart(conversationId) {
    try {
      const activeOrder = await prisma.order.findFirst({
        where: {
          whatsappConversationId: conversationId,
          status: 'PENDING'
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      return activeOrder;
    } catch (error) {
      console.error('Error al obtener carrito activo:', error);
      return null;
    }
  }
}

module.exports = new ConversationService();