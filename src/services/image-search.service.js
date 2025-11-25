// src/services/image-search.service.js
// Servicio de búsqueda de productos por imagen usando Gemini Vision
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../config/database');
const fetch = require('node-fetch');

class ImageSearchService {
  constructor() {
    this.enabled = !!process.env.GOOGLE_API_KEY;
    
    if (this.enabled) {
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      // Gemini 2.0 Flash soporta visión de forma nativa
      this.visionModel = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      console.log('🖼️ Servicio de búsqueda por imagen activado (Gemini Vision)');
    } else {
      console.log('⚠️ Búsqueda por imagen no disponible - falta GOOGLE_API_KEY');
    }
    
    // Cache del catálogo
    this.productCatalog = null;
  }

  /**
   * Carga el catálogo de productos para comparar
   */
  async ensureCatalogLoaded() {
    if (!this.productCatalog) {
      this.productCatalog = await prisma.product.findMany({
        include: { category: true }
      });
      console.log(`📦 Catálogo cargado para búsqueda visual: ${this.productCatalog.length} productos`);
    }
    return this.productCatalog;
  }

  /**
   * Obtiene el catálogo formateado para el prompt de Gemini
   */
  async getCatalogList() {
    await this.ensureCatalogLoaded();
    
    // Agrupar por categoría
    const byCategory = {};
    for (const p of this.productCatalog) {
      const cat = p.category.name;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(p.name);
    }
    
    let list = '';
    for (const [cat, products] of Object.entries(byCategory)) {
      list += `\n${cat}: ${products.join(', ')}`;
    }
    
    return list;
  }

  /**
   * Descarga una imagen desde URL y la convierte a base64
   * @param {string} url - URL de la imagen
   * @returns {Promise<{base64: string, mimeType: string}>}
   */
  async downloadImageAsBase64(url) {
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      const base64 = buffer.toString('base64');
      
      // Detectar tipo MIME
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      
      return {
        base64,
        mimeType: contentType.split(';')[0]
      };
    } catch (error) {
      console.error('❌ Error descargando imagen:', error.message);
      throw new Error('No se pudo descargar la imagen');
    }
  }

  /**
   * Analiza una imagen y busca el producto en el catálogo
   * @param {string} imageUrl - URL de la imagen de WhatsApp
   * @param {string} customerPhone - Teléfono del cliente (para contexto)
   * @returns {Promise<Object>} - Resultado del análisis
   */
  async analyzeProductImage(imageUrl, customerPhone) {
    if (!this.enabled) {
      return {
        success: false,
        message: '😅 *¡Asu, ñaño!* La búsqueda por imagen no está disponible ahorita.',
        products: []
      };
    }

    try {
      console.log('🖼️ Analizando imagen de producto...');
      
      // 1. Descargar imagen
      const { base64, mimeType } = await downloadImageAsBase64(imageUrl);
      console.log(`📥 Imagen descargada: ${mimeType}, ${Math.round(base64.length/1024)}KB`);
      
      // 2. Obtener catálogo para contexto
      const catalogList = await this.getCatalogList();
      
      // 3. Crear prompt para Gemini Vision
      const prompt = `
Eres un asistente de supermercado en Perú. Analiza esta imagen de producto.

CATÁLOGO DISPONIBLE (solo puedes identificar estos productos):
${catalogList}

INSTRUCCIONES:
1. Identifica qué producto de supermercado aparece en la imagen
2. Si es un producto de marca peruana (Gloria, Inca Kola, etc.), menciónalo
3. Busca el producto más similar en el catálogo
4. Si no puedes identificar o no está en el catálogo, dilo claramente

Responde SOLO con JSON:
{
  "identified": true/false,
  "product_name": "nombre del producto identificado",
  "brand": "marca si es visible",
  "category": "categoría del producto",
  "confidence": 0.85,
  "catalog_matches": ["nombre exacto producto 1 del catálogo", "nombre exacto producto 2"],
  "description": "descripción breve de lo que ves en la imagen"
}

Si NO puedes identificar:
{
  "identified": false,
  "product_name": null,
  "brand": null,
  "category": null,
  "confidence": 0,
  "catalog_matches": [],
  "description": "descripción de lo que ves",
  "reason": "razón por la que no se pudo identificar"
}`;

      // 4. Enviar a Gemini Vision
      const result = await this.visionModel.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64
          }
        }
      ]);
      
      const responseText = result.response.text();
      console.log('🤖 Respuesta de Gemini Vision:', responseText.substring(0, 200));
      
      // 5. Parsear respuesta JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se pudo parsear la respuesta de Gemini');
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      
      // 6. Buscar productos en el catálogo real
      const matchedProducts = [];
      
      if (analysis.identified && analysis.catalog_matches && analysis.catalog_matches.length > 0) {
        await this.ensureCatalogLoaded();
        
        for (const matchName of analysis.catalog_matches) {
          // Buscar coincidencia exacta o parcial
          const found = this.productCatalog.find(p => 
            p.name.toLowerCase().includes(matchName.toLowerCase().split(' ')[0]) ||
            matchName.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
          );
          
          if (found && !matchedProducts.find(m => m.id === found.id)) {
            matchedProducts.push(found);
          }
        }
        
        // Si no encontró por nombre exacto, buscar por categoría
        if (matchedProducts.length === 0 && analysis.category) {
          const categoryProducts = this.productCatalog.filter(p =>
            p.category.name.toLowerCase().includes(analysis.category.toLowerCase())
          ).slice(0, 5);
          matchedProducts.push(...categoryProducts);
        }
      }
      
      // 7. Formatear respuesta
      return this.formatImageSearchResponse(analysis, matchedProducts);
      
    } catch (error) {
      console.error('❌ Error en análisis de imagen:', error.message);
      return {
        success: false,
        message: `😅 *¡Asu, ñaño!* No pude analizar la imagen. ¿Puedes enviarla de nuevo o describirme qué producto buscas?`,
        products: [],
        error: error.message
      };
    }
  }

  /**
   * Formatea la respuesta de búsqueda por imagen
   */
  formatImageSearchResponse(analysis, products) {
    if (!analysis.identified && !analysis.success) {
      let message = `🔍 *Analizando imagen...*\n\n`;
      message += `📷 Veo: ${analysis.description || analysis.productIdentified || 'No pude identificar claramente el producto'}\n\n`;
      
      if (analysis.reason) {
        message += `⚠️ ${analysis.reason}\n\n`;
      }
      
      message += `💡 *¿Puedes ayudarme, ñaño?*\n`;
      message += `• Envía otra foto más clara\n`;
      message += `• O dime el nombre del producto que buscas`;
      
      return {
        success: false,
        message,
        products: [],
        analysis
      };
    }
    
    // Producto identificado exitosamente
    const productName = analysis.product_name || analysis.productIdentified;
    let message = `🔍 *¡Imagen analizada, pues!* 🦜\n\n`;
    message += `📷 Detecté: *${productName}*`;
    
    if (analysis.brand) {
      message += ` (${analysis.brand})`;
    }
    
    const confidence = analysis.confidence || 0.85;
    message += `\n📊 Confianza: ${Math.round(confidence * 100)}%\n\n`;
    
    if (products.length > 0) {
      message += `📋 *Encontré ${products.length} producto${products.length > 1 ? 's' : ''} en nuestro catálogo:*\n\n`;
      
      products.forEach((p, index) => {
        const stockEmoji = p.stock > 0 ? '🟢' : '🔴';
        message += `${index + 1}. *${p.name}*\n`;
        message += `   💰 S/ ${parseFloat(p.price).toFixed(2)} ${stockEmoji} (${p.stock} disp.)\n`;
      });
      
      message += `\n💡 *¿Cuál te interesa, ñaño?* Dime el número o el nombre y te doy más detalles.`;
    } else {
      message += `😅 No encontré ese producto exacto en nuestro catálogo.\n`;
      message += `💡 ¿Quieres que busque algo similar? Escríbeme qué necesitas, parcero.`;
    }
    
    return {
      success: true,
      message,
      products,
      analysis
    };
  }

  /**
   * Busca productos en el catálogo basándose en el análisis de imagen
   * @param {Object} analysis - Resultado del análisis de imagen
   * @returns {Promise<Array>} - Productos encontrados
   */
  async searchProductsFromAnalysis(analysis) {
    await this.ensureCatalogLoaded();
    const matchedProducts = [];
    
    // Extraer términos de búsqueda del análisis
    const searchTerms = [];
    
    // Soportar ambos formatos (API y mock)
    if (analysis.productIdentified) {
      searchTerms.push(analysis.productIdentified);
    }
    if (analysis.product_name) {
      searchTerms.push(analysis.product_name);
    }
    if (analysis.category) {
      searchTerms.push(analysis.category);
    }
    if (analysis.brand) {
      searchTerms.push(analysis.brand);
    }
    if (analysis.attributes) {
      searchTerms.push(...analysis.attributes);
    }
    if (analysis.catalog_matches) {
      searchTerms.push(...analysis.catalog_matches);
    }
    
    // Buscar productos que coincidan
    for (const term of searchTerms.filter(Boolean)) {
      const termLower = term.toLowerCase();
      
      const found = this.productCatalog.filter(p =>
        p.name.toLowerCase().includes(termLower) ||
        termLower.split(' ').some(word => 
          word.length > 2 && p.name.toLowerCase().includes(word)
        )
      );
      
      for (const product of found) {
        if (!matchedProducts.find(m => m.id === product.id)) {
          // Calcular score de relevancia
          product._matchScore = this.calculateMatchScore(product, analysis);
          matchedProducts.push(product);
        }
      }
    }
    
    // Si no encontró nada, buscar por categoría
    if (matchedProducts.length === 0 && analysis.category) {
      const categoryProducts = this.productCatalog.filter(p =>
        p.category?.name?.toLowerCase().includes(analysis.category.toLowerCase())
      ).slice(0, 5);
      matchedProducts.push(...categoryProducts);
    }
    
    // Ordenar por relevancia y limitar resultados
    return matchedProducts
      .sort((a, b) => (b._matchScore || 0) - (a._matchScore || 0))
      .slice(0, 5);
  }

  /**
   * Calcula el score de coincidencia para ordenar resultados
   */
  calculateMatchScore(product, analysis) {
    let score = 0;
    const productName = product.name.toLowerCase();
    
    // Coincidencia exacta de nombre
    const searchName = (analysis.productIdentified || analysis.product_name || '').toLowerCase();
    if (searchName && productName.includes(searchName)) {
      score += 100;
    }
    
    // Coincidencia de marca
    if (analysis.brand && productName.includes(analysis.brand.toLowerCase())) {
      score += 50;
    }
    
    // Coincidencia de categoría
    if (analysis.category && product.category?.name?.toLowerCase().includes(analysis.category.toLowerCase())) {
      score += 30;
    }
    
    // Coincidencia de atributos
    if (analysis.attributes) {
      for (const attr of analysis.attributes) {
        if (productName.includes(attr.toLowerCase())) {
          score += 10;
        }
      }
    }
    
    return score;
  }
}

/**
 * Función helper para descargar imagen (standalone para usar en el servicio)
 */
async function downloadImageAsBase64(url) {
  try {
    // Usar fetch dinámico para compatibilidad
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;
    
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    return {
      base64,
      mimeType: contentType.split(';')[0]
    };
  } catch (error) {
    console.error('❌ Error descargando imagen:', error.message);
    throw new Error('No se pudo descargar la imagen');
  }
}

// Exportar instancia única
const imageSearchService = new ImageSearchService();

module.exports = {
  // Instancia del servicio
  imageSearchService,
  // Métodos principales exportados directamente
  analyzeProductImage: imageSearchService.analyzeProductImage.bind(imageSearchService),
  searchProductsFromAnalysis: imageSearchService.searchProductsFromAnalysis.bind(imageSearchService),
  formatImageSearchResponse: imageSearchService.formatImageSearchResponse.bind(imageSearchService),
  downloadImageAsBase64
};
