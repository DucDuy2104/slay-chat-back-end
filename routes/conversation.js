const express = require('express');
const route = express.Router();
const conversationController = require('../controller/ConversationController')

route.post('/create-conversation', conversationController.createConversation)
route.get('/get-conversation/:userId', conversationController.getConversationByUserId)
route.get('/get-conversation-by-id/:conversationId', conversationController.getConversationById)

module.exports = route