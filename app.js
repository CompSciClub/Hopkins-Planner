
/**
 * Module dependencies.
 */

var express  = require('express')
  , routes   = require('./routes')
  , mongoose = require("mongoose") 
  , schemas  = require("./schemas");


var app = module.exports = express.createServer();
console.log(process.env.MONGOLAB_URI || "mongodb://localhost/calender");
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/calendar");

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  require("./customFilters.js");
  app.set("view options", {"layout": false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: process.env.secret || "Pick a secret if not on Heroku" }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
app.get("/weekly", routes.weekly);

app.get("/logout", routes.logout);
app.get("/login", routes.loginPage);
app.get("/signup", routes.createAccount);

app.post("/createAccount", routes.createUser);
app.post("/login", routes.login);
app.post("/event", routes.createEvent);


app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

