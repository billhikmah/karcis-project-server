const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth");
const responseHandler = require("../utils/responseHandler");
const { client } = require("../config/redis");
const { sendConfirmationEmail } = require("../config/nodemailer");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await authModel.signUp(name, email, hashPassword);
    await sendConfirmationEmail(result.data.id, name, email);
    const message =
      "Account has been created. Please check your email to activate your account.";
    const data = {
      id: result.data[0].id,
      name: result.data[0].name,
      email: result.data[0].email,
    };
    return responseHandler(res, result.status, message, data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message || error);
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await authModel.getUserByEmail(email);
    if (checkEmail.data.length === 0) {
      return responseHandler(res, 404, "Email or password is incorrect.", null);
    }

    const checkPassword = await bcrypt.compare(
      password,
      checkEmail.data[0].password
    );
    if (!checkPassword) {
      return responseHandler(res, 400, "Email or password is incorrect.", null);
    }

    const payload = {
      user_id: checkEmail.data[0].id,
      role: checkEmail.data[0].role,
    };
    const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "1d",
    });

    return responseHandler(res, 200, "Login success.", {
      user_id: checkEmail.data[0].id,
      role: checkEmail.data[0].role,
      token,
    });
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const logOut = async (req, res) => {
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(" ")[1];
    client.setEx(`blacklistToken:${token}`, 3600 * 24, token);
    return responseHandler(res, 200, "Logout success.", null);
  } catch (error) {
    return responseHandler(
      res,
      error.status || 500,
      "Internal Server Error",
      null
    );
  }
};

module.exports = { signUp, logIn, logOut };
