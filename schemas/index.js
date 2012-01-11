var mongoose = require("mongoose");

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

exports.User = new Schema({
  email     : {type: String, validate: [validateEmail, 'an email is required'], index: { unique: true }},
  password  : {type: String, validate: [validatePresenceOf, 'a password is required']},
  salt: {type: String},
  name: String,
  user_id   : ObjectId
});

exports.Event = new Schema({
  type: String,
  name: String,
  timestamp: Number,
  day: Number, // number from 0 - 6 indicating day of week (Monday is 0)
  block: String,
  description: String,
  owner: ObjectId,
  event_id: ObjectId
});

// Setup Database models
User  = mongoose.model("User", exports.User);
Event = mongoose.model("Event", exports.Event); 

function validatePresenceOf(value){
  return value && value.length;
}

function validateEmail(value){
  var emailRegex = new RegExp(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
  return emailRegex.test(value);
}

