const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const { promisify } = require("util");
require("dotenv").config();

const readFile = promisify(fs.readFile);

const createToken = (id, email) => {
  const userPayload = { email, id };
  const jwtOptions = { issuer: process.env.JWT_ISSUER, expiresIn: "600s" };
  const token = jwt.sign(userPayload, process.env.JWT_PRIVATE_KEY, jwtOptions);
  return token;
};

const sendConfirmationEmail = async (id, name, email) => {
  const token = createToken(id, email);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  const html = await readFile("./src/templates/confirmation.html", "utf8");
  const template = handlebars.compile(html);
  const data = {
    url: `${process.env.CLIENT_URL}confirmation/${token}`,
    name: name.toUpperCase(),
  };
  const htmlToSend = template(data);

  const mailOptions = {
    from: process.env.MAIL_SENDER,
    to: email,
    subject: `Karcis - Activate Your Account`,
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };
