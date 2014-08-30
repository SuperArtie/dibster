'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    security       = require('../lib/security'),
    debug          = require('../lib/debug'),
    home           = require('../controllers/home'),
    items          = require('../controllers/items'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));

  app.use(security.authenticate);
  app.use(debug.info);

  // guest users
  app.get('/', home.index);
  app.get('/about', home.about);
  app.get('/faq', home.faq);
  app.get('/register', users.new);
  app.post('/register', users.create);
  app.get('/login', users.login);
  app.post('/login', users.authenticate);

  // authenticated users
  app.use(security.bounce);
  app.delete('/logout', users.logout);
  app.post('/items', items.create);
/*
  app.get('/profile/edit', users.edit); .edit.jade
  app.put('/profile/edit', users.editProfile); // .update
  app.get('/profile', users.profile); // .profile.jade
  app.get('/user/:username', users.viewProfile); // .public.jade
  app.post('/message/:userId', users.message); // .send
  app.get('/message/:msgId', users.readMessage); // .message
  app.get('/messages', users.displayMessages); // .inbox.jade
*/


  console.log('Express: Routes Loaded');
};

