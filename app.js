
/**
 * Module dependencies.
 */

var express         = require('express')
  , routes          = require('./routes')
  , mongoose        = require("mongoose")
  , mongoStore      = require("connect-mongodb")
  , schemas         = require("./schemas");

var app        = module.exports = express.createServer();
var mongoURI   = process.env.MONGOLAB_URI || "mongodb://127.0.0.1/calendar";
mongoose.connect(mongoURI);

mongoose.connection.on("open", function(){
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set("view options", {"layout": false});
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session( {store: new mongoStore({db: mongoose.connection.db}), cookie: {httpOnly: true, maxAge: 604800000}, secret: process.env.secret || "The computer science club will rise again... and reclaim B204" }));
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
  });
  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });

  app.configure('production', function(){
    app.use(express.errorHandler()); 
  });

  // Routes

  app.get('/', routes.index);
  app.get("/monthly", routes.monthly);
  app.get("/weekly/:offset?", routes.weekly);

  app.get("/logout", routes.logout);
  app.get("/login", routes.loginPage);
  app.get("/signup", routes.createAccount);

  app.post("/createAccount", routes.createUser);
  app.post("/login", routes.login);

  app.post('/setup', routes.setPreferences);
  app.get("/setup", routes.setup);

  // events
  app.post("/event", routes.createEvent);
  app.post("/event/:eventId", routes.modifyEvent);
  app.delete("/event/:eventId", routes.deleteEvent);

  app.post("/createClass", routes.createClass);
  app.post("/addStudent", routes.addStudent);

  // administrative tasks
  app.post("/holiday", routes.createHoliday);
  app.get("/holiday", routes.createHoliday_page);
  
  app.get("*", routes.noPage);


  app.listen(process.env.PORT || 3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);



});
// Configuration
