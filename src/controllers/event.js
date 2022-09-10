const eventModel = require("../models/event");
const responseHandler = require("../utils/responseHandler");

const createEvent = async (req, res) => {
  try {
    const result = await eventModel.createEvent(req.body);
    responseHandler(res, result.status, "Event has been created", result.data);
  } catch (error) {
    responseHandler(res, error.status, error.error.message);
  }
};

const getEventById = async (req, res) => {
  try {
    const result = await eventModel.getEventById(req.params.id);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Event not found.", result.data);
    }
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const getAllEvents = async (req, res) => {
  try {
    const result = await eventModel.getAllEvents(req.query);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Data not found.", result.data);
    }

    const pagination = {
      page: +req.query.page,
      limit: +req.query.limit,
      totalData: result.count,
      totalPage: Math.ceil(result.count / req.query.limit),
    };

    return responseHandler(
      res,
      result.status,
      result.statusText,
      result.data,
      pagination
    );
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const updateEvent = async (req, res) => {
  try {
    const result = await eventModel.updateEvent(req.body, req.params);
    return responseHandler(
      res,
      result.status,
      "Event has been updated.",
      result.data
    );
  } catch (error) {
    return responseHandler(
      res,
      error.status,
      error.error.message || error.statusText
    );
  }
};

const deleteEvent = async (req, res) => {
  try {
    const result = await eventModel.deleteEvent(req.params);
    if (result.data.length === 0) {
      return responseHandler(
        res,
        result.status,
        "Event not found",
        result.data
      );
    }
    return responseHandler(
      res,
      result.status,
      "Event has been deleted",
      result.data
    );
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
