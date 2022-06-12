const express = require('express');
const router = express.Router();
const donateController = require('../controllers/donate');
const eventController = require('../controllers/sse');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const { isAuthor } = require('../middleware/handleJWT');

router.post('/', isAuthor, handleErrorAsync(donateController.orderCreate));
router.post('/notify', handleErrorAsync(donateController.orderNotify));
router.post('/callback', handleErrorAsync(donateController.orderCallback));
router.post('/user/:id', isAuthor, handleErrorAsync(donateController.donateUser));
router.post('/paymant-history', isAuthor, handleErrorAsync(donateController.getOrderList));
router.get('/donate-history', isAuthor, handleErrorAsync(donateController.getDonateList));
router.get('/donatee-history', isAuthor, handleErrorAsync(donateController.getDonateeList));
router.get('/events', eventController.getEvents);

module.exports = router;
