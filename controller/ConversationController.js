const Conversation = require('../model/Conversation');
const Participant = require('../model/Participant');
const User = require('../model/User')
const Message = require('../model/Message')

const getParticipantsByConversationId = async (conversationId) => {
    const participants = await Participant.find({ conversationId: conversationId });
    const participantPromises = participants.map(participant => {
        return User.findById(participant.userId);
    });
    const participantDetails = await Promise.all(participantPromises);
    return participantDetails;
};

const getLastMessageByConversationId = async (conversationId) => {
    const lastMessage = await Message.findOne({ conversationId: conversationId }).sort({createdAt: -1});
       
    return lastMessage;
}

exports.createConversation = async (req, res) => {
    try {
        const { listUser } = req.body;
        
        if (!Array.isArray(listUser) || listUser.length === 0) {
            return res.status(400).json({ status: false, message: "Invalid input: listUser should be a non-empty array" });
        }

        const existingConversations = await Participant.find({ userId: { $in: listUser } })
            .distinct('conversationId');

        const conversationsWithSameUsers = await Participant.find({
            conversationId: { $in: existingConversations }
        }).distinct('conversationId');

        for (const conversationId of conversationsWithSameUsers) {
            const participants = await Participant.find({ conversationId });
            const participantIds = participants.map(participant => participant.userId.toString());

            if (participantIds.length === listUser.length && participantIds.every(id => listUser.includes(id))) {
                const existingConversation = await Conversation.findById(conversationId)
                const realParticipants = await getParticipantsByConversationId(conversationId)
                return res.status(200).json({ status: true, message: "Conversation with the same participants already exists", data: {
                    ...existingConversation._doc,
                    participants: realParticipants
                } });
            }
        }

        const conversation = await Conversation.create({})
        console.log(conversation)
        const participantPromises = listUser.map(user => 
            Participant.create({ conversationId: conversation._id, userId: user })
        );

        await Promise.all(participantPromises);

        const realParticipants = await getParticipantsByConversationId(conversation._id)

        return res.status(200).json({ status: true,message: 'Created conversation successfully', data: {
            ...conversation._doc,
            participants: realParticipants
        } });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return res.status(500).json({ status: false, message: "Error creating conversation" });
    }
};


exports.getConversationByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ status: false, message: "Invalid input: userId is required" });
        }

        const conversationIds = await Participant.find({ userId }).distinct('conversationId');
        const conversations = await Conversation.find({ _id: { $in: conversationIds } });

        const conversationsWithDetails = await Promise.all(conversations.map(async (conversation) => {
            const participants = await getParticipantsByConversationId(conversation._id);
            const lastMessage = await getLastMessageByConversationId(conversation._id);
            return {
                ...conversation.toObject(),
                participants,
                lastMessage
            };
        }));

        return res.status(200).json({ status: true, message: "Get conversation successfully", data: conversationsWithDetails });
    } catch (error) {
        console.error("Error getting conversation by userId:", error);
        return res.status(500).json({ status: false, message: "Error getting conversation by userId" });
    }
};



exports.getConversationById = async (req, res) => {
    try {
        const { conversationId } = req.params
        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
            return res.status(404).json({ status: false, message: 'Conversation not found' })
        }
        const messages = await Message.find({conversationId: conversationId}).populate('sender', 'userName avatar')
        
        return res.status(200).json({ status: true, data: { ...conversation.toObject(), messages } })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Error getting conversation by id' })
    }
}

