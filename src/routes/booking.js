const express = require("express");
const bookingController = require("../controllers/booking");

const Router = express.Router();

Router.post("/:user_id", bookingController.createBooking);
Router.get("/:user_id", bookingController.getBookingByUserId);

module.exports = Router;
