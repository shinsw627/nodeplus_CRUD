const mongoose = require('mongoose')

const { Schema } = mongoose

const likeSchema = new Schema({
    postId: {
        type: Number,
        required: true,
        unique: true,
    },
    likeNickname: {
        type: Array,
    },
})
module.exports = mongoose.model('like', likeSchema)
