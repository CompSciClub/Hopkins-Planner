(function(){
  "use strict";
  
  var _ = require("underscore");
  
  var ControllerClass = require("../controllers/Suggest.js");
  
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