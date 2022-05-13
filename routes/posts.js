const express = require('express');
const router = express.Router();
const appError = require('../services/appError');
const handleErrorAsync = require('../services/handleErrorAsync');
const Post = require('../models/postsModel');
const User = require('../models/userModel');
const {isAuth, generateSendJWT} = require('../services/auth');
router.get('/', async function(req, res, next) {
    const timeSort = req.query.timeSort == 'asc' ? "createdAt" : "-createdAt";
    const q = req.query.q !== undefined ? {"content" : new RegExp(req.query.q)} : {};
    const post = await Post.find(q).populate(
        {
            path: 'user',
            select: 'name photo'
        }
    ).sort(timeSort);

    res.status(200).send(
        {
            post
        }
    );

} );


router.post('/', isAuth, handleErrorAsync( async function(req, res, next) {
        const {content} = req.body;
        if(content == undefined){
            return next(appError(400, '未填寫 content', next))
        }

        const newPost = await Post.create(
            {
                user: req.user.id,
                content
            }
        );

        res.status(200).send(
            {
                status: true,
                post: newPost,
            }
        );
} ));



module.exports = router;
