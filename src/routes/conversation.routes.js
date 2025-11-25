// src/routes/conversation.routes.js
const { Router } = require('express');
const { listConversations } = require('../controllers/conversation.controller');

const router = Router();

router.get('/conversaciones', listConversations);

module.exports = router;
