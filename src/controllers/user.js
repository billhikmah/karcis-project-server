const userModel = require("../models/user");
const responseHandler = require("../utils/responseHandler");

const createUser = async (req, res) => {
  try {
    const result = await userModel.createUser(req.body);
    responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    responseHandler(res, error.status, error.error.message);
  }
};

module.exports = { createUser };
