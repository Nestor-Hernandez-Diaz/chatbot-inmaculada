const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Categorías de productos
const categoriasData = [
  { name: 'Lácteos y Huevos', description: 'Productos lácteos frescos y huevos de calidad' },
  { name: 'Panadería y Dulces', description: 'Pan fresco, galletas y productos de repostería' },
  { name: 'Carnes y Embutidos', description: 'Carnes frescas y embutidos de primera calidad' },
  { name: 'Frutas y Verduras', description: 'Frutas y verduras frescas del día' },
  { name: 'Bebidas y Licores', description: 'Bebidas refrescantes y licores' },
  { name: 'Limpieza y Hogar', description: 'Productos de limpieza para el hogar' },
  { name: 'Cuidado Personal', description: 'Productos de higiene y cuidado personal' }
];

// Productos realistas por categoría
const productosPorCategoria = {
  'Lácteos y Huevos': [
    { sku: 'LAC-GL-001', name: 'Leche Gloria Entera 1L', price: 4.50, stock: 150, description: 'Leche entera de gloria, fuente de calcio y proteínas' },
    { sku: 'LAC-GL-002', name: 'Leche Gloria Deslactosada 1L', price: 5.20, stock: 120, description: 'Leche deslactosada para personas intolerantes a la lactosa' },
    { sku: 'LAC-GL-003', name: 'Yogurt Gloria Natural 1L', price: 6.80, stock: 80, description: 'Yogurt natural sin azúcar, ideal para desayuno' },
    { sku: 'LAC-GL-004', name: 'Queso Fresco Laive 500g', price: 12.50, stock: 60, description: 'Queso fresco Laive, perfecto para ensaladas' },
    { sku: 'LAC-HV-001', name: 'Huevos Verdes Grande 12 unidades', price: 8.90, stock: 200, description: 'Huevos frescos de gallina criolla, tamaño grande' },
    { sku: 'LAC-MP-001', name: 'Mantequilla Manty 200g', price: 7.80, stock: 90, description: 'Mantequilla de primera calidad para cocina' }
  ],
  'Panadería y Dulces': [
    { sku: 'PAN-VL-001', name: 'Pan de Mesa VillaLita 680g', price: 3.20, stock: 100, description: 'Pan de mesa fresco, ideal para el desayuno' },
    { sku: 'PAN-VL-002', name: 'Pan Integral VillaLita 500g', price: 4.10, stock: 75, description: 'Pan integral rico en fibra para una alimentación saludable' },
    { sku: 'PAN-GL-001', name: 'Galletas Glacitas 150g', price: 2.80, stock: 180, description: 'Galletas dulces crocantes, perfectas para la merienda' },
    { sku: 'DUL-SC-001', name: 'Chocolate Sublime 50g', price: 2.50, stock: 250, description: 'Chocolate con leche clásico peruano' },
    { sku: 'DUL-GL-001', name: 'Galletas María Gloria 180g', price: 3.20, stock: 150, description: 'Galletas maría clásicas para acompañar el café' },
    { sku: 'PAN-CR-001', name: 'Panetón Casa Grande 500g', price: 15.90, stock: 40, description: 'Panetón tradicional peruano para las fiestas' }
  ],
  'Carnes y Embutidos': [
    { sku: 'CAR-PO-001', name: 'Pollo Entero Fresco 2.5kg', price: 18.50, stock: 45, description: 'Pollo entero fresco de granja, ideal para asar' },
    { sku: 'CAR-PO-002', name: 'Pechuga de Pollo 1kg', price: 12.90, stock: 80, description: 'Pechuga de pollo fresca sin hueso' },
    { sku: 'CAR-RE-001', name: 'Res para Guisar 1kg', price: 24.50, stock: 35, description: 'Carne de res tierna perfecta para guisos' },
    { sku: 'EMB-SA-001', name: 'Salchicha Nacional 500g', price: 8.90, stock: 120, description: 'Salchichas clásicas para el desayuno' },
    { sku: 'EMB-JM-001', name: 'Jamón del País 250g', price: 11.50, stock: 60, description: 'Jamón cocido del país, perfecto para sándwiches' },
    { sku: 'CAR-CE-001', name: 'Cerdo para Chicharrones 1kg', price: 16.80, stock: 30, description: 'Carne de cerdo especial para chicharrones' }
  ],
  'Frutas y Verduras': [
    { sku: 'FRU-PL-001', name: 'Plátano Verde 1kg', price: 3.20, stock: 200, description: 'Plátano verde fresco para freír o cocinar' },
    { sku: 'FRU-NA-001', name: 'Naranja Valenciana 1kg', price: 4.50, stock: 150, description: 'Naranja dulce y jugosa rica en vitamina C' },
    { sku: 'VER-CE-001', name: 'Cebolla Blanca 1kg', price: 2.80, stock: 180, description: 'Cebolla blanca fresca para cocina' },
    { sku: 'VER-TO-001', name: 'Tomate 1kg', price: 3.90, stock: 160, description: 'Tomate maduro fresco para ensaladas' },
    { sku: 'FRU-PA-001', name: 'Papaya 1kg', price: 5.50, stock: 90, description: 'Papaya tropical dulce y nutritiva' },
    { sku: 'VER-ZA-001', name: 'Zanahoria 1kg', price: 2.50, stock: 140, description: 'Zanahoria fresca rica en betacarotenos' }
  ],
  'Bebidas y Licores': [
    { sku: 'BEB-CO-001', name: 'Coca Cola 3L', price: 7.50, stock: 300, description: 'Coca cola refrescante para compartir' },
    { sku: 'BEB-IN-001', name: 'Inka Cola 3L', price: 6.90, stock: 280, description: 'Inka cola, el sabor del Perú' },
    { sku: 'BEB-AG-001', name: 'Agua San Mateo 2.5L', price: 3.20, stock: 400, description: 'Agua mineral pura y cristalina' },
    { sku: 'LIC-CR-001', name: 'Cristal 750ml', price: 8.50, stock: 150, description: 'Cerveza cristal, la tradicional' },
    { sku: 'LIC-CC-001', name: 'Cusqueña Dorada 750ml', price: 9.90, stock: 120, description: 'Cerveza dorada de alta calidad' },
    { sku: 'BEB-ZU-001', name: 'Zuko Naranja 1L', price: 4.20, stock: 200, description: 'Bebida sabor naranja en polvo' }
  ],
  'Limpieza y Hogar': [
    { sku: 'LIM-DO-001', name: 'Detergente Ace 900g', price: 12.50, stock: 100, description: 'Detergente en polvo para ropa blanca y de color' },
    { sku: 'LIM-JB-001', name: 'Jabón Velas Rosado 200g', price: 2.80, stock: 250, description: 'Jabón tradicional para ropa' },
    { sku: 'LIM-CL-001', name: 'Cloro Clorox 1L', price: 4.50, stock: 180, description: 'Cloro para desinfección y blanqueamiento' },
    { sku: 'LIM-PA-001', name: 'Papel Higiénico Suave 4 rollos', price: 8.90, stock: 200, description: 'Papel higiénico suave de 4 rollos' },
    { sku: 'LIM-ES-001', name: 'Esponja 3M 2 unidades', price: 5.50, stock: 150, description: 'Esponjas abrasivas para limpieza' },
    { sku: 'LIM-LI-001', name: 'Limpiador Lysol 500ml', price: 7.80, stock: 80, description: 'Limpiador multiusos con fragancia' }
  ],
  'Cuidado Personal': [
    { sku: 'CUI-CP-001', name: 'Crema Dental Colate 90ml', price: 4.20, stock: 300, description: 'Crema dental anticaries con flúor' },
    { sku: 'CUI-SH-001', name: 'Shampoo Head & Shoulders 400ml', price: 18.50, stock: 120, description: 'Shampoo anticaspa para cabello normal' },
    { sku: 'CUI-JA-001', name: 'Jabón Rexona 150g', price: 3.50, stock: 200, description: 'Jabón para baño con fragancia duradera' },
    { sku: 'CUI-DE-001', name: 'Desodorante Axe 150ml', price: 15.90, stock: 100, description: 'Desodorante en aerosol para hombre' },
    { sku: 'CUI-EN-001', name: 'Enjuague Bucal Listerine 500ml', price: 12.50, stock: 80, description: 'Enjuague bucal para aliento fresco' },
    { sku: 'CUI-PA-001', name: 'Pañales Huggies G 20 unidades', price: 35.90, stock: 60, description: 'Pañales desechables talla G para bebés' }
  ]
};

// Tienda La Inmaculada
const tiendaData = {
  name: 'La Inmaculada',
  address: 'Av. Los Jardines 123, Urb. Las Flores, Lima',
  phone: '5112345678'
};

// Horarios de atención
const horariosData = [
  { dayOfWeek: 1, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T22:00:00Z') }, // Lunes
  { dayOfWeek: 2, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T22:00:00Z') }, // Martes
  { dayOfWeek: 3, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T22:00:00Z') }, // Miércoles
  { dayOfWeek: 4, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T22:00:00Z') }, // Jueves
  { dayOfWeek: 5, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T22:00:00Z') }, // Viernes
  { dayOfWeek: 6, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T22:00:00Z') }, // Sábado
  { dayOfWeek: 0, openTime: new Date('1970-01-01T09:00:00Z'), closeTime: new Date('1970-01-01T20:00:00Z') }  // Domingo
];

// Conversaciones WhatsApp realistas
const conversacionesData = [
  {
    customerPhone: '51987654321',
    botPhone: '51912345678',
    status: 'OPEN'
  },
  {
    customerPhone: '51912345678',
    botPhone: '51912345678',
    status: 'OPEN'
  },
  {
    customerPhone: '51956789123',
    botPhone: '51912345678',
    status: 'NEEDS_ATTENTION'
  },
  {
    customerPhone: '51923456789',
    botPhone: '51912345678',
    status: 'CLOSED'
  }
];

// Función para crear mensajes después de que las conversaciones existan
async function crearMensajes(conversaciones) {
  const mensajesData = [
    // Conversación 1: María González (conversaciones[0])
    {
      id: 'wamid_1_1',
      sender: 'USER',
      content: 'Hola, buenos días. Quisiera saber si tienen leche Gloria entera',
      contentType: 'text',
      timestamp: new Date('2024-11-15T08:30:00Z'),
      conversationId: conversaciones[0].id
    },
    {
      id: 'wamid_1_2',
      sender: 'BOT',
      content: '¡Buenos días María! Sí, tenemos leche Gloria entera disponible. Precio: S/ 4.50. ¿Cuántas unidades deseas?',
      contentType: 'text',
      timestamp: new Date('2024-11-15T08:31:00Z'),
      conversationId: conversaciones[0].id
    },
    {
      id: 'wamid_1_3',
      sender: 'USER',
      content: 'Perfecto, llevaré 3 leches y también necesito huevos',
      contentType: 'text',
      timestamp: new Date('2024-11-15T08:35:00Z'),
      conversationId: conversaciones[0].id
    },
    {
      id: 'wamid_1_4',
      sender: 'BOT',
      content: 'Excelente! 3 leches Gloria entera (S/ 13.50) + 1 paquete de huevos Verdes (S/ 8.90). Total: S/ 22.40. ¿Confirmas tu pedido?',
      contentType: 'text',
      timestamp: new Date('2024-11-15T08:36:00Z'),
      conversationId: conversaciones[0].id
    },
    // Conversación 2: Carlos Rodríguez (conversaciones[1])
    {
      id: 'wamid_2_1',
      sender: 'USER',
      content: 'Buenas tardes, tienen pollo para hoy?',
      contentType: 'text',
      timestamp: new Date('2024-11-14T14:20:00Z'),
      conversationId: conversaciones[1].id
    },
    {
      id: 'wamid_2_2',
      sender: 'BOT',
      content: '¡Buenas tardes Carlos! Sí, tenemos pollo entero fresco. Precio: S/ 18.50 por 2.5kg. ¿Te gustaría ordenar?',
      contentType: 'text',
      timestamp: new Date('2024-11-14T14:21:00Z'),
      conversationId: conversaciones[1].id
    }
  ];

  console.log('\n💭 Creando mensajes...');
  for (const mensajeData of mensajesData) {
    await prisma.message.create({
      data: mensajeData
    });
  }
  console.log(`✅ ${mensajesData.length} mensajes creados`);
}

// Función para crear pedidos después de que las conversaciones existan
async function crearPedidos(conversaciones) {
  const pedidosData = [
    {
      customerPhone: '51987654321',
      whatsappConversationId: conversaciones[0].id, // María González
      total: 22.40,
      status: 'COMPLETED'
    },
    {
      customerPhone: '51912345678',
      whatsappConversationId: conversaciones[1].id, // Carlos Rodríguez
      total: 24.10,
      status: 'COMPLETED'
    }
  ];

  console.log('\n📋 Creando pedidos...');
  const pedidosCreados = [];
  for (const pedidoData of pedidosData) {
    const pedido = await prisma.order.create({
      data: pedidoData
    });
    pedidosCreados.push(pedido);
    console.log(`✅ Pedido: S/ ${pedido.total} - ${pedido.status}`);
  }
  
  return pedidosCreados;
}

// Función para crear items de pedidos después de que los pedidos y productos existan
async function crearOrderItems(pedidos, productos) {
  // Buscar productos por SKU para obtener sus IDs reales
  const lecheGloria = productos.find(p => p.sku === 'LAC-GL-001');
  const huevosVerdes = productos.find(p => p.sku === 'LAC-HV-001');
  const polloEntero = productos.find(p => p.sku === 'CAR-PO-001');
  const cebollaBlanca = productos.find(p => p.sku === 'VER-CE-001');

  const orderItemsData = [
    // Pedido 1 - María González (pedidos[0])
    { orderId: pedidos[0].id, productId: lecheGloria.id, quantity: 3, price: 4.50 },
    { orderId: pedidos[0].id, productId: huevosVerdes.id, quantity: 1, price: 8.90 },
    
    // Pedido 2 - Carlos Rodríguez (pedidos[1])
    { orderId: pedidos[1].id, productId: polloEntero.id, quantity: 1, price: 18.50 },
    { orderId: pedidos[1].id, productId: cebollaBlanca.id, quantity: 2, price: 2.80 }
  ];

  console.log('\n📦 Creando items de pedidos...');
  for (const itemData of orderItemsData) {
    await prisma.orderItem.create({
      data: itemData
    });
  }
  console.log(`✅ ${orderItemsData.length} items de pedido creados`);
}

async function main() {
  try {
    console.log('🚀 Iniciando seeding inteligente de La Inmaculada...');

    // 1. Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.whatsappConversation.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.storeHours.deleteMany({});
    await prisma.store.deleteMany({});

    // 2. Crear tienda y horarios
    console.log('🏪 Creando tienda La Inmaculada...');
    const tienda = await prisma.store.create({
      data: tiendaData
    });

    // Crear horarios
    for (const horario of horariosData) {
      await prisma.storeHours.create({
        data: {
          ...horario,
          storeId: tienda.id
        }
      });
    }
    console.log(`✅ Tienda creada: ${tienda.name}`);

    // 3. Crear categorías
    console.log('🏷️  Creando categorías...');
    const categoriasCreadas = [];
    for (const categoriaData of categoriasData) {
      const categoria = await prisma.category.create({
        data: categoriaData
      });
      categoriasCreadas.push(categoria);
      console.log(`✅ Categoría: ${categoria.name}`);
    }

    // 4. Crear productos por categoría
    console.log('\n📦 Creando productos por categoría...');
    const productosCreados = [];
    
    for (const categoria of categoriasCreadas) {
      const productos = productosPorCategoria[categoria.name] || [];
      console.log(`\n🏷️  ${categoria.name}:`);
      
      for (const productoData of productos) {
        const producto = await prisma.product.create({
          data: {
            ...productoData,
            categoryId: categoria.id
          }
        });
        productosCreados.push(producto);
        console.log(`   ✅ ${producto.name} - S/ ${producto.price}`);
      }
    }

    // 5. Crear conversaciones WhatsApp
    console.log('\n💬 Creando conversaciones WhatsApp...');
    const conversacionesCreadas = [];
    for (const conversacionData of conversacionesData) {
      const conversacion = await prisma.whatsappConversation.create({
        data: conversacionData
      });
      conversacionesCreadas.push(conversacion);
      console.log(`✅ Conversación: ${conversacion.customerPhone}`);
    }

    // 6. Crear mensajes (después de crear conversaciones)
    await crearMensajes(conversacionesCreadas);

    // 7. Crear pedidos (después de crear conversaciones)
    const pedidosCreados = await crearPedidos(conversacionesCreadas);

    // 8. Crear items de pedidos (después de crear pedidos y productos)
    await crearOrderItems(pedidosCreados, productosCreados);

    // 9. Estadísticas finales
    console.log('\n📊 RESUMEN DE SEEDING:');
    console.log(`🏪 Tiendas creadas: 1`);
    console.log(`⏰ Horarios creados: ${horariosData.length}`);
    console.log(`🏷️  Categorías creadas: ${categoriasCreadas.length}`);
    console.log(`📦 Productos creados: ${productosCreados.length}`);
    console.log(`💬 Conversaciones creadas: ${conversacionesCreadas.length}`);
    console.log(`💭 Mensajes creados: 6`);
    console.log(`📋 Pedidos creados: ${pedidosCreados.length}`);
    console.log(`📦 Items de pedido creados: 4`);
    
    console.log('\n🏷️  PRODUCTOS POR CATEGORÍA:');
    for (const categoria of categoriasCreadas) {
      const count = productosPorCategoria[categoria.name]?.length || 0;
      console.log(`   ${categoria.name}: ${count} productos`);
    }

    console.log('\n✨ Seeding completado exitosamente!');
    console.log('🛒 La Inmaculada está lista para atender clientes!');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seeding
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });