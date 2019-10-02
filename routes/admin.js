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

module.exports = router;