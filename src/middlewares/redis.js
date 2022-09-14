const { client } = require("../config/redis");
const responseHandler = require("../utils/responseHandler");

const getEventById = async (request, response, next) => {
  try {
    let result = await client.get(`getEvent:${request.params.id}`);
    if (result !== null) {
      result = JSON.parse(result);
      return responseHandler(
        response,
        200,
        "Get event by id is successful.",
        result
      );
    }
    return next();
  } catch (error) {
    return responseHandler(response, 400, error.message, null);
  }
};

const getAllEvents = async (request, response, next) => {
  try {
    let result = await client.get(`getEvents:${JSON.stringify(request.query)}`);
    if (result !== null) {
      result = JSON.parse(result);
      return responseHandler(
        response,
        200,
        "Get events is successful.",
        result.result,
        result.pagination
      );
    }
    return next();
  } catch (error) {
    return responseHandler(response, 400, error.message, null);
  }
};

const clearEventsOnRedis = async (_request, response, next) => {
  try {
    const result = await client.keys("getEvent*");
    if (result.length > 0) {
      result.forEach(async (element) => {
        await client.del(element);
      });
    }
    return next();
  } catch (error) {
    return responseHandler(response, 400, error.message, null);
  }
};

module.exports = { getEventById, getAllEvents, clearEventsOnRedis };
