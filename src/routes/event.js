const express = require("express");
const eventController = require("../controllers/event");

const Router = express.Router();

Router.post("/", eventController.createEvent);
Router.get("/search", eventController.searchEvents);
Router.get("/", eventController.getAllEvents);
Router.get("/:id", eventController.getEventById);

module.exports = Router;
