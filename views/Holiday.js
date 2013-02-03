(function(){
  "use strict";
  
  var base = require("./base.js");


  var HolidayView, _ptype;

  HolidayView = function(){};

  _ptype = HolidayView.prototype = base.getProto("std");
  _ptype._view_name = "HolidayView";
  _ptype._template  = "addHoliday.jade";

  module.exports = HolidayView;
}());
