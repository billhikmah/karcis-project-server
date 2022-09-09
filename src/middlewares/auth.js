const jwt = require("jsonwebtoken");
const responseHandler = require("../utils/responseHandler");
const authModel = require("../models/auth");

const checkRegisteredEmail = async (req, res, next) => {
  try {
    const result = await authModel.checkRegisteredEmail(req.body.email);
    if (result.data.length !== 0) {
      return responseHandler(
        res,
        404,
        "Sorry, the email is already registered.",
        result.data
      );
    }
    return next();
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const authentication = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken.split(" ")[1];
  if (!bearerToken) {
    return responseHandler(
      res,
      403,
      "You must be logged in to access the data.",
      null
    );
  }

  return jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, payload) => {
    if (error && error.name === "TokenExpiredError") {
      return responseHandler(res, 401, "Please sign in again", null);
    }
    if (error) {
      return responseHandler(res, 403, error.message, null);
    }
    req.payload = payload;
    return next();
  });
};

const adminAuthorization = (req, res, next) => {
  const { role } = req.payload;
  if (role !== "admin") {
    return responseHandler(res, 500, {
      msg: "You do not have permission to access.",
    });
  }
  return next();
};

module.exports = {
  checkRegisteredEmail,
  authentication,
  adminAuthorization,
};