(function(){
  "use strict";

  var _ = require("underscore");

  var dispatch, handler,
      handleGet;

  var ControllerClass = require("../controllers/Root.js");

  handleGet = function(req, res, next){
    if (req.session.valid){ // hardcode in auth check for now. Remove this once we get auth middleware up
      return res.redirect("/weekly");
    }
    console.log("headers", req.headers);

    var control = new ControllerClass();
    var realm   = (req.connection.encrypted ? "https" : "http") + "://" + req.headers.host;

    var params = {
      flash: req.flash()
    };

    control.renderView(res, params, {});
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
