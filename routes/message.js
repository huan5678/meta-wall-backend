const express = require('express');
const router = express.Router();
const chatController = require('../controllers/message');
const SocketHandler = require('../controllers/socket');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const { isAuthor } = require('../middleware/handleJWT');

router.get('/', isAuthor, handleErrorAsync(chatController.getMessages));
router.post('/', isAuthor, handleErrorAsync(chatController.storeMessage));

module.exports = router;
