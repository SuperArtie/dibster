'use strict';

var bcrypt  = require('bcrypt'),
    Mongo   = require('mongodb'),
    _       = require('lodash'),
    twilio  = require('twilio'),
    Mailgun = require('mailgun-js'),
    Message = require('./message');

function User(){
  //constructor for users should be blank since we'll be using
  //the "edit profile" feature to add properties to their objects
  //via the the '#save' method
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(o, cb);
  });
};

User.authenticate = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(user);
  });
};

User.all = function(cb){
  User.collection.find().toArray(cb);
};

User.find = function(filter, cb){
  User.collection.find(filter).toArray(cb);
};

User.findOne = function(filter, cb){
  User.collection.findOne(filter, cb);
};

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(User.prototype, obj));
  });
};

User.prototype.save = function(o, cb){
  var properties = Object.keys(o),
    self = this;
  properties.forEach(function(property){
    self[property] = o[property];
  });

  delete this.unread;
  User.collection.save(this, cb);
};

// MESSAGES

User.prototype.unread = function(cb){
  Message.unread(this._id, cb);
};

User.prototype.messages = function(cb){
  Message.messages(this._id, cb);
};

User.prototype.send = function(receiver, obj, cb){
/*  switch(obj.mtype){
    case 'text':
      sendText(receiver.phone, obj.message, cb);
      break;
    case 'email':
      sendEmail(this.email, receiver.email, 'Message from Dibster', obj.message, cb);
      break;
    case 'internal':*/
      Message.send(this._id, receiver._id, obj.message, cb);
 // }
};

module.exports = User;

// PRIVATE HELPER FUNCTIONS //
/*
function sendText(to, body, cb){
  if(!to){return cb();}

  var accountSid = process.env.TWSID,
      authToken  = process.env.TWTOK,
      from       = process.env.FROM,
      client     = twilio(accountSid, authToken);

  client.messages.create({to:to, from:from, body:body}, cb);
}

function sendEmail(from, to, subject, message, cb){
  var mailgun = new Mailgun({apiKey:process.env.MGKEY, domain:process.env.MGDOM}),
      data   = {from:from, to:to, subject:subject, text:message};

  mailgun.messages().send(data, cb);
}
*/
