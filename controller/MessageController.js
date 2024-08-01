const { response } = require('express')
const Message = require('../model/Message')
const Conversation = require('../model/Conversation')
const Participant = require('../model/Participant')
const mongoose = require('mongoose')
const socket = require('../socket')

exports.createMessage = async (req, res) => {
    try {
        const { conversationId, sender, content } = req.body
        if (!conversationId || !sender || !content) {
            return res.status(400).json({ status: false, message: 'Missing required fields' })
        }
        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
            return res.status(404).json({ status: false, message: 'Conversation not found' })
        }

        const participant = await Participant.find({ conversationId: conversationId, userId: sender })
        if (!participant) {
            return res.status(404).json({ status: false, message: 'Sender not joined the conversation' })
        }

        const message = await Message.create({ conversationId, sender, content })
        const createdMessage = await Message.findById(message._id).populate('sender',  "userName avatar")
        socket.getIo().emit('sendMessage', {
            message: {...createdMessage._doc}
        })
        return res.status(200).json({ status: true, message: 'Message created successfully', data: message })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: false, message: 'Create message failure' })
    }
}


exports.getMessagesByConversationId = async (req, res) => {
    try {
        const { conversationId } = req.params
        if (!conversationId) {
            return res.status(400).json({ status: false, message: 'Missing required field: conversationId' })
        }
        const messages = await Message.find({ conversationId: conversationId })
            .populate('sender', 'userName avatar')
        return res.status(200).json({ status: true, data: messages })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: false, message: 'Error getting messages by conversationId' })

    }
}