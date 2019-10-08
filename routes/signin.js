const express = require('express');
const router = express.Router();
const UserDatabaseManager = require('../db_models/user_table.js');
const BoardDatabaseManager = require('../db_models/board_table.js');
require('dotenv').config();

const userDB = new UserDatabaseManager({
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
    const boardDB = new BoardDatabaseManager({
        host: process.env.DB_HOST,
        user: process.env.DB_ADMIN,
        password: process.env.DB_ADMINPASS,
        database: process.env.DB_DATABASE
    });

    const result = await userDB.insertUser(body.userid, body.password, body.name);   
    if(result.affectedRows){
        const result = await boardDB.addBoard(body.userid);
        if(result.affectedRows){
            res.send(JSON.stringify({
                result: 'success'
            }));
            return true;
        }
    }

    res.send(JSON.stringify({
        result: 'fail'
    }));
})

module.exports = router;