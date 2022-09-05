const bookingModel = require("../models/booking");
const responseHandler = require("../utils/responseHandler");

const createBooking = async (req, res) => {
  try {
    const result = await bookingModel.createBooking(req.params, req.body);
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

module.exports = { createBooking };
