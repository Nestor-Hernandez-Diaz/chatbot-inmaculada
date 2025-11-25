// src/controllers/stats.controller.js
const prisma = require('../config/database');
const botStats = require('../utils/botStats');
const { version } = require('../../package.json');

const getHealthStatus = (req, res) => {
  const stats = botStats.getStats();
  res.json({
    status: 'ok',
    servicio: 'Chatbot La Inmaculada',
    version,
    bot: botStats.client ? 'conectado' : 'desconectado',
    estadisticas: {
      mensajesRecibidos: stats.mensajesRecibidos,
      mensajesEnviados: stats.mensajesEnviados,
      consultasProcesadas: stats.consultasProcesadas,
      consultasProducto: stats.consultasProducto,
      conversacionesActivas: stats.conversacionesActivas,
      intencionesDetectadas: stats.intencionesDetectadas,
      tiempoActivo: stats.tiempoActivo,
      iniciadoEn: stats.iniciadoEn
    },
  });
};

const getStats = async (req, res) => {
  try {
    const totalProductos = await prisma.product.count();
    const totalCategorias = await prisma.category.count();
    const totalConversaciones = await prisma.whatsappConversation.count();
    
    const conversacionesHoy = await prisma.whatsappConversation.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const mensajesHoy = await prisma.message.count({
      where: {
        timestamp: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const ordenesPendientes = await prisma.order.count({
      where: {
        status: 'PENDING'
      }
    });

    const stats = botStats.getStats();

    res.json({
      bot: {
        mensajesRecibidos: stats.mensajesRecibidos,
        mensajesEnviados: stats.mensajesEnviados,
        consultasProcesadas: stats.consultasProcesadas,
        consultasProducto: stats.consultasProducto,
        conversacionesActivas: stats.conversacionesActivas,
        intencionesDetectadas: stats.intencionesDetectadas,
        tiempoActivo: stats.tiempoActivo,
        iniciadoEn: stats.iniciadoEn
      },
      base_datos: {
        productos: totalProductos,
        categorias: totalCategorias,
        conversaciones_totales: totalConversaciones,
        conversaciones_hoy: conversacionesHoy,
        mensajes_hoy: mensajesHoy,
        ordenes_pendientes: ordenesPendientes
      },
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

module.exports = {
  getHealthStatus,
  getStats,
};
