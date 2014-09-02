'use strict';

var Mongo  = require('mongodb'),
    async  = require('async');

function Bid(o){
  this.sItem  = Mongo.ObjectID(o.sItem);
  this.seller = Mongo.ObjectID(o.seller);
  this.bidder = Mongo.ObjectID(o.bidder);
  this.bItem  = Mongo.ObjectID(o.bItem);
  this.date   = new Date();
}

Object.defineProperty(Bid, 'collection', {
  get: function(){return global.mongodb.collection('bids');}
});

Bid.create = function(o, cb){
  var b = new Bid(o);
  Bid.collection.save(b, cb);
};

Bid.countBids = function(itemId, cb){
  Bid.collection.count({itemForBidId:itemId, isOpen:true}, cb);
};
// find the "dibs" for the dashboard
Bid.findDibs = function(id, cb){
  console.log(id);
  var _id = Mongo.ObjectID(id);
  console.log(_id);
  Bid.collection.find({bidder:_id}).toArray(function(err, dibs){
    async.map(dibs, iterator, cb);
  });
};
// find the "bids" for the dashboard
Bid.findBids = function(id, cb){
  console.log(id);
  var _id = Mongo.ObjectID(id);
  console.log(_id);
  Bid.collection.find({seller:_id}).toArray(function(err, bids){
    async.map(bids, iterator2, cb);
  });
};

Bid.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Bid.collection.findOne({_id:_id}, cb);
};

Bid.destroy = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Bid.collection.findAndRemove({_id:_id}, cb);
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

Bid.accept = function(bid, cb){
  require('./item').collection.findAndModify({_id:bid.bItem}, {}, {$set: {ownerId:bid.seller, isAvailable:true}}, function(err1, sItem){
    require('./item').collection.findAndModify({_id:bid.sItem}, {}, {$set: {ownerId:bid.bidder}}, function(err2, bItem){
      Bid.collection.findAndRemove({_id:bid._id}, cb);
    });
  });
};
module.exports = Bid;

function iterator(dib, cb){
  require('./item').findById(dib.sItem, function(err, sItem){
    dib.photo = sItem.photo;
    dib.name  = sItem.name;
    require('./user').findById(dib.seller, function(err, seller){
      dib.sellerName = seller.username;
      require('./item').findById(dib.bItem, function(err, bItem){
        dib.bName = bItem.name;
        cb(null, dib);
      });
    });
  });
}

function iterator2(bid, cb){
  require('./item').findById(bid.sItem, function(err, sItem){
    bid.photo = sItem.photo;
    bid.name  = sItem.name;
    require('./user').findById(bid.bidder, function(err, bidder){
      bid.bidderName = bidder.username;
      require('./item').findById(bid.bItem, function(err, bItem){
        bid.bName = bItem.name;
        cb(null, bid);
      });
    });
  });
}
// PRIVATE HELPER FUNCTION //
function attachItem(bid, cb){
  require('./item').findById(bid.itemOfferedId.toString(), function(err, item){
    bid.item = item;
    cb(null, bid);
  });
}
