const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const participantsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    conversationId:{
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    }
})


module.exports = mongoose.model('participant', participantsSchema)