/*globals Event*/
(function(){
  "use strict";

  var base = require("./base.js");
  var _ = require("underscore");

  var EventCtrl, _ptype;

  EventCtrl = function(uid){
    this.uid = uid;
  };

  _ptype = EventCtrl.prototype = base.getProto("std");
  _ptype._name = "Event";

  _ptype.modifyEvent = function(newEvent, cb){
    var self = this;
    Event.findOne({owner: this.uid, _id: newEvent.id}, function(err, e){
      if (e === null || err){
        cb(true);
      }

      for (var prop in newEvent){
        if (newEvent.hasOwnProperty(prop)){
          if (newEvent[prop] !== null){
            e[prop] = newEvent[prop];
          }
        }
      }

      console.log("saving", e);

      e.save(cb);
    });
  };

  _ptype.deleteEvent = function(eid, cb){
    Event.remove({owner: this.uid, _id: eid}, cb);
  };

  module.exports = EventCtrl;
}());
