const mongoose = require('mongoose')

const { Schema } = mongoose
const postsSchema = new Schema({
    postId: {
        type: Number,
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
    },
    likeNicknames: {
        type: Array,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    contentPw: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
    },
})
module.exports = mongoose.model('posts', postsSchema)
