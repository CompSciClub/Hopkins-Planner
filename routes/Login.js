(function(){
  "use strict";

  var _ = require("underscore");

  var ControllerClass = require("../controllers/Login.js");

  var dispatch, handler,
      handleGet, handlePost;

  handleGet = function(req, res, next){
    var control = new ControllerClass();
    var email = req.body.email;
    var password = req.body.password;

    control.loginUser(email, password, function(err, user){
      if (err){
        if (err.field === "email"){
          req.flash("error", "Invalid email");
          req.flash("email", req.body.email);
          req.flash("emailError", "error");
          return res.redirect("/login");
        } else {
          req.flash("error", "Invalid password");
          req.flash("passError", "error");
          req.flash("email", req.body.email);
          return res.redirect("/login");
        }
      }

      // this should probably be moved to auth middleware somehow
      req.session.displayName = user.name;
      req.session.valid       = 1;
      req.session.userId      = user._id;
      req.session.teacher     = user.is_teacher;
      return res.redirect(req.body.redirect || "/weekly");
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
