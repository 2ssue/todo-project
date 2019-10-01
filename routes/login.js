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
    resave: true,
    saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());
auth.setPassport();

router.get('/', function(req, res, next) {
    res.render('login');
}); 

router.post('/', passport.authenticate('local', {
    failureRedirect: '/login'
}), auth.isAdmin, (req, res) => {
    res.redirect('/admin');
}) 

module.exports = router;
