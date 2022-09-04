const bcrypt = require("bcrypt");
const authModel = require("../models/auth");
const responseHandler = require("../utils/responseHandler");
const { sendConfirmationEmail } = require("../config/nodemailer");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await authModel.signUp(name, email, hashedPassword);
    await sendConfirmationEmail(result.data.id, name, email);
    responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    responseHandler(res, error.status, error.error.message);
  }
};

module.exports = { signUp };
