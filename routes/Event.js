(function(){
  "use strict";

  var _ = require("underscore");

  var dispatch, handler,
      handleDelete, handlePost;

  var ControllerClass = require("../controllers/Event.js");

  handlePost = function(req, res, next){
    if (!req.session.valid){
      req.flash("error", "You have to login first.");
      res.redirect("/login");
      return;
    }

    var e = {
      name        : req.body.name          || null,
      timestamp   : req.body.timestamp     || null,
      day         : req.body.day           || null,
      block       : req.body.block         || null,
      description : req.body.description   || null,
      "class"     : req.body.bootClass     || null,
      id          : req.params.eventId,
      done        : (typeof req.body.done !== "undefined") ? req.body.done === "true" : null
    };

    var control = new ControllerClass(req.session.userId);
    control.modifyEvent(e, function(error, e){
      if (!error){
        res.end(JSON.stringify({error: 0, msg: "Event modified"}));
      }else{
        return next(500);
        /*res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: 400, msg: error}));
        console.log("error saving event", error);*/
      }
    });
  };

  handleDelete = function(req, res, next){
    if (!req.session.valid){
      req.flash("error", "You have to login first.");
      res.redirect("/login");
      return;
    }

    var control = new ControllerClass(req.session.userId);
    control.deleteEvent(req.params.eventId, function(err){
      if (err){
        return next(500);
      }

      res.json({error: 0, msg: "Event deleted succesfully"});
    });
  };


  dispatch = {POST: handlePost, DELETE: handleDelete};
  handler  = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }
    return next(405);
  };

  module.exports = handler;
}());
