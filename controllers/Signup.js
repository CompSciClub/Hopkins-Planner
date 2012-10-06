/*globals User*/
(function(){
  "use strict";

  var base        = require("./base.js"),
      emailHelper = require("../app/email.js"),
      ViewClass   = require("../views/Signup.js"),
      Crypto      = require("ezcrypto").Crypto;


  var SignupCtrl, _ptype,
      createSalt, sendEmail;

  SignupCtrl = function(){
    this.payload = {
      title: "Signup"
    };

    this._view = new ViewClass();
  };

  _ptype = SignupCtrl.prototype = base.getProto("std");
  _ptype._name = "Signup";

  _ptype.createUser = function(email, pass, name, is_teacher, cb){
    var salt     = createSalt();
    var password = Crypto.SHA256(pass + salt);
    var token    = Crypto.SHA256(Math.random());
    var user  = new User({
      email: email,
      password: password,
      salt: salt,
      name: name,
      is_teacher: is_teacher,
      classes: [],
      blocks: [{}],
      emailSettings: [{}],
      valid: false,
      token: token
    });

    user.save(function(err){
      cb(err, user);
      emailHelper.sendEmail("verficiation@hopkinsplanner.com", user.email, "Email Verification", "views/emails/verify.jade", {url: process.env.URL || "localhost:3000" , token: token}); // have to replace config vars
    });
  };

  createSalt = function(){
    var string = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 3; i++ ){
      string += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return Crypto.SHA256(string);
  };
  module.exports = SignupCtrl;
}());
