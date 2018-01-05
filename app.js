'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var hbs = require('express-handlebars');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

var routes = require('./routes/index');
var details = require('./routes/detail');
var users = require('./routes/user')
var app = express();

//Connecting to Mongo DB using mongoose
mongoose.connect('mongodb://localhost:27017/Serviceapp');

require('./config/passport');


// view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//  favicon in public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({ secret: 'NodeJSApp', resave: false, saveUninitialized: false })); //Sets the Session Secret is just a temp key. We can change with actual later but for now lets have a temp
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static(path.resolve(__dirname, 'public')));

app.use('/', routes);
app.use('/', details);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
