const express = require('express');
const router = express.Router();
const DatabaseManager = require('../nodejs/db.js');
const auth = require('../nodejs/auth.js')
require('dotenv').config();

const adminDB = new DatabaseManager({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN,
    password: process.env.DB_ADMINPASS,
    database: process.env.DB_DATABASE
});

router.get('/', auth.isAdmin, function(req, res, next){
    res.render('admin', {
        title: 'admin', 
        link: '/logout',
        linktext: '로그아웃',
        user: req.user.name
    });
});

router.get('/get/users', auth.isAdmin, async function(req, res, next){
    const users = await adminDB.getUserData();
    res.send(users);
});

router.post('/change/users/auth', auth.isAdmin, async function(req, res, next){
    await adminDB.updateUserAuth(req.body.authValue, req.body.userlist.join(','));
    const users = await adminDB.getUserData();
    res.send(users);
})

module.exports = router;