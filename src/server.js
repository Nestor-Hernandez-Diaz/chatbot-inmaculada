// src/server.js
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const wppconnect = require('@wppconnect-team/wppconnect');

const prisma = new PrismaClient();
const app = express();

let client;
let botStats = {
  mensajesRecibidos: 0,
  mensajesEnviados: 0,
  consultasProducto: 0,
  iniciadoEn: new Date(),
};

// ==================== INICIALIZAR WHATSAPP ====================
async function initWhatsApp() {
  try {
    client = await wppconnect.create({
      session: 'inmaculada-bot',
      catchQR: (base64Qr, asciiQR) => {
        console.log('\n📱 ESCANEA ESTE CÓDIGO QR CON WHATSAPP:\n');
        console.log(asciiQR);
        console.log('\n⚡ Abre WhatsApp > Dispositivos vinculados > Vincular dispositivo\n');
      },
      statusFind: (statusSession, session) => {
        console.log(`📊 Estado de sesión: ${statusSession}`);
        if (statusSession === 'isLogged') {
          console.log('✅ ¡WhatsApp conectado exitosamente!');
        }
      },
      headless: false,
      logQR: true,
      autoClose: 0,
      disableSpins: true,
      disableWelcome: true,
      updatesLog: false,
      browserArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ],
      puppeteerOptions: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ],
        headless: false,
        defaultViewport: null
      }
    });

    console.log('✅ Bot de WhatsApp conectado y listo');
    
    // Escuchar mensajes entrantes
    client.onMessage(async (message) => {
      if (message.isGroupMsg === false && !message.isMedia) {
        botStats.mensajesRecibidos++;
        await handleMessage(message);
      }
    });

  } catch (error) {
    console.error('❌ Error al inicializar WhatsApp:', error);
    console.log('🔄 Reintentando conexión en 10 segundos...');
    setTimeout(() => {
      initWhatsApp();
    }, 10000);
  }
}

// ==================== FUNCIONES AUXILIARES ====================

// Normalizar texto para búsqueda
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Extraer producto de la consulta
function extractProductName(message) {
  const palabrasIgnorar = ['tienen', 'hay', 'venden', 'producto', 'busco', 'quiero', 'necesito', 'cuanto', 'cuesta', 'precio', 'stock'];
  const palabras = message.split(' ').filter(p => !palabrasIgnorar.includes(p) && p.length > 2);
  return palabras.join(' ');
}

// Detectar intención del mensaje
function detectIntent(message) {
  const msg = normalizeText(message);
  
  if (msg.match(/hola|buenos|buenas|saludos|hey/)) return 'saludo';
  if (msg.match(/horario|hora|atencion|abren|cierran/)) return 'horario';
  if (msg.match(/ubicacion|direccion|donde|quedan|estan/)) return 'ubicacion';
  if (msg.match(/delivery|envio|domicilio|llevan/)) return 'delivery';
  if (msg.match(/mision|vision|valores|empresa|historia/)) return 'info_empresa';
  if (msg.match(/precio|cuanto|cuesta|vale/)) return 'precio_producto';
  if (msg.match(/stock|disponible|hay|tienen/)) return 'consulta_stock';
  if (msg.match(/categoria|tipos|que venden|productos/)) return 'categorias';
  if (msg.match(/oferta|promocion|descuento|rebaja/)) return 'ofertas';
  if (msg.match(/gracias|thank/)) return 'agradecimiento';
  if (msg.match(/adios|chau|hasta luego|bye/)) return 'despedida';
  
  return 'consulta_general';
}

// Buscar productos
async function buscarProductos(termino) {
  const terminoNormalizado = normalizeText(termino);
  
  const productos = await prisma.producto.findMany({
    where: {
      AND: [
        { activo: true },
        {
          OR: [
            { nombre: { contains: terminoNormalizado } },
            { marca: { contains: terminoNormalizado } },
          ]
        }
      ]
    },
    include: { categoria: true },
    take: 10,
  });

  return productos;
}

// Registrar cliente
async function registrarCliente(telefono, nombre) {
  await prisma.cliente.upsert({
    where: { telefono },
    update: {
      ultimaInteraccion: new Date(),
      totalConsultas: { increment: 1 },
      nombre: nombre || undefined,
    },
    create: {
      telefono,
      nombre,
      totalConsultas: 1,
    },
  });
}

// ==================== MANEJADOR PRINCIPAL DE MENSAJES ====================
async function handleMessage(message) {
  const telefono = message.from;
  const texto = message.body;
  const nombreCliente = message.sender.pushname || 'Cliente';

  console.log(`\n📩 Mensaje de ${nombreCliente} (${telefono}):`);
  console.log(`   "${texto}"\n`);

  // Registrar cliente
  await registrarCliente(telefono, nombreCliente);

  // Detectar intención
  const intencion = detectIntent(texto);
  let respuesta = '';

  try {
    switch (intencion) {
      case 'saludo':
        const config = await prisma.configuracion.findUnique({
          where: { clave: 'mensaje_bienvenida' }
        });
        respuesta = config ? config.valor : getMensajeBienvenida();
        break;

      case 'horario':
        const horario = await prisma.configuracion.findUnique({
          where: { clave: 'horario_atencion' }
        });
        respuesta = horario ? horario.valor : '📅 Lunes a Sábado: 7:00 AM - 9:00 PM\n🌅 Domingos: 8:00 AM - 2:00 PM';
        break;

      case 'ubicacion':
        const ubicacion = await prisma.configuracion.findUnique({
          where: { clave: 'direccion' }
        });
        const maps = await prisma.configuracion.findUnique({
          where: { clave: 'google_maps' }
        });
        respuesta = `📍 *Nuestra Ubicación:*\n\n${ubicacion ? ubicacion.valor : 'Jr. San Martín 245, Tarapoto'}`;
        if (maps) respuesta += `\n\n🗺️ Ver en mapa: ${maps.valor}`;
        break;

      case 'delivery':
        const delivery = await prisma.configuracion.findUnique({
          where: { clave: 'horario_delivery' }
        });
        respuesta = delivery ? delivery.valor : '🚚 Delivery disponible Lun-Sáb 8AM-8PM\nPedido mínimo: S/. 30.00';
        break;

      case 'info_empresa':
        if (texto.includes('mision')) {
          const mision = await prisma.configuracion.findUnique({ where: { clave: 'mision' } });
          respuesta = mision ? mision.valor : 'Consulta nuestra misión en tienda.';
        } else if (texto.includes('vision')) {
          const vision = await prisma.configuracion.findUnique({ where: { clave: 'vision' } });
          respuesta = vision ? vision.valor : 'Consulta nuestra visión en tienda.';
        } else {
          const valores = await prisma.configuracion.findUnique({ where: { clave: 'valores' } });
          respuesta = valores ? valores.valor : 'Consulta nuestros valores en tienda.';
        }
        break;

      case 'categorias':
        const categorias = await prisma.categoria.findMany({
          where: { activo: true },
          orderBy: { orden: 'asc' }
        });
        respuesta = '🏪 *Nuestras Categorías de Productos:*\n\n';
        categorias.forEach((cat, i) => {
          respuesta += `${cat.icono || '•'} ${cat.nombre}\n`;
        });
        respuesta += '\n💬 Pregúntame por cualquier producto específico.';
        break;

      case 'ofertas':
        const ofertas = await prisma.producto.findMany({
          where: { enOferta: true, activo: true },
          include: { categoria: true },
          take: 10,
        });
        
        if (ofertas.length > 0) {
          respuesta = '🔥 *Ofertas Especiales:*\n\n';
          ofertas.forEach((p, i) => {
            const descuento = ((p.precio - p.precioOferta) / p.precio * 100).toFixed(0);
            respuesta += `${i + 1}. *${p.nombre}*\n`;
            respuesta += `   ~~S/. ${p.precio}~~ → *S/. ${p.precioOferta}*\n`;
            respuesta += `   💰 Ahorra ${descuento}%\n`;
            respuesta += `   📦 Stock: ${p.stock > 0 ? 'Disponible' : 'Agotado'}\n\n`;
          });
        } else {
          respuesta = 'En este momento no tenemos ofertas activas.\n\n' +
                     '¡Mantente atento! Actualizamos nuestras promociones regularmente. 😊';
        }
        break;

      case 'precio_producto':
      case 'consulta_stock':
      case 'consulta_general':
        const terminoBusqueda = extractProductName(normalizeText(texto));
        
        if (terminoBusqueda.length > 2) {
          botStats.consultasProducto++;
          const productos = await buscarProductos(terminoBusqueda);

          if (productos.length > 0) {
            respuesta = `🛒 *Productos encontrados:*\n\n`;
            
            productos.slice(0, 5).forEach((p, i) => {
              respuesta += `*${i + 1}. ${p.nombre}*\n`;
              if (p.marca) respuesta += `   🏷️ Marca: ${p.marca}\n`;
              if (p.presentacion) respuesta += `   📏 ${p.presentacion}\n`;
              
              if (p.enOferta && p.precioOferta) {
                respuesta += `   💰 ~~S/. ${p.precio}~~ → *S/. ${p.precioOferta}* ¡OFERTA!\n`;
              } else {
                respuesta += `   💰 S/. ${p.precio}\n`;
              }
              
              if (p.stock > 10) {
                respuesta += `   ✅ Disponible (${p.stock} unidades)\n`;
              } else if (p.stock > 0) {
                respuesta += `   ⚠️ Pocas unidades (${p.stock} disponibles)\n`;
              } else {
                respuesta += `   ❌ Agotado temporalmente\n`;
              }
              
              respuesta += `   📁 ${p.categoria.nombre}\n\n`;
            });

            if (productos.length > 5) {
              respuesta += `_...y ${productos.length - 5} productos más_\n\n`;
            }
            
            respuesta += '¿Necesitas información de algún otro producto? 😊';
          } else {
            respuesta = `No encontré productos con "${terminoBusqueda}" 😔\n\n` +
                       `Algunas sugerencias:\n` +
                       `• Verifica la ortografía\n` +
                       `• Usa términos más generales (ej: "leche" en vez de marca específica)\n` +
                       `• Pregunta por la categoría (ej: "lácteos", "bebidas")\n\n` +
                       `¿En qué más puedo ayudarte?`;
          }
        } else {
          respuesta = 'Para buscar productos, por favor sé más específico.\n\n' +
                     '📝 Ejemplos:\n' +
                     '• "¿Tienen leche Gloria?"\n' +
                     '• "Arroz Paisana"\n' +
                     '• "Productos de limpieza"\n\n' +
                     'O escribe "categorías" para ver todas nuestras secciones.';
        }
        break;

      case 'agradecimiento':
        respuesta = '¡De nada! 😊 Es un placer ayudarte.\n\n' +
                   'Si necesitas algo más, aquí estoy. ¡Que tengas un excelente día!';
        break;

      case 'despedida':
        respuesta = '👋 ¡Hasta pronto!\n\n' +
                   'Gracias por contactar con *Supermercado La Inmaculada*.\n' +
                   '¡Te esperamos! 😊';
        break;

      default:
        respuesta = '🤔 Disculpa, no entendí bien tu consulta.\n\n' +
                   '¿En qué puedo ayudarte?\n\n' +
                   '• 🛒 Consultar productos\n' +
                   '• 🕐 Horarios de atención\n' +
                   '• 📍 Ubicación\n' +
                   '• 🚚 Información de delivery\n' +
                   '• ℹ️ Sobre nuestra empresa';
    }

    // Enviar respuesta
    await client.sendText(telefono, respuesta);
    botStats.mensajesEnviados++;

    console.log(`✅ Respuesta enviada (${respuesta.length} caracteres)\n`);

    // Guardar conversación
    await prisma.conversacion.create({
      data: {
        telefono,
        nombreCliente,
        mensaje: texto,
        respuesta,
        intencion,
      },
    });

  } catch (error) {
    console.error('❌ Error al procesar mensaje:', error);
    
    const errorMsg = '😓 Disculpa, tuve un problema técnico.\n\n' +
                    'Por favor intenta nuevamente en un momento.';
    
    try {
      await client.sendText(telefono, errorMsg);
    } catch (e) {
      console.error('❌ Error al enviar mensaje de error:', e);
    }
  }
}

// Mensaje de bienvenida por defecto
function getMensajeBienvenida() {
  return '¡Hola! 👋 Bienvenido a *Supermercado La Inmaculada*\n\n' +
         'Soy tu asistente virtual. ¿En qué puedo ayudarte?\n\n' +
         '🛒 Consultar productos\n' +
         '📦 Verificar stock\n' +
         '🕐 Horarios\n' +
         '📍 Ubicación\n' +
         '🚚 Delivery\n' +
         'ℹ️ Sobre nosotros';
}

// ==================== API REST ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    servicio: 'Chatbot La Inmaculada',
    version: '1.0.0',
    bot: client ? 'conectado' : 'desconectado',
    estadisticas: botStats,
  });
});

// Estadísticas
app.get('/stats', async (req, res) => {
  const totalProductos = await prisma.producto.count();
  const totalClientes = await prisma.cliente.count();
  const conversacionesHoy = await prisma.conversacion.count({
    where: {
      fecha: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  });

  res.json({
    bot: botStats,
    base_datos: {
      productos: totalProductos,
      clientes: totalClientes,
      conversaciones_hoy: conversacionesHoy,
    }
  });
});

// Listar productos
app.get('/productos', async (req, res) => {
  const { categoria, buscar, enOferta } = req.query;
  
  const where = { activo: true };
  
  if (categoria) {
    const cat = await prisma.categoria.findFirst({
      where: { nombre: { contains: categoria } }
    });
    if (cat) where.categoriaId = cat.id;
  }
  
  if (buscar) {
    where.nombre = { contains: buscar };
  }
  
  if (enOferta === 'true') {
    where.enOferta = true;
  }

  const productos = await prisma.producto.findMany({
    where,
    include: { categoria: true },
    orderBy: { nombre: 'asc' }
  });

  res.json(productos);
});

// Obtener producto por ID
app.get('/productos/:id', async (req, res) => {
  const producto = await prisma.producto.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { categoria: true }
  });

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(producto);
});

// Crear producto
app.post('/productos', async (req, res) => {
  try {
    const producto = await prisma.producto.create({
      data: req.body,
      include: { categoria: true }
    });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar producto
app.put('/productos/:id', async (req, res) => {
  try {
    const producto = await prisma.producto.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      include: { categoria: true }
    });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar categorías
app.get('/categorias', async (req, res) => {
  const categorias = await prisma.categoria.findMany({
    where: { activo: true },
    include: {
      _count: {
        select: { productos: true }
      }
    },
    orderBy: { orden: 'asc' }
  });

  res.json(categorias);
});

// Conversaciones recientes
app.get('/conversaciones', async (req, res) => {
  const { limit = 50 } = req.query;
  
  const conversaciones = await prisma.conversacion.findMany({
    take: parseInt(limit),
    orderBy: { fecha: 'desc' }
  });

  res.json(conversaciones);
});

// Configuración
app.get('/configuracion', async (req, res) => {
  const config = await prisma.configuracion.findMany();
  res.json(config);
});

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log('\n🚀 ========================================');
  console.log('   CHATBOT LA INMACULADA - INICIADO');
  console.log('========================================\n');
  console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📊 Estadísticas: http://localhost:${PORT}/stats`);
  console.log(`📦 Productos API: http://localhost:${PORT}/productos`);
  console.log('\n⏳ Iniciando conexión con WhatsApp...\n');
  
  await initWhatsApp();
});

// Manejo de cierre
process.on('SIGINT', async () => {
  console.log('\n\n⚠️  Cerrando aplicación...');
  await prisma.$disconnect();
  if (client) await client.close();
  console.log('✅ Aplicación cerrada correctamente\n');
  process.exit();
});