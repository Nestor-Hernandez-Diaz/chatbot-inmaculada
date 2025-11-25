// src/controllers/config.controller.js
const prisma = require('../config/database');

/**
 * Devuelve la configuración del negocio basada en Store y StoreHours.
 * Como no existe modelo 'Configuracion' en Prisma, construimos la config
 * a partir de los datos de la tienda.
 */
const listConfig = async (req, res) => {
  try {
    const store = await prisma.store.findFirst({
      include: {
        hours: true
      }
    });

    if (!store) {
      return res.json([]);
    }

    // Formatear horarios
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const horariosFormateados = store.hours.map(h => ({
      dia: diasSemana[h.dayOfWeek],
      abre: h.openTime.toISOString().substring(11, 16),
      cierra: h.closeTime.toISOString().substring(11, 16)
    }));

    // Construir configuración como array clave-valor (compatible con frontend)
    const config = [
      { clave: 'nombre_empresa', valor: store.name },
      { clave: 'direccion', valor: store.address || 'No especificada' },
      { clave: 'telefono', valor: store.phone || 'No especificado' },
      { clave: 'horario_atencion', valor: JSON.stringify(horariosFormateados) }
    ];

    res.json(config);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};

module.exports = {
  listConfig,
};
