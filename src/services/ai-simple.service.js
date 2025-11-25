// src/services/ai-simple.service.js
const prisma = require('../config/database');

class SimpleAIService {
  constructor() {
    // Palabras clave para detección de intenciones
    this.intentPatterns = {
      saludo: {
        keywords: ['hola', 'buenos', 'buenas', 'días', 'tardes', 'noches', 'hey', 'saludos'],
        responses: [
          '¡Hola! 👋 Bienvenido a Supermercado La Inmaculada. ¿En qué puedo ayudarte hoy?',
          '¡Buenos días! 🌞 Soy tu asistente virtual de La Inmaculada. ¿Qué estás buscando?',
          '¡Hola! 😊 Bienvenido a tu supermercado de confianza. ¿Qué necesitas hoy?'
        ]
      },
      consulta_producto: {
        keywords: ['tienen', 'hay', 'quiero', 'necesito', 'busco', 'producto', 'cuánto', 'precio', 'costo', 'arroz', 'leche', 'pan', 'azúcar', 'sal', 'aceite', 'cereal', 'yogurt', 'queso', 'pollo', 'carne', 'pescado', 'verdura', 'fruta'],
        responses: [
          'Te ayudo a encontrar lo que necesitas. ¿Qué producto te interesa?',
          'Claro, puedo ayudarte con eso. ¿Qué producto estás buscando?',
          'Perfecto, déjame buscar eso para ti. ¿Qué necesitas exactamente?'
        ]
      },
      horarios: {
        keywords: ['horario', 'hora', 'abren', 'cierran', 'atención', 'horas', 'cuándo'],
        responses: [
          '🕐 Nuestros horarios son: Lunes a Sábado 7:00 AM - 9:00 PM, Domingos 8:00 AM - 2:00 PM',
          '⏰ Estamos abiertos de lunes a sábado de 7:00 AM a 9:00 PM y domingos de 8:00 AM a 2:00 PM',
          '🕒 Te atendemos: Lunes-Sábado 7AM-9PM, Domingos 8AM-2PM'
        ]
      },
      ubicacion: {
        keywords: ['dónde', 'ubicación', 'dirección', 'cómo', 'llegar', 'están', 'local'],
        responses: [
          '📍 Estamos en Jr. San Martín 245, Tarapoto, San Martín, Perú',
          '🏪 Te esperamos en Jr. San Martín 245, en el centro de Tarapoto',
          '📍 Nuestra dirección es: Jr. San Martín 245, Tarapoto'
        ]
      },
      despedida: {
        keywords: ['adiós', 'gracias', 'hasta', 'luego', 'chau', 'bye', 'nos', 'vemos'],
        responses: [
          '¡Gracias por visitarnos! 😊 ¡Vuelve pronto a La Inmaculada!',
          '¡Hasta luego! 👋 Que tengas un excelente día',
          '¡Gracias! 🙏 Te esperamos de vuelta pronto'
        ]
      },
      categorias: {
        keywords: ['categorías', 'secciones', 'departamentos', 'tipos', 'qué', 'tienen'],
        responses: [
          '🏪 Tenemos lácteos, carnes, verduras, frutas, abarrotes, bebidas y productos de limpieza',
          '📋 Nuestras categorías principales son: lácteos, carnes, verduras, frutas, abarrotes, bebidas y limpieza',
          '🛒 Contamos con: lácteos, carnes, verduras, frutas, abarrotes, bebidas y productos de limpieza'
        ]
      }
    };
  }

  /**
   * Detecta la intención del mensaje basándose en palabras clave
   */
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    let maxScore = 0;
    let detectedIntent = 'desconocido';
    
    for (const [intent, data] of Object.entries(this.intentPatterns)) {
      let score = 0;
      
      for (const keyword of data.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          score++;
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        detectedIntent = intent;
      }
    }
    
    return {
      intention: detectedIntent,
      confidence: maxScore > 0 ? 0.8 + (maxScore * 0.05) : 0.1,
      entities: this.extractEntities(message),
      response_type: this.getResponseType(detectedIntent),
      requires_action: maxScore > 0
    };
  }

  /**
   * Extrae entidades del mensaje
   */
  extractEntities(message) {
    const lowerMessage = message.toLowerCase();
    const entities = {
      product: null,
      category: null,
      quantity: null,
      unit: null
    };
    
    // Productos comunes
    const products = ['arroz', 'leche', 'pan', 'azúcar', 'sal', 'aceite', 'cereal', 'yogurt', 'queso', 'pollo', 'carne', 'pescado', 'verdura', 'fruta', 'papa', 'tomate', 'cebolla', 'ajo'];
    
    for (const product of products) {
      if (lowerMessage.includes(product)) {
        entities.product = product;
        break;
      }
    }
    
    // Categorías
    const categories = ['lácteos', 'carnes', 'verduras', 'frutas', 'abarrotes', 'bebidas', 'limpieza'];
    
    for (const category of categories) {
      if (lowerMessage.includes(category)) {
        entities.category = category;
        break;
      }
    }
    
    // Cantidades
    const quantityMatch = message.match(/(\d+)/);
    if (quantityMatch) {
      entities.quantity = parseInt(quantityMatch[1]);
    }
    
    // Unidades
    const units = ['kg', 'kilo', 'kilos', 'gramo', 'gramos', 'g', 'litro', 'litros', 'l', 'unidad', 'unidades', 'docena', 'docenas'];
    
    for (const unit of units) {
      if (lowerMessage.includes(unit)) {
        entities.unit = unit;
        break;
      }
    }
    
    return entities;
  }

  /**
   * Determina el tipo de respuesta
   */
  getResponseType(intent) {
    const responseTypes = {
      saludo: 'greeting',
      consulta_producto: 'transactional',
      horarios: 'informative',
      ubicacion: 'informative',
      despedida: 'goodbye',
      categorias: 'informative',
      desconocido: 'informative'
    };
    
    return responseTypes[intent] || 'informative';
  }

  /**
   * Genera una respuesta basada en la intención
   */
  generateResponse(intent, context = {}) {
    const intentData = this.intentPatterns[intent.intention];
    
    if (intentData && intentData.responses.length > 0) {
      const randomResponse = intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
      return randomResponse;
    }
    
    // Respuestas por defecto
    const defaultResponses = {
      saludo: '¡Hola! 👋 ¿En qué puedo ayudarte hoy?',
      consulta_producto: '¿Qué producto te gustaría conocer?',
      horarios: 'Nuestros horarios son Lunes a Sábado 7AM-9PM, Domingos 8AM-2PM',
      ubicacion: 'Estamos en Jr. San Martín 245, Tarapoto',
      despedida: '¡Gracias! ¡Vuelve pronto!',
      categorias: 'Tenemos lácteos, carnes, verduras, frutas, abarrotes, bebidas y limpieza',
      desconocido: 'Lo siento, no entendí eso. ¿Podrías reformular tu pregunta? 😊'
    };
    
    return defaultResponses[intent.intention] || defaultResponses.desconocido;
  }

  /**
   * Busca productos en la base de datos
   */
  async searchProducts(searchTerm, category = null) {
    try {
      const whereClause = {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ],
        stock: { gt: 0 }
      };
      
      if (category) {
        whereClause.category = { name: { contains: category, mode: 'insensitive' } };
      }
      
      const products = await prisma.product.findMany({
        where: whereClause,
        include: {
          category: true
        },
        take: 5
      });
      
      return products;
    } catch (error) {
      console.error('Error buscando productos:', error);
      return [];
    }
  }

  /**
   * Formatea productos para WhatsApp
   */
  formatProductsForWhatsApp(products, searchTerm) {
    if (products.length === 0) {
      return `😔 No encontré productos relacionados con "${searchTerm}". ¿Te gustaría buscar algo más?`;
    }
    
    if (products.length === 1) {
      const product = products[0];
      const stockEmoji = product.stock > 10 ? '🟢' : product.stock > 0 ? '🟡' : '🔴';
      return `
📦 *${product.name}*
💰 Precio: S/ ${product.price.toFixed(2)}
${stockEmoji} Stock: ${product.stock} unidades
🏷️ Categoría: ${product.category.name}
${product.description ? `📝 ${product.description}` : ''}
      `.trim();
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
   * Analiza un mensaje y genera respuesta
   */
  async analyzeMessage(message, customerPhone) {
    try {
      // Detectar intención
      const intent = this.detectIntent(message);
      
      // Buscar productos si es una consulta de producto
      let products = [];
      let response = this.generateResponse(intent);
      
      if (intent.intention === 'consulta_producto' && intent.entities.product) {
        products = await this.searchProducts(intent.entities.product, intent.entities.category);
        
        if (products.length > 0) {
          response = this.formatProductsForWhatsApp(products, intent.entities.product);
        } else if (intent.entities.product) {
          response = `🔍 Estoy buscando "${intent.entities.product}" en nuestro inventario...`;
        }
      }
      
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
}

const aiService = new SimpleAIService();

module.exports = {
  analyzeMessage: aiService.analyzeMessage.bind(aiService),
  detectIntent: aiService.detectIntent.bind(aiService),
  generateResponse: aiService.generateResponse.bind(aiService),
  searchProducts: aiService.searchProducts.bind(aiService),
  formatProductsForWhatsApp: aiService.formatProductsForWhatsApp.bind(aiService),
  SimpleAIService: SimpleAIService
};