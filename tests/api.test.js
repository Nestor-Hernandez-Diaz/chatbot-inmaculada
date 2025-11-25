// tests/api.test.js
// Tests básicos para endpoints HTTP del chatbot

const request = require('supertest');
const express = require('express');

// Crear app de prueba sin iniciar WhatsApp
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Importar rutas
  const routes = require('../src/routes');
  app.use('/', routes);
  
  return app;
};

describe('API Endpoints', () => {
  let app;

  beforeAll(() => {
    // Configurar variables de entorno para tests
    process.env.NODE_ENV = 'test';
    app = createTestApp();
  });

  describe('GET / (Health Check)', () => {
    it('debería responder con status ok', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('servicio', 'Chatbot La Inmaculada');
    });

    it('debería incluir información del bot', async () => {
      const response = await request(app).get('/');
      
      expect(response.body).toHaveProperty('bot');
      expect(response.body).toHaveProperty('estadisticas');
    });
  });

  describe('GET /stats (Estadísticas)', () => {
    it('debería responder con estadísticas del bot', async () => {
      const response = await request(app).get('/stats');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('bot');
      expect(response.body).toHaveProperty('base_datos');
    });

    it('debería incluir contadores de mensajes', async () => {
      const response = await request(app).get('/stats');
      
      expect(response.body.bot).toHaveProperty('mensajesRecibidos');
      expect(response.body.bot).toHaveProperty('mensajesEnviados');
    });
  });

  describe('GET /productos (Listado de productos)', () => {
    it('debería responder con array de productos', async () => {
      const response = await request(app).get('/productos');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('debería soportar búsqueda por término', async () => {
      const response = await request(app).get('/productos?buscar=leche');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('debería soportar filtro por categoría', async () => {
      const response = await request(app).get('/productos?categoria=bebidas');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /categorias (Listado de categorías)', () => {
    it('debería responder con array de categorías', async () => {
      const response = await request(app).get('/categorias');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /configuracion (Configuración del negocio)', () => {
    it('debería responder con array de configuraciones', async () => {
      const response = await request(app).get('/configuracion');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /conversaciones (Listado de conversaciones)', () => {
    it('debería responder con array de conversaciones', async () => {
      const response = await request(app).get('/conversaciones');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('debería soportar parámetro limit', async () => {
      const response = await request(app).get('/conversaciones?limit=10');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

describe('Error Handling', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('Rutas no existentes', () => {
    it('debería manejar rutas inexistentes (404 implícito o vacío)', async () => {
      const response = await request(app).get('/ruta-que-no-existe');
      
      // Express devuelve 404 por defecto para rutas no manejadas
      expect(response.status).toBe(404);
    });
  });

  describe('GET /productos/:id (Producto por ID)', () => {
    it('debería devolver 404 para producto inexistente', async () => {
      const response = await request(app).get('/productos/999999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
