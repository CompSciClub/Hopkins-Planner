(function(){
  "use strict";

  var base = require("./base.js");

  var SuggestView, _ptype;

  SuggestView = function(){};

  _ptype = SuggestView.prototype = base.getProto("std");
  _ptype._view_name = "Suggest";
  _ptype._template = "suggest.jade";

  module.exports = SuggestView;
}());