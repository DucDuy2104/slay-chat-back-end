const express = require('express');
const route = express.Router();
const feedBackController = require('../controller/FeedBackController')

route.post('/create-feed-back', feedBackController.createFeedBack)

module.exports = route;