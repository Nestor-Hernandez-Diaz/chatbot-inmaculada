// src/utils/botStats.js
let botStats = {
  client: null, // To hold the WhatsApp client instance
  mensajesRecibidos: 0,
  mensajesEnviados: 0,
  consultasProcesadas: 0,
  consultasProducto: 0,
  conversacionesActivas: 0,
  intencionesDetectadas: {
    saludo: 0,
    consulta_producto: 0,
    consulta_precio: 0,
    consulta_stock: 0,
    horarios: 0,
    ubicacion: 0,
    ofertas: 0,
    categorias: 0,
    pedido: 0,
    desconocido: 0
  },
  iniciadoEn: new Date(),
  
  // Métodos para actualizar estadísticas
  incrementarIntencion(intencion) {
    if (this.intencionesDetectadas.hasOwnProperty(intencion)) {
      this.intencionesDetectadas[intencion]++;
    } else {
      this.intencionesDetectadas.desconocido++;
    }
  },
  
  getStats() {
    return {
      ...this,
      uptime: Math.floor((new Date() - this.iniciadoEn) / 1000), // segundos
      tiempoActivo: this.formatUptime(new Date() - this.iniciadoEn)
    };
  },
  
  formatUptime(ms) {
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) return `${dias}d ${horas % 24}h ${minutos % 60}m`;
    if (horas > 0) return `${horas}h ${minutos % 60}m ${segundos % 60}s`;
    if (minutos > 0) return `${minutos}m ${segundos % 60}s`;
    return `${segundos}s`;
  }
};

module.exports = botStats;