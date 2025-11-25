// src/services/ai-advanced.service.js
const prisma = require('../config/database');

/**
 * Motor de IA Avanzado con Contexto Empresarial y Memoria Conversacional
 */
class AdvancedAIService {
  constructor() {
    // Contexto empresarial completo de La Inmaculada
    this.businessContext = {
      name: 'Supermercado La Inmaculada',
      location: 'Jr. San Martín 245, Tarapoto, San Martín, Perú',
      coordinates: { lat: -6.4857, lng: -76.3624 },
      established: 1995,
      type: 'Supermercado familiar',
      specialities: ['Productos frescos', 'Atención personalizada', 'Delivery a domicilio'],
      
      horarios: {
        lunes_viernes: { abre: '07:00', cierra: '21:00' },
        sabado: { abre: '07:00', cierra: '21:00' },
        domingo: { abre: '08:00', cierra: '14:00' },
        festivos: { abre: '08:00', cierra: '13:00', nota: 'Consultar días festivos específicos' }
      },
      
      servicios: {
        delivery: {
          disponible: true,
          zonas: ['Centro de Tarapoto', 'Banda de Shilcayo', 'Morales'],
          costo: 'S/ 5.00 en zona centro, S/ 8.00 en zonas aledañas',
          tiempo: '30-45 minutos en zona centro'
        },
        pago: ['Efectivo', 'Tarjeta débito/crédito', 'Yape', 'Plin'],
        estacionamiento: 'Gratis para clientes',
        wifi: 'Zona WiFi gratuita'
      },
      
        categorias_principales: [
        {
          nombre: 'Lácteos y Huevos',
          descripcion: 'Productos frescos diariamente',
          productos_destacados: ['Leche entera', 'Yogurt natural', 'Queso fresco', 'Huevos AA'],
          marcas: ['Gloria', 'Laive', 'Pura Vida', 'San Fernando']
        },
        {
          nombre: 'Carnes y Pescados',
          descripcion: 'Carnes frescas y pescados de la región',
          productos_destacados: ['Pollo fresco', 'Res nacional', 'Pescado del Amazonas'],
          marcas: ['Locales', 'Regionales']
        },
        {
          nombre: 'Verduras y Frutas',
          descripcion: 'Productos frescos de la selva peruana',
          productos_destacados: ['Plátano', 'Yuca', 'Camu camu', 'Aguaje'],
          temporada: 'Varía según estación'
        },
        {
          nombre: 'Abarrotes',
          descripcion: 'Productos esenciales para tu hogar',
          productos_destacados: ['Arroz', 'Azúcar', 'Sal', 'Aceite'],
          marcas: ['Costeño', 'Primor', 'Oro']
        }
      ],
      
      promociones_actuales: [
        { producto: 'Leche Gloria 1L', precio: 'S/ 4.50', descuento: '25%' },
        { producto: 'Arroz Costeño 5kg', precio: 'S/ 18.00', descuento: '15%' },
        { producto: 'Pollo entero', precio: 'S/ 12.00/kg', descuento: '20%' }
      ],
      
      informacion_contacto: {
        telefono: '(042) 52-1234',
        whatsapp: '+51 942 123 456',
        email: 'info@lainmaculada.com',
        redes: { facebook: 'LaInmaculadaTarapoto', instagram: '@lainmaculada_tarapoto' }
      }
    };

    // Motor de intenciones con lógica avanzada
    this.intentEngine = {
      // Intenciones principales con múltiples variaciones
      intents: {
        saludo: {
          patterns: [
            /\b(hola|buenos|buenas|días|tardes|noches|hey|saludos|qué tal|cómo estás)\b/i,
            /^hola/i, /^buen/i, /^buenas/i
          ],
          context: ['inicio_conversacion', 'retorno_cliente'],
          priority: 1
        },
        
        consulta_producto: {
          patterns: [
            /\b(tienen|hay|venden|tienes|hay|disponible|stock)\s+(.*)/i,
            /\b(quiero|necesito|busco|deseo)\s+(.*)/i,
            /\b(cuánto|cuesta|precio|valor)\s+(.*)/i,
            /\b(dónde está|encuentro|está)\s+(.*)/i
          ],
          context: ['busqueda_producto', 'precio_producto', 'disponibilidad'],
          priority: 2
        },
        
        comparacion_productos: {
          patterns: [
            /\b(cuál es mejor|diferencia entre|comparar|versus|vs)\s+(.*)/i,
            /\b(qué me recomiendas|mejor opción|recomendación)\s+(.*)/i
          ],
          context: ['comparacion', 'recomendacion'],
          priority: 2
        },
        
        horarios_servicio: {
          patterns: [
            /\b(horario|hora|abren|cierran|atención|cuándo abren|está abierto)\b/i,
            /\b(a qué hora|hasta qué hora|está abierto)\b/i
          ],
          context: ['horario', 'disponibilidad_tiempo'],
          priority: 1
        },
        
        ubicacion_tienda: {
          patterns: [
            /\b(dónde están|ubicación|dirección|cómo llego|dónde queda)\b/i,
            /\b(están en|sucursal|local|tienda)\b/i
          ],
          context: ['ubicacion', 'como_llegar'],
          priority: 1
        },
        
        delivery_servicio: {
          patterns: [
            /\b(delivery|domicilio|envío|mandan a casa|entregan)\b/i,
            /\b(cuánto cuesta el delivery|zona de delivery)\b/i
          ],
          context: ['delivery', 'envio', 'servicio_domicilio'],
          priority: 2
        },
        
        pedido_compra: {
          patterns: [
            /\b(quiero pedir|hacer pedido|ordenar|comprar)\s+(.*)/i,
            /\b(me manda|envíame|trae me)\s+(.*)/i
          ],
          context: ['pedido', 'compra', 'orden'],
          priority: 3
        },
        
        quejas_sugerencias: {
          patterns: [
            /\b(está malo|mala calidad|queja|reclamo|problema|ayuda|urgente|decepcionado|molesto|enojado|frustrado)\b/i,
            /\b(no me gustó|no es bueno|defectuoso|malo servicio|mala atención)\b/i,
            /\b(estoy|estoy muy|muy)\s+(decepcionado|molesto|enojado|frustrado|insatisfecho)\b/i,
            /\b(servicio|atención|producto)\s+(malo|mala|pésimo|terrible)\b/i
          ],
          context: ['queja', 'sugerencia', 'problema_calidad', 'urgencia_negativa'],
          priority: 4
        },
        
        despedida: {
          patterns: [
            /\b(adiós|hasta luego|chau|bye|nos vemos|gracias|muchas gracias)\b/i,
            /\b(está bien|ok|perfecto|listo)\b.*\b(adiós|hasta luego)\b/i
          ],
          context: ['fin_conversacion'],
          priority: 1
        }
      }
    };

    // Sistema de memoria conversacional
    this.conversationMemory = new Map();
    
    // Catálogo de productos en memoria para búsqueda rápida (lazy-load)
    this.productCatalog = null;
    this.catalogLoading = false;
    this.catalogLoadPromise = null;
    // NO llamamos loadProductCatalog() aquí - se carga bajo demanda
  }

  /**
   * Obtiene el catálogo de productos (lazy-load)
   * Se carga en la primera consulta para no bloquear el arranque del servidor
   */
  async ensureCatalogLoaded() {
    // Si ya está cargado, retornar
    if (this.productCatalog !== null) {
      return this.productCatalog;
    }
    
    // Si ya hay una carga en progreso, esperar a que termine
    if (this.catalogLoading && this.catalogLoadPromise) {
      return this.catalogLoadPromise;
    }
    
    // Iniciar carga
    this.catalogLoading = true;
    this.catalogLoadPromise = this.loadProductCatalog();
    
    try {
      await this.catalogLoadPromise;
    } finally {
      this.catalogLoading = false;
    }
    
    return this.productCatalog;
  }

  /**
   * Carga el catálogo de productos en memoria
   */
  async loadProductCatalog() {
    try {
      console.log('📦 Cargando catálogo de productos (lazy-load)...');
      const products = await prisma.product.findMany({
        include: {
          category: true,
          orderItems: {
            select: {
              quantity: true,
              order: {
                select: { status: true }
              }
            }
          }
        }
      });
      
      this.productCatalog = products.map(product => ({
        ...product,
        popularity: this.calculatePopularity(product),
        synonyms: this.generateProductSynonyms(product)
      }));
      
      console.log(`📦 Catálogo cargado: ${this.productCatalog.length} productos`);
    } catch (error) {
      console.error('Error cargando catálogo:', error);
    }
  }

  /**
   * Calcula la popularidad de un producto basado en pedidos
   */
  calculatePopularity(product) {
    const completedOrders = product.orderItems.filter(
      item => item.order.status === 'COMPLETED'
    );
    return completedOrders.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Genera sinónimos para búsqueda más inteligente - EXPANDIDO
   */
  generateProductSynonyms(product) {
    const synonyms = [product.name.toLowerCase()];
    const name = product.name.toLowerCase();
    
    // Diccionario completo de sinónimos por categoría
    const synonymDictionary = {
      // Lácteos
      'leche': ['lácteo', 'lácteos', 'lacteo', 'lacteos', 'bebida láctea', 'vaca', 'vacuno'],
      'yogurt': ['yogur', 'yoghurt', 'lácteo', 'fermentado', 'probiótico'],
      'queso': ['queso fresco', 'lácteo', 'derivado', 'cuajada'],
      
      // Carnes
      'pollo': ['ave', 'pollo fresco', 'carne de pollo', 'pollo entero', 'gallina'],
      'res': ['vaca', 'ternera', 'carne roja', 'bovino', 'vacuno'],
      'pescado': ['pescado fresco', 'marisco', 'producto del mar', 'pez'],
      
      // Granos y cereales
      'arroz': ['grano', 'cereal', 'arroz blanco', 'arroz integral', 'grano de arroz'],
      'azúcar': ['endulzante', 'dulce', 'carbohidrato', 'sacarosa'],
      'sal': ['condimento', 'sazonador', 'cloruro de sodio'],
      
      // Frutas y verduras
      'plátano': ['banana', 'guineo', 'fruta', 'banano'],
      'yuca': ['mandioca', 'casaba', 'tubérculo', 'raíz'],
      'camu camu': ['fruta amazónica', 'vitamina c', 'fruta silvestre'],
      
      // Abarrotes generales
      'aceite': ['grasa', 'aceite vegetal', 'aceite de cocina'],
      'pan': ['pan fresco', 'pan de mesa', 'harina'],
      'huevo': ['huevo fresco', 'huevo gallina', 'proteína', 'clara y yema']
    };
    
    // Agregar sinónimos basados en palabras clave encontradas
    for (const [key, variants] of Object.entries(synonymDictionary)) {
      if (name.includes(key)) {
        synonyms.push(...variants);
      }
    }
    
    // Agregar variaciones de marca comunes
    const brandVariations = {
      'gloria': ['gloria', 'leche gloria', 'marca gloria'],
      'costeño': ['costeño', 'arroz costeño', 'marca costeño'],
      'primor': ['primor', 'aceite primor', 'marca primor'],
      'laive': ['laive', 'lácteo laive', 'marca laive'],
      'pura vida': ['pura vida', 'leche pura vida', 'marca pura vida'],
      'san fernando': ['san fernando', 'pollo san fernando', 'marca san fernando']
    };
    
    for (const [brand, variations] of Object.entries(brandVariations)) {
      if (name.includes(brand)) {
        synonyms.push(...variations);
      }
    }
    
    // Agregar variaciones numéricas comunes
    if (name.match(/\d+(kg|g|l|ml)/)) {
      const match = name.match(/(\d+)(kg|g|l|ml)/);
      const number = match[1];
      const unit = match[2];
      
      synonyms.push(`${number}${unit}`, `${number} ${unit}`, `${number} de ${unit}`);
      
      // Convertir entre unidades
      if (unit === 'kg') {
        synonyms.push(`${number * 1000}g`, `${number * 1000} g`);
      } else if (unit === 'g' && number >= 1000) {
        synonyms.push(`${number/1000}kg`, `${number/1000} kg`);
      } else if (unit === 'l') {
        synonyms.push(`${number * 1000}ml`, `${number * 1000} ml`);
      } else if (unit === 'ml' && number >= 1000) {
        synonyms.push(`${number/1000}l`, `${number/1000} l`);
      }
    }
    
    // Eliminar duplicados y retornar
    return [...new Set(synonyms)];
  }

  /**
   * Análisis profundo de intención con múltiples factores MEJORADO
   */
  async analyzeIntent(message, customerPhone, conversationHistory = []) {
    const lowerMessage = message.toLowerCase().trim();
    const intents = [];
    
    // Análisis por patrones mejorado con scoring más agresivo
    for (const [intentName, intentData] of Object.entries(this.intentEngine.intents)) {
      let score = 0;
      let matchedPattern = null;
      let patternMatches = 0;
      
      // Evaluar cada patrón con scoring más generoso
      for (const pattern of intentData.patterns) {
        const match = lowerMessage.match(pattern);
        if (match) {
          patternMatches++;
          score += intentData.priority * 25; // AUMENTADO de 15 a 25
          matchedPattern = match;
          
          // Bonus por coincidencia exacta vs parcial - AUMENTADO
          if (match[0].length === lowerMessage.length) {
            score += 20; // AUMENTADO de 10 a 20
          } else if (match[0].length > 3) {
            score += 10; // AUMENTADO de 5 a 10
          }
          
          break; // Tomar la primera coincidencia por patrón
        }
      }
      
      // Bonus adicionales mejorados
      if (score > 0) {
        // Bonus por múltiples patrones que coinciden - AUMENTADO
        if (patternMatches > 1) {
          score += patternMatches * 10; // AUMENTADO de 5 a 10
        }
        
        // Análisis de contexto temporal mejorado
        const temporalScore = this.analyzeTemporalContext(lowerMessage, intentName);
        score += temporalScore;
        
        // Análisis de urgencia o importancia mejorado
        const urgencyScore = this.analyzeUrgencyIndicators(lowerMessage);
        score += urgencyScore;
        
        // NUEVO: Bonus por longitud del mensaje
        if (lowerMessage.length > 10 && lowerMessage.length < 100) {
          score += 5;
        }
        
        // NUEVO: Bonus por estructura gramatical
        if (this.hasQuestionStructure(lowerMessage)) {
          score += 8;
        }
        
        intents.push({
          intention: intentName,
          confidence: Math.min(score / 100, 0.98), // Máximo 98% para dejar margen
          matchedPattern,
          entities: this.extractAdvancedEntities(message, matchedPattern),
          context: intentData.context,
          scoreDetails: {
            baseScore: intentData.priority * 25,
            patternMatches,
            temporalScore,
            urgencyScore
          }
        });
      }
    }
    
    // Análisis de intenciones implícitas mejorado
    const implicitIntent = this.analyzeImplicitIntentImproved(lowerMessage, customerPhone, conversationHistory);
    if (implicitIntent) {
      intents.push(implicitIntent);
    }
    
    // Si no hay coincidencias claras, usar análisis contextual mejorado
    if (intents.length === 0) {
      const contextualIntent = await this.analyzeContextualIntentImproved(message, customerPhone, conversationHistory);
      if (contextualIntent) {
        intents.push(contextualIntent);
      }
    }
    
    // Ordenar por confianza y tomar el mejor
    intents.sort((a, b) => b.confidence - a.confidence);
    
    // Ajustar umbrales para multi-intento - BAJADO para mejor detección
    if (intents.length > 1 && intents[0].confidence > 0.6 && intents[1].confidence > 0.5) { // BAJADO de 0.7/0.6 a 0.6/0.5
      return this.handleMultiIntent(intents.slice(0, 2), message, customerPhone);
    }
    
    return intents[0] || {
      intention: 'desconocido',
      confidence: 0.25, // AUMENTADO de 0.15 a 0.25
      entities: this.extractAdvancedEntities(message),
      context: ['general']
    };
  }

  /**
   * NUEVO: Detecta si el mensaje tiene estructura de pregunta
   */
  hasQuestionStructure(message) {
    const questionWords = ['qué', 'cuál', 'cuándo', 'dónde', 'cómo', 'por qué', 'para qué', 'quién'];
    const questionMarks = message.includes('?') || message.includes('¿');
    const startsWithQuestion = questionWords.some(word => message.startsWith(word));
    
    return questionMarks || startsWithQuestion;
  }

  /**
   * Análisis de intenciones implícitas MEJORADO
   */
  analyzeImplicitIntentImproved(message, customerPhone, conversationHistory) {
    const implicitIntents = [];
    
    // Intenciones implícitas basadas en patrones sutiles - MEJORADOS
    if (message.includes('gracias') || message.includes('thank') || message.includes('agradezco')) {
      implicitIntents.push({
        intention: 'agradecimiento',
        confidence: 0.85, // AUMENTADO de 0.75 a 0.85
        entities: {},
        context: ['positivo', 'cierre'],
        implicit: true
      });
    }
    
    if (message.includes('perdón') || message.includes('disculpa') || message.includes('sorry') || message.includes('lo siento')) {
      implicitIntents.push({
        intention: 'disculpa',
        confidence: 0.90, // AUMENTADO de 0.80 a 0.90
        entities: {},
        context: ['negativo', 'correccion'],
        implicit: true
      });
    }
    
    // Buscar confirmaciones o negaciones implícitas - MEJORADAS
    if (message.match(/^s[ií]$/i) || message.includes('correcto') || message.includes('exacto') || message.includes('cierto') || 
        message.includes('me interesa') || message.includes('me gusta') || message.includes('prefiero') ||
        message.includes('sí, me interesa') || message.includes('sí me interesa') || message.includes('claro') ||
        message.includes('efectivamente') || message.includes('vale') || message.includes('ok')) {
      implicitIntents.push({
        intention: 'confirmacion_implicita',
        confidence: 0.90, // AUMENTADO de 0.85 a 0.90
        entities: {},
        context: ['afirmacion', 'continuacion'],
        implicit: true
      });
    }
    
    if (message.match(/^no$/i) || message.includes('incorrecto') || message.includes('error') || message.includes('equivocado') ||
        message.includes('no me interesa') || message.includes('no me gusta') || message.includes('prefiero otro') ||
        message.includes('cambiar') || message.includes('otra opción') || message.includes('diferente')) {
      implicitIntents.push({
        intention: 'negacion_implicita',
        confidence: 0.90, // AUMENTADO de 0.85 a 0.90
        entities: {},
        context: ['negacion', 'correccion'],
        implicit: true
      });
    }
    
    // NUEVO: Detectar despedidas implícitas
    if (message.includes('hasta luego') || message.includes('nos vemos') || message.includes('adiós') || message.includes('chau')) {
      implicitIntents.push({
        intention: 'despedida',
        confidence: 0.95,
        entities: {},
        context: ['cierre', 'despedida'],
        implicit: true
      });
    }
    
    // NUEVO: Detectar saludos implícitos
    if (message.includes('buenos días') || message.includes('buenas tardes') || message.includes('buenas noches')) {
      implicitIntents.push({
        intention: 'saludo',
        confidence: 0.95,
        entities: {},
        context: ['saludo', 'cortesia'],
        implicit: true
      });
    }
    
    return implicitIntents.length > 0 ? implicitIntents[0] : null;
  }

  /**
   * Análisis contextual basado en historial y memoria MEJORADO
   */
  async analyzeContextualIntentImproved(message, customerPhone, conversationHistory) {
    const memory = this.getConversationMemory(customerPhone);
    const recentContext = conversationHistory.slice(-5); // Ampliar a 5 mensajes
    
    // Análisis de flujo de conversación - AUMENTAR CONFIDENCE
    const conversationFlow = this.analyzeConversationFlowImproved(memory, recentContext, message);
    if (conversationFlow) {
      return conversationFlow;
    }
    
    // Análisis de contexto de productos - AUMENTAR CONFIDENCE
    const productContext = this.analyzeProductContextImproved(memory, message);
    if (productContext) {
      return productContext;
    }
    
    // Análisis de contexto temporal - AUMENTAR CONFIDENCE
    const temporalContext = this.analyzeTemporalContextInMessageImproved(message, memory);
    if (temporalContext) {
      return temporalContext;
    }
    
    // Análisis de intención implícita por patrones de respuesta - AUMENTAR CONFIDENCE
    const responsePattern = this.analyzeResponsePatternsImproved(message, memory, recentContext);
    if (responsePattern) {
      return responsePattern;
    }
    
    return null;
  }

  /**
   * Análisis de flujo de conversación MEJORADO
   */
  analyzeConversationFlowImproved(memory, recentContext, message) {
    const lowerMessage = message.toLowerCase();
    
    // Detección de confirmaciones genéricas (sin contexto previo)
    const genericConfirmations = ['sí', 'si', 'me interesa', 'perfecto', 'excelente', 'bueno', 'ok', 'vale', 'claro'];
    if (genericConfirmations.some(resp => lowerMessage === resp)) {
      return {
        intention: 'confirmacion_implicita',
        confidence: 0.75, // Confianza moderada para confirmaciones genéricas
        entities: { response: 'positive', flow: 'generic_confirmation' },
        context: ['afirmacion', 'generico']
      };
    }
    
    // Flujo: consulta_producto → respuesta_afirmativa/negativa - AUMENTAR CONFIDENCE
    if (memory.lastIntent === 'consulta_producto') {
      // Respuestas afirmativas
      const affirmativeResponses = ['sí', 'si', 'me interesa', 'perfecto', 'excelente', 'bueno', 'ok', 'vale', 'claro', 'efectivamente'];
      if (affirmativeResponses.some(resp => lowerMessage.includes(resp))) {
        return {
          intention: 'confirmacion_producto',
          confidence: 0.95, // AUMENTADO de 0.9 a 0.95
          entities: { response: 'positive', flow: 'product_inquiry_continuation' },
          context: ['continuacion_busqueda', 'afirmacion']
        };
      }
      
      // Respuestas negativas
      const negativeResponses = ['no', 'otro', 'diferente', 'más opciones', 'no me gusta', 'cambiar'];
      if (negativeResponses.some(resp => lowerMessage.includes(resp))) {
        return {
          intention: 'cambio_producto',
          confidence: 0.90, // AUMENTADO de 0.85 a 0.90
          entities: { response: 'negative', flow: 'product_inquiry_change' },
          context: ['nueva_busqueda', 'negacion']
        };
      }
      
      // Números o selección
      if (lowerMessage.match(/^\d+$/)) {
        return {
          intention: 'seleccion_numerica',
          confidence: 0.98, // AUMENTADO de 0.95 a 0.98
          entities: { selectedNumber: parseInt(lowerMessage), flow: 'numeric_selection' },
          context: ['seleccion', 'numerico']
        };
      }
    }
    
    // Flujo: pedido_compra → confirmación de cantidad
    if (memory.lastIntent === 'pedido_compra' || memory.lastIntent === 'confirmacion_producto') {
      if (lowerMessage.match(/^\d+$/)) {
        return {
          intention: 'especificar_cantidad',
          confidence: 0.98, // AUMENTADO de 0.95 a 0.98
          entities: { quantity: parseInt(lowerMessage), flow: 'order_quantity' },
          context: ['pedido', 'cantidad']
        };
      }
    }
    
    return null;
  }

  /**
   * Análisis de contexto de productos MEJORADO
   */
  analyzeProductContextImproved(memory, message) {
    const lowerMessage = message.toLowerCase();
    
    if (memory.lastProducts && memory.lastProducts.length > 0) {
      const productNames = memory.lastProducts.map(p => p.name.toLowerCase());
      
      // Buscar mención de productos anteriores
      for (const productName of productNames) {
        const productWords = productName.split(' ');
        
        // Coincidencia exacta o parcial significativa
        if (lowerMessage.includes(productName)) {
          return {
            intention: 'seleccion_producto',
            confidence: 0.95, // AUMENTADO de 0.92 a 0.95
            entities: { selectedProduct: productName, flow: 'product_mention' },
            context: ['seleccion_desde_lista', 'mencion_directa']
          };
        }
        
        // Coincidencia de palabra clave
        for (const word of productWords) {
          if (word.length > 3 && lowerMessage.includes(word)) {
            return {
              intention: 'seleccion_producto',
              confidence: 0.85, // AUMENTADO de 0.75 a 0.85
              entities: { selectedProduct: productName, flow: 'product_keyword' },
              context: ['seleccion_desde_lista', 'mencion_parcial']
            };
          }
        }
      }
      
      // Si menciona "este", "ese", "el primero", etc.
      const demonstratives = ['este', 'ese', 'aquel', 'primero', 'segundo', 'tercero', 'el primero', 'el segundo'];
      if (demonstratives.some(demo => lowerMessage.includes(demo))) {
        return {
          intention: 'seleccion_producto',
          confidence: 0.90, // AUMENTADO de 0.8 a 0.90
          entities: { selectedProduct: memory.lastProducts[0].name, flow: 'demonstrative_selection' },
          context: ['seleccion_desde_lista', 'demostrativo']
        };
      }
    }
    
    return null;
  }

  /**
   * Análisis de contexto temporal MEJORADO
   */
  analyzeTemporalContextInMessageImproved(message, memory) {
    const lowerMessage = message.toLowerCase();
    
    // Si pregunta sobre horarios después de ubicación
    if (memory.lastIntent === 'ubicacion_tienda') {
      if (lowerMessage.includes('hora') || lowerMessage.includes('cuándo') || lowerMessage.includes('abren') || lowerMessage.includes('horario')) {
        return {
          intention: 'horarios_servicio',
          confidence: 0.90, // AUMENTADO de 0.85 a 0.90
          entities: { flow: 'location_to_hours' },
          context: ['secuencial', 'horarios_post_ubicacion']
        };
      }
    }
    
    // Si pregunta sobre delivery después de horarios
    if (memory.lastIntent === 'horarios_servicio') {
      if (lowerMessage.includes('delivery') || lowerMessage.includes('domicilio') || lowerMessage.includes('envío') || lowerMessage.includes('mandan')) {
        return {
          intention: 'delivery_servicio',
          confidence: 0.90, // AUMENTADO de 0.85 a 0.90
          entities: { flow: 'hours_to_delivery' },
          context: ['secuencial', 'delivery_post_hours']
        };
      }
    }
    
    return null;
  }

  /**
   * Análisis de patrones de respuesta MEJORADO
   */
  analyzeResponsePatternsImproved(message, memory, recentContext) {
    const lowerMessage = message.toLowerCase();
    
    // Patrones de cortesía
    if (lowerMessage.includes('muchas gracias') || lowerMessage.includes('muy amable') || lowerMessage.includes('te agradezco')) {
      return {
        intention: 'agradecimiento',
        confidence: 0.98, // AUMENTADO de 0.95 a 0.98
        entities: {},
        context: ['cortesia', 'cierre_positivo']
      };
    }
    
    // Patrones de despedida
    if (lowerMessage.includes('hasta luego') || lowerMessage.includes('nos vemos') || 
        (lowerMessage.includes('adiós') || lowerMessage.includes('chau') || lowerMessage.includes('bye'))) {
      return {
        intention: 'despedida',
        confidence: 0.98, // AUMENTADO de 0.95 a 0.98
        entities: {},
        context: ['cierre', 'despedida_formal']
      };
    }
    
    // Patrones de confirmación
    if (lowerMessage === 'listo' || lowerMessage === 'perfecto' || lowerMessage === 'ok' || 
        lowerMessage === 'bien' || lowerMessage === 'de acuerdo' || lowerMessage === 'aceptado') {
      return {
        intention: 'confirmacion_implicita',
        confidence: 0.95, // AUMENTADO de 0.9 a 0.95
        entities: {},
        context: ['confirmacion', 'satisfaccion']
      };
    }
    
    return null;
  }

  /**
   * Análisis de contexto temporal para mejorar precisión
   */
  analyzeTemporalContext(message, intentName) {
    let score = 0;
    
    // Palabras temporales que indican intención específica
    const temporalIndicators = {
      horarios_servicio: ['ahora', 'actualmente', 'en este momento', 'hoy', 'mañana'],
      delivery_servicio: ['hoy', 'ahora', 'cuanto tiempo', 'cuándo llega'],
      pedido_compra: ['ya', 'inmediato', 'ahora mismo', 'urgente']
    };
    
    const indicators = temporalIndicators[intentName] || [];
    for (const indicator of indicators) {
      if (message.includes(indicator)) {
        score += 8;
        break;
      }
    }
    
    return score;
  }

  /**
   * Análisis de indicadores de urgencia
   */
  analyzeUrgencyIndicators(message) {
    let score = 0;
    
    const urgencyWords = ['urgente', 'rápido', 'inmediato', 'ya', 'ahora mismo', 'pronto'];
    const importanceWords = ['importante', 'necesario', 'imprescindible', 'essential'];
    
    for (const word of urgencyWords) {
      if (message.includes(word)) {
        score += 5;
      }
    }
    
    for (const word of importanceWords) {
      if (message.includes(word)) {
        score += 3;
      }
    }
    
    return Math.min(score, 15);
  }

  /**
   * Análisis de intenciones implícitas
   */
  analyzeImplicitIntent(message, customerPhone, conversationHistory) {
    const implicitIntents = [];
    
    // Intenciones implícitas basadas en patrones sutiles
    if (message.includes('gracias') || message.includes('thank')) {
      implicitIntents.push({
        intention: 'agradecimiento',
        confidence: 0.75,
        entities: {},
        context: ['positivo', 'cierre'],
        implicit: true
      });
    }
    
    if (message.includes('perdón') || message.includes('disculpa') || message.includes('sorry')) {
      implicitIntents.push({
        intention: 'disculpa',
        confidence: 0.8,
        entities: {},
        context: ['negativo', 'correccion'],
        implicit: true
      });
    }
    
    // Buscar confirmaciones o negaciones implícitas
    if (message.match(/^s[ií]$/i) || message.includes('correcto') || message.includes('exacto')) {
      implicitIntents.push({
        intention: 'confirmacion_implicita',
        confidence: 0.85,
        entities: {},
        context: ['afirmacion', 'continuacion'],
        implicit: true
      });
    }
    
    if (message.match(/^no$/i) || message.includes('incorrecto') || message.includes('error')) {
      implicitIntents.push({
        intention: 'negacion_implicita',
        confidence: 0.85,
        entities: {},
        context: ['negacion', 'correccion'],
        implicit: true
      });
    }
    
    return implicitIntents.length > 0 ? implicitIntents[0] : null;
  }

  /**
   * Manejo de multi-intento cuando hay ambigüedad
   */
  handleMultiIntent(intents, message, customerPhone) {
    // Si hay múltiples intenciones con alta confianza, priorizar la más específica
    const specificityOrder = ['pedido_compra', 'consulta_producto', 'comparacion_productos', 'delivery_servicio', 'horarios_servicio'];
    
    for (const intentType of specificityOrder) {
      const foundIntent = intents.find(i => i.intention === intentType);
      if (foundIntent) {
        // Ajustar confianza para reflejar la ambigüedad
        foundIntent.confidence = Math.min(foundIntent.confidence, 0.85);
        foundIntent.multiIntent = true;
        foundIntent.alternativeIntents = intents.filter(i => i.intention !== intentType);
        return foundIntent;
      }
    }
    
    // Si no se puede decidir, devolver la de mayor confianza
    return intents[0];
  }

  /**
   * Análisis contextual basado en historial y memoria mejorado
   */
  async analyzeContextualIntent(message, customerPhone, conversationHistory) {
    const memory = this.getConversationMemory(customerPhone);
    const recentContext = conversationHistory.slice(-5); // Ampliar a 5 mensajes
    
    // Análisis de flujo de conversación
    const conversationFlow = this.analyzeConversationFlow(memory, recentContext, message);
    if (conversationFlow) {
      return conversationFlow;
    }
    
    // Análisis de contexto de productos
    const productContext = this.analyzeProductContext(memory, message);
    if (productContext) {
      return productContext;
    }
    
    // Análisis de contexto temporal
    const temporalContext = this.analyzeTemporalContextInMessage(message, memory);
    if (temporalContext) {
      return temporalContext;
    }
    
    // Análisis de intención implícita por patrones de respuesta
    const responsePattern = this.analyzeResponsePatterns(message, memory, recentContext);
    if (responsePattern) {
      return responsePattern;
    }
    
    return null;
  }

  /**
   * Análisis de flujo de conversación
   */
  analyzeConversationFlow(memory, recentContext, message) {
    const lowerMessage = message.toLowerCase();
    
    // Flujo: consulta_producto → respuesta_afirmativa/negativa
    if (memory.lastIntent === 'consulta_producto') {
      // Respuestas afirmativas
      const affirmativeResponses = ['sí', 'si', 'me interesa', 'perfecto', 'excelente', 'bueno', 'ok', 'vale'];
      if (affirmativeResponses.some(resp => lowerMessage.includes(resp))) {
        return {
          intention: 'confirmacion_producto',
          confidence: 0.9,
          entities: { response: 'positive', flow: 'product_inquiry_continuation' },
          context: ['continuacion_busqueda', 'afirmacion']
        };
      }
      
      // Respuestas negativas
      const negativeResponses = ['no', 'otro', 'diferente', 'más opciones', 'no me gusta'];
      if (negativeResponses.some(resp => lowerMessage.includes(resp))) {
        return {
          intention: 'cambio_producto',
          confidence: 0.85,
          entities: { response: 'negative', flow: 'product_inquiry_change' },
          context: ['nueva_busqueda', 'negacion']
        };
      }
      
      // Números o selección
      if (lowerMessage.match(/^\d+$/)) {
        return {
          intention: 'seleccion_numerica',
          confidence: 0.95,
          entities: { selectedNumber: parseInt(lowerMessage), flow: 'numeric_selection' },
          context: ['seleccion', 'numerico']
        };
      }
    }
    
    // Flujo: pedido_compra → confirmación de cantidad
    if (memory.lastIntent === 'pedido_compra' || memory.lastIntent === 'confirmacion_producto') {
      if (lowerMessage.match(/^\d+$/)) {
        return {
          intention: 'especificar_cantidad',
          confidence: 0.95,
          entities: { quantity: parseInt(lowerMessage), flow: 'order_quantity' },
          context: ['pedido', 'cantidad']
        };
      }
    }
    
    return null;
  }

  /**
   * Análisis de contexto de productos
   */
  analyzeProductContext(memory, message) {
    const lowerMessage = message.toLowerCase();
    
    if (memory.lastProducts && memory.lastProducts.length > 0) {
      const productNames = memory.lastProducts.map(p => p.name.toLowerCase());
      
      // Buscar mención de productos anteriores
      for (const productName of productNames) {
        const productWords = productName.split(' ');
        
        // Coincidencia exacta o parcial significativa
        if (lowerMessage.includes(productName)) {
          return {
            intention: 'seleccion_producto',
            confidence: 0.92,
            entities: { selectedProduct: productName, flow: 'product_mention' },
            context: ['seleccion_desde_lista', 'mencion_directa']
          };
        }
        
        // Coincidencia de palabra clave
        for (const word of productWords) {
          if (word.length > 3 && lowerMessage.includes(word)) {
            return {
              intention: 'seleccion_producto',
              confidence: 0.75,
              entities: { selectedProduct: productName, flow: 'product_keyword' },
              context: ['seleccion_desde_lista', 'mencion_parcial']
            };
          }
        }
      }
      
      // Si menciona "este", "ese", "el primero", etc.
      const demonstratives = ['este', 'ese', 'aquel', 'primero', 'segundo', 'tercero'];
      if (demonstratives.some(demo => lowerMessage.includes(demo))) {
        return {
          intention: 'seleccion_producto',
          confidence: 0.8,
          entities: { selectedProduct: memory.lastProducts[0].name, flow: 'demonstrative_selection' },
          context: ['seleccion_desde_lista', 'demostrativo']
        };
      }
    }
    
    return null;
  }

  /**
   * Análisis de contexto temporal
   */
  analyzeTemporalContextInMessage(message, memory) {
    const lowerMessage = message.toLowerCase();
    
    // Si pregunta sobre horarios después de ubicación
    if (memory.lastIntent === 'ubicacion_tienda') {
      if (lowerMessage.includes('hora') || lowerMessage.includes('cuándo') || lowerMessage.includes('abren')) {
        return {
          intention: 'horarios_servicio',
          confidence: 0.85,
          entities: { flow: 'location_to_hours' },
          context: ['secuencial', 'horarios_post_ubicacion']
        };
      }
    }
    
    // Si pregunta sobre delivery después de horarios
    if (memory.lastIntent === 'horarios_servicio') {
      if (lowerMessage.includes('delivery') || lowerMessage.includes('domicilio') || lowerMessage.includes('envío')) {
        return {
          intention: 'delivery_servicio',
          confidence: 0.85,
          entities: { flow: 'hours_to_delivery' },
          context: ['secuencial', 'delivery_post_hours']
        };
      }
    }
    
    return null;
  }

  /**
   * Análisis de patrones de respuesta
   */
  analyzeResponsePatterns(message, memory, recentContext) {
    const lowerMessage = message.toLowerCase();
    
    // Patrones de cortesía
    if (lowerMessage.includes('muchas gracias') || lowerMessage.includes('muy amable')) {
      return {
        intention: 'agradecimiento',
        confidence: 0.95,
        entities: {},
        context: ['cortesia', 'cierre_positivo']
      };
    }
    
    // Patrones de despedida
    if (lowerMessage.includes('hasta luego') || lowerMessage.includes('nos vemos') || 
        (lowerMessage.includes('adiós') || lowerMessage.includes('chau'))) {
      return {
        intention: 'despedida',
        confidence: 0.95,
        entities: {},
        context: ['cierre', 'despedida_formal']
      };
    }
    
    // Patrones de confirmación
    if (lowerMessage === 'listo' || lowerMessage === 'perfecto' || lowerMessage === 'ok' || lowerMessage === 'bien') {
      return {
        intention: 'confirmacion_implicita',
        confidence: 0.9,
        entities: {},
        context: ['confirmacion', 'satisfaccion']
      };
    }
    
    return null;
  }

  /**
   * Extracción avanzada de entidades
   */
  extractAdvancedEntities(message, matchedPattern = null) {
    const entities = {
      product: null,
      category: null,
      quantity: null,
      unit: null,
      price_range: null,
      urgency: null,
      brand: null
    };
    
    const lowerMessage = message.toLowerCase();
    
    // Extraer productos del catálogo (usa catálogo si ya está cargado, no bloquea)
    if (this.productCatalog && this.productCatalog.length > 0) {
      for (const product of this.productCatalog) {
        const productNames = [product.name.toLowerCase(), ...product.synonyms];
        
        for (const name of productNames) {
          if (lowerMessage.includes(name)) {
            entities.product = product;
            entities.category = product.category.name;
            break;
          }
        }
        
        if (entities.product) break;
      }
    }
    
    // Extraer cantidades
    const quantityMatch = message.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|kilos|g|gramo|gramos|l|litro|litros|unidad|unidades|docena|docenas)?/i);
    if (quantityMatch) {
      entities.quantity = parseFloat(quantityMatch[1]);
      entities.unit = quantityMatch[2] || 'unidad';
    }
    
    // Detectar urgencia
    if (lowerMessage.includes('urgente') || lowerMessage.includes('rápido') || lowerMessage.includes('ahora')) {
      entities.urgency = 'high';
    }
    
    // Detectar rango de precio
    const priceMatch = message.match(/(?:menos de|más de|entre)\s*(?:s\/\s*)?(\d+)/i);
    if (priceMatch) {
      entities.price_range = priceMatch[1];
    }
    
    return entities;
  }

  /**
   * Genera respuesta contextual y adaptativa mejorada
   */
  async generateAdvancedResponse(intent, context, customerPhone) {
    const memory = this.getConversationMemory(customerPhone);
    
    // Actualizar memoria
    this.updateConversationMemory(customerPhone, intent, context);
    
    // Manejo de multi-intento
    if (intent.multiIntent && intent.alternativeIntents) {
      return this.generateMultiIntentResponse(intent, context, memory);
    }
    
    switch (intent.intention) {
      case 'saludo':
        return this.generateSaludoResponse(intent, context, memory);
        
      case 'consulta_producto':
        return await this.generateProductConsultationResponse(intent, context, memory);
        
      case 'comparacion_productos':
        return await this.generateProductComparisonResponse(intent, context, memory);
        
      case 'horarios_servicio':
        return this.generateHorariosResponse(intent, context, memory);
        
      case 'ubicacion_tienda':
        return this.generateUbicacionResponse(intent, context, memory);
        
      case 'delivery_servicio':
        return this.generateDeliveryResponse(intent, context, memory);
        
      case 'pedido_compra':
        return await this.generatePedidoResponse(intent, context, memory);
        
      case 'quejas_sugerencias':
        return this.generateQuejaResponse(intent, context, memory);
        
      case 'despedida':
        return this.generateDespedidaResponse(intent, context, memory);
        
      case 'confirmacion_producto':
        return this.generateConfirmacionResponse(intent, context, memory);
        
      case 'cambio_producto':
        return this.generateCambioProductoResponse(intent, context, memory);
        
      case 'seleccion_producto':
        return this.generateSeleccionProductoResponse(intent, context, memory);
        
      case 'seleccion_numerica':
        return this.generateSeleccionNumericaResponse(intent, context, memory);
        
      case 'especificar_cantidad':
        return this.generateEspecificarCantidadResponse(intent, context, memory);
        
      case 'confirmacion_implicita':
        return this.generateConfirmacionImplicitaResponse(intent, context, memory);
        
      case 'negacion_implicita':
        return this.generateNegacionImplicitaResponse(intent, context, memory);
        
      case 'agradecimiento':
        return this.generateAgradecimientoResponse(intent, context, memory);
        
      case 'disculpa':
        return this.generateDisculpaResponse(intent, context, memory);
        
      default:
        return this.generateUnknownResponse(intent, context, memory);
    }
  }

  /**
   * Genera respuesta para multi-intento
   */
  generateMultiIntentResponse(intent, context, memory) {
    const alternatives = intent.alternativeIntents.map(i => i.intention).join(' o ');
    
    return `
🤔 *Detecté múltiples intenciones en tu mensaje:*

Parece que estás preguntando sobre *${intent.intention}* y también mencionas *${alternatives}*.

💡 ¿Podrías ayudarme a entender mejor? Por ejemplo:
• Si quieres saber sobre ${intent.intention}, dime más detalles
• Si prefieres ${alternatives}, cuéntame qué necesitas

Estoy aquí para ayudarte con lo que necesites. 😊
    `.trim();
  }

  /**
   * Genera respuesta de selección numérica
   */
  generateSeleccionNumericaResponse(intent, context, memory) {
    const selectedNumber = intent.entities.selectedNumber;
    const lastProducts = memory.lastProducts || [];
    
    if (lastProducts.length >= selectedNumber && selectedNumber > 0) {
      const selectedProduct = lastProducts[selectedNumber - 1];
      
      return `
✅ *Seleccionaste opción #${selectedNumber}:*

📦 *${selectedProduct.name}*
💰 Precio: S/ ${selectedProduct.price.toFixed(2)}
📦 Stock: ${selectedProduct.stock} unidades
🏷️ Categoría: ${selectedProduct.category.name}
${selectedProduct.popularity > 50 ? '⭐ Producto popular' : ''}
${selectedProduct.description ? `📝 ${selectedProduct.description}` : ''}

🛒 ¿Qué cantidad te gustaría ordenar? O ¿te gustaría agregarlo a un pedido?
      `.trim();
    }
    
    return `🔢 Seleccionaste #${selectedNumber}, pero no tengo esa opción disponible. ¿Podrías repetir tu elección?`;
  }

  /**
   * Genera respuesta de especificación de cantidad
   */
  generateEspecificarCantidadResponse(intent, context, memory) {
    const quantity = intent.entities.quantity;
    const lastProducts = memory.lastProducts || [];
    
    if (lastProducts.length > 0) {
      const product = lastProducts[0]; // Producto más reciente
      
      if (product.stock >= quantity) {
        return `
📦 *Cantidad confirmada:* ${quantity} unidad${quantity > 1 ? 'es' : ''}

Producto: *${product.name}*
Precio unitario: S/ ${product.price.toFixed(2)}
Total: S/ ${(product.price * quantity).toFixed(2)}
Stock disponible: ${product.stock} unidades

✅ ¿Confirmamos este producto?
💳 ¿Te gustaría agregar algo más al pedido?
        `.trim();
      } else {
        return `😔 Lo siento, solo tenemos ${product.stock} unidades de *${product.name}* disponibles. ¿Quieres esa cantidad o prefieres otro producto?`;
      }
    }
    
    return `📦 Confirmaste ${quantity} unidad${quantity > 1 ? 'es' : ''}. ¿De qué producto?`;
  }

  /**
   * Genera respuesta de confirmación implícita
   */
  generateConfirmacionImplicitaResponse(intent, context, memory) {
    const responses = [
      '✅ ¡Perfecto! Continuemos.',
      '👍 ¡Entendido! ¿Qué sigue?',
      '✅ ¡Listo! ¿En qué más puedo ayudarte?',
      '👌 ¡Confirmado! ¿Qué te gustaría hacer ahora?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Genera respuesta de negación implícita
   */
  generateNegacionImplicitaResponse(intent, context, memory) {
    const responses = [
      '👍 No hay problema. ¿Qué prefieres entonces?',
      '✅ Entendido. ¿Qué otra cosa te gustaría saber?',
      '👌 Perfecto. ¿En qué más puedo ayudarte?',
      '🔄 No te preocupes. ¿Qué necesitas?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Genera respuesta de agradecimiento
   */
  generateAgradecimientoResponse(intent, context, memory) {
    const responses = [
      '😊 ¡Con mucho gusto! ¿En qué más puedo ayudarte?',
      '✨ ¡Es un placer ayudarte! ¿Qué más necesitas?',
      '🙏 ¡Gracias a ti por tu amabilidad! ¿En qué más puedo servirte?',
      '😄 ¡Para eso estoy! ¿Qué más te gustaría saber?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Genera respuesta de disculpa
   */
  generateDisculpaResponse(intent, context, memory) {
    return `
😊 *No te preocupes, está todo bien*

No hay problema en absoluto. A veces pueden haber malentendidos en la conversación.

💡 ¿En qué puedo ayudarte ahora? Estoy aquí para servirte mejor.

🛒 ¿Buscas algún producto específico?
📍 ¿Necesitas información sobre nuestra tienda?
🚚 ¿Te interesa nuestro servicio de delivery?
    `.trim();
  }

  /**
   * Genera respuesta de saludo personalizada con detección de sentimiento
   */
  generateSaludoResponse(intent, context, memory) {
    const hora = new Date().getHours();
    const sentiment = context.sentiment || { sentiment: 'neutral', emotion: 'neutral' };
    let saludo = '¡Hola!';
    
    if (hora < 12) saludo = '¡Buenos días!';
    else if (hora < 18) saludo = '¡Buenas tardes!';
    else saludo = '¡Buenas noches!';
    
    // Ajustar saludo según el sentimiento detectado
    let emotionalTone = '';
    if (sentiment.sentiment === 'positive') {
      emotionalTone = '¡Me alegra verte de buen humor! 😊';
    } else if (sentiment.sentiment === 'negative') {
      emotionalTone = 'Espero poder mejorar tu día. 😊';
    }
    
    if (memory.visitCount && memory.visitCount > 1) {
      return `${saludo} 👋 ¡Bienvenido nuevamente a Supermercado La Inmaculada! ${emotionalTone} ¿En qué puedo ayudarte hoy?`;
    }
    
    return `${saludo} 👋 ¡Bienvenido a Supermercado La Inmaculada! Soy tu asistente virtual. ${emotionalTone} ¿Qué estás buscando hoy?`;
  }

  /**
   * Genera respuesta de consulta de producto con búsqueda inteligente y empatía
   */
  async generateProductConsultationResponse(intent, context, memory) {
    const product = intent.entities.product;
    const sentiment = context.sentiment || { sentiment: 'neutral', emotion: 'neutral' };
    
    // Mensaje empático según el sentimiento
    let empathyMessage = '';
    if (sentiment.sentiment === 'positive') {
      empathyMessage = '😊 ¡Me alegra que estés interesado! ';
    } else if (sentiment.sentiment === 'negative') {
      empathyMessage = '😔 Entiendo tu preocupación, déjame ayudarte. ';
    } else if (sentiment.emotion === 'urgent_neutral') {
      empathyMessage = '⚡ Entiendo que lo necesitas rápido. ';
    }
    
    if (product) {
      // Producto específico encontrado
      const stockEmoji = product.stock > 20 ? '🟢' : product.stock > 5 ? '🟡' : product.stock > 0 ? '🟠' : '🔴';
      const popularidad = product.popularity > 50 ? '⭐ Producto popular' : '';
      
      // Guardar en memoria para contexto futuro
      memory.lastProducts = [product];
      
      return `
${empathyMessage}
📦 *${product.name}*
💰 Precio: S/ ${product.price.toFixed(2)}
${stockEmoji} Stock: ${product.stock} unidades
🏷️ Categoría: ${product.category.name}
${popularidad}
${product.description ? `📝 ${product.description}` : ''}

💡 ¿Te gustaría ordenar este producto o ver algo más?
      `.trim();
    }
    
    // Buscar productos relacionados
    const searchTerm = intent.matchedPattern ? intent.matchedPattern[2] : null;
    if (searchTerm) {
      const relatedProducts = await this.searchRelatedProducts(searchTerm);
      
      if (relatedProducts.length > 0) {
        memory.lastProducts = relatedProducts;
        
        let response = `${empathyMessage}📋 *Encontré ${relatedProducts.length} productos relacionados con "${searchTerm}":*\n\n`;
        
        relatedProducts.forEach((product, index) => {
          const stockEmoji = product.stock > 0 ? '🟢' : '🔴';
          response += `${index + 1}. *${product.name}* - S/ ${product.price.toFixed(2)} ${stockEmoji}\n`;
        });
        
        response += '\n💡 ¿Cuál te interesa? Puedo darte más detalles.';
        return response;
      }
    }
    
    return `${empathyMessage}🔍 No encontré productos con esa descripción. ¿Podrías ser más específico o mencionar la categoría que te interesa?`;
  }

  /**
   * Busca productos relacionados usando búsqueda semántica MEJORADA
   */
  async searchRelatedProducts(searchTerm) {
    // Asegurar que el catálogo esté cargado (lazy-load)
    await this.ensureCatalogLoaded();
    if (!this.productCatalog) return [];
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const relatedProducts = [];
    
    // Búsqueda mejorada con múltiples estrategias
    for (const product of this.productCatalog) {
      const matchScore = this.calculateProductMatchScoreImproved(product, lowerSearchTerm);
      
      if (matchScore > 0.2) { // BAJADO el umbral de 0.3 a 0.2 para más resultados
        relatedProducts.push({ ...product, matchScore });
      }
    }
    
    // Si no hay resultados, intentar búsqueda más amplia
    if (relatedProducts.length === 0) {
      const broadSearchResults = await this.performBroadSearch(lowerSearchTerm);
      relatedProducts.push(...broadSearchResults);
    }
    
    // Ordenar por puntuación de coincidencia y popularidad
    relatedProducts.sort((a, b) => {
      const scoreDiff = b.matchScore - a.matchScore;
      if (scoreDiff !== 0) return scoreDiff;
      return b.popularity - a.popularity;
    });
    
    return relatedProducts.slice(0, 8); // AUMENTADO de 5 a 8 resultados
  }

  /**
   * Búsqueda amplia cuando no hay coincidencias exactas
   */
  async performBroadSearch(searchTerm) {
    // Asegurar que el catálogo esté cargado
    await this.ensureCatalogLoaded();
    const results = [];
    
    // Buscar por categorías
    const categories = this.businessContext.categorias_principales;
    for (const category of categories) {
      if (category.nombre.toLowerCase().includes(searchTerm) || 
          category.descripcion.toLowerCase().includes(searchTerm)) {
        // Buscar productos de esta categoría
        const categoryProducts = (this.productCatalog || []).filter(p => 
          p.category.name.toLowerCase() === category.nombre.toLowerCase()
        );
        
        for (const product of categoryProducts.slice(0, 3)) {
          results.push({ ...product, matchScore: 0.4 });
        }
        break;
      }
    }
    
    // Buscar por palabras clave relacionadas
    const relatedWords = this.getRelatedWords(searchTerm);
    for (const word of relatedWords) {
      const wordMatches = (this.productCatalog || []).filter(p => 
        p.name.toLowerCase().includes(word) || 
        p.synonyms.some(s => s.includes(word))
      );
      
      for (const product of wordMatches.slice(0, 2)) {
        results.push({ ...product, matchScore: 0.3 });
      }
    }
    
    return results;
  }

  /**
   * Obtiene palabras relacionadas para búsqueda amplia
   */
  getRelatedWords(searchTerm) {
    const relatedWords = [];
    
    // Diccionario de palabras relacionadas
    const wordRelations = {
      'comida': ['alimento', 'producto', 'alimenticio'],
      'bebida': ['líquido', 'refresco', 'agua'],
      'fruta': ['fruta fresca', 'producto fresco'],
      'verdura': ['verdura fresca', 'vegetal', 'hortaliza'],
      'carne': ['proteína', 'animal', 'carnico'],
      'pescado': ['marisco', 'producto del mar'],
      'lácteo': ['leche', 'queso', 'yogurt'],
      'grano': ['cereal', 'semilla', 'arroz', 'trigo'],
      'condimento': ['especia', 'saborizante', 'sal'],
      'limpieza': ['aseo', 'higiene', 'jabón']
    };
    
    for (const [key, words] of Object.entries(wordRelations)) {
      if (searchTerm.includes(key)) {
        relatedWords.push(...words);
      }
    }
    
    return [...new Set(relatedWords)];
  }

  /**
   * Calcula puntuación de coincidencia para productos MEJORADO
   */
  calculateProductMatchScoreImproved(product, searchTerm) {
    let score = 0;
    
    // Coincidencia en nombre - AUMENTADO
    if (product.name.toLowerCase().includes(searchTerm)) {
      score += 1.0; // AUMENTADO de 0.8 a 1.0
    }
    
    // Coincidencia en sinónimos - AUMENTADO
    for (const synonym of product.synonyms) {
      if (synonym.includes(searchTerm)) {
        score += 0.8; // AUMENTADO de 0.6 a 0.8
        break;
      }
    }
    
    // Coincidencia en categoría - AUMENTADO
    if (product.category.name.toLowerCase().includes(searchTerm)) {
      score += 0.6; // AUMENTADO de 0.4 a 0.6
    }
    
    // Coincidencia en descripción - AUMENTADO
    if (product.description && product.description.toLowerCase().includes(searchTerm)) {
      score += 0.5; // AUMENTADO de 0.3 a 0.5
    }
    
    // NUEVO: Bonus por popularidad
    if (product.popularity > 50) {
      score += 0.1;
    }
    
    // NUEVO: Bonus por stock disponible
    if (product.stock > 0) {
      score += 0.1;
    }
    
    return Math.min(score, 1.5); // AUMENTADO el máximo de 1.0 a 1.5
  }

  /**
   * Calcula puntuación de coincidencia para productos
   */
  calculateProductMatchScore(product, searchTerm) {
    let score = 0;
    
    // Coincidencia en nombre
    if (product.name.toLowerCase().includes(searchTerm)) {
      score += 0.8;
    }
    
    // Coincidencia en sinónimos
    for (const synonym of product.synonyms) {
      if (synonym.includes(searchTerm)) {
        score += 0.6;
        break;
      }
    }
    
    // Coincidencia en categoría
    if (product.category.name.toLowerCase().includes(searchTerm)) {
      score += 0.4;
    }
    
    // Coincidencia en descripción
    if (product.description && product.description.toLowerCase().includes(searchTerm)) {
      score += 0.3;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * Análisis de sentimiento para detectar emociones del cliente
   */
  analyzeSentiment(message) {
    const lowerMessage = message.toLowerCase();
    
    // Diccionario de palabras positivas
    const positiveWords = [
      'excelente', 'perfecto', 'genial', 'maravilloso', 'fantástico', 'increíble',
      'bueno', 'buena', 'buenísimo', 'buenísimo', 'me encanta', 'me gusta',
      'me encantó', 'me gustó', 'estupendo', 'fenomenal', 'espectacular',
      'súper', 'super', 'chévere', 'chevere', 'bacán', 'bakan', 'padre',
      'gracias', 'thank', 'agradecido', 'agradecida', 'feliz', 'contento',
      'contenta', 'satisfecho', 'satisfecha', 'recomiendo', 'recomendado'
    ];
    
    // Diccionario de palabras negativas
    const negativeWords = [
      'malo', 'mala', 'pésimo', 'pesimo', 'horrible', 'terrible', 'espantoso',
      'espantosa', 'detestable', 'asco', 'asco', 'asco', 'no me gusta',
      'no me gustó', 'no me encanta', 'odio', 'odia', 'detesto', 'detesta',
      'insatisfecho', 'insatisfecha', 'decepcionado', 'decepcionada',
      'frustrado', 'frustrada', 'enojado', 'enojada', 'molesto', 'molesta',
      'irritado', 'irritada', 'problema', 'problemas', 'queja', 'reclamo',
      'defectuoso', 'defectuosa', 'estropeado', 'estropeada', 'dañado',
      'dañada', 'roto', 'rota', 'malo servicio', 'mala atención'
    ];
    
    // Diccionario de palabras neutrales o de duda
    const neutralWords = [
      'regular', 'normal', 'más o menos', 'mas o menos', 'ni fu ni fa',
      'tal vez', 'talvez', 'quizás', 'quizas', 'posiblemente', 'probablemente',
      'no sé', 'no se', 'creo', 'supongo', 'me parece', 'parece'
    ];
    
    // Palabras de urgencia o importancia
    const urgencyWords = [
      'urgente', 'rápido', 'rapido', 'inmediato', 'ya', 'ahora', 'pronto',
      'importante', 'necesario', 'imprescindible', 'essential', 'crítico',
      'critico', 'crítica', 'critica', 'emergencia', 'emergencia'
    ];
    
    // Palabras que indican urgencia negativa
    const negativeUrgencyWords = [
      'ayuda', 'ayuden', 'auxilio', 'socorro', 'emergencia', 'problema',
      'problemas', 'urgente', 'necesito', 'necesita', 'requiero', 'requiere'
    ];
    
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;
    let urgencyScore = 0;
    let negativeUrgencyScore = 0;
    
    // Contar palabras positivas
    for (const word of positiveWords) {
      if (lowerMessage.includes(word)) {
        positiveScore += 1;
      }
    }
    
    // Contar palabras negativas
    for (const word of negativeWords) {
      if (lowerMessage.includes(word)) {
        negativeScore += 1;
      }
    }
    
    // Contar palabras neutrales
    for (const word of neutralWords) {
      if (lowerMessage.includes(word)) {
        neutralScore += 1;
      }
    }
    
    // Contar palabras de urgencia
    for (const word of urgencyWords) {
      if (lowerMessage.includes(word)) {
        urgencyScore += 1;
      }
    }
    
    // Contar palabras de urgencia negativa
    for (const word of negativeUrgencyWords) {
      if (lowerMessage.includes(word)) {
        negativeUrgencyScore += 1;
      }
    }
    
    // Detectar signos de puntuación que indican emoción
    const exclamationCount = (message.match(/!/g) || []).length;
    const questionCount = (message.match(/\?/g) || []).length;
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    
    // Ajustar puntuaciones basadas en signos y mayúsculas
    if (exclamationCount > 1) {
      positiveScore += 0.5;
      negativeScore += 0.3;
    }
    
    if (capsRatio > 0.3) {
      urgencyScore += 1;
      negativeScore += 0.5;
    }
    
    // Determinar el sentimiento predominante
    let sentiment = 'neutral';
    let confidence = 0.5;
    let emotion = 'neutral';
    
    // Regla especial: Si hay urgencia + mayúsculas + sin palabras positivas = negativo urgente
    if (urgencyScore > 0 && capsRatio > 0.3 && positiveScore === 0) {
      sentiment = 'negative';
      confidence = Math.min(0.6 + urgencyScore * 0.2, 0.9);
      emotion = 'negative_urgent';
    }
    // Regla especial para quejas con mayúsculas y exclamación
    else if (negativeScore > 0 && capsRatio > 0.2 && exclamationCount > 1) {
      sentiment = 'negative';
      confidence = Math.min(0.7 + negativeScore * 0.15, 0.95);
      emotion = 'very_negative';
    }
    else if (positiveScore > negativeScore && positiveScore > neutralScore) {
      sentiment = 'positive';
      confidence = Math.min(positiveScore / 3, 0.95);
      
      // Determinar emoción específica
      if (urgencyScore > 0) {
        emotion = 'positive_urgent';
      } else if (positiveScore > 2) {
        emotion = 'very_positive';
      } else {
        emotion = 'positive';
      }
    } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
      sentiment = 'negative';
      confidence = Math.min(negativeScore / 3, 0.95);
      
      // Determinar emoción específica
      if (urgencyScore > 0) {
        emotion = 'negative_urgent';
      } else if (negativeScore > 2) {
        emotion = 'very_negative';
      } else {
        emotion = 'negative';
      }
    } else if (neutralScore > 0) {
      sentiment = 'neutral';
      confidence = Math.min(neutralScore / 2, 0.8);
      emotion = 'neutral';
    }
    
    // Ajustar por urgencia general
    if (urgencyScore > 0 && sentiment === 'neutral') {
      emotion = 'urgent_neutral';
      confidence = Math.max(confidence, 0.6);
    }
    
    return {
      sentiment,
      confidence,
      emotion,
      scores: {
        positive: positiveScore,
        negative: negativeScore,
        neutral: neutralScore,
        urgency: urgencyScore
      }
    };
  }

  /**
   * Sistema de memoria conversacional
   */
  getConversationMemory(customerPhone) {
    if (!this.conversationMemory.has(customerPhone)) {
      this.conversationMemory.set(customerPhone, {
        visitCount: 0,
        lastIntent: null,
        lastProducts: [],
        preferences: {},
        conversationStart: new Date(),
        context: {},
        sentimentHistory: []
      });
    }
    
    return this.conversationMemory.get(customerPhone);
  }

  /**
   * Actualiza la memoria de conversación
   */
  updateConversationMemory(customerPhone, intent, context) {
    const memory = this.getConversationMemory(customerPhone);
    memory.lastIntent = intent.intention;
    memory.visitCount++;
    
    // Guardar preferencias si se detectan
    if (intent.entities.category) {
      memory.preferences[intent.entities.category] = (memory.preferences[intent.entities.category] || 0) + 1;
    }
    
    // Guardar sentimiento del mensaje actual
    if (context.sentiment) {
      memory.lastSentiment = context.sentiment;
      memory.sentimentHistory = memory.sentimentHistory || [];
      memory.sentimentHistory.push({
        sentiment: context.sentiment.sentiment,
        emotion: context.sentiment.emotion,
        confidence: context.sentiment.confidence,
        timestamp: new Date()
      });
      
      // Mantener solo los últimos 10 sentimientos
      if (memory.sentimentHistory.length > 10) {
        memory.sentimentHistory = memory.sentimentHistory.slice(-10);
      }
    }
  }

  /**
   * Sistema de aprendizaje continuo - Aprende de las interacciones
   */
  learnFromInteraction(message, intent, sentiment, customerPhone, feedback = null) {
    try {
      // Crear registro de aprendizaje
      const learningEntry = {
        message: message.toLowerCase(),
        intent: intent.intention,
        confidence: intent.confidence,
        sentiment: sentiment.sentiment,
        emotion: sentiment.emotion,
        timestamp: new Date(),
        customerPhone: customerPhone,
        feedback: feedback,
        success: feedback ? feedback.success : true
      };
      
      // Inicializar sistema de aprendizaje si no existe
      if (!this.learningSystem) {
        this.learningSystem = {
          patterns: new Map(),
          corrections: [],
          improvements: new Map(),
          statistics: {
            totalInteractions: 0,
            successfulInteractions: 0,
            failedInteractions: 0,
            averageConfidence: 0,
            sentimentDistribution: { positive: 0, negative: 0, neutral: 0 }
          }
        };
      }
      
      // Actualizar estadísticas
      this.learningSystem.statistics.totalInteractions++;
      this.learningSystem.statistics.sentimentDistribution[sentiment.sentiment]++;
      
      if (feedback && feedback.success === false) {
        this.learningSystem.statistics.failedInteractions++;
        this.learningSystem.corrections.push(learningEntry);
      } else {
        this.learningSystem.statistics.successfulInteractions++;
      }
      
      // Actualizar confianza promedio
      const stats = this.learningSystem.statistics;
      stats.averageConfidence = ((stats.averageConfidence * (stats.totalInteractions - 1)) + intent.confidence) / stats.totalInteractions;
      
      // Aprender patrones exitosos
      if (intent.confidence > 0.8 && (!feedback || feedback.success !== false)) {
        this.learnSuccessfulPattern(message, intent);
      }
      
      // Aprender de correcciones
      if (feedback && feedback.correctedIntent) {
        this.learnFromCorrection(message, intent, feedback.correctedIntent);
      }
      
      // Mejorar patrones basados en frecuencia
      this.improvePatternsFromFrequency();
      
      // Actualizar memoria con información de aprendizaje
      const memory = this.getConversationMemory(customerPhone);
      memory.learningInteractions = (memory.learningInteractions || 0) + 1;
      memory.lastLearningUpdate = new Date();
      
      console.log(`📚 Aprendizaje registrado: ${intent.intention} (${Math.round(intent.confidence * 100)}%) - Sentimiento: ${sentiment.sentiment}`);
      
    } catch (error) {
      console.error('Error en aprendizaje continuo:', error);
    }
  }
  
  /**
   * Aprende patrones exitosos para mejorar detección futura
   */
  learnSuccessfulPattern(message, intent) {
    const words = message.toLowerCase().split(/\s+/);
    const keyPhrases = this.extractKeyPhrases(message);
    
    // Crear entrada de patrón
    const pattern = {
      words: words,
      keyPhrases: keyPhrases,
      intent: intent.intention,
      confidence: intent.confidence,
      frequency: 1,
      lastUsed: new Date()
    };
    
    // Buscar patrón similar existente
    const patternKey = keyPhrases.join('|');
    if (this.learningSystem.patterns.has(patternKey)) {
      const existing = this.learningSystem.patterns.get(patternKey);
      existing.frequency++;
      existing.lastUsed = new Date();
      existing.confidence = Math.max(existing.confidence, intent.confidence);
    } else {
      this.learningSystem.patterns.set(patternKey, pattern);
    }
  }
  
  /**
   * Aprende de correcciones para no repetir errores
   */
  learnFromCorrection(message, originalIntent, correctedIntent) {
    const correction = {
      message: message.toLowerCase(),
      originalIntent: originalIntent.intention,
      correctedIntent: correctedIntent,
      timestamp: new Date(),
      confidence: originalIntent.confidence
    };
    
    // Agregar a correcciones
    this.learningSystem.corrections.push(correction);
    
    // Actualizar motor de intenciones para evitar repetir el error
    this.updateIntentEngineFromCorrection(correction);
  }
  
  /**
   * Actualiza el motor de intenciones basado en correcciones
   */
  updateIntentEngineFromCorrection(correction) {
    // Si una corrección es frecuente, ajustar los pesos del motor
    const similarCorrections = this.learningSystem.corrections.filter(c => 
      c.originalIntent === correction.originalIntent && 
      c.correctedIntent === correction.correctedIntent
    );
    
    if (similarCorrections.length >= 3) {
      // Ajustar prioridades del motor de intenciones
      if (this.intentEngine.intents[correction.correctedIntent]) {
        this.intentEngine.intents[correction.correctedIntent].priority += 0.5;
        console.log(`🔧 Ajustada prioridad de ${correction.correctedIntent} basado en correcciones frecuentes`);
      }
    }
  }
  
  /**
   * Mejora patrones basados en frecuencia de uso
   */
  improvePatternsFromFrequency() {
    const patterns = Array.from(this.learningSystem.patterns.values());
    
    // Ordenar por frecuencia
    patterns.sort((a, b) => b.frequency - a.frequency);
    
    // Mejorar patrones muy frecuentes
    for (const pattern of patterns.slice(0, 10)) {
      if (pattern.frequency >= 5 && pattern.confidence < 0.95) {
        pattern.confidence = Math.min(pattern.confidence + 0.05, 0.95);
      }
    }
  }
  
  /**
   * Extrae frases clave del mensaje
   */
  extractKeyPhrases(message) {
    const words = message.toLowerCase().split(/\s+/);
    const keyPhrases = [];
    
    // Extraer bigramas y trigramas
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = words[i] + ' ' + words[i + 1];
      keyPhrases.push(bigram);
      
      if (i < words.length - 2) {
        const trigram = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
        keyPhrases.push(trigram);
      }
    }
    
    // Filtrar frases muy comunes
    return keyPhrases.filter(phrase => 
      !['de la', 'en el', 'por la', 'para el', 'con el'].includes(phrase)
    );
  }
  
  /**
   * Obtiene estadísticas de aprendizaje
   */
  getLearningStatistics() {
    if (!this.learningSystem) {
      return {
        totalInteractions: 0,
        successfulInteractions: 0,
        failedInteractions: 0,
        averageConfidence: 0,
        sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
        patternsLearned: 0,
        correctionsMade: 0
      };
    }
    
    const stats = this.learningSystem.statistics;
    return {
      totalInteractions: stats.totalInteractions,
      successfulInteractions: stats.successfulInteractions,
      failedInteractions: stats.failedInteractions,
      averageConfidence: Math.round(stats.averageConfidence * 100) / 100,
      sentimentDistribution: { ...stats.sentimentDistribution },
      patternsLearned: this.learningSystem.patterns.size,
      correctionsMade: this.learningSystem.corrections.length
    };
  }
  
  /**
   * Interfaz principal mejorada con análisis de sentimiento y aprendizaje continuo
   */
  async analyzeMessage(message, customerPhone) {
    try {
      // Obtener historial reciente
      const recentHistory = await this.getRecentConversationHistory(customerPhone);
      
      // Analizar intención
      const intent = await this.analyzeIntent(message, customerPhone, recentHistory);
      
      // Analizar sentimiento del mensaje
      const sentiment = this.analyzeSentiment(message);
      
      // Generar respuesta contextual con sentimiento
      const response = await this.generateAdvancedResponse(intent, { sentiment }, customerPhone);
      
      // Registrar aprendizaje de esta interacción
      this.learnFromInteraction(message, intent, sentiment, customerPhone);
      
      // Buscar productos si es necesario
      let products = [];
      if (intent.intention === 'consulta_producto' || intent.intention === 'seleccion_producto') {
        products = intent.entities.product ? [intent.entities.product] : [];
      }
      
      return {
        intent: intent.intention,
        confidence: Math.round(intent.confidence * 100),
        response: response,
        products: products,
        sentiment: sentiment,
        learningStats: this.getLearningStatistics(),
        context: {
          customerPhone,
          timestamp: new Date().toISOString(),
          intent: intent,
          sentiment: sentiment,
          memory: this.getConversationMemory(customerPhone),
          learning: this.getLearningStatistics()
        }
      };
    } catch (error) {
      console.error('Error en analyzeMessage:', error);
      return {
        intent: 'error',
        confidence: 0,
        response: 'Lo siento, estoy teniendo dificultades para procesar tu mensaje. ¿Podrías intentar de nuevo? 🙏',
        products: [],
        sentiment: { sentiment: 'neutral', confidence: 0, emotion: 'neutral' },
        learningStats: this.getLearningStatistics(),
        context: { customerPhone, timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Genera respuesta de comparación de productos
   */
  async generateProductComparisonResponse(intent, context, memory) {
    const searchTerm = intent.matchedPattern ? intent.matchedPattern[2] : null;
    
    if (!searchTerm) {
      return '🔍 Necesito saber qué productos quieres comparar. Por ejemplo: "¿Cuál es mejor entre el arroz Costeño y el arroz Primor?"';
    }
    
    // Buscar productos relacionados
    const relatedProducts = await this.searchRelatedProducts(searchTerm);
    
    if (relatedProducts.length >= 2) {
      const [product1, product2] = relatedProducts.slice(0, 2);
      
      return `
🔍 *Comparación de Productos*

📦 *${product1.name}*
💰 Precio: S/ ${product1.price.toFixed(2)}
📦 Stock: ${product1.stock} unidades
🏷️ Categoría: ${product1.category.name}
${product1.popularity > 50 ? '⭐ Producto popular' : ''}

📦 *${product2.name}*
💰 Precio: S/ ${product2.price.toFixed(2)}
📦 Stock: ${product2.stock} unidades
🏷️ Categoría: ${product2.category.name}
${product2.popularity > 50 ? '⭐ Producto popular' : ''}

💡 ¿Cuál prefieres? O ¿quiero ver más opciones?
      `.trim();
    }
    
    if (relatedProducts.length === 1) {
      const product = relatedProducts[0];
      return `📦 Encontré *${product.name}* a S/ ${product.price.toFixed(2)}. ¿Quieres compararlo con algún otro producto específico?`;
    }
    
    return '🔍 No encontré productos similares para comparar. ¿Podrías ser más específico con los nombres de los productos?';
  }

  /**
   * Genera respuesta de pedido/compra
   */
  async generatePedidoResponse(intent, context, memory) {
    const product = intent.entities.product;
    const quantity = intent.entities.quantity || 1;
    const unit = intent.entities.unit || 'unidad';
    
    if (product) {
      if (product.stock >= quantity) {
        // Guardar en memoria temporal del pedido
        memory.currentOrder = memory.currentOrder || [];
        memory.currentOrder.push({
          product: product,
          quantity: quantity,
          unit: unit,
          subtotal: product.price * quantity
        });
        
        return `
🛒 *Producto agregado al pedido:*

📦 *${product.name}*
📋 Cantidad: ${quantity} ${unit}${quantity > 1 ? 's' : ''}
💰 Precio unitario: S/ ${product.price.toFixed(2)}
💰 Subtotal: S/ ${(product.price * quantity).toFixed(2)}
📦 Stock disponible: ${product.stock} unidades

✅ ¿Deseas agregar algo más a tu pedido?
💳 Para confirmar el pedido completo, escribe "confirmar pedido"
❌ Para cancelar, escribe "cancelar pedido"
        `.trim();
      } else {
        return `😔 Lo siento, solo tenemos ${product.stock} unidades de *${product.name}* en stock. ¿Quieres esa cantidad o prefieres otro producto?`;
      }
    }
    
    // Si no hay producto específico, buscar coincidencias
    const searchTerm = intent.matchedPattern ? intent.matchedPattern[2] : null;
    if (searchTerm) {
      const relatedProducts = await this.searchRelatedProducts(searchTerm);
      
      if (relatedProducts.length > 0) {
        memory.lastProducts = relatedProducts;
        
        let response = `🛒 *Productos disponibles para "${searchTerm}":*

`;
        
        relatedProducts.forEach((product, index) => {
          const stockEmoji = product.stock > 0 ? '🟢' : '🔴';
          response += `${index + 1}. *${product.name}* - S/ ${product.price.toFixed(2)} ${stockEmoji}\n`;
        });
        
        response += '\n💡 Para pedir, escribe: "quiero [número]" o el nombre del producto';
        return response;
      }
    }
    
    return '🛒 ¿Qué producto te gustaría pedir? Puedes decirme el nombre o buscar en nuestro catálogo.';
  }

  /**
   * Genera respuesta de confirmación de producto
   */
  generateConfirmacionResponse(intent, context, memory) {
    const lastProducts = memory.lastProducts || [];
    
    if (lastProducts.length > 0) {
      const product = lastProducts[0]; // Tomar el primer producto de la lista
      
      return `
✅ *Excelente elección!*

📦 *${product.name}*
💰 Precio: S/ ${product.price.toFixed(2)}
📦 Stock: ${product.stock} unidades
🏷️ Categoría: ${product.category.name}

🛒 ¿Qué cantidad te gustaría ordenar? (escribe el número)
💳 También puedo ayudarte con el proceso de compra.
      `.trim();
    }
    
    return '✅ ¡Perfecto! ¿Qué te gustaría hacer a continuación?';
  }

  /**
   * Genera respuesta de cambio de producto
   */
  generateCambioProductoResponse(intent, context, memory) {
    const lastProducts = memory.lastProducts || [];
    
    if (lastProducts.length > 1) {
      // Mostrar más opciones si hay
      const remainingProducts = lastProducts.slice(1); // Excluir el primero
      
      let response = '🔄 *Otras opciones disponibles:*\n\n';
      
      remainingProducts.forEach((product, index) => {
        const stockEmoji = product.stock > 0 ? '🟢' : '🔴';
        response += `${index + 1}. *${product.name}* - S/ ${product.price.toFixed(2)} ${stockEmoji}\n`;
      });
      
      response += '\n💡 ¿Alguno de estos te interesa? O dime qué otro producto buscas.';
      return response;
    }
    
    return '🔄 No hay problema. ¿Qué otro producto te gustaría buscar? Puedo ayudarte a encontrar lo que necesitas.';
  }

  /**
   * Genera respuesta de selección de producto
   */
  generateSeleccionProductoResponse(intent, context, memory) {
    const selectedProduct = intent.entities.selectedProduct;
    const lastProducts = memory.lastProducts || [];
    
    // Buscar el producto seleccionado en la lista
    const product = lastProducts.find(p => 
      p.name.toLowerCase().includes(selectedProduct) || 
      selectedProduct.includes(p.name.toLowerCase())
    );
    
    if (product) {
      return `
✅ *Producto seleccionado:*

📦 *${product.name}*
💰 Precio: S/ ${product.price.toFixed(2)}
📦 Stock: ${product.stock} unidades
🏷️ Categoría: ${product.category.name}
${product.popularity > 50 ? '⭐ Producto popular' : ''}
${product.description ? `📝 ${product.description}` : ''}

🛒 ¿Qué cantidad necesitas? O ¿te gustaría agregarlo a un pedido?
      `.trim();
    }
    
    return '✅ ¡Producto seleccionado! ¿Qué cantidad te gustaría ordenar?';
  }

  /**
   * Genera respuesta de queja/sugerencia con empatía según sentimiento
   */
  generateQuejaResponse(intent, context, memory) {
    const sentiment = context.sentiment || { sentiment: 'negative', emotion: 'negative' };
    
    // Respuestas empáticas según el nivel de negatividad
    let empathyHeader = '';
    if (sentiment.emotion === 'very_negative') {
      empathyHeader = '😔 *Lamentamos profundamente tu experiencia*\n\nEntiendo que estás muy molesto/a y tienes toda la razón de sentirte así.';
    } else if (sentiment.emotion === 'negative_urgent') {
      empathyHeader = '😔 *Lamentamos mucho tu experiencia*\n\nVeo que estás preocupado/a y necesitas una solución urgente.';
    } else {
      empathyHeader = '😔 *Lamentamos mucho tu experiencia*\n\nTu opinión es muy importante para nosotros y nos ayuda a mejorar.';
    }
    
    return `
${empathyHeader}

📞 *¿Podrías contactarte directamente con nosotros?*
• WhatsApp: +51 942 123 456
• Teléfono: (042) 52-1234
• Email: info@lainmaculada.com

📝 También puedes visitarnos en la tienda:
📍 Jr. San Martín 245, Tarapoto

Nuestro equipo de atención al cliente te ayudará a resolver cualquier problema. ¡Gracias por tu paciencia! 🙏
    `.trim();
  }

  /**
   * Métodos auxiliares para otros tipos de respuestas
   */
  generateHorariosResponse(intent, context, memory) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    let horarioActual;
    if (dayOfWeek === 0) { // Domingo
      horarioActual = this.businessContext.horarios.domingo;
    } else {
      horarioActual = this.businessContext.horarios.lunes_viernes;
    }
    
    const openTime = this.timeToMinutes(horarioActual.abre);
    const closeTime = this.timeToMinutes(horarioActual.cierra);
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    
    const statusEmoji = isOpen ? '🟢' : '🔴';
    const statusText = isOpen ? '¡Estamos abiertos ahora!' : 'Estamos cerrados';
    
    return `
${statusEmoji} ${statusText}

🕐 Horario de atención:
• Lunes a Sábado: 7:00 AM - 9:00 PM
• Domingos: 8:00 AM - 2:00 PM
• Festivos: 8:00 AM - 1:00 PM

📍 Jr. San Martín 245, Tarapoto
☎️ (042) 52-1234
    `.trim();
  }

  generateUbicacionResponse(intent, context, memory) {
    return `
📍 *Ubicación de La Inmaculada*

🏪 Estamos en: Jr. San Martín 245, Tarapoto
📍 Referencia: Frente a la Plaza de Armas
🚌 Paradero más cercano: Plaza de Armas

🚗 *Como llegar:*
• Desde el terminal: 5 minutos en mototaxi
• Desde el aeropuerto: 15 minutos en taxi
• Estacionamiento gratuito para clientes

📱 ¿Necesitas delivery? ¡Te llevamos tus compras a domicilio!
    `.trim();
  }

  generateDeliveryResponse(intent, context, memory) {
    return `
🚚 *Servicio de Delivery La Inmaculada*

📍 Zonas de cobertura:
• Centro de Tarapoto: S/ 5.00 (30-45 min)
• Banda de Shilcayo: S/ 8.00 (45-60 min)
• Morales: S/ 8.00 (45-60 min)

💳 Formas de pago:
• Efectivo contra entrega
• Tarjeta débito/crédito
• Yape / Plin

📱 Para hacer tu pedido:
• WhatsApp: +51 942 123 456
• Llámanos: (042) 52-1234

🕐 Horario de delivery: Mismo horario de tienda
    `.trim();
  }

  generateDespedidaResponse(intent, context, memory) {
    const visitas = memory.visitCount || 1;
    const mensajePersonalizado = visitas > 3 ? 
      '¡Gracias por tu fidelidad! Eres un cliente muy valioso para nosotros.' :
      '¡Gracias por visitarnos!';
    
    return `${mensajePersonalizado} 😊

🛒 ¡Vuelve pronto a Supermercado La Inmaculada!
📍 Jr. San Martín 245, Tarapoto
📱 WhatsApp: +51 942 123 456

¡Que tengas un excelente día! 🌟`;
  }

  generateUnknownResponse(intent, context, memory) {
    return `🤔 No estoy seguro de entender tu pregunta.

💡 ¿Podrías ayudarme con una de estas opciones?
• Productos que tenemos disponibles
• Nuestros horarios de atención
• Servicio de delivery
• Nuestra ubicación

O simplemente dime qué producto buscas y te ayudo a encontrarlo. 😊`;
  }

  /**
   * Métodos auxiliares
   */
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  async getRecentConversationHistory(customerPhone) {
    // Obtener últimos mensajes de la conversación
    try {
      const conversation = await prisma.whatsappConversation.findFirst({
        where: {
          customerPhone: customerPhone,
          status: 'OPEN'
        },
        include: {
          messages: {
            orderBy: { timestamp: 'desc' },
            take: 5
          }
        }
      });
      
      return conversation ? conversation.messages.reverse() : [];
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  }
}

// Crear instancia única y exportar
const aiService = new AdvancedAIService();

module.exports = {
  analyzeMessage: aiService.analyzeMessage.bind(aiService),
  analyzeIntent: aiService.analyzeIntent.bind(aiService),
  generateAdvancedResponse: aiService.generateAdvancedResponse.bind(aiService),
  AdvancedAIService: AdvancedAIService
};