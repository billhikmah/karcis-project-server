const eventModel = require("../models/event");
const responseHandler = require("../utils/responseHandler");

const createEvent = async (req, res) => {
  try {
    const result = await eventModel.createEvent(req.body);
    responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    responseHandler(res, error.status, error.error.message);
  }
};

const getAllEvent = async (req, res) => {
  try {
    const result = await eventModel.getAllEvent(req.body);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Data not found.", result.data);
    }
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const getEventById = async (req, res) => {
  try {
    const result = await eventModel.getEventById(req.params.id);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Data not found.", result.data);
    }
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

module.exports = { createEvent, getAllEvent, getEventById };
