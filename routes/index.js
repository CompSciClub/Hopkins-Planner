(function(){
  "use strict";

  var Routes = {
    Root: require("./Root")
  };

  // route, function, mongo, auth level, methods
  // auth level: 0 = not required, 1 = required
  var routeList = [
    ["/", Routes.Root, 0, 0, ["get"]]
  ];

  exports.list = routeList;
}());
