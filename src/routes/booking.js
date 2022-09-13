const express = require("express");
const bookingController = require("../controllers/booking");
const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post(
  "/",
  authMiddleware.authentication,
  bookingController.createBooking
);
Router.get(
  "/",
  authMiddleware.authentication,
  bookingController.getBookingByUserId
);
Router.get("/section/:event_id", bookingController.getBookingSectionByEventId);

module.exports = Router;
