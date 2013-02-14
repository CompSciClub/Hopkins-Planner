/*globals Event Class*/
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
            console.log("saving", prop);
            e[prop] = newEvent[prop];
          }
        }
      }

      console.log("saving", e.color);

      e.save(cb);
    });
  };

  _ptype.createEvent = function(e, type,  cb){
    var self = this;
    var newEvent = new Event({
      type: type,
      name: e.name,
      timestamp: e.timestamp,
      day: e.day,
      block: e.block,
      description: e.description,
      bootClass: e.bootClass,
      owner: e.owner || self.uid,
      color: e.color
    });
    newEvent.save(cb);
  };

  _ptype.createClassEvent = function(e, class_name, cb){
    var self = this;
    Class.find({name: class_name}, function(err, classes) {
      if(classes.length === 0) {
        cb(true);
      }
      
      var _class = classes[0];
      e.owner = _class._id;
      self.creatEvent(e, "class", function(err, event){
        _class.events.push(event._id.toString());
        _class.save(cb);
       });
    });
  };

  _ptype.deleteEvent = function(eid, cb){
    Event.remove({owner: this.uid, _id: eid}, cb);
  };


  module.exports = EventCtrl;
}());
