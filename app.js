var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user/userRoutes');
var authRoutes = require('./routes/auth/authRoutes')
var accountRoutes = require('./routes/account/accountRoutes');
var transactionRoutes = require('./routes/transaction/transactionRoutes');
var adminRoutes = require('./routes/admin/adminRoutes');
const employerRoutes = require('./routes/employer/employerRoutes');

const db = require("./config/db");
db();

require('./config/passportConfig');

const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "1234567"
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/transaction', transactionRoutes);
app.use('/admin', adminRoutes);
app.use('/employer', employerRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
