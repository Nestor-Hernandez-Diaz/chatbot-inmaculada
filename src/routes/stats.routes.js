// src/routes/stats.routes.js
const { Router } = require('express');
const { getHealthStatus, getStats } = require('../controllers/stats.controller');

const router = Router();

router.get('/', getHealthStatus);
router.get('/stats', getStats);

module.exports = router;
