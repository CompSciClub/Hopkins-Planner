(function(){
  "use strict";
  /**
   * Module dependencies.
   */

  var express         = require('express')
    , routes          = require('./routes/index.old.js')
    , routeList       = require("./routes/index.js")
    , mongoose        = require("mongoose")
    , MongoStore      = require("connect-mongodb")
    , _               = require("underscore")
    , schemas         = require("./schemas");

  var URL = process.env.URL || "localhost:3000";

  var app        = module.exports = express.createServer();
  var mongoURI   = process.env.MONGOLAB_URI || "mongodb://127.0.0.1/planner";
  mongoose.connect(mongoURI);

  mongoose.connection.on("open", function(){
    app.configure(function(){
      app.set('views', __dirname + '/templates');
      app.set('view engine', 'jade');
      app.set("view options", {"layout": false});
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.cookieParser());
      app.use(express.session( {store: new MongoStore({db: mongoose.connection.db}), cookie: {httpOnly: true, maxAge: 604800000}, secret: process.env.secret || "The computer science club will rise again... and reclaim B204" }));
      app.use(express["static"](__dirname + '/public'));
      app.use(app.router);
    });
    app.configure('development', function(){
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function(){
      app.use(express.errorHandler());
    });

    // Routes
    _.each(routeList.list, function(route){
      var methods = route[4] || ["get"];

      methods.forEach(function(method){
        var params = [], confVar = -1;


        // TODO: auth and schemas
        /*if (route[2] === true){
          confVar = 1;
        }
        params.push(auth(conf, confVar));*/
        // add in ordrinApi

        app[method](route[0], params, route[1]);
      });
    });

    app.get("/monthly", routes.monthly);

    app.get("/logout", routes.logout);
    app.get("/signup", routes.createAccount);

    app.post("/createAccount", routes.createUser);
    app.get("/verify/:token", routes.verify);

    app.post('/setup', routes.setPreferences);
    app.get("/setup", routes.setup);

    // events
    app.post("/event", routes.createEvent);
    app.post("/event/:eventId", routes.modifyEvent);
    app["delete"]("/event/:eventId", routes.deleteEvent);

    app.post("/createClass", routes.createClass);
    app.post("/addStudent", routes.addStudent);

    // administrative tasks
    app.post("/holiday", routes.createHoliday);
    app.get("/holiday", routes.createHoliday_page);
    
    app.get("*", routes.noPage);


    app.listen(process.env.PORT || 3000);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    
  });
  process.on("uncaughtException", function(err){
    console.log("error", err);
  });
}());
