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

module.exports = Router;
