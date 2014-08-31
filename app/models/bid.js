'use strict';

var Mongo  = require('mongodb'),
    async  = require('async');

function Bid(){
}

Object.defineProperty(Bid, 'collection', {
  get: function(){return global.mongodb.collection('bids');}
});

Bid.countBids = function(itemId, cb){
  Bid.collection.count({itemForBidId:itemId, isOpen:true}, cb);
};

Bid.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Bid.collection.findOne({_id:_id}, cb);
};

Bid.getBids = function(itemForBidId, cb){
  Bid.collection.find({itemForBidId:itemForBidId, isOpen:true}).toArray(function(err, bids){
    if(bids.length){
      async.map(bids, attachItem, cb);
    }else{
      cb(err, bids);
    }
  });
};

module.exports = Bid;

// PRIVATE HELPER FUNCTION //
function attachItem(bid, cb){
  require('./item').findById(bid.itemOfferedId.toString(), function(err, item){
    bid.item = item;
    cb(null, bid);
  });
}
