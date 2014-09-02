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
  app.get('/profile/edit', users.edit);
  app.put('/profile', users.editProfile);
  app.get('/dashboard', users.dashboard);
  app.get('/users/:username', users.client);

  // Messages
  app.post('/message/:userId', users.send);
  app.get('/message/:msgId', users.readMessage);
  app.get('/messages', users.displayMessages);

  // Items
  app.get('/items/:itemId', items.show);
  app.delete('/items/:itemId', items.delete);
  app.get('/items/new', items.new);
  app.post('/items', items.save);
  app.get('/browse', items.browse);
  app.post('/items/bid', items.bid);
  app.post('/accept/:bidId', items.accept);
  console.log('Express: Routes Loaded');
};

