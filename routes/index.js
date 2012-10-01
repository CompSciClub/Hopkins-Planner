(function(){
  "use strict";

  var Routes = {
    Root: require("./Root"),
    Weekly: require("./Weekly")
  };

  // route, function, mongo, auth level, methods
  // auth level: 0 = not required, 1 = required
  var routeList = [
    ["/",               Routes.Root,   0, 0, ["get"]],
    ["/weekly/:offset?", Routes.Weekly, 1, 1, ["get"]]
  ];

  exports.list = routeList;
}());
