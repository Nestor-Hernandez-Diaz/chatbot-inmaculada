// scripts/verify-db.js
// Este script se conecta a la base de datos y lista los datos para verificar el seeding.

// Forzamos la carga del .env para anular cualquier variable global
require('dotenv').config({ override: true });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyData() {
  console.log('Iniciando verificación de datos en la base de datos...');
  try {
    await prisma.$connect();
    console.log('✅ Conexión exitosa.');

    // 1. Verificar Categorías
    const categories = await prisma.category.findMany();
    console.log('\n--- 📚 Categorías ---');
    console.table(categories);

    // 2. Verificar Productos
    const products = await prisma.product.findMany({
      include: { category: { select: { name: true } } },
    });
    console.log('\n--- 📦 Productos ---');
    console.table(products.map(p => ({ ...p, category: p.category.name })) );

    // 3. Verificar Tienda y Horarios
    const stores = await prisma.store.findMany({
      include: { hours: true },
    });
    console.log('\n--- 🏪 Tienda(s) ---');
    console.table(stores.map(s => ({ id: s.id, name: s.name, address: s.address, phone: s.phone })) );

    if (stores.length > 0) {
      console.log('\n--- ⏰ Horarios de la Tienda ---');
      const hours = stores.flatMap(s => s.hours).map(h => ({
        ...h,
        openTime: h.openTime.toLocaleTimeString('es-AR', { timeZone: 'UTC' }),
        closeTime: h.closeTime.toLocaleTimeString('es-AR', { timeZone: 'UTC' }),
      }));
      console.table(hours);
    }

    // 4. Verificar que otras tablas estén vacías
    const orders = await prisma.order.count();
    const conversations = await prisma.whatsappConversation.count();
    console.log('\n--- 📊 Otras Tablas ---');
    console.log(`- Órdenes: ${orders}`);
    console.log(`- Conversaciones: ${conversations}`);

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada. Verificación completada.');
  }
}

verifyData();
