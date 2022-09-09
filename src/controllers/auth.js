const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth");
const responseHandler = require("../utils/responseHandler");
// const { sendConfirmationEmail } = require("../config/nodemailer");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await authModel.signUp(name, email, hashPassword);
    // await sendConfirmationEmail(result.data.id, name, email);
    const message =
      "Account has been created. Please check your email to activate your account.";
    const data = {
      id: result.data[0].id,
      name: result.data[0].name,
      email: result.data[0].email,
    };
    return responseHandler(res, result.status, message, data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
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
      expiresIn: "7d",
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

module.exports = { signUp, logIn };
