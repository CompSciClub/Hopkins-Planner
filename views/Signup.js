(function(){
  "use strict";

  var base = require("./base.js");

  var SignupCtrl, _ptype;

  SignupCtrl = function(){};

  _ptype = SignupCtrl.prototype = base.getProto("std");
  _ptype._view_name = "Signup";
  _ptype._template  = "createAccount.jade";

  module.exports = SignupCtrl;
}());
