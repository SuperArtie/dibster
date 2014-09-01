'use strict';

var User = require('../models/user'),
    Item = require('../models/item'),
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
    res.render('users/dashboard', {items:items, moment:moment});
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
    res.render('users/client', {client: client});
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
  res.locals.user.messages(function(err, msgs){
    res.render('users/inbox', {msgs:msgs});
  });
};

//Display a single message
exports.readMessage = function(req, res){
  Message.read(req.params.msgId, function(err, msg){
    res.render('users/message', {msg:msg, moment:moment});
  });
};

