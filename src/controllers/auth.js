const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth");
const responseHandler = require("../utils/responseHandler");
const { client } = require("../config/redis");
const { sendConfirmationEmail } = require("../utils/nodemailer");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await authModel.signUp(name, email, hashPassword);

    const arrayName = name.split(" ");
    const nickName = arrayName[0][0].toUpperCase() + arrayName[0].substring(1);

    const mailOptions = {
      email,
      name: nickName,
      subject: `Karcis - Activate Your Account`,
      template: "template-1.html",
      url: "http://localhost:3001/api/auth/verif/123456",
      title: "CONFIRMATION EMAIL",
      greeting: "Hola, cómo estás?",
      subtitle: "Welcome!",
      message:
        "You are successfully registered on Karcis, kindly click the button below to activate your acount.",
      button: "ACTIVATE",
    };
    await sendConfirmationEmail(mailOptions);

    const message =
      "Account has been created. Please check your email to activate your account.";
    const data = {
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
    const token = jwt.sign(payload, process.env.JWT_PRIVATE_ACCESS_KEY, {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_PRIVATE_REFRESH_KEY,
      {
        expiresIn: "1d",
      }
    );

    return responseHandler(res, 200, "Login success.", {
      user_id: checkEmail.data[0].id,
      role: checkEmail.data[0].role,
      token,
      refreshToken,
    });
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const logOut = async (req, res) => {
  try {
    const { "refresh-token": refreshToken, authorization: bearerToken } =
      req.headers;
    const token = bearerToken.split(" ")[1];

    client.setEx(`blacklistToken:${token}`, 3600 * 24, token);
    client.setEx(
      `blacklistRefreshToken:${refreshToken}`,
      3600 * 24,
      refreshToken
    );

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

const refresh = async (req, res) => {
  try {
    const payload = {
      user_id: req.payload.user_id,
      role: req.payload.role,
    };
    const token = jwt.sign(payload, process.env.JWT_PRIVATE_ACCESS_KEY, {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_PRIVATE_REFRESH_KEY,
      {
        expiresIn: "1d",
      }
    );

    await client.setEx(
      `blacklistRefreshToken:${req.header("refresh-token")}`,
      3600 * 24,
      req.header("refresh-token")
    );

    return responseHandler(res, 200, "Successfully refreshed the token.", {
      user_id: req.payload.user_id,
      role: req.payload.role,
      token,
      refreshToken,
    });
  } catch (error) {
    return responseHandler(
      res,
      error.status || 500,
      "Internal Server Error",
      null
    );
  }
};

module.exports = { signUp, logIn, logOut, refresh };
