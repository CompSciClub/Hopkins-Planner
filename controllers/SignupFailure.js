(function(){
  "use strict";

  var base      = require("./base"),
      ViewClass = require("../views/SignupFailure.js");

  var FailureCtrl, _ptype;

  FailureCtrl = function(){
    this.payload = {title: "Signup Error"};
    this._view   = new ViewClass();
  };

  _ptype = FailureCtrl.prototype = base.getProto("std");
  _ptype._name = "SignupFailure";

  module.exports = FailureCtrl;
}());
