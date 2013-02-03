(function(){
  "use strict";

  var _ = require("underscore");

  var dispatch, handler,
      handleGet, handlePost;

  var ControllerClass = require("../controllers/Holiday.js");

  handleGet = function(req, res, next){
    var controller = new ControllerClass();

    var params = {
      name: req.session.displayName
    };
    controller.renderView(res, params, {});
  };

  handlePost = function(req, res, next){
    var controller = new ControllerClass();

    controller.createHoliday(req.body.name || "", req.body.noSchool, req.body.timestamp, req.body.day, function(err){
      if (err){
        console.log("holiday error", err);
        return res.json({
          msg: "Unable to add Holiday"
        });
      }

      return res.json({
        msg: "Holiday added"
      });
    });
  };

  dispatch     = {GET: handleGet, POST: handlePost};
  handler      = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }

    return next(405);
  };

  module.exports = handler;
}());
