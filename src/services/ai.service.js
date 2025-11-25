// src/services/ai.service.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../config/database');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Contexto del negocio para respuestas más precisas
    this.businessContext = {
      name: 'Supermercado La Inmaculada',
      location: 'Jr. San Martín 245, Tarapoto, San Martín, Perú',
      hours: {
        weekday: '7:00 AM - 9:00 PM',
        sunday: '8:00 AM - 2:00 PM'
      },
      services: ['delivery', 'productos frescos', 'ofertas diarias'],
      categories: ['lácteos', 'carnes', 'verduras', 'frutas', 'abarrotes', 'bebidas', 'limpieza']
    };
  }

  /**
   * Analiza la intención del mensaje del cliente
   * @param {string} message - Mensaje del cliente
   * @param {string} customerPhone - Número del cliente
   * @returns {Promise<Object>} - Intención y entidades detectadas
   */
  async analyzeIntent(message, customerPhone) {
    try {
      const prompt = `
      Eres un asistente de inteligencia artificial para el Supermercado La Inmaculada en Tarapoto, Perú.
      Analiza el siguiente mensaje de un cliente y determina su intención principal.
      
      Mensaje: "${message}"
      
      Responde SOLO con un objeto JSON en este formato exacto:
      {
        "intention": "una de estas opciones: saludo, consulta_producto, consulta_precio, consulta_stock, horarios, ubicacion, ofertas, categorias, pedido, agradecimiento, despedida, desconocido",
        "confidence": 0.95,
        "entities": {
          "product": "nombre del producto si se menciona",
          "category": "categoría si se menciona",
          "quantity": "cantidad si se especifica",
          "unit": "unidad de medida si se menciona"
        },
        "response_type": "informative|transactional|greeting|goodbye",
        "requires_action": true/false
      }
      
      Ejemplos:
      - "Hola" → {"intention": "saludo", "confidence": 1.0, "entities": {}, "response_type": "greeting", "requires_action": false}
      - "¿Tienen leche?" → {"intention": "consulta_producto", "confidence": 0.9, "entities": {"product": "leche"}, "response_type": "informative", "requires_action": true}
      - "Cuánto cuesta el pan" → {"intention": "consulta_precio", "confidence": 0.95, "entities": {"product": "pan"}, "response_type": "informative", "requires_action": true}
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Limpiar la respuesta para obtener solo JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('No se pudo parsear la respuesta de IA');
    } catch (error) {
      console.error('Error al analizar intención:', error);
      return {
        intention: 'desconocido',
        confidence: 0.1,
        entities: {},
        response_type: 'informative',
        requires_action: false
      };
    }
  }

  /**
   * Genera una respuesta inteligente basada en la intención
   * @param {Object} intent - Intención analizada
   * @param {Object} context - Contexto de la conversación
   * @returns {Promise<string>} - Respuesta generada
   */
  async generateResponse(intent, context = {}) {
    try {
      // Manejar intenciones que requieren acciones específicas
      if (intent.intention === 'consulta_producto' && intent.entities.product) {
        const products = await this.searchProductsDirect(intent.entities.product);
        return this.formatProductListForWhatsApp(products, intent.entities.product);
      }
      
      if (intent.intention === 'consulta_precio' && intent.entities.product) {
        const products = await this.searchProductsDirect(intent.entities.product);
        if (products.length > 0) {
          return this.formatProductForWhatsApp(products[0]);
        }
      }
      
      if (intent.intention === 'categorias') {
        const categories = await prisma.category.findMany({
          include: {
            _count: {
              select: { products: true }
            }
          },
          orderBy: { name: 'asc' }
        });
        return this.formatCategoriesForWhatsApp(categories);
      }
      
      if (intent.intention === 'ofertas') {
        const productsOnOffer = await prisma.product.findMany({
          where: {
            stock: { gt: 0, lt: 10 }
          },
          include: { category: true },
          orderBy: { stock: 'asc' },
          take: 5
        });
        
        if (productsOnOffer.length > 0) {
          return this.formatProductListForWhatsApp(productsOnOffer, 'ofertas');
        } else {
          return '🎉 Por el momento no tenemos ofertas activas, pero tenemos excelentes precios todos los días. ¿Qué producto buscas?';
        }
      }
      
      if (intent.intention === 'horarios') {
        return `🕐 *Horarios de atención:*\n📅 Lunes a Sábado: ${this.businessContext.hours.weekday}\n📅 Domingo: ${this.businessContext.hours.sunday}\n\n¡Estamos aquí para servirte! 😊`;
      }
      
      if (intent.intention === 'ubicacion') {
        return `📍 *Ubicación:*\n${this.businessContext.location}\n\n🚗 Además, ofrecemos servicio de delivery. ¿Te gustaría hacer un pedido?`;
      }
      
      // Para otras intenciones, usar IA generativa
      const prompt = `
      Eres un amable asistente virtual del Supermercado La Inmaculada en Tarapoto, Perú.
      Tu nombre es "Inma" y hablas de forma cercana y profesional.
      
      Información del negocio:
      - Nombre: ${this.businessContext.name}
      - Dirección: ${this.businessContext.location}
      - Horarios: Lunes-Sábado ${this.businessContext.hours.weekday}, Domingo ${this.businessContext.hours.sunday}
      - Servicios: ${this.businessContext.services.join(', ')}
      
      Intención detectada: ${intent.intention}
      Confianza: ${intent.confidence}
      Entidades: ${JSON.stringify(intent.entities)}
      Contexto previo: ${JSON.stringify(context)}
      
      Genera una respuesta apropiada para WhatsApp que sea:
      - Corta y directa (máximo 2-3 líneas)
      - Amable y profesional
      - Útil y específica
      - Con emojis apropiados
      - Si no tienes información específica, ofrece ayuda alternativa
      
      Responde SOLO con el texto del mensaje, sin explicaciones adicionales.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error al generar respuesta:', error);
      return 'Lo siento, estoy teniendo dificultades para procesar tu mensaje. ¿Podrías reformularlo? 😊';
    }
  }

  /**
   * Búsqueda directa de productos sin usar el servicio de productos
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} - Productos encontrados
   */
  async searchProductsDirect(searchTerm) {
    try {
      return await prisma.product.findMany({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        include: { category: true },
        take: 5
      });
    } catch (error) {
      console.error('Error en búsqueda directa:', error);
      return [];
    }
  }

  /**
   * Formatea productos para WhatsApp
   * @param {Array} products - Lista de productos
   * @param {string} searchTerm - Término de búsqueda
   * @returns {string} - Texto formateado
   */
  formatProductListForWhatsApp(products, searchTerm) {
    if (products.length === 0) {
      return `😔 No encontré productos relacionados con "${searchTerm}". ¿Te gustaría buscar algo más?`;
    }
    
    if (products.length === 1) {
      return this.formatProductForWhatsApp(products[0]);
    }
    
    let message = `📋 *Encontré ${products.length} productos para "${searchTerm}":*\n\n`;
    
    products.forEach((product, index) => {
      const stockEmoji = product.stock > 10 ? '🟢' : product.stock > 0 ? '🟡' : '🔴';
      message += `${index + 1}. *${product.name}* - S/ ${product.price.toFixed(2)} ${stockEmoji}\n`;
    });
    
    message += '\n💡 ¿Cuál te interesa? Puedo darte más detalles.';
    
    return message;
  }

  /**
   * Formatea un producto individual para WhatsApp
   * @param {Object} product - Producto
   * @returns {string} - Texto formateado
   */
  formatProductForWhatsApp(product) {
    const stockEmoji = product.stock > 10 ? '🟢' : product.stock > 0 ? '🟡' : '🔴';
    const stockText = product.stock > 0 ? `${stockEmoji} Stock: ${product.stock} unidades` : '🔴 Agotado';
    
    return `
📦 *${product.name}*
💰 Precio: S/ ${product.price.toFixed(2)}
${stockText}
🏷️ Categoría: ${product.category.name}
${product.description ? `📝 ${product.description}` : ''}
    `.trim();
  }

  /**
   * Formatea categorías para WhatsApp
   * @param {Array} categories - Lista de categorías
   * @returns {string} - Texto formateado
   */
  formatCategoriesForWhatsApp(categories) {
    if (categories.length === 0) {
      return 'No hay categorías disponibles actualmente.';
    }
    
    let message = '🏪 *Categorías disponibles en La Inmaculada:*\n\n';
    
    categories.forEach((category, index) => {
      const productCount = category._count.products;
      message += `${index + 1}. *${category.name}* (${productCount} productos)\n`;
      if (category.description) {
        message += `   _${category.description}_\n`;
      }
    });
    
    message += '\n💡 ¿Qué categoría te interesa? Puedo mostrarte los productos.';
    
    return message;
  }

  /**
   * Procesa un mensaje completo desde WhatsApp
   * @param {string} message - Mensaje del cliente
   * @param {string} customerPhone - Número del cliente
   * @param {Object} conversationHistory - Historial de la conversación
   * @returns {Promise<Object>} - Respuesta y análisis completo
   */
  async processMessage(message, customerPhone, conversationHistory = []) {
    try {
      // Analizar la intención del mensaje
      const intent = await this.analyzeIntent(message, customerPhone);
      
      // Preparar contexto con historial reciente
      const context = {
        history: conversationHistory.slice(-5), // Últimos 5 mensajes
        customerPhone: customerPhone,
        timestamp: new Date().toISOString()
      };
      
      // Generar respuesta basada en la intención
      const response = await this.generateResponse(intent, context);
      
      return {
        intent,
        response,
        context,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error en proceso de mensaje:', error);
      return {
        intent: { intention: 'error', confidence: 0 },
        response: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente. 🙏',
        context: {},
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Analiza un mensaje y genera respuesta (interfaz principal)
   * @param {string} message - Mensaje del cliente
   * @param {string} customerPhone - Número del cliente
   * @returns {Promise<Object>} - Resultado del análisis
   */
  async analyzeMessage(message, customerPhone) {
    try {
      // Analizar la intención del mensaje
      const intent = await this.analyzeIntent(message, customerPhone);
      
      // Buscar productos si es una consulta de producto
      let products = [];
      if (intent.intention === 'consulta_producto' && intent.entities.product) {
        try {
          const searchTerm = intent.entities.product;
          const optimizedSearch = await this.optimizeProductSearch(searchTerm);
          
          // Buscar productos con el término optimizado
          products = await prisma.product.findMany({
            where: {
              OR: [
                { name: { contains: optimizedSearch.optimized, mode: 'insensitive' } },
                { description: { contains: optimizedSearch.optimized, mode: 'insensitive' } },
                { category: { name: { contains: optimizedSearch.category, mode: 'insensitive' } } }
              ],
              stock: { gt: 0 }
            },
            include: {
              category: true
            },
            take: 5
          });
        } catch (error) {
          console.error('Error buscando productos:', error);
        }
      }
      
      // Generar respuesta basada en la intención
      const response = await this.generateResponse(intent, { customerPhone });
      
      return {
        intent: intent.intention,
        confidence: Math.round(intent.confidence * 100),
        response: response,
        products: products,
        context: { customerPhone, timestamp: new Date().toISOString() }
      };
    } catch (error) {
      console.error('Error en analyzeMessage:', error);
      return {
        intent: 'error',
        confidence: 0,
        response: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente. 🙏',
        products: [],
        context: { customerPhone, timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Ayuda a formular búsquedas de productos más efectivas
   * @param {string} searchTerm - Término de búsqueda del cliente
   * @returns {Promise<Object>} - Términos de búsqueda optimizados
   */
  async optimizeProductSearch(searchTerm) {
    try {
      const prompt = `
      Optimiza el siguiente término de búsqueda para encontrar productos en un supermercado:
      "${searchTerm}"
      
      Devuelve un objeto JSON con:
      {
        "original": "término original",
        "optimized": "término optimizado para búsqueda",
        "synonyms": ["sinónimo1", "sinónimo2"],
        "category": "categoría probable del producto",
        "confidence": 0.8
      }
      
      Ejemplo: "leche" → {"original": "leche", "optimized": "leche", "synonyms": ["lácteo", "lácteos"], "category": "lácteos", "confidence": 0.95}
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        original: searchTerm,
        optimized: searchTerm,
        synonyms: [],
        category: 'general',
        confidence: 0.5
      };
    } catch (error) {
      console.error('Error al optimizar búsqueda:', error);
      return {
        original: searchTerm,
        optimized: searchTerm,
        synonyms: [],
        category: 'general',
        confidence: 0.5
      };
    }
  }
}

const aiService = new AIService();

// Exportar funciones individuales para compatibilidad
module.exports = {
  analyzeMessage: aiService.analyzeMessage.bind(aiService),
  processMessage: aiService.processMessage.bind(aiService),
  analyzeIntent: aiService.analyzeIntent.bind(aiService),
  generateResponse: aiService.generateResponse.bind(aiService),
  optimizeProductSearch: aiService.optimizeProductSearch.bind(aiService),
  formatProductListForWhatsApp: aiService.formatProductListForWhatsApp.bind(aiService),
  formatProductForWhatsApp: aiService.formatProductForWhatsApp.bind(aiService),
  formatCategoriesForWhatsApp: aiService.formatCategoriesForWhatsApp.bind(aiService),
  AIService: AIService // Exportar la clase también si se necesita
};