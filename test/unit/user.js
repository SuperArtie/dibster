/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'template-test';

describe('User', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new User object', function(){
      var u = new User();
      expect(u).to.be.instanceof(User);
    });
  });

  describe('.findById', function(){
    it('should find a user by id', function(done){
      User.findById('000000000000000000000001', function(err, user){
        expect(user.email).to.equal('bob@aol.com');
        done();
      });
    });
  });

  describe('.all', function(){
    it('should find all users', function(done){
      User.all(function(err, users){
        expect(users.length).to.equal(2);
        done();
      });
    });
  });

  describe('#save', function(){
    it('should add new things to user object and save', function(done){
      var u = new User(),
        o = {username : 'bob', phone : 6152436771, photo : 'http://38.media.tumblr.com/8ef78f4377b12e0a72959be74c6e039d/tumblr_mrk0y8mMZ51qdgj2no1_500.png', loc : {name:'Nashville, TN USA ', lat:12, lng:7}};
      u.save(o, function(err, user){
        expect(u.phone).to.equal(6152436771);
        console.log(u);
        done();
      });
    });
  });

  describe('#send', function(){
    it('should send a text message to a user', function(done){
      User.findById('000000000000000000000001', function(err, sender){
        User.findById('000000000000000000000002', function(err, receiver){
          sender.send(receiver, {mtype:'text', message:'yo'}, function(err, response){
            expect(response.sid).to.be.ok;
            done();
          });
        });
      });
    });

    it('should send an email message to a user', function(done){
      User.findById('000000000000000000000001', function(err, sender){
        User.findById('000000000000000000000002', function(err, receiver){
          sender.send(receiver, {mtype:'email', message:'yo'}, function(err, response){
            expect(response.id).to.be.ok;
            done();
          });
        });
      });
    });
  });

// Last bracket
});

