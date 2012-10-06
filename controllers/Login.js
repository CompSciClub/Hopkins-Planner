/*global User*/
(function(){
  "use strict";

  var base      = require("./base.js"),
      Crypto    = require("ezcrypto").Crypto,
      ViewClass = require("../views/Login.js");

  var LoginCtrl, _ptype;

  LoginCtrl = function(){
    this.payload = {
      title: "Login"
    };

    this._view = new ViewClass();
  };

  _ptype = LoginCtrl.prototype = base.getProto("std");
  _ptype._name = "Login";

  _ptype.loginUser = function(email, pass, cb){
    User.find({email: email}, function(err, users){
      var user = users[0];

      if (users.length === 0){
        return cb({
          field: "email"
        });
      }

      if (Crypto.SHA256(pass + user.salt) === user.password){
        return cb(false, user);
      }else{
        return cb({
          field: "password"
        });
      }
    });
  };

  module.exports = LoginCtrl;
}());
