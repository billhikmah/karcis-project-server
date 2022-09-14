const eventModel = require("../models/event");
const responseHandler = require("../utils/responseHandler");
const { client } = require("../config/redis");

const createEvent = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : null;
    const result = await eventModel.createEvent(req.body, image);
    return responseHandler(
      res,
      result.status,
      "Event has been created",
      result.data
    );
  } catch (error) {
    return responseHandler(res, error.status, error.error.message, null);
  }
};

const getEventById = async (req, res) => {
  try {
    const result = await eventModel.getEventById(req.params.id);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Event not found.", result.data);
    }
    client.setEx(
      `getEvent:${req.params.id}`,
      3600,
      JSON.stringify(result.data)
    );
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message, null);
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

    client.setEx(
      `getEvents:${JSON.stringify(req.query)}`,
      3600,
      JSON.stringify({ result: result.data, pagination })
    );

    return responseHandler(
      res,
      result.status,
      result.statusText,
      result.data,
      pagination
    );
  } catch (error) {
    return responseHandler(res, error.status, error.error.message, null);
  }
};

const updateEvent = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : undefined;
    const result = await eventModel.updateEvent(req.body, req.params, image);
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
      error.error.message || error.statusText,
      null
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
    return responseHandler(res, error.status, error.error.message, null);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
