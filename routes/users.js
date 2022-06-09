const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const thirdPartyController = require('../controllers/thirdParty');
const { isAuthor } = require('../middleware/handleJWT');
const handleErrorAsync = require('../middleware/handleErrorAsync');

router.post('/user/create', handleErrorAsync(userController.userCreate));
router.post('/user/login', handleErrorAsync(userController.userLogin));
router.get('/user/profile', isAuthor, handleErrorAsync(userController.getProfile));
router.patch('/user/profile', isAuthor, handleErrorAsync(userController.updateProfile));
router.post('/user/update_password', isAuthor, handleErrorAsync(userController.updatePassword));

router.get('/user/facebook', handleErrorAsync(thirdPartyController.loginWithFacebook));
router.get('/user/facebook/callback', handleErrorAsync(thirdPartyController.facebookCallback));
router.get('/user/google', handleErrorAsync(thirdPartyController.loginWithGoogle));
router.get('/user/google/callback', handleErrorAsync(thirdPartyController.googleCallback));
router.get('/user/line', handleErrorAsync(thirdPartyController.loginWithLine));
router.get('/user/line/callback', handleErrorAsync(thirdPartyController.lineCallback));
router.get('/user/discord', handleErrorAsync(thirdPartyController.loginWithDiscord));
router.get('/user/discord/callback', handleErrorAsync(thirdPartyController.discordCallback));

router.post('/:id/follow', isAuthor, handleErrorAsync(userController.addFollower));
router.delete('/:id/unfollow', isAuthor, handleErrorAsync(userController.deleteFollower));
router.get('/user/getLikesList', isAuthor, handleErrorAsync(userController.getLikesList));
router.get('/user/getFollowList', isAuthor, handleErrorAsync(userController.getFollowList));

module.exports = router;
