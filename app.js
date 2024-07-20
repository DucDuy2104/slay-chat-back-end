const express = require('express');
require('dotenv').config();
const app = express();
const userRoute = require('./routes/user')
const mongoose =  require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(() => console.log('Failed to connect to MongoDB'))

app.use(express.json());
app.use('/user', userRoute)

app.listen(process.env.PORT || 4444, () => {
    console.log(`Server is running on port ${process.env.PORT || 4444}`);
})