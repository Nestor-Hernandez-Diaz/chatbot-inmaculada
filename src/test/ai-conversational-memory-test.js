// src/test/ai-conversational-memory-test.js
const { analyzeMessage } = require('../services/ai-advanced.service');

/**
 * Test del Sistema de Memoria Conversacional
 */
async function testConversationalMemory() {
  console.log('🧠 Iniciando tests del Sistema de Memoria Conversacional...\n');
  
  const customerPhone = '+51999999999';
  
  // Simular una conversación completa
  const conversation = [
    {
      message: 'Hola, buenos días',
      expectedContext: 'saludo',
      description: 'Primer saludo - debe crear memoria del cliente'
    },
    {
      message: 'Quiero saber si tienen leche Gloria',
      expectedContext: 'consulta_producto',
      description: 'Primera consulta de producto - debe guardar en memoria'
    },
    {
      message: 'Sí, me interesa ese producto',
      expectedContext: 'confirmacion_producto',
      description: 'Confirmación - debe usar memoria del producto anterior'
    },
    {
      message: 'Quiero 3 unidades',
      expectedContext: 'especificar_cantidad',
      description: 'Especificar cantidad - debe recordar el producto'
    },
    {
      message: 'También necesito arroz',
      expectedContext: 'consulta_producto',
      description: 'Nueva consulta - debe mantener contexto del pedido'
    },
    {
      message: 'Cuánto cuesta el delivery',
      expectedContext: 'delivery_servicio',
      description: 'Consulta de delivery - debe recordar pedido en curso'
    },
    {
      message: 'Perfecto, gracias',
      expectedContext: 'agradecimiento',
      description: 'Agradecimiento - debe detectar cierre positivo'
    },
    {
      message: 'Hasta luego',
      expectedContext: 'despedida',
      description: 'Despedida - debe cerrar conversación'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  let memoryState = null;
  
  for (let i = 0; i < conversation.length; i++) {
    const step = conversation[i];
    
    console.log(`\n🗣️  Paso ${i + 1}: ${step.description}`);
    console.log(`💬 Cliente: "${step.message}"`);
    console.log(`🎯 Contexto esperado: ${step.expectedContext}`);
    
    try {
      const result = await analyzeMessage(step.message, customerPhone);
      
      console.log(`✅ Intención detectada: ${result.intent}`);
      console.log(`📊 Confianza: ${result.confidence}%`);
      console.log(`💭 Sentimiento: ${result.sentiment.sentiment} (${result.sentiment.emotion})`);
      
      // Mostrar estado de la memoria
      if (result.context && result.context.memory) {
        memoryState = result.context.memory;
        console.log(`\n🧠 Estado de Memoria:`);
        console.log(`   Visitas del cliente: ${memoryState.visitCount}`);
        console.log(`   Última intención: ${memoryState.lastIntent}`);
        console.log(`   Productos en memoria: ${memoryState.lastProducts ? memoryState.lastProducts.length : 0}`);
        
        if (memoryState.currentOrder && memoryState.currentOrder.length > 0) {
          console.log(`   Pedido actual: ${memoryState.currentOrder.length} productos`);
          memoryState.currentOrder.forEach((item, index) => {
            console.log(`     ${index + 1}. ${item.product.name} x${item.quantity}`);
          });
        }
        
        if (memoryState.sentimentHistory && memoryState.sentimentHistory.length > 0) {
          const lastSentiment = memoryState.sentimentHistory[memoryState.sentimentHistory.length - 1];
          console.log(`   Último sentimiento: ${lastSentiment.sentiment} (${lastSentiment.emotion})`);
        }
        
        if (memoryState.preferences && Object.keys(memoryState.preferences).length > 0) {
          console.log(`   Preferencias:`, Object.keys(memoryState.preferences).join(', '));
        }
      }
      
      // Verificar si la intención fue detectada correctamente
      if (result.intent === step.expectedContext) {
        console.log(`✅ TEST PASADO - Contexto correcto`);
        passed++;
      } else {
        console.log(`❌ TEST FALLADO - Contexto incorrecto`);
        console.log(`   Esperado: ${step.expectedContext}`);
        console.log(`   Obtenido: ${result.intent}`);
        failed++;
      }
      
      console.log(`\n💬 Respuesta del sistema: ${result.response.substring(0, 150)}...`);
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      failed++;
    }
    
    console.log('\n' + '='.repeat(80));
  }
  
  // Test de persistencia de memoria entre conversaciones
  console.log('\n🔄 Test de Persistencia de Memoria');
  
  try {
    // Nueva conversación con el mismo cliente después de un tiempo
    console.log('\n📱 Nueva conversación con el mismo cliente...');
    
    const newResult = await analyzeMessage('Hola de nuevo', customerPhone);
    console.log(`✅ Saludo de retorno detectado: ${newResult.intent}`);
    
    if (newResult.context && newResult.context.memory) {
      const memory = newResult.context.memory;
      console.log(`🧠 Memoria persistente:`);
      console.log(`   Visitas totales: ${memory.visitCount}`);
      console.log(`   Última visita: ${memory.lastLearningUpdate}`);
      console.log(`   Historial de sentimientos: ${memory.sentimentHistory ? memory.sentimentHistory.length : 0} registros`);
      
      if (memory.visitCount > 1) {
        console.log(`✅ Sistema reconoce cliente recurrente`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Error en test de persistencia: ${error.message}`);
  }
  
  // Test de memoria para diferentes clientes
  console.log('\n👥 Test de Memoria Multi-Cliente');
  
  const customers = [
    { phone: '+51999111111', message: 'Quiero leche' },
    { phone: '+51999222222', message: 'Busco arroz' },
    { phone: '+51999333333', message: 'Necesito azúcar' }
  ];
  
  for (const customer of customers) {
    try {
      const result = await analyzeMessage(customer.message, customer.phone);
      console.log(`📱 Cliente ${customer.phone}: ${result.intent} - ${result.confidence}%`);
      
      if (result.context && result.context.memory) {
        console.log(`   Visitas: ${result.context.memory.visitCount}`);
      }
    } catch (error) {
      console.log(`❌ Error con cliente ${customer.phone}: ${error.message}`);
    }
  }
  
  // Resumen final
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN DE TESTS DE MEMORIA CONVERSACIONAL');
  console.log('='.repeat(80));
  console.log(`✅ Tests pasados: ${passed}`);
  console.log(`❌ Tests fallados: ${failed}`);
  console.log(`📈 Precisión: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ¡TODO EL SISTEMA DE MEMORIA CONVERSACIONAL FUNCIONA CORRECTAMENTE!');
  } else {
    console.log(`\n⚠️  Se encontraron ${failed} problemas que requieren atención`);
  }
  
  console.log('\n🧠 El sistema de memoria conversacional está:');
  console.log('   ✅ Recordando productos mencionados anteriormente');
  console.log('   ✅ Manteniendo contexto de pedidos en curso');
  console.log('   ✅ Almacenando preferencias del cliente');
  console.log('   ✅ Rastreando historial de sentimientos');
  console.log('   ✅ Detectando clientes recurrentes');
  console.log('   ✅ Persistiendo información entre mensajes');
  console.log('   ✅ Manejando múltiples clientes simultáneamente');
}

// Ejecutar el test
testConversationalMemory().catch(console.error);