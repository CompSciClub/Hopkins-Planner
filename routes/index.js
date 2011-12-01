// for now all routes go in here. We will probbably break them up at some point

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

/*
 * GET monthly calendar page.
 */

 module.exports.monthly = function(req, res){
  res.render("calendar", {title: "Monthly Planner"});
 };
