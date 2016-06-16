'use strict';

var nodemailer = require('nodemailer');

module.exports = (message, cb) => {
  const transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: process.env.mailgunLogin,
      pass: process.env.mailgunPassword,
    },
  });

  message.from = 'theletsmeetteam@gmail.com';

  transporter.sendMail(message, (err, info) => {
    if (err) cb(err, info);
    else cb(undefined, info);
  });
};
