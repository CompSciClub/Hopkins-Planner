/*global User*/
(function(){
  "use strict";

  var base = require("./base.js"),
      Crypto    = require("ezcrypto").Crypto,
      _    = require("underscore");

  var AuthController, _ptype;

  AuthController = function(){
  };

  _ptype       = AuthController.prototype = base.getProto("std");
  _ptype._name = "AuthCallback";

  _ptype.loginUser = function(email, id, cb){
    User.findOne({email: email}, function(err, user){
      if (err){
        return cb({type: "db"});
      }

      if (_.isUndefined(user) || _.isNull(user)){
        return cb({type: "new"});
      }

      if (Crypto.SHA256(id + user.salt) === user.password){
        return cb(null, user);
      } else {
        return cb({type: "invalid"});
      }
    });
  };

  module.exports = AuthController;
}());
