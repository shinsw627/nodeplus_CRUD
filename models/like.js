const mongoose = require('mongoose')

const { Schema } = mongoose
const likeSchema = new Schema({
    postId: {
        type: Number,
        required: true,
        unique: true,
    },
    likeNickname: {
        type: String,
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
module.exports = mongoose.model('like', likeSchema)
