const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const random = require("simple-random-number-generator");
const authModel = require("../models/auth");
const userModel = require("../models/user");
const responseHandler = require("../utils/responseHandler");
const { client } = require("../config/redis");
const { sendEmail } = require("../utils/nodemailer");

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
        "You are successfully registered on Karcis, kindly click the button below to activate your acount. The link is available only for 10 minutes.",
      button: "ACTIVATE",
      submessage:
        "We are so glad you joined us, can't wait to explore the beauty of the world with you!",
    };
    await sendEmail(mailOptions);

    const message =
      "Account has been created. Please check your email to activate your account.";
    const data = {
      name: result.data[0].name,
      email: result.data[0].email,
    };
    return responseHandler(res, result.status, message, data);
  } catch (error) {
    console.log(error);
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
    const { refreshtoken: refreshToken, authorization: bearerToken } =
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
      `blacklistRefreshToken:${req.header("refreshtoken")}`,
      3600 * 24,
      req.header("refreshtoken")
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
    await sendEmail(mailOptions);

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

const resendActivation = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await authModel.getUserByEmail(email);
    if (checkEmail.data.length === 0) {
      return responseHandler(
        res,
        400,
        "Sorry, the email is not registered yet.",
        null
      );
    }
    if (checkEmail.data[0].activated_at) {
      return responseHandler(
        res,
        400,
        "Sorry, your account is already activated.",
        null
      );
    }

    const arrayName = checkEmail.data[0].name.split(" ");
    const nickName = arrayName[0][0].toUpperCase() + arrayName[0].substring(1);

    const otp = random({
      min: 100000,
      max: 999999,
      integer: true,
    });
    const hashOTP = await bcrypt.hash(otp.toString(), 10);
    await client.setEx(`hashOTP:${checkEmail.data[0].id}`, 600, hashOTP);

    const mailOptions = {
      email,
      name: nickName,
      subject: `Karcis - Activate Your Account`,
      template: "template-1.html",
      url: `${process.env.CLIENT_URL}/api/auth/activation/${checkEmail.data[0].id}/${otp}`,
      title: "CONFIRMATION EMAIL",
      greeting: "Hola, cómo estás?",
      subtitle: "Welcome!",
      message:
        "You are already registered on Karcis, kindly click the button below to activate your acount. The link is available only for 10 minutes.",
      button: "ACTIVATE",
      submessage:
        "We are so glad you joined us, can't wait to explore the beauty of the world with you!",
    };
    await sendEmail(mailOptions);

    const message =
      "The new email confirmation has been sent. Please check your email to activate your account.";
    const data = {
      name: checkEmail.data[0].name,
      email: checkEmail.data[0].email,
    };
    return responseHandler(res, checkEmail.status, message, data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message || error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await authModel.getUserByEmail(email);
    if (checkEmail.data.length === 0) {
      return responseHandler(
        res,
        400,
        "Sorry, the email is not registered yet.",
        null
      );
    }

    const arrayName = checkEmail.data[0].name.split(" ");
    const nickName = arrayName[0][0].toUpperCase() + arrayName[0].substring(1);

    const otp = random({
      min: 100000,
      max: 999999,
      integer: true,
    });
    const hashOTP = await bcrypt.hash(otp.toString(), 10);
    await client.setEx(`reset-hashOTP:${checkEmail.data[0].id}`, 600, hashOTP);

    const mailOptions = {
      email,
      name: nickName,
      subject: `Karcis - Reset Password`,
      template: "template-2.html",
      url: `${process.env.CLIENT_URL}/api/auth/reset/${checkEmail.data[0].id}/${otp}`,
      title: "RESET PASSWORD",
      greeting: "Holaaa,",
      subtitle: "Update Your Password!",
      message:
        "Someone sent a password reset request. Click on the button below if this was you. The link is available only for 10 minutes. Not you? Don't worry, just ignore this email.",
      button: "Reset",
      submessage: "Don't worry, your account is safe with us.",
    };
    await sendEmail(mailOptions);

    const message = "Please check your email to reset your password.";
    const data = {
      email: checkEmail.data[0].email,
    };
    return responseHandler(res, checkEmail.status, message, data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message || error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id, otp } = req.params;
    const hashOTP = await client.get(`reset-hashOTP:${id}`);

    if (!hashOTP) {
      return responseHandler(
        res,
        400,
        "The link has expired, please make a new request.",
        null
      );
    }

    const checkOTP = await bcrypt.compare(otp.toString(), hashOTP);

    if (!checkOTP) {
      return responseHandler(
        res,
        400,
        "You don't have access. Please resend the request.",
        null
      );
    }

    const newHashPassword = await bcrypt.hash(newPassword, 10);
    const result = await userModel.updatePassword(newHashPassword, id);

    const arrayName = result.data[0].name.split(" ");
    const nickName = arrayName[0][0].toUpperCase() + arrayName[0].substring(1);

    const mailOptions = {
      email: result.data[0].email,
      name: nickName,
      subject: `Karcis - Your Password Has Been Reset`,
      template: "template-2.html",
      url: `${process.env.CLIENT_URL}`,
      title: "Your Password Has Been Reset",
      greeting: "Holaaa,",
      subtitle: "It wasn't you?",
      message:
        "Your password has been reset. If it wasn't you, please click the button bellow.",
      button: "It wasn't me",
      submessage: "Don't worry, your account is safe with us.",
    };
    await sendEmail(mailOptions);

    const data = {
      id: result.data[0].id,
      name: result.data[0].name,
      updated_at: result.data[0].updated_at,
    };

    await client.del(`reset-hashOTP:${id}`);

    return responseHandler(
      res,
      result.status,
      "Password has been reset.",
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
  signUp,
  logIn,
  logOut,
  refresh,
  activateAccount,
  resendActivation,
  forgotPassword,
  resetPassword,
};
