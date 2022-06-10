const express = require('express');
const router = express.Router();
const donateController = require('../controllers/donate');
const eventController = require('../controllers/sse');
const { isAuthor } = require('../middleware/handleJWT');

router.post('/', isAuthor, donateController.orderCreate);
router.post('/notify', donateController.orderNotify);
router.post('/callback', donateController.orderCallback);
router.post('/donate', donateController.donateUser);
router.get('/events', eventController.getEvents);

module.exports = router;
