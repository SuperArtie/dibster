'use strict';

var Item = require('../models/item'),
    Bid  = require('../models/bid'),
    moment = require('moment');

exports.new = function(req, res){
  res.render('items/new');
};

exports.save = function(req, res){
  Item.create(res.locals.user._id, req.body, function(){
    res.redirect('/items');
  });
};

exports.browse = function(req, res){
  Item.browse({isAvailable:true}, function(err, items){
    console.log(items);
    res.render('items/browse', {items:items, moment:moment});
  });
};

exports.show = function(req, res){
  Item.findById(req.params.itemId, function(err, item){
    Item.findAllByOwner(res.locals.user._id, function(err, items){
      res.render('items/showItem', {item:item, items:items});
    });
  });
};

exports.delete = function(req, res){
  Item.deleteById(req.params.itemId, function(){
    res.redirect('/dashboard');
  });
};

// BIDS

exports.bid = function(req, res){
  Bid.create(req.body, function(){
    Item.findById(req.body.bItem, function(err, item){
      item.isAvailable=false;
      Item.collection.save(item, function(){
        res.redirect('/dashboard');
      });
    });
  });
};

exports.accept = function(req, res){
  Bid.findById(req.params.bidId, function(err, bid){
    Bid.accept(bid, function(){
      res.redirect('/dashboard');
    });
  });
};
