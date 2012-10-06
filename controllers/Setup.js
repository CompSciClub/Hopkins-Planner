function(){
  "use strict";

  var base = require("./base.js"),
      Crypto =require("ezcrypto").Crypto,
      ViewClass = require("../views/Login.js");

  var SetupCtrl, _ptype;

  SetupCtrl = function(){
    this.payload = {
      title: "Setup"
    };
    
    this._view = new ViewClass();
  };
  
  _ptype = SetupCtrl.prototype = base.getProto("std");
  _ptype._name = "Setup";
  
  _ptype.setupUserGet(cb){
    User.find({_id: req.session.userId}, function(err, users){
              var user = users[0];
              if (err || users.length == 0 ){
              console.log("no user");
              console.log("Error finding user");
              req.session.valid = false;
              res.render("500", {title: "500", loggedIn: true, flash: req.flash(), name: req.session.displayName});
              return;
              }
              var emailSettings = user.emailSettings[0] || {};
              res.render("setup", {title: "Setup", loggedIn: true, flash: req.flash(), name: req.session.displayName, grade: user.grade,
                         nightly: emailSettings.nightly, weekly: emailSettings.weekly, important: emailSettings.important,
                         blocks: user.blocks[0]});
              });
  }
  
  _ptype.setupUserPost(blocks, cb){
    User.find({_id: req.session.userId}, function(err, users){
              var user = users[0];
              if (err || !user){
                console.log("Error finding user");
                res.render("500", {title: "500", loggedIn: true, name: req.session.displayName});
              }
              user.blocks = blocks;
              user.grade  = req.body.grade;
              user.name   = req.body.name;
              user.emailSettings = {
                nightly: typeof req.body.nightly !== 'undefined' && req.body.nightly == "on",
                weekly: typeof req.body.weekly !== 'undefined' && req.body.weekly == "on",
                important: typeof req.body.important !== 'undefined' && req.body.important == "on"
              };
              console.log(user.emailSettings);
              user.save();
              req.session.displayName = req.body.name;
              res.redirect(req.body.redirect || "/weekly");
              });
  }
  
  module.exports = SetupCtrl;
}());