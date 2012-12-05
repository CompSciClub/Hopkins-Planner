(function(){
  "use strict";

  var base = require("./base.js");

  var LoginView, _ptype;

  LoginView = function(){};

  _ptype = LoginView.prototype = base.getProto("std");
  _ptype._view_name = "Login";
  _ptype._template  = "login.jade";

  module.exports = LoginView;
}());
