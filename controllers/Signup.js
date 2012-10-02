(function(){
  "use strict";

  var base      = require("./base.js"),
      ViewClass = require("../views/Signup.js");


  var SignupCtrl, _ptype;

  SignupCtrl = function(){
    this.payload = {
      title: "Signup"
    };

    this._view = new ViewClass();
  };

  _ptype = SignupCtrl.prototype = base.getProto("std");
  _ptype._name = "Signup";

  module.exports = SignupCtrl;
}());
