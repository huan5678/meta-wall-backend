const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
    {
        content:{
            type: String,
            required: [true, 'content 未填寫'],
        },
        image: {
            type: String,
            default: '',
        },
        createdAt: {
            type: Date,
            default: Date.now,
            select: false,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: [true, '無貼文者的ID'],
        },
        likes: {
            type: Number,
            default: 0,
        }
    },
    {
        versionKey: false,
    }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;