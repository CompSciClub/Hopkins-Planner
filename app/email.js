(function(){
  "use strict";
  var fs         = require("fs"),
      nodemailer = require("nodemailer"),
      jade       = require("jade");

  exports.sendEmail= function(sendaddress, emailaddress, subject, template, vars) {
    var jadeTemplate = jade.compile(template.toString("utf8"));
    var html = jadeTemplate(vars);
    nodemailer.SMTP = {
      host: "smtp.mailgun.org",
      port: 587,
      ssl: false,
      use_authentication: true,
      user: process.env.MAILGUN_SMTP_LOGIN,
      pass: process.env.MAILGUN_SMTP_PASSWORD
    };
    console.log(nodemailer.SMTP);
    nodemailer.send_mail(
      {
        sender: sendaddress,
        to: emailaddress,
        subject: subject,
        html: html
      }, function(error, success){
        if (!success){
          console.log("Error sending message", error);
        } else {
          console.log("Message sent");
        }
      });
  };
}());
