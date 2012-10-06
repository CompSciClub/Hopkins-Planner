(function(){
  "use strict";
  
  var base = require("./base.js");


  var RootView, _ptype;

  RootView = function(){};

  _ptype = RootView.prototype = base.getProto("std");
  _ptype._view_name = "RootView";
  _ptype._template  = "index.jade";

  module.exports = RootView;
}());
