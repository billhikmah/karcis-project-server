const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const authModel = require("../models/auth");
const responseHandler = require("../utils/responseHandler");

const createUser = async (req, res) => {
  try {
    const result = await userModel.createUser(req.body);
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
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
    const result = await userModel.getUserById(req.payload.user_id);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Id not found.", result.data);
    }
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : undefined;
    const result = await userModel.updateUser(req.body, req.payload, image);
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(
      res,
      error.status,
      error.error.message || error.statusText
    );
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const checkEmail = await userModel.getUserById(req.payload.user_id);
    const getHashPassword = await authModel.getUserByEmail(
      checkEmail.data[0].email
    );
    const hashPassword = getHashPassword.data[0].password;
    const checkPassword = await bcrypt.compare(password, hashPassword);
    if (!checkPassword) {
      return responseHandler(res, 400, "Enter the correct password", null);
    }
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    const result = await userModel.updatePassword(
      newHashPassword,
      req.payload.user_id
    );
    return responseHandler(
      res,
      result.status,
      "Password has been changed",
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

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  updatePassword,
};
