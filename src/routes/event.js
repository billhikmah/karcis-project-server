const express = require("express");
const eventController = require("../controllers/event");

const Router = express.Router();

Router.post("/", eventController.createEvent);
Router.get("/", eventController.getAllEvent);
Router.get("/:id", eventController.getEventById);
Router.put("/", eventController.updateEvent);

module.exports = Router;
