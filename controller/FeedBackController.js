const userModel = require('../model/User')
const Feedback = require('../model/FeedBack')

exports.createFeedBack = async (req, res) => {
    try {
        const {sender, label, content} = req.body
        const user = await userModel.findById(sender)
        if(!user) {
            return res.status(404).json({status: false, message: "User not found"})
        }
        const feedback = new Feedback({
            sender: user._id,
            label,
            content,
            senderName: user.userName
        })

        const createdFeedBack = await feedback.save()
        res.status(200).json({status: true, message: "Feedback created successfully", data: createdFeedBack})

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status: false, message: "Error creating feedback"})
        
    }
} 