/*global User */
(function(){
  "use strict";

  var _   = require("underscore"),
      qs  = require("querystring"),
      Crypto    = require("ezcrypto").Crypto,
      url = require("url");

  var ControllerClass = require("../controllers/AuthCallbackController.js");

  var dispatch, handler,
      handleGet;

  handleGet = function(req, res, next){
    var controller = new ControllerClass();

    if (!_.has(req.query, "openid.mode") || !_.has(req.query, "openid.ext1.value.email") || !_.has(req.query, "openid.claimed_id")){
      var realm    = (req.connection.encrypted ? "https" : "http") + "://" + req.headers.host;
      var callback = realm + "/login";
      return res.redirect('https://www.google.com/accounts/o8/ud?openid.ns=http://specs.openid.net/auth/2.0&openid.return_to=' + callback + '&openid.mode=checkid_setup&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.ns.ax=http://openid.net/srv/ax/1.0&openid.ax.mode=fetch_request&openid.ax.type.email=http://axschema.org/contact/email&openid.ax.type.firstname=http://axschema.org/namePerson/first&openid.ax.type.lastname=http://axschema.org/namePerson/last&openid.ax.required=email,firstname,lastname&openid.realm=' + realm);
    }

    var mode  = req.query["openid.mode"];
    var email = req.query["openid.ext1.value.email"];
    var id    = qs.parse(url.parse(req.query["openid.claimed_id"]).query).id;
    
    controller.loginUser(mode, email, id, function(err, user){
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
            res.redirect("/signup?" + qs.stringify(req.query));
            break;
          case "invalid":
            next(401);
            break;
          default:
            next(500);
            break;
        }
      } else {
        req.session.displayName = user.name;
        req.session.valid       = 1;
        req.session.userId      = user._id;
        req.session.teacher     = user.is_teacher;
        return res.redirect("/weekly");
      }
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
