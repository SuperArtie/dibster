/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Item      = require('../../app/models/item'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'dibster-test';

describe('Item', function(){
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
    it('should create a new Item object', function(){
      var
          o = {name:'Test', description:'This is a test.', photo:'url', cateogy:'category 1', tags:'tag1, tag2', ownerId:'000000000000000000000001'},
          i    = new Item(o);
      expect(i).to.be.instanceof(Item);
      expect(i.name).to.equal('Test');
      expect(i.description).to.equal('This is a test.');
      expect(i.tags).to.have.length(2);
      expect(i.tags[1]).to.equal('tag2');
      expect(i.photo).to.equal('url');
      expect(i.datePosted).to.be.instanceof(Date);
      expect(i.ownerId).to.be.instanceof(Mongo.ObjectID);
      expect(i.isForSale).to.be.false;
      expect(i.isOffered).to.be.false;
      expect(i.isAvailable).to.be.true;
    });
  });

  describe('.create', function(){
    it('should create a new Item & save it in the database', function(done){
      var testItem = {name:'Test', description:'This is a test.', photo:'url', category:'category 1', tags:'tag1, tag2', ownerId:'000000000000000000000001'};
      Item.create(testItem, function(err, item){
        console.log('--------TEST ITEM-------');
        console.log(testItem);
        expect(item._id).to.be.instanceof(Mongo.ObjectID);
        expect(item).to.be.ok;
        done();
      });
    });
  });

  describe('.query', function(){
    it('should query for Items by ownerId', function(done){
      Item.query({ownerId:'000000000000000000000001'}, function(err, items){
        expect(items).to.have.length(2);
        done();
      });
    });
    /*  TODO: determine why query by ownerId works, but query category does not
    it('should query for Items by category', function(done){
      Item.query({category:'Test'}, function(err, items){
        console.log('--------TEST ITEMS-------');
        console.log(err, items);
        expect(items).to.have.length(2);
        done();
      });
    }); */
  });

  describe('.findById', function(){
    it('should return an Item in the database by it\'s ID', function(done){
      var id = Mongo.ObjectID('a00000000000000000000002');
      Item.findById(id, function(err, item){
        expect(item.name).to.equal('Shrubbery');
        expect(item.description).to.include('Knights');
        done();
      });
    });
  });

  // TODO: write .destroy test

// Last bracket
});
