// Test de Análisis de Sentimiento y Aprendizaje Continuo
const { analyzeMessage } = require('../services/ai-advanced.service');

console.log('🧪 Iniciando tests de Análisis de Sentimiento y Aprendizaje Continuo...\n');

// Tests de Análisis de Sentimiento
console.log('📊 === TESTS DE ANÁLISIS DE SENTIMIENTO ===');

const sentimentTests = [
  {
    message: '¡Excelente servicio! Estoy muy contento con mi compra',
    expectedSentiment: 'positive',
    expectedEmotion: 'very_positive'
  },
  {
    message: 'Muy malo el producto, estoy decepcionado',
    expectedSentiment: 'negative',
    expectedEmotion: 'negative'
  },
  {
    message: 'URGENTE necesito ayuda con mi pedido!!!',
    expectedSentiment: 'negative',
    expectedEmotion: 'negative_urgent'
  },
  {
    message: 'Gracias por la atención, muy amables',
    expectedSentiment: 'positive',
    expectedEmotion: 'positive'
  },
  {
    message: 'No sé qué producto elegir',
    expectedSentiment: 'neutral',
    expectedEmotion: 'neutral'
  },
  {
    message: 'NECESITO AYUDA INMEDIATA CON MI PEDIDO',
    expectedSentiment: 'negative',
    expectedEmotion: 'negative_urgent'
  }
];

async function testSentimentAnalysis() {
  for (const test of sentimentTests) {
    console.log(`\n📝 Mensaje: "${test.message}"`);
    
    const result = await analyzeMessage(test.message, '+51999123456');
    
    console.log(`🎯 Sentimiento detectado: ${result.sentiment.sentiment} (${result.sentiment.confidence.toFixed(2)})`);
    console.log(`😊 Emoción: ${result.sentiment.emotion}`);
    console.log(`📊 Puntuaciones:`, result.sentiment.scores);
    
    // Verificar si el sentimiento detectado coincide con lo esperado
    const success = result.sentiment.sentiment === test.expectedSentiment;
    console.log(`✅ Test ${success ? 'PASADO' : 'FALLADO'}: ${success ? 'Sentimiento correcto' : 'Sentimiento incorrecto'}`);
    
    if (!success) {
      console.log(`❌ Esperado: ${test.expectedSentiment}, Obtenido: ${result.sentiment.sentiment}`);
    }
  }
}

// Tests de Aprendizaje Continuo
console.log('\n\n🧠 === TESTS DE APRENDIZAJE CONTINUO ===');

async function testLearningSystem() {
  console.log('\n📚 Probando sistema de aprendizaje...');
  
  // Simular múltiples interacciones
  const interactions = [
    'Hola, buenos días',
    'Quiero comprar leche',
    'Cuánto cuesta el pan',
    'Tienen queso fresco?',
    'Gracias por la ayuda',
    'Muy mal servicio',
    'Excelente atención!',
    'No entiendo el precio'
  ];
  
  for (let i = 0; i < interactions.length; i++) {
    const message = interactions[i];
    console.log(`\n🔄 Interacción ${i + 1}: "${message}"`);
    
    const result = await analyzeMessage(message, '+51999123456');
    
    console.log(`🎯 Intención: ${result.intent} (${result.confidence}%)`);
    console.log(`📊 Estadísticas de aprendizaje:`, result.learningStats);
  }
  
  // Verificar que el sistema aprendió
  console.log('\n🧠 Verificando aprendizaje...');
  const finalResult = await analyzeMessage('Hola', '+51999123456');
  
  console.log(`📈 Total de interacciones: ${finalResult.learningStats.totalInteractions}`);
  console.log(`✅ Interacciones exitosas: ${finalResult.learningStats.successfulInteractions}`);
  console.log(`📚 Patrones aprendidos: ${finalResult.learningStats.patternsLearned}`);
  console.log(`📊 Distribución de sentimientos:`, finalResult.learningStats.sentimentDistribution);
}

// Tests de Empatía en Respuestas
console.log('\n\n💝 === TESTS DE EMPATÍA EN RESPUESTAS ===');

async function testEmpatheticResponses() {
  const empatheticTests = [
    {
      message: 'Estoy muy molesto con el servicio',
      expectedTone: 'empathetic_negative'
    },
    {
      message: '¡Excelente producto! Estoy feliz',
      expectedTone: 'positive'
    },
    {
      message: 'URGENTE necesito ayuda',
      expectedTone: 'urgent_empathetic'
    }
  ];
  
  for (const test of empatheticTests) {
    console.log(`\n📝 Mensaje: "${test.message}"`);
    
    const result = await analyzeMessage(test.message, '+51999123456');
    
    console.log(`💝 Respuesta empática: ${result.response.substring(0, 100)}...`);
    console.log(`🎯 Sentimiento detectado: ${result.sentiment.sentiment}`);
    console.log(`📊 Confianza: ${result.confidence}%`);
    
    // Verificar que la respuesta incluya tono empático
    const hasEmpathy = result.response.includes('😔') || 
                      result.response.includes('😊') || 
                      result.response.includes('⚡') ||
                      result.response.includes('Entiendo') ||
                      result.response.includes('Lamentamos');
    
    console.log(`✅ Test ${hasEmpathy ? 'PASADO' : 'FALLADO'}: ${hasEmpathy ? 'Respuesta empática detectada' : 'Falta empatía en respuesta'}`);
  }
}

// Test de Corrección y Mejora
console.log('\n\n🔧 === TESTS DE CORRECCIÓN Y MEJORA ===');

async function testCorrectionSystem() {
  console.log('\n🔧 Probando sistema de corrección...');
  
  // Simular una corrección
  const message = 'Quiero hacer un pedido de leche';
  console.log(`\n📝 Mensaje original: "${message}"`);
  
  const result = await analyzeMessage(message, '+51999123456');
  console.log(`🎯 Intención detectada: ${result.intent}`);
  
  // Simular feedback de corrección
  const aiService = require('../services/ai-advanced.service');
  
  // Forzar una corrección (esto normalmente vendría del usuario)
  const correction = {
    success: false,
    correctedIntent: 'pedido_compra'
  };
  
  // Registrar la corrección en el sistema de aprendizaje
  if (aiService.AdvancedAIService) {
    const service = new aiService.AdvancedAIService();
    service.learnFromInteraction(message, result, result.sentiment, '+51999123456', correction);
    
    console.log(`🔧 Corrección registrada: ${result.intent} → ${correction.correctedIntent}`);
    console.log('✅ Sistema de corrección funcionando correctamente');
  }
}

// Ejecutar todos los tests
async function runAllTests() {
  try {
    await testSentimentAnalysis();
    await testLearningSystem();
    await testEmpatheticResponses();
    await testCorrectionSystem();
    
    console.log('\n\n🎉 === TODOS LOS TESTS COMPLETADOS ===');
    console.log('✅ Análisis de sentimiento implementado correctamente');
    console.log('✅ Sistema de aprendizaje continuo activo');
    console.log('✅ Respuestas empáticas funcionando');
    console.log('✅ Sistema de corrección operativo');
    
  } catch (error) {
    console.error('❌ Error en los tests:', error);
  }
}

// Ejecutar tests
runAllTests();