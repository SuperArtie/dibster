'use strict';

var bcrypt = require('bcrypt'),
    _      = require('lodash'),
    Mongo  = require('mongodb');

function User(){
  //constructor for users should be blank since we'll be using
  //the "edit profile" feature to add properties to their objects
  //via the the '#save' method
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(User.prototype, obj));
  });
};

User.all = function(cb){
  User.collection.find().toArray(cb);
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(o, cb);
  });
};

User.prototype.save = function(o, cb){
  var properties = Object.keys(o),
      self       = this;
  properties.forEach(function(property){
        self[property] = o[property];
    });
  User.collection.save(this, cb);
};

User.authenticate = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(user);
  });
};

module.exports = User;

