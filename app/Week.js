/*global Holiday*/
// file to hold week functions
(function(){
  "use strict";

  // functions
  var getWeek;

  exports.getWeekStructure = function(date, callback){
    var maroonWeek = [
      ["A", "B", "A", "A", "B", "Saturday", "Sunday"],
      ["C", "C", "B", "C", "A"],
      ["D", "D", "E", "D", "C"],
      ["E", "F", "F", "E", "F"],
      ["F", "G", "Activities", "G", "G"],
      ["G", "H", "After School", "H", "H"]
    ];
    var grayWeek = [
      ['A', 'B', 'A', 'B', 'B', "Saturday", "Sunday"],
      ["C", "C", "B", "C", "A"],
      ["D", "D", "E", "D", "D"],
      ["E", "E", "F", "E", "F"],
      ["F", "G", "Activities", "G", "G"],
      ["H", "H", "After School", "H", "H"]
    ];
    var week = (getWeek(date) === "maroon") ? maroonWeek.slice(0) : grayWeek;
    Holiday.find({timestamp: {$gte: date.getTime(), $lte: date.getTime() + 604800000}}, function(err, holidays){
      if (err){
        console.log("error getting holidays", err);
        callback(week);
      }
      for (var holiday in holidays){
        if (holidays.hasOwnProperty(holiday)){
          if (holidays[holiday].noSchool){
            var day = holidays[holiday].day;
            week[0][day] = "No School";
            for (var i = 1; i < week.length - 1; i++){
              week[i].splice(day, 1);
            }
            if (day !== 2){
              week[i].splice(day - 1, 1); // correct for having one less period on Wednesday
            }
          }else{
            // TODO other types of holidays (half days, block changes, etc...)
          }
        }
      }
      console.log(week);
      callback(week);
    });
  };
  getWeek = function(date){
    return (Math.round(((date.getTime() - 132549840000) / 604800000)) % 2) ? "gray" : "maroon";
  };

  // given a date object, this reutrns the beginning of monday
  exports.getMonday = function(date){
    // we need to use Monday's timestamp because it identifies the week
    date = new Date(date.getTime() - ((date.getDay() + 6) % 7) * 24 * 60 * 60 * 1000); // convert to monday
    // set it to to the beginning of monday EST
    date.setUTCHours(5);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    return date;
  };
}());
