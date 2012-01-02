// for now all routes go in here. We will probbably break them up at some point

var Crypto = require("ezcrypto").Crypto;

/*
 * GET home page.
 */

exports.index = function(req, res){
<<<<<<< HEAD
  if (!req.session.valid){
    res.render("index", {title: "Hopkins Planner", loggedIn: false,
                       flash: req.flash()});
  }else{
    console.log(getWeekStructure("gray"));
    res.render("week", {title: "Hopkins Week", loggedIn: true, flash: req.flash(),
                        week: getWeekStructure("gray")});
  }
};

function getWeekStructure(weekColor){
	var maroonWeek = new Array();
		maroonWeek[0] = new Array('A-','C-','D-','E-','F-','G-');
		maroonWeek[1] = new Array('B-','C-','D-','F-','G-','H-');
		maroonWeek[2] = new Array('A-','B-','E-','F-','activity-','');
		maroonWeek[3] = new Array('A-','C-','D-','E-','G-','H-');
		maroonWeek[4] = new Array('B-','A-','C-','F-','G-','H-');
		maroonWeek[5] = new Array('No School-','','','','','');
		maroonWeek[6] = new Array('No School-','','','','','');
	var grayWeek = [
    ['A-', 'B-', 'A-', 'B-', 'B-', "No School-", "No School-"],
    ["C-", "C-", "B-", "C-", "A-", "", ""],
    ["D-", "D-", "E-", "D-", "D-", "", ""],
    ["E-", "E-", "F-", "E-", "F-", "", ""],
    ["F-", "G-", "activity", "G-", "G-", "", ""],
    ["H-", "H-", "", "H-", "H-", "", ""]
  ];
		
	return (weekColor == "maroon") ? maroonWeek.slice(0) : grayWeek;
}

=======
  res.render("index", {title: "Hopkins Planner", loggedIn: req.session.valid,
                       flash: req.flash()});
};

>>>>>>> 0fd27c1c7ab02d5663c55508a87f33310df336c4
/*
 * GET monthly calendar page.
 */

exports.monthly = function(req, res){
  req.flash("error", "hey");
  req.flash("emailError", "error");
  res.render("calendar", {title: "Monthly Planner", loggedIn: req.session.valid});
};

/*
 * GET /weekly
 */

exports.weekly = function(req, res){
  res.render("week", {title: "Weekly Planner", loggedIn: req.session.valid});
}

/*
 * GET /signup
 */

exports.createAccount = function(req, res){
  res.render("createAccount", {title: "Login", loggedIn: req.session.valid, 
                               flash: req.flash()});
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
    salt: salt,
    name: req.body.name
  });
  user.save(function(err){
    if (err){
      if (err.type == undefined){ // this is a bad way to check for this
        req.flash("error", "That email is already being used");
        req.flash("errorEmail", "error");
        res.redirect("back");
        return;
      }
      console.log(err.errors, err);
      if (err.errors.email){
        req.flash("error", "Please try again with a valid email address");
        req.flash("errorEmail", "error");
      }else if (err.errors.password){
        req.flash("error", "Password can not be empty");
        req.flash("errorPass", "error");
      }
      res.redirect("back");
    }else{
      res.redirect(req.body.redirect || "/");
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

    if (users.length == 0){
      req.flash("error", "Invalid email");
      req.flash("emailError", "error");
      res.redirect("back");
      return;
    }

    if (Crypto.SHA256(req.body.password + user.salt) == user.password){
      validateUser(req, user.user_id);
      req.session.displayName = user.name;
      res.redirect(req.body.redirect || "back");
    }else{
      req.flash("error", "Invalid password");
      req.flash("passError", "error");
      res.redirect("back");
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
