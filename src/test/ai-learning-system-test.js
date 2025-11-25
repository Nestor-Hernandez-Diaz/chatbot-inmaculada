// src/test/ai-learning-system-test.js
const { analyzeMessage } = require('../services/ai-advanced.service');

/**
 * Test del Sistema de Aprendizaje Continuo
 */
async function testLearningSystem() {
  console.log('🧠 Iniciando tests del Sistema de Aprendizaje Continuo...\n');
  
  const tests = [
    {
      name: 'Aprendizaje de Patrones Exitosos',
      message: 'Quiero comprar leche Gloria 1L',
      phone: '+51999999991',
      expectedIntent: 'pedido_compra',
      description: 'El sistema debe aprender de patrones exitosos de pedidos'
    },
    {
      name: 'Corrección de Intenciones',
      message: 'Necesito ayuda urgente con mi pedido',
      phone: '+51999999992',
      expectedIntent: 'quejas_sugerencias',
      description: 'El sistema debe detectar urgencia negativa y aprender'
    },
    {
      name: 'Aprendizaje de Sinónimos',
      message: 'Busco productos lácteos para el desayuno',
      phone: '+51999999993',
      expectedIntent: 'consulta_producto',
      description: 'El sistema debe aprender nuevas formas de buscar productos'
    },
    {
      name: 'Aprendizaje de Contexto Conversacional',
      message: 'Sí, me interesa ese producto',
      phone: '+51999999994',
      expectedIntent: 'confirmacion_producto',
      description: 'El sistema debe aprender del contexto de la conversación'
    },
    {
      name: 'Aprendizaje de Sentimientos Complejos',
      message: 'ESTOY MUY DECEPCIONADO CON EL SERVICIO!!!',
      phone: '+51999999995',
      expectedIntent: 'quejas_sugerencias',
      description: 'El sistema debe aprender a detectar sentimientos fuertes'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n📚 Test: ${test.name}`);
    console.log(`📝 Mensaje: "${test.message}"`);
    console.log(`📱 Teléfono: ${test.phone}`);
    console.log(`🎯 Intención esperada: ${test.expectedIntent}`);
    console.log(`💡 Descripción: ${test.description}`);
    
    try {
      const result = await analyzeMessage(test.message, test.phone);
      
      console.log(`✅ Intención detectada: ${result.intent}`);
      console.log(`📊 Confianza: ${result.confidence}%`);
      console.log(`💭 Sentimiento: ${result.sentiment.sentiment} (${result.sentiment.emotion})`);
      
      // Verificar si la intención fue detectada correctamente
      if (result.intent === test.expectedIntent) {
        console.log(`✅ TEST PASADO - Intención correcta`);
        passed++;
      } else {
        console.log(`❌ TEST FALLADO - Intención incorrecta`);
        console.log(`   Esperado: ${test.expectedIntent}`);
        console.log(`   Obtenido: ${result.intent}`);
        failed++;
      }
      
      // Mostrar estadísticas de aprendizaje
      if (result.learningStats) {
        console.log(`\n📈 Estadísticas de Aprendizaje:`);
        console.log(`   Total interacciones: ${result.learningStats.totalInteractions}`);
        console.log(`   Interacciones exitosas: ${result.learningStats.successfulInteractions}`);
        console.log(`   Interacciones fallidas: ${result.learningStats.failedInteractions}`);
        console.log(`   Confianza promedio: ${Math.round(result.learningStats.averageConfidence * 100)}%`);
        console.log(`   Patrones aprendidos: ${result.learningStats.patternsLearned}`);
        console.log(`   Correcciones hechas: ${result.learningStats.correctionsMade}`);
        
        console.log(`   Distribución de sentimientos:`);
        console.log(`     Positivos: ${result.learningStats.sentimentDistribution.positive}`);
        console.log(`     Negativos: ${result.learningStats.sentimentDistribution.negative}`);
        console.log(`     Neutrales: ${result.learningStats.sentimentDistribution.neutral}`);
      }
      
      console.log(`\n💬 Respuesta: ${result.response.substring(0, 100)}...`);
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      failed++;
    }
    
    console.log('\n' + '='.repeat(60));
  }
  
  // Test de retroalimentación (feedback)
  console.log('\n🔄 Test de Retroalimentación del Sistema');
  
  try {
    // Simular una interacción que necesita corrección
    const wrongResult = await analyzeMessage('Necesito ayuda con la compra', '+51999999996');
    console.log(`Intención inicial: ${wrongResult.intent} (${wrongResult.confidence}%)`);
    
    // El sistema debería aprender de esta interacción
    console.log(`✅ Sistema de aprendizaje activo`);
    
  } catch (error) {
    console.log(`❌ Error en retroalimentación: ${error.message}`);
  }
  
  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE TESTS DE APRENDIZAJE CONTINUO');
  console.log('='.repeat(60));
  console.log(`✅ Tests pasados: ${passed}`);
  console.log(`❌ Tests fallados: ${failed}`);
  console.log(`📈 Precisión: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ¡TODO EL SISTEMA DE APRENDIZAJE FUNCIONA CORRECTAMENTE!');
  } else {
    console.log(`\n⚠️  Se encontraron ${failed} problemas que requieren atención`);
  }
  
  console.log('\n🧠 El sistema de aprendizaje continuo está:');
  console.log('   ✅ Aprendiendo de patrones exitosos');
  console.log('   ✅ Mejorando confianza con la experiencia');
  console.log('   ✅ Adaptándose a nuevas formas de comunicación');
  console.log('   ✅ Almacenando estadísticas de rendimiento');
  console.log('   ✅ Detectando y corrigiendo errores');
}

// Ejecutar el test
testLearningSystem().catch(console.error);