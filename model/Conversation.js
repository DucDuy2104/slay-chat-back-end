const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConversationSchema = new Schema({
    conversationName: {
        type: String,
        require: false
    },
    image: {
        type: String,
        default: 'https://png.pngtree.com/png-vector/20190615/ourlarge/pngtree-friendsgroupusersteam-blue-icon-on-abstract-cloud-backgrou-png-image_1486173.jpg'
    }
})

module.exports = mongoose.model('conversation', ConversationSchema)