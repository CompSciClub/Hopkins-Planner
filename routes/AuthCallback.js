/*global User */
(function(){
  "use strict";

  var _   = require("underscore"),
      qs  = require("querystring"),
      openid = require("openid"),
      Crypto    = require("ezcrypto").Crypto,
      url = require("url");

  var ControllerClass = require("../controllers/AuthCallbackController.js"),
      SignupControllerClass = require("../controllers/Signup.js");

  var dispatch, handler,
      handleGet, signupUser;

  handleGet = function(req, res, next){
    var realm    = (req.connection.encrypted ? "https" : "http") + "://" + req.headers.host;
    var callback = realm + "/login";
    var openidExtensions = [
      new openid.AttributeExchange({
        "http://axschema.org/contact/email": "required",
        "http://axschema.org/namePerson/first": "required",
        "http://axschema.org/namePerson/last": "required"
      })
    ];

    var relyingParty = new openid.RelyingParty(
      callback,
      realm,
      false,
      true,
      openidExtensions
    );
    var controller = new ControllerClass();

    if (!_.has(req.query, "openid.mode") || !_.has(req.query, "openid.ext1.value.email") || !_.has(req.query, "openid.claimed_id")){
      console.log("redirecting");
      relyingParty.authenticate("https://www.google.com/accounts/o8/id", false, function(err, authUrl){
        if (err){
          console.log("error redirecting to google");
          return next(500);
        } else if (!authUrl){
          console.log("blank auth url");
          return next(500);
        } else {
          res.redirect(authUrl);
        }
      });
    } else {
      relyingParty.verifyAssertion(req, function(err, result){
        console.log("got openid result", err, result);
        if (err){
          console.log("error signing in user", err);
          return next(500);
        }
        console.log(result.email, result.claimedIdentifier);
        controller.loginUser(result.email, result.claimedIdentifier, function(err, user){
          if (err){
            console.log("error logging in user", err);
            switch (err.type){
              case "cancel":
                res.redirect("/");
                break;
              case "db":
                next(500);
                break;
              case "new":
                signupUser(result, function(err, user){
                  if (err){
                    if (err.error === "invalidEmail"){
                      req.flash("error", "Please try again with your Hopkins Google account");
                      return res.redirect("/signup_error");
                    } else {
                      return next(500);
                    }
                  } else {
                  console.log("user created");

                  req.session.valid       = true;
                  req.session.userId      = user._id;
                  req.session.displayName = user.name;
                  console.log("sending to setup");
                  res.redirect(req.body.redirect || "/setup");
                  }
                });
                //res.redirect("/signup?" + qs.stringify(req.query));
                break;
              case "invalid":
                next(401);
                break;
              default:
                next(500);
                break;
            }
          } else {
            console.log("logged in");
            req.session.displayName = user.name;
            req.session.valid       = 1;
            req.session.userId      = user._id;
            req.session.teacher     = user.is_teacher;
            return res.redirect("/weekly");
          }
        });
      });
    }
  };

  signupUser = function(authInfo, cb){
    var signupController = new SignupControllerClass();

    var is_teacher = (new RegExp(/[a-zA-Z0-9._-]+@hopkins\.edu$/).test(authInfo.email));
    signupController.createUser(authInfo.email, authInfo.claimedIdentifier, authInfo.firstname + " " + authInfo.lastname, is_teacher, function(err, user){
      if (err){
        if (_.has(err, "errors") && err.errors.email){
          console.log("sending to signup error");
          return cb({error: "invalidEmail"});
        } else {
          return cb({error: "unknown"});
        }
      }

      return cb(false, user);
    });
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
