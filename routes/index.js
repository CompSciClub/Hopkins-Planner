// for now all routes go in here. We will probbably break them up at some point

var Crypto     = require("ezcrypto").Crypto;
var fs         = require("fs");
var nodemailer = require("nodemailer");
var jade       = require("jade");

/*
 * GET home page.
 */

exports.index = function(req, res){
  if (!req.session.valid){
    res.render("index", {title: "Hopkins Planner", loggedIn: false,
                       flash: req.flash()});
  }else{
    console.log("user", req.session.userId);
    loadWeekly(req, res);
  }
};


/*
 * GET monthly calendar page.
 */

exports.monthly = function(req, res){
  res.render("calendar", {title: "Monthly Planner", loggedIn: req.session.valid});
};

/*
 * GET /weekly
 */

exports.weekly = function(req, res){
  if (!req.session.valid){
    req.flash("error", "You have to log in to do that.");
    res.render("login", {title: "Login", loggedIn: false, flash: req.flash()});
    return;
  }
  loadWeekly(req, res);
}

function loadWeekly(req, res){
  var offset = parseInt(req.params.offset || 0);
  var date   = new Date(new Date().getTime() + (offset * 604800000)); // get the current date
  date = new Date(date.getTime() - ((date.getDay() + 6) % 7) * 24 * 60 * 60 * 1000); // convert to monday

  // set it to to the beginning of monday EST
  date.setUTCHours(5); 
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  // get every event for the current user in this week
  User.find({_id: req.session.userId}, function(err, users) {
    if (err || users.length == 0){
      console.log("no user");
      console.log("Error finding user");
      req.session.valid = false;
      res.render("500", {title: "500", loggedIn: true, flash: req.flash(), name: req.session.displayName});
      return;
    }
    var user = users[0];
    var eventOwners = [req.session.userId];
    for(var i = 0; i < user.classes.length; i++) {
      eventOwners.push(user.classes[i].toString());
    }
    
    Event.find({owner: {$in: eventOwners}, timestamp: {$gte: date.getTime(), $lte: date.getTime() + 604800000}}, function(err, events){
      var eventsObj = {};
      for (var i = 0; i < events.length; i++){
        if (!eventsObj[events[i].day])
          eventsObj[events[i].day] = {};

        if (!eventsObj[events[i].day][events[i].block])
          eventsObj[events[i].day][events[i].block] =[];

        eventsObj[events[i].day][events[i].block].push(events[i]); // insert this event into the correct place in the event object
      }
      var blocks = user.blocks[0];
      //blocks.lunch    = "Lunch";
      blocks.Saturday   = "Saturday";
      blocks.Activities = "Activities";
      blocks.Sunday     = "Sunday";
      console.log(blocks.Saturday);

      getWeekStructure(date, function(week){
        res.render("week", {title: "Hopkins Week", date: date, loggedIn: true, flash: req.flash(),
                            week: week, events: eventsObj, name: req.session.displayName, escapeHtml: escapeHtml, blocks: blocks, offset: offset, addDay: addDay});
      });
    });
  });
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
  var token    = Crypto.SHA256(Math.random());
  var user  = new User({
    email: req.body.email,
    password: password,
    salt: salt,
    name: req.body.name,
    is_teacher: (req.body.is_teacher == "on") ? true : false,
    classes: [],
    blocks: [{}],
    emailSettings: [{}],
    valid: false,
    token: token
  });

  user.save(function(err){
    if (err){
      if (err.type == undefined){ // this is a bad way to check for this
        req.flash("error", "That email is already being used");
        req.flash("errorContainer", "#accountModal");
        req.flash("errorEmail", "error");
        res.redirect("back");
        return;
      }
      if (err.errors.email){
        req.flash("error", "Please try again with a valid email address");
        req.flash("errorContainer", "#accountModal");
        req.flash("errorEmail", "error");
      }else if (err.errors.password){
        req.flash("error", "Password can not be empty");
        req.flash("errorContainer", "#accountModal");
        req.flash("errorPass", "error");
      }
      res.redirect("back");
    }else{
      req.session.valid       = true;
      req.session.userId      = user._id;
      req.session.displayName = user.name;
      res.redirect(req.body.redirect || "/setup");
      console.log(req.body.email);
      sendEmail("verficiation@hopkinsplanner.com", req.body.email, "Email Verification", "views/emails/verify.jade", {url: URL, token: token});
    }
  })
};

exports.verify = function(req, res){
  var token = req.params.token;
}

/*
 * POST /setup
 */
exports.setPreferences = function(req, res){
  if (!req.session.valid){
    req.flash("error", "You have to login first.");
    res.redirect("/login");
    return;
  }

  var blocks = {
    A: req.body.aBlock,
    B: req.body.bBlock,
    C: req.body.cBlock,
    D: req.body.dBlock,
    E: req.body.eBlock,
    F: req.body.fBlock,
    G: req.body.gBlock,
    H: req.body.hBlock
  };

  User.find({_id: req.session.userId}, function(err, users){
    var user = users[0];
    if (err || !user){
      console.log("Error finding user");
      res.render("500", {title: "500", loggedIn: true, name: req.session.displayName});
    }
    user.blocks = blocks;
    user.grade  = req.body.grade;
    user.name   = req.body.name;
    user.emailSettings = {
      nightly: typeof req.body.nightly !== 'undefined' && req.body.nightly == "on",
      weekly: typeof req.body.weekly !== 'undefined' && req.body.weekly == "on",
      important: typeof req.body.important !== 'undefined' && req.body.important == "on"
    };
    console.log(user.emailSettings);
    user.save();
    req.session.displayName = req.body.name;
    res.redirect(req.body.redirect || "/weekly");
  });
};

/*
 * GET /setup
 */
exports.setup = function(req, res){
  if (!req.session.valid){
    req.flash("error", "You have to be logged in to do that.");
    res.redirect("/login");
    return;
  }

  User.find({_id: req.session.userId}, function(err, users){
    var user = users[0];
    if (err || users.length == 0 ){
      console.log("no user");
      console.log("Error finding user");
      req.session.valid = false;
      res.render("500", {title: "500", loggedIn: true, flash: req.flash(), name: req.session.displayName});
      return;
    }
    var emailSettings = user.emailSettings[0] || {};
    res.render("setup", {title: "Setup", loggedIn: true, flash: req.flash(), name: req.session.displayName, grade: user.grade,
                         nightly: emailSettings.nightly, weekly: emailSettings.weekly, important: emailSettings.important,
                         blocks: user.blocks[0]});
  });
};

/*
 * GET /login
 */
exports.loginPage = function(req, res){
  if (req.session.valid){
    res.redirect("back");
    return;
  }
  res.render("login", {title: "Login", name: req.session.displayName, loggedIn: req.session.valid, flash: req.flash()});
}

/* 
 * POST /login
 */
exports.login = function(req, res){
  email = req.body.email;
  console.log(email);
  User.find({email: email}, function(err, users){
    user = users[0];

    if (users.length == 0){
      console.log("wrong email");
      req.flash("error", "Invalid email");
      req.flash("email", req.body.email);
      req.flash("emailError", "error");
      res.redirect("/login");
      return;
    }

    if (Crypto.SHA256(req.body.password + user.salt) == user.password){
      validateUser(req, user._id);
      req.session.displayName = user.name;
      console.log("logged in");
      res.redirect(req.body.redirect || "/weekly");
    }else{
      console.log("wrong password");
      req.flash("error", "Invalid password");
      req.flash("passError", "error");
      req.flash("email", req.body.email);
      res.redirect("/login");
    }
  });
}

/*
 * GET /logout
 */
 exports.logout = function(req, res){
   logout(req);
   res.redirect(req.body.redirect || "/");
 }
 
/*
 * Classes
 */

/*
 * POST /createClass
 */
exports.createClass = function(req, res) {
  User.find({email: req.body.teacher}, function(err, users) {
    if(users.length == 0) {
      req.flash("error", "Invalid teacher email");
      req.flash("emailError", "error");
      res.redirect("back");
      return;
    }
    
    var teacher = users[0];
    if(!teacher.is_teacher) {
      req.flash("error", "Email is not a teacher's email");
      req.flash("emailError", "error");
      res.redirect("back");
      return;
    }
    
    //todo: add authentication
    
    var _class = new Class({
      name: req.body.name,
      teacher: teacher._id.toString(),
      block: req.body.block,
      events: [],
      students: []
    });
    
    _class.save(function(err) {
      if(err != null)
        console.log(err);
    });
    
    teacher.classes.push(_class._id);
    teacher.save();
    
    res.redirect("back");
  });
}

exports.addStudent = function(req, res) {
  Class.find({name: req.body.name}, function(err, classes) {
    console.log(classes);
    if(classes.length == 0) {
      req.flash("error", "Could not find class");
      res.redirect("back");
      return;
    }
    
    var _class = classes[0];
    User.find({email: req.body.email}, function(err, users) {
      if(users.length == 0) {
        req.flash("error", "could not find user");
        res.redirect("back");
        return;
      }
      
      var student = users[0];
      _class.students.push(student._id.toString());
      _class.save();
      student.classes.push(_class._id.toString());
      student.save();
      res.redirect("back");
    });
  });
}

 /*
  * Event Requests
  */

 /*
  * POST /event
  */
exports.createEvent = function(req, res){
  if (!isLoggedIn(req, res))
    return;
  
  var addEvent = function(type, owner) {
    var newEvent = new Event({
      type: type,
      name: escapeHtml(req.body.name),
      timestamp: req.body.timestamp,
      day: req.body.day,
      block: req.body.block,
      description: escapeHtml(req.body.description),
      class: req.body.bootClass,
      owner: owner
    });
    newEvent.save(function(error){
      res.writeHead(200, {"Content-Type": "application/json"});
      if (!error){
        res.end(JSON.stringify({error: 0, msg: "Event added"}));
      }else{
        res.end(JSON.stringify({error: 101, msg: error}));
      }
    });
    
    return newEvent;
  }
  
  if(req.body.class_name) {
    Class.find({name: req.body.class_name}, function(err, classes) {
      if(classes.length == 0) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: 101, msg: "Could not find class"}));
        return;
      }
      
      var _class = classes[0];
      var id = addEvent("class", _class._id)._id;
      _class.events.push(id.toString());
      _class.save();
    });
  } else {
    addEvent("individual", req.session.userId);
  }
}

exports.deleteEvent = function(req, res){
  if (!isLoggedIn(req, res))
    return;

  Event.remove({owner: req.session.userId, _id: req.params.eventId}, function(err, e){
    if (e == null || err){
      res.writeHead(400, {"Content-Type": "application/json"});
      res.end(JSON.stringify({error: 400, msg: err}));
      return;
    }

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({error: 0, msg: "Event deleted succesfully"}));
  });
};

exports.modifyEvent = function(req, res){
  console.log("modify event", req.body);
  if (!isLoggedIn(req, res))
    return;

  Event.findOne({owner: req.session.userId, _id: req.params.eventId}, function(err, e){
    if (e == null || err){
      res.writeHead(400, {"Content-Type": "application/json"});
      res.end(JSON.stringify({error: 400, msg: err}));
      return;
    }

    e.name        = req.body.name          || e.name;
    e.timestamp   = req.body.timestamp     || e.timestamp;
    e.day         = req.body.day           || e.day;
    e.block       = req.body.block         || e.block;
    e.description = req.body.description   || e.description;
    e.class       = req.body.bootClass     || e.class;
    if (req.body.done != undefined){
      e.done = (req.body.done === "true"); // different for this one because it's a boolean
    }
    e.save(function(error){
      console.log(error);
      if (!error){
        res.end(JSON.stringify({error: 0, msg: "Event modified"}));
      }else{
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: 400, msg: error}));
      }
    });
  });
}

// Administrative tasks

exports.createHoliday = function(req, res){
  if (!isLoggedIn(req, res))
    return;

  User.find({_id: req.session.userId}, function(err, user){
    var user = user[0];
    if (user == null || user == undefined || !user.admin || err){
      res.writeHead(401, {"Content-Type": "application/json"});
      res.end(JSON.stringify({error: 401, msg: "You are not authorized to do that " + JSON.stringify(err)}));
      return;
    }

    var holiday = new Holiday({
      name: req.body.name || "",
      noSchool: req.body.noSchool,
      timestamp: req.body.timestamp,
      day: req.body.day
    });

    holiday.save(function(error){
      if (!error){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: 0, msg: "Holiday"}));
      }else{
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: 500, msg: "Unable to add Holiday. Db returned: " + JSON.stringify(error)}));
      }
    });
  });
};

exports.createHoliday_page = function(req, res){
  if (!isLoggedIn(req, res)){
    return;
  }

  User.find({_id: req.session.userId}, function(err, user){
    var user = user[0];
    if (user == null || user == undefined || !user.admin || err){
      res.render("401", {loggedIn: true, name: user.name, title: "Unauthorized"});
      return;
    }

    res.render("addHoliday", {loggedIn: true, name: user.name, title: "Add Holiday"});
  });
};

exports.noPage = function(req, res){
  res.render("404", {title: "Page not Found", loggedIn: req.session.valid, name: req.session.displayName});
};

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

function isLoggedIn(req, res){
  if (!req.session.valid){
    req.flash("error", "You must login first");
    res.redirect("/login");
    return false;
  }
  return true;
}

function createSalt(){
  var string = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 3; i++ ){
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Crypto.SHA256(string);
}

function getWeekStructure(date, callback){
  var maroonWeek = [
    ["A", "B", "A", "A", "B", "Saturday", "Sunday"],
    ["C", "C", "B", "C", "A",],
    ["D", "D", "E", "D", "C"],
    ["E", "F", "F", "E", "F"],
    ["F", "G", "Activities", "G", "G"],
    ["G", "H", "H", "H"]
  ];
	var grayWeek = [
    ['A', 'B', 'A', 'B', 'B', "Saturday", "Sunday"],
    ["C", "C", "B", "C", "A"],
    ["D", "D", "E", "D", "D"],
    ["E", "E", "F", "E", "F"],
    ["F", "G", "Activities", "G", "G"],
    ["H", "H", "H", "H"]
  ];
  var week = (getWeek(date) == "maroon") ? maroonWeek.slice(0) : grayWeek;
  Holiday.find({timestamp: {$gte: date.getTime(), $lte: date.getTime() + 604800000}}, function(err, holidays){
    if (err){
      console.log("error getting holidays", err)
      callback(week);
    }
    for (holiday in holidays){
      if (holidays[holiday].noSchool){
        var day = holidays[holiday].day;
        week[0][day] = "No School";
        for (var i = 1; i < week.length - 1; i++){
          week[i].splice(day, 1);
        }
        if (day != 2)
          week[i].splice(day - 1, 1); // correct for having one less period on Wednesday
      }else{
        // TODO other types of holidays (half days, block changes, etc...)
      }
    }
    console.log(week);
    callback(week);
  });
}

function getWeek(date){
  return (Math.round(((date.getTime() - 132549840000) / 604800000)) % 2) ? "gray" : "maroon";
}

function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/(\r\n|[\r\n])/g, "<br />")
      .replace(/'/g, "&#039;");
}

function addDay(date){
  date.setTime(date.getTime() + 86400000);
  return date;
}
function sendEmail(sendaddress, emailaddress, subject, directory, vars) {
	var data = fs.readFile(directory, function(err, data){
    if (err){
      console.log("error", err);
      return;
    }
		var jadeTemplate = jade.compile(data.toString("utf8"));
    var html = jadeTemplate(vars);
    nodemailer.SMTP = {
      host: "smtp.mailgun.org",
      port: 587,
      ssl: false,
      use_authentication: true,
      user: process.env.MAILGUN_SMTP_LOGIN,
      pass: process.env.MAILGUN_SMTP_PASSWORD,
    };
    console.log(nodemailer.SMTP);
    nodemailer.send_mail(
      {
        sender: sendaddress,
        to: emailaddress,
        subject: subject,
        html: html
      }, function(error, success){
        if (!success)
          console.log("Error sending message", error);
        else
          console.log("Message sent");
      });
   });
}
