/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'dibster-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=melanie@frymanet.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /register', function(){
    it('should show the register page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('get /profile/edit', function(){
    it('should show the edit profile page', function(done){
      request(app)
      .get('/profile/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('melanie@frymanet.com');
        expect(res.text).to.include('Email');
        expect(res.text).to.include('Phone');
        done();
      });
    });
  });

  describe('put /dashboard', function(){
    it('should edit the profile', function(done){
      request(app)
      .post('/dashboard')
      .send('_method=put&email=melanie%40frymanet.com&phone=123456789&photo=photourl')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/dashboard');
        done();
      });
    });
  });

  describe('get /dashboard', function(){
    it('should show the dashboard', function(done){
      request(app)
      .get('/dashboard')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('get /users/mlfryman', function(){
    it('should show a specific user', function(done){
      request(app)
      .get('/users/mlfryman')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('mlfryman');
        done();
      });
    });
  });

  describe('post /message/3', function(){
    it('should send a user a message', function(done){
      request(app)
      .post('/message/000000000000000000000001')
      .set('cookie', cookie)
      .send('mtype=text&message=hey')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/mlfryman');
        done();
      });
    });
  });
// Last bracket
});

