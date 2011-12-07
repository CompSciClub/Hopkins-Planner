// for now all routes go in here. We will probbably break them up at some point

var excrypto = require("excrypto");

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
  var password = ezcrypto.sha256(req.body.password + salt); 
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
    user = users[0];
    if (ezcrypto.sha256(req.body.password + user.salt)){
      validateUser(req, user.user_id);
      res.redirect(req.body.redirect || "back");
    }
  });
}

/*
 * GET /logout
 */
 exports.logout = function(req, res){
   logout(req);
   res.redirect(req.body.redirect || "back");
 }

// User releated functions we may want to move these to another file
function validateUser(req, id){
  /* req.sessions.regenerate(function(){
  } // I'm not sure that we want or need this */

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

  return ezcrypto.sha256(string);
}
