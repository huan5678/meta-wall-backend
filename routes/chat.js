const express = require('express');
const router = express.Router();
const { chatController } = require('../controllers/chat');
const { isAuthor } = require('../middleware/handleJWT');

router.post('/', isAuthor, chatController.sendChat);

module.exports = router;