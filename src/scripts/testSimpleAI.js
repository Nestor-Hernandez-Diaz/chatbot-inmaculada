const { analyzeMessage } = require('../services/ai-simple.service');

async function testSimpleAIEngine() {
    console.log('🧠 Probando Motor de IA Simplificado del Chatbot de WhatsApp...\n');
    
    const testCases = [
        {
            message: "Hola, buenos días",
            expectedIntent: "saludo"
        },
        {
            message: "¿Tienen leche?",
            expectedIntent: "consulta_producto"
        },
        {
            message: "Quiero comprar arroz",
            expectedIntent: "consulta_producto"
        },
        {
            message: "¿Cuánto cuesta el pan?",
            expectedIntent: "consulta_producto"
        },
        {
            message: "Muéstrame los productos de limpieza",
            expectedIntent: "consulta_producto"
        },
        {
            message: "Gracias, adiós",
            expectedIntent: "despedida"
        },
        {
            message: "No entiendo",
            expectedIntent: "desconocido"
        },
        {
            message: "¿A qué hora abren?",
            expectedIntent: "horarios"
        },
        {
            message: "¿Dónde están ubicados?",
            expectedIntent: "ubicacion"
        },
        {
            message: "¿Qué categorías tienen?",
            expectedIntent: "categorias"
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`📱 Mensaje: "${testCase.message}"`);
        
        try {
            const result = await analyzeMessage(testCase.message, '5491234567890@c.us');
            
            console.log(`🎯 Intento detectado: ${result.intent} (confianza: ${result.confidence}%)`);
            console.log(`📊 Resultado esperado: ${testCase.expectedIntent}`);
            console.log(`✅ Test: ${result.intent === testCase.expectedIntent ? 'PASÓ' : 'FALLÓ'}`);
            
            if (result.response) {
                console.log(`🤖 Respuesta: "${result.response}"`);
            }
            
            if (result.products && result.products.length > 0) {
                console.log(`📦 Productos encontrados: ${result.products.length}`);
                result.products.forEach(product => {
                    console.log(`   - ${product.name}: $${product.price}`);
                });
            }
            
            console.log('---\n');
            
        } catch (error) {
            console.error(`❌ Error procesando mensaje: ${error.message}`);
            console.log('---\n');
        }
    }
    
    console.log('✅ Pruebas del motor de IA simplificado completadas');
}

// Ejecutar pruebas
testSimpleAIEngine().catch(console.error);