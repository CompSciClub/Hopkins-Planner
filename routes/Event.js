(function(){
  "use strict";

  var _ = require("underscore");

  var dispatch, handler,
      handleDelete, handlePost;


  dispatch = {POST: handlePost, DELETE: handleDelete};
  handler  = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }
    return next(405);
  };

  module.exports = handler;
}());
