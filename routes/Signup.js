(function(){
  "use strict";
  var _ = require("underscore");

  var dispatch, handler,
      handleGet, handlePost;

  var ControllerClass = require("../controllers/Signup.js");

  handleGet = function(req, res, next){
    var control = new ControllerClass();

    var params = {
      flash: req.flash(),
      loggedIn: req.session.valid, // have to fix with middleware
      name: req.session.displayName // ugh
    };
    control.renderView(res, params, {});
  };

  dispatch = {GET: handleGet, POST: handlePost};
  handler  = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }
    return next(405);
  };

  module.exports = handler;
}());
