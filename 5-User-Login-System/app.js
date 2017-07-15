const express           = require('express');
const path              = require('path');
const fs                = require('fs');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const expressValidator  = require('express-validator');
const cookieParser      = require('cookie-parser');
const session           = require('express-session');
const passport          = require('passport');
const localStrategy     = require('passport-local').Strategy;
const bodyParser        = require('body-parser');
const multer            = require('multer');
const flash             = require('connect-flash');
const mongo             = require('mongodb');
const mongoose          = require('mongoose');
const db                = mongoose.connection;

const index             = require('./routes/index');
const users             = require('./routes/users');

const app               = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Multer midelware
app.use(multer({dest:__dirname+'/uploads/'}).any());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// sessions medelware
app.use( session({
    saveUninitialized : true,
    secret : 'Some Secret' ,
    resave : true,
}));

// passport medelware
app.use(passport.initialize());
app.use(passport.session());

// Validator medelware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'), root = namespace.shift(), formParam = root;

        while(namespace.length) {
          formParam += '[' + namespace.shift() + ']';
        }
        return {
          param : formParam,
          msg   : msg,
          value : value
        };
    }
}));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect-flash medelware
app.use(flash());

// express-messages medelware
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
