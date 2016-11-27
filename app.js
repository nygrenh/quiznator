require('app-module-path').addPath(__dirname);

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs  = require('express-handlebars');

mongoose.Promise = require('bluebird').Promise;

var server = require('./server');

var app = express();

app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use(server);

module.exports = app;
