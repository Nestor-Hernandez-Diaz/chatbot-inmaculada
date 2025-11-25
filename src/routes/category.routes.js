// src/routes/category.routes.js
const { Router } = require('express');
const { listCategories } = require('../controllers/category.controller');

const router = Router();

router.get('/categorias', listCategories);

module.exports = router;
