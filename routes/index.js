const express = require('express');
const router = express.Router();
const session = require('express-session');
const auth = require('../nodejs/auth.js');
const passport = require('passport');
require('dotenv').config();

router.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 1000* 60 * 60
    },
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());
auth.setPassport();

router.get('/', function(req, res, next) {
  if(req.user){
    res.render('board', {
      title: 'TODO LIST',
      link: '/logout',
      linktext: '로그아웃',
      user: req.user.name,
      board_id: req.user['board_id']
    });
  }else{
    res.render('index', {
      title: 'TODO LIST',
      link: '/login',
      linktext: '로그인'
    });
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', {
      title: 'LOGIN', 
      link: '/',
      linktext: '홈으로'
  });
}); 

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login'
}), auth.isAdmin, (req, res, next) => {
  res.redirect('/admin');
});

router.get('/logout', function(req, res, next){
  req.logout();
  req.session.save(function(err){
    res.redirect('/');
  })
})

module.exports = router;
