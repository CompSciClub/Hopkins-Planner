(function(){
  "use strict";

  var _ = require("underscore");

  var dispatch, handler,
      handleGet;

  var ControllerClass = require("../controllers/Weekly.js");

  handleGet = function(req, res, next){
    var offset = parseInt(req.params.offset || 0, 10); // get the week offset from the url
    var control = new ControllerClass(offset, req.session.userId); // we need to deal with auth info better

    var params = {
      flash: req.flash(),
      name: req.session.displayName, // should this be in auth data?
      offset: offset
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
