const express = require('express');
const router = express.Router();
const DatabaseManager = require('../nodejs/user_table.js');
const auth = require('../nodejs/auth.js')
require('dotenv').config();

const adminDB = new DatabaseManager({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN,
    password: process.env.DB_ADMINPASS,
    database: process.env.DB_DATABASE
});

router.get('/', function(req, res, next){
    res.render('signin', {
        title: 'SIGN IN',
        link: '/',
        linktext: '홈으로' 
    });
});

router.post('/', async function(req, res, next){
    const body = req.body;
    const result = await adminDB.insertUser(body.userid, body.password, body.name);
    
    if(result.affectedRows){
        res.send(JSON.stringify({
            result: 'success'
        }));
    }else{
        res.send(JSON.stringify({
            result: 'fail'
        }));
    }
})

module.exports = router;