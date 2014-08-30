/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Bid       = require('../../app/models/bid'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
   // Mongo     = require('mongodb'),
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
      var  b = new Bid();
      expect(b).to.be.instanceof(Bid);
    });
  });

/*  describe('countItemBids', function(){
    it('should count all available bids', function(done){
      Bid.countItemBids(itemId, function(err, bid){
        expect(bid.isActive).to.be.true;
        done();
      });
    });
  });*/
});


