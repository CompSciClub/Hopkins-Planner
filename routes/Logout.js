(function(){
  "use strict";

  var _ = require("underscore");

  var dispatch, handler,
      handleGet;

  handleGet = function(req, res, next){
    req.session.destroy();
    res.redirect(req.body.redirect || "/");
  };

  dispatch = {GET: handleGet};
  handler = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }
    return next(405);
  };

  module.exports = handler;
}());
