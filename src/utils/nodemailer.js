const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const accessToken = require("../config/gmail");
require("dotenv").config();

const sendConfirmationEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken,
    },
  });
  const html = await fs.readFileSync(
    `./src/templates/${options.template}`,
    "utf8"
  );
  const template = handlebars.compile(html);

  const mailOptions = {
    from: process.env.MAIL_SENDER,
    to: options.email,
    subject: options.subject,
    html: template(options),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };
