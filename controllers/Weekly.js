/*global User Event*/ // TODO refactor schemas
(function(){
  "use strict";

  var base = require("./base.js"),
      Week = require("../app/Week.js"),
      _    = require("underscore");

  var WeeklyCtrl, _ptype,
      addDay, escapeHtml;

  var ViewClass = require("../views/Weekly.js");

  WeeklyCtrl = function(offset, uid){
    this.offset = offset;
    this.uid    = uid;

    this.payload = {
      title: "Your Week",
      loggedIn: true // hold over until auth is better
    };

    this._view = new ViewClass();
  };

  _ptype = WeeklyCtrl.prototype = base.getProto("std");
  _ptype._name = "Weekly";

  _ptype.prePrep = function(data, cb){
    var self = this, date, blocks;
    console.log("preprep");
    date   = new Date(new Date().getTime() + (this.offset * 604800000)); // get the current date
    date   = Week.getMonday(date);

    // get every event for the current user in this week
    User.find({_id: self.uid}, function(err, users) {
      if (err || _.isNull(users) || _.isUndefined(users) || users.length === 0){
        console.log("no user");
        console.log("Error finding user");
        return cb(true);
      }
      var user = users[0];
      var eventOwners = [self.uid];
      for(var i = 0; i < user.classes.length; i++) {
        eventOwners.push(user.classes[i].toString());
      }
      console.log("getting events");
      
      Event.find({owner: {$in: eventOwners}, timestamp: {$gte: date.getTime(), $lt: date.getTime() + 604800000}}, function(err, events){
        if (err){
          return cb(err);
        }

        var eventsObj = {};
        console.log("checking for events");
        if (!(_.isNull(events) || _.isUndefined(events) || events.length === 0)){
          console.log("got events");
          // got events
          for (var i = 0; i < events.length; i++){
            if (!eventsObj[events[i].day]){
              eventsObj[events[i].day] = {};
            }

            if (!eventsObj[events[i].day][events[i].block]){
              eventsObj[events[i].day][events[i].block] =[];
            }

            eventsObj[events[i].day][events[i].block].push(events[i]); // insert this event into the correct place in the event object
          }
        }
        blocks = user.blocks[0];
        //blocks.lunch    = "Lunch";
        blocks.Saturday   = "Saturday";
        blocks.Activities = "Activities";
        blocks.Sunday     = "Sunday";
        console.log(blocks.Saturday);
      
        Week.getWeekStructure(date, function(week){
          var params = {
            week: week,
            events: eventsObj,
            blocks: blocks,
            date: date,
            //ugh
            escapeHtml: escapeHtml,
            addDay: addDay
          };

          data = _.extend(data, params);
          cb();
        });
      });
    });
  };

  // TODO: not use these
  escapeHtml = function(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/(\r\n|[\r\n])/g, "<br />")
        .replace(/'/g, "&#039;");
  };
  addDay = function(date){
    date.setTime(date.getTime() + 86400000);
    return date;
  };

  module.exports = WeeklyCtrl;
}());
