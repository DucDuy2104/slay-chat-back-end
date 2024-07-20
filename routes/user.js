const express = require('express')
const route = express.Router()
const userController = require('../controller/UserController')


route.get('/test', userController.test)


module.exports = route