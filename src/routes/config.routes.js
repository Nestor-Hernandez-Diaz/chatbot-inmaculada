// src/routes/config.routes.js
const { Router } = require('express');
const { listConfig } = require('../controllers/config.controller');

const router = Router();

router.get('/configuracion', listConfig);

module.exports = router;
