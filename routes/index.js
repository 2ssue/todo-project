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

/* GET home page. */
router.get('/', function(req, res, next) {
  let renderData = {
    title: 'Todo',
    link: '/login',
    linktext: '로그인'
  };

  if(req.user){
    renderData.user = req.user.name;
    renderData.link = '/logout';
    renderData.linktext = '로그아웃';
  }

  res.render('index', renderData);
});

router.get('/login', function(req, res, next) {
  res.render('login', {
      title: 'Login', 
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
