(function(){
  "use strict";
  
  var _ = require("underscore");
  
  var ControllerClass = require("../controllers/Suggest.js"),
 email           = require("../app/email.js");
  
  var dispatch, handler,
  handleGet, handlePost;

  handleGet = function(req, res, next){
    var params = {
      flash: req.flash(),
      name: req.session.displayName
    };
    
    var control = new ControllerClass(req.session.userId);
    control.renderView(res, params, {});
  };

  handlePost = function(req, res, next){
    var control = new ControllerClass(req.session.userId);
    control.addSuggestion(req.body.grade, req.body.name, null, null, function(){
    })
 email.sendEmail("hopkins-csc@groups.google.com", "nate@NATE.ORG", "FEEDBACK", "path/to/email/template.jade", templateVars);
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