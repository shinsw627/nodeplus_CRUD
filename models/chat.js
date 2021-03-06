const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    nickname: String,
    msg: String,
    time: String,
    order: Number,
    date: Number,
})

module.exports = mongoose.model('chat', ChatSchema)
