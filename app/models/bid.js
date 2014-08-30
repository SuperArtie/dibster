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

Bid.countBids = function(itemId, cb){
  Bid.collection.count({itemUpForBidId:itemId, isOpen:true}, cb);
};

Bid.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Bid.collection.findOne({_id:_id}, cb);
};

module.exports = Bid;
