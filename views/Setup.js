(function(){
  "use strict";

  var base = require("./base.js");

  var SetupView, _ptype;

  SetupView = function(){};

  _ptype = SetupView.prototype = base.getProto("std");
  _ptype._view_name = "Setup";
  _ptype._template  = "setup.jade";

  module.exports = SetupView;
}());
