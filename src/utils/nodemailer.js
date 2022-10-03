const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const { promisify } = require("util");
const accessToken = require("../config/gmail");
require("dotenv").config();

const sendEmail = async (options) => {
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

  const readFile = promisify(fs.readFile);
  const html = await readFile(`./src/templates/${options.template}`, "utf8");
  const template = handlebars.compile(html);

  const mailOptions = {
    from: '"Karcis" <admin.karcisproject@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: template(options),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
