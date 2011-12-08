// for now all routes go in here. We will probbably break them up at some point

var Crypto = require("ezcrypto").Crypto;

/*
 * GET home page.
 */

exports.index = function(req, res){
  if (!isLoggedIn(req)){
    exports.loginPage(req, res);
  }else{
    exports.weekly(req, res);
  }
};

/*
 * GET monthly calendar page.
 */

exports.monthly = function(req, res){
  res.render("calendar", {title: "Monthly Planner"});
};

/*
 * GET /weekly
 */

exports.weekly = function(req, res){
  res.render("week", {title: "Weekly Planner"});
}

/*
 * Simple Login page, will probbably rarely be used as our index should eventually have a login feature
 */

exports.loginPage = function(req, res){
  res.render("login", {title: "Login"});
}

/*
 * POST /createAccount
 */
exports.createUser = function(req, res){
  var salt     = createSalt();
  var password = Crypto.SHA256(req.body.password + salt); 
  var user  = new User({
    email: req.body.email,
    password: password,
    salt: salt
  });
  user.save(function(err){
    if (err){
      console.log(err);
      error({
        Status: 400,
        msg: err.message,
        code: 101
      }, res);
    }else{
      res.redirect(req.body.redirect || "back");
    }
  })
};

/* 
 * POST /login
 */
exports.login = function(req, res){
  email = req.body.email;
  console.log(email);
  User.find({email: email}, function(err, users){
    console.log("got user");
    user = users[0];
    if (Crypto.SHA256(req.body.password + user.salt)){
      validateUser(req, user.user_id);
      res.redirect(req.body.redirect || "back");
    }
  });
  console.log("sent query");
}

/*
 * GET /logout
 */
 exports.logout = function(req, res){
   logout(req);
   res.redirect(req.body.redirect || "back");
 }

 /*
  * Event Requests
  */

 /*
  * POST /event
  */
  exports.createEvent = function(req, res){
    var newEvent = new Event({
      type: "individual", // for now there is only support for individual student events
      name: req.body.name,
      day: req.body.day,
      month: req.body.month,
      year: req.body.year,
      block: req.body.block,
      description: req.body.description,
      owner: req.session.userId
    });
    newEvent.save(function(error){
      res.writeHead(200, {"Content-Type": "application/json"});
      if (!error){
        res.end(JSON.stringify({error: 0, msg: "Event added"}));
      }else{
        res.end(JSON.stringify({error: 101, msg: error}));
      }
    });
  }


// User releated functions we may want to move these to another file
function validateUser(req, id){
  /* req.sessions.regenerate(function(){
  }) // I'm not sure that we want or need this */

  req.session.valid = 1;
  req.session.userId = id; 
}

function logout(req){
  req.session.destroy();
}

function isLoggedIn(req){
  if (req.session.valid)
    return true;
  return false;
}

function createSalt(){
  var string = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 3; i++ )
      string += possible.charAt(Math.floor(Math.random() * possible.length));

  return Crypto.SHA256(string);
}
