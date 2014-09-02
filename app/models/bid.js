'use strict';

var Mongo   = require('mongodb'),
    async   = require('async'),
    Mailgun = require('mailgun-js');

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
  Bid.collection.save(b, function(){
    require('./user').findById(b.seller, function(err, seller){
      require('./item').findById(b.sItem, function(err, sItem){
        newEmail(seller.email, sItem, cb);
      });
    });
  });
};

// find the "dibs" for the dashboard
Bid.findDibs = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Bid.collection.find({bidder:_id}).toArray(function(err, dibs){
    async.map(dibs, iterator, cb);
  });
};

// find the "bids" for the dashboard
Bid.findBids = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Bid.collection.find({seller:_id}).toArray(function(err, bids){
    async.map(bids, iterator2, cb);
  });
};

Bid.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Bid.collection.findOne({_id:_id}, cb);
};

Bid.destroy = function(bid, cb){
  var _id = Mongo.ObjectID(bid._id);
  Bid.collection.findAndRemove({_id:_id}, cb);
};

Bid.accept = function(bid, cb){
  acceptHelper(bid.bidder, bid.sItem, bid.bItem, function(){
    require('./item').collection.findAndModify({_id:bid.bItem}, {}, {$set: {ownerId:bid.seller, isAvailable:true}}, function(err1, sItem){
      require('./item').collection.findAndModify({_id:bid.sItem}, {}, {$set: {ownerId:bid.bidder, isAvailable:true}}, function(err2, bItem){
        Bid.collection.remove({sItem:bid.sItem}, cb);
      });
    });
  });
};

module.exports = Bid;

// PRIVATE HELPER FUNCTIONS //

function acceptHelper(bidder, sItem, bItem, cb){
  require('./item').collection.update({_id:bItem}, {$set:{isAvailable:true}}, cb);
  require('./user').findById(bidder, function(err, bidder){
    require('./item').findById(sItem, function(err, sItem){
      yayEmail(bidder.email, sItem, function(){
        yayText(bidder.phone, sItem, function(){
        });
      });
    });
  });
}

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

function newEmail(to, sItem, cb){
  var apikey = process.env.MGAPIKEY,
      domain = process.env.MGDOMAIN,
      mailgun = new Mailgun({apiKey: apikey, domain: domain}),
      body = 'Hey hey hey there\'s been some dibs called on your ' + sItem.name + '! come quick!!!!',
      data = {from: 'rob_schneider@dibstr.com', to: to, subject: 'DIBS!!', text: body};

  mailgun.messages().send(data, cb);

}

function yayEmail(to, sItem, cb){
  var apikey = process.env.MGAPIKEY,
      domain = process.env.MGDOMAIN,
      mailgun = new Mailgun({apiKey: apikey, domain: domain}),
      body = 'Remember those dibs you called on ' + sItem.name  + '??? Well it worked, buddy!!! This message was brought to you by your fellow brothers of the knife here at Dibstr!',
      data = {from: 'rob_schneider@dibstr.com', to: to, subject: 'You won!! ' + sItem.name + ' is now yours!!', text: body};

  mailgun.messages().send(data, cb);

}

function yayText(to, sItem, cb){
  if(!to){return cb();}

  var accountSid = process.env.TWSID,
      authToken  = process.env.TWTOK,
      from       = process.env.FROM,
      client     = require('twilio')(accountSid, authToken),
      body       = 'Remember those dibs you called on ' + sItem.name  + '??? Well it worked, buddy!!! This message was brought to you by your fellow brothers of the knife here at Dibstr!';

  client.messages.create({to:to, from:from, body:body}, cb);
}
