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

const getAllUser = async (req, res) => {
  try {
    const result = await userModel.getAllUser(req.query);
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

const getUserById = async (req, res) => {
  try {
    const result = await userModel.getUserById(req.params.id);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Data not found.", result.data);
    }
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userModel.updateUser(req.body, req.params);
    responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    responseHandler(res, error.status, error.error.message);
  }
};

module.exports = { createUser, getAllUser, getUserById, updateUser };
