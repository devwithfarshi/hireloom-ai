const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'salmanfarshiopt@gmail.com',
    pass: 'impmczzzstbxceoo',
  },
});

transporter.sendMail(
  {
    from: '"Ghost Test" <salmanfarshiopt@gmail.com>',
    to: 'devwithfarshi@gmail.com',
    subject: 'Ghost SSL Test Email',
    text: 'Testing SSL connection from Node.js',
  },
  (error, info) => {
    if (error) {
      return console.log('❌ Error:', error);
    }
    console.log('✅ Sent:', info.response);
  },
);
