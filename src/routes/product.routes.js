// src/routes/product.routes.js
const { Router } = require('express');
const {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
} = require('../controllers/product.controller');

const router = Router();

router.get('/productos', listProducts);
router.get('/productos/:id', getProductById);
router.post('/productos', createProduct);
router.put('/productos/:id', updateProduct);

module.exports = router;
