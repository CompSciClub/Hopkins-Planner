(function(){
  "use strict";
  
  var _ = require("underscore");
  
  var ControllerClass = require("../controllers/Setup.js");
  
  var dispatch, handler,
  handleGet, handlePost;

  handleGet = function(req, res, next){
    console.log("setting up", req.session.valid);
    if (!req.session.valid){
      req.flash("error", "You have to login first.");
      return res.redirect("/login");
    }

    var params = {
      flash: req.flash(),
      name: req.session.displayName
    };
    
    var control = new ControllerClass(req.session.userId);
    control.renderView(res, params, {});
  };

  handlePost = function(req, res, next){
    if (!req.session.valid){
      req.flash("error", "You have to login first.");
      res.redirect("/login");
      return;
    }
    var control = new ControllerClass();
    var blocks = {
      A: req.body.aBlock,
      B: req.body.bBlock,
      C: req.body.cBlock,
      D: req.body.dBlock,
      E: req.body.eBlock,
      F: req.body.fBlock,
      G: req.body.gBlock,
      H: req.body.hBlock
    };
    var emailSettings = {
      nightly: typeof req.body.nightly !== 'undefined' && req.body.nightly === "on",
      weekly: typeof req.body.weekly !== 'undefined' && req.body.weekly === "on",
      important: typeof req.body.important !== 'undefined' && req.body.important === "on"
    };
    control.setupUserPost(req.body.grade, req.body.name, blocks, emailSettings, function(err, user){
      if (err){
        req.flash("error", "Something went wrong.");
        return res.redirect("/login");
      }
      req.session.displayName = user.name;
      
      return res.redirect(req.body.redirect || "/weekly");
    });
  };

  dispatch = {GET: handleGet, POST: handlePost};
  handler = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }
    return next(405);
  };

  module.exports = handler;
}());
