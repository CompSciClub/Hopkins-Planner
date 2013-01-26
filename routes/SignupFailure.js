(function(){
  "use strict";

  var _ = require("underscore");

  var dispatch, handler,
      handleGet;

  var ControllerClass = require("../controllers/SignupFailure.js");

  handleGet = function(req, res, next){
    var controller = new ControllerClass();
    
    var params = {
      flash: req.flash(),
      signupCallback: (req.connection.encrypted ? "https" : "http") + "://" + req.headers.host + "/signup"
    };

    controller.renderView(res, params, {});
  };

  dispatch = {GET: handleGet};
  handler  = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }

    return next(405);
  };

  module.exports = handler;
}());
