 (function(){
  "use strict";

  var Routes = {
    Root: require("./Root"),
    Weekly: require("./Weekly"),
    Signup: require("./Signup"),
    Logout: require("./Logout"),
    Setup: require("./Setup"),
    SignupFailure: require("./SignupFailure"),
    Event: require("./Event"),
    AuthCallback: require("./AuthCallback"),
    Suggest: require("./Suggest")
  };

  // route, function, mongo, auth level, methods
  // auth level: 0 = not required, 1 = required, 2 = teacher, 3 = superuser
  var routeList = [
    ["/signup",          Routes.Signup,         1, 0, ["get"                  ]],
    ["/",                Routes.Root,           0, 0, ["get"                  ]],
    ["/weekly/:offset?", Routes.Weekly,         1, 1, ["get"                  ]],
    ["/login",           Routes.AuthCallback,   1, 0, ["get"                  ]],
    ["/logout",          Routes.Logout,         0, 1, ["get"                  ]],
    ['/setup',           Routes.Setup,          1, 1, ["get", "post"          ]],
    ["/event/:eventId?", Routes.Event,          1, 1, [       "post", "delete"]],
    ["/signup_error",    Routes.SignupFailure,  0, 0, ["get"                  ]],
    ["/suggest",	     Routes.Suggest,	    0, 1, ["get", "post"	      ]]
    //["/createClass",     Routes.Class,        1, 2, [       "post"          ]]
  ];
  exports.list = routeList;
}());
