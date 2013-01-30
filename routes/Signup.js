(function(){
  "use strict";
  var _   = require("underscore"),
      qs  = require("querystring"),
      url = require("url");

  var dispatch, handler,
      handleGet;

  var ControllerClass = require("../controllers/Signup.js");

  handleGet = function(req, res, next){
    var mode  = req.query["openid.mode"];
    if (mode === "cancel"){
      return req.redirect("/");
    }

    var email = req.query["openid.ext1.value.email"];
    var id    = qs.parse(url.parse(req.query["openid.claimed_id"]).query).id;

    var name = req.query["openid.ext1.value.firstname"] + " " + req.query["openid.ext1.value.lastname"];

    var is_teacher = (new RegExp(/[a-zA-Z0-9._-]+@hopkins\.edu$/).test(email));
    var control = new ControllerClass();

    control.createUser(email, id, name, is_teacher, function(err, user){
      if (err){
        if (_.has(err, "code")){
          if (err.code === 11000){
            console.log("sending to login", err, email);
            return res.redirect("/login?" + qs.stringify(req.query));
          }
        }

        if (_.has(err, "errors") && err.errors.email){ // this is a bad way to check for an already in-use email
          console.log("sending to signup error");
          req.flash("error", "Please try again with your Hopkins Google account");
          return res.redirect("/signup_error");
        } else {
          return next(500);
        }
      }

      console.log("user created");

      req.session.valid       = true;
      req.session.userId      = user._id;
      req.session.displayName = user.name;
      console.log("sending to setup");
      res.redirect(req.body.redirect || "/setup");
    });
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
