const nodeMailer = require('nodemailer');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify().then(() => {
  console.log('SMTP connected — ready to send emails');
}).catch(err => {
  console.error('SMTP connection failed:', err.message);
});

const sendMail = async (to, subject, text, html) => {
  const msg = {
    from: `"Wear & Gear" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
  };
  if (html) msg.html = html;
  await transporter.sendMail(msg);
};

module.exports = sendMail;
