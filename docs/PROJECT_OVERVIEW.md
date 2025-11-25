## Project Overview: Chatbot La Inmaculada

Este documento recoge un análisis detallado del estado actual del proyecto, su arquitectura, lógica de negocio, flujo de datos, endpoints públicos, problemas detectados y recomendaciones priorizadas.

**Resumen rápido:**
- Propósito: Chatbot de WhatsApp para consultar productos, precios, horarios y realizar pedidos para el "Supermercado La Inmaculada".
- Stack: Node.js + Express, Prisma (PostgreSQL), WPPConnect para WhatsApp, **Gemini AI (gemini-2.0-flash)** para análisis contextual avanzado.
- Punto de entrada: `src/server.js`.
- **Estado actual**: ✅ Servidor funcionando en puerto 3000, WhatsApp conectado, 42 productos en BD.

---

## 🧠 Sistema de IA y Veracidad

### Arquitectura de IA

El chatbot usa un sistema híbrido de detección de intenciones:

1. **Motor Local de Intenciones** (`ai-advanced.service.js`):
   - Patrones regex para detectar intenciones con scoring
   - Memoria conversacional por cliente (Map)
   - Análisis de sentimiento
   - Sistema de aprendizaje continuo

2. **Gemini AI (Google)** (`gemini-2.0-flash`):
   - Se activa cuando la confianza local < 60%
   - Recibe SIEMPRE el catálogo REAL de la BD
   - NUNCA inventa productos, precios o stock
   - Usa jerga selvática de Tarapoto (ñaño, pata, causa, pe, de una, bacán)

### Principio de Veracidad

```
⚠️ REGLA CRÍTICA: Gemini SIEMPRE recibe el catálogo REAL de productos
   antes de generar cualquier respuesta sobre productos.
```

**Métodos clave:**
- `getCatalogForGemini()`: Obtiene productos reales formateados de la BD
- `getProductResponseFormat()`: Formato estándar obligatorio para mostrar productos
- `ensureCatalogLoaded()`: Lazy-load del catálogo desde PostgreSQL

### Formato Estándar de Productos

Cuando se muestra UN producto:
```
📦 *[Nombre del Producto]*
💰 Precio: S/ [precio]
📦 Stock: [cantidad] unidades
🏷️ Categoría: [categoría]
```

Cuando se muestra LISTA de productos:
```
1. *[Nombre]* - S/ [precio] 🟢/🔴
2. *[Nombre]* - S/ [precio] 🟢/🔴
...
💡 ¿Cuál te llevo, ñaño?
```

### Jerga Selvática (San Martín/Tarapoto)

El bot usa expresiones auténticas de la selva peruana:
- **ñaño** / **pata** / **causa**: Formas de llamar al cliente
- **pe**: Sufijo común ("ya pe", "claro pe")
- **de una**: Confirmación rápida
- **bacán**: Algo bueno
- **asu**: Expresión de sorpresa

---

**1) Arquitectura y componentes**

- `src/server.js` : servidor Express, registro SIGINT y arranque de `initWhatsApp()`.
- `src/services/whatsapp.service.js` : cliente real de WPPConnect. Filtrado de mensajes (`filterMessage`), handler (`handleMessage`) y `initWhatsApp()` que crea el cliente y registra `onMessage`.
- `src/services/whatsapp-simulado.service.js` : cliente simulado para pruebas (envío/recepción simulada, `probarFlujoCompleto`). Útil para tests sin navegador.
- `src/services/conversation.service.js` : gestión de conversaciones, historial, guardado de mensajes y orquestación para pasar texto a la capa IA.
- `src/services/product.service.js` : lógica de consulta de productos, formato de respuestas para WhatsApp, comprobación de stock y búsquedas (usa Prisma).
- `src/services/ai-advanced.service.js` (y `ai-simple.service.js`) : motores de IA locales. `ai-advanced` incluye detección de intenciones, memoria conversacional, búsqueda semántica sobre catálogo en memoria y generación de respuestas.
- `src/utils/botStats.js` : métricas en memoria del bot (mensajes enviados/recibidos, intenciones detectadas, uptime, etc.).
- `src/config/database.js` : exporta `PrismaClient` (cliente Prisma importado por servicios).
- `src/routes/*` y `src/controllers/*` : API HTTP para salud, estadísticas, productos, categorías, conversaciones y configuración.
- `prisma/schema.prisma` y `prisma/seed.js` : modelo de datos (Category, Product, Order, Message, WhatsappConversation, etc.) y script de seed.
- `monitor-bot.js` : monitor externo que consulta `http://localhost:3000` periódicamente para saber el estado del bot.

---

**2) Flujo principal (mensaje entrante -> respuesta)**

1. Usuario envía mensaje a número del bot en WhatsApp.
2. WPPConnect invoca `client.onMessage(message)` y `whatsapp.service.handleMessage(message)`.
3. `handleMessage` aplica `filterMessage` para descartar: grupos, estados, mensajes sin cuerpo, tipos no deseados.
4. Si procede, se extraen metadatos (senderId, body, timestamp). Se incrementan contadores en `botStats`.
5. `handleMessage` delega a `conversationService.processIncomingMessage(senderId, botPhone, body)`.
6. `conversation.service`:
   - obtiene o crea una `WhatsappConversation` en DB (via Prisma),
   - guarda el mensaje entrante (`prisma.message.create`),
   - llama al motor de IA (`ai-advanced.service.analyzeMessage` / `analyzeIntent` + `generateAdvancedResponse`),
   - guarda la respuesta del bot en DB,
   - actualiza estadísticas (marca conversation NEEDS_ATTENTION si > 20 mensajes).
7. `handleMessage` envía la respuesta usando `botStats.client.sendText(...)` (el cliente proviene de WPPConnect) y actualiza métricas.

---

**3) Endpoints HTTP expuestos (según `src/routes`)**

- `GET /` : health/status (controller: `stats.controller.getHealthStatus`).
- `GET /stats` : métricas + conteos en DB.
- `GET /productos` , `GET /productos/:id`, `POST /productos`, `PUT /productos/:id` : CRUD básico (controllers en `product.controller.js`).
- `GET /categorias` : lista de categorías (controller `category.controller.js`).
- `GET /conversaciones` : listado de conversaciones.
- `GET /configuracion` : devuelve registros de configuración.

---

**4) Base de datos (Prisma)**

- `prisma/schema.prisma` define los modelos con nombres en inglés: `Category`, `Product`, `Order`, `OrderItem`, `WhatsappConversation`, `Message`, `Store`, `StoreHours`.
- `prisma/seed.js`/`seed-inteligente.js` crea categorías, productos, tienda y horarios (el package.json referencia `prisma/seed-inteligente.js` como `db:seed`, pero en el repo existe `prisma/seed.js`).

---

**5) Tests / utilidades**

- `test-bot.js` y `test-whatsapp.js`: scripts de prueba que llaman a endpoints o usan WPPConnect.
- `whatsapp-simulado.service.js` permite probar flujo sin WPPConnect.
- `monitor-bot.js` consulta salud del servidor cada 5s (pero apunta a puerto 3000 — ver inconsistencia abajo).

---

**6) Problemas e inconsistencias detectadas (importantes)**

1. Modelos Prisma (inglés) vs controladores (nombres en español):
   - Ejemplos: `category.controller.js` usa `prisma.categoria.findMany`, `conversation.controller.js` usa `prisma.conversacion.findMany`, `config.controller.js` usa `prisma.configuracion.findMany`.
   - En `schema.prisma` los modelos se llaman `Category`, `WhatsappConversation`, `Message`, `Store`, etc.
   - Impacto: llamadas a `prisma.categoria` o `prisma.conversacion` fallarán en tiempo de ejecución con error `Property 'categoria' does not exist on type PrismaClient` o `ModelNotFound`.

2. Puertos mal alineados entre scripts y servidor:
   - `src/server.js` arranca en `PORT || 9090`.
   - `monitor-bot.js` y `test-bot.js` usan `http://localhost:3000` (puerto 3000). Resultado: monitor y tests no encontrarán la API a menos que se ejecute en 3000.

3. `package.json` scripts refieren `prisma/seed-inteligente.js` (en `db:seed` y en `prisma.seed`), pero en el repo existe `prisma/seed.js`. Posible error en script o archivo duplicado renombrado.

4. `category.controller.js` y `conversation.controller.js` usan campos/propiedades inexistentes en el `schema.prisma` (ej. `orderBy: { fecha: 'desc' }` o `where: { activo: true }`). Deben alinearse con `createdAt`, `status`, etc.

5. Algunos módulos de IA (`ai-advanced.service.js`) son muy grandes y cargan catálogos en memoria (`loadProductCatalog`) usando Prisma al iniciar; esto puede ocasionar latencia al arranque y consumo de memoria para catálogos grandes.

6. Dependencias y versiones:
   - `@wppconnect-team/wppconnect` está presente. WPPConnect requiere Chrome/Chromium en el host y recursos (el repo tiene `tokens/` con perfil de navegador guardado).

7. Seguridad: archivos `tokens/` parecen contener perfiles/estado del navegador. Asegúrate de tener `tokens/` en `.gitignore` (no revisar en control de versiones) — en este repo parece estar en workspace, revisa `.gitignore`.

---

**7) Recomendaciones y plan de acciones priorizadas**

Prioridad alta (fix para que el proyecto pueda ejecutarse):

1. Alinear nombres Prisma <-> controladores:
   - Reemplazar referencias a `prisma.categoria`, `prisma.conversacion`, `prisma.configuracion` por `prisma.category`, `prisma.whatsappConversation`, `prisma.message` o crear mapeos/alias si se prefiere usar nombres en español.
   - Corregir campos: usar `createdAt`/`updatedAt` en lugar de `fecha` y `status`/`ConversationStatus` cuando corresponda.

2. Arreglar puertos usados por monitor/test o documentar la variable de entorno `PORT` para usar 3000 si quieres compatibilidad con `monitor-bot.js` y `test-bot.js`.
   - Cambiar `monitor-bot.js` para apuntar a `process.env.PORT || 9090` o ajustar `npm start` para arrancar en 3000 (ej. `PORT=3000 npm run start`).

3. Corregir script de seed en `package.json` para apuntar al archivo correcto (`prisma/seed.js`) o renombrar `seed.js` a `seed-inteligente.js` si ese era el objetivo.

Prioridad media (mejoras operativas):

4. Extraer la inicialización del catálogo pesada a un proceso asíncrono: no bloquear arranque del servidor; permitir respuesta rápida y carga lazy-on-demand.
5. Añadir validaciones y manejo de errores en los controllers para devolver errores consistentes (ya se hace en algunos, pero hay endpoints que suponen campos inexistentes).

Prioridad baja (mejoras de producto):

6. Añadir pruebas unitarias/integ. para rutas principales (`/`, `/productos`, `/stats`) usando `supertest`.
7. Añadir logs estructurados (p. ej. `pino`) y trazabilidad en IA para poder auditar decisiones de intención.

---

**8) Cómo ejecutar y verificar localmente**

1. Instalar dependencias:
```powershell
npm install
```

2. Generar cliente Prisma y migraciones (configurar `DATABASE_URL` en `.env`):
```powershell
npm run db:generate
npm run db:migrate
npm run db:seed # corregir el path si es necesario
```

3. Levantar servidor (desarrollo):
```powershell
npm run dev
# o
npm run start:stable
```

4. Verificar endpoints:
```powershell
curl http://localhost:9090/
curl http://localhost:9090/stats
curl http://localhost:9090/productos
```

Si quieres que `monitor-bot.js` y `test-bot.js` funcionen sin cambios, arranca el servidor en el puerto 3000:
```powershell
setx PORT 3000; # luego abrir nuevo terminal
npm run start:stable
```

---

**9) Archivos clave a revisar / corregir**

- `src/controllers/*.js` (alinear con `prisma/schema.prisma`)
- `package.json` (script `db:seed` path)
- `monitor-bot.js` y `test-bot.js` (puerto 3000 vs 9090)
- `src/services/ai-advanced.service.js` (carga de catálogo y tamaño — considerar límites o paginación)

---

Si quieres, puedo:

- Aplicar automáticamente un PR con cambios mínimos para alinear los nombres (ej. adaptar `category.controller.js` para usar `prisma.category`).
- Añadir un script `scripts/check-typst.ps1` (ya instalaste Typst CLI; puedo añadir verificación si lo quieres).
- Crear tests básicos con `supertest` para confirmar endpoints.

---

Fecha del análisis: 2025-11-25

Autor del análisis: Equipo automatizado (análisis estático del workspace)
