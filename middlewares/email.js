var nodemailer = require('nodemailer');
const emailModel = require('../models/user');

exports.sendMailController = (send_to, text) => {
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.EMAIL_USER,
        to: send_to,
        subject: process.env.EMAIL_SUBJ,
        text: text
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        console.log(info);
        if (error) {
            emailModel.insertEmailErrorLog(mailOptions, error)
            console.log(error);
        } else {
            emailModel.insertEmailLog(info, mailOptions)
            console.log('Email sent: ' + info + 'To: '+email);
        }
      });

}