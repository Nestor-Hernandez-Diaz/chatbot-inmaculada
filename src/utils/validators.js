// src/utils/validators.js
const { z } = require('zod');

// Validator for Product
const productSchema = z.object({
  sku: z.string().min(1, "El SKU es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser un número positivo"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  categoryId: z.number().int().positive("El ID de categoría no es válido"),
});

// Validator for Category
const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
});

// Validator for Order
const orderSchema = z.object({
  total: z.number().positive("El total debe ser un número positivo"),
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED']).optional(),
  customerPhone: z.string().min(1, "El teléfono del cliente es requerido"),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1, "El pedido debe tener al menos un item"),
});

module.exports = {
  productSchema,
  categorySchema,
  orderSchema,
};
