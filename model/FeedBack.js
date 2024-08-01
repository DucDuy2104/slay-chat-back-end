const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedBack = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    senderName: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('feedBack', feedBack)