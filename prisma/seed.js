
// prisma/seed.js
require('dotenv').config({ override: true });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seeding...');

  // --- Crear Categorías ---
  console.log('Creando categorías...');
  const catBebidas = await prisma.category.upsert({
    where: { name: 'Bebidas' },
    update: {},
    create: { name: 'Bebidas', description: 'Gaseosas, aguas, jugos y más' },
  });

  const catLacteos = await prisma.category.upsert({
    where: { name: 'Lácteos y Huevos' },
    update: {},
    create: { name: 'Lácteos y Huevos', description: 'Leche, yogures, quesos y huevos' },
  });

  const catPanaderia = await prisma.category.upsert({
    where: { name: 'Panadería' },
    update: {},
    create: { name: 'Panadería', description: 'Pan fresco, facturas y pasteles' },
  });

  const catLimpieza = await prisma.category.upsert({
    where: { name: 'Limpieza del Hogar' },
    update: {},
    create: { name: 'Limpieza del Hogar', description: 'Detergentes, desinfectantes y más' },
  });

  // --- Limpiar Productos Antiguos ---
  console.log('Limpiando productos existentes...');
  await prisma.product.deleteMany({});

  // --- Crear Productos ---
  console.log('Creando productos...');
  await prisma.product.createMany({
    data: [
      { sku: 'BEB-G-001', name: 'Coca-Cola 2.5L', description: 'Gaseosa sabor cola descartable', price: 12.50, stock: 150, categoryId: catBebidas.id },
      { sku: 'BEB-A-002', name: 'Agua Mineral 1.5L', description: 'Agua sin gas de manantial', price: 5.00, stock: 200, categoryId: catBebidas.id },
      { sku: 'LAC-L-001', name: 'Leche Entera 1L', description: 'Leche fresca pasteurizada', price: 8.50, stock: 100, categoryId: catLacteos.id },
      { sku: 'LAC-Q-002', name: 'Queso Cremoso 1kg', description: 'Queso ideal para untar y cocinar', price: 45.00, stock: 50, categoryId: catLacteos.id },
      { sku: 'PAN-P-001', name: 'Pan de Molde Blanco', description: 'Pan lacteado ideal para sandwiches', price: 15.00, stock: 80, categoryId: catPanaderia.id },
      { sku: 'LIM-D-001', name: 'Detergente Líquido 500ml', description: 'Detergente para platos con limón', price: 9.75, stock: 120, categoryId: catLimpieza.id },
    ]
  });

  // --- Crear Tienda ---
  console.log('Creando información de la tienda...');
  const store = await prisma.store.upsert({
    where: { name: 'Supermercado La Inmaculada - Sucursal Centro' },
    update: {},
    create: {
      name: 'Supermercado La Inmaculada - Sucursal Centro',
      address: 'Av. Principal 123, Ciudad Central',
      phone: '+5491122334455'
    },
  });

  // --- Limpiar Horarios Antiguos ---
  console.log('Limpiando horarios existentes...');
  await prisma.storeHours.deleteMany({ where: { storeId: store.id } });

  // --- Crear Horarios ---
  // 0: Domingo, 1: Lunes, ..., 6: Sábado
  console.log('Creando horarios de la tienda...');
  await prisma.storeHours.createMany({
    data: [
      // Lunes a Viernes (8:00 - 21:00)
      { dayOfWeek: 1, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T21:00:00Z'), storeId: store.id },
      { dayOfWeek: 2, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T21:00:00Z'), storeId: store.id },
      { dayOfWeek: 3, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T21:00:00Z'), storeId: store.id },
      { dayOfWeek: 4, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T21:00:00Z'), storeId: store.id },
      { dayOfWeek: 5, openTime: new Date('1970-01-01T08:00:00Z'), closeTime: new Date('1970-01-01T21:00:00Z'), storeId: store.id },
      // Sábado (9:00 - 20:00)
      { dayOfWeek: 6, openTime: new Date('1970-01-01T09:00:00Z'), closeTime: new Date('1970-01-01T20:00:00Z'), storeId: store.id },
      // Domingo cerrado (no se crea registro)
    ]
  });

  console.log('✅ Seeding completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
