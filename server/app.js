'use strict';

require('dotenv').load();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var routes = require('./app/routes/routes');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var compression = require('compression');

const app = express();
app.use(compression({ threshold: 0 }));
mongoose.connect(process.env.MONGO_URI);

if (process.env.NODE_ENV === 'development') {
  app.use(session({
    secret: 'secretClementine',
    resave: false,
    saveUninitialized: true,
  }));
} else {
  // Production Env Production Specific stuff
  // - Use MongoStore instead of MemoryStore for the session
  const MongoStore = require('connect-mongo')(session);
  app.use(session({
    secret: 'secretClementine',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./app/config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static(`${__dirname}/`, { maxAge: 31557600000 }));
app.use('/client/', express.static(`${__dirname}/client/`, { maxAge: 31557600000 }));

routes(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Node.js listening on port ${port}...'`);
});
