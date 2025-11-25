// src/controllers/conversation.controller.js
const prisma = require('../config/database');

const listConversations = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const conversaciones = await prisma.whatsappConversation.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          take: 5,
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    // Mapear a formato compatible
    const resultado = conversaciones.map(conv => ({
      id: conv.id,
      telefono: conv.customerPhone,
      estado: conv.status,
      fecha: conv.createdAt,
      mensajes: conv.messages.length,
      ultimoMensaje: conv.messages[0]?.content || null
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Error al listar conversaciones:', error);
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
};

module.exports = {
  listConversations,
};
