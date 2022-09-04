const express = require("express");
const userController = require("../controllers/user");

const Router = express.Router();

Router.post("/", userController.createUser);
Router.get("/", userController.getAllUser);
Router.get("/:id", userController.getUserById);
Router.patch("/:id", userController.updateUser);

module.exports = Router;
