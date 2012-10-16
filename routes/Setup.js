(function(){
  "use strict";
  
  var _ = require("underscore");
  
  var ControllerClass = require("../controllers/Setup.js");
  
  var dispatch, handler,
  handleGet, handlePost;

  handleGet = function(req, res, next){
    if (!req.session.valid){
      req.flash("error", "You have to login first.");
      res.redirect("/login");
      return;
    }
    
    var control = new ControllerClass();
    control.setupUserGet(function(err, user){
                        if (err){
                          req.flash("error", "Something went wrong.")
                          return res.redirect("/login")
                        }
                        
                        return res.redirect(req.body.redirect || "/weekly");
                        });
                       
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
    control.setupUserPost(blocks, function(err, user){
                      if (err){
                        req.flash("error", "Something went wrong.")
                        return res.redirect("/login")
                      }
                      
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