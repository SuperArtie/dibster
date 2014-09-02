'use strict';

var User = require('../models/user'),
    Item = require('../models/item'),
    Bid  = require('../models/bid'),
    Message = require('../models/message'),
    moment = require('moment');

exports.new = function(req, res){
  res.render('users/new');
};

exports.login = function(req, res){
  res.render('users/login');
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      res.redirect('/');
    }else{
      res.redirect('/register');
    }
  });
};

exports.authenticate = function(req, res){
  User.authenticate(req.body, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      res.redirect('/login');
    }
  });
};

exports.edit = function(req, res){
  res.render('users/edit');
};

exports.dashboard = function(req, res){
  Item.findAllByOwner(res.locals.user._id, function(err, items){
    Bid.findDibs(res.locals.user._id, function(err, dibs){
      Bid.findBids(res.locals.user._id, function(err, bids){
        res.render('users/dashboard', {items:items, dibs:dibs, bids:bids, moment:moment});
      });
    });
  });
};

exports.editProfile = function(req, res){
  res.locals.user.save(req.body, function(){
    console.log('~~~~~~user:' + res.locals.user);
    res.redirect('/dashboard');
  });
};

exports.client = function(req, res){
  User.findOne({username:req.params.username}, function(err, client){
    Item.findAllByOwner(client._id, function(err, items){
      res.render('users/client', {client: client, items:items, moment:moment});
    });
  });
};


//Send Message
exports.send = function(req, res){
  User.findById(req.params.userId, function(err, receiver){
    res.locals.user.send(receiver, req.body, function(){
      res.redirect('/users/' + receiver.username);
    });
  });
};

//Display all messages to given user
exports.displayMessages = function(req, res){
  res.locals.user.messages(res.locals.user._id, function(err, messages){
    res.render('users/inbox', {messages:messages, moment:moment});
  });
};

//Display a single message
exports.readMessage = function(req, res){
  Message.read(req.params.msgId, function(err, message){
    res.render('users/message', {message:message, moment:moment});
  });
};
