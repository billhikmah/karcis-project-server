const express = require("express");
const eventController = require("../controllers/event");
const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post(
  "/",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  eventController.createEvent
);
Router.get("/", eventController.getAllEvents);
Router.get("/:id", eventController.getEventById);
Router.patch(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  eventController.updateEvent
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.adminAuthorization,
  eventController.deleteEvent
);

module.exports = Router;
