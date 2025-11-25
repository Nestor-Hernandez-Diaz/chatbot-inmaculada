// src/controllers/category.controller.js
const prisma = require('../config/database');

const listCategories = async (req, res) => {
  try {
    const categorias = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Mapear a formato compatible con frontend
    const resultado = categorias.map(cat => ({
      id: cat.id,
      nombre: cat.name,
      descripcion: cat.description,
      icono: '📦', // Icono por defecto
      _count: { productos: cat._count.products }
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

module.exports = {
  listCategories,
};
