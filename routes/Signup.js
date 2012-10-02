(function(){
  "use strict";
  var _ = require("underscore");

  var dispatch, handler,
      handleGet, handlePost;

  var ControllerClass = require("../controllers/Signup.js");

  handleGet = function(req, res, next){
    var control = new ControllerClass();

    var params = {
      flash: req.flash(),
      loggedIn: req.session.valid, // have to fix with middleware
      name: req.session.displayName // ugh
    };
    control.renderView(res, params, {});
  };

  handlePost = function(req, res, next){
    var pass       = req.body.password,
        email      = req.body.email,
        name       = req.body.name,
        is_teacher = (req.body.is_teacher === "on") ? true : false;
    var control = new ControllerClass();

    control.createUser(email, pass, name, is_teacher, function(err, user){
      if (err){
        if (err.type === undefined){ // this is a bad way to check for this
          req.flash("error", "That email is already being used");
          req.flash("errorContainer", "#accountModal");
          req.flash("errorEmail", "error");
        } else if (err.errors.email){
          req.flash("error", "Please try again with a valid email address");
          req.flash("errorContainer", "#accountModal");
          req.flash("errorEmail", "error");
        } else if (err.errors.password) {
          req.flash("error", "Password can not be empty");
          req.flash("errorContainer", "#accountModal");
          req.flash("errorPass", "error");
        }
        return res.redirect("/signup");
      }

      req.session.valid       = true;
      req.session.userId      = user._id;
      req.session.displayName = user.name;
      res.redirect(req.body.redirect || "/setup");
    });
  };

  dispatch = {GET: handleGet, POST: handlePost};
  handler  = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }
    return next(405);
  };

  module.exports = handler;
}());
