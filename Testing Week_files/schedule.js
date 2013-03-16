var scheduleUtils = {}; // this will hold all the global schedule stuff
(function(){
  "use strict";

  scheduleUtils.getWeek = function(date){
    return (Math.round(((date.getTime() - 132549840000) / 604800000)) % 2) ? scheduleUtils.grayWeek : scheduleUtils.maroonWeek;
  };
  scheduleUtils.getMonday = function(date){
    // we need to use Monday's timestamp because it identifies the week
    date = new Date(date.getTime() - ((date.getDay() + 6) % 7) * 24 * 60 * 60 * 1000); // convert to monday
    date.setHours(0, 0, 0, 0);
    // set it to to the beginning of monday EST
    date.setUTCHours(5, 0, 0, 0);

    return date;
  };


  // checks if a given block meets on a given day
  scheduleUtils.checkThisDate = function(block, date){
     var week = scheduleUtils.getWeek(scheduleUtils.getMonday(date));

     var day = (date.getDay() + 6) % 7;
     for (var i = 0; i < week.length; i++){
       if (week[i][day] === block){
         return true;
       }
     }

     return false;
  };

  scheduleUtils.maroonWeek = [
    ["A", "B", "A", "A", "B", "Saturday", "Sunday"],
    ["C", "C", "B", "C", "A"],
    ["D", "D", "E", "D", "C"],
    ["E", "F", "F", "E", "F"],
    ["F", "G", "Activities", "G", "G"],
    ["G", "H", "After School", "H", "H"]
  ];

  scheduleUtils.grayWeek = [
    ['A', 'B', 'A', 'B', 'B', "Saturday", "Sunday"],
    ["C", "C", "B", "C", "A"],
    ["D", "D", "E", "D", "D"],
    ["E", "E", "F", "E", "F"],
    ["F", "G", "Activities", "G", "G"],
    ["H", "H", "After School", "H", "H"]
  ];

}());
