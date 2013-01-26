var mongoose = require("mongoose");

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Blocks   = new Schema({
      A: String,
      B: String,
      C: String,
      D: String,
      E: String,
      F: String,
      G: String,
      H: String,
      Saturday: {type: String, default: "Saturday"},
      Sunday: {type:String, default: "Sunday"},
      Activities: {type:String, default: "Activities"}
    }),
    Emails = new Schema({
      nightly: {type: Boolean, default: false},
      weekly: {type: Boolean, default: false},
      important: {type: Boolean, default: true}
    });

exports.User = new Schema({
  email     : {type: String, validate: [validateEmail, 'an email is required'], index: { unique: true }},
  password  : {type: String, validate: [validatePresenceOf, 'a password is required']},
  googleId  : {type: String},
  name: {type: String, validate: [validatePresenceOf, 'a name is required']},
  salt: {type: String},
  is_teacher: Boolean,
  classes: [String],
  user_id   : ObjectId,
  blocks: [Blocks],
  admin: {type: Boolean, default: false},
  grade: {type: Number, default: 7},
  emailSettings: [Emails],
  valid: {type: Boolean, default: false},
  token: String
});

exports.Event = new Schema({
  type: String,
  bootClass: String,
  name: String,
  timestamp: Number,
  day: Number, // number from 0 - 6 indicating day of week (Monday is 0)
  block: String,
  description: String,
  owner: ObjectId,
  event_id: ObjectId,
  done: {type: Boolean, default: false},
  admin: {type: Boolean, default: false} // right now the only way to become an admin is to set it manually in the database
});

exports.Class = new Schema({
  name: {type: String, index: { unique: true }},
  teacher: String,
  block: String,
  events: [String],
  students: [String], //todo: how to make each student unique?
  class_id: ObjectId
});

exports.Holiday = new Schema({
  name: {type: String},
  noSchool: {type: Boolean, default: true},
  timestamp: Number,
  day: Number
});

exports.Event.pre("save", function(next){
  this.name = escapeHtml(this.name);
  this.description = escapeHtml(this.description);
  next();
});

// Setup Database models
User   = mongoose.model("User", exports.User);
Event  = mongoose.model("Event", exports.Event);
Class  = mongoose.model("Class", exports.Class);
Blocks = mongoose.model("Blocks", Blocks);
Holiday = mongoose.model("Holiday", exports.Holiday);

function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/(\r\n|[\r\n])/g, "<br />")
      .replace(/'/g, "&#039;");
}
function validatePresenceOf(value){
  return value && value.length;
}

function validateEmail(value){
  var emailRegex = new RegExp(/[a-zA-Z0-9._-]+@(students.)?hopkins\.edu$/);
  return emailRegex.test(value);
}

