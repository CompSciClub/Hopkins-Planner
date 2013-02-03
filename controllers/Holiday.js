/*globals Holiday*/
(function(){
  "use strict";

  var base = require("./base.js"),
      ViewClass = require("../views/Holiday.js"),
      HolidayCtrl, _ptype;


  HolidayCtrl = function(){
    this.payload = {title: "Add Holiday"};
    this._view = new ViewClass();
  };


  _ptype       = HolidayCtrl.prototype = base.getProto("std");
  _ptype._name = "Holiday";

  _ptype.addHoliday = function(name, noSchool, timestamp, day, cb){
    var holiday = new Holiday({
      name: name,
      noSchool: noSchool,
      timestamp: timestamp,
      day: day
    });

    holiday.save(cb);
  };


  module.exports = HolidayCtrl;
}());
