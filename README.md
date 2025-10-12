# 🤖 Chatbot La Inmaculada

Un chatbot inteligente de WhatsApp para el Supermercado La Inmaculada en Tarapoto, Perú.

## 📋 Descripción

Este chatbot permite a los clientes consultar:
- ✅ Disponibilidad de productos y stock
- ✅ Precios de productos
- ✅ Horarios de atención
- ✅ Ubicación del supermercado
- ✅ Información corporativa (misión, visión)
- ✅ Servicio de delivery
- ✅ Productos en oferta
- ✅ Categorías de productos

## 🛠️ Tecnologías

- **Backend:** Node.js + Express
- **Base de datos:** SQLite (desarrollo) / PostgreSQL (producción)
- **ORM:** Prisma
- **WhatsApp:** WPPConnect
- **Lenguaje:** JavaScript

## 🚀 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- PostgreSQL (para producción)

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/chatbot-inmaculada.git
cd chatbot-inmaculada
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

4. **Configurar base de datos**
```bash
# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Cargar datos iniciales
npm run db:seed
```

5. **Iniciar el servidor**
```bash
# Modo desarrollo (con reinicios automáticos)
npm run dev

# Modo estable (recomendado para producción)
npm run start:stable

# O usar el script de Windows
start-bot.bat
```

## 📱 Uso

1. **Iniciar el bot:**
   - Ejecuta `npm run start:stable` o `start-bot.bat`
   - Escanea el código QR con WhatsApp
   - El bot estará listo para recibir mensajes

2. **Comandos disponibles:**
   - `"Hola"` - Mensaje de bienvenida
   - `"¿Tienen leche?"` - Buscar productos
   - `"Horarios"` - Ver horarios de atención
   - `"Ofertas"` - Ver productos en oferta
   - `"Categorías"` - Listar categorías
   - `"Ubicación"` - Información de ubicación

3. **Detener el bot:**
   - Presiona `Ctrl+C` en la terminal
   - O ejecuta `stop-bot.bat`

## 🗂️ Estructura del Proyecto

```
chatbot-inmaculada/
├── src/
│   └── server.js          # Servidor principal
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.js           # Datos iniciales
├── .env                   # Variables de entorno
├── .gitignore            # Archivos a ignorar
├── package.json          # Dependencias y scripts
├── start-bot.bat         # Script de inicio (Windows)
├── stop-bot.bat          # Script de parada (Windows)
└── README.md             # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar con nodemon
npm run start:stable     # Iniciar modo estable

# Base de datos
npm run db:generate      # Generar cliente Prisma
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Cargar datos iniciales
npm run db:studio        # Abrir Prisma Studio
npm run db:reset         # Resetear base de datos

# Utilidades
npm run setup            # Configuración completa
```

## 📊 API Endpoints

- `GET /` - Estado del servidor
- `GET /stats` - Estadísticas del bot
- `GET /productos` - Listar productos
- `GET /productos?buscar=leche` - Buscar productos
- `GET /productos?categoria=lacteos` - Filtrar por categoría
- `GET /productos?enOferta=true` - Productos en oferta

## 🏪 Información del Negocio

- **Nombre:** Supermercado La Inmaculada
- **Ubicación:** Jr. San Martín 245, Tarapoto, San Martín, Perú
- **Horarios:** 
  - Lunes a Sábado: 7:00 AM - 9:00 PM
  - Domingo: 8:00 AM - 2:00 PM
- **Servicio:** Delivery disponible

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Nestor Hernández** - Estudiante Universitario
- Proyecto desarrollado para Supermercado La Inmaculada
- Tarapoto, San Martín, Perú

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

⭐ ¡No olvides darle una estrella al proyecto si te gusta!