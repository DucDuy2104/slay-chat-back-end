const express = require('express');
const route = express.Router();
const messageController = require('../controller/MessageController')

route.post('/create-message', messageController.createMessage)
route.get('/get-message-via-conversation/:conversationId', messageController.getMessagesByConversationId)


module.exports = route