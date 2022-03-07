const express = require('express');
const router = express.Router();
const path = require("path");
const {isNotLoggedIn, isLoggedIn, loginChk} = require('./middlewares');

/** URL **/
const setRouter = require("./set");
const eventRouter = require("./event")
const statsRouter = require("./statistical");
const authRouter = require("./auth")
const dashboardRouter = require("./dashboard")
const cctvRouter = require('./cctv');  //cctv
const historyRouter = require("./history")

router.use("/api/auth", authRouter); // 계정(로그인, 로그아웃)

router.use("/api/auth/login",loginChk,(req,res,next)=>{
   next()
})

router.use("/api/*",isLoggedIn,(req,res,next)=>{
   next()   
})

router.use("/api/event", eventRouter);  // 이벤트
router.use("/api/set",setRouter);   // 설정
router.use("/api/stats", statsRouter); // 통계

router.use("/api/dashboard", dashboardRouter); // 계정(로그인, 로그아웃)
router.use("/api/cctv", cctvRouter);
router.use("/api/history",historyRouter); // 이력


// router.get('/sso/idpwLogin', function(req, res, next) {
//    res.render('idpwLogin', { ...agentinfo  });   
// });
// router.get('/sso/logout', function(req, res, next) {
//    res.render('logout', { ...agentinfo  });   
// });

/* GET home page. */
router.get('/*', function(req, res, next) {
   //res.render('index', { title: 'Express' });   
   res.sendFile(path.join(__dirname,"../public","index.html"));
});

module.exports = router;
