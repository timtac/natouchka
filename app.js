var express = require("express");
var path = require("path");
// var favicon = require('serve-favicon');
var logger = require("morgan");
var assets = require("connect-assets");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var mongoose = require("mongoose");
var MongoStore = require("connect-mongo")(session);

var index = require("./routes/index");
var users = require("./routes/users");
var admin = require("./routes/admin");
var setUpPassport = require("./auth/setuppassport");

var app = express();

mongoose.connect(process.env.DB_LINK || "mongodb://timtac:telecom22@ds123146.mlab.com:25146/natouchka");
//
//mongodb://timtac:telecom22@cluster0-shard-00-00-wdq6t.mongodb.net:27017,cluster0-shard-00-01-wdq6t.mongodb.net:27017,cluster0-shard-00-02-wdq6t.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin
var port = process.env.PORT || "3000";
app.set("port", port);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

setUpPassport();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(assets({
		helperContext: app.locals,
		paths: ["public"]
}));

app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: { maxAge: 3 * 24 * 60 * 60 }
  }));

app.use(express.static("public"));

app.use(passport.initialize());
app.use(flash());
app.use(passport.session());


app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/admin', admin)
app.use('/users', users);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log(err);
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

app.listen(port, function(){
  console.log("Running");
});
// module.exports = app;
