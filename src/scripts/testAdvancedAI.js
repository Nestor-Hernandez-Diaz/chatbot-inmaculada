const { analyzeMessage } = require('../services/ai-advanced.service');

async function testAdvancedAIEngine() {
    console.log('🧠🚀 PROBANDO MOTOR DE IA AVANZADO CON CONTEXTUALIZACIÓN EMPRESARIAL\n');
    
    const testCases = [
        // Saludos contextuales
        {
            message: "Hola, buenos días",
            expectedIntent: "saludo",
            description: "Saludo básico con detección de momento del día"
        },
        {
            message: "Qué tal, cómo están?",
            expectedIntent: "saludo",
            description: "Saludo informal"
        },
        
        // Consultas de productos inteligentes
        {
            message: "¿Tienen leche entera de la marca Gloria?",
            expectedIntent: "consulta_producto",
            description: "Consulta específica con marca"
        },
        {
            message: "Cuánto cuesta el arroz costeño de 5kg",
            expectedIntent: "consulta_producto",
            description: "Consulta con cantidad específica"
        },
        {
            message: "Quiero comprar pollo fresco para hoy",
            expectedIntent: "consulta_producto",
            description: "Consulta con urgencia"
        },
        {
            message: "Muéstrame los productos de limpieza que tienen",
            expectedIntent: "consulta_producto",
            description: "Consulta por categoría"
        },
        
        // Comparaciones y recomendaciones
        {
            message: "Cuál es mejor, la leche Gloria o Laive?",
            expectedIntent: "comparacion_productos",
            description: "Comparación de productos"
        },
        {
            message: "Qué me recomiendas para desayunar",
            expectedIntent: "comparacion_productos",
            description: "Solicitud de recomendación"
        },
        
        // Información del negocio
        {
            message: "A qué hora abren hoy",
            expectedIntent: "horarios_servicio",
            description: "Consulta de horarios con contexto temporal"
        },
        {
            message: "Dónde están ubicados exactamente",
            expectedIntent: "ubicacion_tienda",
            description: "Consulta de ubicación detallada"
        },
        {
            message: "Hacen delivery a domicilio?",
            expectedIntent: "delivery_servicio",
            description: "Consulta de servicio de delivery"
        },
        {
            message: "Cuánto cuesta el delivery para el centro",
            expectedIntent: "delivery_servicio",
            description: "Consulta de costo de delivery"
        },
        
        // Pedidos y compras
        {
            message: "Quiero hacer un pedido para mi casa",
            expectedIntent: "pedido_compra",
            description: "Intención de pedido"
        },
        {
            message: "Cómo puedo ordenar pollo y arroz",
            expectedIntent: "pedido_compra",
            description: "Pedido específico de productos"
        },
        
        // Quejas y problemas
        {
            message: "La última vez me llegó el producto en mal estado",
            expectedIntent: "quejas_sugerencias",
            description: "Queja sobre calidad"
        },
        
        // Despedidas contextuales
        {
            message: "Gracias por la información, hasta luego",
            expectedIntent: "despedida",
            description: "Despedida con agradecimiento"
        },
        {
            message: "Está bien, nos vemos",
            expectedIntent: "despedida",
            description: "Despedida informal"
        },
        
        // Mensajes ambiguos que requieren contexto
        {
            message: "No me gustó eso",
            expectedIntent: "quejas_sugerencias",
            description: "Queja ambigua que necesita contexto"
        },
        {
            message: "Me interesa el primero",
            expectedIntent: "seleccion_producto",
            description: "Selección desde lista previa"
        }
    ];
    
    console.log('📊 INICIANDO PRUEBAS CONTEXTUALES...\n');
    
    let totalTests = 0;
    let passedTests = 0;
    let highConfidenceTests = 0;
    
    for (const testCase of testCases) {
        totalTests++;
        console.log(`📱 Mensaje: "${testCase.message}"`);
        console.log(`📝 Descripción: ${testCase.description}`);
        
        try {
            const result = await analyzeMessage(testCase.message, '5491234567890@c.us');
            
            console.log(`🎯 Intento detectado: ${result.intent} (confianza: ${result.confidence}%)`);
            console.log(`📊 Resultado esperado: ${testCase.expectedIntent}`);
            
            const testPassed = result.intent === testCase.expectedIntent;
            const highConfidence = result.confidence >= 80;
            
            if (testPassed) passedTests++;
            if (highConfidence) highConfidenceTests++;
            
            console.log(`✅ Test: ${testPassed ? 'PASÓ' : 'FALLÓ'} ${highConfidence ? '🌟' : ''}`);
            
            if (result.response) {
                console.log(`🤖 Respuesta generada: "${result.response}"`);
            }
            
            if (result.products && result.products.length > 0) {
                console.log(`📦 Productos encontrados: ${result.products.length}`);
                result.products.forEach(product => {
                    console.log(`   - ${product.name}: S/ ${product.price}`);
                });
            }
            
            // Análisis de contexto
            if (result.context && result.context.memory) {
                console.log(`💭 Contexto: Visitas previas: ${result.context.memory.visitCount || 0}`);
            }
            
            console.log('---\n');
            
        } catch (error) {
            console.error(`❌ Error procesando mensaje: ${error.message}`);
            console.log('---\n');
        }
    }
    
    // Estadísticas finales
    console.log('📈 ESTADÍSTICAS DE LAS PRUEBAS:');
    console.log(`✅ Tests pasados: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`🌟 Alta confianza (≥80%): ${highConfidenceTests}/${totalTests} (${((highConfidenceTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`📊 Precisión promedio: ${((passedTests/totalTests)*100).toFixed(1)}%`);
    
    // Pruebas de flujo conversacional completo
    console.log('\n🧪 PRUEBAS DE FLUJO CONVERSACIONAL COMPLETO:');
    await testConversationalFlow();
    
    console.log('\n✅ Pruebas del motor de IA avanzado completadas');
}

async function testConversationalFlow() {
    const conversationFlow = [
        { message: "Hola", delay: 1000 },
        { message: "Quiero ver productos de limpieza", delay: 1500 },
        { message: "Me interesa el primero", delay: 1500 },
        { message: "Cuánto cuesta", delay: 1000 },
        { message: "Está bien, gracias", delay: 1000 }
    ];
    
    console.log('\n🗣️ Simulando conversación completa...\n');
    
    for (let i = 0; i < conversationFlow.length; i++) {
        const step = conversationFlow[i];
        console.log(`🧍 Cliente: "${step.message}"`);
        
        const result = await analyzeMessage(step.message, '5491234567890@c.us');
        console.log(`🤖 Asistente: "${result.response}"`);
        console.log(`💭 Contexto: ${result.intent} (${result.confidence}%)\n`);
        
        // Esperar para simular tiempo real
        await new Promise(resolve => setTimeout(resolve, step.delay));
    }
}

// Ejecutar pruebas
testAdvancedAIEngine().catch(console.error);