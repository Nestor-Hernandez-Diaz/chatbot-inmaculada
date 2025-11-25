// Test avanzado para el motor de IA mejorado
const { AdvancedAIService } = require('../services/ai-advanced.service');

class AIAdvancedTest {
  constructor() {
    this.aiService = new AdvancedAIService();
    this.testResults = [];
    this.conversationHistory = [];
  }

  async runComprehensiveTest() {
    console.log('🚀 Iniciando pruebas comprehensivas del motor de IA avanzado...\n');
    
    await this.testBasicIntents();
    await this.testContextualUnderstanding();
    await this.testProductSearch();
    await this.testConversationFlow();
    await this.testMultiIntentHandling();
    await this.testEdgeCases();
    
    this.generateReport();
  }

  async testBasicIntents() {
    console.log('📋 TEST 1: Intenciones Básicas');
    console.log('='.repeat(50));
    
    const testCases = [
      { message: 'Hola', expected: 'saludo' },
      { message: 'Buenos días', expected: 'saludo' },
      { message: '¿Tienen leche?', expected: 'consulta_producto' },
      { message: 'Cuánto cuesta el arroz?', expected: 'consulta_producto' },
      { message: '¿Cuál es mejor entre pollo y res?', expected: 'comparacion_productos' },
      { message: 'A qué hora abren?', expected: 'horarios_servicio' },
      { message: 'Dónde están ubicados?', expected: 'ubicacion_tienda' },
      { message: 'Hacen delivery?', expected: 'delivery_servicio' },
      { message: 'Quiero pedir pollo', expected: 'pedido_compra' },
      { message: 'Adiós', expected: 'despedida' },
      { message: 'Gracias', expected: 'agradecimiento' },
      { message: 'Lo siento', expected: 'disculpa' }
    ];

    for (const testCase of testCases) {
      const result = await this.aiService.analyzeMessage(testCase.message, '+51999999999');
      const passed = result.intent === testCase.expected;
      const confidence = result.confidence;
      
      this.testResults.push({
        test: 'Basic Intent',
        message: testCase.message,
        expected: testCase.expected,
        actual: result.intent,
        passed,
        confidence,
        details: result.context
      });

      console.log(`Mensaje: "${testCase.message}"`);
      console.log(`Esperado: ${testCase.expected} | Detectado: ${result.intent} | Confianza: ${confidence}%`);
      console.log(`Estado: ${passed ? '✅' : '❌'}`);
      console.log('---');
    }
  }

  async testContextualUnderstanding() {
    console.log('\n🧠 TEST 2: Comprensión Contextual');
    console.log('='.repeat(50));
    
    // Simular conversación con contexto
    const conversation = [
      { message: 'Hola', phone: '+51999000001' },
      { message: '¿Tienen leche?', phone: '+51999000001' },
      { message: 'Sí, me interesa', phone: '+51999000001' }, // Contextual
      { message: 'No, otro producto', phone: '+51999000002' }, // Contextual
      { message: '1', phone: '+51999000003' }, // Selección numérica
      { message: '5', phone: '+51999000004' }, // Cantidad
      { message: 'Perfecto', phone: '+51999000005' }, // Confirmación implícita
      { message: 'Listo', phone: '+51999000006' } // Confirmación implícita
    ];

    for (const turn of conversation) {
      const result = await this.aiService.analyzeMessage(turn.message, turn.phone);
      
      this.testResults.push({
        test: 'Contextual Understanding',
        message: turn.message,
        expected: 'contextual',
        actual: result.intent,
        passed: this.isContextualIntent(result.intent),
        confidence: result.confidence,
        details: result.context
      });

      console.log(`Mensaje: "${turn.message}"`);
      console.log(`Detectado: ${result.intent} | Confianza: ${result.confidence}%`);
      console.log(`Contexto: ${JSON.stringify(result.context)}`);
      console.log(`Estado: ${this.isContextualIntent(result.intent) ? '✅' : '❌'}`);
      console.log('---');
    }
  }

  async testProductSearch() {
    console.log('\n🔍 TEST 3: Búsqueda de Productos');
    console.log('='.repeat(50));
    
    const searchQueries = [
      'leche',
      'arroz costeño',
      'pollo fresco',
      'productos lácteos',
      'granos',
      'carne',
      'verduras frescas'
    ];

    for (const query of searchQueries) {
      const result = await this.aiService.analyzeMessage(`¿Tienen ${query}?`, '+51999000007');
      const hasProducts = result.products && result.products.length > 0;
      
      this.testResults.push({
        test: 'Product Search',
        message: query,
        expected: 'consulta_producto',
        actual: result.intent,
        passed: result.intent === 'consulta_producto' && hasProducts,
        confidence: result.confidence,
        productsFound: result.products ? result.products.length : 0
      });

      console.log(`Búsqueda: "${query}"`);
      console.log(`Detectado: ${result.intent} | Confianza: ${result.confidence}%`);
      console.log(`Productos encontrados: ${result.products ? result.products.length : 0}`);
      console.log(`Estado: ${(result.intent === 'consulta_producto' && hasProducts) ? '✅' : '❌'}`);
      console.log('---');
    }
  }

  async testConversationFlow() {
    console.log('\n💬 TEST 4: Flujo de Conversación');
    console.log('='.repeat(50));
    
    const flows = [
      {
        name: 'Product Inquiry Flow',
        messages: [
          '¿Tienen leche?',
          'Sí, me interesa',
          '2',
          'Perfecto'
        ]
      },
      {
        name: 'Location to Hours Flow',
        messages: [
          '¿Dónde están?',
          '¿A qué hora abren?',
          'Gracias'
        ]
      },
      {
        name: 'Order Flow',
        messages: [
          'Quiero pedir arroz',
          '5 kilos',
          'Confirmar'
        ]
      }
    ];

    for (const flow of flows) {
      console.log(`\n--- ${flow.name} ---`);
      let phone = `+51999${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      for (const message of flow.messages) {
        const result = await this.aiService.analyzeMessage(message, phone);
        
        this.testResults.push({
          test: 'Conversation Flow',
          flow: flow.name,
          message,
          intent: result.intent,
          confidence: result.confidence,
          context: result.context
        });

        console.log(`"${message}" → ${result.intent} (${result.confidence}%)`);
      }
    }
  }

  async testMultiIntentHandling() {
    console.log('\n🎯 TEST 5: Manejo de Multi-Intento');
    console.log('='.repeat(50));
    
    const multiIntentMessages = [
      'Hola, ¿tienen leche y a qué hora abren?',
      'Quiero pedir pollo y también saber cuánto cuesta el delivery',
      'Buenos días, ¿dónde están y cuál es mejor el arroz o el azúcar?'
    ];

    for (const message of multiIntentMessages) {
      const result = await this.aiService.analyzeMessage(message, '+51999000008');
      
      this.testResults.push({
        test: 'Multi-Intent Handling',
        message,
        intent: result.intent,
        confidence: result.confidence,
        isMultiIntent: result.context && result.context.intent && result.context.intent.multiIntent,
        details: result.context
      });

      console.log(`Mensaje: "${message}"`);
      console.log(`Intención principal: ${result.intent} (${result.confidence}%)`);
      console.log(`Multi-intento: ${(result.context && result.context.intent && result.context.intent.multiIntent) ? '✅' : '❌'}`);
      console.log('---');
    }
  }

  async testEdgeCases() {
    console.log('\n⚡ TEST 6: Casos Edge');
    console.log('='.repeat(50));
    
    const edgeCases = [
      '', // Vacío
      '   ', // Espacios
      '123', // Números
      '!@#$%', // Caracteres especiales
      'Hola cómo estás quiero saber si tienen leche por favor', // Muy largo
      'Leche?', // Muy corto
      'No entiendo nada', // Confuso
      'Quiero esto y aquello y también lo otro' // Múltiple pero ambiguo
    ];

    for (const message of edgeCases) {
      const result = await this.aiService.analyzeMessage(message, '+51999000009');
      
      this.testResults.push({
        test: 'Edge Cases',
        message: message || '[vacío]',
        intent: result.intent,
        confidence: result.confidence,
        response: result.response
      });

      console.log(`Mensaje: "${message || '[vacío]'}"`);
      console.log(`Detectado: ${result.intent} (${result.confidence}%)`);
      console.log(`Respuesta: ${result.response.substring(0, 100)}...`);
      console.log('---');
    }
  }

  isContextualIntent(intent) {
    const contextualIntents = [
      'confirmacion_producto', 'cambio_producto', 'seleccion_producto',
      'seleccion_numerica', 'especificar_cantidad', 'confirmacion_implicita',
      'negacion_implicita', 'agradecimiento', 'disculpa'
    ];
    return contextualIntents.includes(intent);
  }

  generateReport() {
    console.log('\n📊 REPORTE FINAL DE PRUEBAS');
    console.log('='.repeat(60));
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed !== false).length;
    const accuracy = (passedTests / totalTests * 100).toFixed(1);
    
    console.log(`Total de pruebas: ${totalTests}`);
    console.log(`Pruebas exitosas: ${passedTests}`);
    console.log(`Precisión general: ${accuracy}%`);
    
    // Análisis por categoría
    const categories = {};
    this.testResults.forEach(result => {
      const category = result.test;
      if (!categories[category]) {
        categories[category] = { total: 0, passed: 0 };
      }
      categories[category].total++;
      if (result.passed !== false) {
        categories[category].passed++;
      }
    });
    
    console.log('\n📈 Análisis por categoría:');
    for (const [category, data] of Object.entries(categories)) {
      const categoryAccuracy = (data.passed / data.total * 100).toFixed(1);
      console.log(`  ${category}: ${categoryAccuracy}% (${data.passed}/${data.total})`);
    }
    
    // Análisis de confianza
    const confidences = this.testResults.map(t => t.confidence).filter(c => c !== undefined);
    const avgConfidence = (confidences.reduce((a, b) => a + b, 0) / confidences.length).toFixed(1);
    const highConfidence = confidences.filter(c => c >= 80).length;
    
    console.log(`\n🎯 Análisis de confianza:`);
    console.log(`  Confianza promedio: ${avgConfidence}%`);
    console.log(`  Alta confianza (≥80%): ${highConfidence}/${confidences.length} (${(highConfidence/confidences.length*100).toFixed(1)}%)`);
    
    // Recomendaciones
    console.log('\n💡 Recomendaciones:');
    if (accuracy < 70) {
      console.log('  ⚠️  La precisión es baja. Considerar ajustar los patrones de intención.');
    } else if (accuracy < 85) {
      console.log('  ⚡ Buena precisión, pero hay margen de mejora en patrones específicos.');
    } else {
      console.log('  ✅ Excelente precisión. El sistema está funcionando muy bien.');
    }
    
    if (avgConfidence < 70) {
      console.log('  📊 Considerar mejorar el sistema de confianza y reducir falsos positivos.');
    }
    
    console.log('\n🎉 Pruebas completadas exitosamente.');
  }
}

// Ejecutar pruebas
const tester = new AIAdvancedTest();
tester.runComprehensiveTest().catch(console.error);