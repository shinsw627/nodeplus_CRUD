const mongoose = require('mongoose')

const ChatBackupSchema = new mongoose.Schema({
    nickname: String,
    msg: String,
    time: String,
    order: Number,
    date: Number,
})

module.exports = mongoose.model('chatBackup', ChatBackupSchema)
