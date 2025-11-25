// src/routes/index.js
const { Router } = require('express');
const statsRoutes = require('./stats.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const conversationRoutes = require('./conversation.routes');
const configRoutes = require('./config.routes');

const router = Router();

router.use(statsRoutes);
router.use(productRoutes);
router.use(categoryRoutes);
router.use(conversationRoutes);
router.use(configRoutes);

module.exports = router;
