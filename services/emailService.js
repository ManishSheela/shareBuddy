const nodemailer = require("nodemailer");

async function sendMail({ from, to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  const info = await transporter.sendMail({
    from: `sharBuddy <${from}>`,
    to,
    subject,
    text,
    html,
  });
   
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = sendMail;
