const express = require("express");
const route = express.Router();
const userController = require("../controller/UserController");

//Login
route.post("/login", userController.login);

//Register
route.post("/register", userController.register);

//Add friend
route.post("/add_friend", userController.addfriend);

//Test
route.get("/test", userController.test);

module.exports = route;
