(function(){
  "use strict";

  var handler;

  handler = function(conf, level){
    if (level === 0){
      return function(req, res, next){
        res.loggedIn = req.session.valid || false;
        next();
      };
    } else if (level === 1){
      return function(req, res, next){
        res.loggedIn = req.session.valid || false;
        if (!req.session.valid){
          req.flash("error", "Sorry, please login below to do that.");
          return res.redirect("/login");
        }
        next();
      };
    } else if (level === 2){
      return function(req, res, next){
        res.loggedIn = req.session.valid || false;
        if (!req.session.valid){
          res.redirect("/login");
        } else if (!req.session.teacher){
          next(401);
        } else {
          next();
        }
      };
    } else if (level === 3){
      return function(req, res, next){
        res.loggedIn = req.session.loggedIn || false;
        if (!req.session.loggedIn){
          res.redirect("/admin/login");
        } else if (!req.session.admin){
          next(401);
        } else {
          next();
        }
      };
    }
  };

  module.exports = handler;
}());
