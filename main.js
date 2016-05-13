var express = require('express');
var passport = require('passport');
var session = require('express-session');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret : 'AuFaitjesuisVRAIMENTunCHAT!'}));
app.use(passport.initialize());
app.use(passport.session());

require('./app/route.js')(app,passport);

app.listen(8080);
console.log('Black magic begins...');
