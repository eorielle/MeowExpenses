var express = require('express');
var passport = require('passport');
var session = require('express-session');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var flash = require('connect-flash');


// Database setup

// Application setup
var app = express();

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/app"));

app.use(session({
  secret : 'AuFaitjesuisVRAIMENTunCHAT!',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(err, req, res, next) {
    console.log(err);
});

require('./app/routes.js')(app,passport);

app.listen(8080);
console.log('Black magic begins...');
