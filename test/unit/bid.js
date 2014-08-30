/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Bid       = require('../../app/models/bid'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'dibster-test';

describe('Bid', function(){
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
    it('should create a new Bid object', function(){
      var o = {userToId:'123456789012345678901234', userFromId:'123456789012345678901233', itemToId:'123456789012345678901222', itemFromId:'123456789012345678901111'},
          b = new Bid(o);
      expect(b).to.be.instanceof(Bid);
      expect(b.userToId).to.be.instanceof(Mongo.ObjectID);
      expect(b.userFromId).to.be.instanceof(Mongo.ObjectID);
      expect(b.itemToId).to.be.instanceof(Mongo.ObjectID);
      expect(b.itemFromId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('.create', function(){
    it('should create a new bid', function(done){
      var o = {userToId:'123456789012345678901234', userFromId:'123456789012345678901233', itemToId:'123456789012345678901222', itemFromId:'123456789012345678901111'};
      Bid.create(o, function(err, bid){
        expect(bid._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.query', function(){
    it('should query for bids - from user', function(done){
      Bid.query({userFromId:'100000000000000000000001'}, function(err, bid){
        expect(this.userFromId).to.equal('100000000000000000000001');
        done();
      });
    });

    it('should query for bids - to user', function(done){
      Bid.query({userToId:'200000000000000000000002'}, function(err, bid){
        expect(this.userToId).to.equal('200000000000000000000002');
        done();
      });
    });
  });
});


