// src/services/product.service.js
const prisma = require('../config/database');
const aiService = require('./ai.service');

class ProductService {
  /**
   * Obtiene todos los productos con filtros opcionales
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>} - Lista de productos
   */
  async getAllProducts(filters = {}) {
    try {
      const where = {};
      
      // Filtro por búsqueda
      if (filters.buscar) {
        where.name = {
          contains: filters.buscar,
          mode: 'insensitive'
        };
      }
      
      // Filtro por categoría
      if (filters.categoria) {
        where.category = {
          name: {
            contains: filters.categoria,
            mode: 'insensitive'
          }
        };
      }
      
      // Filtro por ofertas (stock bajo)
      if (filters.enOferta === 'true') {
        where.stock = {
          gt: 0,
          lt: 10
        };
      }
      
      const products = await prisma.product.findMany({
        where,
        include: {
          category: true
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      return products;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  }

  /**
   * Busca productos de forma inteligente usando IA
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Object>} - Resultados de búsqueda
   */
  async searchProducts(searchTerm) {
    try {
      // Optimizar el término de búsqueda con IA
      const optimizedSearch = await aiService.optimizeProductSearch(searchTerm);
      
      console.log(`🔍 Búsqueda optimizada: "${optimizedSearch.optimized}" (confianza: ${optimizedSearch.confidence})`);
      
      // Buscar por nombre exacto primero
      const exactMatches = await prisma.product.findMany({
        where: {
          name: {
            contains: optimizedSearch.optimized,
            mode: 'insensitive'
          }
        },
        include: {
          category: true
        },
        take: 5
      });
      
      // Si no hay coincidencias exactas, buscar por sinónimos
      if (exactMatches.length === 0 && optimizedSearch.synonyms.length > 0) {
        const synonymMatches = await prisma.product.findMany({
          where: {
            OR: [
              ...optimizedSearch.synonyms.map(synonym => ({
                name: {
                  contains: synonym,
                  mode: 'insensitive'
                }
              })),
              {
                description: {
                  contains: optimizedSearch.optimized,
                  mode: 'insensitive'
                }
              }
            ]
          },
          include: {
            category: true
          },
          take: 5
        });
        
        return {
          results: synonymMatches,
          searchTerm: searchTerm,
          optimizedTerm: optimizedSearch.optimized,
          method: 'synonym_search',
          confidence: optimizedSearch.confidence
        };
      }
      
      return {
        results: exactMatches,
        searchTerm: searchTerm,
        optimizedTerm: optimizedSearch.optimized,
        method: exactMatches.length > 0 ? 'exact_match' : 'no_match',
        confidence: optimizedSearch.confidence
      };
      
    } catch (error) {
      console.error('Error al buscar productos:', error);
      return {
        results: [],
        searchTerm: searchTerm,
        optimizedTerm: searchTerm,
        method: 'error',
        confidence: 0
      };
    }
  }

  /**
   * Obtiene productos por categoría
   * @param {string} categoryName - Nombre de la categoría
   * @returns {Promise<Array>} - Productos de la categoría
   */
  async getProductsByCategory(categoryName) {
    try {
      const products = await prisma.product.findMany({
        where: {
          category: {
            name: {
              contains: categoryName,
              mode: 'insensitive'
            }
          }
        },
        include: {
          category: true
        },
        take: 10
      });
      
      return products;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      return [];
    }
  }

  /**
   * Obtiene productos en oferta (stock bajo o promociones)
   * @returns {Promise<Array>} - Productos en oferta
   */
  async getProductsOnOffer() {
    try {
      // Por ahora, vamos a considerar "oferta" como productos con stock bajo
      // En el futuro, se puede agregar un campo de "precio_oferta" a la tabla
      const products = await prisma.product.findMany({
        where: {
          stock: {
            gt: 0,
            lt: 10 // Stock menor a 10 unidades
          }
        },
        include: {
          category: true
        },
        orderBy: {
          stock: 'asc'
        },
        take: 5
      });
      
      return products;
    } catch (error) {
      console.error('Error al obtener productos en oferta:', error);
      return [];
    }
  }

  /**
   * Formatea la información del producto para WhatsApp
   * @param {Object} product - Producto de la base de datos
   * @returns {string} - Texto formateado para WhatsApp
   */
  formatProductForWhatsApp(product) {
    const stockEmoji = product.stock > 10 ? '🟢' : product.stock > 0 ? '🟡' : '🔴';
    const stockText = product.stock > 0 ? `${stockEmoji} Stock: ${product.stock} unidades` : '🔴 Agotado';
    
    return `
📦 *${product.name}*
💰 Precio: S/ ${product.price.toFixed(2)}
${stockText}
🏷️ Categoría: ${product.category.name}
${product.description ? `📝 ${product.description}` : ''}
    `.trim();
  }

  /**
   * Formatea una lista de productos para WhatsApp
   * @param {Array} products - Lista de productos
   * @param {string} searchTerm - Término de búsqueda original
   * @returns {string} - Texto formateado para WhatsApp
   */
  formatProductListForWhatsApp(products, searchTerm) {
    if (products.length === 0) {
      return `😔 No encontré productos relacionados con "${searchTerm}". ¿Te gustaría buscar algo más?`;
    }
    
    if (products.length === 1) {
      return this.formatProductForWhatsApp(products[0]);
    }
    
    let message = `📋 *Encontré ${products.length} productos para "${searchTerm}":*\n\n`;
    
    products.forEach((product, index) => {
      const stockEmoji = product.stock > 10 ? '🟢' : product.stock > 0 ? '🟡' : '🔴';
      message += `${index + 1}. *${product.name}* - S/ ${product.price.toFixed(2)} ${stockEmoji}\n`;
    });
    
    message += '\n💡 ¿Cuál te interesa? Puedo darte más detalles.';
    
    return message;
  }

  /**
   * Verifica la disponibilidad de stock
   * @param {number} productId - ID del producto
   * @param {number} quantity - Cantidad solicitada
   * @returns {Promise<Object>} - Información de disponibilidad
   */
  async checkStock(productId, quantity = 1) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true }
      });
      
      if (!product) {
        return {
          available: false,
          message: 'Producto no encontrado'
        };
      }
      
      if (product.stock < quantity) {
        return {
          available: false,
          currentStock: product.stock,
          message: `Solo tengo ${product.stock} unidades disponibles de ${product.name}`
        };
      }
      
      return {
        available: true,
        currentStock: product.stock,
        message: `✅ Hay disponibilidad de ${product.name}`
      };
      
    } catch (error) {
      console.error('Error al verificar stock:', error);
      return {
        available: false,
        message: 'Error al verificar disponibilidad'
      };
    }
  }

  /**
   * Obtiene categorías disponibles
   * @returns {Promise<Array>} - Lista de categorías
   */
  async getCategories() {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      return categories;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  }

  /**
   * Formatea las categorías para WhatsApp
   * @param {Array} categories - Lista de categorías
   * @returns {string} - Texto formateado
   */
  formatCategoriesForWhatsApp(categories) {
    if (categories.length === 0) {
      return 'No hay categorías disponibles actualmente.';
    }
    
    let message = '🏪 *Categorías disponibles en La Inmaculada:*\n\n';
    
    categories.forEach((category, index) => {
      const productCount = category._count.products;
      message += `${index + 1}. *${category.name}* (${productCount} productos)\n`;
      if (category.description) {
        message += `   _${category.description}_\n`;
      }
    });
    
    message += '\n💡 ¿Qué categoría te interesa? Puedo mostrarte los productos.';
    
    return message;
  }

  /**
   * Obtiene un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object|null>} - Producto o null
   */
  async getProductById(id) {
    try {
      return await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: { category: true }
      });
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo producto
   * @param {Object} data - Datos del producto
   * @returns {Promise<Object>} - Producto creado
   */
  async createProduct(data) {
    try {
      return await prisma.product.create({
        data: {
          sku: data.sku,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock || 0,
          categoryId: data.categoryId
        },
        include: { category: true }
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  /**
   * Actualiza un producto
   * @param {number} id - ID del producto
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} - Producto actualizado
   */
  async updateProduct(id, data) {
    try {
      return await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          ...data,
          updatedAt: new Date()
        },
        include: { category: true }
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }
}

module.exports = new ProductService();