const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    logger: true,
    debug: true,
  });
  const mailOptions = {
    from: `"Task Management" <${process.env.SMTP_USERNAME}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html || "",
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
