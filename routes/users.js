const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const thirdPartyController = require('../controllers/thirdParty');
const { isAuthor, clearToken } = require('../middleware/handleJWT');

router.post('/user/create', userController.userCreate);
router.post('/user/login', userController.userLogin);
router.patch('user/logout', clearToken, userController.userLogout);
router.patch('/user/check_user', isAuthor, userController.userCheckout);
router.get('/user/profile', isAuthor, userController.getProfile);
router.patch('/user/profile', isAuthor, userController.updateProfile);
router.post('/user/update_password', isAuthor, userController.updatePassword);

router.get('/user/facebook', thirdPartyController.loginWithFacebook);
router.get('/user/facebook/callback', thirdPartyController.facebookCallback);
router.get('/user/google', thirdPartyController.loginWithGoogle);
router.get('/user/google/callback', thirdPartyController.googleCallback);
router.get('/user/line', thirdPartyController.loginWithLine);
router.get('/user/line/callback', thirdPartyController.lineCallback);

module.exports = router;
