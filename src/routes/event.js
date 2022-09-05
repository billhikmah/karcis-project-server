const express = require("express");
const eventController = require("../controllers/event");

const Router = express.Router();

Router.post("/", eventController.createEvent);
Router.get("/", eventController.getAllEvents);
Router.get("/:id", eventController.getEventById);
Router.patch("/:id", eventController.updateEvent);
Router.delete("/:id", eventController.deleteEvent);

module.exports = Router;
