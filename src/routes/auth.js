const express = require("express");
const authController = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post(
  "/register",
  authMiddleware.checkRegisteredEmail,
  authController.signUp
);
Router.post("/login", authController.logIn);
Router.delete("/", authController.logOut);

module.exports = Router;
