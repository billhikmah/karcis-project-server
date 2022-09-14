const express = require("express");
const eventController = require("../controllers/event");
const authMiddleware = require("../middlewares/auth");
const imageDestroyer = require("../middlewares/imageDestroyer");
const imageUploader = require("../middlewares/imageUploader");
const redisMiddleware = require("../middlewares/redis");

const Router = express.Router();

Router.post(
  "/",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  imageUploader.uploadEventImage,
  redisMiddleware.clearEventsOnRedis,
  eventController.createEvent
);
Router.get("/", redisMiddleware.getAllEvents, eventController.getAllEvents);
Router.get("/:id", redisMiddleware.getEventById, eventController.getEventById);
Router.patch(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  imageUploader.uploadEventImage,
  imageDestroyer.updateEventImage,
  redisMiddleware.clearEventsOnRedis,
  eventController.updateEvent
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  imageDestroyer.deleteEventImage,
  redisMiddleware.clearEventsOnRedis,
  eventController.deleteEvent
);

module.exports = Router;
