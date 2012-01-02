
/*
 * GET monthly calendar page.
 */

 exports.monthly = function(req, res){
   console.log("month");
  res.render("calendar", {title: "Monthly Planner"});
 };
