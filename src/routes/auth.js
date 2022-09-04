const express = require("express");
const authController = require("../controllers/auth");

const Router = express.Router();

Router.post("/", authController.signUp);

module.exports = Router;
