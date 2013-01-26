(function(){
  "use strict";
  
  var base = require("./base.js");


  var SignupFailureView, _ptype;

  SignupFailureView = function(){};

  _ptype = SignupFailureView.prototype = base.getProto("std");
  _ptype._view_name = "SignupFailureView";
  _ptype._template  = "signup_failure.jade";

  module.exports = SignupFailureView;
}());
