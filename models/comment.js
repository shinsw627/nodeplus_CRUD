const mongoose = require('mongoose')

const { Schema } = mongoose
const commentSchema = new Schema({
    postId: {
        type: Number,
        required: true,
    },
    commentId: {
        type: Number,
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
        unique: true,
        nickname: true,
    },
    content: {
        type: String,
    },
    date: {
        type: String,
    },
    depth: {
        type: Number,
    },
})
module.exports = mongoose.model('comment', commentSchema)
