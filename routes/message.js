const express = require('express');
const router = express.Router();
const chatController = require('../controllers/message');
const { isAuthor } = require('../middleware/handleJWT');

router.get('/', isAuthor, chatController.getMessages);
router.post('/', isAuthor, chatController.storeMessage);

module.exports = router;
