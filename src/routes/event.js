const express = require("express");
const eventController = require("../controllers/event");
const authMiddleware = require("../middlewares/auth");
const imageDestroyer = require("../middlewares/imageDestroyer");
const imageUploader = require("../middlewares/imageUploader");

const Router = express.Router();

Router.post(
  "/",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  imageUploader.uploadEventImage,
  eventController.createEvent
);
Router.get("/", eventController.getAllEvents);
Router.get("/:id", eventController.getEventById);
Router.patch(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  imageDestroyer.updateEventImage,
  imageUploader.uploadEventImage,
  eventController.updateEvent
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  imageDestroyer.deleteEventImage,
  eventController.deleteEvent
);

module.exports = Router;
