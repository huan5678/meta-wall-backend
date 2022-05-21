const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { isAuthor } = require('../middleware/handleJWT');

router.post('/user/create', userController.userCreate);
router.post('/user/login', userController.userLogin);
router.post('/user/update_password', isAuthor, userController.updatePassword);
router.get('/user/profile', isAuthor, userController.getProfile);
router.patch('/user/profile', isAuthor, userController.updateProfile);

module.exports = router;
