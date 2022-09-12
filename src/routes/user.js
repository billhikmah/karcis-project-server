const express = require("express");
const userController = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");
const imageDestroyer = require("../middlewares/imageDestroyer");
const imageUploader = require("../middlewares/imageUploader");

const Router = express.Router();

Router.post("/", userController.createUser);
Router.get(
  "/",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  userController.getAllUser
);
Router.get(
  "/details",
  authMiddleware.authentication,
  userController.getUserById
);
Router.patch(
  "/",
  authMiddleware.authentication,
  imageUploader.uploadUserImage,
  imageDestroyer.updateUserImage,
  userController.updateUser
);

module.exports = Router;
