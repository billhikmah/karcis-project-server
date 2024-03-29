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
Router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh
);
Router.patch("/activation/:id/:otp", authController.activateAccount);
Router.post("/resend", authController.resendActivation);
Router.post("/forgot", authController.forgotPassword);
Router.patch("/reset/:id/:otp", authController.resetPassword);

module.exports = Router;
