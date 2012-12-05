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

    var control = new ControllerClass();
    var params = {
      loggedIn: false, // replace once auth check works
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
