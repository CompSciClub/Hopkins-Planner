(function(){
  "use strict";
  
  var base = require("./base.js");


  var WeeklyView, _ptype;

  WeeklyView= function(){};

  _ptype = WeeklyView.prototype = base.getProto("std");
  _ptype._view_name = "WeeklyView";
  _ptype._template  = "week.jade";

  module.exports = WeeklyView;
}());
