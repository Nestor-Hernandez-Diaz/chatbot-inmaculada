// prisma/seed.js
// Datos iniciales para el Supermercado La Inmaculada

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos iniciales...\n');

  // ==================== CONFIGURACIÓN DEL NEGOCIO ====================
  console.log('📋 Configurando información del negocio...');
  
  const configuraciones = [
    {
      clave: 'nombre_empresa',
      valor: 'Supermercado La Inmaculada',
      descripcion: 'Nombre oficial del supermercado'
    },
    {
      clave: 'direccion',
      valor: 'Jr. San Martín 245, Tarapoto, San Martín, Perú',
      descripcion: 'Dirección física del supermercado'
    },
    {
      clave: 'telefono',
      valor: '+51 42 123456',
      descripcion: 'Teléfono de contacto'
    },
    {
      clave: 'horario_atencion',
      valor: '📅 *Horarios de Atención:*\n\nLunes a Sábado: 7:00 AM - 9:00 PM\nDomingos: 8:00 AM - 2:00 PM\n\n¡Te esperamos! 😊',
      descripcion: 'Horarios de atención al público'
    },
    {
      clave: 'horario_delivery',
      valor: '🚚 *Servicio de Delivery:*\n\nLunes a Sábado: 8:00 AM - 8:00 PM\nDomingos: 8:00 AM - 1:00 PM\n\nPedido mínimo: S/. 30.00\nCosto de envío: S/. 5.00\n\n¡Llevamos tus compras hasta casa! 🏠',
      descripcion: 'Información del servicio de delivery'
    },
    {
      clave: 'google_maps',
      valor: 'https://maps.google.com/?q=Jr.+San+Martin+245,+Tarapoto',
      descripcion: 'Enlace de Google Maps'
    },
    {
      clave: 'mensaje_bienvenida',
      valor: '¡Hola! 👋 Bienvenido a *Supermercado La Inmaculada*\n\nSoy tu asistente virtual. ¿En qué puedo ayudarte?\n\n🛒 Consultar productos\n📦 Verificar stock\n🕐 Horarios\n📍 Ubicación\n🚚 Delivery\nℹ️ Sobre nosotros',
      descripcion: 'Mensaje de bienvenida del chatbot'
    },
    {
      clave: 'mision',
      valor: '🏪 *Nuestra Misión:*\n\nBrindar productos de calidad a precios justos, con un servicio excepcional que satisfaga las necesidades de nuestros clientes en Tarapoto y sus alrededores.',
      descripcion: 'Misión de la empresa'
    },
    {
      clave: 'vision',
      valor: '🌟 *Nuestra Visión:*\n\nSer el supermercado líder en Tarapoto, reconocido por nuestra calidad, variedad de productos y compromiso con la comunidad.',
      descripcion: 'Visión de la empresa'
    },
    {
      clave: 'valores',
      valor: '💎 *Nuestros Valores:*\n\n• Calidad en productos y servicio\n• Precios justos y accesibles\n• Atención personalizada\n• Compromiso con la comunidad\n• Innovación constante',
      descripcion: 'Valores corporativos'
    }
  ];

  for (const config of configuraciones) {
    await prisma.configuracion.upsert({
      where: { clave: config.clave },
      update: config,
      create: config
    });
  }

  console.log('✅ Configuración del negocio completada\n');

  // ==================== CATEGORÍAS DE PRODUCTOS ====================
  console.log('📂 Creando categorías de productos...');
  
  const categorias = [
    { nombre: 'Abarrotes', descripcion: 'Productos básicos de despensa', icono: '🍚', orden: 1 },
    { nombre: 'Lácteos', descripcion: 'Leche, quesos, yogures y derivados', icono: '🥛', orden: 2 },
    { nombre: 'Bebidas', descripcion: 'Refrescos, jugos, agua y bebidas alcohólicas', icono: '🥤', orden: 3 },
    { nombre: 'Carnes', descripcion: 'Carnes rojas, pollo, pescado y embutidos', icono: '🥩', orden: 4 },
    { nombre: 'Frutas y Verduras', descripcion: 'Productos frescos de temporada', icono: '🥬', orden: 5 },
    { nombre: 'Panadería', descripcion: 'Pan, pasteles y productos de repostería', icono: '🍞', orden: 6 },
    { nombre: 'Limpieza', descripcion: 'Productos de limpieza del hogar', icono: '🧽', orden: 7 },
    { nombre: 'Cuidado Personal', descripcion: 'Higiene personal y cosméticos', icono: '🧴', orden: 8 },
    { nombre: 'Snacks', descripcion: 'Galletas, dulces y aperitivos', icono: '🍿', orden: 9 },
    { nombre: 'Licores', descripcion: 'Bebidas alcohólicas y vinos', icono: '🍷', orden: 10 }
  ];

  const categoriasCreadas = [];
  for (const categoria of categorias) {
    const cat = await prisma.categoria.upsert({
      where: { nombre: categoria.nombre },
      update: categoria,
      create: categoria
    });
    categoriasCreadas.push(cat);
  }

  console.log('✅ Categorías creadas\n');

  // ==================== PRODUCTOS ====================
  console.log('🛒 Cargando productos...');

  const productos = [
    // ABARROTES
    { nombre: 'Arroz Extra', marca: 'Paisana', presentacion: '1kg', precio: 3.50, stock: 50, categoriaId: 1 },
    { nombre: 'Arroz Superior', marca: 'Don Vittorio', presentacion: '1kg', precio: 4.20, stock: 30, categoriaId: 1 },
    { nombre: 'Fideos Spaghetti', marca: 'Don Vittorio', presentacion: '500g', precio: 2.80, stock: 40, categoriaId: 1 },
    { nombre: 'Fideos Tallarín', marca: 'Don Vittorio', presentacion: '500g', precio: 2.80, stock: 35, categoriaId: 1 },
    { nombre: 'Aceite Vegetal', marca: 'Primor', presentacion: '1L', precio: 8.50, stock: 25, categoriaId: 1 },
    { nombre: 'Aceite de Oliva', marca: 'Primor', presentacion: '500ml', precio: 12.90, stock: 15, categoriaId: 1 },
    { nombre: 'Azúcar Blanca', marca: 'Cartavio', presentacion: '1kg', precio: 3.20, stock: 60, categoriaId: 1 },
    { nombre: 'Sal Marina', marca: 'Cusco', presentacion: '1kg', precio: 1.80, stock: 45, categoriaId: 1 },
    { nombre: 'Avena', marca: 'Quaker', presentacion: '500g', precio: 4.50, stock: 20, categoriaId: 1 },
    { nombre: 'Café Instantáneo', marca: 'Nescafé', presentacion: '200g', precio: 8.90, stock: 30, categoriaId: 1 },
    { nombre: 'Café Molido', marca: 'Lavazza', presentacion: '250g', precio: 15.50, stock: 12, categoriaId: 1 },
    { nombre: 'Cacao en Polvo', marca: 'Nesquik', presentacion: '400g', precio: 6.80, stock: 18, categoriaId: 1 },
    { nombre: 'Harina de Trigo', marca: 'Molitalia', presentacion: '1kg', precio: 2.90, stock: 40, categoriaId: 1 },
    { nombre: 'Lentejas', marca: 'Don Vittorio', presentacion: '500g', precio: 3.20, stock: 25, categoriaId: 1 },
    { nombre: 'Frijoles', marca: 'Don Vittorio', presentacion: '500g', precio: 3.50, stock: 22, categoriaId: 1 },
    { nombre: 'Garbanzos', marca: 'Don Vittorio', presentacion: '500g', precio: 3.80, stock: 20, categoriaId: 1 },
    { nombre: 'Atún en Lata', marca: 'Primor', presentacion: '160g', precio: 4.50, stock: 35, categoriaId: 1 },
    { nombre: 'Sardinas en Lata', marca: 'Primor', presentacion: '120g', precio: 3.20, stock: 30, categoriaId: 1 },
    { nombre: 'Conserva de Pollo', marca: 'Primor', presentacion: '160g', precio: 5.80, stock: 25, categoriaId: 1 },

    // LÁCTEOS
    { nombre: 'Leche Entera', marca: 'Gloria', presentacion: '1L', precio: 4.20, stock: 50, categoriaId: 2 },
    { nombre: 'Leche Deslactosada', marca: 'Gloria', presentacion: '1L', precio: 4.80, stock: 30, categoriaId: 2 },
    { nombre: 'Leche Descremada', marca: 'Laive', presentacion: '1L', precio: 4.50, stock: 25, categoriaId: 2 },
    { nombre: 'Leche Condensada', marca: 'Gloria', presentacion: '400g', precio: 3.80, stock: 40, categoriaId: 2 },
    { nombre: 'Leche Evaporada', marca: 'Gloria', presentacion: '400g', precio: 3.50, stock: 35, categoriaId: 2 },
    { nombre: 'Yogurt Natural', marca: 'Gloria', presentacion: '1L', precio: 5.90, stock: 20, categoriaId: 2 },
    { nombre: 'Yogurt de Fresa', marca: 'Laive', presentacion: '1L', precio: 6.20, stock: 18, categoriaId: 2 },
    { nombre: 'Queso Fresco', marca: 'Laive', presentacion: '200g', precio: 4.50, stock: 15, categoriaId: 2 },
    { nombre: 'Queso Edam', marca: 'Gloria', presentacion: '200g', precio: 6.80, stock: 12, categoriaId: 2 },
    { nombre: 'Mantequilla', marca: 'Gloria', presentacion: '200g', precio: 5.50, stock: 20, categoriaId: 2 },
    { nombre: 'Margarina', marca: 'Primor', presentacion: '200g', precio: 3.80, stock: 25, categoriaId: 2 },
    { nombre: 'Huevos', marca: 'Granja', presentacion: '30 unidades', precio: 8.50, stock: 40, categoriaId: 2 },

    // BEBIDAS
    { nombre: 'Inca Kola', marca: 'Inca Kola', presentacion: '500ml', precio: 2.50, stock: 60, categoriaId: 3 },
    { nombre: 'Coca Cola', marca: 'Coca Cola', presentacion: '500ml', precio: 2.80, stock: 50, categoriaId: 3 },
    { nombre: 'Sprite', marca: 'Coca Cola', presentacion: '500ml', precio: 2.80, stock: 45, categoriaId: 3 },
    { nombre: 'Fanta', marca: 'Coca Cola', presentacion: '500ml', precio: 2.80, stock: 40, categoriaId: 3 },
    { nombre: 'Agua Mineral', marca: 'San Luis', presentacion: '625ml', precio: 1.50, stock: 80, categoriaId: 3 },
    { nombre: 'Jugo de Naranja', marca: 'Gloria', presentacion: '1L', precio: 4.50, stock: 25, categoriaId: 3 },
    { nombre: 'Jugo de Manzana', marca: 'Gloria', presentacion: '1L', precio: 4.50, stock: 20, categoriaId: 3 },
    { nombre: 'Gatorade', marca: 'Gatorade', presentacion: '500ml', precio: 3.50, stock: 30, categoriaId: 3 },
    { nombre: 'Powerade', marca: 'Powerade', presentacion: '500ml', precio: 3.20, stock: 25, categoriaId: 3 },
    { nombre: 'Cerveza Pilsen', marca: 'Pilsen', presentacion: '355ml', precio: 2.80, stock: 50, categoriaId: 3 },
    { nombre: 'Cerveza Cristal', marca: 'Cristal', presentacion: '355ml', precio: 2.80, stock: 45, categoriaId: 3 },
    { nombre: 'Vino Tinto', marca: 'Tacama', presentacion: '750ml', precio: 18.90, stock: 15, categoriaId: 3 },

    // CARNES
    { nombre: 'Pollo Entero', marca: 'Granja', presentacion: '1kg', precio: 8.50, stock: 20, categoriaId: 4 },
    { nombre: 'Pechuga de Pollo', marca: 'Granja', presentacion: '1kg', precio: 12.90, stock: 15, categoriaId: 4 },
    { nombre: 'Carne de Res', marca: 'Frigorífico', presentacion: '1kg', precio: 18.50, stock: 12, categoriaId: 4 },
    { nombre: 'Chorizo', marca: 'Don Fernando', presentacion: '500g', precio: 6.80, stock: 18, categoriaId: 4 },
    { nombre: 'Jamón', marca: 'Don Fernando', presentacion: '200g', precio: 4.50, stock: 25, categoriaId: 4 },
    { nombre: 'Salchichas', marca: 'Don Fernando', presentacion: '400g', precio: 5.20, stock: 20, categoriaId: 4 },
    { nombre: 'Pescado Fresco', marca: 'Marino', presentacion: '1kg', precio: 15.90, stock: 8, categoriaId: 4 },
    { nombre: 'Hígado', marca: 'Frigorífico', presentacion: '500g', precio: 8.90, stock: 10, categoriaId: 4 },

    // FRUTAS Y VERDURAS
    { nombre: 'Plátano', marca: 'Fresco', presentacion: '1kg', precio: 2.50, stock: 30, categoriaId: 5 },
    { nombre: 'Manzana', marca: 'Fresco', presentacion: '1kg', precio: 4.50, stock: 25, categoriaId: 5 },
    { nombre: 'Naranja', marca: 'Fresco', presentacion: '1kg', precio: 3.20, stock: 35, categoriaId: 5 },
    { nombre: 'Papa', marca: 'Fresco', presentacion: '1kg', precio: 2.80, stock: 40, categoriaId: 5 },
    { nombre: 'Cebolla', marca: 'Fresco', presentacion: '1kg', precio: 3.50, stock: 30, categoriaId: 5 },
    { nombre: 'Tomate', marca: 'Fresco', presentacion: '1kg', precio: 4.20, stock: 25, categoriaId: 5 },
    { nombre: 'Lechuga', marca: 'Fresco', presentacion: '1 unidad', precio: 1.50, stock: 20, categoriaId: 5 },
    { nombre: 'Zanahoria', marca: 'Fresco', presentacion: '1kg', precio: 2.90, stock: 25, categoriaId: 5 },
    { nombre: 'Limón', marca: 'Fresco', presentacion: '1kg', precio: 3.80, stock: 30, categoriaId: 5 },
    { nombre: 'Ajo', marca: 'Fresco', presentacion: '100g', precio: 2.50, stock: 20, categoriaId: 5 },

    // PANADERÍA
    { nombre: 'Pan de Molde', marca: 'Bimbo', presentacion: '500g', precio: 3.50, stock: 25, categoriaId: 6 },
    { nombre: 'Pan Integral', marca: 'Bimbo', presentacion: '500g', precio: 4.20, stock: 20, categoriaId: 6 },
    { nombre: 'Croissant', marca: 'Bimbo', presentacion: '6 unidades', precio: 5.80, stock: 15, categoriaId: 6 },
    { nombre: 'Galletas de Soda', marca: 'Crackers', presentacion: '200g', precio: 2.80, stock: 30, categoriaId: 6 },
    { nombre: 'Galletas de Chocolate', marca: 'Oreo', presentacion: '150g', precio: 4.50, stock: 25, categoriaId: 6 },
    { nombre: 'Torta de Chocolate', marca: 'Donofrio', presentacion: '1 unidad', precio: 8.90, stock: 10, categoriaId: 6 },
    { nombre: 'Helado de Vainilla', marca: 'Donofrio', presentacion: '1L', precio: 12.50, stock: 8, categoriaId: 6 },

    // LIMPIEZA
    { nombre: 'Detergente', marca: 'Ace', presentacion: '1L', precio: 6.50, stock: 30, categoriaId: 7 },
    { nombre: 'Jabón de Tocador', marca: 'Dove', presentacion: '90g', precio: 3.80, stock: 40, categoriaId: 7 },
    { nombre: 'Shampoo', marca: 'Pantene', presentacion: '400ml', precio: 8.90, stock: 25, categoriaId: 7 },
    { nombre: 'Papel Higiénico', marca: 'Scott', presentacion: '4 rollos', precio: 4.50, stock: 35, categoriaId: 7 },
    { nombre: 'Papel Toalla', marca: 'Scott', presentacion: '2 rollos', precio: 3.20, stock: 30, categoriaId: 7 },
    { nombre: 'Cloro', marca: 'Clorox', presentacion: '1L', precio: 2.80, stock: 25, categoriaId: 7 },
    { nombre: 'Suavizante', marca: 'Suavitel', presentacion: '1L', precio: 5.50, stock: 20, categoriaId: 7 },
    { nombre: 'Desinfectante', marca: 'Lysol', presentacion: '500ml', precio: 4.20, stock: 18, categoriaId: 7 },

    // CUIDADO PERSONAL
    { nombre: 'Cepillo de Dientes', marca: 'Colgate', presentacion: '1 unidad', precio: 3.50, stock: 30, categoriaId: 8 },
    { nombre: 'Pasta Dental', marca: 'Colgate', presentacion: '150g', precio: 4.80, stock: 40, categoriaId: 8 },
    { nombre: 'Desodorante', marca: 'Rexona', presentacion: '150ml', precio: 6.50, stock: 25, categoriaId: 8 },
    { nombre: 'Crema Corporal', marca: 'Nivea', presentacion: '400ml', precio: 8.90, stock: 20, categoriaId: 8 },
    { nombre: 'Protector Solar', marca: 'Nivea', presentacion: '200ml', precio: 12.50, stock: 15, categoriaId: 8 },
    { nombre: 'Pañales', marca: 'Huggies', presentacion: 'Talla M', precio: 18.90, stock: 20, categoriaId: 8 },
    { nombre: 'Toallas Higiénicas', marca: 'Always', presentacion: '10 unidades', precio: 6.80, stock: 25, categoriaId: 8 },

    // SNACKS
    { nombre: 'Papas Fritas', marca: 'Lay\'s', presentacion: '150g', precio: 3.50, stock: 40, categoriaId: 9 },
    { nombre: 'Doritos', marca: 'Doritos', presentacion: '150g', precio: 3.80, stock: 35, categoriaId: 9 },
    { nombre: 'Chifles', marca: 'Inka Chips', presentacion: '100g', precio: 2.50, stock: 30, categoriaId: 9 },
    { nombre: 'Chocolate', marca: 'Hershey\'s', presentacion: '43g', precio: 2.80, stock: 25, categoriaId: 9 },
    { nombre: 'Caramelos', marca: 'Halls', presentacion: '50g', precio: 1.50, stock: 50, categoriaId: 9 },
    { nombre: 'Chicles', marca: 'Trident', presentacion: '14 unidades', precio: 3.20, stock: 30, categoriaId: 9 },
    { nombre: 'Nueces', marca: 'Natura', presentacion: '200g', precio: 8.50, stock: 15, categoriaId: 9 },
    { nombre: 'Maní', marca: 'Natura', presentacion: '200g', precio: 4.50, stock: 20, categoriaId: 9 },

    // LICORES
    { nombre: 'Pisco', marca: 'Queirolo', presentacion: '750ml', precio: 25.90, stock: 12, categoriaId: 10 },
    { nombre: 'Ron', marca: 'Bacardí', presentacion: '750ml', precio: 18.50, stock: 15, categoriaId: 10 },
    { nombre: 'Whisky', marca: 'Johnnie Walker', presentacion: '750ml', precio: 45.90, stock: 8, categoriaId: 10 },
    { nombre: 'Vodka', marca: 'Absolut', presentacion: '750ml', precio: 32.50, stock: 10, categoriaId: 10 },
    { nombre: 'Vino Blanco', marca: 'Tacama', presentacion: '750ml', precio: 16.90, stock: 12, categoriaId: 10 },
    { nombre: 'Champagne', marca: 'Moët', presentacion: '750ml', precio: 89.90, stock: 5, categoriaId: 10 }
  ];

  // Agregar algunos productos en oferta
  const productosConOferta = productos.map((producto, index) => {
    if (index % 8 === 0) { // Cada 8 productos, uno en oferta
      return {
        ...producto,
        enOferta: true,
        precioOferta: Number((producto.precio * 0.85).toFixed(2)) // 15% de descuento
      };
    }
    return producto;
  });

  for (const producto of productosConOferta) {
    await prisma.producto.create({
      data: producto
    });
  }

  console.log('✅ Productos cargados exitosamente\n');

  // ==================== MÉTRICAS INICIALES ====================
  console.log('📊 Creando métricas iniciales...');
  
  const hoy = new Date();
  await prisma.metricaDiaria.upsert({
    where: { fecha: hoy },
    update: {
      consultasTotales: 0,
      productosConsultados: 0,
      clientesUnicos: 0
    },
    create: {
      fecha: hoy,
      consultasTotales: 0,
      productosConsultados: 0,
      clientesUnicos: 0
    }
  });

  console.log('✅ Métricas iniciales creadas\n');

  console.log('🎉 ¡Datos iniciales cargados exitosamente!');
  console.log(`📊 Resumen:`);
  console.log(`   • ${configuraciones.length} configuraciones`);
  console.log(`   • ${categorias.length} categorías`);
  console.log(`   • ${productos.length} productos`);
  console.log(`   • ${productosConOferta.filter(p => p.enOferta).length} productos en oferta`);
}

main()
  .catch((e) => {
    console.error('❌ Error al cargar datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });