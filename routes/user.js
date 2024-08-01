const express = require("express");
const route = express.Router();
const userController = require("../controller/UserController");

//Login
route.post("/login", userController.login);

//Register
route.post("/register", userController.register);

//Add friend
route.post("/add-friend", userController.addfriend);

//Test
route.get("/test", userController.test);

//get friend
route.get('/get-friends/:userId', userController.getFriends);

//find friend
route.post('/find-friend', userController.findFriendByEmail);

//update profile
route.post('/update-profile', userController.updateProfile);

//update password

route.post('/update-password', userController.updatePassword);

module.exports = route;
