'use strict';

var bcrypt  = require('bcrypt'),
    Mongo   = require('mongodb'),
    async   = require('async'),
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

User.prototype.unreadd = function(cb){
  Message.unread(this._id, cb);
};

User.prototype.messages = function(id, cb){
  var _id = Mongo.ObjectID(id);
  require('./message').collection.find({receiverId:_id}).sort({date:-1}).toArray(function(err, msgs){
    async.map(msgs, iterator, cb);
  });
};

User.prototype.send = function(receiver, obj, cb){
  Message.send(this._id, receiver._id, obj.message, cb);
};

module.exports = User;

// PRIVATE HELPER FUNCTIONS //
function iterator(msg, cb){
  var _id = Mongo.ObjectID(msg.senderId);
  User.findById(_id, function(err, sender){
    msg.sender = sender;
    cb(null, msg);
  });
}
