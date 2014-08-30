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
      var o = {userToId:'123456789012345678901234', userFromId:'123456789012345678901233', itemToId:'123456789012345678901222', itemFromId:'123456789012345678901111', isActive:true},
          b = new Bid(o);
      expect(b).to.be.instanceof(Bid);
      expect(b.userToId).to.be.instanceof(Mongo.ObjectID);
      expect(b.userFromId).to.be.instanceof(Mongo.ObjectID);
      expect(b.itemToId).to.be.instanceof(Mongo.ObjectID);
      expect(b.itemFromId).to.be.instanceof(Mongo.ObjectID);
      expect(b.isActive).to.be.true;
    });
  });

  describe('countItemBids', function(){
    it('should count all available bids', function(done){
      expect(bids).to.
    });
  });
});


