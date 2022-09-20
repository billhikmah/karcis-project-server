const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const random = require("simple-random-number-generator");
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

    const otp = random({
      min: 100000,
      max: 999999,
      integer: true,
    });
    const hashOTP = await bcrypt.hash(otp.toString(), 10);
    await client.setEx(`hashOTP:${result.data[0].id}`, 600, hashOTP);

    const mailOptions = {
      email,
      name: nickName,
      subject: `Karcis - Activate Your Account`,
      template: "template-1.html",
      url: `${process.env.CLIENT_URL}/api/auth/activation/${result.data[0].id}/${otp}`,
      title: "CONFIRMATION EMAIL",
      greeting: "Hola, cómo estás?",
      subtitle: "Welcome!",
      message:
        "You are successfully registered on Karcis, kindly click the button below to activate your acount.",
      button: "ACTIVATE",
      submessage:
        "We are so glad you joined us, can't wait to explore the beauty of the world with you!",
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

const activateAccount = async (req, res) => {
  try {
    const { otp, id } = req.params;
    const hashOTP = await client.get(`hashOTP:${id}`);

    if (!hashOTP) {
      return responseHandler(
        res,
        400,
        "Account activation failed, please resend the account activation request.",
        null
      );
    }

    const checkOTP = await bcrypt.compare(otp.toString(), hashOTP);

    if (!checkOTP) {
      return responseHandler(
        res,
        400,
        "Account activation failed, please resend the account activation request.",
        null
      );
    }

    const result = await authModel.activateAccount(id);

    const arrayName = result.data[0].name.split(" ");
    const nickName = arrayName[0][0].toUpperCase() + arrayName[0].substring(1);

    const mailOptions = {
      email: result.data[0].email,
      name: nickName,
      subject: `Karcis - Account activation was successful.`,
      template: "template-1.html",
      url: `${process.env.CLIENT_URL}/api/ping`,
      title: "CONGRATULATIONS",
      greeting: "Are you ready?",
      subtitle: "Welcome to The Karcis Family!",
      message:
        "Your account has been activated, purchase your first event to get an extra free ticket.",
      button: "EXPLORE",
      submessage:
        "We are so glad you joined us, can't wait to explore the beauty of the world with you!",
    };
    await sendConfirmationEmail(mailOptions);

    return responseHandler(
      res,
      200,
      "Your account has been activated.",
      result.data
    );
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

module.exports = { signUp, logIn, logOut, refresh, activateAccount };
