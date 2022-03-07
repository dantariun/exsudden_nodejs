const express = require('express');
const router = express.Router();
const httpStatus = require('http-status-codes');
const passport = require('passport');
const {isNotLoggedIn, isLoggedIn} = require('../middlewares');

const { SsoController } = require("../../server/controller");


// 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {  
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        console.error('authError', authError);
        return next(authError);
      }
      if (!user) {
        console.error('!user', info.message );
        return next();
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error('loginError', loginError);
          return next(loginError);
        }

        res.status(httpStatus.StatusCodes.OK)
            .json(user);
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  });

// 로그아웃
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('logout');
});

// sso 검증
router.post('/sso/checkauth', SsoController.ssoCheckAuth)

// sso 인증성공
router.post('/sso/login_proc', (req, res) =>{

})

// sso 로그아웃
router.get('/sso/logout', isLoggedIn, SsoController.ssoLogout)

// sso 개별 로그인
router.post('/sso/login', (req, res) =>{

})

module.exports = router;
