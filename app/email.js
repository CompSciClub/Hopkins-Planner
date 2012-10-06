(function(){
  "use strict";
  var fs         = require("fs"),
      nodemailer = require("nodemailer"),
      jade       = require("jade");
  exports.sendEmail= function(sendaddress, emailaddress, subject, directory, vars) {
    var data = fs.readFile(directory, function(err, data){
      if (err){
        console.log("error", err);
        return;
      }
      var jadeTemplate = jade.compile(data.toString("utf8"));
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
     });
  };
}());
