var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var routes = require("./routes");
var passport = require("passport");
var session = require("express-session");
const ejs = require('ejs');

//var LocalStrategy =  require("passport-local").Strategy;

require("dotenv").config();

var sequelize = require('./models').sequelize;    // sequeliize


const passportConfig = require('./passport')

passportConfig();
// 브라우저의 헤더에서 개발정보 출력 안하게끔하는 것.....
//app.disable("x-powered-by");

var app = express();
app.set('port', process.env.PORT || 3000);

sequelize
  .sync()
  .then(() => {
    console.log('DB 연결 성공');
  })
  .catch(err => {
    console.log('연결 실패');
    console.log(err);
  });

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// app.set("etag", false);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 1, // 쿠키 지속 시간 1시간
    httpOnly: true,
    secure: false,
  },
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session())

process.on("uncaughtException",function(err){
  console.log('uncaughtException 발생 :', + err);
})
// 라우터 
app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("****** 서버에러발생********")
  console.log(err.message);
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; 
  
  // render the error page  
  res.status(err.status || 500)
  res.json({"message":err.message});
  //res.render("error")
});

module.exports = app;
