// src/controllers/product.controller.js
const productService = require('../services/product.service');
const { productSchema } = require('../utils/validators');

const listProducts = async (req, res, next) => {
  try {
    const productos = await productService.getAllProducts(req.query);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const producto = await productService.getProductById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const producto = await productService.createProduct(validatedData);
    res.status(201).json(producto);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const validatedData = productSchema.partial().parse(req.body);
    const producto = await productService.updateProduct(req.params.id, validatedData);
    res.json(producto);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    next(error);
  }
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
};