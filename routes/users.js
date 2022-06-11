const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const thirdPartyController = require('../controllers/thirdParty');
const mailerController = require('../controllers/mailer');
const { isAuthor } = require('../middleware/handleJWT');
const handleErrorAsync = require('../middleware/handleErrorAsync');

router.post('/create', handleErrorAsync(userController.userCreate));
router.post('/login', handleErrorAsync(userController.userLogin));
router.get('/profile', isAuthor, handleErrorAsync(userController.getProfile));
router.patch('/profile', isAuthor, handleErrorAsync(userController.updateProfile));
router.get('/profile/:id', isAuthor, handleErrorAsync(userController.getSpecUserProfile));
router.post('/update_password', isAuthor, handleErrorAsync(userController.updatePassword));
router.post('/forget_password', handleErrorAsync(mailerController.sendResetEmail));
router.patch('/reset_password', handleErrorAsync(userController.resetPassword));

router.get('/facebook', handleErrorAsync(thirdPartyController.loginWithFacebook));
router.get('/facebook/callback', handleErrorAsync(thirdPartyController.facebookCallback));
router.get('/google', handleErrorAsync(thirdPartyController.loginWithGoogle));
router.get('/google/callback', handleErrorAsync(thirdPartyController.googleCallback));
router.get('/line', handleErrorAsync(thirdPartyController.loginWithLine));
router.get('/line/callback', handleErrorAsync(thirdPartyController.lineCallback));
router.get('/discord', handleErrorAsync(thirdPartyController.loginWithDiscord));
router.get('/discord/callback', handleErrorAsync(thirdPartyController.discordCallback));

router.post('/:id/follow', isAuthor, handleErrorAsync(userController.addFollower));
router.delete('/:id/unfollow', isAuthor, handleErrorAsync(userController.deleteFollower));
router.get('/getLikesList', isAuthor, handleErrorAsync(userController.getLikesList));
router.get('/getFollowList', isAuthor, handleErrorAsync(userController.getFollowList));

module.exports = router;
