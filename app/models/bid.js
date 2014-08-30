'use strict';

var Mongo  = require('mongodb');

function Bid(o){
  this.userToId = Mongo.ObjectID(o.userToId);
  this.userFromId = Mongo.ObjectID(o.userFromId);
  this.itemToId = Mongo.ObjectID(o.itemToId);
  this.itemFromId = Mongo.ObjectID(o.itemFromId);
}

Object.defineProperty(Bid, 'collection', {
  get: function(){return global.mongodb.collection('bids');}
});

Bid.create = function(o, cb){
  var a = new Bid(o);
  Bid.collection.save(a, cb);
};

Bid.query = function(query, cb){
  var property = Object.keys(query)[0];
  query[property] = Mongo.ObjectID(query[property]);
  Bid.collection.find(query).sort({date:1}).toArray(cb);
};
module.exports = Bid;
