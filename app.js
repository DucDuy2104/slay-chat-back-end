const express = require('express');
require('dotenv').config();
const http = require('http');
const app = express();
const userRoute = require('./routes/user')
const conversationRoute = require('./routes/conversation')
const messageRoute = require('./routes/message')
const feedBackendRoute = require('./routes/feedBack')
const mongoose = require('mongoose');
const server = http.createServer(app)



app.use(express.json());
app.use('/user', userRoute)
app.use('/conversation', conversationRoute)
app.use('/message', messageRoute)
app.use('/feed-back', feedBackendRoute)


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        server.listen(process.env.PORT || 4444, () => {
            console.log(`Server is running on port ${process.env.PORT || 4444}`);
        })

        const io = require('./socket').init(server)
        io.on('connection', socket => {
            console.log('new client connection')
        })
    })
    .catch(() => console.log('Failed to connect to MongoDB'))

