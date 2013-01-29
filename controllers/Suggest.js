/*global User*/
(function(){
  "use strict";

  var base      = require("./base.js"),
      Crypto    = require("encrypto").Crypto,
      _         = require("underscore"),
      ViewClass = require("../views/Suggest.js");

  var SuggestCtrl, _ptype;

  SuggestCtrl = function(uid){
    this.payload = {
      title: "Suggest",
      loggedIn: true
    };

    this.uid = uid;
    
    this._view = new ViewClass();
  };
  
  _ptype = SuggestCtrl.prototype = base.getProto("std");
  _ptype._name = "Suggest";
  
  _ptype.prePrep = function(data, cb){
    var self = this;
    User.find({_id: self.uid}, function(err, users){
      console.log("found user");
      var user = users[0];
      if (err || users.length === 0 ){
        console.log("no user");
        console.log("Error finding user");
        return cb({
          statusCode: 500
        });
      }

      var emailSettings = user.emailSettings[0] || {};
      var params = {
        grade: user.grade,
        nightly: emailSettings.nightly,
        weekly: emailSettings.weekly,
        important: emailSettings.important,
        blocks: user.blocks[0]
      };

      data = _.extend(data, params);
      console.log("calling back", data);
      cb();
    });
  };
  
  module.exports = SuggestCtrl;
}());