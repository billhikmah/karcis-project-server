const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const responseHandler = require("../utils/responseHandler");
const { sendEmail } = require("../utils/nodemailer");

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
    const { oldPassword, newPassword } = req.body;
    const getHashPassword = await userModel.getUserById(req.payload.user_id);
    const hashPassword = getHashPassword.data[0].password;
    const checkPassword = await bcrypt.compare(oldPassword, hashPassword);
    if (!checkPassword) {
      return responseHandler(res, 400, "Enter the correct password", null);
    }
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    const result = await userModel.updatePassword(
      newHashPassword,
      req.payload.user_id
    );

    const arrayName = getHashPassword.data[0].name.split(" ");
    const nickName = arrayName[0][0].toUpperCase() + arrayName[0].substring(1);

    const mailOptions = {
      email: getHashPassword.data[0].email,
      name: nickName,
      subject: `Karcis - Your Password Has Been Changed`,
      template: "template-2.html",
      url: `${process.env.CLIENT_URL}`,
      title: "Your Password Has Been Changed",
      greeting: "Holaaa,",
      subtitle: "It wasn't you?",
      message:
        "Your password has been change. If it wasn't you, please click the button bellow.",
      button: "It wasn't me",
      submessage: "Don't worry, your account is safe with us.",
    };
    await sendEmail(mailOptions);

    const data = {
      id: result.data[0].id,
      name: result.data[0].name,
      updated_at: result.data[0].updated_at,
    };
    return responseHandler(
      res,
      result.status,
      "Password has been changed.",
      data
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
